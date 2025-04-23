<template>
  <div>
    <Breadcrumbs title="Cetak Slip Gaji" :breadcrumbs="breadCrumbs" />
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <h5>Cetak Slip Gaji</h5>
            </div>
            <div class="card-body">
              <div class="row mb-4">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="period">Periode</label>
                    <select class="form-control" id="period" v-model="selectedPeriod" @change="fetchPayroll">
                      <option value="">Pilih Periode</option>
                      <option v-for="period in periods" :key="period.id" :value="period.id">
                        {{ formatDate(period.period) }} - {{ period.template_name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="employee">Pegawai</label>
                    <select
                      class="form-control"
                      id="employee"
                      v-model="selectedEmployee"
                      :disabled="!selectedPeriod"
                    >
                      <option value="">Pilih Pegawai</option>
                      <option value="all">Semua Pegawai</option>
                      <option
                        v-for="employee in employees"
                        :key="employee.id"
                        :value="employee.id"
                      >
                        {{ employee.name }} ({{ employee.employee_id }})
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="row mb-4">
                <div class="col-md-12 d-flex justify-content-end">
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="generateSlip"
                    :disabled="!canGenerateSlip || loading"
                  >
                    <i class="fa fa-print"></i> Cetak Slip Gaji
                  </button>
                </div>
              </div>

              <div v-if="loading" class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>

              <div v-if="previewData" class="card printable-area" id="printSection">
                <div class="card-body">
                  <div v-if="selectedEmployee === 'all'">
                    <div
                      v-for="(item, index) in payrollItems"
                      :key="item.id"
                      :class="{'page-break': index > 0}"
                      class="payslip-container"
                    >
                      <PayslipTemplate
                        :data="item"
                        :period="currentPeriod"
                        :company="companyData"
                      />
                    </div>
                  </div>
                  <div v-else>
                    <PayslipTemplate
                      v-if="selectedPayrollItem"
                      :data="selectedPayrollItem"
                      :period="currentPeriod"
                      :company="companyData"
                    />
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
import { defineComponent, ref, computed, onMounted } from "vue";
import Breadcrumbs from "@/layout/BreadCrumbs.vue";
import { useRouter } from "vue-router";
import axios from "@/plugins/axios";
import { useToast } from "@/composables/toast";
import PayslipTemplate from "./components/PayslipTemplate.vue";
import { formatDate as formatDateUtil } from "@/composables/dateFormatter";

interface PayrollItem {
  id: string;
  employee_id: string;
  name: string;
  department: string;
  position: string;
  basic_salary: number;
  total_allowance: number;
  total_deduction: number;
  net_salary: number;
  allowances: Array<{name: string, amount: number}>;
  deductions: Array<{name: string, amount: number}>;
}

interface EmployeeOption {
  id: string;
  name: string;
  employee_id: string;
}

interface PeriodOption {
  id: string;
  period: string;
  template_name: string;
  status: string;
}

interface CompanyData {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export default defineComponent({
  name: "PrintPayrollSlip",
  components: {
    Breadcrumbs,
    PayslipTemplate
  },
  setup() {
    const router = useRouter();
    const toast = useToast();
    
    const loading = ref(false);
    const periods = ref<PeriodOption[]>([]);
    const employees = ref<EmployeeOption[]>([]);
    const payrollItems = ref<PayrollItem[]>([]);
    const selectedPeriod = ref("");
    const selectedEmployee = ref("");
    const previewData = ref(false);
    const currentPeriod = ref("");
    
    const companyData = ref<CompanyData>({
      name: "PT. Manna Jaya",
      address: "Jl. Contoh No. 123, Jakarta",
      phone: "021-12345678",
      email: "info@mannajaya.com"
    });

    const breadCrumbs = computed(() => {
      return [
        { title: "HCM", to: { name: "HCM" } },
        { title: "Payroll", to: { name: "Payroll" } },
        { title: "Cetak Slip", active: true }
      ];
    });
    
    const selectedPayrollItem = computed(() => {
      if (selectedEmployee.value === 'all' || !selectedEmployee.value) return null;
      return payrollItems.value.find(item => item.id === selectedEmployee.value);
    });
    
    const canGenerateSlip = computed(() => {
      return selectedPeriod.value && selectedEmployee.value;
    });

    const fetchPeriods = async () => {
      try {
        loading.value = true;
        const response = await axios.get("/payroll/periods");
        if (response.data.success) {
          periods.value = (response.data.data || [])
            .filter((p: PeriodOption) => p.status === 'approved');
        } else {
          toast.error(response.data.message || "Gagal mengambil data periode");
        }
      } catch (error) {
        console.error("Error fetching periods:", error);
        toast.error("Terjadi kesalahan saat mengambil data periode payroll");
      } finally {
        loading.value = false;
      }
    };

    const fetchPayroll = async () => {
      if (!selectedPeriod.value) {
        employees.value = [];
        payrollItems.value = [];
        return;
      }
      
      try {
        loading.value = true;
        const response = await axios.get(`/payroll/show/${selectedPeriod.value}`);
        if (response.data.success) {
          const data = response.data.data;
          
          payrollItems.value = data.items || [];
          currentPeriod.value = formatDate(data.period);
          
          // Extract employees for dropdown
          employees.value = payrollItems.value.map(item => ({
            id: item.id || "",
            name: item.name || "",
            employee_id: item.employee_id || ""
          }));
        } else {
          toast.error(response.data.message || "Gagal mengambil data payroll");
        }
      } catch (error) {
        console.error("Error fetching payroll:", error);
        toast.error("Terjadi kesalahan saat mengambil data payroll");
      } finally {
        loading.value = false;
      }
    };

    const generateSlip = () => {
      if (!canGenerateSlip.value) return;
      
      previewData.value = true;
      
      // Use setTimeout to give Vue time to render the template
      setTimeout(() => {
        printPayslip();
      }, 500);
    };
    
    const printPayslip = () => {
      const printContents = document.getElementById('printSection')?.innerHTML;
      const originalContents = document.body.innerHTML;
      
      if (printContents) {
        document.body.innerHTML = `
          <html>
            <head>
              <title>Slip Gaji</title>
              <style>
                @media print {
                  body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                  }
                  .payslip-container {
                    padding: 20px;
                    margin-bottom: 20px;
                  }
                  .page-break {
                    page-break-before: always;
                  }
                  table {
                    width: 100%;
                    border-collapse: collapse;
                  }
                  table, th, td {
                    border: 1px solid #ddd;
                  }
                  th, td {
                    padding: 8px;
                    text-align: left;
                  }
                  th {
                    background-color: #f2f2f2;
                  }
                }
              </style>
            </head>
            <body>
              ${printContents}
            </body>
          </html>
        `;
        
        window.print();
        document.body.innerHTML = originalContents;
        
        // Reset the view
        previewData.value = false;
      }
    };
    
    const formatDate = (dateString: string) => {
      return formatDateUtil(dateString);
    };

    onMounted(() => {
      fetchPeriods();
    });

    return {
      breadCrumbs,
      loading,
      periods,
      employees,
      payrollItems,
      selectedPeriod,
      selectedEmployee,
      previewData,
      currentPeriod,
      companyData,
      selectedPayrollItem,
      canGenerateSlip,
      fetchPayroll,
      generateSlip,
      formatDate,
    };
  }
});
</script>

<style scoped>
.printable-area {
  display: none;
}
@media print {
  .printable-area {
    display: block;
  }
}
</style>