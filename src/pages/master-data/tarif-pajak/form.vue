<template>
  <div class="card container-fluid p-4">
    <form
      class="row g-3 needs-validation custom-input"
      novalidate
      @submit.prevent="onSubmit()"
    >
      <div class="col-12">
        <label class="form-label"> Tipe Pajak </label>
        <BaseSelect
          :disabled-input="disabledInput"
          error-message="Silahkan pilih tipe pajak"
          :has-submitted="formSubmitted"
          :options="taxType"
          :value="forms.type.toString()"
          required
          @change="onChangeType"
        />
      </div>

      <div class="col-12">
        <label class="col-sm-12 col-form-label" for="rate"> Rate Pajak. </label>
        <InputGroup
          type="number"
          :has-submitted="formSubmitted"
          :value="forms.rate"
          :disabled-input="disabledInput"
          required
          error-message="Silahkan isi rate pajak"
          @change="(val: any) => (forms.rate = val)"
        >
          <template #right>
            <span class="input-group-text"> % </span>
          </template>
        </InputGroup>
      </div>

      <div class="col-12">
        <label class="form-label" for="description">Deskripsi</label>
        <BaseInput
          as="textarea"
          :has-submitted="formSubmitted"
          :value="forms.description"
          :disabled-input="disabledInput"
          required
          error-message="Silahkan isi deskripsi"
          @change="(val: string) => (forms.description = val)"
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
import { taxType } from "./dummy";
import { showSuccessToast } from "@/composables/toast";
import { viewMode } from "@/composables/viewMode";

const BaseSelect = defineAsyncComponent(
  () => import("@/components/common/Select.vue")
);
const ButtonForm = defineAsyncComponent(
  () => import("@/components/common/ButtonForm.vue")
);
const InputGroup = defineAsyncComponent(
  () => import("@/components/common/InputGroup.vue")
);
const BaseInput = defineAsyncComponent(
  () => import("@/components/common/Input.vue")
);

const router = useRouter();
const mode = ref<string>("add");
const loading = ref(false);

const onBack = () => {
  router.push("/master/pajak");
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onSubmit = () => {
  loading.value = true;
  const check = validate();
  if (check) {
    showSuccessToast("Master data tarif pajak berhasil disimpan");
    setTimeout(() => router.push("/master/pajak"), 2000);
    loading.value = false;
  } else loading.value = false;
};

const onChangeType = (data: any) => {
  forms.value.type = data?.id;
};

const resetState = () => {
  forms.value.type = "";
  forms.value.rate = "";
  forms.value.description = "";
  formSubmitted.value = false;
};

onMounted(() => {
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  resetState();
});
</script>
