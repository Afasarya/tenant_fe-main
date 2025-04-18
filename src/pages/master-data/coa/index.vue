<template>
  <div class="card container-fluid px-4 card-custom">
    <Table
      v-bind="tableConfig"
      :loading="isLoading"
      @search="onSearch"
      @add="onAdd"
      @update-pagination="onChangePagination"
    >
      <template #custom-body>
        <RecursiveItems
          :items="tableConfig.items"
          @edit="onEdit"
          @view="onView"
          @delete="onDelete"
        />
      </template>
    </Table>
  </div>
</template>
<script lang="ts" setup>
import {
  defineAsyncComponent,
  reactive,
  onMounted,
  ref,
  nextTick,
  computed,
} from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import Swal from "sweetalert2";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);
const RecursiveItems = defineAsyncComponent(
  () => import("./components/RecursiveItems.vue")
);
const { get, remove } = useAxios();

const router = useRouter();
const tableColumns = {
  code: { label: "Kode Akun" },
  name: { label: "Nama Akun" },
  account_category: { label: "Kategori Akun" },
};
const tableConfig = reactive({
  buttonName: "Tambah COA",
  items: [] as any,
  columns: tableColumns,
  pagination: {
    page: 1,
    pageSize: 10,
    totalData: 0,
    totalPage: 1, //Math.ceil(CoaLsit.length / 10),
  },
  customBody: true,
  showNo: false,
  canAdd: false,
  canEdit: false,
  canView: false,
  canDelete: false,
  hasAction: false,
  canCreate: false,
});
const querySearch = ref("");
const isLoading = ref(false);

const onSearch = (query: string) => {
  querySearch.value = query;
  fetchCOAList();
};
const onAdd = () => {
  router.push({ name: "BuatCOA" });
};
const onEdit = (id: string | number) => {
  router.push(`/master/edit_coa/${id}`);
};
const onView = (id: string | number) => {
  router.push(`/master/detail_coa/${id}`);
};
const onDelete = async (id: string | number) => {
  Swal.fire({
    icon: "warning",
    title: "Apakah anda yakin?",
    text: "Setelah dihapus, Anda tidak akan dapat memulihkan data ini.",
    showCancelButton: true,
    confirmButtonText: "Ok",
    confirmButtonColor: "var(--theme-default)",
    cancelButtonText: "Kembali",
    cancelButtonColor: "#efefef",
  }).then(async (result) => {
    if (result.value) {
      const response = await remove(`/api/coa/delete/${id}`);
      if (response?.success) {
        nextTick(() => {
          Swal.fire({
            icon: "success",
            text: "Data berhasil dihapus",
            confirmButtonColor: "var(--theme-default)",
          });
          fetchCOAList();
        });
      } else {
        nextTick(() => {
          Swal.fire({
            icon: "error",
            text: "Terjadi kesalahan, silahkan ulangi beberapa saat lagi",
            confirmButtonColor: "var(--theme-default)",
          });
        });
      }
    }
  });
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchCOAList();
};

const fetchCOAList = async () => {
  isLoading.value = true;
  const { success, data } = await get("/coa", {
    params: payload.value,
  });

  if (success) {
    tableConfig.items = addIsOpenToObjects(data?.data ?? []) ?? [];

    tableConfig.pagination.totalData = data?.total ?? 1;
    tableConfig.pagination.totalPage = data?.last_page ?? 1;
  }
  isLoading.value = false;
};

const addIsOpenToObjects = (arr: any, level = 1) => {
  return (
    arr.map((obj: any) => {
      obj["isOpen"] = true;
      obj["level"] = level;
      obj["account_category"] = obj.default === "D" ? "Debit" : "Kredit";

      // Check if the object has children and recursively process them
      if (Array.isArray(obj.children) && obj.children.length > 0) {
        addIsOpenToObjects(obj.children, level + 1);
      }

      return obj;
    }) ?? []
  );
};

const payload = computed(() => {
  return {
    search: querySearch.value,
    page: tableConfig.pagination?.page,
    per_page: tableConfig.pagination?.pageSize,
  };
});

onMounted(() => {
  fetchCOAList();
});
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}

.cursor-pointer {
  cursor: pointer;
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
