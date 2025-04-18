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
        <label class="form-label"> Nama Pegawai </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.name"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan isi nama pegawai"
          @change="(val: string) => (forms.name = val)"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Jabatan </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih Jabatan"
          :has-submitted="formSubmitted"
          :options="positionList"
          :value="forms.position_id"
          required
          @change="(val: any) => forms.position_id = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Departemen </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih departemen"
          :has-submitted="formSubmitted"
          :options="departementList"
          :value="forms.department_id"
          required
          @change="(val: any) => forms.department_id = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Lokasi Kerja </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih lokasi kerja"
          :has-submitted="formSubmitted"
          :options="workLocationList"
          :value="forms.work_location_id"
          required
          @change="(val: any) => forms.work_location_id = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Jam Kerja </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih jam kerja"
          :has-submitted="formSubmitted"
          :options="workingHourList"
          :value="forms.workinghour_id"
          required
          @change="(val: any) => forms.workinghour_id = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Gaji </label>
        <CurrencyInput
          v-model="forms.salary"
          :has-submitted="formSubmitted"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan isi salary pegawai"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Status Tarif Efektif Rata-rata (TER) </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih status TER"
          :has-submitted="formSubmitted"
          :options="terStatusList"
          :value="forms.ter_statuses_id"
          required
          @change="(val: any) => forms.ter_statuses_id = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Tanggal Bergabung </label>
        <DateTimePicker
          :value="hireDate"
          :disabled-input="disabledInput || isSubmitting"
          @change="handleJoinDate"
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
import { statusOption } from "@/pages/master-data/jam-kerja/data";
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
const CurrencyInput = defineAsyncComponent(
  () => import("@/components/common/CurrencyInput.vue")
);

const router = useRouter();
const route = useRoute();
const mode = ref<string>("add");
const loading = ref(false);
const isSubmitting = ref(false);
const id = ref(route?.params?.id ?? "");
const positionList = ref<any>([]);
const departementList = ref<any>([]);
const workingHourList = ref<any>([]);
const hireDate = ref(new Date());
const workLocationList = ref<any>([]);
const terStatusList = ref<any>([]);

const { post, get, put } = useAxios();

const onBack = () => {
  router.push("/hcm/employee");
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onCreate = async (payload: any) => {
  return await post("/employee/create", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/employee/update/${id}`, { ...payload });
};

const onSubmit = async () => {
  isSubmitting.value = true;
  forms.value = {
    ...forms.value,
    hire_date: dayjs(hireDate.value).format("YYYY-MM-DD"),
  };

  const check = validate();
  if (check) {
    const { message, success } =
      mode.value === "add"
        ? await onCreate(forms.value)
        : await onUpdate(forms.value, id.value);

    if (success) {
      showSuccessToast(message ?? "Data pegawai berhasil disimpan");
      setTimeout(() => router.push("/hcm/employee"), 1000);
    } else showErrorToast(message ?? "Gagal menyimpan data");
    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const handleStatus = (val: any) => {
  forms.value.status = val?.id;
};

const resetState = () => {
  forms.value = {
    name: "",
    position_id: "",
    department_id: "",
    workinghour_id: "",
    salary: 0,
    hire_date: "",
    status: true,
    work_location_id: "",
    ter_statuses_id: "",
  };
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(`/employee/${id.value}`);
  if (success) {
    forms.value = {
      ...data,
      status: data?.status == 1 ? true : false,
      salary: Number(data?.salary),
    };
  } else showErrorToast(message ?? "Gagal load data");

  loading.value = false;
};

const handleJoinDate = (val: string) => {
  hireDate.value = new Date(val);
};

const fetchWorkingHour = async () => {
  const { data, success } = await get("/workinghour/search");
  if (success) workingHourList.value = data;
};

const fetchDepartement = async () => {
  const { data, success } = await get("/department/search");
  if (success) departementList.value = data;
};

const fetchPosition = async () => {
  const { data, success } = await get("/position/search");
  if (success) positionList.value = data;
};

const fetchWorkLocation = async () => {
  const { data, success } = await get("/worklocation/search");
  if (success) workLocationList.value = data;
};

const fetchTERStatus = async () => {
  const { data, success } = await get("/ter_status/search");
  if (success) terStatusList.value = data;
};

onMounted(async () => {
  resetState();
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  fetchTERStatus();
  fetchWorkingHour();
  fetchDepartement();
  fetchWorkLocation();
  await fetchPosition();

  if (mode.value !== "add") fetchDetail();
});
</script>
