<template>
  <div class="card container-fluid px-4 py-3">
    <h4 class="mb-4">{{ isEdit ? 'Edit Pegawai' : isView ? 'Detail Pegawai' : 'Tambah Pegawai' }}</h4>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else>
      <!-- Profile Header Section -->
      <div class="profile-header mb-4">
        <div class="row g-4 align-items-center">
          <div class="col-md-3 text-center">
            <div class="profile-photo-container">
              <img 
                :src="profilePhotoUrl || '/assets/default-avatar.png'" 
                alt="Profile Photo" 
                class="profile-photo"
                @error="handleImageError"
              >
              <div v-if="!isView" class="profile-photo-overlay">
                <label for="profile-photo-input" class="btn btn-sm btn-light upload-btn">
                  <i class="fa fa-camera"></i> Ubah Foto
                </label>
                <input 
                  id="profile-photo-input"
                  type="file" 
                  class="d-none" 
                  @change="handleFileChange" 
                  accept="image/*" 
                >
              </div>
            </div>
          </div>
          <div class="col-md-9">
            <div class="profile-info">
              <div class="input-group mb-3">
                <span class="input-group-text bg-light">Nama</span>
                <input 
                  type="text" 
                  class="form-control form-control-lg" 
                  v-model="forms.name" 
                  :disabled="isView"
                  placeholder="Nama Pegawai" 
                >
              </div>
              
              <div class="row g-2">
                <div class="col">
                  <div class="input-group">
                    <span class="input-group-text bg-light"><i class="fa fa-briefcase"></i></span>
                    <select class="form-select" v-model.number="forms.position_id" :disabled="isView">
                      <option value="">Pilih Jabatan</option>
                      <option v-for="position in filteredPositions" :key="position.id" :value="position.id">
                        {{ position.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col">
                  <div class="input-group">
                    <span class="input-group-text bg-light"><i class="fa fa-building"></i></span>
                    <select class="form-select" v-model.number="forms.department_id" :disabled="isView">
                      <option value="">Pilih Departemen</option>
                      <option v-for="dept in filteredDepartments" :key="dept.id" :value="dept.id">
                        {{ dept.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="profile-badges mt-3">
                <span class="badge rounded-pill bg-primary me-2">
                  <i class="fa fa-envelope me-1"></i> {{ forms.email || 'Email tidak tersedia' }}
                </span>
                <span class="badge rounded-pill bg-secondary me-2">
                  <i class="fa fa-phone me-1"></i> {{ forms.phone_number || 'No. Telepon tidak tersedia' }}
                </span>
                <span class="badge rounded-pill" :class="forms.status ? 'bg-success' : 'bg-danger'">
                  <i class="fa" :class="forms.status ? 'fa-check-circle' : 'fa-times-circle'"></i>
                  {{ forms.status ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                :disabled="isView || !id"
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
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <span v-if="submitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
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

// Use simple id ref like in payroll component instead of computed property
const id = ref(route?.params?.id ?? "");

// Mode management using refs instead of computed properties
const isEdit = ref(false);
const isView = ref(false);
const canEdit = computed(() => isView.value && id.value); // Can edit only if in view mode and has ID
const activeTab = ref('basic');
const loading = ref(false);
const submitting = ref(false);
const fetchError = ref('');
const fileToUpload = ref<File | null>(null);
const profilePhotoUrl = ref<string | null>(null);

// Image error handler function
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = '/assets/default-avatar.png';
};

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

const fetchDetail = async () => {
  loading.value = true;
  try {
    console.log('Fetching employee with ID:', id.value);
    
    const timestamp = Date.now();
    const response = await get(`/employee/${id.value}?_t=${timestamp}`);
    
    console.log('API Response for employee ID', id.value, ':', response);
    
    const { data, success, message } = response;
    
    if (success && data) {
      console.log('Employee data received:', data);
      
      // Clear form before populating
      resetForm();
      
      // IMPROVED: Handle email from multiple possible locations in the response
      if (data.email) {
        // Case 1: Direct email field
        forms.value.email = data.email;
        console.log('Set email from data.email field to:', forms.value.email);
      } 
      else if (data.user_email) {
        // Case 2: user_email field (common in API responses)
        forms.value.email = data.user_email;
        console.log('Set email from data.user_email field to:', forms.value.email);
      }
      else if (data.user && data.user.email) {
        // Case 3: Nested user object with email
        forms.value.email = data.user.email;
        console.log('Set email from user.email nested field to:', forms.value.email);
      }
      else {
        console.warn('No email field found in API response');
      }
      
      // Log all fields in the API response for debugging
      console.log('API response fields:', Object.keys(data));
      
      // Handle regular form fields
      Object.keys(forms.value).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          // Skip email as we've already handled it
          if (key === 'email') return;
          
          // Handle date fields with proper formatting
          if (key === 'date_of_birth' || key === 'hire_date' || key === 'date_out') {
            const dateValue = data[key];
            if (dateValue) {
              forms.value[key] = dayjs(dateValue).format('YYYY-MM-DD');
              console.log(`Set date field ${key} to:`, forms.value[key]);
            }
          } else {
            (forms.value as any)[key] = data[key];
            console.log(`Set field ${key} to:`, (forms.value as any)[key]);
          }
        }
      });
      
      // Special handling for boolean values to ensure correct conversion
      forms.value.status = data.status === 1 || data.status === true;
      forms.value.is_admin = data.is_admin === 1 || data.is_admin === true;
      
      // Add special handling for compound fields if any
      if (data.position && data.position.name && !forms.value.position_id) {
        forms.value.position_id = data.position.id;
      }
      
      if (data.department && data.department.name && !forms.value.department_id) {
        forms.value.department_id = data.department.id;
      }
      
      // Handle profile photo if available
      if (data.photo_url) {
        profilePhotoUrl.value = data.photo_url;
      }
      
      // Load cascading dropdowns sequentially
      await loadDropdownSequentially();
      
      return true;
    } else {
      showErrorToast(message || 'Gagal mengambil data pegawai');
      return false;
    }
  } catch (error) {
    console.error('Error fetching employee details:', error);
    showErrorToast('Terjadi kesalahan saat mengambil data pegawai');
    return false;
  } finally {
    loading.value = false;
  }
};

// Add this helper function to load dropdowns in the correct sequence
const loadDropdownSequentially = async () => {
  try {
    if (forms.value.country_id) {
      await onCountryChange();
      
      if (forms.value.province_id) {
        await onProvinceChange();
        
        if (forms.value.city_id) {
          await onCityChange();
          
          if (forms.value.sub_district_id) {
            // Make sure we're properly awaiting the village loading
            await onSubDistrictChange();
            console.log('Loaded villages:', villages.value);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading location dropdowns:', error);
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

// This improved onSubDistrictChange function ensures villages are properly fetched
const onSubDistrictChange = async () => {
  if (!forms.value.sub_district_id) {
    villages.value = [];
    return;
  }
  
  try {
    console.log('Fetching villages for sub district ID:', forms.value.sub_district_id);
    
    // Using the correct parameter name from the API documentation
    const response = await get('/village/search', {
      params: { sub_districts_id: forms.value.sub_district_id }
    });
    
    console.log('Village search API response:', response);
    
    const { data, success } = response;
    
    if (success && Array.isArray(data)) {
      villages.value = data.filter(item => item && item.id != null);
      console.log(`Successfully loaded ${villages.value.length} villages for sub district ${forms.value.sub_district_id}`);
    } else {
      console.warn('Village API did not return an array, or request failed');
      villages.value = [];
    }
  } catch (error) {
    console.error('Error fetching villages:', error);
    showErrorToast('Terjadi kesalahan saat mengambil data kelurahan/desa');
    villages.value = [];
  }
};

watch(
  () => forms.value.sub_district_id,
  (newSubDistrictId, oldSubDistrictId) => {
    if (newSubDistrictId && newSubDistrictId !== oldSubDistrictId) {
      console.log(`Sub district changed from ${oldSubDistrictId} to ${newSubDistrictId}, fetching villages...`);
      onSubDistrictChange();
    } else if (!newSubDistrictId) {
      console.log('Sub district cleared, resetting villages');
      villages.value = [];
    }
  }
);


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
    
    console.log('File selected for upload:', fileToUpload.value.name, 'Size:', fileToUpload.value.size);
  }
};

// Improved file upload function
const uploadProfilePhoto = async (id: string | number) => {
  if (!fileToUpload.value) {
    console.log('No file to upload');
    return true;
  }
  
  try {
    console.log('Uploading profile photo for employee ID:', id);
    
    const formData = new FormData();
    formData.append('photo', fileToUpload.value);
    
    // Using the correct endpoint structure from FICO.postman_collection.json
    const response = await post(`/employee/upload_foto/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',

      }
    });
    
    console.log('Photo upload response:', response);
    
    const { success, message } = response;
    
    if (!success) {
      showErrorToast(message || 'Gagal mengunggah foto profil');
      return false;
    }
    
    showSuccessToast('Foto profil berhasil diunggah');
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
  
  // Prepare payload from form data
  const payload = {
    ...forms.value,
    status: forms.value.status ? 1 : 0,
    is_admin: forms.value.is_admin ? 1 : 0
  };
  
  let response;
  
  if (isEdit.value && id.value) {
    response = await put(`/employee/update/${id.value}`, payload);
  } else {
    response = await post('/employee/create', payload);
  }
    
    const { success, message, data } = response;
    
    if (success) {
      // Handle file upload if needed - use the ID from the response for new employees
      if (fileToUpload.value) {
        const idForUpload = isEdit.value ? id.value : data?.id;
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
    // Error handling...
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
  if (id.value) {
    router.push({ name: 'EditPegawai', params: { id: id.value } });
  }
};

// FIX 3: Modify onEdit function in index.vue to use direct browser navigation
// This bypasses any potential routing issues
const onEdit = (id: string | number) => {
  if (!id) {
    showErrorToast('ID karyawan tidak valid');
    return;
  }
  
  // Clean ID and force navigation through browser for a fresh page load
  const cleanId = String(id).trim();
  console.log('Navigating to edit employee with ID:', cleanId);
  
  // Use direct window location change to ensure a clean page load
  window.location.href = `/hcm/edit_pegawai/${cleanId}`;
};

// Enhanced watch functionality to reload data when route changes
watch(
  [() => route.params.id, () => route.name],
  async ([newId, newRouteName], [oldId, oldRouteName]) => {
    console.log(`[ROUTE CHANGED] ID: ${oldId} → ${newId}, Route: ${String(oldRouteName)} → ${String(newRouteName)}`);
    
    if (newId && (isEdit.value || isView.value)) {
      console.log(`[LOADING DATA] Will fetch employee ${newId} data due to route change`);
      resetForm(); // Clear form first to avoid data mixing
      await fetchDetail();
    } else if (!isEdit.value && !isView.value) {
      console.log('[RESET FORM] Resetting form for new employee creation');
      resetForm();
    }
  },
  { immediate: true, deep: true }
);

// Simplify onMounted hook like in payroll component
onMounted(async () => {
  resetForm();
  const currentRoute = router.currentRoute.value.fullPath;
  
  // Initialize mode based on route
  if (currentRoute.includes('edit_pegawai') || route.name === 'EditPegawai') {
    isEdit.value = true;
    isView.value = false;
  } else if (currentRoute.includes('detail_pegawai') || route.name === 'DetailPegawai') {
    isView.value = true;
    isEdit.value = false;
  } else {
    isEdit.value = false;
    isView.value = false;
  }
  
  loading.value = true;
  
  try {
    // Load all reference data
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
    
    // If edit or view mode, fetch employee data
    if ((isEdit.value || isView.value) && id.value) {
      console.log('Loading employee data for ID:', id.value);
      await fetchDetail();
    }
  } catch (error) {
    console.error('Error initializing form:', error);
    showErrorToast('Terjadi kesalahan saat memuat data');
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

/* New profile styling */
.profile-header {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.profile-photo-container {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 5px solid white;
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-photo-container:hover .profile-photo-overlay {
  opacity: 1;
}

.upload-btn {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 30px;
  padding: 5px 15px;
  font-size: 0.8rem;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.profile-info {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.profile-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.profile-badges .badge {
  font-weight: normal;
  font-size: 0.85rem;
  padding: 7px 12px;
}
</style>
