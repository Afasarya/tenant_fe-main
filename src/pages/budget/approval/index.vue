<template>
  <div class="card container-fluid px-4 card-custom">
    <Table
      v-bind="tableConfig"
      @search="onSearch"
      @view="onView"
      @update-pagination="onChangePagination"
      @fetch="fetchBudgetHeaderList()"
    >
    </Table>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { convertCurrency, currentProjectId } from "@/composables/helpers";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);

const router = useRouter();
const { get } = useAxios();

const tableColumns = {
  project_name: { label: "Nama Proyek" },
  number: { label: "Nomor Angaran" },
  year: { label: "Tahun" },
  status: { label: "Status" },
};
const tableConfig = reactive({
  buttonName: "Tambah Tahun Anggaran",
  items: [],
  columns: tableColumns,
  pagination: {
    page: 1,
    pageSize: 10,
    totalData: 1,
    totalPage: 1,
  },
  loading: false,
  canEdit: false,
  canDelete: false,
  canCreate: false,
});
const querySearch = ref("");

const onSearch = (query: string) => {
  querySearch.value = query;
  fetchBudgetHeaderList();
};
const onView = (id: string | number) => {
  router.push(`/anggaran/detail_approval_anggaran/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchBudgetHeaderList();
};
const fetchBudgetHeaderList = async () => {
  tableConfig.loading = true;
  try {
    const { data } = await get("/budget/indexYearBudget", {
      params: payload.value,
    });

    tableConfig.items =
      data?.data?.map((item: any) => {
        item.project_name = item?.project_name ?? "-";
        item.amount = convertCurrency(item.amount, true);
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
    status: "not_draft",
    page: tableConfig.pagination?.page,
    per_page: tableConfig.pagination?.pageSize,
    project_id: currentProjectId.value,
  };
});

onMounted(() => fetchBudgetHeaderList());
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}
</style>
