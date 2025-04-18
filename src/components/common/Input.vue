<template>
  <div>
    <component
      :is="props.as"
      v-bind="props"
      class="form-control"
      :class="inputStyle"
      :placeholder="placeholder"
      :value="inputText"
      :disabled="disabledInput"
      @input="handleChange"
      @blur="handleBlur"
    />
    <div class="invalid-feedback" v-if="showErrorMessage">
      {{ props.errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { convertCurrency } from "@/composables/helpers";
import { computed, ref, watch } from "vue";

const emit = defineEmits(["change"]);

const props = defineProps({
  hasSubmitted: { type: Boolean, default: false },
  disabledInput: { type: Boolean, default: false },
  value: { type: String || Number, default: "" },
  type: { type: String, default: "text" },
  errorMessage: { type: String, default: "" },
  required: { type: Boolean, default: false },
  as: { type: String, default: "input" },
  placeholder: { type: String, default: "" },
  isCurrency: { type: Boolean, default: false },
  isError: { type: Boolean, default: false },
});

const inputText = ref(props.value);

const inputStyle = computed(() => {
  if ((props.hasSubmitted && props.required) || props.isError) {
    if (!inputText.value || props.isError) return "is-invalid";
    else return "is-valid";
  }

  return "";
});

const showErrorMessage = computed(() => {
  return (
    (!inputText.value && props.hasSubmitted && props.required) || props.isError
  );
});

const handleChange = (event: any) => {
  const value = event?.target?.value ?? "";
  let checkValue = "";
  if (props.isCurrency) {
    const input = props.isCurrency ? value?.replace(/[^0-9.,]/g, "") : value;
    checkValue = input?.includes(".") ? input.replace(".", "") : input;
  } else checkValue = value;

  inputText.value = checkValue;

  event.target.value = checkValue;
  emit("change", inputText.value);
};

const handleBlur = (event: any) => {
  const value = event?.target?.value ?? "";
  const checkValue = value?.includes(".") ? value.replace(".", "") : value;

  event.target.value = props.isCurrency
    ? convertCurrency(checkValue, false, false)
    : checkValue;
};

watch(
  () => props.value,
  (val) => {
    inputText.value = val;
  },
  { immediate: true }
);
</script>
