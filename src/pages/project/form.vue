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
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.name"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan isi nama proyek"
          @change="(val: string) => (forms.name = val)"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Customer </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih customer"
          :has-submitted="formSubmitted"
          :options="customerList"
          :value="forms.customer_id"
          required
          @change="(val: any) => forms.customer_id = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Nominal Proyek </label>
        <CurrencyInput
          v-model="forms.nominal"
          :has-submitted="formSubmitted"
          :disabled-input="disabledInput"
          required
          error-message="Silahkan isi nominal proyek"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Alamat </label>
        <BaseInput
          as="textarea"
          :has-submitted="formSubmitted"
          :value="forms.address"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan isi alamat proyek"
          @change="(val: string) => (forms.address = val)"
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
const BaseSelect = defineAsyncComponent(
  () => import("@/components/common/Select.vue")
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
const customerList = ref<any>([]);

const onBack = () => {
  router.push({ name: "DaftarProyek" });
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onCreate = async (payload: any) => {
  return await post("/project/create", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/project/update/${id}`, { ...payload });
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
      showSuccessToast(message ?? "Data Proyek berhasil disimpan");
      setTimeout(() => router.push({ name: "DaftarProyek" }), 500);
    } else showErrorToast(message ?? "Gagal menyimpan data");
    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const resetState = () => {
  forms.value = {
    name: "",
    address: "",
    customer_id: "",
    nominal: 0,
  };
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(`/project/${id.value}`);
  if (success) {
    forms.value = {
      ...data,
      nominal: Number(data?.nominal),
    };
  } else showErrorToast(message ?? "Gagal load data");

  loading.value = false;
};

const fetchCustomer = async () => {
  const { data, success } = await get(`/customer/search`);
  if (success) customerList.value = data;
};

onMounted(async () => {
  resetState();
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  await fetchCustomer();
  if (mode.value !== "add") fetchDetail();
});
</script>
