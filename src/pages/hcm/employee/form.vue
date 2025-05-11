<template>
  <div class="card container-fluid px-4 py-3">
    <h4 class="mb-4">{{ isEdit ? 'Edit Pegawai' : isView ? 'Detail Pegawai' : 'Tambah Pegawai' }}</h4>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
      <!-- Tabs -->
      <ul class="nav nav-tabs mb-3">
        <li v-for="tab in activeTabOptions" :key="tab.id" class="nav-item">
          <a class="nav-link" :class="{ 'active': activeTab === tab.id }" @click="activeTab = tab.id">
            <i :class="tab.icon"></i> {{ tab.name }}
          </a>
        </li>
      </ul>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Basic Info Tab -->
        <div v-if="activeTab === 'basic'" class="tab-content">
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Nama Pegawai*</label>
              <input type="text" class="form-control" v-model="forms.name" :disabled="isView" :readonly="isView">
              <div v-if="formSubmitted && !forms.name" class="text-danger">Nama pegawai harus diisi</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" v-model="forms.email" :disabled="isView" :readonly="isView">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Nomor Pegawai</label>
              <input type="text" class="form-control" v-model="forms.employee_number" :disabled="isView" :readonly="isView">
            </div>
            <div class="col-md-6">
              <label class="form-label">NIK</label>
              <input type="text" class="form-control" v-model="forms.identity_number" :disabled="isView" :readonly="isView">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Jabatan*</label>
              <select class="form-select" v-model.number="forms.position_id" :disabled="isView">
                <option value="">Pilih Jabatan</option>
                <option v-for="position in filteredPositions" :key="position.id" :value="position.id">
                  {{ position.name }}
                </option>
              </select>
              <div v-if="formSubmitted && !forms.position_id" class="text-danger">Jabatan harus dipilih</div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Departemen*</label>
              <select class="form-select" v-model.number="forms.department_id" :disabled="isView">
                <option value="">Pilih Departemen</option>
                <option v-for="dept in filteredDepartments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
              <div v-if="formSubmitted && !forms.department_id" class="text-danger">Departemen harus dipilih</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Foto Profil</label>
              <input 
                type="file" 
                class="form-control" 
                @change="handleFileChange" 
                accept="image/*" 
                :disabled="isView || !employeeId"
              >
              <div v-if="profilePhotoUrl" class="mt-2">
                <img :src="profilePhotoUrl" class="img-thumbnail" style="max-width: 150px">
              </div>
            </div>
          </div>
        </div>

        <!-- Personal Info Tab -->
        <div v-if="activeTab === 'personal'" class="tab-content">
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Jenis Kelamin</label>
              <select class="form-select" v-model="forms.gender" :disabled="isView">
                <option v-for="option in genderOptions" :key="String(option.id)" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Status Pernikahan</label>
              <select class="form-select" v-model="forms.marital_status" :disabled="isView">
                <option v-for="option in maritalStatusOptions" :key="String(option.id)" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Tanggal Lahir</label>
              <input type="date" class="form-control" v-model="forms.date_of_birth" :disabled="isView">
            </div>
            <div class="col-md-6">
              <label class="form-label">Tempat Lahir</label>
              <input type="text" class="form-control" v-model="forms.place_of_birth" :disabled="isView">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label">Pendidikan</label>
              <select class="form-select" v-model.number="forms.education_id" :disabled="isView">
                <option value="">Pilih Pendidikan</option>
                <option v-for="edu in filteredEducations" :key="edu.id" :value="edu.id">
                  {{ edu.name }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Agama</label>
              <select class="form-select" v-model.number="forms.religion_id" :disabled="isView">
                <option value="">Pilih Agama</option>
                <option v-for="religion in filteredReligions" :key="religion.id" :value="religion.id">
                  {{ religion.name }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Golongan Darah</label>
              <select class="form-select" v-model.number="forms.blood_group_id" :disabled="isView">
                <option value="">Pilih Golongan Darah</option>
                <option v-for="bg in filteredBloodGroups" :key="bg.id" :value="bg.id">
                  {{ bg.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Nama Ibu Kandung</label>
              <input type="text" class="form-control" v-model="forms.biological_mother" :disabled="isView">
            </div>
          </div>
        </div>

        <!-- Address Tab -->
        <div v-if="activeTab === 'address'" class="tab-content">
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Alamat KTP</label>
              <textarea class="form-control" v-model="forms.address" :disabled="isView"></textarea>
            </div>
            <div class="col-md-6">
              <label class="form-label">Alamat Domisili</label>
              <textarea class="form-control" v-model="forms.domicile" :disabled="isView"></textarea>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-3">
              <label class="form-label">Negara</label>
              <select class="form-select" v-model.number="forms.country_id" @change="onCountryChange" :disabled="isView">
                <option value="">Pilih Negara</option>
                <option v-for="country in filteredCountries" :key="country.id" :value="country.id">
                  {{ country.name }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Provinsi</label>
              <select class="form-select" v-model.number="forms.province_id" @change="onProvinceChange" :disabled="isView">
                <option value="">Pilih Provinsi</option>
                <option v-for="province in filteredProvinces" :key="province.id" :value="province.id">
                  {{ province.name }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Kota/Kabupaten</label>
              <select class="form-select" v-model.number="forms.city_id" @change="onCityChange" :disabled="isView">
                <option value="">Pilih Kota/Kabupaten</option>
                <option v-for="city in filteredCities" :key="city.id" :value="city.id">
                  {{ city.name }}
                </option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Kecamatan</label>
              <select class="form-select" v-model.number="forms.sub_district_id" @change="onSubDistrictChange" :disabled="isView">
                <option value="">Pilih Kecamatan</option>
                <option v-for="subDistrict in filteredSubDistricts" :key="subDistrict.id" :value="subDistrict.id">
                  {{ subDistrict.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Kelurahan/Desa</label>
              <select class="form-select" v-model.number="forms.village_id" :disabled="isView">
                <option value="">Pilih Kelurahan/Desa</option>
                <option v-for="village in filteredVillages" :key="village.id" :value="village.id">
                  {{ village.name }}
                </option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label">Nomor Telepon</label>
              <input type="text" class="form-control" v-model="forms.phone_number" :disabled="isView">
            </div>
          </div>
        </div>

        <!-- Employment Tab -->
        <div v-if="activeTab === 'employment'" class="tab-content">
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label">Jam Kerja*</label>
              <select class="form-select" v-model.number="forms.workinghour_id" :disabled="isView">
                <option value="">Pilih Jam Kerja</option>
                <option v-for="wh in filteredWorkingHours" :key="wh.id" :value="wh.id">
                  {{ wh.name }}
                </option>
              </select>
              <div v-if="formSubmitted && !forms.workinghour_id" class="text-danger">Jam kerja harus dipilih</div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Lokasi Kerja*</label>
              <select class="form-select" v-model.number="forms.work_location_id" :disabled="isView">
                <option value="">Pilih Lokasi Kerja</option>
                <option v-for="wl in filteredWorkLocations" :key="wl.id" :value="wl.id">
                  {{ wl.name }}
                </option>
              </select>
              <div v-if="formSubmitted && !forms.work_location_id" class="text-danger">Lokasi kerja harus dipilih</div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Status TER*</label>
              <select class="form-select" v-model.number="forms.ter_statuses_id" :disabled="isView">
                <option value="">Pilih Status TER</option>
                <option v-for="ter in filteredTerStatuses" :key="ter.id" :value="ter.id">
                  {{ ter.name }}
                </option>
              </select>
              <div v-if="formSubmitted && !forms.ter_statuses_id" class="text-danger">Status TER harus dipilih</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label">Gaji Pokok*</label>
              <input type="number" class="form-control" v-model.number="forms.salary" :disabled="isView">
              <div v-if="formSubmitted && !forms.salary" class="text-danger">Gaji pokok harus diisi</div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Status Gaji</label>
              <select class="form-select" v-model="forms.salary_status" :disabled="isView">
                <option v-for="option in salaryStatusOptions" :key="String(option.id)" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Tunjangan Jabatan</label>
              <input type="number" class="form-control" v-model.number="forms.position_allowance" :disabled="isView">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label">Tunjangan Lokasi Kerja</label>
              <input type="number" class="form-control" v-model.number="forms.work_location_allowance" :disabled="isView">
            </div>
            <div class="col-md-4">
              <label class="form-label">Tanggal Mulai Kerja*</label>
              <input type="date" class="form-control" v-model="forms.hire_date" :disabled="isView">
              <div v-if="formSubmitted && !forms.hire_date" class="text-danger">Tanggal mulai kerja harus diisi</div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Tanggal Keluar</label>
              <input type="date" class="form-control" v-model="forms.date_out" :disabled="isView">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label">Status</label>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="forms.status" :disabled="isView">
                <label class="form-check-label">{{forms.status ? 'Aktif' : 'Tidak Aktif'}}</label>
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Admin</label>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" v-model="forms.is_admin" :disabled="isView">
                <label class="form-check-label">{{forms.is_admin ? 'Ya' : 'Tidak'}}</label>
              </div>
            </div>
            <div class="col-md-4">
              <label class="form-label">Sertifikasi</label>
              <input type="text" class="form-control" v-model="forms.certification" :disabled="isView">
            </div>
          </div>
        </div>

        <!-- Banking Tab -->
        <div v-if="activeTab === 'banking'" class="tab-content">
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label">NPWP</label>
              <input type="text" class="form-control" v-model="forms.npwp" :disabled="isView">
            </div>
            <div class="col-md-4">
              <label class="form-label">BPJS Kesehatan</label>
              <input type="text" class="form-control" v-model="forms.bpjs_kesehatan" :disabled="isView">
            </div>
            <div class="col-md-4">
              <label class="form-label">BPJS Ketenagakerjaan</label>
              <input type="text" class="form-control" v-model="forms.bpjs_tk" :disabled="isView">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <label class="form-label">BPJS Pensiun</label>
              <input type="text" class="form-control" v-model="forms.bpjs_pensiun" :disabled="isView">
            </div>
            <div class="col-md-4">
              <label class="form-label">Bank</label>
              <input type="text" class="form-control" v-model="forms.bank" :disabled="isView">
            </div>
            <div class="col-md-4">
              <label class="form-label">Cabang Bank</label>
              <input type="text" class="form-control" v-model="forms.bank_branch" :disabled="isView">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label">Nama Akun Bank</label>
              <input type="text" class="form-control" v-model="forms.bank_account_name" :disabled="isView">
            </div>
            <div class="col-md-6">
              <label class="form-label">Nomor Rekening Bank</label>
              <input type="text" class="form-control" v-model="forms.bank_account_number" :disabled="isView">
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div v-if="!isView" class="d-flex justify-content-end mt-3">
          <button type="button" class="btn btn-secondary me-2" @click="goBack">Batal</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            {{ isEdit ? 'Perbarui' : 'Simpan' }}
          </button>
        </div>
        <div v-else class="d-flex justify-content-end mt-3">
          <button type="button" class="btn btn-secondary me-2" @click="goBack">Kembali</button>
          <button type="button" class="btn btn-primary" @click="goToEdit" v-if="canEdit">Edit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import useAxios from "@/composables/axios";
import { showSuccessToast, showErrorToast } from "@/composables/toast";
import { forms, formSubmitted, validate } from "./form";
import { genderOptions, maritalStatusOptions, salaryStatusOptions, activeTabOptions } from "./data";
import dayjs from "dayjs";

const route = useRoute();
const router = useRouter();
const { get, post, put } = useAxios();

// Fix employee ID extraction from route params
const employeeId = computed(() => {
  if (!route.params.id) return '';
  
  // Ensure we're getting a clean ID value
  const id = String(route.params.id).trim();
  console.log('Employee ID from route:', id);
  return id;
});

// Improved mode management
const isEdit = computed(() => route.name === 'EditPegawai');
const isView = computed(() => route.name === 'DetailPegawai');
const canEdit = computed(() => isView.value && employeeId.value); // Can edit only if in view mode and has ID
const activeTab = ref('basic');
const loading = ref(false);
const submitting = ref(false);
const fetchError = ref('');
const fileToUpload = ref<File | null>(null);
const profilePhotoUrl = ref<string | null>(null);

// Reference data
const positions = ref<any[]>([]);
const departments = ref<any[]>([]);
const workingHours = ref<any[]>([]);
const workLocations = ref<any[]>([]);
const terStatuses = ref<any[]>([]);
const educations = ref<any[]>([]);
const religions = ref<any[]>([]);
const bloodGroups = ref<any[]>([]);
const countries = ref<any[]>([]);
const provinces = ref<any[]>([]);
const cities = ref<any[]>([]);
const subDistricts = ref<any[]>([]);
const villages = ref<any[]>([]);

// Filtered reference data with array type checking
const filteredPositions = computed(() => Array.isArray(positions.value) ? positions.value.filter(item => item && item.id != null) : []);
const filteredDepartments = computed(() => Array.isArray(departments.value) ? departments.value.filter(item => item && item.id != null) : []);
const filteredWorkingHours = computed(() => Array.isArray(workingHours.value) ? workingHours.value.filter(item => item && item.id != null) : []);
const filteredWorkLocations = computed(() => Array.isArray(workLocations.value) ? workLocations.value.filter(item => item && item.id != null) : []);
const filteredTerStatuses = computed(() => Array.isArray(terStatuses.value) ? terStatuses.value.filter(item => item && item.id != null) : []);
const filteredEducations = computed(() => Array.isArray(educations.value) ? educations.value.filter(item => item && item.id != null) : []);
const filteredReligions = computed(() => Array.isArray(religions.value) ? religions.value.filter(item => item && item.id != null) : []);
const filteredBloodGroups = computed(() => Array.isArray(bloodGroups.value) ? bloodGroups.value.filter(item => item && item.id != null) : []);
const filteredCountries = computed(() => Array.isArray(countries.value) ? countries.value.filter(item => item && item.id != null) : []);
const filteredProvinces = computed(() => Array.isArray(provinces.value) ? provinces.value.filter(item => item && item.id != null) : []);
const filteredCities = computed(() => Array.isArray(cities.value) ? cities.value.filter(item => item && item.id != null) : []);
const filteredSubDistricts = computed(() => Array.isArray(subDistricts.value) ? subDistricts.value.filter(item => item && item.id != null) : []);
const filteredVillages = computed(() => Array.isArray(villages.value) ? villages.value.filter(item => item && item.id != null) : []);

// Improved fetch employee detail function with better error handling
const fetchDetail = async () => {
  if (!employeeId.value) {
    console.error('No employee ID provided');
    return false;
  }
  
  try {
    loading.value = true;
    fetchError.value = '';
    
    // Add cache-busting parameter to prevent caching issues
    const url = `/employee/${employeeId.value}?_=${Date.now()}`;
    console.log('API URL being called:', url);
    
    const response = await get(url);
    console.log('API Response:', response);
    
    const { data, success, message } = response;
    
    if (success && data) {
      console.log('Employee data received:', data);
      
      // Reset form before populating
      resetForm();
      
      // Map API response to form fields
      Object.keys(forms.value).forEach((key) => {
        if (data && key in data && data[key] !== null && data[key] !== undefined) {
          if (key === 'date_of_birth' || key === 'hire_date' || key === 'date_out') {
            const dateValue = data[key];
            if (dateValue) {
              (forms.value as any)[key] = dayjs(dateValue).format('YYYY-MM-DD');
            }
          } else {
            (forms.value as any)[key] = data[key];
          }
        }
      });
      
      // Handle boolean values
      forms.value.status = data.status === 1 || data.status === true;
      forms.value.is_admin = data.is_admin === 1 || data.is_admin === true;
      
      if (data.photo_url) {
        profilePhotoUrl.value = data.photo_url;
      }
      
      // Load dependent data based on selected values
      await Promise.all([
        forms.value.country_id ? onCountryChange() : Promise.resolve(),
        forms.value.province_id ? onProvinceChange() : Promise.resolve(),
        forms.value.city_id ? onCityChange() : Promise.resolve(),
        forms.value.sub_district_id ? onSubDistrictChange() : Promise.resolve()
      ]);
      
      return true;
    } else {
      fetchError.value = message || 'Gagal mengambil data pegawai';
      showErrorToast(fetchError.value);
      return false;
    }
  } catch (error) {
    console.error('Error fetching employee details:', error);
    fetchError.value = 'Terjadi kesalahan saat mengambil data pegawai';
    showErrorToast(fetchError.value);
    return false;
  } finally {
    loading.value = false;
  }
};

// Reset form to initial values
const resetForm = () => {
  Object.keys(forms.value).forEach(key => {
    // Reset each property based on its type
    const typedKey = key as keyof typeof forms.value;
    if (typeof forms.value[typedKey] === 'number') {
      (forms.value as any)[typedKey] = 0;
    } else if (typeof forms.value[typedKey] === 'boolean') {
      (forms.value as any)[typedKey] = typedKey === 'status' ? true : false;
    } else {
      (forms.value as any)[typedKey] = '';
    }
  });
  
  // Set default values
  (forms.value as any).gender = "male";
  (forms.value as any).marital_status = "Belum Kawin";
  (forms.value as any).salary_status = "All In";
  (forms.value as any).hire_date = dayjs(new Date()).format("YYYY-MM-DD");
  (forms.value as any).status = true;
  
  // Reset file upload
  fileToUpload.value = null;
  profilePhotoUrl.value = null;
};

// Fetch reference data functions
const fetchPositions = async () => {
  try {
    const { data, success } = await get('/position');
    if (success && data) {
      positions.value = data.data || [];
    }
  } catch (error) {
    console.error('Error fetching positions:', error);
    positions.value = [];
  }
};

const fetchDepartments = async () => {
  try {
    const { data, success } = await get('/department');
    if (success && data) {
      departments.value = data.data || [];
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
    departments.value = [];
  }
};

const fetchWorkingHours = async () => {
  try {
    const { data, success } = await get('/workinghour');
    if (success && data) {
      // Handle different response formats
      if (Array.isArray(data)) {
        workingHours.value = data;
      } else if (data && typeof data === 'object' && data.data) {
        workingHours.value = Array.isArray(data.data) ? data.data : [];
      } else {
        workingHours.value = [];
      }
      console.log('Working Hours fetched:', workingHours.value);
    } else {
      workingHours.value = [];
    }
  } catch (error) {
    console.error('Error fetching working hours:', error);
    workingHours.value = []; 
  }
};

const fetchWorkLocations = async () => {
  try {
    const { data, success } = await get('/worklocation');
    if (success && data) {
      // Handle different response formats
      if (Array.isArray(data)) {
        workLocations.value = data;
      } else if (data && typeof data === 'object' && data.data) {
        workLocations.value = Array.isArray(data.data) ? data.data : [];
      } else {
        workLocations.value = [];
      }
      console.log('Work Locations fetched:', workLocations.value);
    } else {
      workLocations.value = [];
    }
  } catch (error) {
    console.error('Error fetching work locations:', error);
    workLocations.value = [];
  }
};

const fetchTerStatuses = async () => {
  try {
    const { data, success } = await get('/employee_reference/ter_statuses');
    if (success && data) {
      // Handle different response formats
      if (Array.isArray(data)) {
        terStatuses.value = data;
      } else if (data && typeof data === 'object' && data.data) {
        terStatuses.value = Array.isArray(data.data) ? data.data : [];
      } else {
        terStatuses.value = [];
      }
      console.log('TER Statuses fetched:', terStatuses.value);
    } else {
      terStatuses.value = [];
    }
  } catch (error) {
    console.error('Error fetching TER statuses:', error);
    terStatuses.value = [];
  }
};

const fetchEducations = async () => {
  try {
    const { data, success } = await get('/employee_reference/education');
    if (success && data) {
      // Handle different response formats
      if (Array.isArray(data)) {
        educations.value = data;
      } else if (data && typeof data === 'object' && data.data) {
        educations.value = Array.isArray(data.data) ? data.data : [];
      } else {
        educations.value = [];
      }
      console.log('Educations fetched:', educations.value);
    } else {
      educations.value = [];
    }
  } catch (error) {
    console.error('Error fetching educations:', error);
    educations.value = []; 
  }
};

const fetchReligions = async () => {
  try {
    const { data, success } = await get('/employee_reference/religion');
    if (success && data) {
      // Ensure we're setting an array by checking the data structure
      if (Array.isArray(data)) {
        religions.value = data;
      } else if (data && typeof data === 'object' && data.data) {
        religions.value = Array.isArray(data.data) ? data.data : [];
      } else {
        religions.value = [];
      }
    } else {
      religions.value = [];
    }
  } catch (error) {
    console.error('Error fetching religions:', error);
    religions.value = []; // Ensure it's an empty array on error
  }
};

const fetchBloodGroups = async () => {
  try {
    const { data, success } = await get('/employee_reference/blood_group');
    if (success && data) {
      // Handle different response formats
      if (Array.isArray(data)) {
        bloodGroups.value = data;
      } else if (data && typeof data === 'object' && data.data) {
        bloodGroups.value = Array.isArray(data.data) ? data.data : [];
      } else {
        bloodGroups.value = [];
      }
      console.log('Blood Groups fetched:', bloodGroups.value);
    } else {
      bloodGroups.value = [];
    }
  } catch (error) {
    console.error('Error fetching blood groups:', error);
    bloodGroups.value = []; 
  }
};

const fetchCountries = async () => {
  try {
    const { data, success } = await get('/country');
    if (success && data) {
      countries.value = data.data || [];
    }
  } catch (error) {
    console.error('Error fetching countries:', error);
    countries.value = []; // Ensure it's an empty array on error
  }
};

// Location hierarchical dropdowns
const onCountryChange = async () => {
  if (!forms.value.country_id) {
    provinces.value = [];
    cities.value = [];
    subDistricts.value = [];
    villages.value = [];
    return;
  }
  
  try {
    const { data, success } = await get('/province/search', {
      params: { country_id: forms.value.country_id }
    });
    
    if (success && Array.isArray(data)) {
      provinces.value = data.filter((item: any) => item && item.id != null) || [];
    } else {
      provinces.value = [];
    }
  } catch (error) {
    console.error('Error fetching provinces:', error);
    provinces.value = [];
  }
};

const onProvinceChange = async () => {
  if (!forms.value.province_id) {
    cities.value = [];
    subDistricts.value = [];
    villages.value = [];
    return;
  }
  
  try {
    const { data, success } = await get('/city/search', {
      params: { provinces_id: forms.value.province_id }
    });
    
    if (success && Array.isArray(data)) {
      cities.value = data.filter((item: any) => item && item.id != null) || [];
    } else {
      cities.value = [];
    }
  } catch (error) {
    console.error('Error fetching cities:', error);
    cities.value = [];
  }
};

const onCityChange = async () => {
  if (!forms.value.city_id) {
    subDistricts.value = [];
    villages.value = [];
    return;
  }
  
  try {
    const { data, success } = await get('/subDistrict/search', {
      params: { cities_id: forms.value.city_id }
    });
    
    if (success && Array.isArray(data)) {
      subDistricts.value = data.filter((item: any) => item && item.id != null) || [];
    } else {
      subDistricts.value = [];
    }
  } catch (error) {
    console.error('Error fetching sub-districts:', error);
    subDistricts.value = [];
  }
};

const onSubDistrictChange = async () => {
  if (!forms.value.sub_district_id) {
    villages.value = [];
    return;
  }
  
  try {
    console.log('Fetching villages for sub district ID:', forms.value.sub_district_id);
    
    // First try the village/search endpoint
    const response1 = await get('/village/search', {
      params: { sub_district_id: forms.value.sub_district_id }
    });
    
    if (response1?.success && response1?.data && Array.isArray(response1.data) && response1.data.length > 0) {
      villages.value = response1.data.filter((item: { id: number | null; name?: string }) => item && item.id != null);
      console.log('Villages fetched from /village/search:', villages.value);
      return;
    }
    
    // If first endpoint fails, try employee_reference/village
    console.log('Trying employee_reference/village endpoint');
    const response2 = await get('/employee_reference/village', {
      params: { sub_district_id: forms.value.sub_district_id }
    });
    
    if (response2?.success && response2?.data) {
      // Handle different response formats
      if (Array.isArray(response2.data)) {
        villages.value = response2.data.filter((item: { id: number | null; name?: string }) => item && item.id != null);
      } else if (response2.data && typeof response2.data === 'object' && response2.data.data) {
        villages.value = Array.isArray(response2.data.data) ? 
          response2.data.data.filter(item => item && item.id != null) : [];
      } else {
        villages.value = [];
      }
      console.log('Villages fetched from /employee_reference/village:', villages.value);
    } else {
      villages.value = [];
      console.log('No village data available from either endpoint');
    }
  } catch (error) {
    console.error('Error fetching villages:', error);
    villages.value = []; 
  }
};

// Handle file upload
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    fileToUpload.value = input.files[0];
    
    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePhotoUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(fileToUpload.value);
  }
};

// Improved file upload function
const uploadProfilePhoto = async (id: string) => {
  if (!fileToUpload.value) return true;
  
  try {
    const formData = new FormData();
    formData.append('photo', fileToUpload.value);
    
    const { success, message } = await post(`/employee/upload_foto/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (!success) {
      showErrorToast(message || 'Gagal mengunggah foto profil');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    showErrorToast('Terjadi kesalahan saat mengunggah foto profil');
    return false;
  }
};

// Improved form submission with correct endpoint
const handleSubmit = async () => {
  formSubmitted.value = true;
  
  if (!validate()) {
    showErrorToast('Harap isi semua kolom yang wajib diisi');
    return;
  }
  
  try {
    submitting.value = true;
    
    // Prepare payload with proper data type conversion
    const payload = {
      ...forms.value,
      // Ensure numeric fields are sent as numbers
      position_id: forms.value.position_id ? Number(forms.value.position_id) : null,
      department_id: forms.value.department_id ? Number(forms.value.department_id) : null,
      workinghour_id: forms.value.workinghour_id ? Number(forms.value.workinghour_id) : null,
      work_location_id: forms.value.work_location_id ? Number(forms.value.work_location_id) : null,
      ter_statuses_id: forms.value.ter_statuses_id ? Number(forms.value.ter_statuses_id) : null,
      education_id: forms.value.education_id ? Number(forms.value.education_id) : null,
      religion_id: forms.value.religion_id ? Number(forms.value.religion_id) : null,
      blood_group_id: forms.value.blood_group_id ? Number(forms.value.blood_group_id) : null,
      country_id: forms.value.country_id ? Number(forms.value.country_id) : null,
      province_id: forms.value.province_id ? Number(forms.value.province_id) : null,
      city_id: forms.value.city_id ? Number(forms.value.city_id) : null,
      sub_district_id: forms.value.sub_district_id ? Number(forms.value.sub_district_id) : null,
      village_id: forms.value.village_id ? Number(forms.value.village_id) : null,
      salary: Number(forms.value.salary || 0),
      position_allowance: Number(forms.value.position_allowance || 0),
      work_location_allowance: Number(forms.value.work_location_allowance || 0),
      status: forms.value.status ? 1 : 0,
      is_admin: forms.value.is_admin ? 1 : 0
    };
    
    console.log(`${isEdit.value ? 'Updating' : 'Creating'} employee with payload:`, payload);
    
    let response;
    
    if (isEdit.value && employeeId.value) {
      // Using the correct employee update endpoint
      console.log(`Sending PUT request to /employee/update/${employeeId.value}`);
      response = await put(`/employee/update/${employeeId.value}`, payload);
    } else {
      console.log('Sending POST request to /employee/create');
      response = await post('/employee/create', payload);
    }
    
    console.log('API Response:', response);
    const { success, message, data } = response;
    
    if (success) {
      // Handle file upload if needed
      if (fileToUpload.value) {
        const idForUpload = isEdit.value ? employeeId.value : data?.id;
        if (idForUpload) {
          await uploadProfilePhoto(idForUpload);
        }
      }
      
      showSuccessToast(`Data pegawai berhasil ${isEdit.value ? 'diperbarui' : 'ditambahkan'}`);
      goBack();
    } else {
      showErrorToast(message || `Gagal ${isEdit.value ? 'memperbarui' : 'menambahkan'} data pegawai`);
    }
  } catch (error) {
    console.error(`Error ${isEdit.value ? 'updating' : 'creating'} employee:`, error);
    showErrorToast(`Terjadi kesalahan saat ${isEdit.value ? 'memperbarui' : 'menambahkan'} data pegawai`);
  } finally {
    submitting.value = false;
  }
};

// Navigation
const goBack = () => {
  router.push({ name: 'DaftarPegawai' });
};

// Added function to navigate from view to edit mode
const goToEdit = () => {
  if (employeeId.value) {
    router.push({ name: 'EditPegawai', params: { id: employeeId.value } });
  }
};

// Improved edit navigation in index.vue
const onEdit = (id: string | number) => {
  if (!id) {
    showErrorToast('ID karyawan tidak valid');
    return;
  }
  
  const cleanId = String(id).trim();
  console.log('Navigating to edit employee with ID:', cleanId);
  
  // Use push with object format for more reliable navigation
  router.push({
    path: `/hcm/edit_pegawai/${cleanId}`
  });
};

// Enhanced watch functionality to reload data when route changes
watch(
  () => route.params.id,
  async (newId, oldId) => {
    console.log(`Route param changed from ${oldId} to ${newId}`);
    
    if (newId && (isEdit.value || isView.value)) {
      console.log('Fetching employee data due to route change');
      await fetchDetail();
    } else if (!isEdit.value && !isView.value) {
      resetForm();
    }
  },
  { immediate: true }
);

// Initialize the form with reference data and employee data if in edit/view mode
onMounted(async () => {
  loading.value = true;
  
  try {
    await Promise.all([
      fetchPositions(),
      fetchDepartments(),
      fetchWorkingHours(),
      fetchWorkLocations(),
      fetchTerStatuses(),
      fetchEducations(),
      fetchReligions(),
      fetchBloodGroups(),
      fetchCountries()
    ]);
    
    if ((isEdit.value || isView.value) && employeeId.value) {
      console.log('Component mounted, fetching employee data');
      const success = await fetchDetail();
      if (!success) {
        setTimeout(() => goBack(), 1000);
      }
    }
  } catch (error) {
    console.error('Error initializing form:', error);
    showErrorToast('Terjadi kesalahan saat memuat data');
    setTimeout(() => goBack(), 1500);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="css" scoped>
.tab-content {
  padding: 1.5rem 0;
}
.form-label {
  font-weight: 500;
}
.nav-link {
  cursor: pointer;
}
</style>
