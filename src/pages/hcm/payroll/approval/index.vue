<template>
  <div>
    <Breadcrumbs title="Approval Payroll" :breadcrumbs="breadCrumbs" />
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <h5>Daftar Approval Payroll</h5>
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
                        <tr v-for="(payroll, index) in payrolls" :key="payroll.id">
                          <td>{{ index + 1 }}</td>
                          <td>{{ formatDate(payroll.period) }}</td>
                          <td>{{ payroll.template_name }}</td>
                          <td>{{ payroll.total_employees }}</td>
                          <td>Rp {{ formatNumber(payroll.total_amount) }}</td>
                          <td>
                            <span
                              :class="{
                                badge: true,
                                'badge-success': payroll.status === 'approved',
                                'badge-warning': payroll.status === 'pending',
                                'badge-danger': payroll.status === 'rejected',
                                'badge-primary': payroll.status === 'draft',
                              }"
                            >
                              {{ formatStatus(payroll.status) }}
                            </span>
                          </td>
                          <td>
                            <div class="btn-group">
                              <button
                                class="btn btn-info btn-sm"
                                @click="viewPayroll(payroll.id)"
                                title="Detail"
                              >
                                <i class="fa fa-eye"></i>
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
import { showErrorToast } from "@/composables/toast";
import { formatDate as formatDateUtil, formatCurrency } from "@/composables/dateFormatter";

export default defineComponent({
  name: "ApprovalPayroll",
  components: {
    Breadcrumbs,
  },
  setup() {
    const router = useRouter();
    const loading = ref(false);
    const { get } = useAxios();
    
    interface Payroll {
      id: string;
      period: string;
      template_name: string;
      total_employees: number;
      total_amount: number;
      status: string;
    }
    const payrolls = ref<Payroll[]>([]);

    const breadCrumbs = computed(() => {
      return [
        { title: "HCM", to: { name: "HCM" } },
        { title: "Payroll", to: { name: "Payroll" } },
        { title: "Approval", active: true }
      ];
    });

    const fetchPayrolls = async () => {
      loading.value = true;
      try {
        // Using the appropriate payroll approval endpoint from the Postman collection
        const { data, success, message } = await get("/payroll_draft/approval", {
          params: {
            status: "pending",
            page: 1,
            per_page: 100
          }
        });
        
        if (success && data) {
          payrolls.value = (data.data || []).map((item: any) => {
            return {
              id: item.id,
              period: item.period || item.date || "-",
              template_name: item.template_name || "Template Standar",
              total_employees: item.total_employees || item.employee_count || 0,
              total_amount: item.total_amount || item.total || 0,
              status: item.status || "pending"
            };
          });
        } else {
          showErrorToast(message || "Gagal mengambil data payroll");
          payrolls.value = [];
        }
      } catch (error) {
        console.error("Error fetching payrolls:", error);
        showErrorToast("Terjadi kesalahan saat mengambil data payroll.");
        payrolls.value = [];
      } finally {
        loading.value = false;
      }
    };

    const viewPayroll = (id: string) => {
      router.push({ name: "DetailApprovalPayroll", params: { id } });
    };

    const formatDate = (dateString: string) => {
      return formatDateUtil(dateString);
    };

    const formatNumber = (number: number) => {
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
          return status;
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
      formatDate,
      formatNumber,
      formatStatus,
    };
  },
});
</script>