<template>
  <div class="card container-fluid px-4 card-custom">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">Daftar Payroll</h4>
      <!-- Perbaikan button generate payroll -->
      <button 
        type="button" 
        class="btn btn-primary" 
        @click.prevent="generatePayroll"
        :disabled="loading"
      >
        Generate Payroll Baru
      </button>
    </div>

    <div v-if="loading" class="text-center my-5">
      <Loader />
    </div>
    <div v-else>
      <!-- Tab untuk status payroll -->
      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <a 
            class="nav-link" 
            :class="{ active: activeTab === 'all' }" 
            href="#"
            @click.prevent="filterByStatus('all')"
          >
            Semua
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link" 
            :class="{ active: activeTab === 'draft' }" 
            href="#"
            @click.prevent="filterByStatus('draft')"
          >
            Draft
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link" 
            :class="{ active: activeTab === 'pending' }" 
            href="#"
            @click.prevent="filterByStatus('pending')"
          >
            Pending
          </a>
        </li>
        <li class="nav-item">
          <a 
            class="nav-link" 
            :class="{ active: activeTab === 'approved' }" 
            href="#"
            @click.prevent="filterByStatus('approved')"
          >
            Disetujui
          </a>
        </li>
      </ul>

      <!-- Tabel daftar payroll -->
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Periode</th>
              <th>Template</th>
              <th>Jumlah Karyawan</th>
              <th>Total Gaji</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredPayrolls.length === 0">
              <td colspan="6" class="text-center py-3">Tidak ada data payroll</td>
            </tr>
            <tr v-for="payroll in filteredPayrolls" :key="payroll.id">
              <td>{{ formatPeriod(payroll.payroll_draft_month, payroll.payroll_draft_year) }}</td>
              <td>{{ payroll.template_name || 'N/A' }}</td>
              <td>{{ payroll.employee_count || 0 }}</td>
              <td>{{ formatCurrency(payroll.total_amount) }}</td>
              <td>
                <span 
                  class="badge" 
                  :class="{
                    'bg-secondary': payroll.status === 'draft',
                    'bg-warning': payroll.status === 'pending',
                    'bg-success': payroll.status === 'approved'
                  }"
                >
                  {{ getStatusLabel(payroll.status) }}
                </span>
              </td>
              <td>
                <div class="btn-group">
                  <button 
                    type="button"
                    class="btn btn-info btn-sm" 
                    @click="viewPayroll(payroll.id)"
                    title="Lihat detail"
                  >
                    <i class="fa fa-eye"></i>
                  </button>
                  
                  <!-- Only show edit button if not approved -->
                  <button 
                    v-if="payroll.status !== 'approved'"
                    type="button"
                    class="btn btn-warning btn-sm" 
                    @click="editPayroll(payroll.id)"
                    title="Edit payroll"
                  >
                    <i class="fa fa-edit"></i>
                  </button>
                  
                  <!-- Only show submit button if draft -->
                  <button
                    v-if="payroll.status === 'draft'"
                    class="btn btn-primary btn-sm"
                    @click="submitForApproval(payroll.id)"
                    title="Ajukan persetujuan"
                  >
                    <i class="fa fa-paper-plane"></i>
                  </button>

                  <!-- Only show delete button if not approved -->
                  <button 
                    v-if="payroll.status !== 'approved'"
                    class="btn btn-danger btn-sm" 
                    @click="deletePayroll(payroll.id)"
                    title="Hapus payroll"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="d-flex justify-content-center mt-4">
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page - 1)">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li 
              v-for="page in getPageNumbers()" 
              :key="page" 
              class="page-item"
              :class="{ active: pagination.current_page === page }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
              <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page + 1)">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { defineAsyncComponent } from 'vue';
import { showSuccessToast, showErrorToast } from '@/composables/toast';
import useAxios from '@/composables/axios';
import dayjs from 'dayjs';

const Loader = defineAsyncComponent(() => import('@/components/common/Loader.vue'));

const router = useRouter();
const { get, post, put, remove } = useAxios();

// State
const loading = ref(false);
const payrolls = ref<any[]>([]);
const activeTab = ref('all');

// Pagination
const pagination = ref({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1
});

// Computed for filtered payrolls
const filteredPayrolls = computed(() => {
  if (activeTab.value === 'all') {
    return payrolls.value;
  }
  return payrolls.value.filter(p => p.status === activeTab.value);
});

// Methods for fetching data
const fetchPayrolls = async () => {
  loading.value = true;
  try {
    console.log("Fetching payroll data...");
    const response = await get('/payroll_draft_month', {
      params: {
        page: pagination.value.current_page,
        per_page: pagination.value.per_page
      }
    });
    
    console.log("API response:", response);
    
    if (response && response.success) {
      const data = response.data;
      payrolls.value = data?.data?.map((item: any) => ({
        id: item.id,
        payroll_draft_month: item.payroll_draft_month,
        payroll_draft_year: item.payroll_draft_year,
        template_name: item.payroll_component_template?.name || 'N/A',
        employee_count: item.payroll_drafts?.length || 0,
        total_amount: item.total_amount || 0,
        status: item.status || 'draft'
      })) || [];
      
      pagination.value = {
        current_page: data.current_page,
        per_page: data.per_page,
        total: data.total,
        last_page: data.last_page
      };
    } else {
      showErrorToast(response?.message || 'Gagal memuat daftar payroll');
    }
  } catch (error) {
    console.error('Error fetching payrolls:', error);
    showErrorToast('Terjadi kesalahan saat memuat daftar payroll');
  } finally {
    loading.value = false;
  }
};

const changePage = (page: number) => {
  if (page < 1 || page > pagination.value.last_page) return;
  pagination.value.current_page = page;
  fetchPayrolls();
};

// Actions
const generatePayroll = () => {
  console.log("Generate Payroll button clicked");
  try {
    router.push({ name: "GeneratePayrollForm" });  // Use the route name for more stability
  } catch (error) {
    console.error("Navigation error:", error);
    showErrorToast("Tidak dapat membuka halaman Generate Payroll");
  }
};

const viewPayroll = (id: string) => {
  console.log("View payroll button clicked for ID:", id);
  try {
    router.push({ path: `/hcm/payroll/detail/${id}` });
  } catch (error) {
    console.error("Navigation error:", error);
    showErrorToast("Tidak dapat membuka halaman detail");
  }
};

const editPayroll = (id: string) => {
  console.log("Edit payroll button clicked for ID:", id);
  try {
    router.push({ path: `/hcm/payroll/edit/${id}` });
  } catch (error) {
    console.error("Navigation error:", error);
    showErrorToast("Tidak dapat membuka halaman edit");
  }
};

const submitForApproval = async (id: string) => {
  try {
    const { success, message } = await put(`/payroll_draft_month/update/${id}`, {
      status: 'pending'
    });
    
    if (success) {
      showSuccessToast('Payroll berhasil diajukan untuk persetujuan');
      fetchPayrolls(); // Refresh the list
    } else {
      showErrorToast(message || 'Gagal mengajukan payroll untuk persetujuan');
    }
  } catch (error) {
    console.error('Error submitting payroll for approval:', error);
    showErrorToast('Terjadi kesalahan saat mengajukan payroll');
  }
};

const deletePayroll = async (id: string) => {
  if (!confirm('Apakah Anda yakin ingin menghapus payroll ini?')) return;
  
  try {
    const { success, message } = await remove(`/payroll_draft_month/delete/${id}`);
    
    if (success) {
      showSuccessToast('Payroll berhasil dihapus');
      fetchPayrolls(); // Refresh the list
    } else {
      showErrorToast(message || 'Gagal menghapus payroll');
    }
  } catch (error) {
    console.error('Error deleting payroll:', error);
    showErrorToast('Terjadi kesalahan saat menghapus payroll');
  }
};

// Filter methods
const filterByStatus = (status: string) => {
  activeTab.value = status;
};

// Utility methods
const formatPeriod = (month: string, year: string) => {
  if (!month || !year) return 'N/A';
  
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const monthIndex = parseInt(month) - 1;
  return `${monthNames[monthIndex]} ${year}`;
};

const formatCurrency = (value: number) => {
  if (!value && value !== 0) return 'Rp 0';
  return `Rp ${value.toLocaleString('id-ID')}`;
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'draft': return 'Draft';
    case 'pending': return 'Menunggu Persetujuan';
    case 'approved': return 'Disetujui';
    default: return status;
  }
};

const getPageNumbers = () => {
  const total = pagination.value.last_page;
  const current = pagination.value.current_page;
  const pages = [];
  
  const maxPages = 5;
  const halfMaxPages = Math.floor(maxPages / 2);
  
  let startPage = Math.max(current - halfMaxPages, 1);
  let endPage = Math.min(startPage + maxPages - 1, total);
  
  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(endPage - maxPages + 1, 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
};

// Initialize
onMounted(() => {
  fetchPayrolls();
});
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}
</style>