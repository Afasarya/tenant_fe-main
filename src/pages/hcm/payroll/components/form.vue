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
        <label class="form-label"> Nama Komponen </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.name"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan isi nama komponen"
          @change="(val: string) => (forms.name = val)"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Deskripsi </label>
        <BaseInput
          as="textarea"
          :has-submitted="formSubmitted"
          :value="forms.description"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan isi deskripsi"
          @change="(val: string) => (forms.description = val)"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Tipe Komponen </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih tipe komponen"
          :has-submitted="formSubmitted"
          :options="typeOption"
          :value="forms.type_component"
          required
          @change="(val: any) => forms.type_component = val?.id ?? 'kredit'"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Tipe Nilai </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih tipe nilai"
          :has-submitted="formSubmitted"
          :options="valueTypeOption"
          :value="forms.type_value"
          required
          @change="(val: any) => forms.type_value = val?.id ?? 'fix'"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Nilai Default </label>
        <CurrencyInput
          v-model="forms.amount"
          :has-submitted="formSubmitted"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan isi nilai default"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Permanen </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih opsi permanen"
          :has-submitted="formSubmitted"
          :options="permanentOption"
          :value="forms.is_permanent"
          required
          @change="(val: any) => forms.is_permanent = val?.id ?? 1"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Kena Pajak </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih opsi kena pajak"
          :has-submitted="formSubmitted"
          :options="taxableOption"
          :value="forms.is_pajak"
          required
          @change="(val: any) => forms.is_pajak = val?.id ?? 0"
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
          @change="(val: any) => forms.status = val?.id ?? 'active'"
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
import { statusOption, typeOption, valueTypeOption, taxableOption, permanentOption } from "./data";
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

const onBack = () => {
  router.push({ name: "DaftarPayrollComponents" });
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onCreate = async (payload: any) => {
  return await post("/payroll_component/store", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/payroll_component/update/${id}`, { ...payload });
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
      showSuccessToast(message ?? "Komponen payroll berhasil disimpan");
      setTimeout(() => router.push({ name: "DaftarPayrollComponents" }), 1000);
    } else showErrorToast(message ?? "Gagal menyimpan data");
    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const resetState = () => {
  forms.value = {
    name: "",
    description: "",
    type_component: "kredit",
    type_value: "fix",
    amount: 0,
    is_permanent: 1,
    is_pajak: 0,
    status: "active"
  };
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(`/payroll_component/show/${id.value}`);
  if (success) {
    forms.value = {
      name: data?.name || "",
      description: data?.description || "",
      type_component: data?.type_component || "kredit",
      type_value: data?.type_value || "fix",
      amount: Number(data?.amount) || 0,
      is_permanent: data?.is_permanent || 1,
      is_pajak: data?.is_pajak || 0,
      status: data?.status || "active"
    };
  } else showErrorToast(message ?? "Gagal load data");

  loading.value = false;
};

onMounted(async () => {
  resetState();
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  if (mode.value !== "add") fetchDetail();
});
</script>