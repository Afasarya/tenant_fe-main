<template>
  <div class="card container-fluid p-4">
    <Loader v-if="loading && mode === 'detail'" />
    <form 
      v-else
      class="row g-3 needs-validation custom-input"
      novalidate
      @submit.prevent="onSubmit"
    >
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h4>{{ isEdit ? 'Edit Payroll' : 'Generate Payroll' }}</h4>
        <span 
          v-if="isEdit" 
          class="badge" 
          :class="{
            'bg-secondary': form.status === 'draft',
            'bg-warning': form.status === 'pending',
            'bg-success': form.status === 'approved'
          }"
        >
          {{ getStatusLabel(form.status) }}
        </span>
      </div>

      <!-- Step 1: Select Period and Template -->
      <div class="col-md-6">
        <label class="form-label">Periode <span class="text-danger">*</span></label>
        <DateTimePicker
          type="month"
          :value="periodDate"
          :disabled-input="isEdit || isPreview || isSubmitting"
          @change="handleChangePeriod"
        />
      </div>

      <div class="col-md-6">
        <label class="form-label">Template Payroll <span class="text-danger">*</span></label>
        <BaseSelect
          :disabled-input="isEdit || isPreview || isSubmitting"
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
                      :disabled="isEdit"
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

      <!-- Step 3: Preview/Edit Payroll -->
      <div class="col-12 mt-4" v-if="isPreview || isEdit">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5>{{ isEdit ? 'Edit Payroll' : 'Preview Payroll' }}</h5>
        </div>
        
        <div v-if="loadingPayrollData" class="text-center py-4">
          <Loader />
        </div>
        <div v-else-if="payrollData.length === 0" class="alert alert-info">
          Data payroll tidak tersedia
        </div>
        <div v-else class="table-responsive">
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
                    class="btn btn-sm btn-warning" 
                    @click="editPayrollItem(index)"
                    :disabled="form.status === 'approved'"
                    title="Edit komponen gaji"
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
            v-if="!isPreview && !isEdit" 
            type="button" 
            class="btn btn-primary"
            @click="previewPayroll"
            :disabled="isSubmitting || selectedEmployees.length === 0"
          >
            Preview Payroll
          </button>

          <button 
            v-if="(isPreview || isEdit) && form.status !== 'approved'" 
            type="submit" 
            class="btn btn-success"
            :disabled="isSubmitting || payrollData.length === 0"
          >
            {{ isEdit ? 'Simpan Perubahan' : 'Simpan Payroll' }}
          </button>
        </div>
      </div>
    </form>

    <!-- Edit Payroll Item Modal -->
    <div class="modal fade" id="editPayrollModal" tabindex="-1" aria-labelledby="editPayrollModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Detail Gaji - {{ currentEditItem?.name || "" }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Loader v-if="loadingPayrollDetail" />
            <div v-else-if="currentEditItem" class="row">
              <!-- Informasi karyawan -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Nama Pegawai:</label>
                <p class="fw-bold">{{ currentEditItem.name }}</p>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">NIP:</label>
                <p class="fw-bold">{{ currentEditItem.employee_number }}</p>
              </div>
              
              <!-- Gaji pokok -->
              <div class="col-md-6 mb-3">
                <label class="form-label">Gaji Pokok:</label>
                <CurrencyInput
                  v-model="currentEditItem.base_salary"
                  :disabled-input="isSubmitting || form.status === 'approved'"
                />
              </div>
              
              <!-- Komponen pendapatan -->
              <div class="col-12 mb-3" v-if="payrollComponents.length > 0">
                <h6 class="mt-3 mb-3">Komponen Pendapatan</h6>
                <div class="card border mb-3">
                  <div class="card-body">
                    <div v-if="!payrollComponents.filter(c => c.type_component === 'kredit').length" 
                         class="text-center text-muted py-2">
                      Tidak ada komponen pendapatan
                    </div>
                    <div class="row mb-2" 
                         v-for="(component, index) in payrollComponents.filter(c => c.type_component === 'kredit')" 
                         :key="'kredit-'+index">
                      <div class="col-md-6">
                        <label class="form-label">{{ component.name }}</label>
                        <small v-if="component.is_permanent === 1" class="text-muted"> (Komponen tetap)</small>
                      </div>
                      <div class="col-md-6">
                        <CurrencyInput
                          v-model="component.value"
                          :disabled-input="isSubmitting || component.is_permanent === 1 || form.status === 'approved'"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Komponen potongan -->
                <h6 class="mt-4 mb-3">Komponen Potongan</h6>
                <div class="card border mb-3">
                  <div class="card-body">
                    <div v-if="!payrollComponents.filter(c => c.type_component === 'debit').length" 
                         class="text-center text-muted py-2">
                      Tidak ada komponen potongan
                    </div>
                    <div class="row mb-2" 
                         v-for="(component, index) in payrollComponents.filter(c => c.type_component === 'debit')" 
                         :key="'debit-'+index">
                      <div class="col-md-6">
                        <label class="form-label">{{ component.name }}</label>
                        <small v-if="component.is_permanent === 1" class="text-muted"> (Komponen tetap)</small>
                      </div>
                      <div class="col-md-6">
                        <CurrencyInput
                          v-model="component.value"
                          :disabled-input="isSubmitting || component.is_permanent === 1 || form.status === 'approved'"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="alert alert-info mt-4">
                  <div class="d-flex justify-content-between">
                    <strong>Total Gaji:</strong>
                    <strong>{{ formatCurrency(calculateTotalSalary()) }}</strong>
                  </div>
                </div>
              </div>
              <div v-else class="col-12 alert alert-warning">
                Tidak ada komponen payroll yang tersedia untuk karyawan ini.
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" :disabled="isSubmitting">
              Batal
            </button>
            <button type="button" class="btn btn-primary" @click="savePayrollItemChanges" 
              :disabled="isSubmitting || form.status === 'approved'">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import useAxios from "@/composables/axios";
import dayjs from "dayjs";
import * as bootstrap from 'bootstrap';

// Components
const BaseInput = defineAsyncComponent(() => import("@/components/common/Input.vue"));
const BaseSelect = defineAsyncComponent(() => import("@/components/common/Select.vue"));
const DateTimePicker = defineAsyncComponent(() => import("@/components/common/DateTimePicker.vue"));
const CurrencyInput = defineAsyncComponent(() => import("@/components/common/CurrencyInput.vue"));
const Loader = defineAsyncComponent(() => import("@/components/common/Loader.vue"));

// Router and API
const router = useRouter();
const route = useRoute();
const { get, post, put } = useAxios();

// Form state
const loading = ref(false);
const loadingEmployees = ref(false);
const loadingPayrollData = ref(false);
const loadingPayrollDetail = ref(false);
const isSubmitting = ref(false);
const formSubmitted = ref(false);
const isPreview = ref(false);
const isEdit = ref(false);
const periodDate = ref(new Date());

// Tambahkan variabel ref untuk menyimpan instance modal
const editModal = ref<any>(null);

// Data lists
const templates = ref<any[]>([]);
const employees = ref<any[]>([]);
const selectedEmployees = ref<any[]>([]);
const payrollData = ref<any[]>([]);
const payrollComponents = ref<any[]>([]);

// Modal and editing
const currentEditItem = ref<any>(null);
const currentEditIndex = ref<number>(-1);
const currentPayrollId = ref<string | null>(null);

// Form data
const form = ref({
  id: "",
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
  form.value.description = `Gaji Bulan ${dayjs(dateObj).locale('id').format("MMMM YYYY")}`;
  
  // Reset selections when period changes
  if (!isPreview.value && !isEdit.value) {
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

// Methods for Step 3: Preview/Edit payroll
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
    loadingPayrollData.value = true;
    
    // Get the selected employee details
    const selectedEmployeeData = employees.value.filter(emp => selectedEmployees.value.includes(emp.id));
    
    // Fetch components from the template
    const { data: templateData, success: templateSuccess } = await get(`/payroll_component_detail/${form.value.payroll_component_template_id}`);
    
    if (!templateSuccess || !templateData) {
      showErrorToast("Gagal memuat komponen template payroll");
      loadingPayrollData.value = false;
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
            type: component.type,
            is_permanent: componentDetail.is_permanent || 0
          });
        } else if (componentDetail.type_component === "debit") {
          deductions.push({
            name: componentDetail.name,
            component_id: componentDetail.id,
            amount: amount,
            type: component.type,
            is_permanent: componentDetail.is_permanent || 0
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
    loadingPayrollData.value = false;
  }
};

// Fetch existing payroll data for editing
const fetchPayrollDetails = async (id: string) => {
  try {
    loading.value = true;
    
    // Get the payroll draft month details
    const { data, success, message } = await get(`/payroll_draft_month/show/${id}`);
    
    if (!success || !data) {
      showErrorToast(message || "Gagal memuat detail payroll");
      router.push({ name: "PayrollList" });
      return;
    }
    
    // Update form data
    form.value = {
      id: data.id,
      payroll_component_template_id: data.payroll_component_template_id,
      payroll_draft_month: data.payroll_draft_month,
      payroll_draft_year: data.payroll_draft_year,
      description: data.description || `Gaji Bulan ${dayjs(new Date(data.payroll_draft_year, parseInt(data.payroll_draft_month) - 1)).locale('id').format("MMMM YYYY")}`,
      status: data.status || "draft"
    };
    
    // Set the period date
    periodDate.value = new Date(data.payroll_draft_year, parseInt(data.payroll_draft_month) - 1);
    
    // Fetch employees in this payroll
    await fetchPayrollEmployees(id);
    
  } catch (error) {
    console.error("Error fetching payroll details:", error);
    showErrorToast("Terjadi kesalahan saat mengambil detail payroll");
    router.push({ name: "PayrollList" });
  } finally {
    loading.value = false;
  }
};

const fetchPayrollEmployees = async (payrollDraftMonthId: string) => {
  try {
    loadingPayrollData.value = true;
    
    // Fetch all payroll drafts for this month
    const { data, success } = await get(`/payroll_draft`, {
      params: { payroll_draft_month_id: payrollDraftMonthId }
    });
    
    if (success && data?.data) {
      // Map the payroll drafts to our format
      payrollData.value = data.data.map((item: any) => {
        // Get employee data
        const employee = item.employee || {};
        
        return {
          id: item.id,
          employee_id: item.employee_id,
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
    } else {
      showErrorToast("Gagal memuat data pegawai pada payroll ini");
    }
  } catch (error) {
    console.error("Error fetching payroll employees:", error);
    showErrorToast("Terjadi kesalahan saat memuat data pegawai payroll");
  } finally {
    loadingPayrollData.value = false;
  }
};

// Methods for editing payroll items
const editPayrollItem = async (index: number) => {
  console.log("Editing payroll item at index:", index);
  currentEditIndex.value = index;
  currentEditItem.value = JSON.parse(JSON.stringify(payrollData.value[index]));
  currentPayrollId.value = currentEditItem.value.id || null;
  
  loadingPayrollDetail.value = true;
  
  try {
    if (currentPayrollId.value) {
      // Untuk draft payroll yang sudah ada, ambil komponen detailnya 
      console.log(`Fetching payroll draft components for ID: ${currentPayrollId.value}`);
      await fetchPayrollItemComponents(currentPayrollId.value);
    } else {
      // Untuk draft payroll yang baru, gunakan data dari preview
      console.log("Creating component data from preview data");
      const allowances = currentEditItem.value.allowances || [];
      const deductions = currentEditItem.value.deductions || [];
      
      payrollComponents.value = [
        ...allowances.map((a: any) => ({
          id: a.component_id,
          name: a.name,
          type_component: 'kredit',
          value: a.amount || 0,
          is_permanent: a.is_permanent || 0,
          component_id: a.component_id
        })),
        ...deductions.map((d: any) => ({
          id: d.component_id,
          name: d.name,
          type_component: 'debit',
          value: d.amount || 0,
          is_permanent: d.is_permanent || 0,
          component_id: d.component_id
        }))
      ];
      
      console.log("Created payroll components:", payrollComponents.value);
    }
  } catch (error) {
    console.error("Error preparing payroll component data:", error);
    showErrorToast("Terjadi kesalahan saat mempersiapkan data komponen");
  } finally {
    loadingPayrollDetail.value = false;
    
    // Tampilkan modal setelah data siap
    if (!editModal.value) {
      editModal.value = new bootstrap.Modal(document.getElementById('editPayrollModal'));
    }
    editModal.value.show();
  }
};

// Perbaikan fungsi untuk mengambil komponen payroll item
const fetchPayrollItemComponents = async (payrollId: string) => {
  try {
    console.log(`Fetching payroll draft data for ID: ${payrollId}`);
    const { data, success } = await get(`/payroll_draft/show/${payrollId}`);
    
    if (success && data) {
      console.log("Received payroll draft data:", data);
      
      // Update currentEditItem dengan data terbaru
      currentEditItem.value = {
        ...currentEditItem.value,
        base_salary: Number(data.base_salary) || 0,
        id: data.id
      };
      
      // Tambahkan debug untuk payroll components
      console.log("Payroll draft components:", data.payroll_draft_components);
      
      // Jika tidak ada komponen, coba ambil dari template payroll
      if (!data.payroll_draft_components || data.payroll_draft_components.length === 0) {
        console.log("No components found in payroll draft, fetching from template instead");
        await fetchComponentsFromTemplate();
        return;
      }
      
      // Ambil semua komponen untuk payroll item ini
      const componentDetails = data.payroll_draft_components || [];
      
      // Map komponen ke format yang kita butuhkan
      payrollComponents.value = componentDetails.map((detail: any) => {
        const component = detail.component || {};
        return {
          id: component.id || 0,
          name: component.name || 'Unknown Component',
          type_component: component.type_component || 'kredit',
          value: Number(detail.value) || 0,
          is_permanent: component.is_permanent || 0,
          payroll_draft_component_id: detail.id || 0,
          component_id: component.id || 0
        };
      });
      
      console.log("Mapped payroll components:", payrollComponents.value);
    } else {
      console.error("Failed to fetch payroll draft data:", data);
      showErrorToast("Gagal memuat detail komponen gaji");
      
      // Coba alternatif mengambil dari template
      await fetchComponentsFromTemplate();
    }
  } catch (error) {
    console.error("Error fetching payroll draft data:", error);
    showErrorToast("Terjadi kesalahan saat memuat detail komponen gaji");
    
    // Coba alternatif mengambil dari template
    await fetchComponentsFromTemplate();
  }
};

// Tambahkan fungsi untuk mengambil komponen dari template jika diperlukan
const fetchComponentsFromTemplate = async () => {
  if (!form.value.payroll_component_template_id) {
    console.error("Template payroll ID not found");
    showErrorToast("Template payroll tidak ditemukan");
    return;
  }
  
  try {
    console.log("Fetching components from template:", form.value.payroll_component_template_id);
    const { data, success } = await get(`/payroll_component_detail/${form.value.payroll_component_template_id}`);
    
    if (success && data && data.data) {
      console.log("Template components data:", data.data);
      
      // Map komponen template ke format yang kita butuhkan
      payrollComponents.value = data.data.map((item: any) => {
        const component = item.component || {};
        return {
          id: component.id || 0,
          name: component.name || 'Unknown Component',
          type_component: component.type_component || 'kredit',
          value: Number(item.value) || 0,
          is_permanent: component.is_permanent || 0,
          component_id: component.id || 0
        };
      });
      
      console.log("Mapped template components:", payrollComponents.value);
    } else {
      console.error("Failed to fetch template components:", data);
      showErrorToast("Gagal memuat komponen dari template payroll");
    }
  } catch (error) {
    console.error("Error fetching template components:", error);
    showErrorToast("Terjadi kesalahan saat memuat komponen template");
  }
};

// Perbaikan fungsi untuk menyimpan perubahan komponen payroll
const savePayrollItemChanges = async () => {
  if (!currentEditItem.value) return;
  
  isSubmitting.value = true;
  
  try {
    // Hitung total komponen
    const kredits = payrollComponents.value.filter(c => c.type_component === 'kredit');
    const debits = payrollComponents.value.filter(c => c.type_component === 'debit');
    
    const totalAllowances = kredits.reduce((sum, component) => sum + Number(component.value), 0);
    const totalDeductions = debits.reduce((sum, component) => sum + Number(component.value), 0);
    
    const baseSalary = Number(currentEditItem.value.base_salary) || 0;
    const netSalary = baseSalary + totalAllowances - totalDeductions;
    
    console.log("Calculated values:", {
      baseSalary,
      totalAllowances,
      totalDeductions,
      netSalary
    });
    
    let response;
    
    if (currentPayrollId.value) {
      // Update payroll draft yang sudah ada
      const payload = {
        employee_id: currentEditItem.value.employee_id,
        base_salary: baseSalary,
        total_allowances: totalAllowances,
        total_deductions: totalDeductions,
        net_salary: netSalary,
        components: payrollComponents.value.map(comp => ({
          component_id: comp.id || comp.component_id,
          value: comp.value,
          payroll_draft_component_id: comp.payroll_draft_component_id || null
        }))
      };
      
      console.log(`Updating payroll draft ${currentPayrollId.value} with payload:`, payload);
      response = await put(`/payroll_draft/update/${currentPayrollId.value}`, payload);
    } else {
      // Untuk draft payroll baru, cukup simpan perubahan di state
      console.log("Updating new payroll draft in state only");
      response = { success: true };
    }
    
    if (response.success) {
      // Update data payroll di UI
      const updatedItem = {
        ...currentEditItem.value,
        base_salary: baseSalary,
        total_allowances: totalAllowances,
        total_deductions: totalDeductions,
        net_salary: netSalary
      };
      
      payrollData.value.splice(currentEditIndex.value, 1, updatedItem);
      
      if (editModal.value) {
        editModal.value.hide();
      }
      
      showSuccessToast("Data gaji berhasil diperbarui");
    } else {
      console.error("Error updating payroll draft:", response);
      showErrorToast(response.message || "Gagal memperbarui data gaji");
    }
  } catch (error) {
    console.error("Error saving payroll changes:", error);
    showErrorToast("Terjadi kesalahan saat menyimpan perubahan");
  } finally {
    isSubmitting.value = false;
    currentEditItem.value = null;
    currentEditIndex.value = -1;
    currentPayrollId.value = null;
  }
};

// Fungsi untuk menghitung total gaji
const calculateTotalSalary = () => {
  if (!currentEditItem.value) return 0;
  
  const baseSalary = Number(currentEditItem.value.base_salary) || 0;
  
  // Hitung total dari tunjangan (kredit)
  const totalAllowances = payrollComponents.value
    .filter(c => c.type_component === 'kredit')
    .reduce((sum, component) => sum + Number(component.value), 0);
    
  // Hitung total dari potongan (debit)
  const totalDeductions = payrollComponents.value
    .filter(c => c.type_component === 'debit')
    .reduce((sum, component) => sum + Number(component.value), 0);
    
  return baseSalary + totalAllowances - totalDeductions;
};

// Save/Update Payroll
const onSubmit = async () => {
  if (isEdit.value && form.value.status === 'approved') {
    showErrorToast("Payroll yang sudah disetujui tidak dapat diubah");
    return;
  }
  
  if (payrollData.value.length === 0) {
    showErrorToast("Tidak ada data payroll untuk disimpan");
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    const totalAmount = payrollData.value.reduce((sum, item) => sum + Number(item.net_salary), 0);
    
    let response;
    let payrollDraftMonthId;
    
    if (isEdit.value) {
      // Update existing payroll draft month
      const updatePayload = {
        description: form.value.description,
        total_amount: totalAmount
      };
      
      response = await put(`/payroll_draft_month/update/${form.value.id}`, updatePayload);
      payrollDraftMonthId = form.value.id;
    } else {
      // Create new payroll draft month
      const createPayload = {
        payroll_component_template_id: form.value.payroll_component_template_id,
        payroll_draft_month: form.value.payroll_draft_month,
        payroll_draft_year: form.value.payroll_draft_year,
        description: form.value.description,
        status: form.value.status,
        total_amount: totalAmount
      };
      
      response = await post("/payroll_draft_month/store", createPayload);
      
      if (response && response.success && response.data) {
        payrollDraftMonthId = response.data.id;
      }
    }
    
    if (!response || !response.success || !payrollDraftMonthId) {
      showErrorToast(response?.message || "Gagal menyimpan data payroll");
      isSubmitting.value = false;
      return;
    }
    
    // If not editing, create payroll drafts for each employee
    if (!isEdit.value) {
      const draftPromises = payrollData.value.map(item => {
        const payload = {
          payroll_draft_month_id: payrollDraftMonthId,
          employee_id: item.employee_id,
          base_salary: item.base_salary,
          total_allowances: item.total_allowances,
          total_deductions: item.total_deductions,
          net_salary: item.net_salary,
          components: [
            ...(item.allowances || []).map((a: any) => ({
              component_id: a.component_id,
              value: a.amount
            })),
            ...(item.deductions || []).map((d: any) => ({
              component_id: d.component_id,
              value: d.amount
            }))
          ]
        };
        
        return post("/payroll_draft/store", payload);
      });
      
      const results = await Promise.allSettled(draftPromises);
      
      // Check if all employees were saved successfully
      const failedCount = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length;
      
      if (failedCount > 0) {
        showErrorToast(`${failedCount} data pegawai gagal disimpan`);
      } else {
        showSuccessToast("Payroll berhasil disimpan");
        router.push({ name: "PayrollList" });
      }
    } else {
      showSuccessToast("Payroll berhasil diperbarui");
      router.push({ name: "PayrollList" });
    }
  } catch (error) {
    console.error("Error saving payroll:", error);
    showErrorToast("Terjadi kesalahan saat menyimpan payroll");
  } finally {
    isSubmitting.value = false;
  }
};

// Utility functions
const formatCurrency = (value: number) => {
  if (!value && value !== 0) return "Rp 0";
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

// Perbaikan button handler untuk kembali
const goBack = () => {
  console.log("Back button clicked");
  try {
    if (isPreview.value && !isEdit.value) {
      isPreview.value = false;
      return;
    }
    
    router.push({ path: "/hcm/payroll/list" });
  } catch (error) {
    console.error("Navigation error:", error);
    showErrorToast("Tidak dapat kembali ke halaman daftar");
  }
};

// Initialize
onMounted(async () => {
  // Check if we're in edit mode
  const id = route.params.id;
  isEdit.value = !!id;
  
  // First load templates
  await fetchTemplates();
  
  // If in edit mode, load the existing payroll
  if (isEdit.value) {
    await fetchPayrollDetails(id as string);
  }
  
  // Inisialisasi modal
  if (document.getElementById('editPayrollModal')) {
    editModal.value = new bootstrap.Modal(document.getElementById('editPayrollModal'));
  }
});

// Tambahkan watch untuk menghitung total otomatis saat nilai komponen berubah
watch(payrollComponents, () => {
  if (currentEditItem.value) {
    const totals = calculateComponentTotals();
    console.log("Component values changed, new totals:", totals);
  }
}, { deep: true });

// Fungsi helper untuk menghitung total komponen
const calculateComponentTotals = () => {
  const kredits = payrollComponents.value.filter(c => c.type_component === 'kredit');
  const debits = payrollComponents.value.filter(c => c.type_component === 'debit');
  
  const totalAllowances = kredits.reduce((sum, component) => sum + Number(component.value), 0);
  const totalDeductions = debits.reduce((sum, component) => sum + Number(component.value), 0);
  
  return {
    totalAllowances,
    totalDeductions
  };
};
</script>