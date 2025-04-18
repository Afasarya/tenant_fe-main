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
      @fetch="fetchList()"
    />
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { currentProjectId } from "@/composables/helpers";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);

const router = useRouter();
const { get, remove } = useAxios();

const tableColumns = {
  bank_name: { label: "Nama Bank" },
  account_name: { label: "Nama Rekening" },
  account_number: { label: "Nomor Rekening" },
};
const tableConfig = reactive({
  buttonName: "Tambah Rekening Bank",
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
  fetchList();
};
const onAdd = () => {
  router.push({ name: "BuatRekeningBank" });
};
const onEdit = (id: string | number) => {
  router.push(`/master/edit_rekening_bank/${id}`);
};
const onView = (id: string | number) => {
  router.push(`/master/detail_rekening_bank/${id}`);
};
const onDelete = async (id: string | number) => {
  return await remove(`/BankAccount/delete/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchList();
};
const fetchList = async () => {
  tableConfig.loading = true;
  try {
    const { data } = await get("/JournalEntries", {
      params: payload.value,
    });

    tableConfig.items = data?.data ?? data;
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
    project_id: currentProjectId.value,
  };
});

onMounted(() => fetchList());
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}
</style>
