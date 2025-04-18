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
      @fetch="fetchWorkLocationList()"
    />
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { convertCurrency } from "@/composables/helpers";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);

const router = useRouter();
const { get, remove } = useAxios();

const tableColumns = {
  name: { label: "Lokasi" },
  allowance: { label: "Tunjangan" },
};
const tableConfig = reactive({
  buttonName: "Tambah Lokasi",
  items: [],
  columns: tableColumns,
  pagination: {
    page: 1,
    pageSize: 10,
    totalData: 1,
    totalPage: 1,
  },
  loading: false,
});
const querySearch = ref("");

const onSearch = (query: string) => {
  querySearch.value = query;
  fetchWorkLocationList();
};
const onAdd = () => {
  router.push({ name: "BuatLokasiKerja" });
};
const onEdit = (id: string | number) => {
  router.push(`/master/edit_lokasi_kerja/${id}`);
};
const onView = (id: string | number) => {
  router.push(`/master/detail_lokasi_kerja/${id}`);
};
const onDelete = async (id: string | number) => {
  return await remove(`/worklocation/delete/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchWorkLocationList();
};
const fetchWorkLocationList = async () => {
  tableConfig.loading = true;
  try {
    const { data } = await get("/worklocation", { params: payload.value });

    tableConfig.items =
      data?.data?.map((item: any) => {
        item.allowance = convertCurrency(item.allowance, true);
        return item;
      }) ?? [];
    tableConfig.pagination.totalData = data?.total ?? 1;
    tableConfig.pagination.totalPage = data?.last_page ?? 1;
  } catch (e) {
    console.log(e);
  }
  tableConfig.loading = false;
};

const payload = computed(() => {
  return {
    search: querySearch.value,
    page: tableConfig.pagination?.page,
    per_page: tableConfig.pagination?.pageSize,
  };
});

onMounted(() => fetchWorkLocationList());
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}
</style>
