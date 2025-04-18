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
        <BaseSelect
          :disabled-input="
            disabledInput || isSubmitting || headerForms.project_id != ''
          "
          error-message="Silahkan pilih proyek"
          :has-submitted="formSubmitted"
          :options="projectList"
          :value="headerForms.project_id"
          @change="(val: any) => headerForms.project_id = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Tahun </label>
        <BaseSelect
          :disabled-input="disabledInput || isSubmitting"
          error-message="Silahkan pilih tahun anggaran"
          :has-submitted="formSubmitted"
          :options="years"
          :value="headerForms.year"
          required
          @change="(val: any) => headerForms.year = val?.id ?? ''"
        />
      </div>

      <div class="col-12">
        <label class="form-label"> Nomor Anggaran </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="headerForms.nomor"
          :disabled-input="disabledInput || isSubmitting"
          required
          error-message="Silahkan isi nomor anggaran"
          @change="(val: string) => (headerForms.nomor = val)"
        />
      </div>

      <ButtonForm :is-loading="isSubmitting" :mode="mode" @on-back="onBack" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
import { validateHeader, headerForms, formSubmitted } from "./form";
import { useRoute, useRouter } from "vue-router";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import { viewMode } from "@/composables/viewMode";
import useAxios from "@/composables/axios";
import { currentProjectId } from "@/composables/helpers";

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
const { post, get, put } = useAxios();
const projectList = ref<any>([]);
const currentYear = new Date().getFullYear();

const onBack = () => {
  router.push({ name: "DaftarAnggaran" });
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const years = Array.from({ length: 41 }, (_, i) => {
  const year = currentYear - 20 + i;
  return { id: year.toString(), name: year.toString() };
});

const onCreate = async (payload: any) => {
  return await post("/budget/storeYearBudget", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/budget/updateYearBudget/${id}`, { ...payload });
};

const onSubmit = async () => {
  isSubmitting.value = true;
  const check = validateHeader();
  if (check) {
    const payload = {
      ...headerForms.value,
      year: Number(headerForms.value.year),
      number: headerForms.value.nomor,
    };
    const { message, success } =
      mode.value === "add"
        ? await onCreate(payload)
        : await onUpdate(payload, id.value);

    if (success) {
      showSuccessToast(message ?? "Data Anggaran berhasil disimpan");
      setTimeout(() => router.push({ name: "DaftarAnggaran" }), 500);
    } else showErrorToast(message ?? "Gagal menyimpan data");
    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const resetState = () => {
  headerForms.value = {
    project_id: "",
    nomor: "",
    year: currentYear.toString(),
    project_value: 0,
  };
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(
    `/budget/showYearBudget/${id.value}`
  );
  if (success) {
    headerForms.value = {
      ...data,
      nomor: data?.number,
      project_id: data?.project_id,
    };
  } else showErrorToast(message ?? "Gagal load data");

  loading.value = false;
};

const fetchProject = async () => {
  const { data, success } = await get(`/project/search`);
  if (success) projectList.value = data;
};

onMounted(async () => {
  resetState();
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  await fetchProject();
  headerForms.value.project_id = currentProjectId.value;
  if (mode.value !== "add") fetchDetail();
});
</script>
