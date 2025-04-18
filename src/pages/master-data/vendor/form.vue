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
        <label class="form-label"> Nama Vendor / Subkon </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.name"
          :disabled-input="disabledInput"
          required
          error-message="Silahkan isi nama vendor / subkon"
          @change="(val: string) => (forms.name = val)"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> No. Telepon </label>
        <BaseInput
          type="number"
          :has-submitted="formSubmitted"
          :value="forms.phone?.toString()"
          :disabled-input="disabledInput"
          required
          error-message="Silahkan isi no telepon"
          @change="(val: string) => (forms.phone = val)"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Email </label>
        <BaseInput
          type="email"
          :has-submitted="formSubmitted"
          :value="forms.email"
          :disabled-input="disabledInput"
          error-message="Silahkan isi Email Vendor/Subkon"
          @change="(val: string) => (forms.email = val)"
          required
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Nomor Pajak </label>
        <BaseInput
          type="number"
          :has-submitted="formSubmitted"
          :value="forms.taxNumber?.toString()"
          :disabled-input="disabledInput"
          error-message="Silahkan isi nomor pajak"
          @change="(val: string) => (forms.taxNumber = val)"
          required
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Contact Person </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.contactPerson?.toString()"
          :disabled-input="disabledInput"
          error-message="Silahkan isi contact person"
          required
          @change="(val: string) => (forms.contactPerson = val)"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Tipe Vendor/Subkon </label>
        <BaseSelect
          :disabled-input="disabledInput"
          error-message="Silahkan pilih tipe vendor/Subkon"
          :has-submitted="formSubmitted"
          :options="vendorTypeOptions"
          :value="forms.type"
          required
          @change="(val: any) => forms.type = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Alamat </label>
        <BaseInput
          as="textarea"
          :has-submitted="formSubmitted"
          :value="forms.address"
          :disabled-input="disabledInput"
          required
          error-message="Silahkan isi alamat"
          @change="(val: string) => (forms.address = val)"
        />
      </div>

      <!-- <div class="col-6">
        <label class="form-label"> Status </label>
        <BaseSelect
          :disabled-input="disabledInput"
          error-message="Silahkan pilih status vendor"
          :has-submitted="formSubmitted"
          :options="statusVendorOption"
          :value="forms.status"
          required
          @change="(val:any) => forms.status = val?.id || true"
        />
      </div> -->

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
import { vendorTypeOptions } from "./data";
import useAxios from "@/composables/axios";

const BaseInput = defineAsyncComponent(
  () => import("@/components/common/Input.vue")
);
const ButtonForm = defineAsyncComponent(
  () => import("@/components/common/ButtonForm.vue")
);
const BaseSelect = defineAsyncComponent(
  () => import("@/components/common/Select.vue")
);
const Loader = defineAsyncComponent(
  () => import("@/components/common/Loader.vue")
);

const router = useRouter();
const route = useRoute();
const { post, get, put } = useAxios();

const mode = ref<string>("add");
const loading = ref(false);
const isSubmitting = ref(false);
const id = ref(route?.params?.id ?? "");

const onBack = () => {
  router.push("/master/vendor");
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onCreate = async (payload: any) => {
  return await post("/vendor/store", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/vendor/update/${id}`, { ...payload });
};

const onSubmit = async () => {
  isSubmitting.value = true;
  const check = validate();
  if (check) {
    const payload = {
      name: forms.value.name,
      address: forms.value.address,
      phone: forms.value.phone,
      email: forms.value.email,
      tax_number: forms.value.taxNumber,
      contact_person: forms.value.contactPerson,
      type: forms.value.type,
    };

    const { message, success } =
      mode.value === "add"
        ? await onCreate(payload)
        : await onUpdate(payload, id.value);

    if (success) {
      showSuccessToast(
        message ?? "Master data Vendor/Subkon berhasil disimpan"
      );
      setTimeout(() => router.push("/master/vendor"), 2000);
    } else showErrorToast(message ?? "Gagal menyimpan data jabatan");

    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const resetState = () => {
  forms.value = {
    address: "",
    contactPerson: "",
    email: "",
    name: "",
    phone: "",
    status: "aktif",
    taxNumber: "",
    type: "",
  };
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(`/vendor/${id.value}`);
  if (success) {
    forms.value = {
      ...forms.value,
      name: data?.name ?? "",
      address: data?.address ?? "",
      contactPerson: data?.contact_person ?? "",
      phone: data?.phone ?? "",
      email: data?.email ?? "",
      taxNumber: data?.tax_number ?? "",
      type: data?.type ?? "",
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
