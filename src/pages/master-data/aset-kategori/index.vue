<template>
  <div class="card container-fluid px-4 card-custom">
    <Table
      v-bind="tableConfig"
      :deleteFn="onDelete"
      @search="onSearch"
      @add="onAdd"
      @edit="onEdit"
      @view="onView"
      @update-pagination="onChangePagination"
    />
  </div>
</template>
<script lang="ts" setup>
import { nextTick, defineAsyncComponent, reactive } from "vue";
import { data } from "./dummy";
import { useRouter } from "vue-router";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);

const router = useRouter();
const tableColumns = {
  name: { label: "Nama Aset Kategori" },
};
const tableConfig = reactive({
  buttonName: "Tambah Aset Kategori",
  items: data,
  columns: tableColumns,
  pagination: {
    page: 1,
    pageSize: 10,
    totalData: data.length,
    totalPage: Math.ceil(data.length / 10),
  },
});

const onSearch = (query: string) => {
  if (query) {
    var filteredData = tableConfig.items.filter((row) =>
      row.name.toLowerCase().includes(query.toLowerCase())
    );

    nextTick(() => (tableConfig.items = filteredData));
  } else tableConfig.items = data;
};
const onAdd = () => {
  router.push({ name: "BuatAsetKategori" });
};
const onEdit = (id: string | number) => {
  router.push(`/master/edit_aset_kategori/${id}`);
};
const onView = (id: string | number) => {
  router.push(`/master/detail_aset_kategori/${id}`);
};
const onDelete = (id: string | number) => {
  return (tableConfig.items = tableConfig.items?.filter((p) => p.id !== id));
};
const onChangePagination = (page: number) => {
  tableConfig.pagination.page = page;
};
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}
</style>
