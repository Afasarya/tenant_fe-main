<template>
  <div>
    <Breadcrumbs :title="isEdit ? 'Edit Payroll' : 'Generate Payroll'" :breadcrumbs="breadCrumbs" />
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header">
              <h5>{{ isEdit ? 'Edit Payroll' : 'Generate Payroll' }}</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="previewPayroll">
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="template">Template Payroll <span class="text-danger">*</span></label>
                      <BaseSelect
                        :disabled-input="isEdit || isPreview"
                        error-message="Silahkan pilih template"
                        :has-submitted="formSubmitted"
                        :options="templates"
                        :value="form.template_id"
                        required
                        @change="(val: any) => handleChangeTemplate(val)"
                      />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="period">Periode <span class="text-danger">*</span></label>
                      <DatePicker
                        type="month"
                        :disabled-input="isEdit || isPreview"
                        :value="periodDate"
                        @change="handleChangePeriod"
                      />
                    </div>
                  </div>
                </div>
                <div class="row" v-if="!isPreview">
                  <div class="col-md-12">
                    <div class="form-group">
                      <label>Pegawai</label>
                      <div class="mb-3 d-flex justify-content-end">
                        <button type="button" class="btn btn-sm btn-secondary mr-2" @click="selectAll">
                          Pilih Semua
                        </button>
                        <button type="button" class="btn btn-sm btn-danger" @click="deselectAll">
                          Batal Pilih Semua
                        </button>
                      </div>
                      <div v-if="loading" class="d-flex justify-content-center">
                        <Loader />
                      </div>
                      <div v-else class="table-responsive">
                        <table class="table">
                          <thead>
                            <tr>
                              <th>Pilih</th>
                              <th>NIP</th>
                              <th>Nama</th>
                              <th>Departemen</th>
                              <th>Jabatan</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-if="employees.length <= 0">
                              <td colspan="5" class="text-center">Tidak ada data</td>
                            </tr>
                            <tr v-for="employee in employees" :key="employee.id">
                              <td>
                                <div class="checkbox">
                                  <input 
                                    type="checkbox" 
                                    :id="'employee_' + employee.id" 
                                    :value="employee.id"
                                    v-model="selectedEmployees"
                                    :disabled="isEdit"
                                  />
                                  <label :for="'employee_' + employee.id"></label>
                                </div>
                              </td>
                              <td>{{ employee.employee_id }}</td>
                              <td>{{ employee.name }}</td>
                              <td>{{ employee.department }}</td>
                              <td>{{ employee.position }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="isPreview" class="row">
                  <div class="col-md-12">
                    <h6 class="mb-3">Preview Payroll</h6>
                    <div class="table-responsive">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>NIP</th>
                            <th>Nama</th>
                            <th>Departemen</th>
                            <th>Jabatan</th>
                            <th>Gaji Pokok</th>
                            <th>Total Tunjangan</th>
                            <th>Total Potongan</th>
                            <th>Total Gaji</th>
                            <th>Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-if="payrollData.length <= 0">
                            <td colspan="9" class="text-center">Tidak ada data</td>
                          </tr>
                          <tr v-for="(payroll, index) in payrollData" :key="index">
                            <td>{{ payroll.employee_id }}</td>
                            <td>{{ payroll.name }}</td>
                            <td>{{ payroll.department }}</td>
                            <td>{{ payroll.position }}</td>
                            <td>Rp {{ formatNumber(payroll.basic_salary) }}</td>
                            <td>Rp {{ formatNumber(payroll.total_allowance) }}</td>
                            <td>Rp {{ formatNumber(payroll.total_deduction) }}</td>
                            <td>Rp {{ formatNumber(payroll.net_salary) }}</td>
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
                      </table>
                    </div>
                  </div>
                </div>
                
                <div class="row mt-3">
                  <div class="col-md-12">
                    <div class="d-flex justify-content-end">
                      <button 
                        type="button" 
                        class="btn btn-light mr-2"
                        @click="goBack"
                      >
                        Kembali
                      </button>
                      <button 
                        v-if="!isPreview" 
                        type="submit" 
                        class="btn btn-primary"
                        :disabled="loading || selectedEmployees.length === 0"
                      >
                        Preview
                      </button>
                      <button 
                        v-if="isPreview" 
                        type="button" 
                        class="btn btn-success"
                        @click="savePayroll"
                        :disabled="loading"
                      >
                        {{ isEdit ? 'Update' : 'Simpan' }}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Edit Payroll Item Modal -->
    <Modal
      :is-open="showEditModal"
      :title="`Edit Detail Gaji ${currentEditItem?.name || ''}`"
      :is-loading="false"
      show-submit-button
      submit-button-text="Simpan Perubahan"
      close-button-text="Tutup"
      @close="closeEditModal"
      @submit="savePayrollItemChanges"
    >
      <template #content>
        <div v-if="currentEditItem" class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label>Nama Pegawai:</label>
              <p class="font-weight-bold">{{ currentEditItem.name }}</p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label>NIP:</label>
              <p class="font-weight-bold">{{ currentEditItem.employee_id }}</p>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="form-group">
              <label for="basicSalary">Gaji Pokok:</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">Rp</span>
                </div>
                <input
                  type="number"
                  id="basicSalary"
                  class="form-control"
                  v-model.number="currentEditItem.basic_salary"
                />
              </div>
            </div>
          </div>
          
          <div class="col-md-12">
            <h6 class="mt-3">Tunjangan</h6>
            <div class="row" v-for="(allowance, index) in currentEditItem.allowances" :key="'allowance-'+index">
              <div class="col-md-5">
                <div class="form-group">
                  <label :for="'allowanceName'+index">Nama Tunjangan:</label>
                  <input
                    type="text"
                    :id="'allowanceName'+index"
                    class="form-control"
                    v-model="allowance.name"
                  />
                </div>
              </div>
              <div class="col-md-5">
                <div class="form-group">
                  <label :for="'allowanceAmount'+index">Jumlah:</label>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">Rp</span>
                    </div>
                    <input
                      type="number"
                      :id="'allowanceAmount'+index"
                      class="form-control"
                      v-model.number="allowance.amount"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-2 d-flex align-items-center">
                <button 
                  type="button" 
                  class="btn btn-danger btn-sm mt-2"
                  @click="removeAllowance(index)"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-12">
                <button 
                  type="button" 
                  class="btn btn-sm btn-primary"
                  @click="addAllowance"
                >
                  <i class="fa fa-plus"></i> Tambah Tunjangan
                </button>
              </div>
            </div>
            
            <h6 class="mt-3">Potongan</h6>
            <div class="row" v-for="(deduction, index) in currentEditItem.deductions" :key="'deduction-'+index">
              <div class="col-md-5">
                <div class="form-group">
                  <label :for="'deductionName'+index">Nama Potongan:</label>
                  <input
                    type="text"
                    :id="'deductionName'+index"
                    class="form-control"
                    v-model="deduction.name"
                  />
                </div>
              </div>
              <div class="col-md-5">
                <div class="form-group">
                  <label :for="'deductionAmount'+index">Jumlah:</label>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">Rp</span>
                    </div>
                    <input
                      type="number"
                      :id="'deductionAmount'+index"
                      class="form-control"
                      v-model.number="deduction.amount"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-2 d-flex align-items-center">
                <button 
                  type="button" 
                  class="btn btn-danger btn-sm mt-2"
                  @click="removeDeduction(index)"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-12">
                <button 
                  type="button" 
                  class="btn btn-sm btn-primary"
                  @click="addDeduction"
                >
                  <i class="fa fa-plus"></i> Tambah Potongan
                </button>
              </div>
            </div>
            
            <div class="row mt-4">
              <div class="col-md-12">
                <div class="alert alert-info">
                  <div class="d-flex justify-content-between">
                    <strong>Total Gaji:</strong>
                    <strong>Rp {{ formatNumber(calculateNetSalary(currentEditItem)) }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import useAxios from "@/composables/axios";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const Breadcrumbs = defineAsyncComponent(() => import("@/layout/BreadCrumbs.vue"));
const Loader = defineAsyncComponent(() => import("@/components/common/Loader.vue"));
const BaseSelect = defineAsyncComponent(() => import("@/components/common/Select.vue"));
const DatePicker = defineAsyncComponent(() => import("@/components/common/DateTimePicker.vue"));
const Modal = defineAsyncComponent(() => import("@/components/common/Modal.vue"));

const router = useRouter();
const route = useRoute();
const { get, post, put } = useAxios();

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

interface FormData {
  id?: string;
  template_id: string;
  period: string;
  status: string;
  total_amount: number;
}

// Reactive data
const loading = ref(false);
const isPreview = ref(false);
const isEdit = ref(false);
const templates = ref<any[]>([]);
const employees = ref<any[]>([]);
const selectedEmployees = ref<string[]>([]);
const payrollData = ref<PayrollItem[]>([]);
const currentEditIndex = ref(-1);
const currentEditItem = ref<PayrollItem | null>(null);
const showEditModal = ref(false);
const formSubmitted = ref(false);
const periodDate = ref<Date>(new Date());

const form = ref<FormData>({
  template_id: "",
  period: dayjs().format("YYYY-MM"),
  status: "draft",
  total_amount: 0,
});

// Computed properties
const breadCrumbs = computed(() => {
  return [
    { title: "HCM", to: { name: "HCM" } },
    { title: "Payroll", to: { name: "Payroll" } },
    { title: "Generate", to: { name: "GeneratePayroll" } },
    { title: isEdit.value ? "Edit" : "Baru", active: true },
  ];
});

// Fetch templates for dropdown
const fetchTemplates = async () => {
  try {
    loading.value = true;
    // Use the correct API endpoint that works in the template listing
    const response = await get("/payroll_component_template", {
      params: {
        // Only get active templates
        is_active: 1
      }
    });
    if (response.success) {
      templates.value = response.data.data || [];
    } else {
      showErrorToast(response.message || "Gagal mengambil data template");
    }
  } catch (error) {
    console.error("Error fetching templates:", error);
    showErrorToast("Terjadi kesalahan saat mengambil data template");
  } finally {
    loading.value = false;
  }
};

// Handle template change
const handleChangeTemplate = (template: any) => {
  if (template) {
    form.value.template_id = template.id;
    fetchEmployees();
  } else {
    form.value.template_id = "";
    employees.value = [];
  }
};

// Handle period change
const handleChangePeriod = (date: string) => {
  periodDate.value = new Date(date);
  form.value.period = dayjs(date).format("YYYY-MM");
};

// Fetch employees based on the selected template
const fetchEmployees = async () => {
  if (!form.value.template_id) return;
  
  loading.value = true;
  try {
    // Adjust to use your actual API endpoint
    const response = await get(`/employee/search`);
    if (response.success) {
      employees.value = response.data || [];
    } else {
      showErrorToast(response.message || "Gagal mengambil data pegawai");
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
    showErrorToast("Terjadi kesalahan saat mengambil data pegawai");
  } finally {
    loading.value = false;
  }
};

// Check if we are in edit mode
const checkEditMode = async () => {
  const id = route.params.id;
  const edit = route.query.edit === "true";
  
  if (id) {
    isEdit.value = edit;
    await fetchPayrollDetails(id as string);
  }
};

// Fetch payroll details if in edit mode
const fetchPayrollDetails = async (id: string) => {
  loading.value = true;
  try {
    const response = await get(`/payroll/show/${id}`);
    if (response.success) {
      const data = response.data;
      
      form.value = {
        id: data.id,
        template_id: data.template_id,
        period: data.period,
        status: data.status,
        total_amount: data.total_amount,
      };
      
      payrollData.value = data.items || [];
      isPreview.value = true;
      
      // If viewing/editing existing payroll, we set the selected employees
      if (isEdit.value) {
        const employeeIds = payrollData.value.map(item => item.id || "");
        selectedEmployees.value = employeeIds.filter(id => id);
      }
    } else {
      showErrorToast(response.message || "Gagal mengambil detail payroll");
      router.push({ name: "GeneratePayroll" });
    }
  } catch (error) {
    console.error("Error fetching payroll details:", error);
    showErrorToast("Terjadi kesalahan saat mengambil detail payroll");
    router.push({ name: "GeneratePayroll" });
  } finally {
    loading.value = false;
  }
};

// Generate payroll preview
const previewPayroll = async () => {
  if (selectedEmployees.value.length === 0) {
    showErrorToast("Pilih minimal satu pegawai");
    return;
  }
  
  formSubmitted.value = true;
  if (!form.value.template_id || !form.value.period) {
    showErrorToast("Pastikan semua form telah diisi");
    return;
  }

  loading.value = true;
  try {
    // Adjust to use your actual API endpoint
    const response = await post("/payroll/preview", {
      template_id: form.value.template_id,
      period: form.value.period,
      employee_ids: selectedEmployees.value,
    });
    
    if (response.success) {
      payrollData.value = response.data || [];
      isPreview.value = true;
      
      // Calculate total amount
      form.value.total_amount = payrollData.value.reduce((total, item) => total + item.net_salary, 0);
    } else {
      showErrorToast(response.message || "Gagal membuat preview gaji");
    }
  } catch (error) {
    console.error("Error generating preview:", error);
    showErrorToast("Terjadi kesalahan saat membuat preview gaji");
  } finally {
    loading.value = false;
  }
};

// Save payroll to database
const savePayroll = async () => {
  loading.value = true;
  
  try {
    const payload = {
      id: form.value.id,
      template_id: form.value.template_id,
      period: form.value.period,
      status: form.value.status,
      total_amount: form.value.total_amount,
      items: payrollData.value,
    };
    
    let response;
    if (isEdit.value) {
      // Adjust to use your actual API endpoint
      response = await put(`/payroll/update/${form.value.id}`, payload);
      if (response.success) {
        showSuccessToast(response.message || "Payroll berhasil diperbarui");
      } else {
        showErrorToast(response.message || "Gagal memperbarui payroll");
      }
    } else {
      // Adjust to use your actual API endpoint
      response = await post("/payroll/store", payload);
      if (response.success) {
        showSuccessToast(response.message || "Payroll berhasil disimpan");
      } else {
        showErrorToast(response.message || "Gagal menyimpan payroll");
      }
    }
    
    router.push({ name: "GeneratePayroll" });
  } catch (error) {
    console.error("Error saving payroll:", error);
    showErrorToast("Terjadi kesalahan saat menyimpan data payroll");
  } finally {
    loading.value = false;
  }
};

// Edit payroll item in the preview
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
  
  // Calculate totals
  const totalAllowance = currentEditItem.value.allowances.reduce(
    (sum, allowance) => sum + Number(allowance.amount), 0
  );
  
  const totalDeduction = currentEditItem.value.deductions.reduce(
    (sum, deduction) => sum + Number(deduction.amount), 0
  );
  
  const netSalary = Number(currentEditItem.value.basic_salary) + totalAllowance - totalDeduction;
  
  // Update the item
  const updatedItem = {
    ...currentEditItem.value,
    total_allowance: totalAllowance,
    total_deduction: totalDeduction,
    net_salary: netSalary
  };
  
  // Replace the item in the array
  payrollData.value.splice(currentEditIndex.value, 1, updatedItem);
  
  // Recalculate total
  form.value.total_amount = payrollData.value.reduce((total, item) => total + item.net_salary, 0);
  
  // Close modal
  showEditModal.value = false;
  currentEditItem.value = null;
  currentEditIndex.value = -1;
};

// Add/remove allowances & deductions in the edit modal
const addAllowance = () => {
  if (!currentEditItem.value) return;
  currentEditItem.value.allowances.push({ name: "", amount: 0 });
};

const removeAllowance = (index: number) => {
  if (!currentEditItem.value) return;
  currentEditItem.value.allowances.splice(index, 1);
};

const addDeduction = () => {
  if (!currentEditItem.value) return;
  currentEditItem.value.deductions.push({ name: "", amount: 0 });
};

const removeDeduction = (index: number) => {
  if (!currentEditItem.value) return;
  currentEditItem.value.deductions.splice(index, 1);
};

// Utility functions
const selectAll = () => {
  selectedEmployees.value = employees.value.map(emp => emp.id);
};

const deselectAll = () => {
  selectedEmployees.value = [];
};

const formatNumber = (number: number) => {
  if (!number && number !== 0) return "0";
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const calculateNetSalary = (item: PayrollItem) => {
  const totalAllowance = item.allowances.reduce((sum, allowance) => sum + Number(allowance.amount), 0);
  const totalDeduction = item.deductions.reduce((sum, deduction) => sum + Number(deduction.amount), 0);
  return Number(item.basic_salary) + totalAllowance - totalDeduction;
};

const goBack = () => {
  if (isPreview.value && !isEdit.value) {
    isPreview.value = false;
    return;
  }
  
  router.push({ name: "GeneratePayroll" });
};

// Watch for template change to fetch employees
watch(() => form.value.template_id, (newValue) => {
  if (newValue) {
    fetchEmployees();
    if (!isEdit.value) {
      selectedEmployees.value = []; // Reset selected employees when template changes
    }
  }
});

onMounted(() => {
  fetchTemplates();
  checkEditMode();
});
</script>