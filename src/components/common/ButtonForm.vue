<template>
  <div class="d-flex justify-content-end gap-3">
    <button
      class="btn btn-outline-secondary"
      type="button"
      @click="emit('onBack')"
      :disabled="props.isLoading"
    >
      Kembali
    </button>
    <button
      v-if="props.mode !== 'detail'"
      class="btn btn-primary"
      type="submit"
      :disabled="props.isLoading"
    >
      Simpan
    </button>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  isLoading: { type: Boolean, default: false },
  mode: { type: String, default: "add" },
});

const emit = defineEmits(["onBack"]);
</script>
