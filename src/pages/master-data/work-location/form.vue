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
        <label class="form-label"> Lokasi </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.name"
          :disabled-input="disabledInput"
          required
          error-message="Silahkan isi lokasi kerja"
          @change="(val: string) => (forms.name = val)"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Nominal Tunjangan </label>
        <CurrencyInput
          v-model="forms.allowance"
          :has-submitted="formSubmitted"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan isi nominal tunjangan"
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
import { convertCurrency } from "@/composables/helpers";

const BaseInput = defineAsyncComponent(
  () => import("@/components/common/Input.vue")
);
const ButtonForm = defineAsyncComponent(
  () => import("@/components/common/ButtonForm.vue")
);
const Loader = defineAsyncComponent(
  () => import("@/components/common/Loader.vue")
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
const { post, get, put } = useAxios();

const onBack = () => {
  router.push("/master/lokasi_kerja");
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onCreate = async (payload: any) => {
  return await post("/worklocation/store", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/worklocation/update/${id}`, { ...payload });
};

const onSubmit = async () => {
  isSubmitting.value = true;
  const check = validate();
  if (check) {
    const { message, success } =
      mode.value === "add"
        ? await onCreate(forms.value)
        : await onUpdate(forms.value, id.value);

    if (success) {
      showSuccessToast(message ?? "Master data lokasi kerja berhasil disimpan");
      setTimeout(() => router.push("/master/lokasi_kerja"), 2000);
    } else showErrorToast(message ?? "Gagal menyimpan data");
    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const resetState = () => {
  forms.value.name = "";
  forms.value.allowance = 0;
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(`/worklocation/${id.value}`);
  if (success) {
    forms.value = {
      name: data?.name,
      allowance: Number(data?.allowance),
    };
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
