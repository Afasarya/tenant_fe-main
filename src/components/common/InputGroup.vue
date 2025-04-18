<template>
  <div class="input-group">
    <slot name="left" />
    <input
      v-bind="props"
      class="form-control"
      :class="inputStyle"
      placeholder=""
      :value="inputText"
      :disabled="disabledInput"
      @change="(val) => handleChange(val)"
    />
    <slot name="right" />
    <div class="invalid-feedback" v-if="showErrorMessage">
      {{ props.errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const emit = defineEmits(["change"]);

const props = defineProps({
  hasSubmitted: { type: Boolean, default: false },
  disabledInput: { type: Boolean, default: false },
  value: { type: [String, Number], default: "" },
  type: { type: String, default: "text" },
  errorMessage: { type: String, default: "" },
  required: { type: Boolean, default: false },
});

const inputText = ref(props.value);

const inputStyle = computed(() => {
  if (props.hasSubmitted && props.required) {
    if (!inputText.value) return "is-invalid";
    else return "is-valid";
  }

  return "";
});

const showErrorMessage = computed(() => {
  return !inputText.value && props.hasSubmitted && props.required;
});

const handleChange = (val: any) => {
  inputText.value = val?.target?.value ?? "";
  emit("change", inputText.value);
};
</script>
