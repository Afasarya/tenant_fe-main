<template>
  <div class="card container-fluid px-4 card-custom">
    <Tabs />

    <Table
      v-bind="tableConfig"
      :deleteFn="onDelete"
      @search="onSearch"
      @add="onAdd"
      @edit="onEdit"
      @view="onView"
      @update-pagination="onChangePagination"
      @fetch="fetchPurchaseRequestHeaderList()"
    >
      <template #additional-action="{ data: item }">
        <button
          class="action btn btn-info btn-md"
          data-toggle="tooltip"
          data-placement="top"
          title="Manage Produk"
          @click="addPurchaseRequest(item?.id)"
        >
          <i class="fa fa-shopping-cart" />
        </button>
      </template>
    </Table>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { currentProjectId } from "@/composables/helpers";
import dayjs from "dayjs";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);
const Tabs = defineAsyncComponent(
  () => import("@/components/common/PurchaseTab.vue")
);

const router = useRouter();
const { get, remove } = useAxios();

const tableColumns = {
  project_name: { label: "Nama Proyek" },
  number: { label: "Nomor Angaran" },
  date: { label: "Tanggal Permintaan" },
  expected_delivery: { label: "Ekpektasi Pengiriman" },
  department_name: { label: "Departemen" },
  status: { label: "Status" },
};
const tableConfig = reactive({
  buttonName: "Tambah Permintaan Pembelian",
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
  fetchPurchaseRequestHeaderList();
};
const onAdd = () => {
  router.push({ name: "BuatPermintaanPembelian" });
};
const onEdit = (id: string | number) => {
  router.push(`/pembelian/edit_permintaan_pembelian/${id}`);
};
const onView = (id: string | number) => {
  router.push(`/pembelian/detail_permintaan_pembelian/${id}`);
};
const onDelete = async (id: string | number) => {
  return await remove(`/PurchaseRequest/delete/${id}`);
};
const addPurchaseRequest = (id: string | number) => {
  router.push(`/pembelian/manage_produk_pembelian/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchPurchaseRequestHeaderList();
};
const fetchPurchaseRequestHeaderList = async () => {
  tableConfig.loading = true;
  try {
    const { data } = await get("/PurchaseRequest", {
      params: payload.value,
    });

    tableConfig.items =
      data?.data?.map((item: any) => {
        item.project_name = item?.project_name ?? "-";
        item.date = dayjs(item.date).format("DD MMM YYYY");
        item.expected_delivery = dayjs(item.expected_delivery).format(
          "DD MMM YYYY"
        );
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
    project_id: currentProjectId.value,
  };
});

onMounted(() => fetchPurchaseRequestHeaderList());
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
