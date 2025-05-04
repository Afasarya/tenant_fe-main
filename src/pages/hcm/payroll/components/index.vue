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
      @fetch="fetchPayrollComponentList()"
    />
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { showErrorToast } from "@/composables/toast";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);

const router = useRouter();
const { get, remove } = useAxios();

const tableColumns = {
  name: { label: "Nama Komponen" },
  description: { label: "Deskripsi" },
  type_component: { label: "Tipe" },
  is_pajak: { label: "Kena Pajak" },
  status: { label: "Status" },
};
const tableConfig = reactive({
  buttonName: "Tambah Komponen Payroll",
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
  fetchPayrollComponentList();
};
const onAdd = () => {
  router.push({ name: "BuatPayrollComponent" });
};
const onEdit = (id: string | number) => {
  router.push(`/hcm/payroll/edit_component/${id}`);
};
const onView = (id: string | number) => {
  router.push(`/hcm/payroll/detail_component/${id}`);
};
const onDelete = async (id: string | number) => {
  return await remove(`/payroll_component/delete/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchPayrollComponentList();
};
const fetchPayrollComponentList = async () => {
  tableConfig.loading = true;

  try {
    const { data, message, success } = await get("/payroll_component", {
      params: payload.value,
    });

    if (success) {
      tableConfig.items = data?.data?.map((item: any) => {
        return {
          id: item.id,
          name: item.name || "",
          description: item.description || "-",
          type_component: item.type_component === 'debit' ? 'Potongan' : 'Pendapatan',
          status: item.status === 'active' ? "Aktif" : "Tidak Aktif",
          is_pajak: item.is_pajak === 1 ? "Ya" : "Tidak"
        };
      }) ?? [];
      tableConfig.pagination.totalData = data?.total ?? 1;
      tableConfig.pagination.totalPage = data?.last_page ?? 1;
    } else {
      showErrorToast(message ?? "Gagal mengambil data komponen payroll");
    }
  } catch (error) {
    console.error("Error fetching payroll component data:", error);
    showErrorToast("Terjadi kesalahan saat mengambil data komponen payroll");
  } finally {
    tableConfig.loading = false;
  }
};

const payload = computed(() => {
  return {
    search: querySearch.value,
    page: tableConfig.pagination?.page,
    per_page: tableConfig.pagination?.pageSize,
  };
});

onMounted(() => fetchPayrollComponentList());
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}
</style>