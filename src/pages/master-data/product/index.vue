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
      @fetch="fetchProductList()"
    >
      <template #additional-filter>
        <div class="w-75">
          <BaseSelect
            :disabled-input="false"
            :options="productTypeOptions"
            :value="type"
            placeholder="filter tipe"
            @change="(val: any) => handleChangeType(val?.id ?? '')"
          />
        </div>
      </template>
    </Table>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { showErrorToast } from "@/composables/toast";
import { convertCurrency } from "@/composables/helpers";
import { productTypeOptions } from "./data";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);
const BaseSelect = defineAsyncComponent(
  () => import("@/components/common/Select.vue")
);

const router = useRouter();
const { get, remove } = useAxios();

const tableColumns = {
  sku: { label: "SKU" },
  name: { label: "Nama Barang / Jasa" },
  product_categories_name: { label: "Kategori" },
  price: { label: "Harga" },
  type: { label: "Tipe" },
  description: { label: "Deskripsi" },
};
const tableConfig = reactive({
  buttonName: "Tambah Barang / Jasa",
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
const type = ref("");

const onSearch = (query: string) => {
  querySearch.value = query;
  fetchProductList();
};
const onAdd = () => {
  router.push({ name: "BuatBarangJasa" });
};
const onEdit = (id: string | number) => {
  router.push(`/master/edit_barang_jasa/${id}`);
};
const onView = (id: string | number) => {
  router.push(`/master/detail_barang_jasa/${id}`);
};
const onDelete = async (id: string | number) => {
  return await remove(`/product/delete/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchProductList();
};
const fetchProductList = async () => {
  tableConfig.loading = true;

  const { data, message, success } = await get("/product", {
    params: payload.value,
  });

  if (success) {
    tableConfig.items =
      data?.data?.map((item: any) => {
        item.type = item.type === "good" ? "Barang" : "Jasa";
        item.price = convertCurrency(item.price, true);
        return item;
      }) ?? [];
    tableConfig.pagination.totalData = data?.total ?? 1;
    tableConfig.pagination.totalPage = data?.last_page ?? 1;
  } else showErrorToast(message ?? "Gagal load data");

  tableConfig.loading = false;
};

const handleChangeType = (val: string) => {
  type.value = val;
  fetchProductList();
};

const payload = computed(() => {
  return {
    search: querySearch.value,
    page: tableConfig.pagination?.page,
    per_page: tableConfig.pagination?.pageSize,
    type: type.value,
  };
});

onMounted(() => fetchProductList());
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}
</style>
