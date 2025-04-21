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
      @fetch="fetchPayrollTemplateList()"
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
  name: { label: "Nama Template" },
  description: { label: "Deskripsi" },
  effective_date: { label: "Tanggal Efektif" },
  status: { label: "Status" },
};
const tableConfig = reactive({
  buttonName: "Tambah Template Payroll",
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
  fetchPayrollTemplateList();
};
const onAdd = () => {
  router.push({ name: "BuatTemplatePayroll" });
};
const onEdit = (id: string | number) => {
  router.push(`/hcm/payroll/edit_template/${id}`);
};
const onView = (id: string | number) => {
  router.push(`/hcm/payroll/detail_template/${id}`);
};
const onDelete = async (id: string | number) => {
  return await remove(`/payroll/components_template/delete/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchPayrollTemplateList();
};
const fetchPayrollTemplateList = async () => {
  tableConfig.loading = true;

  const { data, message, success } = await get("/payroll/components_template", {
    params: payload.value,
  });

  if (success) {
    tableConfig.items =
      data?.data?.map((item: any) => {
        item.effective_date = item.effective_date
          ? dayjs(item.effective_date).format("DD MMM YYYY")
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

onMounted(() => fetchPayrollTemplateList());
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}
</style>