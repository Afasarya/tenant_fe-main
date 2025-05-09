<template>
  <div class="card container-fluid p-4">
    <Loader v-if="loading && mode !== 'add'" />
    <div v-else>
      <!-- Ganti form dengan div untuk menghindari submit otomatis -->
      <div class="row g-3 needs-validation custom-input">
        <div class="col-12 d-flex justify-content-between align-items-center">
          <h4>Template Payroll</h4>
          <button
            v-if="mode === 'detail'"
            type="button"
            class="btn btn-primary"
            @click="viewTemplateDetail"
          >
            Lihat Detail Komponen
          </button>
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label">Nama Template <span class="text-danger">*</span></label>
          <BaseInput
            type="text"
            :has-submitted="formSubmitted"
            :value="forms.name"
            :disabled-input="disabledInput || isSubmitting"
            required
            error-message="Silahkan isi nama template"
            @change="(val: string) => (forms.name = val)"
          />
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label">Deskripsi <span class="text-danger">*</span></label>
          <BaseInput
            type="text"
            :has-submitted="formSubmitted"
            :value="forms.description"
            :disabled-input="disabledInput || isSubmitting"
            required
            error-message="Silahkan isi deskripsi template"
            @change="(val: string) => (forms.description = val)"
          />
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label">Tanggal Efektif <span class="text-danger">*</span></label>
          <DateTimePicker
            :value="effectiveDate"
            :disabled-input="disabledInput || isSubmitting"
            @change="handleEffectiveDate"
          />
        </div>

        <div class="col-md-6 mb-3">
          <label class="form-label">Status</label>
          <BaseSelect
            :disabled-input="disabledInput || isSubmitting"
            error-message="Silahkan pilih status"
            :has-submitted="formSubmitted"
            :options="statusOption"
            :value="forms.status"
            required
            @change="(val:any) => handleStatus(val)"
          />
        </div>

        <div class="col-md-12">
          <label class="form-label">Komponen Gaji <span class="text-danger">*</span></label>
          
          <div class="row">
            <div class="col-md-6">
              <div class="card border mb-3">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                  <h6 class="mb-0">Komponen Pendapatan</h6>
                  <span class="text-muted small">{{ pendapatanKomponen.filter(c => isComponentSelected(c.id)).length }} terpilih</span>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-12" v-for="component in pendapatanKomponen" :key="component.id">
                      <div class="form-check mb-2">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          :id="`komponen-${component.id}`"
                          :value="component.id"
                          v-model="forms.selected_components"
                          :disabled="disabledInput || component.is_permanent === 1"
                        >
                        <label class="form-check-label" :for="`komponen-${component.id}`">
                          {{ component.name }}
                          <span class="badge bg-info ms-1" v-if="component.is_permanent === 1">Wajib</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-6">
              <div class="card border mb-3">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                  <h6 class="mb-0">Komponen Potongan</h6>
                  <span class="text-muted small">{{ potonganKomponen.filter(c => isComponentSelected(c.id)).length }} terpilih</span>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-12" v-for="component in potonganKomponen" :key="component.id">
                      <div class="form-check mb-2">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          :id="`komponen-${component.id}`"
                          :value="component.id"
                          v-model="forms.selected_components"
                          :disabled="disabledInput || component.is_permanent === 1"
                        >
                        <label class="form-check-label" :for="`komponen-${component.id}`">
                          {{ component.name }}
                          <span class="badge bg-info ms-1" v-if="component.is_permanent === 1">Wajib</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Update button section -->
        <div class="col-12 mt-3">
          <div class="d-flex justify-content-end">
            <button 
              type="button" 
              class="btn btn-secondary me-2" 
              @click="onBack"
              :disabled="isSubmitting"
            >
              Kembali
            </button>
            
            <button 
              v-if="mode !== 'detail'" 
              type="button"
              class="btn btn-primary"
              :disabled="isSubmitting"
              @click="handleSubmit"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import { validate, forms, formSubmitted } from "./form";
import { useRoute, useRouter } from "vue-router";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import { viewMode } from "@/composables/viewMode";
import useAxios from "@/composables/axios";
import { statusOption } from "./data";
import dayjs from "dayjs";

const BaseInput = defineAsyncComponent(
  () => import("@/components/common/Input.vue")
);
const Loader = defineAsyncComponent(
  () => import("@/components/common/Loader.vue")
);
const BaseSelect = defineAsyncComponent(
  () => import("@/components/common/Select.vue")
);
const DateTimePicker = defineAsyncComponent(
  () => import("@/components/common/DateTimePicker.vue")
);

const router = useRouter();
const route = useRoute();
const mode = ref<string>("add");
const loading = ref(false);
const isSubmitting = ref(false);
const id = ref(route?.params?.id ?? "");
const effectiveDate = ref(new Date());
const { post, get, put } = useAxios();

// Component lists
const payrollComponents = ref<any[]>([]);
const mandatoryComponentIds = ref<number[]>([]);

const pendapatanKomponen = computed(() => {
  return payrollComponents.value.filter(comp => comp.type_component === 'kredit');
});

const potonganKomponen = computed(() => {
  return payrollComponents.value.filter(comp => comp.type_component === 'debit');
});

// Helper function to check if a component is selected
const isComponentSelected = (componentId: number): boolean => {
  return forms.value.selected_components.includes(componentId) || mandatoryComponentIds.value.includes(componentId);
};

// Add a flag to prevent recursive updates
const isUpdatingComponents = ref(false);

// Modified watcher for selected_components to prevent recursion
watch(() => [...forms.value.selected_components], (newSelection) => {
  // Skip this update if we're already updating components
  if (isUpdatingComponents.value) return;
  
  try {
    isUpdatingComponents.value = true;
    
    const allComponents = [...newSelection];
    
    // Add any missing mandatory components
    mandatoryComponentIds.value.forEach(id => {
      if (!allComponents.includes(id)) {
        allComponents.push(id);
      }
    });
    
    // Update the selection only if it's different
    const newComponentSet = [...new Set(allComponents)];
    if (JSON.stringify(newComponentSet) !== JSON.stringify(forms.value.selected_components)) {
      forms.value.selected_components = newComponentSet;
    }
  } finally {
    isUpdatingComponents.value = false;
  }
}, { deep: true });

const onBack = () => {
  router.push({ name: "DaftarTemplatePayroll" });
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

// Tambahkan fungsi submit handler baru yang jelas
const handleSubmit = () => {
  console.log("Submit button clicked, calling onSubmit function");
  onSubmit();
};

const onSubmit = async () => {
  try {
    console.log("Form submission started");
    isSubmitting.value = true;
    
    // PERBAIKAN 1: Set effective_date SEBELUM validasi
    forms.value.effective_date = dayjs(effectiveDate.value).format("YYYY-MM-DD");
    forms.value.is_active = forms.value.status ? 1 : 0;
    
    // Set validation flag
    formSubmitted.value = true;
    
    // PERBAIKAN 2: Tambahkan validasi khusus untuk tanggal
    if (!effectiveDate.value) {
      showErrorToast("Harap pilih tanggal efektif");
      isSubmitting.value = false;
      return;
    }
    
    // Validate form
    if (!validate()) {
      console.log("Form validation failed");
      showErrorToast("Harap isi semua field yang diperlukan");
      isSubmitting.value = false;
      return;
    }
    
    // Ensure components are correctly assembled
    const allSelectedComponents = [...new Set([
      ...forms.value.selected_components,
      ...mandatoryComponentIds.value
    ])].filter(id => id !== null && id !== undefined);
    
    console.log("Final selected components:", allSelectedComponents);
    
    // PERBAIKAN 3: Cek komponen secara explisit
    if (allSelectedComponents.length === 0) {
      showErrorToast("Pilih minimal satu komponen payroll");
      isSubmitting.value = false;
      return;
    }
    
    // Prepare API payload with console logging at each step
    const apiPayload = {
      name: forms.value.name,
      description: forms.value.description,
      effective_date: forms.value.effective_date,
      is_active: forms.value.is_active,
      payroll_component_id: allSelectedComponents // Format yang benar untuk API
    };
    
    console.log("Sending API payload:", apiPayload);
    
    let response;
    
    // PERBAIKAN 4: Error handling yang lebih baik pada API calls
    try {
      // Use the correct endpoint based on the mode
      if (mode.value === "add") {
        console.log("Creating new template with API call to /payroll_component_template/store");
        response = await post("/payroll_component_template/store", apiPayload);
      } else {
        console.log(`Updating template ${id.value} with API call to /payroll_component_template/update/${id.value}`);
        response = await put(`/payroll_component_template/update/${id.value}`, apiPayload);
      }
      
      console.log("API response:", response);
      
      // Handle response
      if (response && response.success) {
        showSuccessToast("Template payroll berhasil disimpan");
        
        // Wait a moment before redirecting
        setTimeout(() => {
          console.log("Redirecting to template list page");
          router.push({ name: "DaftarTemplatePayroll" });
        }, 1000);
      } else {
        const errorMessage = response?.message || "Gagal menyimpan template payroll";
        console.error("API Error:", errorMessage);
        showErrorToast(errorMessage);
      }
    } catch (apiError) {
      console.error("API call failed:", apiError);
      showErrorToast("Gagal mengirim data ke server. Silakan coba lagi.");
    }
  } catch (error) {
    console.error("Error during form submission:", error);
    showErrorToast("Terjadi kesalahan saat menyimpan data");
  } finally {
    isSubmitting.value = false;
  }
};

const fetchPayrollComponents = async () => {
  try {
    const { data, success, message } = await get("/payroll_component/search");
    if (success && Array.isArray(data)) {
      // Store all valid components
      payrollComponents.value = data.filter(comp => comp && comp.id);
      
      // Store mandatory component IDs separately
      mandatoryComponentIds.value = payrollComponents.value
        .filter(comp => comp.is_permanent === 1)
        .map(comp => Number(comp.id));
      
      // Include mandatory components in the initial selection
      isUpdatingComponents.value = true; // Prevent watcher from firing
      forms.value.selected_components = [...mandatoryComponentIds.value];
      isUpdatingComponents.value = false; // Re-enable watcher
      
      console.log("Loaded payroll components:", payrollComponents.value.length);
      console.log("Mandatory components:", mandatoryComponentIds.value);
    } else {
      showErrorToast(message ?? "Gagal mengambil daftar komponen");
    }
  } catch (error) {
    console.error("Error fetching components:", error);
    showErrorToast("Terjadi kesalahan saat mengambil daftar komponen");
  }
};

const handleStatus = (val: any) => {
  // PERBAIKAN 6: Handling status yang lebih baik
  if (val && val.id !== undefined) {
    forms.value.status = val.id;
  } else {
    forms.value.status = true; // Default to active if invalid value
  }
  console.log("Status set to:", forms.value.status);
};

const handleEffectiveDate = (val: string) => {
  if (val) {
    effectiveDate.value = new Date(val);
    // PERBAIKAN 7: Update forms.effective_date whenever date changes
    forms.value.effective_date = dayjs(effectiveDate.value).format("YYYY-MM-DD");
    console.log("Effective date set to:", forms.value.effective_date);
  }
};

const resetState = () => {
  forms.value = {
    name: "",
    description: "",
    effective_date: dayjs(new Date()).format("YYYY-MM-DD"), // Set default date
    status: true,
    is_active: 1,
    selected_components: []
  };
  effectiveDate.value = new Date(); // Set default date picker value
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  try {
    // Get template details
    const { data, success, message } = await get(`/payroll_component_template/show/${id.value}`);
    if (!success || !data) {
      showErrorToast(message ?? "Gagal mengambil detail template");
      loading.value = false;
      return;
    }
    
    // Update form with template details
    forms.value = {
      name: data.name || "",
      description: data.description || "",
      effective_date: data.effective_date || dayjs(new Date()).format("YYYY-MM-DD"),
      status: data.is_active === 1,
      is_active: data.is_active || 1,
      selected_components: [] // Initialize as empty array (will be filled later)
    };
    
    if (data.effective_date) {
      effectiveDate.value = new Date(data.effective_date);
    }
    
    // First load all available components to get mandatory ones
    await fetchPayrollComponents();
    
    // Then load template components
    try {
      console.log(`Fetching components for template ID: ${id.value}`);
      const { data: componentData, success: compSuccess } = 
        await get(`/payroll_component_detail/${id.value}`);
      
      console.log("Raw template component data:", componentData);
      
      if (compSuccess && componentData && componentData.data) {
        // Check if we got proper data and log it
        console.log("Component data length:", componentData.data.length);
        
        // Extract component IDs, ensuring we handle different possible structures
        let templateComponentIds: number[] = [];
        
        if (Array.isArray(componentData.data)) {
          // Log a few components to debug their structure
          if (componentData.data.length > 0) {
            console.log("Sample component data:", componentData.data[0]);
          }
          
          // Try to extract component_id from each item
          templateComponentIds = componentData.data
            .filter(item => item && (item.component_id || item.payroll_component_id))
            .map(item => Number(item.component_id || item.payroll_component_id));
        }
        
        console.log("Retrieved template component IDs:", templateComponentIds);
        
        // Important: Create a fresh array of component IDs, merging mandatory and template components
        isUpdatingComponents.value = true; // Prevent watcher from firing
        
        // Start with mandatory components - those should always be included
        const allSelectedComponents = [...mandatoryComponentIds.value];
        
        // Add non-mandatory components that are part of this template
        templateComponentIds.forEach(id => {
          if (!allSelectedComponents.includes(id)) {
            allSelectedComponents.push(id);
          }
        });
        
        // Update the form with unique component IDs
        forms.value.selected_components = [...allSelectedComponents];
        
        isUpdatingComponents.value = false; // Re-enable watcher
        
        console.log("Final selected components:", forms.value.selected_components);
      } else {
        console.warn("No component data received or invalid format");
      }
    } catch (componentError) {
      console.error("Error loading template components:", componentError);
    }
  } catch (error) {
    console.error("Error fetching template details:", error);
    showErrorToast("Terjadi kesalahan saat mengambil detail template");
  } finally {
    loading.value = false;
  }
};

const viewTemplateDetail = () => {
  router.push(`/hcm/payroll/template-detail/${id.value}`);
};

// This function helps for debugging the component checkbox status
const checkComponentStatus = () => {
  console.log("Current components and their selection status:");
  
  payrollComponents.value.forEach(comp => {
    const isSelected = forms.value.selected_components.includes(comp.id);
    const isPermanent = comp.is_permanent === 1;
    console.log(`Component ${comp.name} (${comp.id}): ${isSelected ? 'Selected' : 'Not Selected'}, ${isPermanent ? 'Permanent' : 'Not Permanent'}`);
  });
};

// Call this after loading components to verify everything is working
watch(() => forms.value.selected_components, () => {
  // Log when selected components change
  console.log("Selected components changed:", forms.value.selected_components);
}, { deep: true });

onMounted(async () => {
  resetState();
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);
  
  console.log("Component mounted. Mode:", mode.value);
  
  // First fetch all payroll components (this also sets mandatory components)
  await fetchPayrollComponents();
  
  // Then fetch template details if not in add mode
  if (mode.value !== "add") {
    await fetchDetail();
    // After loading everything, check the component selection status
    setTimeout(checkComponentStatus, 500);
  }
});
</script>