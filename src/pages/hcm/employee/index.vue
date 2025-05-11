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
      @fetch="fetchEmployeeList()"
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
  name: { label: "Nama Pegawai" },
  position_name: { label: "Jabatan" },
  department_name: { label: "Departemen" },
  hire_date: { label: "Tanggal Bergabung" },
  status: { label: "Status" },
};
const tableConfig = reactive({
  buttonName: "Tambah Pegawai",
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
const loading = ref(false);

const onSearch = (query: string) => {
  querySearch.value = query;
  fetchEmployeeList();
};
const onAdd = () => {
  router.push({ name: "BuatPegawai" });
};
// Improved edit function with better error handling
const onEdit = (id: string | number) => {
  if (!id) {
    showErrorToast('ID karyawan tidak valid');
    return;
  }
  
  const cleanId = String(id).trim();
  console.log('Navigating to edit employee with ID:', cleanId);
  
  // Use router.push with object syntax for more reliable navigation
  router.push({
    name: "EditPegawai",
    params: { id: cleanId }
  });
};
// Improved view function with better error handling
const onView = (id: string | number) => {
  console.log('Viewing employee with ID:', id, 'Type:', typeof id);
  
  if (!id) {
    showErrorToast('ID karyawan tidak valid');
    return;
  }
  
  // Force clean string conversion
  const cleanId = String(id).trim();
  console.log('Clean ID for routing:', cleanId);
  
  // Navigate using route path instead of name for more reliability
  router.push(`/hcm/detail_pegawai/${cleanId}`);
};
const onDelete = async (id: string | number) => {
  return await remove(`/employee/delete/${id}`);
};
const onChangePagination = (page: number, perPage: number) => {
  tableConfig.pagination.page = page;
  tableConfig.pagination.pageSize = perPage;

  fetchEmployeeList();
};

// Function to fetch all employees with pagination and search
const fetchEmployeeList = async () => {
  tableConfig.loading = true;
  
  try {
    const { data, message, success } = await get("/employee", {
      params: payload.value,
    });

    if (success) {
      tableConfig.items = data?.data?.map((item: any) => {
        return {
          id: item.id,
          name: item.name || "",
          position_name: item.position_name || "",
          department_name: item.department_name || "",
          hire_date: item.hire_date ? dayjs(item.hire_date).format("DD MMM YYYY") : "-",
          status: item.status === 1 ? "Aktif" : "Tidak Aktif",
          salary: item.salary || 0,
          work_location_name: item.work_location_name || "-",
          workinghour_name: item.workinghour_name || "-"
        };
      }) || [];
      
      tableConfig.pagination.totalData = data?.total || 0;
      tableConfig.pagination.totalPage = data?.last_page || 1;
    } else {
      showErrorToast(message || "Gagal mengambil data pegawai");
    }
  } catch (error) {
    console.error("Error fetching employee data:", error);
    showErrorToast("Terjadi kesalahan saat mengambil data pegawai");
  } finally {
    tableConfig.loading = false;
  }
};

// Improved fetch employee detail function
const fetchEmployeeDetail = async (id: string | number) => {
  try {
    loading.value = true;
    console.log(`Fetching employee details for ID: ${id}`);
    
    // Use the correct API endpoint
    const response = await get(`/employee/${id}`);
    console.log('API Response:', response);
    
    const { data, success, message } = response;
    
    if (success && data) {
      return data;
    } else {
      showErrorToast(message || "Gagal mengambil detail pegawai");
      return null;
    }
  } catch (error) {
    console.error("Error fetching employee detail:", error);
    showErrorToast("Terjadi kesalahan saat mengambil detail pegawai");
    return null;
  } finally {
    loading.value = false;
  }
};

// Function to search employees (for dropdown selection)
const searchEmployees = async (searchQuery = "") => {
  try {
    const { data, success } = await get("/employee/search", {
      params: { search: searchQuery }
    });
    
    if (success) {
      return data || [];
    }
    return [];
  } catch (error) {
    console.error("Error searching employees:", error);
    return [];
  }
};

const payload = computed(() => {
  return {
    search: querySearch.value,
    page: tableConfig.pagination?.page,
    per_page: tableConfig.pagination?.pageSize,
  };
});

onMounted(() => fetchEmployeeList());
</script>

<style lang="css" scoped>
.card-custom {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem 0;
}
</style>
