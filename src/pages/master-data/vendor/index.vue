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
      @fetch="fetchVendorList()"
    />
  </div>
</template>
<script lang="ts" setup>
import useAxios from "@/composables/axios";
import { ref, defineAsyncComponent, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);

const router = useRouter();
const { get, remove } = useAxios();
const tableColumns = {
  name: { label: "Nama Vendor" },
  phone: { label: "No.Telp" },
  contact_person: { label: "Contact Person" },
  email: { label: "Email" },
  tax_number: { label: "No. Pajak" },
  type: { label: "Tipe Vendor" },
  address: { label: "Alamat" },
};
const tableConfig = reactive({
  buttonName: "Tambah Vendor / Subkon",
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
  fetchVendorList();
};
const onAdd = () => {
  router.push({ name: "BuatVendor" });
};
const onEdit = (id: string | number) => {
  router.push(`/master/edit_vendor/${id}`);
};
const onView = (id: string | number) => {
  router.push(`/master/detail_vendor/${id}`);
};
const onDelete = async (id: string | number) => {
  return await remove(`/vendor/delete/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchVendorList();
};

const payload = computed(() => {
  return {
    search: querySearch.value,
    page: tableConfig.pagination?.page,
    per_page: tableConfig.pagination?.pageSize,
  };
});

const fetchVendorList = async () => {
  tableConfig.loading = true;
  try {
    const { data } = await get("/vendor", { params: payload.value });

    tableConfig.items = data?.data ?? data;
    tableConfig.pagination.totalData = data?.total ?? 1;
    tableConfig.pagination.totalPage = data?.last_page ?? 1;
  } catch (e) {
    console.log(e);
  }
  tableConfig.loading = false;
};

onMounted(() => fetchVendorList());
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}
</style>
