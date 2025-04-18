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
      @fetch="fetchBudgetHeaderList()"
    >
      <template #additional-action="{ data: item }">
        <button
          class="action btn btn-secondary btn-md"
          data-toggle="tooltip"
          data-placement="top"
          title="Manage Anggaran"
          @click="addBudget(item?.id)"
        >
          <i class="fa fa-bar-chart-o" />
        </button>
      </template>
    </Table>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { convertCurrency, currentProjectId } from "@/composables/helpers";
import { showErrorToast } from "@/composables/toast";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);

const router = useRouter();
const { get, remove } = useAxios();

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
  canCreate: true,
});
const querySearch = ref("");

const onSearch = (query: string) => {
  querySearch.value = query;
  fetchBudgetHeaderList();
};
const onAdd = () => {
  router.push({ name: "BuatAnggaran" });
};
const onEdit = (id: string | number) => {
  router.push(`/anggaran/edit_anggaran/${id}`);
};
const onView = (id: string | number) => {
  router.push(`/anggaran/detail_anggaran/${id}`);
};
const onDelete = async (id: string | number) => {
  return await remove(`/budget/destroyYearBudget/${id}`);
};
const addBudget = (id: string | number) => {
  router.push(`/anggaran/manage_anggaran/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchBudgetHeaderList();
};
const fetchBudgetHeaderList = async () => {
  tableConfig.loading = true;
  try {
    const { data, success } = await get("/budget/indexYearBudget", {
      params: payload.value,
    });

    if (success) {
      tableConfig.items =
        data?.data?.map((item: any) => {
          item.project_name = item?.project_name ?? "-";
          item.amount = convertCurrency(item.amount, true);
          return item;
        }) ?? [];
      tableConfig.pagination.totalData = data?.total ?? 1;
      tableConfig.pagination.totalPage = data?.last_page ?? 1;
    } else {
      tableConfig.canCreate = false;
      showErrorToast(data?.message);
    }
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

onMounted(() => fetchBudgetHeaderList());
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
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
