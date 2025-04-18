<template>
  <div class="card container-fluid p-4">
    <Loader v-if="isLoading" />
    <div v-else class="col-12">
      <div class="col-12 pb-4">
        <label class="form-label"> Nama Proyek </label>
        <BaseInput type="text" :value="projectName" :disabled-input="true" />
      </div>

      <div class="col-12">
        <label class="form-label"> Pengguna Proyek </label>
        <BaseSelect
          :disabled-input="isSubmitting"
          error-message="Silahkan pilih nama pemberi persetujuan"
          :options="differentUserList"
          :value="user"
          required
          @change="(val: any) => handleAddUser(val)"
        />
      </div>

      <div class="col-12 py-4">
        <Table
          v-bind="tableConfig"
          :delete-fn="onDelete"
          @search="onSearch"
          @update-pagination="onChangePagination"
          @fetch="fetchAssigneUsers()"
        />
      </div>

      <ButtonForm :is-loading="isSubmitting" mode="detail" @on-back="onBack" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import useAxios from "@/composables/axios";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import {
  computed,
  defineAsyncComponent,
  onBeforeMount,
  reactive,
  ref,
} from "vue";
import { useRoute, useRouter } from "vue-router";

const Loader = defineAsyncComponent(
  () => import("@/components/common/Loader.vue")
);
const BaseSelect = defineAsyncComponent(
  () => import("@/components/common/Select.vue")
);
const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);
const BaseInput = defineAsyncComponent(
  () => import("@/components/common/Input.vue")
);
const ButtonForm = defineAsyncComponent(
  () => import("@/components/common/ButtonForm.vue")
);

const { get, remove, post } = useAxios();
const route = useRoute();
const router = useRouter();

const isLoading = ref(false);
const userList = ref<any>([]);
const isSubmitting = ref(false);
const user = ref("");
const querySearch = ref("");
const projetcId = ref(route?.params?.id ?? "");
const projectName = ref("");

const tableColumns = {
  user_name: { label: "Nama Pengguna" },
};
const tableConfig = reactive({
  items: [] as any,
  columns: tableColumns,
  pagination: {
    page: 1,
    pageSize: 10,
    totalData: 1,
    totalPage: 1,
  },
  loading: false,
  canView: false,
  canCreate: false,
  canEdit: false,
  canSearch: false,
});

const onBack = () => {
  router.push({ name: "DaftarProyek" });
};

const fetchUsers = async () => {
  const { data, success } = await get("/employee/search");
  if (success) {
    const result =
      data?.map((item: any) => {
        return {
          id: item?.user_id,
          name: item?.name,
        };
      }) ?? [];

    userList.value = result?.filter((r: any) => r?.id !== null);
  }
};

const fetchAssigneUsers = async () => {
  tableConfig.loading = true;
  const { data, success, message } = await get(`/projectUserAccess`, {
    params: {
      project_id: projetcId.value,
      per_page: tableConfig.pagination?.pageSize,
      page: tableConfig.pagination.page,
      search: querySearch.value,
    },
  });
  if (success) {
    tableConfig.items = data?.data ?? [];
  } else showErrorToast(message ?? "Gagal load data");

  tableConfig.loading = false;
};

const onDelete = async (id: string | number) => {
  return await remove(`/projectUserAccess/delete/${id}`);
};
const onSearch = (query: string) => {
  querySearch.value = query;
  fetchAssigneUsers();
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchAssigneUsers();
};

const handleAddUser = async (value: any) => {
  if (value) {
    isSubmitting.value = true;
    user.value = value?.id;
    const { success, message } = await post("projectUserAccess/store", {
      user_id: user.value,
      project_id: projetcId.value,
    });

    if (success) {
      showSuccessToast(message ?? "Data berhasil disimpan");
      user.value = "";
      fetchAssigneUsers();
    }

    isSubmitting.value = false;
  }
};

const differentUserList = computed(() => {
  return userList.value.filter(
    (user: any) =>
      !tableConfig.items.some((item: any) => user.id === item.user_id)
  );
});

const fetchDetail = async () => {
  isLoading.value;
  const { data, success, message } = await get(`/project/${projetcId.value}`);
  if (success) {
    projectName.value = data?.name ?? "";
  } else showErrorToast(message ?? "Gagal load data");

  isLoading.value = false;
};

onBeforeMount(() => {
  fetchDetail();
  fetchUsers();
  fetchAssigneUsers();
});
</script>
