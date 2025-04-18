<template>
  <div>
    <ul class="nav nav-tabs border-tab mb-2" id="bottom-tab" role="tablist">
      <li class="nav-item" v-for="item in props.items" :key="item.id">
        <a
          class="nav-link nav-border tab-info pt-0 pointer"
          :class="{ active: item.id === active }"
          :id="`tab-${item.id}`"
          data-bs-toggle="tab"
          role="tab"
          aria-selected="true"
          @click="changeTab(item)"
        >
          <i :class="item?.icon" /> {{ item?.name }}
        </a>
      </li>
    </ul>
    <div class="tab-content" id="tabContent">
      <div class="tab-pane fade show active" role="tabpanel">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, PropType, ref, watch } from "vue";

const emit = defineEmits(["change"]);
const props = defineProps({
  items: {
    type: Array as PropType<Array<any>>,
    default: () => [],
  },
  activeTab: { type: Number, default: 0 },
});
const active = ref(props.activeTab);

const changeTab = (item: any) => {
  active.value = item?.id;
  emit("change", item);
};
</script>

<style lang="css" scoped>
.pointer {
  cursor: pointer;
}
</style>
