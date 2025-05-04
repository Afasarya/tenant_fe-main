<template>
  <div>
    <Breadcrumbs title="Generate Payroll" :breadcrumbs="breadCrumbs" />
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <h5>Daftar Payroll</h5>
              <div class="card-header-right">
                <router-link
                  class="btn btn-primary"
                  :to="{ name: 'GeneratePayrollForm' }"
                >
                  <i class="fa fa-plus"></i> Generate Payroll
                </router-link>
              </div>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-12">
                  <div v-if="loading" class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                  <div v-else class="table-responsive">
                    <table class="display datatable-custom table">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Periode</th>
                          <th>Template</th>
                          <th>Total Pegawai</th>
                          <th>Total Gaji</th>
                          <th>Status</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="payrolls.length <= 0">
                          <td colspan="7" class="text-center">Tidak ada data</td>
                        </tr>
                        <tr v-for="(payroll, index) in payrolls" :key="payroll?.id || index">
                          <td>{{ index + 1 }}</td>
                          <td>{{ formatDate(payroll?.period || "") }}</td>
                          <td>{{ payroll?.template_name }}</td>
                          <td>{{ payroll?.total_employees }}</td>
                          <td>Rp {{ formatNumber(payroll?.total_amount ?? 0) }}</td>
                          <td>
                            <span
                              :class="{
                                badge: true,
                                'badge-success': payroll?.status === 'approved',
                                'badge-warning': payroll?.status === 'pending',
                                'badge-danger': payroll?.status === 'rejected',
                                'badge-primary': payroll?.status === 'draft',
                              }"
                            >
                              {{ formatStatus(payroll?.status ?? "") }}
                            </span>
                          </td>
                          <td>
                            <div class="btn-group">
                              <button
                                class="btn btn-info btn-sm mr-1"
                                @click="viewPayroll(String(payroll?.id))"
                                title="Detail"
                                v-if="payroll?.id"
                              >
                                <i class="fa fa-eye"></i>
                              </button>
                              <button
                                class="btn btn-warning btn-sm mr-1"
                                @click="editPayroll(String(payroll?.id))"
                                title="Edit"
                                v-if="payroll?.status === 'draft' && payroll?.id"
                              >
                                <i class="fa fa-edit"></i>
                              </button>
                              <button
                                class="btn btn-danger btn-sm"
                                @click="confirmDelete(String(payroll?.id))"
                                title="Hapus"
                                v-if="payroll?.status === 'draft' && payroll?.id"
                              >
                                <i class="fa fa-trash"></i>
                              </button>
                              <button
                                class="btn btn-success btn-sm"
                                @click="printSlip(String(payroll?.id))"
                                title="Cetak Slip"
                                v-if="payroll?.status === 'approved' && payroll?.id"
                              >
                                <i class="fa fa-print"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import Breadcrumbs from "@/layout/BreadCrumbs.vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import { formatDate as formatDateUtil, formatCurrency } from "@/composables/dateFormatter";

export default defineComponent({
  name: "GeneratePayroll",
  components: {
    Breadcrumbs,
  },
  setup() {
    const router = useRouter();
    const { get, remove } = useAxios();
    const loading = ref(false);
    const payrolls = ref<Array<{
      id?: string | number;
      period?: string;
      template_name?: string;
      total_employees?: number;
      total_amount?: number;
      status?: string;
    }>>([]);

    const breadCrumbs = computed(() => {
      return [
        { title: "HCM", to: { name: "HCM" } },
        { title: "Payroll", to: { name: "Payroll" } },
        { title: "Generate", active: true }
      ];
    });

    const fetchPayrolls = async () => {
      loading.value = true;
      try {
        // Use the correct endpoint from the Payroll Draft Month section in Postman collection
        const response = await get("payroll_draft_month", {
          params: {
            page: 1,
            per_page: 100
          }
        });
        
        if (response && response.success) {
          payrolls.value = response.data?.data || [];
        } else {
          showErrorToast(response?.message || "Gagal mengambil data payroll");
          payrolls.value = [];
        }
      } catch (error) {
        console.error("Error fetching payrolls:", error);
        showErrorToast("Terjadi kesalahan saat mengambil data payroll");
        payrolls.value = [];
      } finally {
        loading.value = false;
      }
    };

    const viewPayroll = (id: string) => {
      router.push({ name: "GeneratePayrollForm", params: { id } });
    };

    const editPayroll = (id: string) => {
      router.push({ name: "GeneratePayrollForm", params: { id }, query: { edit: "true" } });
    };

    const confirmDelete = async (id: string) => {
      if (confirm("Apakah Anda yakin ingin menghapus payroll ini?")) {
        try {
          // Use the proper payroll draft deletion endpoint
          const response = await remove(`payroll_draft_month/delete/${id}`);
          if (response.success) {
            showSuccessToast(response.message || "Payroll berhasil dihapus");
            fetchPayrolls(); // Refresh the list after deletion
          } else {
            showErrorToast(response.message || "Gagal menghapus payroll");
          }
        } catch (error) {
          console.error("Error deleting payroll:", error);
          showErrorToast("Terjadi kesalahan saat menghapus payroll");
        }
      }
    };

    const printSlip = (id: string) => {
      router.push({ name: "PrintPayrollSlip", query: { payroll_id: id } });
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return "-";
      return formatDateUtil(dateString);
    };

    const formatNumber = (number: number) => {
      if (!number && number !== 0) return "0";
      return formatCurrency(number);
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
          return status || "-";
      }
    };

    onMounted(() => {
      fetchPayrolls();
    });

    return {
      breadCrumbs,
      loading,
      payrolls,
      viewPayroll,
      editPayroll,
      confirmDelete,
      printSlip,
      formatDate,
      formatNumber,
      formatStatus,
    };
  },
});
</script>