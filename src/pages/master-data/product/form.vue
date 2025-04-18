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
        <label class="form-label"> SKU </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.sku"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan isi SKU"
          @change="(val: string) => (forms.sku = val)"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Nama Barang / Jasa </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.name"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan isi nama barang / jasa"
          @change="(val: string) => (forms.name = val)"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Tipe </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih tipe"
          :has-submitted="formSubmitted"
          :options="productTypeOptions"
          :value="forms.type"
          required
          @change="(val: any) => forms.type = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Kategori </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih kategori"
          :has-submitted="formSubmitted"
          :options="categoryList"
          :value="forms.category_id"
          required
          @change="(val: any) => forms.category_id = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Unit </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih Unit"
          :has-submitted="formSubmitted"
          :options="unitList"
          :value="forms.unit_id"
          required
          @change="(val: any) => forms.unit_id = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> COA </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih COA"
          :has-submitted="formSubmitted"
          :options="coaList"
          :value="forms.chart_of_account_code"
          required
          @change="(val: any) => forms.chart_of_account_code = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Harga </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.price"
          :disabled-input="disabledInput || isSubmitting"
          required
          is-currency
          error-message="Silahkan isi harga barang"
          @change="(val: string) => (forms.price = val)"
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
          error-message="Silahkan isi deskripsi barang"
          @change="(val: string) => (forms.description = val)"
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
import { productTypeOptions } from "./data";
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
const BaseSelect = defineAsyncComponent(
  () => import("@/components/common/Select.vue")
);

const router = useRouter();
const route = useRoute();
const mode = ref<string>("add");
const loading = ref(false);
const isSubmitting = ref(false);
const id = ref(route?.params?.id ?? "");
const coaList = ref<any>([]);
const unitList = ref<any>([]);
const categoryList = ref<any>([]);

const { post, get, put } = useAxios();

const onBack = () => {
  router.push("/master/barang_jasa");
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onCreate = async (payload: any) => {
  return await post("/product/store", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/product/update/${id}`, { ...payload });
};

const onSubmit = async () => {
  isSubmitting.value = true;
  const check = validate();
  if (check) {
    const payload = {
      ...forms.value,
      price: Number(forms.value.price),
    };

    const { message, success } =
      mode.value === "add"
        ? await onCreate(payload)
        : await onUpdate(payload, id.value);

    if (success) {
      showSuccessToast(
        message ?? "Master data barang & jasa berhasil disimpan"
      );
      setTimeout(() => router.push("/master/barang_jasa"), 2000);
    } else showErrorToast(message ?? "Gagal menyimpan data");
    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const resetState = () => {
  forms.value = {
    name: "",
    sku: "",
    category_id: "",
    chart_of_account_code: "",
    description: "",
    price: "",
    type: "",
    unit_id: "",
  };
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(`/product/${id.value}`);
  if (success) {
    forms.value = {
      ...data,
      price: convertCurrency(parseFloat(data?.price).toString(), false, false),
    };
  } else showErrorToast(message ?? "Gagal load data");

  loading.value = false;
};

const fetchProductCategory = async () => {
  const { data, success } = await get("/productCategory/search");
  if (success) categoryList.value = data;
};

const fetchProductUnit = async () => {
  const { data, success } = await get("/unit/search");
  if (success) unitList.value = data;
};

const fetchCoa = async () => {
  const { data, success } = await get("/coa/search");
  if (success)
    coaList.value = data?.map((item: any) => {
      item.id = item?.code;
      return item;
    });
};
onMounted(async () => {
  resetState();
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  fetchProductCategory();
  fetchProductUnit();
  await fetchCoa();

  if (mode.value !== "add") fetchDetail();
});
</script>
