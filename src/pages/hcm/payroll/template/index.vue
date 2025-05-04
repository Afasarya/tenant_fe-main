<template>
  <div class="card container-fluid px-4 card-custom">
    <Table
      v-bind="tableConfig"
      :deleteFn="onDelete"
      @search="onSearch"
      @add="onAdd"
      @edit="onEdit"
      @view="onView"
      @update-pagination="onChangePagination"
      @fetch="fetchPayrollTemplateList()"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, reactive, computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { showErrorToast } from "@/composables/toast";
import dayjs from "dayjs";

const Table = defineAsyncComponent(
  () => import("@/components/common/Table.vue")
);

const router = useRouter();
const { get, remove } = useAxios();

const tableColumns = {
  name: { label: "Nama Template" },
  description: { label: "Deskripsi" },
  components: { label: "Komponen" },
  status: { label: "Status" },
};

const tableConfig = reactive({
  buttonName: "Tambah Template Payroll",
  items: [],
  columns: tableColumns,
  pagination: {
    page: 1,
    pageSize: 10,
    totalData: 1,
    totalPage: 1,
  },
  loading: false,
});

const querySearch = ref("");

const onSearch = (query: string) => {
  querySearch.value = query;
  fetchPayrollTemplateList();
};

const onAdd = () => {
  router.push({ name: "BuatTemplatePayroll" });
};

const onEdit = (id: string | number) => {
  router.push(`/hcm/payroll/edit_template/${id}`);
};

const onView = (id: string | number) => {
  router.push(`/hcm/payroll/detail_template/${id}`);
};

const onDelete = async (id: string | number) => {
  return await remove(`/payroll_component_template/delete/${id}`);
};

const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;
  fetchPayrollTemplateList();
};

const fetchTemplateComponents = async (templateId: number) => {
  try {
    const { data, success } = await get(`/payroll_component_detail/${templateId}`);
    if (success && data?.data) {
      return data.data.map((item: any) => item.component?.name || '').filter(Boolean);
    }
    return [];
  } catch (error) {
    console.error(`Error fetching components for template ${templateId}:`, error);
    return [];
  }
}

const fetchPayrollTemplateList = async () => {
  tableConfig.loading = true;

  try {
    const { data, message, success } = await get("/payroll_component_template", {
      params: payload.value,
    });

    if (success) {
      const templates = data?.data || [];
      const templatesWithComponents = await Promise.all(templates.map(async (item: any) => {
        // Fetch components for each template
        const componentList = await fetchTemplateComponents(item.id);
        
        return {
          id: item.id,
          name: item.name || "",
          description: item.description || "-",
          components: componentList.length ? 
            `<div class="d-flex flex-wrap gap-1">${componentList.map(name => 
              `<span class="badge rounded-pill bg-primary me-1 mb-1">${name}</span>`).join('')}</div>` : 
            "-",
          effective_date: item.effective_date
            ? dayjs(item.effective_date).format("DD MMM YYYY")
            : "-",
          status: item.is_active === 1 ? "Aktif" : "Tidak Aktif"
        };
      }));

      tableConfig.items = templatesWithComponents;
      tableConfig.pagination.totalData = data?.total ?? 1;
      tableConfig.pagination.totalPage = data?.last_page ?? 1;
    } else {
      showErrorToast(message ?? "Gagal mengambil data template payroll");
    }
  } catch (error) {
    console.error("Error fetching payroll template data:", error);
    showErrorToast("Terjadi kesalahan saat mengambil data template payroll");
  } finally {
    tableConfig.loading = false;
  }
};

const payload = computed(() => {
  return {
    search: querySearch.value,
    page: tableConfig.pagination?.page,
    per_page: tableConfig.pagination?.pageSize,
  };
});

onMounted(() => fetchPayrollTemplateList());
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}
</style>