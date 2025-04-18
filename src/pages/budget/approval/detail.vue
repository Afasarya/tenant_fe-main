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
          @search="onSearch"
          @update-pagination="onChangePagination"
          @fetch="fetchDetail()"
        >
          <template #footer v-if="tableConfig.items.length > 0">
            <td colspan="3" class="text-end fw-bold border-top border-bottom">
              <div class="d-flex gap-4 justify-content-end">
                <span>Total Anggaran</span>
                <span> {{ convertCurrency(total, true) }} </span>
              </div>
            </td>
          </template>
        </Table>
      </div>

      <ButtonForm :is-loading="isSubmitting" mode="detail" @on-back="onBack">
        <button
          v-if="showButtonApproved"
          :class="`btn btn-${
            showButtonApproved?.approved_at ? 'danger' : 'primary'
          }`"
          type="button"
          :disabled="disabledButton || nextApproval"
          @click="approveBudget"
        >
          {{ buttonName }}
        </button>
      </ButtonForm>
      <p
        v-if="disabledButton && showButtonApproved"
        class="text-end mt-1 text-muted"
      >
        Kamu harus menunggu anggaran ini disahkan dulu oleh pemberi pengesahan
        yang lain.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref, reactive } from "vue";
import { headerForms } from "../form";
import { useRoute, useRouter } from "vue-router";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import { viewMode } from "@/composables/viewMode";
import useAxios from "@/composables/axios";
import {
  convertCurrency,
  currentProjectId,
  currentUser,
} from "@/composables/helpers";
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
const Approval = defineAsyncComponent(
  () => import("@/components/common/Approval.vue")
);
const CurrencyInput = defineAsyncComponent(
  () => import("@/components/common/CurrencyInput.vue")
);

const router = useRouter();
const route = useRoute();
const mode = ref<string>("add");
const loading = ref(false);
const isSubmitting = ref(false);
const id = ref(route?.params?.id ?? "");
const { get, put } = useAxios();
const projectList = ref<any>([]);
const approvalList = ref<any>([]);
const currentApproval = ref<number>();

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
  canCreate: false,
  canEdit: false,
  canDelete: false,
  hasAction: false,
});
const querySearch = ref("");

const onSearch = (query: string) => {
  querySearch.value = query;
  fetchBudgetList();
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
      project_id: currentProjectId.value,
    });

    tableConfig.items =
      data?.detail?.data?.map((item: any) => {
        item.rawAmount = item.amount;
        item.amount = convertCurrency(item.amount, true);
        return item;
      }) ?? [];
    approvalList.value = data?.approval ?? [];
    currentApproval.value = data?.current_approval?.order ?? 0;
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

const total = computed(() => {
  return tableConfig.items?.reduce(
    (sum, item: any) => sum + Number(item.rawAmount),
    0
  );
});

const onBack = () => {
  router.push({ name: "ApprovalAnggaran" });
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(
    `/budget/showYearBudget/${id.value}`,
    { params: { project_id: currentProjectId.value } }
  );
  if (success) {
    headerForms.value = {
      ...data,
      nomor: data?.number,
      project_value: Number(data?.projects_value ?? 0),
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

const approveBudget = async () => {
  Swal.fire({
    icon: "warning",
    title: "Apakah anda yakin?",
    text: `Anda akan ${
      showButtonApproved?.value?.approved_at ? "membatalkan" : "mengubah status"
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
        `/approvalTransaction/${
          showButtonApproved?.value?.approved_at ? "cancel" : "approve"
        }/${showButtonApproved.value.id}`
      );
      if (success) {
        showSuccessToast(message ?? `Budget berhasil disimpan`);
        fetchDetail();
        fetchBudgetList();
      } else showErrorToast(message ?? "Gagal load data");

      isSubmitting.value = false;
    }
  });
};

const showButtonApproved = computed(() => {
  return approvalList.value?.find(
    (apr: any) => apr?.approved_by === currentUser.value?.id
  );
});

const disabledButton = computed(() => {
  return (
    !showButtonApproved.value?.approved_at &&
    showButtonApproved.value?.order !== currentApproval.value
  );
});

const nextApproval = computed(() => {
  const index = approvalList.value?.findIndex(
    (p: any) => p.id === showButtonApproved.value?.id
  );
  return approvalList.value?.[index + 1]?.approved_at;
});

const buttonName = computed(() => {
  if (!showButtonApproved.value?.approved_at) {
    if (showButtonApproved.value?.description == "Diperiksa") return "Periksa";
    return showButtonApproved.value?.description;
  }

  return "Batalkan";
});

onMounted(async () => {
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  fetchBudgetList();
  await fetchProject();
  fetchDetail();
});
</script>
