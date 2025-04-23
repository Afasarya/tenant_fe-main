<template>
  <div class="card container-fluid p-4">
    <Loader v-if="loading" />
    <div v-else>
      <div class="row mb-3">
        <div class="col-12 d-flex justify-content-between align-items-center">
          <h4>Detail Template Payroll: {{ templateName }}</h4>
          <button class="btn btn-secondary" @click="goBack">
            Kembali
          </button>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card p-3">
            <h5 class="mb-3">Informasi Template</h5>
            <table class="table table-borderless">
              <tbody>
                <tr>
                  <td width="30%"><strong>Nama Template</strong></td>
                  <td>{{ templateData.name || '-' }}</td>
                </tr>
                <tr>
                  <td><strong>Deskripsi</strong></td>
                  <td>{{ templateData.description || '-' }}</td>
                </tr>
                <tr>
                  <td><strong>Tanggal Efektif</strong></td>
                  <td>{{ formatDate(templateData.effective_date) }}</td>
                </tr>
                <tr>
                  <td><strong>Status</strong></td>
                  <td>
                    <span 
                      :class="[
                        'badge', 
                        templateData.is_active ? 'bg-success' : 'bg-danger'
                      ]"
                    >
                      {{ templateData.is_active ? 'Aktif' : 'Tidak Aktif' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <h5>Komponen Template</h5>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th width="5%">No</th>
                  <th width="40%">Nama Komponen</th>
                  <th width="25%">Nilai</th>
                  <th width="30%">Tipe</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="templateComponents.length === 0">
                  <td colspan="4" class="text-center">Tidak ada data komponen</td>
                </tr>
                <tr v-for="(component, index) in templateComponents" :key="component.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ component.component_name }}</td>
                  <td>{{ formatCurrency(component.value) }}</td>
                  <td>{{ formatType(component.type) }}</td>
                </tr>
              </tbody>
              <tfoot v-if="hasFixedComponents">
                <tr>
                  <td colspan="2" class="text-end"><strong>Total Komponen Tetap:</strong></td>
                  <td colspan="2"><strong>{{ formatCurrency(totalFixedValue) }}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { showErrorToast } from "@/composables/toast";
import dayjs from "dayjs";

const Loader = defineAsyncComponent(
  () => import("@/components/common/Loader.vue")
);

const router = useRouter();
const route = useRoute();
const { get } = useAxios();

// Template data
const templateId = ref(route.params.id || "");
const loading = ref(true);
const templateData = ref<any>({});
const templateComponents = ref<any[]>([]);

// Computed properties
const templateName = computed(() => {
  return templateData.value?.name || "Template tidak ditemukan";
});

const hasFixedComponents = computed(() => {
  return templateComponents.value.some(item => item.type === "fixed");
});

const totalFixedValue = computed(() => {
  return templateComponents.value
    .filter(item => item.type === "fixed")
    .reduce((sum, item) => sum + Number(item.value), 0);
});

// Format functions
const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return dayjs(dateString).format("DD MMMM YYYY");
};

const formatCurrency = (value: number) => {
  if (value === undefined || value === null) return "Rp 0";
  return `Rp ${value.toLocaleString('id-ID')}`;
};

const formatType = (type: string) => {
  if (!type) return "-";
  return type === "fixed" ? "Tetap" : "Persentase";
};

// Actions
const goBack = () => {
  router.push({ name: "DaftarTemplatePayroll" });
};

// Fetch data
const fetchTemplateData = async () => {
  loading.value = true;
  try {
    const { data, success, message } = await get(`/payroll_component_template/show/${templateId.value}`);
    if (success) {
      templateData.value = data || {};
    } else {
      showErrorToast(message || "Gagal mengambil data template");
      router.push({ name: "DaftarTemplatePayroll" });
    }
  } catch (error) {
    console.error("Error fetching template data:", error);
    showErrorToast("Terjadi kesalahan saat mengambil data template");
    router.push({ name: "DaftarTemplatePayroll" });
  }
};

const fetchTemplateComponents = async () => {
  try {
    // Update the endpoint to match the Postman collection structure
    const { data, success, message } = await get(`/payroll_component_detail/${templateId.value}`);
    if (success) {
      templateComponents.value = data?.data?.map((item: any) => {
        return {
          ...item,
          component_name: item.component?.name || '-',
          value: Number(item.value),
        };
      }) || [];
    } else {
      showErrorToast(message || "Gagal mengambil detail komponen template");
    }
  } catch (error) {
    console.error("Error fetching template components:", error);
    showErrorToast("Terjadi kesalahan saat mengambil detail komponen template");
  } finally {
    loading.value = false;
  }
};

// Initialize component
onMounted(async () => {
  if (!templateId.value) {
    showErrorToast("ID template tidak ditemukan");
    router.push({ name: "DaftarTemplatePayroll" });
    return;
  }
  
  await fetchTemplateData();
  await fetchTemplateComponents();
});
</script>