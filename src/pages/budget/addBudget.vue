<template>
  <div class="card container-fluid p-4">
    <Loader v-if="loading && mode !== 'add'" />
    <div v-else class="row g-3 needs-validation custom-input">
      <div class="d-flex flex-row gap-4 justify-content-between">
        <div class="w-100 d-flex flex-column gap-2">
          <div v-if="headerForms.project_id" class="col-12">
            <label class="form-label"> Nama Proyek </label>
            <BaseSelect
              :disabled-input="true"
              :options="projectList"
              :value="headerForms.project_id"
            />
          </div>

          <div class="col-12">
            <label class="form-label"> Tahun </label>
            <BaseInput
              type="number"
              :value="headerForms.year.toString()"
              :disabled-input="true"
            />
          </div>

          <div class="col-12">
            <label class="form-label"> Nomor Anggaran </label>
            <BaseInput
              type="text"
              :value="headerForms.nomor"
              :disabled-input="true"
            />
          </div>

          <div class="col-12">
            <label class="form-label"> Nilai Proyek </label>
            <CurrencyInput
              v-model="headerForms.project_value"
              :disabled-input="true"
            />
          </div>
        </div>

        <Approval
          v-if="approvalList.length > 0"
          :approval-list="approvalList"
        />
      </div>

      <hr />

      <div class="col-12 pb-4 pt-4">
        <Table
          v-bind="tableConfig"
          :delete-fn="onDelete"
          @add="onAdd"
          @search="onSearch"
          @edit="onEdit"
          @update-pagination="onChangePagination"
          @fetch="fetchBudgetList()"
        >
          <template #footer v-if="tableConfig.items.length > 0">
            <td colspan="3" class="text-end fw-bold border-top border-bottom">
              <div class="d-flex gap-4 justify-content-end">
                <span>Total Anggaran</span>
                <span> {{ convertCurrency(total, true) }} </span>
              </div>
            </td>
            <td v-if="tableConfig.hasAction" class="border-top border-bottom" />
          </template>
        </Table>
      </div>

      <ButtonForm :is-loading="isSubmitting" mode="detail" @on-back="onBack">
        <button
          v-if="
            headerForms.status !== 'approved' && tableConfig.items.length > 0
          "
          class="btn btn-primary"
          type="button"
          :disabled="false"
          @click="updateStatusBudget"
        >
          {{ headerForms.status === "draft" ? "Terbitkan" : "Batal Terbitkan" }}
        </button>
      </ButtonForm>
    </div>

    <Modal
      v-bind="configModal"
      @close="configModal.isOpen = false"
      @submit="onSubmit()"
    >
      <template #content>
        <form class="row g-3 needs-validation custom-input" novalidate>
          <div class="col-12">
            <label class="form-label"> COA </label>
            <BaseSelect
              :disabled-input="isSubmitting"
              error-message="Silahkan pilih COA"
              :has-submitted="formSubmitted"
              :options="coaList"
              :value="forms.chart_of_account_code"
              required
              @change="(val: any) => forms.chart_of_account_code = val?.id ?? ''"
            />
          </div>
          <div class="col-12">
            <label class="form-label"> Jumlah Anggaran </label>
            <CurrencyInput
              v-model="forms.amount"
              :has-submitted="formSubmitted"
              :disabled-input="isSubmitting"
              required
              error-message="Silahkan isi nominal anggaran"
            />
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref, reactive } from "vue";
import { validate, headerForms, formSubmitted, forms } from "./form";
import { useRoute, useRouter } from "vue-router";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import { viewMode } from "@/composables/viewMode";
import useAxios from "@/composables/axios";
import { convertCurrency } from "@/composables/helpers";
import Swal from "sweetalert2";

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
const CurrencyInput = defineAsyncComponent(
  () => import("@/components/common/CurrencyInput.vue")
);
const Approval = defineAsyncComponent(
  () => import("@/components/common/Approval.vue")
);

const router = useRouter();
const route = useRoute();
const mode = ref<string>("add");
const loading = ref(false);
const isSubmitting = ref(false);
const id = ref(route?.params?.id ?? "");
const { post, get, put, remove } = useAxios();
const projectList = ref<any>([]);
const coaList = ref<any>([]);
const detailId = ref<string | number>("");
const approvalList = ref<any>([]);

const tableColumns = {
  chart_of_accounts_name: { label: "COA" },
  amount: { label: "Total Budget", align: "end" },
};
const tableConfig = reactive({
  buttonName: "Tambah Anggaran",
  items: [],
  columns: tableColumns,
  pagination: {
    page: 1,
    pageSize: 10,
    totalData: 1,
    totalPage: 1,
  },
  loading: false,
  canView: false,
  canCreate: true,
  canEdit: true,
  canDelete: true,
  hasAction: true,
});
const querySearch = ref("");
const configModal = reactive({
  isOpen: false,
  title: "Tambah Anggaran",
  isLoading: false,
  isAdd: true,
});

const onSearch = (query: string) => {
  querySearch.value = query;
  fetchBudgetList();
};
const onAdd = () => {
  configModal.isOpen = true;
  configModal.title = "Tambah Anggaran";
  configModal.isAdd = true;
  resetState();
};
const onEdit = async (id: string | number) => {
  formSubmitted.value = false;
  detailId.value = id;
  const { data, success, message } = await get(`/budget/detail/show/${id}`);
  if (success) {
    forms.value = {
      ...forms.value,
      amount: Number(data?.amount),
      chart_of_account_code: data?.chart_of_account_code,
    };

    configModal.isOpen = true;
    configModal.title = "Ubah Anggaran";
    configModal.isAdd = false;
  } else showErrorToast(message ?? "Gagal load data");
};
const onDelete = async (id: string | number) => {
  return await remove(`/budget/detail/delete/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchBudgetList();
};
const fetchBudgetList = async () => {
  tableConfig.loading = true;
  try {
    const { data } = await get(`/budget/detail/${id.value}`, {
      params: payload.value,
    });

    tableConfig.items =
      data?.detail?.data?.map((item: any) => {
        item.rawAmount = item.amount;
        item.amount = convertCurrency(item.amount, true);
        return item;
      }) ?? [];
    approvalList.value = data?.approval ?? [];
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
    project_id: headerForms.value.project_id,
  };
});

const total = computed(() => {
  return tableConfig.items?.reduce(
    (sum, item: any) => sum + Number(item.rawAmount),
    0
  );
});

const onBack = () => {
  router.push({ name: "DaftarAnggaran" });
};

const onCreate = async (payload: any) => {
  return await post("/budget/detail/store", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/budget/detail/update/${id}`, { ...payload });
};

const onSubmit = async () => {
  isSubmitting.value = true;
  const check = validate();
  if (check) {
    const payload = {
      chart_of_account_code: forms.value.chart_of_account_code,
      budget_id: id.value,
      amount: Number(forms.value.amount),
    };
    const { message, success } = configModal.isAdd
      ? await onCreate(payload)
      : await onUpdate(payload, detailId.value);

    if (success) {
      showSuccessToast(message ?? `Budget berhasil disimpan`);
      configModal.isLoading = false;
      configModal.isOpen = false;

      fetchBudgetList();
    } else {
      showErrorToast(message ?? "Gagal menyimpan data");
      configModal.isLoading = false;
    }
    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const resetState = () => {
  forms.value = {
    project_id: "",
    chart_of_account_code: "",
    amount: 0,
    year: "",
  };
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(
    `/budget/showYearBudget/${id.value}`
  );
  if (success) {
    headerForms.value = {
      ...data,
      project_id: data?.project_id,
      nomor: data?.number,
      project_value: Number(data?.projects_value),
    };
    tableConfig.canCreate =
      tableConfig.canEdit =
      tableConfig.canDelete =
      tableConfig.hasAction =
        data?.status === "draft";
  } else showErrorToast(message ?? "Gagal load data");

  loading.value = false;
};

const fetchProject = async () => {
  const { data, success } = await get(`/project/search`);
  if (success) projectList.value = data;
};

const fetchCoa = async () => {
  const { data, success } = await get(`/coa/search`);
  if (success)
    coaList.value = data?.map((item: any) => {
      item.id = item?.code;
      return item;
    });
};

const updateStatusBudget = async () => {
  Swal.fire({
    icon: "warning",
    title: "Apakah anda yakin?",
    text: `Anda akan ${
      headerForms.value.status === "draft" ? "menerbitkan" : "menarik kembali"
    } anggaran ini`,
    showCancelButton: true,
    confirmButtonText: "Ok",
    confirmButtonColor: "var(--theme-default)",
    cancelButtonText: "Kembali",
    cancelButtonColor: "#efefef",
  }).then(async (result) => {
    if (result.value) {
      isSubmitting.value = true;
      const { success, message } = await put(
        `/budget/updateStatus/${id.value}`,
        { status: headerForms.value.status === "draft" ? "pending" : "draft" }
      );
      if (success) {
        showSuccessToast(message ?? `Budget berhasil disimpan`);
        fetchDetail();
      } else showErrorToast(message ?? "Gagal load data");

      isSubmitting.value = false;
    }
  });
};

onMounted(async () => {
  resetState();
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  fetchBudgetList();
  fetchCoa();
  await fetchProject();
  fetchDetail();
});
</script>
