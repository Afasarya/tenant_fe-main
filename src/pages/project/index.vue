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
      @fetch="fetchProjectList()"
    >
      <template #additional-action="{ data: item }">
        <button
          class="action btn btn-secondary btn-md"
          data-toggle="tooltip"
          data-placement="top"
          title="Assign Pengguna"
          @click="addUser(item?.id)"
        >
          <i class="fa fa-users" />
        </button>
      </template>
    </Table>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { convertCurrency } from "@/composables/helpers";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);

const router = useRouter();
const { get, remove } = useAxios();

const tableColumns = {
  name: { label: "Nama Proyek" },
  name_customer: { label: "Customer" },
  address: { label: "Alamat" },
  nominal: { label: "Nominal Proyek" },
};
const tableConfig = reactive({
  buttonName: "Tambah Proyek",
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
  fetchProjectList();
};
const onAdd = () => {
  router.push({ name: "BuatProyek" });
};
const onEdit = (id: string | number) => {
  router.push(`/proyek/edit_proyek/${id}`);
};
const onView = (id: string | number) => {
  router.push(`/proyek/detail_proyek/${id}`);
};
const onDelete = async (id: string | number) => {
  return await remove(`/project/delete/${id}`);
};
const addUser = (id: string | number) => {
  router.push(`/proyek/assign_proyek/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchProjectList();
};
const fetchProjectList = async () => {
  tableConfig.loading = true;
  try {
    const { data } = await get("/project", { params: payload.value });

    tableConfig.items =
      data?.data?.map((item: any) => {
        item.nominal = convertCurrency(item.nominal, true);
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

onMounted(() => fetchProjectList());
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
