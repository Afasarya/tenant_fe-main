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
      @fetch="fetchWorkingHourList()"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, defineAsyncComponent, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import dayjs from "dayjs";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);

const router = useRouter();
const { get, remove } = useAxios();

const tableColumns = {
  name: { label: "Nama" },
  start_time: { label: "Jam Mulai" },
  end_time: { label: "Jam Selesai" },
  status: { label: "Status" },
};
const tableConfig = reactive({
  buttonName: "Tambah Jam Kerja",
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
  fetchWorkingHourList();
};
const onAdd = () => {
  router.push({ name: "BuatJamKerja" });
};
const onEdit = (id: string | number) => {
  router.push(`/master/edit_jam_kerja/${id}`);
};
const onView = (id: string | number) => {
  router.push(`/master/detail_jam_kerja/${id}`);
};
const onDelete = async (id: string | number) => {
  return await remove(`/workinghour/delete/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchWorkingHourList();
};
const fetchWorkingHourList = async () => {
  tableConfig.loading = true;
  try {
    const { data } = await get("/workinghour", { params: payload.value });

    tableConfig.items =
      data?.data?.map((item: any) => {
        item.start_time = dayjs(item.start_time).format("HH:mm");
        item.end_time = dayjs(item.end_time).format("HH:mm");
        item.status = item.status === 1 ? "Aktif" : "Non Aktif";
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

onMounted(() => fetchWorkingHourList());
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}
</style>
