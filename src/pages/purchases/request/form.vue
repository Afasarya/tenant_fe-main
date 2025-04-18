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
        <label class="form-label"> Nama Proyek </label>
        <BaseSelect
          :disabled-input="
            disabledInput || isSubmitting || headerForms.project_id !== ''
          "
          error-message="Silahkan pilih proyek"
          :has-submitted="formSubmitted"
          :options="projectList"
          :value="headerForms.project_id"
          @change="(val: any) => headerForms.project_id = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Tanggal Permintaan </label>
        <DatePicker
          :value="date"
          :disabled-input="disabledInput || isSubmitting"
          @change="handleSelectDate"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Ekpektasi Pengiriman Permintaan </label>
        <DatePicker
          :value="expectedDelivery"
          :disabled-input="disabledInput || isSubmitting"
          @change="handleChangeExpectationDeliveryDate"
        />
      </div>

      <div v-if="headerForms.project_id == ''" class="col-12">
        <label class="form-label"> Departemen </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih departemen"
          :has-submitted="formSubmitted"
          :options="departementList"
          :value="headerForms.department_id"
          @change="(val: any) => headerForms.department_id = val?.id ?? ''"
        />
      </div>

      <ButtonForm :is-loading="isSubmitting" :mode="mode" @on-back="onBack" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
import { validateHeader, headerForms, formSubmitted } from "./form";
import { useRoute, useRouter } from "vue-router";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import { viewMode } from "@/composables/viewMode";
import useAxios from "@/composables/axios";
import { currentProjectId } from "@/composables/helpers";
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
const DatePicker = defineAsyncComponent(
  () => import("@/components/common/DateTimePicker.vue")
);

const router = useRouter();
const route = useRoute();
const mode = ref<string>("add");
const loading = ref(false);
const isSubmitting = ref(false);
const id = ref(route?.params?.id ?? "");
const { post, get, put } = useAxios();
const projectList = ref<any>([]);
const date = ref(new Date());
const expectedDelivery = ref(new Date());
const departementList = ref<any>([]);

const onBack = () => {
  router.push({ name: "DaftarPermintaanPembelian" });
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onCreate = async (payload: any) => {
  return await post("/PurchaseRequest/store", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/PurchaseRequest/update/${id}`, { ...payload });
};

const onSubmit = async () => {
  isSubmitting.value = true;
  headerForms.value = {
    ...headerForms.value,
    date: dayjs(date.value).format("YYYY-MM-DD"),
    expected_delivery: dayjs(expectedDelivery.value).format("YYYY-MM-DD"),
  };
  const check = validateHeader();

  if (check) {
    const payload = {
      ...headerForms.value,
    };
    const { message, success } =
      mode.value === "add"
        ? await onCreate(payload)
        : await onUpdate(payload, id.value);

    if (success) {
      showSuccessToast(message ?? "Data berhasil disimpan");
      setTimeout(() => router.push({ name: "DaftarPermintaanPembelian" }), 500);
    } else showErrorToast(message ?? "Gagal menyimpan data");
    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const resetState = () => {
  headerForms.value = {
    project_id: "",
    number: "",
    date: "",
    expected_delivery: "",
    total: 0,
  };
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(
    `/PurchaseRequest/show/${id.value}`
  );
  if (success) {
    headerForms.value = {
      ...data,
      project_id: data?.project_id,
    };
    date.value = new Date(data?.date ?? "");
    expectedDelivery.value = new Date(data?.expected_delivery ?? "");
  } else showErrorToast(message ?? "Gagal load data");

  loading.value = false;
};

const fetchProject = async () => {
  const { data, success } = await get(`/project/search`);
  if (success) projectList.value = data;
};

const fetchDepartement = async () => {
  const { data, success } = await get(`/department/search`);
  if (success) departementList.value = data;
};

const handleSelectDate = (val: string) => {
  date.value = new Date(val);
};

const handleChangeExpectationDeliveryDate = (val: string) => {
  expectedDelivery.value = new Date(val);
};

onMounted(async () => {
  resetState();
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  fetchDepartement();
  await fetchProject();
  headerForms.value.project_id = currentProjectId.value;
  if (mode.value !== "add") fetchDetail();
});
</script>
