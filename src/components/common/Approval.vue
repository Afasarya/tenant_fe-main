<template>
  <div class="container d-flex flex-column gap-4 w-100">
    <h5>Pengesahan</h5>
    <ul class="square-timeline">
      <li
        class="timeline-event pb-2"
        v-for="(apr, idx) in props.approvalList"
        :key="idx"
      >
        <label class="timeline-event-icon"></label>
        <div class="timeline-event-wrapper w-100 mb-2">
          <p
            class="timeline-thumbnail mb-1 bg-gradient rounded-pill text-white"
            :class="apr?.approved_at ? 'bg-success' : 'bg-danger'"
          >
            {{
              `${
                apr?.approved_at
                  ? `${getLabel(apr?.description) ?? "Disahkan"} oleh`
                  : `Menunggu ${getLabel(apr?.description)} oleh`
              } ${apr?.user_name} (${apr?.position_name})`
            }}
          </p>
          <template v-if="apr?.approved_at">
            <h5 class="pt-0">Tanggal</h5>
            <span class="text-muted"> {{ apr?.approved_at }} </span>
          </template>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";

const props = defineProps({
  approvalList: {
    type: Array as PropType<Array<any>>,
    default: () => [],
  },
});

const getLabel = (label: string) => {
  if (label == "Mengesahkan") return "disahkan";
  if (label == "Menyetujui") return "disetujui";
  if (label == "Mengetahui") return "diketahui";

  return "diperiksa";
};
</script>
