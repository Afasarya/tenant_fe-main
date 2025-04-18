<template>
  <div class="card container-fluid p-4">
    <Loader v-if="loading && mode !== 'add'" />
    <div v-else class="row g-3 needs-validation custom-input">
      <div class="d-flex flex-row gap-4 justify-content-between">
        <div class="d-flex flex-column gap-2 w-100">
          <div class="col-12">
            <label class="form-label"> Tanggal </label>
            <BaseInput
              type="text"
              :value="headerForms.date"
              :disabled-input="true"
            />
          </div>

          <div class="col-12">
            <label class="form-label"> Nomor Permintaan Pembelian </label>
            <BaseInput
              type="text"
              :value="headerForms.purchase_request_number"
              :disabled-input="true"
            />
          </div>

          <div class="col-12">
            <label class="form-label"> Vendor </label>
            <BaseInput
              type="text"
              :value="headerForms.vendor_name"
              :disabled-input="true"
            />
          </div>

          <div class="col-12">
            <label class="form-label"> Catatan </label>
            <BaseInput
              as="textarea"
              :value="headerForms.note"
              :disabled-input="true"
            />
          </div>

          <div class="col-12">
            <label class="form-label"> Catatan Pembayaran </label>
            <BaseInput
              as="textarea"
              :value="headerForms.payment_note"
              :disabled-input="true"
            />
          </div>
        </div>

        <Approval
          v-if="approvalList.length > 0"
          :approval-list="approvalList"
        />
      </div>

      <div class="col-12 pb-4">
        <hr />
        <Table
          v-bind="tableConfig"
          @update-pagination="onChangePagination"
          @fetch="fetchPurchaseRequestDetail()"
        />
      </div>

      <div
        v-if="tableConfig.items.length > 0"
        class="row g-3 needs-validation custom-input"
      >
        <hr />
        <div class="col-6">
          <label class="form-label"> PPN </label>
          <CurrencyInput v-model="taxForms.ppn" :disabled-input="true" />
        </div>

        <div class="col-6">
          <label class="form-label"> Pph </label>
          <CurrencyInput v-model="taxForms.pph" :disabled-input="true" />
        </div>
      </div>

      <ButtonForm :is-loading="isSubmitting" mode="detail" @on-back="onBack">
        <button
          v-if="showButtonApproved"
          :class="`btn btn-${
            showButtonApproved?.approved_at ? 'danger' : 'primary'
          }`"
          type="button"
          :disabled="disabledButton || nextApproval"
          @click="approvePayment"
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
import {
  computed,
  defineAsyncComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
} from "vue";
import { headerForms, taxForms } from "../../request/form";
import { useRoute, useRouter } from "vue-router";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import { viewMode } from "@/composables/viewMode";
import useAxios from "@/composables/axios";
import {
  currentProjectId,
  convertCurrency,
  currentUser,
} from "@/composables/helpers";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const ButtonForm = defineAsyncComponent(
  () => import("@/components/common/ButtonForm.vue")
);
const Loader = defineAsyncComponent(
  () => import("@/components/common/Loader.vue")
);
const BaseInput = defineAsyncComponent(
  () => import("@/components/common/Input.vue")
);
const CurrencyInput = defineAsyncComponent(
  () => import("@/components/common/CurrencyInput.vue")
);
const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
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
const { get, put } = useAxios();
const approvalList = ref<any>([]);
const querySearch = ref("");
const currentApproval = ref<number>();

const tableColumns = {
  chart_of_account_name: { label: "COA" },
  product_name: { label: "Barang" },
  price: { label: "Harga Barang", align: "end" },
  quantity: { label: "Jumlah Barang", align: "end" },
  total: { label: "Total", align: "end" },
  remark: { label: "Catatan" },
};
const tableConfig = reactive({
  buttonName: "Tambah Pembelian",
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
  canSearch: false,
});

const onBack = () => {
  router.push({ name: "DaftarApprovalRekomemdasi" });
};

const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchPurchaseRequestDetail();
};

const fetchPurchaseRequestDetail = async () => {
  tableConfig.loading = true;
  try {
    const { data } = await get(`RecommendationDetail/list`, {
      params: payload.value,
    });

    tableConfig.items =
      data?.detail?.data.map((item: any) => {
        item.price = convertCurrency(item.price, true);
        item.total = convertCurrency(item.total, true);
        item.quantity = Number(item.quantity);

        return item;
      }) ?? [];
    approvalList.value = data?.approval ?? [];
    currentApproval.value = data?.current_approval?.order ?? 0;
    tableConfig.pagination.totalData = data?.detail?.total ?? 1;
    tableConfig.pagination.totalPage = data?.detail?.last_page ?? 1;
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
    recommendation_id: id.value,
    project_id: currentProjectId.value,
  };
});

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(
    `/Recommendation/show/${id.value}`
  );
  if (success) {
    headerForms.value = {
      ...data,
      project_id: data?.project_id,
      date: dayjs(data.date).format("DD/MM/YYYY"),
    };
    taxForms.value = {
      ...taxForms.value,
      ppn: Number(data?.ppn ?? 0),
      pph: Number(data?.pph ?? 0),
    };

    nextTick(() => {
      fetchPurchaseRequestDetail();
    });
  } else showErrorToast(message ?? "Gagal load data");

  loading.value = false;
};

const approvePayment = async () => {
  Swal.fire({
    icon: "warning",
    title: "Apakah anda yakin?",
    text: `Anda akan ${
      showButtonApproved?.value?.approved_at ? "membatalkan" : "mengubah status"
    } rekomendasi harga ini`,
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
        showSuccessToast(message ?? `Data berhasil disimpan`);
        fetchDetail();
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

  if (mode.value !== "add") {
    fetchDetail();
  }
});
</script>
