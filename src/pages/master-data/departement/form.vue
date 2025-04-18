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
        <label class="form-label"> Nama Departemen </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.name"
          :disabled-input="disabledInput"
          required
          error-message="Silahkan isi nama departemen"
          @change="(val: string) => (forms.name = val)"
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

const BaseInput = defineAsyncComponent(
  () => import("@/components/common/Input.vue")
);
const ButtonForm = defineAsyncComponent(
  () => import("@/components/common/ButtonForm.vue")
);
const Loader = defineAsyncComponent(
  () => import("@/components/common/Loader.vue")
);

const router = useRouter();
const route = useRoute();
const mode = ref<string>("add");
const loading = ref(false);
const isSubmitting = ref(false);
const id = ref(route?.params?.id ?? "");
const { post, get, put } = useAxios();

const onBack = () => {
  router.push("/master/departemen");
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onCreate = async (payload: any) => {
  return await post("/department/store", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/department/update/${id}`, { ...payload });
};

const onSubmit = async () => {
  isSubmitting.value = true;
  const check = validate();
  if (check) {
    const payload = {
      name: forms.value.name,
    };

    const { message, success } =
      mode.value === "add"
        ? await onCreate(payload)
        : await onUpdate(payload, id.value);

    if (success) {
      showSuccessToast(message ?? "Master data departemen berhasil disimpan");
      setTimeout(() => router.push("/master/departemen"), 2000);
    } else showErrorToast(message ?? "Gagal menyimpan data departemen");
    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const resetState = () => {
  forms.value.name = "";
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(`/department/${id.value}`);
  if (success) {
    forms.value.name = data?.name;
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
