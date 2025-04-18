<template>
  <div
    class="modal fade"
    :class="{ show: props.isOpen }"
    tabindex="-1"
    role="dialog"
    aria-labelledby="tooltipmodal"
    aria-hidden="!props.isOpen"
    @click.self="closeModal"
  >
    <div class="modal-dialog custom-modal-position" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            {{ title }}
          </h4>
          <button
            class="btn-close py-0"
            type="button"
            @click.self="closeModal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <slot name="content" />
        </div>
        <div class="modal-footer">
          <button
            v-if="showClosedButton"
            class="btn btn-outline-info"
            type="button"
            @click="closeModal"
            :disabled="isLoading"
          >
            {{ closeButtonText }}
          </button>
          <button
            v-if="showSubmitButton"
            class="btn btn-primary"
            type="button"
            @click="onSubmit()"
            :disabled="isLoading || isDisabled"
          >
            {{ submitButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String },
  showClosedButton: { type: Boolean, default: true },
  showSubmitButton: { type: Boolean, default: true },
  closeButtonText: { type: String, default: "Batal" },
  submitButtonText: { type: String, default: "Simpan" },
  isLoading: { type: Boolean, default: false },
  isDisabled: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "submit"]);

const closeModal = () => emit("close");
const onSubmit = () => emit("submit");
</script>

<style>
.modal.show {
  display: block;
  background: rgba(0, 0, 0, 0.5);
}

.custom-modal-position {
  position: relative;
  top: 3%;
  transform: translateY(-20%);
}
</style>
