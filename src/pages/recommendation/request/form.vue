<template>
  <div class="card container-fluid p-4">
    <Loader v-if="loading && mode !== 'add'" />
    <form
      v-else
      class="row g-3 needs-validation custom-input"
      novalidate
      @submit.prevent="onSubmit()"
    >
      <div class="d-flex flex-row gap-4 justify-content-between">
        <div class="d-flex flex-column gap-2 w-100">
          <div class="col-12">
            <label class="form-label"> Tanggal </label>
            <DatePicker
              :value="date"
              :showIcon="false"
              :disabled-input="disabledInput || isSubmitting"
              @change="handleSelectDate"
            />
          </div>

          <div class="col-12">
            <label class="form-label"> Nomor Permintaan Pembelian </label>
            <BaseSelect
              v-if="mode === 'add'"
              :disabled-input="disabledInput || isSubmitting || mode !== 'add'"
              error-message="Silahkan pilih Transaksi"
              :has-submitted="formSubmitted"
              :options="transactionList"
              required
              :value="headerForms.purchase_request_id"
              @change="(val: any) => handleChangeTransaction(val)"
            />
            <BaseInput
              v-else
              type="text"
              :has-submitted="formSubmitted"
              :value="headerForms.purchase_request_number"
              :disabled-input="true"
            />
          </div>

          <div v-if="mode != 'add'" class="col-12">
            <label class="form-label"> Vendor </label>
            <BaseSelect
              :disabled-input="disabledInput || isSubmitting"
              error-message="Silahkan pilih vendor"
              :has-submitted="formSubmitted"
              :options="vendorList"
              :value="headerForms.vendor_id"
              @change="(val: any) => headerForms.vendor_id = val?.id ?? ''"
            />
          </div>

          <div v-if="mode != 'add'" class="col-12">
            <label class="form-label"> Catatan </label>
            <BaseInput
              as="textarea"
              :has-submitted="formSubmitted"
              :value="headerForms.note"
              :disabled-input="isSubmitting || disabledInput"
              @change="(val: string) => (headerForms.note = val)"
            />
          </div>

          <div v-if="mode != 'add'" class="col-12">
            <label class="form-label"> Catatan Pembayaran </label>
            <BaseInput
              as="textarea"
              :has-submitted="formSubmitted"
              :value="headerForms.payment_note"
              :disabled-input="isSubmitting || disabledInput"
              @change="(val: string) => (headerForms.payment_note = val)"
            />
          </div>
        </div>

        <Approval
          v-if="approvalList.length > 0"
          :approval-list="approvalList"
        />
      </div>

      <div
        v-if="headerForms.purchase_request_id || mode !== 'add'"
        class="col-12 pb-4"
      >
        <hr />
        <Table
          v-bind="tableConfig"
          :delete-fn="onDelete"
          @add="onAdd"
          @edit="onEdit"
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
          <CurrencyInput
            v-model="taxForms.ppn"
            :has-submitted="formSubmitted"
            :disabled-input="
              isSubmitting || disabledInput || headerForms.status != 'draft'
            "
            error-message="Silahkan isi nominal PPN"
          />
        </div>

        <div class="col-6">
          <label class="form-label"> Pph </label>
          <CurrencyInput
            v-model="taxForms.pph"
            :has-submitted="formSubmitted"
            :disabled-input="
              isSubmitting || disabledInput || headerForms.status != 'draft'
            "
            error-message="Silahkan isi nominal PPh"
          />
        </div>
        <h6
          v-if="mode === 'edit' && headerForms.status === 'draft'"
          class="text-end mt-1 text-muted font-italic"
        >
          *Mohon isi ppn dan pph untuk terbitkan rekomendasi harga ini
        </h6>
      </div>

      <ButtonForm :is-loading="isSubmitting" :mode="mode" @on-back="onBack">
        <button
          v-if="
            headerForms.status !== 'approved' &&
            tableConfig.items.length > 0 &&
            mode == 'edit'
          "
          class="btn btn-success"
          type="button"
          :disabled="false"
          @click="updateStatus"
        >
          {{ headerForms.status === "draft" ? "Terbitkan" : "Batal Terbitkan" }}
        </button>
      </ButtonForm>
    </form>

    <Modal
      v-bind="configModal"
      @close="configModal.isOpen = false"
      @submit="onSubmitDetail()"
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
            <label class="form-label"> Produk </label>
            <BaseSelect
              :disabled-input="isSubmitting"
              error-message="Silahkan pilih produk"
              :has-submitted="formSubmitted"
              :options="productList"
              :value="forms.product_id"
              required
              @change="(val: any) => forms.product_id = val?.id ?? ''"
            />
          </div>
          <div class="col-12">
            <label class="form-label"> Harga </label>
            <CurrencyInput
              v-model="forms.price"
              :has-submitted="formSubmitted"
              :disabled-input="isSubmitting"
              required
              error-message="Silahkan isi harga produk"
            />
          </div>
          <div class="col-12">
            <label class="form-label"> Jumlah Barang / Jasa </label>
            <BaseInput
              type="number"
              :has-submitted="formSubmitted"
              :value="forms.quantity"
              :disabled-input="isSubmitting"
              required
              error-message="Silahkan isi jumlah barang / jasa"
              @change="(val: string) => (forms.quantity = val)"
            />
          </div>

          <div class="col-12">
            <label class="form-label"> Catatan </label>
            <BaseInput
              type="text"
              :has-submitted="formSubmitted"
              :value="forms.remark"
              :disabled-input="isSubmitting"
              error-message="Silahkan isi catatan"
              @change="(val: string) => (forms.remark = val)"
            />
          </div>

          <div class="col-12">
            <label class="form-label"> Deskripsi </label>
            <BaseInput
              as="textarea"
              :has-submitted="formSubmitted"
              :value="forms.description"
              :disabled-input="isSubmitting"
              error-message="Silahkan isi deskripsi"
              @change="(val: string) => (forms.description = val)"
            />
          </div>
        </form>
      </template>
    </Modal>
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
import {
  validateHeader,
  headerForms,
  formSubmitted,
  taxForms,
  forms,
  validate,
} from "./form";
import { useRoute, useRouter } from "vue-router";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import { viewMode } from "@/composables/viewMode";
import useAxios from "@/composables/axios";
import { currentProjectId, convertCurrency } from "@/composables/helpers";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const ButtonForm = defineAsyncComponent(
  () => import("@/components/common/ButtonForm.vue")
);
const Loader = defineAsyncComponent(
  () => import("@/components/common/Loader.vue")
);
const BaseSelect = defineAsyncComponent(
  () => import("@/components/common/Select.vue")
);
const BaseInput = defineAsyncComponent(
  () => import("@/components/common/Input.vue")
);
const DatePicker = defineAsyncComponent(
  () => import("@/components/common/DateTimePicker.vue")
);
const CurrencyInput = defineAsyncComponent(
  () => import("@/components/common/CurrencyInput.vue")
);
const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);
const Modal = defineAsyncComponent(
  () => import("@/components/common/Modal.vue")
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
const date = ref(new Date());
const departementList = ref<any>([]);
const transactionList = ref<any>([]);
const approvalList = ref<any>([]);
const querySearch = ref("");
const coaList = ref<any>([]);
const productList = ref<any>([]);
const detailId = ref<string | number>("");
const vendorList = ref<any>([]);

const tableColumns = {
  chart_of_account_name: { label: "COA" },
  product_name: { label: "Barang" },
  price: { label: "Harga Barang", align: "end" },
  quantity: { label: "Jumlah Barang", align: "end" },
  total: { label: "Total", align: "end" },
  remark: { label: "Catatan" },
};
const tableConfig = reactive({
  buttonName: "Tambah Detail",
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
  canSearch: false,
});
const configModal = reactive({
  isOpen: false,
  title: "Tambah Detail",
  isLoading: false,
  isAdd: true,
});

const onAdd = () => {
  configModal.isOpen = true;
  configModal.title = "Tambah Detail";
  configModal.isAdd = true;
  resetDetail();
};

const resetDetail = () => {
  forms.value = {
    project_id: "",
    chart_of_account_code: "",
    description: "",
    price: 0,
    product_id: "",
    quantity: "",
    remark: "",
  };
  formSubmitted.value = false;
};

const onBack = () => {
  router.push({ name: "DaftarRekomendasi" });
};

const disabledInput = computed(() => {
  return mode.value === "detail";
});

const onCreate = async (payload: any) => {
  return await post("/Recommendation/store", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/Recommendation/update/${id}`, { ...payload });
};

const handleChangeTransaction = (val: any) => {
  headerForms.value.purchase_request_id = val?.id ?? "";
  if (val) {
    fetchPurchaseRequestDetail();
    if (mode.value === "add") {
      tableConfig.canCreate =
        tableConfig.canEdit =
        tableConfig.canEdit =
        tableConfig.canView =
        tableConfig.canDelete =
        tableConfig.hasAction =
          false;
    }
  }
};

const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchPurchaseRequestDetail();
};

const fetchPurchaseRequestDetail = async () => {
  tableConfig.loading = true;
  try {
    const { data } = await get(
      `/${
        mode.value === "add"
          ? "PurchaseRequestDetail"
          : "RecommendationDetail/list"
      }`,
      {
        params: payload.value,
      }
    );

    tableConfig.items =
      data?.detail?.data.map((item: any) => {
        item.price = convertCurrency(item.price, true);
        item.total = convertCurrency(item.total, true);
        item.quantity = Number(item.quantity);

        return item;
      }) ?? [];
    if (mode.value !== "add") approvalList.value = data?.approval ?? [];
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
    purchase_request_id: headerForms.value.purchase_request_id,
    recommendation_id: id.value,
    project_id: currentProjectId.value,
  };
});

const onSubmit = async () => {
  isSubmitting.value = true;
  headerForms.value = {
    ...headerForms.value,
    date: dayjs(date.value).format("YYYY-MM-DD"),
  };
  const check = validateHeader();

  if (check) {
    const payload = {
      ...headerForms.value,
      purchase_request_id: headerForms.value.purchase_request_id,
      ppn: 0,
      pph: 0,
    };
    const { message, success } =
      mode.value === "add"
        ? await onCreate(payload)
        : await onUpdate(payload, id.value);

    if (success) {
      showSuccessToast(message ?? "Data berhasil disimpan");
      setTimeout(() => router.push({ name: "DaftarRekomendasi" }), 500);
    } else showErrorToast(message ?? "Gagal menyimpan data");
    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const resetState = () => {
  headerForms.value = {
    project_id: "",
    date: "",
    department_id: "",
    vendor_id: "",
    payment_note: "",
  };
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(
    `/Recommendation/show/${id.value}`
  );
  if (success) {
    headerForms.value = {
      ...data,
      project_id: data?.project_id,
    };
    taxForms.value = {
      ...taxForms.value,
      ppn: Number(data?.ppn ?? 0),
      pph: Number(data?.pph ?? 0),
    };
    date.value = new Date(data.date);

    nextTick(() => {
      fetchPurchaseRequestDetail();
      if (mode.value == "detail" || headerForms.value.status != "draft") {
        tableConfig.canCreate =
          tableConfig.canEdit =
          tableConfig.canEdit =
          tableConfig.canView =
          tableConfig.canDelete =
          tableConfig.hasAction =
            false;
      } else {
        tableConfig.canCreate =
          tableConfig.canEdit =
          tableConfig.canEdit =
          tableConfig.canDelete =
          tableConfig.hasAction =
            true;
      }
    });
  } else showErrorToast(message ?? "Gagal load data");

  loading.value = false;
};

const fetchProject = async () => {
  const { data, success } = await get(`/project/search`);
  if (success) projectList.value = data;
};

const fetchPurchaseRequest = async () => {
  const { data, success } = await get(`/PurchaseRequest/approved`, {
    params: {
      project_id:
        mode.value === "add"
          ? currentProjectId.value
          : headerForms.value.project_id,
      action: "recommendations",
    },
  });
  if (success)
    transactionList.value =
      data?.map((d: any) => {
        return {
          id: d.id,
          name: d.number,
          module: d.module,
          department_id: d?.department_id,
        };
      }) ?? [];
};

const handleSelectDate = (val: string) => {
  date.value = new Date(val);
};

const updateStatus = async () => {
  try {
    Swal.fire({
      icon: "warning",
      title: "Apakah anda yakin?",
      text: `Anda akan ${
        headerForms.value.status === "draft" ? "menerbitkan" : "menarik kembali"
      } rekomendasi harga ini`,
      showCancelButton: true,
      confirmButtonText: "Ok",
      confirmButtonColor: "var(--theme-default)",
      cancelButtonText: "Kembali",
      cancelButtonColor: "#efefef",
    }).then(async (result: any) => {
      if (result.value) {
        isSubmitting.value = true;
        const payload = {
          ...taxForms.value,
          status: headerForms.value.status === "draft" ? "pending" : "draft",
        };
        const { message, success } = await put(
          `/Recommendation/updateStatus/${id.value}`,
          { ...payload }
        );
        if (success) {
          showSuccessToast(message ?? `Data berhasil disimpan`);
          fetchDetail();
        } else showErrorToast(message ?? "Gagal load data");

        isSubmitting.value = false;
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const onCreateDetail = async (payload: any) => {
  return await post("/RecommendationDetail/store", { ...payload });
};
const onUpdateDetail = async (payload: any, id: any) => {
  return await put(`/RecommendationDetail/update/${id}`, { ...payload });
};

const onSubmitDetail = async () => {
  isSubmitting.value = true;
  const check = validate();
  if (check) {
    const payload = {
      ...forms.value,
      recommendation_id: id.value,
      price: forms.value.price?.toString() ?? "",
      project_id: currentProjectId.value,
    };
    const { message, success } = configModal.isAdd
      ? await onCreateDetail(payload)
      : await onUpdateDetail(payload, detailId.value);

    if (success) {
      showSuccessToast(message ?? `Data berhasil disimpan`);
      configModal.isLoading = false;
      configModal.isOpen = false;

      fetchPurchaseRequestDetail();
    } else {
      showErrorToast(message ?? "Gagal menyimpan data");
      configModal.isLoading = false;
    }
    isSubmitting.value = false;
  } else isSubmitting.value = false;
};

const onEdit = async (id: string | number) => {
  detailId.value = id;
  const { data, success, message } = await get(
    `/RecommendationDetail/show/${id}`
  );
  if (success) {
    const mappedData = data?.[0] ?? [];
    forms.value = {
      ...forms.value,
      chart_of_account_code: mappedData?.chart_of_account_code,
      product_id: mappedData?.product_id,
      price: Number(mappedData?.price),
      quantity: Number(mappedData.quantity).toString(),
      remark: mappedData?.remark,
      description: mappedData?.description,
    };

    configModal.isOpen = true;
    configModal.title = "Ubah Detail";
    configModal.isAdd = false;
  } else showErrorToast(message ?? "Gagal load data");
};

const onDelete = async (id: string | number) => {
  return await remove(`/RecommendationDetail/delete/${id}`);
};

const fetchProduct = async () => {
  const { data, success } = await get(`/product/search`);
  if (success) productList.value = data;
};

const fetchCoa = async () => {
  const { data, success } = await get(`/coa/search`);
  if (success)
    coaList.value = data?.map((item: any) => {
      item.id = item?.code;
      return item;
    });
};
const fetchVendor = async () => {
  const { data, success } = await get(`/vendor/search`);
  if (success) vendorList.value = data;
};

onMounted(async () => {
  resetState();
  const currentRoute = router.currentRoute.value.fullPath;
  mode.value = viewMode(currentRoute);

  fetchPurchaseRequest();
  await fetchProject();
  headerForms.value.project_id = currentProjectId.value;

  if (mode.value !== "add") {
    await fetchVendor();
    fetchDetail();
    fetchCoa();
    fetchProduct();
  }
});
</script>
