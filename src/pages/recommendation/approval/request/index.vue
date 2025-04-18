<template>
  <div class="card container-fluid px-4 card-custom">
    <ApprovalTabs />
    <Table
      v-bind="tableConfig"
      @search="onSearch"
      @view="onView"
      @update-pagination="onChangePagination"
      @fetch="fetchRecommendationList()"
    >
    </Table>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { convertCurrency, currentProjectId } from "@/composables/helpers";
import dayjs from "dayjs";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);
const ApprovalTabs = defineAsyncComponent(
  () => import("@/components/common/ApprovalTabs.vue")
);

const router = useRouter();
const { get } = useAxios();

const tableColumns = {
  project_name: { label: "Nama Proyek" },
  number: { label: "Nomor" },
  date: { label: "Tanggal" },
  purchase_request_number: { label: "Nomor Transaksi" },
  total: { label: "Total", align: "end" },
  user_name: { label: "Dibuat oleh" },
  status: { label: "Status" },
};
const tableConfig = reactive({
  buttonName: "Tambah Rekomendasi",
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
  fetchRecommendationList();
};
const onView = (id: string | number) => {
  router.push(`/rekomendasi/detail_approval/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchRecommendationList();
};
const fetchRecommendationList = async () => {
  tableConfig.loading = true;
  try {
    const { data } = await get("/Recommendation/list", {
      params: payload.value,
    });

    tableConfig.items =
      data?.data?.map((item: any) => {
        item.project_name = item?.project_name ?? "-";
        item.date = dayjs(item.date).format("DD MMM YYYY");
        item.total = convertCurrency(item.total, true);
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
    status: "not-draft",
  };
});

onMounted(() => fetchRecommendationList());
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
