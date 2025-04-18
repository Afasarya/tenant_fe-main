<template>
  <div class="col-12" :class="inputStyle">
    <div
      class="multiselect-wrapper"
      :class="[inputStyle, { 'is-disabled': props.disabledInput }]"
    >
      <multiselect
        v-model="selectedItem"
        required
        :disabled="props.disabledInput"
        label="name"
        track-by="id"
        :options="filteredOptions"
        :multiple="props.multiple"
        :searchable="true"
        :placeholder="placeholder"
        aria-label="null"
        selectLabel=""
        deselectLabel=""
        :allow-empty="true"
        @input="onClear"
      >
        <template #noResult>
          <div class="custom-no-result">Data tidak ditemukan</div>
        </template>
        <template #noOptions>
          <div class="custom-no-result">Data tidak ditemukan</div>
        </template>
        <!-- Custom options -->
        <template #option="{ option }">
          <slot name="option" :option="option">
            <!-- Default rendering if no slot option is provided -->
            <div>
              <span> {{ option?.name }} </span>
            </div>
          </slot>
        </template>
      </multiselect>
    </div>
    <div class="invalid-feedback" v-if="showErrorMessage">
      {{ props.errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

const emit = defineEmits(["change"]);

const props = defineProps({
  hasSubmitted: { type: Boolean, default: false },
  disabledInput: { type: Boolean, default: false },
  value: { type: [String, Number, Boolean], default: "" },
  errorMessage: { type: String, default: "" },
  required: { type: Boolean, default: false },
  options: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: false },
  placeholder: { type: String, default: "" },
});

const selectedItem = ref<any>(props.value);

const onClear = (value: any) => {
  if (value) selectedItem.value = null;
};

const inputStyle = computed(() => {
  if (props.hasSubmitted && props.required) {
    if (!selectedItem.value) return "is-invalid";
    else return "is-valid";
  }

  return "";
});

const filteredOptions = computed(() => {
  return props.options.filter(
    (option: any) => option.id !== selectedItem.value?.id
  );
  // return props.options;
});

const showErrorMessage = computed(() => {
  return !selectedItem.value && props.hasSubmitted && props.required;
});

watch(
  () => selectedItem.value,
  (val) => emit("change", val)
);
watch(
  () => props.value,
  (val) => {
    selectedItem.value = props.options.find((opt: any) => opt?.id == val);
  },
  { immediate: true }
);
watch(
  () => props.options,
  (options) => {
    selectedItem.value = options.find((opt: any) => opt?.id == props.value);
  },
  { immediate: true }
);
</script>

<style lang="css" scoped>
.multiselect-wrapper {
  border: 1px dashed rgba(106, 113, 133, 0.3);
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

/* Target nested elements using deep selector */
.multiselect-wrapper.is-invalid ::v-deep(.multiselect) {
  border: 1px dashed #dc3545 !important;
}

.is-disabled {
  background-color: #bdc2c7 !important;
  opacity: 1;
}

.multiselect__option--highlight::after {
  content: none !important;
  display: none !important;
}
</style>
