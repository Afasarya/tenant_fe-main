<template>
  <div class="card container-fluid p-4">
    <form
      class="row g-3 needs-validation custom-input"
      novalidate
      @submit.prevent="onSubmit()"
    >
      <div class="col-12">
        <label class="form-label"> Nama Aset Kategori </label>
        <BaseInput
          type="text"
          :has-submitted="formSubmitted"
          :value="forms.name"
          :disabled-input="disabledInput"
          required
          error-message="Silahkan isi nama aset kategori"
          @change="(val) => (forms.name = val)"
        />
      </div>

      <ButtonForm :is-loading="loading" :mode="mode" @on-back="onBack" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
import { validate, forms, formSubmitted } from "./form";
import { useRouter } from "vue-router";
import { showSuccessToast } from "@/composables/toast";
import { viewMode } from "@/composables/viewMode";

const BaseInput = defineAsyncComponent(
  () => import("@/components/common/Input.vue")
);
const ButtonForm = defineAsyncComponent(
  () => import("@/components/common/ButtonForm.vue")
);
const router = useRouter();
const mode = ref<string>("add");
const loading = ref(false);

const onBack = () => {
  router.push("/master/aset_kategori");
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onSubmit = () => {
  loading.value = true;
  const check = validate();
  if (check) {
    showSuccessToast("Master data aset kategori berhasil disimpan");
    setTimeout(() => router.push("/master/aset_kategori"), 2000);
    loading.value = false;
  } else loading.value = false;
};

const resetState = () => {
  forms.value.name = "";
  formSubmitted.value = false;
};

onMounted(() => {
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  resetState();
});
</script>
