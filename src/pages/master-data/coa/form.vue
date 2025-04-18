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
        <label class="form-label"> Kode Akun </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.code"
          :disabled-input="disabledInput"
          required
          error-message="Silahkan isi kode akun"
          @change="(val: string) => (forms.code = val)"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Nama AKun </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.name"
          :disabled-input="disabledInput"
          required
          error-message="Silahkan isi nama akun"
          @change="(val: string) => (forms.name = val)"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Kategori AKun </label>
        <BaseSelect
          :disabled-input="disabledInput"
          error-message="Silahkan pilih kategori akun"
          :has-submitted="formSubmitted"
          :options="categoryOpt"
          :value="forms.categoryId"
          required
          @change="(val: any) => forms.categoryId = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Tipe AKun </label>
        <BaseSelect
          :disabled-input="disabledInput"
          error-message="Silahkan pilih tipe akun"
          :has-submitted="formSubmitted"
          :options="coaTypeOpt"
          :value="forms.type"
          required
          @change="(val: any) => forms.type = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Induk AKun </label>
        <BaseSelect
          :disabled-input="disabledInput"
          error-message="Silahkan pilih induk akun"
          :has-submitted="formSubmitted"
          :options="parentOpts"
          :value="forms.parentId"
          @change="(val: any) => forms.parentId = val?.id ?? ''"
        />
      </div>

      <div
        v-if="mode === 'detail' && forms.children && forms.children?.length > 0"
        class="col-12"
      >
        <label class="form-label"> Sub Akun </label>
        <Table v-bind="tableConfig">
          <template #custom-body>
            <RecursiveItems :items="forms?.children" :has-action="false" />
          </template>
        </Table>
      </div>

      <ButtonForm :is-loading="isSubmitting" :mode="mode" @on-back="onBack" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { validate, forms, formSubmitted } from "./form";
import { useRoute, useRouter } from "vue-router";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import { viewMode } from "@/composables/viewMode";
import { coaTypeOpt } from "./data";
import useAxios from "@/composables/axios";

const { get, post, put } = useAxios();

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
const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);
const RecursiveItems = defineAsyncComponent(
  () => import("./components/RecursiveItems.vue")
);

const router = useRouter();
const route = useRoute();
const mode = ref<string>("add");
const loading = ref(true);
const isSubmitting = ref(false);
const categoryOpt = ref([]);
const parentOpts = ref([]);
const id = ref(route?.params?.id);

const tableColumns = {
  code: { label: "Kode Akun" },
  name: { label: "Nama Akun" },
};
const tableConfig = reactive({
  columns: tableColumns,
  items: [],
  customBody: true,
  showNo: false,
  usePagination: false,
  canSearch: false,
  canCreate: false,
  hasAction: false,
});

const onBack = () => {
  router.push("/master/coa");
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const postCoa = async () => {
  return await post("/api/coa/create", {
    ...forms.value,
    category_id: forms.value.categoryId,
    parent: forms.value?.parentId ?? "",
    default: forms.value.type,
    deleteable: 0,
  });
};

const putCoa = async () => {
  return await put(`/api/coa/update/${id.value}`, {
    ...forms.value,
    category_id: forms.value.categoryId,
    parent: forms.value?.parentId ?? "",
    default: forms.value.type,
    deleteable: 0,
  });
};

const onSubmit = async () => {
  isSubmitting.value = true;
  const check = validate();
  if (check) {
    const response = mode.value === "add" ? await postCoa() : await putCoa();
    if (response?.success) {
      showSuccessToast("Master data COA berhasil disimpan");
      setTimeout(() => router.push("/master/coa"), 2000);
    } else {
      showErrorToast(response?.message ?? "Gagal menyimpan data");
    }

    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const resetState = () => {
  forms.value.name = "";
  forms.value.code = "";
  forms.value.categoryId = "";
  forms.value.parentId = "";
  formSubmitted.value = false;
};

const fetchCategoryCoa = async () => {
  const response = await get("/api/category_coa/list");
  categoryOpt.value = response ?? [];
};

const fetchParent = async () => {
  let data = [];
  const response = await get("/api/coa/search");
  if (mode.value === "edit")
    data = response.data?.filter((p: any) => p?.code !== id.value) ?? [];
  else data = response?.data ?? [];

  parentOpts.value = data?.map((item: any) => {
    return {
      ...item,
      id: item?.code ?? "",
    };
  });
};

const fetchDetailCOA = async () => {
  loading.value = true;
  const response = await get(`/api/coa/show/${id.value}`);

  forms.value = {
    ...response,
    categoryId: response?.category_id,
    type: response?.default,
    parentId: response?.parent,
  };

  loading.value = false;
};

const fetchCoaWithChild = async () => {
  const response = await get(`/api/coa/read/${id.value}`);
  const data = (response && response[0]) ?? [];

  forms.value = {
    ...data,
    categoryId: data?.category_id,
    type: data?.default,
    parentId: data?.parent,
    children: addIsOpenToObjects(data?.children),
  };
  tableConfig.items = forms.value.children as any;

  loading.value = false;
};
const addIsOpenToObjects = (arr: any, level = 1) => {
  return (
    arr.map((obj: any) => {
      obj["isOpen"] = true;
      obj["level"] = level;

      // Check if the object has children and recursively process them
      if (Array.isArray(obj.children) && obj.children.length > 0) {
        addIsOpenToObjects(obj.children, level + 1);
      }

      return obj;
    }) ?? []
  );
};

onMounted(async () => {
  resetState();
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  await fetchCategoryCoa();
  await fetchParent();

  if (mode.value === "edit") fetchDetailCOA();
  else if (mode.value === "detail") fetchCoaWithChild();
});
</script>
