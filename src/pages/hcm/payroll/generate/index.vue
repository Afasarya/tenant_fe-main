<template>
  <div class="card container-fluid p-4">
    <Loader v-if="loading && mode === 'detail'" />
    <form 
      v-else
      class="row g-3 needs-validation custom-input"
      novalidate
      @submit.prevent="onSubmit"
    >
      <div class="col-12">
        <h4>Generate Payroll</h4>
      </div>

      <!-- Step 1: Select Period and Template -->
      <div class="col-md-6">
        <label class="form-label">Periode <span class="text-danger">*</span></label>
        <DateTimePicker
          type="month"
          :value="periodDate"
          :disabled-input="isPreview || isSubmitting"
          @change="handleChangePeriod"
        />
      </div>

      <div class="col-md-6">
        <label class="form-label">Template Payroll <span class="text-danger">*</span></label>
        <BaseSelect
          :disabled-input="isPreview || isSubmitting"
          error-message="Silahkan pilih template payroll"
          :has-submitted="formSubmitted"
          :options="templates"
          :value="form.payroll_component_template_id"
          required
          @change="(val: any) => handleChangeTemplate(val)"
        />
      </div>

      <!-- Step 2: Select Employees -->
      <div class="col-12 mt-4" v-if="!isPreview && form.payroll_component_template_id && form.payroll_draft_month">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5>Pilih Pegawai</h5>
          <div>
            <button type="button" class="btn btn-sm btn-primary me-2" @click="selectAll">
              Pilih Semua
            </button>
            <button type="button" class="btn btn-sm btn-outline-danger" @click="deselectAll">
              Batalkan Semua
            </button>
          </div>
        </div>
        
        <div v-if="loadingEmployees" class="text-center py-4">
          <Loader />
        </div>
        <div v-else-if="employees.length === 0" class="alert alert-info">
          Data pegawai tidak tersedia
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th width="5%">Pilih</th>
                <th width="10%">NIP</th>
                <th width="30%">Nama</th>
                <th width="25%">Jabatan</th>
                <th width="30%">Departemen</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in employees" :key="employee.id">
                <td>
                  <div class="form-check">
                    <input 
                      :id="`emp-${employee.id}`" 
                      class="form-check-input" 
                      type="checkbox" 
                      v-model="selectedEmployees"
                      :value="employee.id"
                    />
                  </div>
                </td>
                <td>{{ employee.employee_number || '-' }}</td>
                <td>{{ employee.name }}</td>
                <td>{{ employee.position_name || '-' }}</td>
                <td>{{ employee.department_name || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Step 3: Preview Payroll -->
      <div class="col-12 mt-4" v-if="isPreview && payrollData.length > 0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5>Preview Payroll</h5>
        </div>
        
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
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(payroll, index) in payrollData" :key="index">
                <td>{{ payroll.employee_number }}</td>
                <td>{{ payroll.name }}</td>
                <td>{{ payroll.position }}</td>
                <td>{{ payroll.department }}</td>
                <td>{{ formatCurrency(payroll.base_salary) }}</td>
                <td>{{ formatCurrency(payroll.total_allowances) }}</td>
                <td>{{ formatCurrency(payroll.total_deductions) }}</td>
                <td><strong>{{ formatCurrency(payroll.net_salary) }}</strong></td>
                <td>
                  <button 
                    type="button" 
                    class="btn btn-warning btn-sm"
                    @click="editPayrollItem(index)"
                  >
                    <i class="fa fa-edit"></i> Edit
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="7" class="text-end fw-bold">Total Payroll:</td>
                <td colspan="2" class="fw-bold">{{ formatCurrency(totalPayroll) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div class="col-12 mt-4">
        <div class="d-flex justify-content-end">
          <button 
            type="button" 
            class="btn btn-secondary me-2"
            @click="goBack"
          >
            Kembali
          </button>

          <button 
            v-if="!isPreview" 
            type="button" 
            class="btn btn-primary"
            @click="previewPayroll"
            :disabled="isSubmitting || selectedEmployees.length === 0"
          >
            Preview Payroll
          </button>

          <button 
            v-if="isPreview" 
            type="submit" 
            class="btn btn-success"
            :disabled="isSubmitting || payrollData.length === 0"
          >
            Simpan Payroll
          </button>
        </div>
      </div>
    </form>

    <!-- Edit Payroll Item Modal -->
    <Modal
      :show="showEditModal"
      :title="`Edit Detail Gaji - ${currentEditItem?.name || ''}`"
      @close="closeEditModal"
    >
      <div v-if="currentEditItem" class="row">
        <div class="col-md-6 mb-3">
          <label class="form-label">Nama Pegawai:</label>
          <p class="fw-bold">{{ currentEditItem.name }}</p>
        </div>
        <div class="col-md-6 mb-3">
          <label class="form-label">NIP:</label>
          <p class="fw-bold">{{ currentEditItem.employee_number }}</p>
        </div>
        
        <div class="col-md-6 mb-3">
          <label class="form-label">Gaji Pokok:</label>
          <CurrencyInput
            v-model="currentEditItem.base_salary"
            :disabled-input="false"
          />
        </div>
        
        <div class="col-12 mb-3">
          <h6 class="mt-3">Komponen Pendapatan</h6>
          <div class="row mb-2" v-for="(allowance, index) in currentEditItem.allowances" :key="'allowance-'+index">
            <div class="col-md-6">
              <label class="form-label">Nama Komponen:</label>
              <BaseInput
                type="text"
                :value="allowance.name"
                :disabled-input="true"
                @change="(val: string) => {}"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Nilai:</label>
              <CurrencyInput
                v-model="allowance.amount"
                :disabled-input="false"
              />
            </div>
          </div>
          
          <h6 class="mt-3">Komponen Potongan</h6>
          <div class="row mb-2" v-for="(deduction, index) in currentEditItem.deductions" :key="'deduction-'+index">
            <div class="col-md-6">
              <label class="form-label">Nama Komponen:</label>
              <BaseInput
                type="text"
                :value="deduction.name"
                :disabled-input="true"
                @change="(val: string) => {}"
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Nilai:</label>
              <CurrencyInput
                v-model="deduction.amount"
                :disabled-input="false"
              />
            </div>
          </div>
          
          <div class="alert alert-info mt-4">
            <div class="d-flex justify-content-between">
              <strong>Total Gaji:</strong>
              <strong>{{ formatCurrency(calculateNetSalary(currentEditItem)) }}</strong>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end mt-3">
          <button type="button" class="btn btn-secondary me-2" @click="closeEditModal">Batal</button>
          <button type="button" class="btn btn-primary" @click="savePayrollItemChanges">Simpan Perubahan</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import useAxios from "@/composables/axios";
import { viewMode } from "@/composables/viewMode";
import dayjs from "dayjs";

// Components
const BaseInput = defineAsyncComponent(() => import("@/components/common/Input.vue"));
const BaseSelect = defineAsyncComponent(() => import("@/components/common/Select.vue"));
const DateTimePicker = defineAsyncComponent(() => import("@/components/common/DateTimePicker.vue"));
const CurrencyInput = defineAsyncComponent(() => import("@/components/common/CurrencyInput.vue"));
const Loader = defineAsyncComponent(() => import("@/components/common/Loader.vue"));
const Modal = defineAsyncComponent(() => import("@/components/common/Modal.vue"));

// Router and API
const router = useRouter();
const route = useRoute();
const { get, post } = useAxios();

// Form state
const mode = ref(viewMode(route.fullPath));
const loading = ref(false);
const loadingEmployees = ref(false);
const isSubmitting = ref(false);
const formSubmitted = ref(false);
const isPreview = ref(false);
const periodDate = ref(new Date());

// Data lists
const templates = ref<any[]>([]);
const employees = ref<any[]>([]);
const selectedEmployees = ref<any[]>([]);
const payrollData = ref<any[]>([]);

// Modal and editing
const showEditModal = ref(false);
const currentEditItem = ref<any>(null);
const currentEditIndex = ref<number>(-1);

// Form data
const form = ref({
  payroll_component_template_id: "",
  payroll_draft_month: dayjs().format("MM"),
  payroll_draft_year: dayjs().format("YYYY"),
  description: `Gaji Bulan ${dayjs().format("MMMM YYYY")}`,
  status: "draft"
});

// Computed properties
const totalPayroll = computed(() => {
  return payrollData.value.reduce((sum, item) => sum + Number(item.net_salary), 0);
});

// Methods for Step 1: Select period and template
const handleChangePeriod = (date: string) => {
  const dateObj = new Date(date);
  periodDate.value = dateObj;
  form.value.payroll_draft_month = dayjs(dateObj).format("MM");
  form.value.payroll_draft_year = dayjs(dateObj).format("YYYY");
  form.value.description = `Gaji Bulan ${dayjs(dateObj).format("MMMM YYYY")}`;
  
  // Reset selections when period changes
  if (!isPreview.value) {
    selectedEmployees.value = [];
  }
};

const handleChangeTemplate = (template: any) => {
  if (template) {
    form.value.payroll_component_template_id = template.id;
    fetchEmployees();
  } else {
    form.value.payroll_component_template_id = "";
    employees.value = [];
  }
};

const fetchTemplates = async () => {
  try {
    loading.value = true;
    const { data, success, message } = await get("/payroll_component_template", {
      params: {
        is_active: 1,
        page: 1,
        per_page: 100
      }
    });

    if (success) {
      templates.value = data?.data.map((template: any) => ({
        id: template.id,
        name: template.name
      })) || [];
    } else {
      showErrorToast(message || "Gagal memuat data template payroll");
    }
  } catch (error: any) {
    console.error("Error fetching templates:", error);
    showErrorToast(error?.message || "Terjadi kesalahan saat memuat data template");
  } finally {
    loading.value = false;
  }
};

// Methods for Step 2: Select employees
const fetchEmployees = async () => {
  if (!form.value.payroll_component_template_id) return;
  
  try {
    loadingEmployees.value = true;
    const { data, success, message } = await get("/employee", {
      params: {
        status: true,
        page: 1,
        per_page: 100
      }
    });

    if (success) {
      employees.value = data?.data || [];
    } else {
      showErrorToast(message || "Gagal memuat data pegawai");
    }
  } catch (error: any) {
    console.error("Error fetching employees:", error);
    showErrorToast(error?.message || "Terjadi kesalahan saat memuat data pegawai");
  } finally {
    loadingEmployees.value = false;
  }
};

const selectAll = () => {
  selectedEmployees.value = employees.value.map(emp => emp.id);
};

const deselectAll = () => {
  selectedEmployees.value = [];
};

// Methods for Step 3: Preview payroll
const previewPayroll = async () => {
  if (selectedEmployees.value.length === 0) {
    showErrorToast("Pilih minimal satu pegawai");
    return;
  }
  
  formSubmitted.value = true;
  
  if (!form.value.payroll_component_template_id || !form.value.payroll_draft_month || !form.value.payroll_draft_year) {
    showErrorToast("Silahkan pilih periode dan template terlebih dahulu");
    return;
  }
  
  try {
    isSubmitting.value = true;
    
    // Get the selected employee details
    const selectedEmployeeData = employees.value.filter(emp => selectedEmployees.value.includes(emp.id));
    
    // Fetch components from the template
    const { data: templateData, success: templateSuccess } = await get(`/payroll_component_detail/${form.value.payroll_component_template_id}`);
    
    if (!templateSuccess || !templateData) {
      showErrorToast("Gagal memuat komponen template payroll");
      isSubmitting.value = false;
      return;
    }
    
    // Get all template components
    const templateComponents = templateData.data || [];
    
    // Generate preview data for each employee
    payrollData.value = await Promise.all(selectedEmployeeData.map(async (emp: any) => {
      // Get basic employee info
      const baseSalary = Number(emp.salary) || 0;
      
      // Separate components into allowances and deductions
      const allowances: any[] = [];
      const deductions: any[] = [];
      
      templateComponents.forEach((component: any) => {
        const componentDetail = component.component || {};
        const amount = component.type === "percentage" 
          ? baseSalary * (Number(component.value) / 100) 
          : Number(component.value);
          
        if (componentDetail.type_component === "kredit") {
          allowances.push({
            name: componentDetail.name,
            component_id: componentDetail.id,
            amount: amount,
            type: component.type
          });
        } else if (componentDetail.type_component === "debit") {
          deductions.push({
            name: componentDetail.name,
            component_id: componentDetail.id,
            amount: amount,
            type: component.type
          });
        }
      });
      
      // Calculate totals
      const totalAllowances = allowances.reduce((sum, item) => sum + Number(item.amount), 0);
      const totalDeductions = deductions.reduce((sum, item) => sum + Number(item.amount), 0);
      const netSalary = baseSalary + totalAllowances - totalDeductions;
      
      return {
        employee_id: emp.id,
        employee_number: emp.employee_number || '-',
        name: emp.name,
        position: emp.position_name || '-',
        department: emp.department_name || '-',
        base_salary: baseSalary,
        allowances,
        deductions,
        total_allowances: totalAllowances,
        total_deductions: totalDeductions,
        net_salary: netSalary
      };
    }));
    
    isPreview.value = true;
  } catch (error: any) {
    console.error("Error generating payroll preview:", error);
    showErrorToast(error?.message || "Terjadi kesalahan saat membuat preview payroll");
  } finally {
    isSubmitting.value = false;
  }
};

// Methods for editing payroll items
const editPayrollItem = (index: number) => {
  currentEditIndex.value = index;
  currentEditItem.value = JSON.parse(JSON.stringify(payrollData.value[index]));
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  currentEditItem.value = null;
  currentEditIndex.value = -1;
};

const savePayrollItemChanges = () => {
  if (!currentEditItem.value) return;
  
  // Recalculate totals
  const totalAllowances = currentEditItem.value.allowances.reduce(
    (sum: number, item: any) => sum + Number(item.amount), 0
  );
  
  const totalDeductions = currentEditItem.value.deductions.reduce(
    (sum: number, item: any) => sum + Number(item.amount), 0
  );
  
  const netSalary = Number(currentEditItem.value.base_salary) + totalAllowances - totalDeductions;
  
  // Update the item with new calculations
  const updatedItem = {
    ...currentEditItem.value,
    total_allowances: totalAllowances,
    total_deductions: totalDeductions,
    net_salary: netSalary
  };
  
  // Update the item in the payroll data array
  payrollData.value[currentEditIndex.value] = updatedItem;
  
  // Close modal
  closeEditModal();
};

// Methods for saving payroll
const onSubmit = async () => {
  if (payrollData.value.length === 0) return;
  
  try {
    isSubmitting.value = true;
    
    // Step 1: Create a payroll draft month
    const payrollDraftMonthPayload = {
      payroll_component_template_id: form.value.payroll_component_template_id,
      payroll_draft_month: form.value.payroll_draft_month,
      payroll_draft_year: form.value.payroll_draft_year,
      description: form.value.description,
      status: form.value.status,
      total_amount: totalPayroll.value
    };
    
    const { data: monthData, success: monthSuccess, message: monthMessage } = 
      await post("/payroll_draft_month/store", payrollDraftMonthPayload);
    
    if (!monthSuccess || !monthData) {
      showErrorToast(monthMessage || "Gagal menyimpan draft periode payroll");
      isSubmitting.value = false;
      return;
    }
    
    const payrollDraftMonthId = monthData.id;
    
    // Step 2: Create payroll draft employees for each employee
    const promises = payrollData.value.map(item => {
      const payload = {
        payroll_draft_month_id: payrollDraftMonthId,
        employee_id: item.employee_id,
        base_salary: item.base_salary,
        total_allowances: item.total_allowances,
        total_deductions: item.total_deductions,
        gross_salary: item.base_salary + item.total_allowances,
        net_salary: item.net_salary
      };
      
      return post("/payroll_draft/store", payload);
    });
    
    const results = await Promise.all(promises);
    
    // Check if all employees were saved successfully
    const allSuccess = results.every(result => result.success);
    
    if (allSuccess) {
      showSuccessToast("Payroll berhasil disimpan");
      router.push({ name: "Payroll" });
    } else {
      const errorCount = results.filter(result => !result.success).length;
      showErrorToast(`${errorCount} data pegawai gagal disimpan`);
    }
  } catch (error: any) {
    console.error("Error saving payroll:", error);
    showErrorToast(error?.message || "Terjadi kesalahan saat menyimpan payroll");
  } finally {
    isSubmitting.value = false;
  }
};

// Utility functions
const formatCurrency = (value: number) => {
  if (!value && value !== 0) return "Rp 0";
  return `Rp ${value.toLocaleString('id-ID')}`;
};

const calculateNetSalary = (item: any) => {
  const totalAllowances = item.allowances.reduce((sum: number, allowance: any) => sum + Number(allowance.amount), 0);
  const totalDeductions = item.deductions.reduce((sum: number, deduction: any) => sum + Number(deduction.amount), 0);
  return Number(item.base_salary) + totalAllowances - totalDeductions;
};

const goBack = () => {
  if (isPreview.value) {
    isPreview.value = false;
    return;
  }
  
  router.push({ name: "Payroll" });
};

// Initialize
onMounted(() => {
  fetchTemplates();
});
</script>