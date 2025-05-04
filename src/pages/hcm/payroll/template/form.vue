<template>
  <div class="card container-fluid p-4">
    <Loader v-if="loading && mode !== 'add'" />
    <form
      v-else
      class="row g-3 needs-validation custom-input"
      novalidate
      @submit.prevent="onSubmit()"
    >
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
              <div class="card-header bg-light">
                <h6 class="mb-0">Komponen Pendapatan</h6>
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
              <div class="card-header bg-light">
                <h6 class="mb-0">Komponen Potongan</h6>
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

      <ButtonForm :is-loading="isSubmitting" :mode="mode" @on-back="onBack" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
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
const ButtonForm = defineAsyncComponent(
  () => import("@/components/common/ButtonForm.vue")
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

const pendapatanKomponen = computed(() => {
  return payrollComponents.value.filter(comp => comp.type_component === 'kredit');
});

const potonganKomponen = computed(() => {
  return payrollComponents.value.filter(comp => comp.type_component === 'debit');
});

const onBack = () => {
  router.push({ name: "DaftarTemplatePayroll" });
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onCreate = async (payload: any) => {
  return await post("/payroll_component_template/store", payload);
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/payroll_component_template/update/${id}`, payload);
};

const fetchPayrollComponents = async () => {
  try {
    const { data, success, message } = await get("/payroll_component/search");
    if (success) {
      payrollComponents.value = data || [];
      
      // Auto-select mandatory components
      const mandatoryComponentIds = payrollComponents.value
        .filter(comp => comp.is_permanent === 1)
        .map(comp => comp.id);
      
      forms.value.selected_components = [...mandatoryComponentIds];
    } else {
      showErrorToast(message ?? "Gagal mengambil daftar komponen");
    }
  } catch (error) {
    console.error("Error fetching payroll components:", error);
    showErrorToast("Terjadi kesalahan saat mengambil daftar komponen");
  }
};

const onSubmit = async () => {
  isSubmitting.value = true;
  forms.value = {
    ...forms.value,
    effective_date: dayjs(effectiveDate.value).format("YYYY-MM-DD"),
    is_active: forms.value.status ? 1 : 0
  };

  const check = validate();
  if (check) {
    try {
      // Prepare the payload - separate template data and components
      const { selected_components, ...templateData } = forms.value;
      
      let templateResponse;
      if (mode.value === "add") {
        templateResponse = await onCreate(templateData);
      } else {
        templateResponse = await onUpdate(templateData, id.value);
      }

      if (templateResponse.success) {
        // If creating a new template, add the components
        if (mode.value === "add" && selected_components.length > 0) {
          const templateId = templateResponse.data.id;
          
          // Add each selected component to the template
          for (const componentId of selected_components) {
            await post("/payroll_component_detail/store", {
              template_id: templateId,
              component_id: componentId,
              value: 0, // Default value
              type: "fixed" // Default type
            });
          }
        }
        
        showSuccessToast(templateResponse.message ?? "Data template payroll berhasil disimpan");
        setTimeout(() => router.push({ name: "DaftarTemplatePayroll" }), 1000);
      } else {
        showErrorToast(templateResponse.message ?? "Gagal menyimpan data");
      }
    } catch (error) {
      console.error("Error submitting payroll template:", error);
      showErrorToast("Terjadi kesalahan saat menyimpan data");
    } finally {
      isSubmitting.value = false;
    }
  } else {
    isSubmitting.value = false;
  }
};

const handleStatus = (val: any) => {
  forms.value.status = val?.id;
};

const handleEffectiveDate = (val: string) => {
  effectiveDate.value = new Date(val);
};

const resetState = () => {
  forms.value = {
    name: "",
    description: "",
    effective_date: "",
    status: true,
    is_active: 1,
    selected_components: []
  };
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  try {
    // Fetch template details
    const { data, success, message } = await get(`/payroll_component_template/show/${id.value}`);
    if (success && data) {
      forms.value = {
        name: data.name || "",
        description: data.description || "",
        effective_date: data.effective_date || "",
        status: data.is_active === 1,
        is_active: data.is_active || 1,
        selected_components: []
      };
      
      if (data.effective_date) {
        effectiveDate.value = new Date(data.effective_date);
      }
      
      // Fetch template components
      const componentsResponse = await get(`/payroll_component_detail/${id.value}`);
      if (componentsResponse.success && componentsResponse.data.data) {
        forms.value.selected_components = componentsResponse.data.data
          .map((item: any) => item.component_id);
      }
    } else {
      showErrorToast(message ?? "Gagal mengambil detail template");
    }
  } catch (error) {
    console.error("Error fetching template:", error);
    showErrorToast("Terjadi kesalahan saat mengambil detail template");
  } finally {
    loading.value = false;
  }
};

const viewTemplateDetail = () => {
  router.push(`/hcm/payroll/template-detail/${id.value}`);
};

onMounted(async () => {
  resetState();
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);
  
  // First fetch all payroll components
  await fetchPayrollComponents();
  
  // Then fetch template details if not in add mode
  if (mode.value !== "add") {
    await fetchDetail();
  }
});
</script>