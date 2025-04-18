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
        <label class="form-label"> Bank </label>
        <BaseSelect
          :has-submitted="formSubmitted"
          :value="forms.bank_id"
          :options="banks"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan pilih bank"
          @change="(val: any) => (forms.bank_id = val?.id ?? '')"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Nama Rekening Bank </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.account_name"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan isi nama rekening bank"
          @change="(val: string) => (forms.account_name = val)"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Nomor Rekening Bank </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.account_number"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan isi nomor rekening bank"
          @change="(val: string) => (forms.account_number = val)"
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
const BaseSelect = defineAsyncComponent(
  () => import("@/components/common/Select.vue")
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
const banks = ref<any>([]);

const onBack = () => {
  router.push({ name: "DaftarRekeningBank" });
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onCreate = async (payload: any) => {
  return await post("/BankAccount/store", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/BankAccount/update/${id}`, { ...payload });
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
      showSuccessToast(message ?? "Data berhasil disimpan");
      setTimeout(() => onBack(), 1000);
    } else showErrorToast(message ?? "Gagal menyimpan data");
    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const resetState = () => {
  forms.value.bank_id = "";
  forms.value.account_name = "";
  forms.value.account_number = "";
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(`/BankAccount/show/${id.value}`);
  if (success) {
    forms.value = {
      ...data,
    };
  } else showErrorToast(message ?? "Gagal load data");

  loading.value = false;
};

const fetchBank = async () => {
  const { success, data, message } = await get("/BankAccount/bankSearch");
  if (success) banks.value = data;
  else showErrorToast(message ?? "Gagal load data");
};

onMounted(() => {
  fetchBank();
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  resetState();
  if (mode.value !== "add") fetchDetail();
});
</script>
