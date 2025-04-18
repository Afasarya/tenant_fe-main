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
      @fetch="fetchEmployeeList()"
    />
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { showErrorToast } from "@/composables/toast";
import dayjs from "dayjs";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);

const router = useRouter();
const { get, remove } = useAxios();

const tableColumns = {
  name: { label: "Nama Pegawai" },
  position_name: { label: "Jabatan" },
  department_name: { label: "Departemen" },
  hire_date: { label: "Tanggal Bergabung" },
  status: { label: "Status" },
};
const tableConfig = reactive({
  buttonName: "Tambah Pegawai",
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
  fetchEmployeeList();
};
const onAdd = () => {
  router.push({ name: "BuatPegawai" });
};
const onEdit = (id: string | number) => {
  router.push(`/hcm/edit_pegawai/${id}`);
};
const onView = (id: string | number) => {
  router.push(`/hcm/detail_pegawai/${id}`);
};
const onDelete = async (id: string | number) => {
  return await remove(`/employee/delete/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchEmployeeList();
};
const fetchEmployeeList = async () => {
  tableConfig.loading = true;

  const { data, message, success } = await get("/employee", {
    params: payload.value,
  });

  if (success) {
    tableConfig.items =
      data?.data?.map((item: any) => {
        item.hire_date = item.hire_date
          ? dayjs(item.hire_date).format("DD MMM YYYY")
          : "-";
        item.status = item.status ? "Aktif" : "Tidak Aktif";
        return item;
      }) ?? [];
    tableConfig.pagination.totalData = data?.total ?? 1;
    tableConfig.pagination.totalPage = data?.last_page ?? 1;
  } else showErrorToast(message ?? "Gagal load data");

  tableConfig.loading = false;
};

const payload = computed(() => {
  return {
    search: querySearch.value,
    page: tableConfig.pagination?.page,
    per_page: tableConfig.pagination?.pageSize,
  };
});

onMounted(() => fetchEmployeeList());
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}
</style>
