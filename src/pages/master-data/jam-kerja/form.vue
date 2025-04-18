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
        <label class="form-label"> Nama </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.name"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan isi nama jam kerja"
          @change="(val: string) => (forms.name = val)"
        />
      </div>

      <div class="col-6">
        <label class="form-label" for="startTime"> Jam Mulai </label>
        <DateTimePicker
          enable-time
          :value="startTime"
          :disabled-input="disabledInput || isSubmitting"
          @change="handleChangeStartTime"
        />
      </div>

      <div class="col-6">
        <label class="form-label" for="startTime"> Jam Akhir </label>
        <DateTimePicker
          enable-time
          :value="endTime"
          :disabled-input="disabledInput || isSubmitting"
          @change="handleChangeEndTime"
        />
      </div>

      <div class="col-6">
        <label class="form-label"> Status </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih status jam kerja"
          :has-submitted="formSubmitted"
          :options="statusOption"
          :value="forms.status"
          required
          @change="(val:any) => forms.status = val?.id || true"
        />
      </div>

      <ButtonForm :is-loading="isSubmitting" :mode="mode" @on-back="onBack" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { validate, forms, formSubmitted } from "./form";
import { useRoute, useRouter } from "vue-router";
import { statusOption } from "./data";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import { viewMode } from "@/composables/viewMode";
import useAxios from "@/composables/axios";
import dayjs from "dayjs";

const BaseInput = defineAsyncComponent(
  () => import("@/components/common/Input.vue")
);
const ButtonForm = defineAsyncComponent(
  () => import("@/components/common/ButtonForm.vue")
);
const DateTimePicker = defineAsyncComponent(
  () => import("@/components/common/DateTimePicker.vue")
);
const Loader = defineAsyncComponent(
  () => import("@/components/common/Loader.vue")
);
const BaseSelect = defineAsyncComponent(
  () => import("@/components/common/Select.vue")
);

const router = useRouter();
const route = useRoute();
const { post, get, put } = useAxios();

const mode = ref<string>("add");
const loading = ref(false);
const startTime = ref(new Date());
const endTime = ref(new Date());
const isSubmitting = ref(false);
const id = ref(route?.params?.id ?? "");

const onBack = () => {
  router.push("/master/jam_kerja");
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});
const handleChangeStartTime = (val: string) => {
  startTime.value = new Date(val);
};

const handleChangeEndTime = (val: string) => {
  endTime.value = new Date(val);
};

const onCreate = async (payload: any) => {
  return await post("/workinghour/store", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/workinghour/update/${id}`, { ...payload });
};

const onSubmit = async () => {
  isSubmitting.value = true;
  forms.value.startTime = dayjs(startTime.value).format("YYYY-MM-DD HH:mm:ss");
  forms.value.endTime = dayjs(endTime.value).format("YYYY-MM-DD HH:mm:ss");

  const check = validate();
  if (check) {
    const payload = {
      name: forms.value.name,
      start_time: forms.value.startTime,
      end_time: forms.value.endTime,
      status: forms.value.status,
    };

    const { message, success } =
      mode.value === "add"
        ? await onCreate(payload)
        : await onUpdate(payload, id.value);

    if (success) {
      showSuccessToast(message ?? "Master data jam kerja berhasil disimpan");
      setTimeout(() => router.push("/master/jam_kerja"), 2000);
    } else showErrorToast(message ?? "Gagal menyimpan data jam kerja");

    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const resetState = () => {
  forms.value.name = "";
  forms.value.status = true;
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(`/workinghour/${id.value}`);
  if (success) {
    forms.value = {
      ...forms.value,
      name: data?.name ?? "",
      startTime: data?.start_time,
      endTime: data?.end_time,
      status: data?.status,
    };
    startTime.value = dayjs(data?.start_time).toDate();
    endTime.value = new Date(data?.end_time);
  } else showErrorToast(message ?? "Gagal load data");

  loading.value = false;
};

onMounted(() => {
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  resetState();
  if (mode.value !== "add") fetchDetail();
});
</script>
