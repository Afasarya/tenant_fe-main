<template>
  <div>
    <input
      class="form-control"
      type="text"
      v-bind="props"
      :value="formattedValue"
      :disabled="disabledInput"
      :class="inputStyle"
      :placeholder="placeholder"
      @input="(e: any) => updateValue(e?.target?.value)"
    />
    <div class="invalid-feedback" v-if="showErrorMessage">
      {{ props.errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";

// Define props
const props = withDefaults(
  defineProps<{
    modelValue: number;
    hasSubmitted?: boolean;
    disabledInput?: boolean;
    errorMessage?: string;
    required?: boolean;
    placeholder?: string;
  }>(),
  {
    hasSubmitted: false,
    disabledInput: false,
    errorMessage: "",
    required: false,
    placeholder: "",
  }
);

// Define emits
const emit = defineEmits<{
  (event: "update:modelValue", value: number): void;
}>();

// Computed property for formatting value
const formattedValue = computed(() =>
  new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(props.modelValue)
);

const inputStyle = computed(() => {
  if (props.hasSubmitted && props.required) {
    if (!formattedValue.value || Number(formattedValue.value) == 0)
      return "is-invalid";
    else return "is-valid";
  }

  return "";
});

const showErrorMessage = computed(() => {
  return (
    Number(formattedValue.value) == 0 && props.hasSubmitted && props.required
  );
});

// Method to update value
const updateValue = (value: string) => {
  const numericValue = parseFloat(value.replace(/[^0-9]/g, "")) || 0;
  emit("update:modelValue", numericValue);
};
</script>
