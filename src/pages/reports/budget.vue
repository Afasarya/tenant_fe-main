<template>
  <div class="card container-fluid px-4 card-custom">
    <h2>Laporan Anggaran</h2>
    <hr class="m-0" />
    <div
      class="d-flex flex-row justify-content-between align-items-end pb-2 w-full"
    >
      <div class="d-flex flex-row align-items-end gap-2">
        <div>
          <label> Tanggal Mulai </label>
          <DatePicker :show-icon="false" />
        </div>
        <div>
          <label> Tanggal Akhir </label>
          <DatePicker :show-icon="false" />
        </div>
        <button class="btn btn-primary" type="button">Filter</button>
      </div>

      <button class="btn btn-outline-primary" type="button">
        Download PDF
      </button>
    </div>
    <Table
      v-bind="tableConfig"
      @update-pagination="onChangePagination"
      @fetch="fetchProjectList()"
    />
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { convertCurrency } from "@/composables/helpers";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);

const DatePicker = defineAsyncComponent(
  () => import("@/components/common/DateTimePicker.vue")
);

const router = useRouter();
const { get } = useAxios();

const tableColumns = {
  name: { label: "Nama Proyek" },
  name_customer: { label: "Customer" },
  address: { label: "Alamat" },
  nominal: { label: "Nominal Proyek" },
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
  canSearch: false,
  canCreate: false,
  canEdit: false,
  canDelete: false,
  hasAction: false,
});
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
</style>
