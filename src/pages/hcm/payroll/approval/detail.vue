<template>
  <div>
    <Breadcrumbs title="Detail Approval Payroll" :breadcrumbs="breadCrumbs" />
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <h5>Detail Approval Payroll</h5>
            </div>
            <div class="card-body">
              <div v-if="loading" class="d-flex justify-content-center">
                <Loader />
              </div>
              <div v-else>
                <div class="row mb-4">
                  <div class="col-md-6">
                    <table class="table table-borderless">
                      <tr>
                        <th>Periode:</th>
                        <td>{{ formatDate(payrollDetail.period) }}</td>
                      </tr>
                      <tr>
                        <th>Template:</th>
                        <td>{{ payrollDetail.template_name }}</td>
                      </tr>
                      <tr>
                        <th>Status:</th>
                        <td>
                          <span
                            :class="{
                              badge: true,
                              'badge-success': payrollDetail.status === 'approved',
                              'badge-warning': payrollDetail.status === 'pending',
                              'badge-danger': payrollDetail.status === 'rejected',
                              'badge-primary': payrollDetail.status === 'draft',
                            }"
                          >
                            {{ formatStatus(payrollDetail.status) }}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div class="col-md-6">
                    <table class="table table-borderless">
                      <tr>
                        <th>Total Karyawan:</th>
                        <td>{{ payrollItems.length }} orang</td>
                      </tr>
                      <tr>
                        <th>Total Gaji:</th>
                        <td>Rp {{ formatNumber(payrollDetail.total_amount) }}</td>
                      </tr>
                      <tr>
                        <th>Tanggal Dibuat:</th>
                        <td>{{ formatDate(payrollDetail.created_at) }}</td>
                      </tr>
                    </table>
                  </div>
                </div>

                <div class="table-responsive">
                  <Table
                    v-bind="tableConfig"
                    @view="viewDetail"
                  />
                </div>

                <div class="form-group mt-4">
                  <label for="notes">Catatan Approval:</label>
                  <textarea
                    id="notes"
                    class="form-control"
                    rows="3"
                    v-model="notes"
                    :disabled="payrollDetail.status !== 'pending'"
                  ></textarea>
                </div>

                <div class="d-flex justify-content-end mt-3">
                  <button
                    type="button"
                    class="btn btn-secondary mr-2"
                    @click="goBack"
                  >
                    Kembali
                  </button>
                  <template v-if="payrollDetail.status === 'pending'">
                    <button
                      type="button"
                      class="btn btn-danger mr-2"
                      @click="rejectPayroll"
                      :disabled="submitting"
                    >
                      <i class="fa fa-times-circle mr-1"></i> Tolak
                    </button>
                    <button
                      type="button"
                      class="btn btn-success"
                      @click="approvePayroll"
                      :disabled="submitting"
                    >
                      <i class="fa fa-check-circle mr-1"></i> Setujui
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <Modal
      :is-open="showModal"
      :title="`Detail Gaji ${selectedItem?.name || ''}`"
      :is-loading="false"
      @close="closeDetailModal"
    >
      <template #content>
        <div v-if="selectedItem" class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label>NIP:</label>
              <p class="font-weight-bold">{{ selectedItem.employee_id }}</p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label>Departemen:</label>
              <p class="font-weight-bold">{{ selectedItem.department }}</p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label>Jabatan:</label>
              <p class="font-weight-bold">{{ selectedItem.position }}</p>
            </div>
          </div>
          
          <div class="col-md-12">
            <h6 class="mt-3">Gaji Pokok</h6>
            <div class="table-responsive">
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <th>Gaji Pokok</th>
                    <td class="text-right">Rp {{ formatNumber(selectedItem.basic_salary) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="col-md-12">
            <h6 class="mt-3">Tunjangan</h6>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Jenis Tunjangan</th>
                    <th class="text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(allowance, index) in selectedItem.allowances" :key="'a-' + index">
                    <td>{{ allowance.name }}</td>
                    <td class="text-right">Rp {{ formatNumber(allowance.amount) }}</td>
                  </tr>
                  <tr v-if="selectedItem.allowances.length === 0">
                    <td colspan="2" class="text-center">Tidak ada tunjangan</td>
                  </tr>
                  <tr>
                    <th>Total Tunjangan</th>
                    <th class="text-right">Rp {{ formatNumber(selectedItem.total_allowance) }}</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="col-md-12">
            <h6 class="mt-3">Potongan</h6>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Jenis Potongan</th>
                    <th class="text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(deduction, index) in selectedItem.deductions" :key="'d-' + index">
                    <td>{{ deduction.name }}</td>
                    <td class="text-right">Rp {{ formatNumber(deduction.amount) }}</td>
                  </tr>
                  <tr v-if="selectedItem.deductions.length === 0">
                    <td colspan="2" class="text-center">Tidak ada potongan</td>
                  </tr>
                  <tr>
                    <th>Total Potongan</th>
                    <th class="text-right">Rp {{ formatNumber(selectedItem.total_deduction) }}</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="col-md-12">
            <h6 class="mt-4">Total Gaji Bersih</h6>
            <div class="alert alert-info">
              <div class="d-flex justify-content-between">
                <strong>Total Gaji:</strong>
                <strong>Rp {{ formatNumber(selectedItem.net_salary) }}</strong>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import useAxios from "@/composables/axios";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import Swal from "sweetalert2";

const Loader = defineAsyncComponent(() => import("@/components/common/Loader.vue"));
const Table = defineAsyncComponent(() => import("@/components/common/Table.vue"));
const Modal = defineAsyncComponent(() => import("@/components/common/Modal.vue"));

const router = useRouter();
const route = useRoute();
const { get, put } = useAxios();

interface PayrollItem {
  id?: string;
  employee_id: string;
  name: string;
  department: string;
  position: string;
  basic_salary: number;
  allowances: Array<{name: string, amount: number}>;
  deductions: Array<{name: string, amount: number}>;
  total_allowance: number;
  total_deduction: number;
  net_salary: number;
}

const loading = ref(false);
const submitting = ref(false);
const payrollDetail = ref<any>({});
const payrollItems = ref<PayrollItem[]>([]);
const selectedItem = ref<PayrollItem | null>(null);
const notes = ref("");
const showModal = ref(false);

const payrollId = computed(() => {
  return route.params.id;
});

const breadCrumbs = computed(() => {
  return [
    { title: "HCM", to: { name: "HCM" } },
    { title: "Payroll", to: { name: "Payroll" } },
    { title: "Approval", to: { name: "ApprovalPayroll" } },
    { title: "Detail", active: true },
  ];
});

const tableConfig = computed(() => {
  return {
    columns: {
      employee_id: { label: "NIP" },
      name: { label: "Nama" },
      department: { label: "Departemen" },
      position: { label: "Jabatan" },
      basic_salary: { label: "Gaji Pokok", align: "end", format: "currency" },
      total_allowance: { label: "Tunjangan", align: "end", format: "currency" },
      total_deduction: { label: "Potongan", align: "end", format: "currency" },
      net_salary: { label: "Total Gaji", align: "end", format: "currency" },
    },
    items: payrollItems.value,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canView: true,
    buttonName: "",
  };
});

const fetchPayrollDetail = async () => {
  if (!payrollId.value) {
    router.push({ name: "ApprovalPayroll" });
    return;
  }
  
  loading.value = true;
  
  try {
    // Using the proper API endpoint for payroll approval details
    const response = await get(`/payroll_draft/show/${payrollId.value}`);
    if (response.success) {
      const data = response.data;
      
      payrollDetail.value = {
        id: data.id,
        template_name: data.template_name || "Template Payroll",
        period: data.period || data.date || "",
        status: data.status || "pending",
        total_amount: data.total_amount || 0,
        created_at: data.created_at,
        notes: data.notes,
      };
      
      // Transform employee items data to handle various API response structures
      payrollItems.value = (data.items || data.details || []).map((detail: any) => {
        return {
          id: detail.id || detail.employee_id,
          employee_id: detail.employee_id || detail.id || "",
          name: detail.employee_name || detail.name || "",
          department: detail.department_name || detail.department || "-",
          position: detail.position_name || detail.position || "-",
          basic_salary: Number(detail.basic_salary || 0),
          allowances: detail.allowances || [],
          deductions: detail.deductions || [],
          total_allowance: Number(detail.total_allowance || 0),
          total_deduction: Number(detail.total_deduction || 0),
          net_salary: Number(detail.net_salary || detail.final_salary || 0)
        };
      });
      
      notes.value = data.notes || "";
      
    } else {
      showErrorToast(response.message || "Gagal mengambil detail payroll");
      router.push({ name: "ApprovalPayroll" });
    }
  } catch (error) {
    console.error("Error fetching payroll details:", error);
    showErrorToast("Terjadi kesalahan saat mengambil detail payroll");
    router.push({ name: "ApprovalPayroll" });
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push({ name: "ApprovalPayroll" });
};

const viewDetail = (id: string) => {
  selectedItem.value = payrollItems.value.find(item => item.id === id) || null;
  showModal.value = true;
};

const closeDetailModal = () => {
  showModal.value = false;
  selectedItem.value = null;
};

const approvePayroll = async () => {
  if (submitting.value) return;
  
  Swal.fire({
    title: 'Konfirmasi Persetujuan',
    text: 'Apakah Anda yakin ingin menyetujui payroll ini?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Setujui',
    cancelButtonText: 'Batal',
    confirmButtonColor: 'var(--theme-default)',
  }).then(async (result) => {
    if (result.isConfirmed) {
      submitting.value = true;
      
      try {
        // Changed to the proper approval endpoint format based on Postman collection
        const response = await put(`/payroll_draft/approve/${payrollId.value}`, {
          notes: notes.value,
        });
        
        if (response.success) {
          showSuccessToast(response.message || "Payroll berhasil disetujui");
          
          // Update local status
          payrollDetail.value.status = "approved";
          
          // Redirect back after short delay
          setTimeout(() => router.push({ name: "ApprovalPayroll" }), 1500);
        } else {
          showErrorToast(response.message || "Gagal menyetujui payroll");
        }
      } catch (error) {
        console.error("Error approving payroll:", error);
        showErrorToast("Terjadi kesalahan saat menyetujui payroll");
      } finally {
        submitting.value = false;
      }
    }
  });
};

const rejectPayroll = async () => {
  if (submitting.value) return;
  
  if (!notes.value.trim()) {
    showErrorToast("Harap isi catatan alasan penolakan");
    return;
  }
  
  Swal.fire({
    title: 'Konfirmasi Penolakan',
    text: 'Apakah Anda yakin ingin menolak payroll ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Tolak',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#dc3545',
  }).then(async (result) => {
    if (result.isConfirmed) {
      submitting.value = true;
      
      try {
        // Changed to the proper rejection endpoint format based on Postman collection
        const response = await put(`/payroll_draft/reject/${payrollId.value}`, {
          notes: notes.value,
        });
        
        if (response.success) {
          showSuccessToast(response.message || "Payroll telah ditolak");
          
          // Update local status
          payrollDetail.value.status = "rejected";
          
          // Redirect back after short delay
          setTimeout(() => router.push({ name: "ApprovalPayroll" }), 1500);
        } else {
          showErrorToast(response.message || "Gagal menolak payroll");
        }
      } catch (error) {
        console.error("Error rejecting payroll:", error);
        showErrorToast("Terjadi kesalahan saat menolak payroll");
      } finally {
        submitting.value = false;
      }
    }
  });
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("id-ID", options);
};

const formatNumber = (number: number) => {
  if (!number && number !== 0) return "-";
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const formatStatus = (status: string) => {
  switch (status) {
    case "pending":
      return "Menunggu";
    case "approved":
      return "Disetujui";
    case "rejected":
      return "Ditolak";
    case "draft":
      return "Draft";
    default:
      return status;
  }
};

onMounted(() => {
  fetchPayrollDetail();
});
</script>