<template>
  <Tabs v-bind="configTab" @change="handleChangeTab" />
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, nextTick, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const Tabs = defineAsyncComponent(() => import("@/components/common/Tabs.vue"));

const router = useRouter();
const route = useRoute();
const tabs = [
  {
    id: 1,
    name: "Permintaan Pembelian",
    icon: "icofont icofont-cart-alt",
    link: "/pembelian/permintaan",
  },
  {
    id: 2,
    name: "Rekomendasi Harga",
    icon: "icofont icofont-coins",
    link: "/rekomendasi/daftar",
  },
  {
    id: 3,
    name: "PO / SPK",
    icon: "icofont icofont-list",
    link: "/pospk/list",
  },
  {
    id: 4,
    name: "P3",
    icon: "icofont icofont-bill-alt",
    link: "/pembayaran/permintaan",
  },
];

const currentTab = computed(() => {
  const tab: any = tabs.find((p: any) => p.link == route.path);
  return tab?.id ?? 1;
});

const configTab = reactive({
  activeTab: currentTab.value,
  items: tabs,
});

const handleChangeTab = (item: any) => {
  configTab.activeTab = item.id;
  router.push(item?.link);
};
</script>
