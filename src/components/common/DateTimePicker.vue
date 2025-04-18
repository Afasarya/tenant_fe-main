<template>
  <div>
    <flat-pickr
      v-model="date"
      :config="config"
      class="form-control"
      @change="handleChange"
      :disabled="props.disabledInput"
    />
    <span
      v-if="showIcon"
      :class="`icon-${props.enableTime ? 'time' : 'calendar'}`"
    >
      <i />
    </span>
  </div>
</template>

<script setup lang="ts">
import FlatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { computed, ref } from "vue";

const props = defineProps({
  value: { type: Date, default: new Date() },
  enableTime: { type: Boolean, default: false },
  disabledInput: { type: Boolean, default: false },
  showIcon: { type: Boolean, default: true },
});
const emit = defineEmits(["change"]);

const date = ref(props.value);

const handleChange = (selectedDates: any) => {
  emit("change", selectedDates?.target?._flatpickr?.latestSelectedDateObj);
};

const config = computed(() => {
  return {
    enableTime: props.enableTime,
    noCalendar: props.enableTime,
    dateFormat: props.enableTime ? "H:i" : "d/m/Y",
    time_24hr: true,
    defaultDate: new Date(),
  };
});
const iconClass = computed(
  () => `fa fa-${props.enableTime ? "clock" : "calendar"}`
);
</script>

<style lang="css" scoped>
.icon-calendar {
  position: absolute;
  right: 20px;
  top: 70%;
  transform: translateY(-50%);
  cursor: pointer;
}

.icon-time {
  position: absolute;
  right: 20px;
  top: 70%;
  transform: translateY(-50%);
  cursor: pointer;
}
</style>
