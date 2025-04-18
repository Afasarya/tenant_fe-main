<template>
  <div class="card container-fluid px-4 card-custom">
    <Table
      v-bind="tableConfig"
      @search="onSearch"
      @view="onView"
      @update-pagination="onChangePagination"
      @fetch="fetchApprovalList()"
    />
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { useStore } from "vuex";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);

const router = useRouter();
const { get } = useAxios();
const projectStore = useStore();

const tableColumns = {
  module_name: { label: "Nama Modul" },
};
const tableConfig = reactive({
  items: [],
  columns: tableColumns,
  pagination: {
    page: 1,
    pageSize: 10,
    totalData: 1,
    totalPage: 1,
  },
  loading: false,
  canCreate: false,
  canDelete: false,
  canEdit: false,
  returnObject: true,
});
const querySearch = ref("");

const onSearch = (query: string) => {
  querySearch.value = query;
  fetchApprovalList();
};
const onView = (row: any) => {
  router.push(
    `/master/detail_approval/${row?.id}?module_name=${row?.module_name}`
  );
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchApprovalList();
};
const fetchApprovalList = async () => {
  tableConfig.loading = true;
  try {
    const { data } = await get("/approvalMaster/list", {
      params: payload.value,
    });

    tableConfig.items =
      data?.data?.map((item: any) => {
        item.id = item?.module_id;
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
    project_id:
      projectStore.state.projectId === 0 ? "" : projectStore.state.projectId,
  };
});

onMounted(() => fetchApprovalList());
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}
</style>
