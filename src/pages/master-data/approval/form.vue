<template>
  <div class="card container-fluid p-4">
    <Loader v-if="loading && mode !== 'add'" />
    <div v-else>
      <div class="col-12 pb-4">
        <label class="form-label"> Nama Modul </label>
        <BaseInput
          type="text"
          :value="moduleName"
          :disabled-input="disabledInput"
        />
      </div>

      <div class="col-12 pb-4">
        <Table
          v-bind="tableConfig"
          :delete-fn="onDelete"
          @add="onAdd"
          @search="onSearch"
          @edit="onEdit"
          @update-pagination="onChangePagination"
          @fetch="fetchDetail()"
        />
      </div>

      <ButtonForm :is-loading="isSubmitting" :mode="mode" @on-back="onBack" />
    </div>

    <Modal
      v-bind="configModal"
      @close="configModal.isOpen = false"
      @submit="onSubmit()"
    >
      <template #content>
        <form class="row g-3 needs-validation custom-input" novalidate>
          <div class="col-12">
            <label class="form-label"> Pemberi Persetujuan </label>
            <BaseSelect
              :disabled-input="isSubmitting"
              error-message="Silahkan pilih nama pemberi persetujuan"
              :has-submitted="formSubmitted"
              :options="userList"
              :value="approvalForms.user_id"
              required
              @change="(val: any) => approvalForms.user_id = val?.id ?? ''"
            />
          </div>
          <div class="col-12">
            <label class="form-label"> Jabatan </label>
            <BaseInput
              type="text"
              :has-submitted="formSubmitted"
              :value="approvalForms.position_name"
              :disabled-input="false"
              required
              error-message="Silahkan isi jabatan pemberi persetujuan"
              @change="(val: string) => (approvalForms.position_name = val)"
            />
          </div>
          <div class="col-12">
            <label class="form-label"> Urutan </label>
            <BaseInput
              type="number"
              :has-submitted="formSubmitted"
              :value="approvalForms.order"
              :disabled-input="false"
              required
              error-message="Silahkan isi urutan pemberi persetujuan"
              @change="(val: string) => (approvalForms.order = val)"
            />
          </div>
          <div class="col-12">
            <label class="form-label"> Deskripsi </label>
            <BaseSelect
              :disabled-input="isSubmitting"
              error-message="Silahkan pilih deskripsi pengesahan"
              :has-submitted="formSubmitted"
              :options="labels"
              :value="approvalForms.description"
              required
              @change="(val: any) => approvalForms.description = val?.id ?? ''"
            />
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, reactive, ref } from "vue";
import {
  validate,
  formSubmitted,
  approvalForms,
  initialApprovalForm,
} from "./form";
import { useRoute, useRouter } from "vue-router";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import { viewMode } from "@/composables/viewMode";
import useAxios from "@/composables/axios";
import { currentProjectId } from "@/composables/helpers";

const BaseInput = defineAsyncComponent(
  () => import("@/components/common/Input.vue")
);
const ButtonForm = defineAsyncComponent(
  () => import("@/components/common/ButtonForm.vue")
);
const Loader = defineAsyncComponent(
  () => import("@/components/common/Loader.vue")
);
const BaseSelect = defineAsyncComponent(
  () => import("@/components/common/Select.vue")
);
const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);
const Modal = defineAsyncComponent(
  () => import("@/components/common/Modal.vue")
);

const router = useRouter();
const route = useRoute();
const mode = ref<string>("add");
const loading = ref(false);
const isSubmitting = ref(false);
const id = ref(route?.params?.id ?? "");
const { post, get, put, remove } = useAxios();
const moduleName = ref("");
const userList = ref<any>([]);
const querySearch = ref("");
const labels = ref<any>([]);

const tableColumns = {
  name: { label: "Pemberi Persetujuan" },
  position_name: { label: "Jabatan" },
  order: { label: "Urutan" },
  description: { label: "Deskripsi" },
};
const tableConfig = reactive({
  buttonName: "Tambah Approval",
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
});
const configModal = reactive({
  isOpen: false,
  title: "Tambah Approval",
  isLoading: false,
  isAdd: true,
});

const onDelete = async (id: string | number) => {
  return await remove(`/approvalMaster/delete/${id}`);
};

const onAdd = () => {
  configModal.isOpen = true;
  configModal.title = "Tambah Approval";
  configModal.isAdd = true;
  resetState();
};

const onSearch = (query: string) => {
  querySearch.value = query;
  fetchDetail();
};

const onEdit = async (id: string | number) => {
  formSubmitted.value = false;
  const { data, success, message } = await get(`/approvalMaster/show/${id}`);
  if (success) {
    approvalForms.value = {
      ...approvalForms.value,
      ...data,
      order: data?.order?.toString(),
    };

    configModal.isOpen = true;
    configModal.title = "Ubah Master Approval";
    configModal.isAdd = false;
  } else showErrorToast(message ?? "Gagal load data");
};

const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchDetail();
};

const onBack = () => {
  router.push("/master/approval");
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onCreate = async (payload: any) => {
  return await post("/approvalMaster/store", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/approvalMaster/update/${id}`, { ...payload });
};

const onSubmit = async () => {
  isSubmitting.value = true;
  const check = validate();
  if (check) {
    const payload = {
      ...approvalForms.value,
      module: id.value,
      project_id: currentProjectId.value,
    };
    const { message, success } = configModal.isAdd
      ? await onCreate(payload)
      : await onUpdate(payload, approvalForms.value.id);

    if (success) {
      showSuccessToast(
        message ?? `approval ${moduleName.value}  berhasil disimpan`
      );
      configModal.isLoading = false;
      configModal.isOpen = false;

      fetchDetail();
    } else {
      showErrorToast(message ?? "Gagal menyimpan data");
      configModal.isLoading = false;
    }
    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const resetState = () => {
  approvalForms.value = { ...initialApprovalForm };
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(`/approvalMaster/listDetail`, {
    params: {
      module_id: id.value,
      project_id: currentProjectId.value,
    },
  });
  if (success) {
    tableConfig.items = data?.data ?? [];
  } else showErrorToast(message ?? "Gagal load data");

  loading.value = false;
};

const fetchUsers = async () => {
  const { data, success } = await get("/employee/searchByProject", {
    params: {
      project_id: currentProjectId.value,
    },
  });
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

const fetchLabelDescription = async () => {
  const { data, success } = await get("/approvalMaster/getDescription", {
    params: {
      project_id: currentProjectId.value,
    },
  });
  if (success) {
    labels.value =
      data?.map((item: any) => {
        return {
          id: item?.description,
          name: item?.description,
        };
      }) ?? [];
  }
};

onMounted(() => {
  fetchLabelDescription();
  fetchUsers();
  moduleName.value = (route?.query["module_name"] as string) ?? "";
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  if (mode.value !== "add") fetchDetail();
});
</script>
