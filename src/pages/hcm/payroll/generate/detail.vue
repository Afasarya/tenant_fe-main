<template>
  <div class="card container-fluid p-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4>Detail Payroll</h4>
      <div>
        <button type="button" class="btn btn-secondary" @click="goBack">Kembali</button>
      </div>
    </div>
    
    <Loader v-if="loading" />
    <div v-else>
      <!-- Informasi payroll -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Informasi Payroll</h5>
              <div class="mb-2">
                <strong>Periode:</strong> {{ formatPeriod(payroll.payroll_draft_month, payroll.payroll_draft_year) }}
              </div>
              <div class="mb-2">
                <strong>Template:</strong> {{ payroll.template_name || 'N/A' }}
              </div>
              <div class="mb-2">
                <strong>Status:</strong>
                <span class="badge ms-2" :class="getStatusClass(payroll.status)">
                  {{ getStatusLabel(payroll.status) }}
                </span>
              </div>
              <div class="mb-2">
                <strong>Total Gaji:</strong> {{ formatCurrency(payroll.total_amount) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabel daftar karyawan -->
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>NIP</th>
              <th>Nama</th>
              <th>Jabatan</th>
              <th>Departemen</th>
              <th>Gaji Pokok</th>
              <th>Tunjangan</th>
              <th>Potongan</th>
              <th>Total Gaji</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.id">
              <td>{{ employee.employee_number }}</td>
              <td>{{ employee.name }}</td>
              <td>{{ employee.position }}</td>
              <td>{{ employee.department }}</td>
              <td>{{ formatCurrency(employee.base_salary) }}</td>
              <td>{{ formatCurrency(employee.total_allowances) }}</td>
              <td>{{ formatCurrency(employee.total_deductions) }}</td>
              <td><strong>{{ formatCurrency(employee.net_salary) }}</strong></td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="7" class="text-end fw-bold">Total:</td>
              <td class="fw-bold">{{ formatCurrency(totalAmount) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { defineAsyncComponent } from 'vue';
import { showErrorToast } from '@/composables/toast';
import useAxios from '@/composables/axios';

const Loader = defineAsyncComponent(() => import('@/components/common/Loader.vue'));

const router = useRouter();
const route = useRoute();
const { get } = useAxios();

// State
const loading = ref(true);
const payroll = ref<any>({});
const employees = ref<any[]>([]);

// Computed
const totalAmount = computed(() => {
  return employees.value.reduce((sum, emp) => sum + Number(emp.net_salary), 0);
});

// Metode
const fetchPayrollDetails = async () => {
  const id = route.params.id;
  
  try {
    loading.value = true;
    
    // Fetch payroll data
    const { data, success } = await get(`/payroll_draft_month/show/${id}`);
    
    if (success && data) {
      // Set payroll data
      payroll.value = {
        id: data.id,
        payroll_draft_month: data.payroll_draft_month,
        payroll_draft_year: data.payroll_draft_year,
        template_name: data.payroll_component_template?.name || 'N/A',
        status: data.status || 'draft',
        total_amount: data.total_amount || 0
      };
      
      // Fetch employee details
      const { data: empData, success: empSuccess } = await get('/payroll_draft', {
        params: { payroll_draft_month_id: id }
      });
      
      if (empSuccess && empData?.data) {
        employees.value = empData.data.map((item: any) => {
          const employee = item.employee || {};
          
          return {
            id: item.id,
            employee_number: employee.employee_number || '-',
            name: employee.name || 'Unknown Employee',
            position: employee.position_name || '-',
            department: employee.department_name || '-',
            base_salary: Number(item.base_salary) || 0,
            total_allowances: Number(item.total_allowances) || 0,
            total_deductions: Number(item.total_deductions) || 0,
            net_salary: Number(item.net_salary) || 0
          };
        });
      }
    }
  } catch (error) {
    showErrorToast('Terjadi kesalahan saat mengambil detail payroll');
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'PayrollList' });
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

// Initialize
onMounted(() => {
  fetchPayrollDetails();
});
</script>