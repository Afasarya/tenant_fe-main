<template>
  <div class="card container-fluid p-4">
    <Loader v-if="loading && mode !== 'add'" />
    <form
      v-else
      class="row g-3 needs-validation custom-input"
      novalidate
      @submit.prevent="onSubmit()"
    >
      <div class="col-12">
        <label class="form-label"> Nama Template </label>
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

      <div class="col-12">
        <label class="form-label"> Deskripsi </label>
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

      <div class="col-12">
        <label class="form-label"> Tanggal Efektif </label>
        <DateTimePicker
          :value="effectiveDate"
          :disabled-input="disabledInput || isSubmitting"
          @change="handleEffectiveDate"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Status </label>
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

      <div class="col-12" v-if="mode !== 'add'">
        <h4 class="mt-3">Komponen Template</h4>
        <Table
          v-bind="componentTableConfig"
          :deleteFn="onDeleteComponent"
          @add="onAddComponent"
          @edit="onEditComponent"
          @update-pagination="onChangeComponentPagination"
        >
          <template #footer v-if="componentTableConfig.items.length > 0">
            <td colspan="5" class="text-end fw-bold border-top border-bottom">
              <div class="d-flex gap-4 justify-content-end">
                <span>Total</span>
                <span>{{ totalComponent }}</span>
              </div>
            </td>
          </template>
        </Table>
      </div>

      <ButtonForm :is-loading="isSubmitting" :mode="mode" @on-back="onBack" />
    </form>

    <!-- Modal for Component -->
    <div
      class="modal fade"
      id="componentModal"
      tabindex="-1"
      aria-labelledby="componentModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="componentModalLabel">{{ modalTitle }}</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Komponen</label>
              <BaseSelect
                :disabled-input="isSubmittingComponent"
                error-message="Silahkan pilih komponen"
                :has-submitted="componentFormSubmitted"
                :options="componentList"
                :value="componentForm.component_id"
                required
                @change="(val: any) => componentForm.component_id = val?.id"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Nilai</label>
              <CurrencyInput
                v-model="componentForm.value"
                :has-submitted="componentFormSubmitted"
                :disabled-input="isSubmittingComponent"
                required
                error-message="Silahkan isi nilai komponen"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Tipe</label>
              <BaseSelect
                :disabled-input="isSubmittingComponent"
                error-message="Silahkan pilih tipe"
                :has-submitted="componentFormSubmitted"
                :options="typeOptions"
                :value="componentForm.type"
                required
                @change="(val: any) => componentForm.type = val?.id"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              :disabled="isSubmittingComponent"
            >
              Tutup
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="saveComponent"
              :disabled="isSubmittingComponent"
            >
              {{ isEditingComponent ? 'Ubah' : 'Tambah' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref, reactive } from "vue";
import { validate, forms, formSubmitted } from "./form";
import { useRoute, useRouter } from "vue-router";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import { viewMode } from "@/composables/viewMode";
import useAxios from "@/composables/axios";
import { statusOption } from "./data";
import dayjs from "dayjs";
import * as bootstrap from 'bootstrap';

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
const CurrencyInput = defineAsyncComponent(
  () => import("@/components/common/CurrencyInput.vue")
);
const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);

const router = useRouter();
const route = useRoute();
const mode = ref<string>("add");
const loading = ref(false);
const isSubmitting = ref(false);
const id = ref(route?.params?.id ?? "");
const effectiveDate = ref(new Date());
const { post, get, put, remove } = useAxios();

// Component Form
const componentList = ref<any>([]);
const typeOptions = ref([
  { id: 'fixed', name: 'Fixed' },
  { id: 'percentage', name: 'Percentage' }
]);

const componentForm = ref({
  id: "",
  component_id: "",
  value: 0,
  type: "fixed"
});

const componentFormSubmitted = ref(false);
const isSubmittingComponent = ref(false);
const isEditingComponent = ref(false);
const modalTitle = ref("Tambah Komponen");

// Component table
const componentTableColumns = {
  component_name: { label: "Nama Komponen" },
  value: { label: "Nilai" },
  type: { label: "Tipe" },
};

type ComponentItem = {
  id: string | number;
  component_id: string | number;
  value: number;
  type: string;
  component_name?: string;
};

const componentTableConfig = reactive<{
  buttonName: string;
  items: ComponentItem[];
  columns: typeof componentTableColumns;
  pagination: {
    page: number;
    pageSize: number;
    totalData: number;
    totalPage: number;
  };
  loading: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  hasAction: boolean;
}>({
  buttonName: "Tambah Komponen",
  items: [],
  columns: componentTableColumns,
  pagination: {
    page: 1,
    pageSize: 10,
    totalData: 1,
    totalPage: 1,
  },
  loading: false,
  canCreate: true,
  canEdit: true,
  canDelete: true,
  hasAction: true,
});

const onBack = () => {
  router.push("/hcm/payroll/template");
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onCreate = async (payload: any) => {
  return await post("/payroll/components_template/store", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/payroll/components_template/update/${id}`, { ...payload });
};

const onSubmit = async () => {
  isSubmitting.value = true;
  forms.value = {
    ...forms.value,
    effective_date: dayjs(effectiveDate.value).format("YYYY-MM-DD"),
  };

  const check = validate();
  if (check) {
    const { message, success } =
      mode.value === "add"
        ? await onCreate(forms.value)
        : await onUpdate(forms.value, id.value);

    if (success) {
      showSuccessToast(message ?? "Data template payroll berhasil disimpan");
      setTimeout(() => router.push("/hcm/payroll/template"), 1000);
    } else showErrorToast(message ?? "Gagal menyimpan data");
    isSubmitting.value = false;
  } else isSubmitting.value = false;
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
  };
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(`/payroll/components_template/${id.value}`);
  if (success) {
    forms.value = {
      ...data,
      status: data?.status === 1,
    };
    if (data?.effective_date) {
      effectiveDate.value = new Date(data.effective_date);
    }
    // Fetch components
    fetchTemplateComponents();
  } else showErrorToast(message ?? "Gagal load data");

  loading.value = false;
};

const fetchPayrollComponents = async () => {
  const { data, success } = await get("/payroll/components/search");
  if (success) componentList.value = data;
};

// Component Methods
const fetchTemplateComponents = async () => {
  componentTableConfig.loading = true;
  const { data, success, message } = await get(`/payroll/components_template/detail/${id.value}`);
  if (success) {
    componentTableConfig.items = data?.data?.map((item: any) => {
      return {
        ...item,
        value: Number(item.value),
        component_name: item.component?.name || '-'
      };
    }) || [];
    componentTableConfig.pagination.totalData = data?.total || 1;
    componentTableConfig.pagination.totalPage = data?.last_page || 1;
  } else {
    showErrorToast(message ?? "Gagal memuat data komponen");
  }
  componentTableConfig.loading = false;
};

const totalComponent = computed(() => {
  return componentTableConfig.items.filter(item => item.type === 'fixed')
    .reduce((sum, item) => sum + Number(item.value), 0).toLocaleString('id-ID');
});

const onAddComponent = () => {
  componentForm.value = {
    id: "",
    component_id: "",
    value: 0,
    type: "fixed"
  };
  componentFormSubmitted.value = false;
  isEditingComponent.value = false;
  modalTitle.value = "Tambah Komponen";
  
  const modal = new bootstrap.Modal(document.getElementById('componentModal'));
  modal.show();
};

const onEditComponent = (componentId: string | number) => {
  const component = componentTableConfig.items.find(item => item.id === componentId);
  if (component) {
    componentForm.value = {
      id: String(component.id),
      component_id: String(component.component_id),
      value: component.value,
      type: component.type
    };
    isEditingComponent.value = true;
    modalTitle.value = "Ubah Komponen";
    
    const modal = new bootstrap.Modal(document.getElementById('componentModal'));
    modal.show();
  }
};

const onDeleteComponent = async (componentId: string | number) => {
  return await remove(`/payroll/components_template/detail/delete/${componentId}`);
};

const saveComponent = async () => {
  componentFormSubmitted.value = true;
  
  if (componentForm.value.component_id && componentForm.value.value) {
    isSubmittingComponent.value = true;
    
    const payload = {
      ...componentForm.value,
      template_id: id.value
    };
    
    let response;
    if (isEditingComponent.value) {
      response = await put(`/payroll/components_template/detail/update/${componentForm.value.id}`, payload);
    } else {
      response = await post("/payroll/components_template/detail/store", payload);
    }
    
    if (response.success) {
      showSuccessToast(response.message || "Komponen berhasil disimpan");
      document.getElementById('componentModal')?.querySelector('.btn-close')?.dispatchEvent(new Event('click'));
      fetchTemplateComponents();
    } else {
      showErrorToast(response.message || "Gagal menyimpan komponen");
    }
    
    isSubmittingComponent.value = false;
  }
};

const onChangeComponentPagination = (page: number, perPage: number) => {
  componentTableConfig.pagination.page = page;
  componentTableConfig.pagination.pageSize = perPage;
  fetchTemplateComponents();
};

onMounted(async () => {
  resetState();
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  if (mode.value !== "add") {
    fetchDetail();
  }
  
  fetchPayrollComponents();
});
</script>