<template>
  <div>
    <Breadcrumbs title="Cetak Laporan Payroll" :breadcrumbs="breadCrumbs" />
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <h5>Cetak Laporan Payroll</h5>
            </div>
            <div class="card-body">
              <div class="row mb-4">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="period">Periode</label>
                    <BaseSelect
                      :disabled-input="loading"
                      error-message="Silahkan pilih periode"
                      :has-submitted="formSubmitted"
                      :options="periods"
                      :value="selectedPeriod"
                      @change="(val: any) => handleChangePeriod(val)"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="reportType">Jenis Laporan</label>
                    <BaseSelect
                      :disabled-input="loading"
                      error-message="Silahkan pilih jenis laporan"
                      :has-submitted="formSubmitted"
                      :options="reportTypeOptions"
                      :value="reportType"
                      @change="(val: any) => reportType = val?.id || 'summary'"
                    />
                  </div>
                </div>
              </div>

              <div class="row mb-4">
                <div class="col-md-12 d-flex justify-content-end">
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="generateReport"
                    :disabled="!selectedPeriod || loading"
                  >
                    <i class="fa fa-print"></i> Cetak Laporan
                  </button>
                </div>
              </div>

              <div v-if="loading" class="d-flex justify-content-center">
                <Loader />
              </div>

              <!-- Print Section -->
              <div v-if="previewData" class="printable-area" id="printSection">
                <div class="header text-center mb-4">
                  <h3>{{ companyData.name }}</h3>
                  <p class="mb-1">{{ companyData.address }}</p>
                  <p class="mb-3">{{ companyData.phone }} | {{ companyData.email }}</p>
                  <h4>LAPORAN PAYROLL</h4>
                  <p>Periode: {{ currentPeriod }}</p>
                </div>

                <!-- Summary Report -->
                <div v-if="reportType === 'summary'" class="summary-report">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Departemen</th>
                        <th>Jumlah Karyawan</th>
                        <th>Total Gaji</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(dept, index) in departmentSummary" :key="dept.name">
                        <td>{{ index + 1 }}</td>
                        <td>{{ dept.name }}</td>
                        <td class="text-center">{{ dept.count }}</td>
                        <td class="text-right">Rp {{ formatNumber(dept.total) }}</td>
                      </tr>
                      <tr class="font-weight-bold">
                        <td colspan="2" class="text-center">TOTAL</td>
                        <td class="text-center">{{ payrollItems.length }}</td>
                        <td class="text-right">Rp {{ formatNumber(totalSalary) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Detail Report -->
                <div v-if="reportType === 'detail'" class="detail-report">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>NIP</th>
                        <th>Nama</th>
                        <th>Departemen</th>
                        <th>Jabatan</th>
                        <th>Gaji Pokok</th>
                        <th>Tunjangan</th>
                        <th>Potongan</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in payrollItems" :key="item.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.employee_id }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.department }}</td>
                        <td>{{ item.position }}</td>
                        <td class="text-right">Rp {{ formatNumber(item.basic_salary) }}</td>
                        <td class="text-right">Rp {{ formatNumber(item.total_allowance) }}</td>
                        <td class="text-right">Rp {{ formatNumber(item.total_deduction) }}</td>
                        <td class="text-right">Rp {{ formatNumber(item.net_salary) }}</td>
                      </tr>
                      <tr class="font-weight-bold">
                        <td colspan="5" class="text-center">TOTAL</td>
                        <td class="text-right">Rp {{ formatNumber(totalBasicSalary) }}</td>
                        <td class="text-right">Rp {{ formatNumber(totalAllowance) }}</td>
                        <td class="text-right">Rp {{ formatNumber(totalDeduction) }}</td>
                        <td class="text-right">Rp {{ formatNumber(totalSalary) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Department Report -->
                <div v-if="reportType === 'department'" class="department-report">
                  <div v-for="dept in departmentReport" :key="dept.name" class="mb-4">
                    <h5>Departemen: {{ dept.name }}</h5>
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>NIP</th>
                          <th>Nama</th>
                          <th>Jabatan</th>
                          <th>Gaji Pokok</th>
                          <th>Tunjangan</th>
                          <th>Potongan</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in dept.employees" :key="item.id">
                          <td>{{ index + 1 }}</td>
                          <td>{{ item.employee_id }}</td>
                          <td>{{ item.name }}</td>
                          <td>{{ item.position }}</td>
                          <td class="text-right">Rp {{ formatNumber(item.basic_salary) }}</td>
                          <td class="text-right">Rp {{ formatNumber(item.total_allowance) }}</td>
                          <td class="text-right">Rp {{ formatNumber(item.total_deduction) }}</td>
                          <td class="text-right">Rp {{ formatNumber(item.net_salary) }}</td>
                        </tr>
                        <tr class="font-weight-bold">
                          <td colspan="4" class="text-center">TOTAL</td>
                          <td class="text-right">Rp {{ formatNumber(dept.totalBasic) }}</td>
                          <td class="text-right">Rp {{ formatNumber(dept.totalAllowance) }}</td>
                          <td class="text-right">Rp {{ formatNumber(dept.totalDeduction) }}</td>
                          <td class="text-right">Rp {{ formatNumber(dept.total) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Bank Transfer Report -->
                <div v-if="reportType === 'bank'" class="bank-report">
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>No. Rekening</th>
                        <th>Bank</th>
                        <th>Jumlah Transfer</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in payrollItems" :key="item.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.bank_account || '-' }}</td>
                        <td>{{ item.bank_name || '-' }}</td>
                        <td class="text-right">Rp {{ formatNumber(item.net_salary) }}</td>
                      </tr>
                      <tr class="font-weight-bold">
                        <td colspan="4" class="text-center">TOTAL</td>
                        <td class="text-right">Rp {{ formatNumber(totalSalary) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="footer mt-5">
                  <div class="row">
                    <div class="col text-right">
                      <p>{{ getCurrentDate() }}</p>
                      <br><br><br>
                      <p>______________________</p>
                      <p>HR & Finance Manager</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="report-actions" v-if="previewData">
      <div class="d-flex justify-content-end mt-3">
        <button class="btn btn-primary" @click="printReport">
          <i class="fa fa-print mr-2"></i>Print Report
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import useAxios from "@/composables/axios";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import { defineAsyncComponent } from "vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";

const Breadcrumbs = defineAsyncComponent(() => import("@/layout/BreadCrumbs.vue"));
const Loader = defineAsyncComponent(() => import("@/components/common/Loader.vue"));
const BaseSelect = defineAsyncComponent(() => import("@/components/common/Select.vue"));

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
  bank_account?: string;
  bank_name?: string;
}

const router = useRouter();
const { get } = useAxios();
    
const loading = ref(false);
const periods = ref<any[]>([]);
const payrollItems = ref<PayrollItem[]>([]);
const selectedPeriod = ref<string>("");
const reportType = ref<string>("summary");
const previewData = ref(false);
const currentPeriod = ref("");
const formSubmitted = ref(false);
    
const reportTypeOptions = ref([
  { id: "summary", name: "Ringkasan Payroll" },
  { id: "detail", name: "Detail Payroll" },
  { id: "department", name: "Laporan per Departemen" },
  { id: "bank", name: "Laporan Transfer Bank" }
]);

const companyData = ref({
  name: "PT. Manna Jaya",
  address: "Jl. Contoh No. 123, Jakarta",
  phone: "021-12345678",
  email: "info@mannajaya.com"
});

const breadCrumbs = computed(() => {
  return [
    { title: "HCM", to: { name: "HCM" } },
    { title: "Payroll", to: { name: "Payroll" } },
    { title: "Cetak Laporan", active: true }
  ];
});
    
// Computed properties for summary calculations
const totalBasicSalary = computed(() => {
  return payrollItems.value.reduce((sum, item) => sum + item.basic_salary, 0);
});

const totalAllowance = computed(() => {
  return payrollItems.value.reduce((sum, item) => sum + item.total_allowance, 0);
});

const totalDeduction = computed(() => {
  return payrollItems.value.reduce((sum, item) => sum + item.total_deduction, 0);
});

const totalSalary = computed(() => {
  return payrollItems.value.reduce((sum, item) => sum + item.net_salary, 0);
});

// Group by department for summary report
const departmentSummary = computed(() => {
  const departments = new Map<string, {name: string, count: number, total: number}>();
  
  for (const item of payrollItems.value) {
    const dept = item.department;
    if (!departments.has(dept)) {
      departments.set(dept, { name: dept, count: 0, total: 0 });
    }
    
    const deptData = departments.get(dept)!;
    deptData.count++;
    deptData.total += item.net_salary;
  }
  
  return Array.from(departments.values());
});

// Detailed department report
const departmentReport = computed(() => {
  const departments = new Map<string, {
    name: string,
    employees: PayrollItem[],
    totalBasic: number,
    totalAllowance: number,
    totalDeduction: number,
    total: number
  }>();
  
  for (const item of payrollItems.value) {
    const dept = item.department;
    if (!departments.has(dept)) {
      departments.set(dept, { 
        name: dept, 
        employees: [], 
        totalBasic: 0,
        totalAllowance: 0,
        totalDeduction: 0,
        total: 0
      });
    }
    
    const deptData = departments.get(dept)!;
    deptData.employees.push(item);
    deptData.totalBasic += item.basic_salary;
    deptData.totalAllowance += item.total_allowance;
    deptData.totalDeduction += item.total_deduction;
    deptData.total += item.net_salary;
  }
  
  return Array.from(departments.values());
});

const fetchPeriods = async () => {
  try {
    loading.value = true;
    const response = await get("/payroll/periods");
    if (response.success) {
      periods.value = (response.data || []).filter((p: any) => p.status === 'approved').map((p: any) => {
        return {
          id: p.id,
          name: formatDate(p.period) + " - " + p.template_name
        };
      });
    } else {
      showErrorToast(response.message || "Gagal mengambil data periode payroll");
    }
  } catch (error) {
    console.error("Error fetching periods:", error);
    showErrorToast("Terjadi kesalahan saat mengambil data periode payroll");
  } finally {
    loading.value = false;
  }
};

const handleChangePeriod = (period: any) => {
  if (period) {
    selectedPeriod.value = period.id;
    fetchPayroll();
  }
};

const fetchPayroll = async () => {
  if (!selectedPeriod.value) {
    payrollItems.value = [];
    return;
  }
  
  try {
    loading.value = true;
    const response = await get(`/payroll/show/${selectedPeriod.value}`);
    if (response.success) {
      const data = response.data;
      
      payrollItems.value = data.items || [];
      currentPeriod.value = formatDate(data.period);
    } else {
      showErrorToast(response.message || "Gagal mengambil data payroll");
    }
  } catch (error) {
    console.error("Error fetching payroll:", error);
    showErrorToast("Terjadi kesalahan saat mengambil data payroll");
  } finally {
    loading.value = false;
  }
};

const generateReport = () => {
  if (!selectedPeriod.value) {
    showErrorToast("Pilih periode terlebih dahulu");
    return;
  }
  
  previewData.value = true;
};

const printReport = () => {
  const printContents = document.getElementById('printSection')?.innerHTML;
  const originalContents = document.body.innerHTML;
  
  if (printContents) {
    document.body.innerHTML = `
      <html>
        <head>
          <title>Laporan Payroll</title>
          <style>
            @media print {
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
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
              .text-right {
                text-align: right;
              }
              .text-center {
                text-align: center;
              }
              .mb-1 { margin-bottom: 0.25rem; }
              .mb-3 { margin-bottom: 0.75rem; }
              .mb-4 { margin-bottom: 1rem; }
              .mt-5 { margin-top: 1.25rem; }
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
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long" };
  return date.toLocaleDateString('id-ID', options);
};

const formatNumber = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const getCurrentDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
};

onMounted(() => {
  fetchPeriods();
});
</script>

<style scoped>
.printable-area {
  background-color: white;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
}

@media print {
  .printable-area {
    display: block;
    border: none;
  }
  .report-actions {
    display: none;
  }
}

table th, table td {
  padding: 8px;
}

table th {
  background-color: #f8f9fa;
}

.text-right {
  text-align: right;
}

.text-center {
  text-align: center;
}

.font-weight-bold {
  font-weight: bold;
}
</style>