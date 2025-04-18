<template>
  <template v-for="(row, index) in props.items" :key="index">
    <tr>
      <td
        :style="{
          paddingLeft: handlePadding(row?.level, row?.children.length > 0),
        }"
      >
        <i
          v-if="row?.children.length > 0"
          class="cursor-pointer"
          :style="{ marginRight: '4px' }"
          :class="row?.isOpen ? 'icon-angle-down' : 'icon-angle-right'"
          @click="handleAccordion(row)"
        />
        {{ row?.code }}
      </td>
      <td>
        {{ row?.name }}
      </td>
      <td>
        {{ row?.account_category }}
      </td>
    </tr>
    <template v-if="row?.isOpen && row?.children.length > 0">
      <RecursiveItems
        :items="row?.children"
        :has-action="props.hasAction"
        @edit="$emit('edit', $event)"
        @view="$emit('view', $event)"
        @delete="$emit('delete', $event)"
      />
    </template>
  </template>
</template>

<script lang="ts" setup>
import { PropType } from "vue";

const emit = defineEmits(["edit", "view", "delete"]);
const props = defineProps({
  items: { type: Array as PropType<Array<any>>, default: () => [] },
  hasAction: { type: Boolean, default: true },
});

const handleAccordion = (obj: any) => {
  const index = props.items?.findIndex((p: any) => p?.code === obj?.code);
  props.items[index].isOpen = !props.items[index].isOpen;
};

const handlePadding = (level: number, hasChildren: boolean) => {
  const padding = 30;
  if (level === 1) {
    if (hasChildren) return `8px`;

    return `${padding}px`;
  } else {
    if (hasChildren) {
      const paddinghasChild = padding * (level - 1) + 8;
      return `${paddinghasChild}px`;
    }

    const pad = level * padding;
    return `${pad}px`;
  }
};
</script>

<style lang="css" scoped>
.cursor-pointer {
  cursor: pointer;
}

.action {
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 10px;
  padding-left: 21px;
}
</style>
