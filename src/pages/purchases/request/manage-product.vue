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
            <label class="form-label"> Nomor Permintaan Pembelian </label>
            <BaseInput
              type="text"
              :value="headerForms.number"
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
          @fetch="fetchProductList()"
        >
          <template #footer v-if="tableConfig.items.length > 0">
            <td colspan="5" class="text-end fw-bold border-top border-bottom">
              Total Pembelian
            </td>
            <td class="text-end fw-bold border-top border-bottom">
              {{ convertCurrency(headerForms.total, true) }}
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
          @click="updateStatusPurchase"
        >
          {{ headerForms.status === "draft" ? "Terbitkan" : "Batal Terbitkan" }}
        </button>
      </ButtonForm>
    </div>

    <Modal
      v-bind="configModal"
      :is-disabled="showAlertBudget"
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
              @change="(val: any) => handleChangeCoa(val)"
            >
              <template #option="{ option }">
                <div class="d-flex flex-column gap-1">
                  <span> {{ option.name }} </span>
                  <div class="d-flex flex-column gap-0">
                    <span class="custom-budget">
                      Total anggaran:
                      {{ convertCurrency(Number(option?.budget) ?? 0, true) }}
                    </span>
                    <span class="custom-budget">
                      Sisa anggaran:
                      {{
                        convertCurrency(
                          Number(option?.remaining_budget) ?? 0,
                          true
                        )
                      }}
                    </span>
                  </div>
                </div>
              </template>
            </BaseSelect>
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
            <label class="form-label"> Estimasi Anggaran </label>
            <CurrencyInput
              v-model="forms.price"
              :has-submitted="formSubmitted"
              :disabled-input="isSubmitting"
              required
              :is-error="showAlertBudget"
              :error-message="
                showAlertBudget
                  ? 'Total harga melebihi anggaran'
                  : 'Silahkan isi harga produk'
              "
            />
          </div>
          <div class="col-12">
            <label class="form-label"> Jumlah Produk </label>
            <BaseInput
              type="number"
              :has-submitted="formSubmitted"
              :value="forms.quantity"
              :disabled-input="isSubmitting || !forms.price"
              :is-error="showAlertBudget"
              required
              :error-message="
                showAlertBudget
                  ? 'Total harga melebihi anggaran'
                  : 'Silahkan isi jumlah produk'
              "
              @change="(val: string) => forms.quantity = val"
            />
          </div>

          <div v-if="forms.chart_of_account_code" class="col-6">
            <label class="form-label"> Sisa Anggaran </label>
            <CurrencyInput v-model="remainingBudget" :disabled-input="true" />
          </div>

          <div v-if="forms.quantity" class="col-6">
            <label class="form-label"> Total Harga </label>
            <CurrencyInput v-model="totalPrice" :disabled-input="true" />
          </div>

          <div class="col-12">
            <label class="form-label"> Catatan </label>
            <BaseInput
              type="text"
              :has-submitted="formSubmitted"
              :value="forms.remarks"
              :disabled-input="isSubmitting"
              :is-error="showAlertBudget"
              :error-message="
                showAlertBudget
                  ? 'Total harga melebihi anggaran'
                  : 'Silahkan isi catatan'
              "
              @change="(val: string) => (forms.remarks = val)"
            />
          </div>

          <div class="col-12">
            <label class="form-label"> Deskripsi </label>
            <BaseInput
              as="textarea"
              :has-submitted="formSubmitted"
              :value="forms.description"
              :is-error="showAlertBudget"
              :disabled-input="isSubmitting"
              :error-message="
                showAlertBudget
                  ? 'Total harga melebihi anggaran'
                  : 'Silahkan isi deskripsi'
              "
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
  onMounted,
  ref,
  reactive,
  nextTick,
} from "vue";
import { validate, headerForms, formSubmitted, forms } from "./form";
import { useRoute, useRouter } from "vue-router";
import { showErrorToast, showSuccessToast } from "@/composables/toast";
import { viewMode } from "@/composables/viewMode";
import useAxios from "@/composables/axios";
import { currentProjectId, convertCurrency } from "@/composables/helpers";
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
const productList = ref<any>([]);
const approvalList = ref<any>([]);
const remainingBudget = ref<number>(0);

const tableColumns = {
  chart_of_account_name: { label: "COA" },
  product_name: { label: "Barang" },
  price: { label: "Harga Barang", align: "end" },
  quantity: { label: "Jumlah Barang", align: "end" },
  total: { label: "Total", align: "end" },
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
  canCreate: true,
  canEdit: true,
  canDelete: true,
  hasAction: true,
});
const querySearch = ref("");
const configModal = reactive({
  isOpen: false,
  title: "Tambah Pembelian",
  isLoading: false,
  isAdd: true,
});

const onSearch = (query: string) => {
  querySearch.value = query;
  fetchProductList();
};
const onAdd = () => {
  configModal.isOpen = true;
  configModal.title = "Tambah Pembelian";
  configModal.isAdd = true;
  resetState();
};

const onEdit = async (id: string | number) => {
  formSubmitted.value = false;
  detailId.value = id;
  const { data, success, message } = await get(
    `/PurchaseRequestDetail/show/${id}`
  );
  if (success) {
    forms.value = {
      ...forms.value,
      chart_of_account_code: data?.chart_of_account_code,
      product_id: data?.product_id,
      price: Number(data?.price),
      quantity: Number(data.quantity).toString(),
      remarks: data?.remarks,
      description: data?.description,
    };

    configModal.isOpen = true;
    configModal.title = "Ubah Pembelian";
    configModal.isAdd = false;
    nextTick(
      () =>
        (remainingBudget.value =
          Number(remainingBudget.value) + Number(totalPrice.value))
    );
  } else showErrorToast(message ?? "Gagal load data");
};
const onDelete = async (id: string | number) => {
  return await remove(`/PurchaseRequestDetail/delete/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchDetail();
  fetchProductList();
};
const fetchProductList = async () => {
  tableConfig.loading = true;
  try {
    const { data } = await get("/PurchaseRequestDetail", {
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
    purchase_request_id: id.value,
    project_id: currentProjectId.value,
  };
});

const onBack = () => {
  router.push({ name: "DaftarPermintaanPembelian" });
};

const onCreate = async (payload: any) => {
  return await post("/PurchaseRequestDetail/store", { ...payload });
};

const onUpdate = async (payload: any, id: any) => {
  return await put(`/PurchaseRequestDetail/update/${id}`, { ...payload });
};

const onSubmit = async () => {
  isSubmitting.value = true;
  const check = validate();
  if (check) {
    const payload = {
      ...forms.value,
      purchase_request_id: id.value,
      price: forms.value.price?.toString() ?? "",
      project_id: currentProjectId.value,
    };
    const { message, success } = configModal.isAdd
      ? await onCreate(payload)
      : await onUpdate(payload, detailId.value);

    if (success) {
      showSuccessToast(message ?? `Data berhasil disimpan`);
      configModal.isLoading = false;
      configModal.isOpen = false;

      fetchDetail();
      fetchProductList();
      fetchCoa();
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
    description: "",
    price: 0,
    product_id: "",
    quantity: "",
    remarks: "",
  };
  formSubmitted.value = false;
};

const fetchDetail = async () => {
  loading.value = true;
  const { data, success, message } = await get(
    `/PurchaseRequest/show/${id.value}`
  );
  if (success) {
    headerForms.value = {
      ...data,
      nomor: data?.number,
      total: Number(data?.total ?? 0),
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

const fetchProduct = async () => {
  const { data, success } = await get(`/product/search`);
  if (success) productList.value = data;
};

const fetchCoa = async () => {
  const { data, success } = await get(`/coa/searchCoa`, {
    params: {
      project_id: currentProjectId.value,
      module: "purchase_requests",
    },
  });
  if (success)
    coaList.value = data?.map((item: any) => {
      item.id = item?.code;
      return item;
    });
};

const handleChangeCoa = (val: any) => {
  forms.value.chart_of_account_code = val?.id ?? "";
  remainingBudget.value = Number(val?.remaining_budget) ?? 0;
};

const totalPrice = computed(() => {
  return Number(forms.value.price) * Number(forms.value.quantity) || 0;
});

const showAlertBudget = computed(() => {
  return totalPrice.value > Number(remainingBudget.value);
});

const updateStatusPurchase = async () => {
  Swal.fire({
    icon: "warning",
    title: "Apakah anda yakin?",
    text: `Anda akan ${
      headerForms.value.status === "draft" ? "menerbitkan" : "menarik kembali"
    } permintaan pembelian ini`,
    showCancelButton: true,
    confirmButtonText: "Ok",
    confirmButtonColor: "var(--theme-default)",
    cancelButtonText: "Kembali",
    cancelButtonColor: "#efefef",
  }).then(async (result) => {
    if (result.value) {
      isSubmitting.value = true;
      const { success, message } = await put(
        `/PurchaseRequest/updateStatus/${id.value}`,
        { status: headerForms.value.status === "draft" ? "pending" : "draft" }
      );
      if (success) {
        showSuccessToast(message ?? `Data berhasil disimpan`);
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

  fetchProductList();
  fetchProduct();
  fetchCoa();
  await fetchProject();
  fetchDetail();
});
</script>

<style lang="css" scoped>
.custom-budget {
  font-size: 12px;
  font-weight: 400;
}
</style>
