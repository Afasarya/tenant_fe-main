import { ref } from "vue";
import dayjs from "dayjs";

interface Employee {
  // Basic Information
  name: string;
  employee_number: string;
  identity_number: string;
  email: string;
  position_id: string | number;
  department_id: string | number;

  // Personal Information
  gender: string;
  marital_status: string;
  date_of_birth: string;
  place_of_birth: string;
  education_id: string | number;
  religion_id: string | number;
  blood_group_id: string | number;
  biological_mother: string;

  // Address Information
  address: string;
  domicile: string;
  country_id: string | number;
  province_id: string | number;
  city_id: string | number;
  sub_district_id: string | number;
  village_id: string | number;

  // Employment Details
  workinghour_id: string | number;
  work_location_id: string | number;
  ter_statuses_id: string | number;
  salary: number;
  salary_status: string;
  position_allowance: number;
  work_location_allowance: number;
  hire_date: string;
  date_out: string;
  status: boolean;
  is_admin: boolean;
  certification: string;

  // Banking & Benefits
  npwp: string;
  phone_number: string;
  bpjs_pensiun: string;
  bpjs_kesehatan: string;
  bpjs_tk: string;
  bank: string;
  bank_branch: string;
  bank_account_name: string;
  bank_account_number: string;
}

export let forms = ref<Employee>({
  // Basic Information
  name: "",
  employee_number: "",
  identity_number: "",
  email: "",
  position_id: "",
  department_id: "",

  // Personal Information
  gender: "male", // Default to male
  marital_status: "Belum Kawin", // Default to Belum Kawin
  date_of_birth: "",
  place_of_birth: "",
  education_id: "",
  religion_id: "",
  blood_group_id: "",
  biological_mother: "",

  // Address Information
  address: "",
  domicile: "",
  country_id: "",
  province_id: "",
  city_id: "",
  sub_district_id: "",
  village_id: "",

  // Employment Details
  workinghour_id: "",
  work_location_id: "",
  ter_statuses_id: "",
  salary: 0,
  salary_status: "All In", // Default to All In
  position_allowance: 0,
  work_location_allowance: 0,
  hire_date: dayjs(new Date()).format("YYYY-MM-DD"), // Default to today
  date_out: "",
  status: true, // Default to active
  is_admin: false,
  certification: "",

  // Banking & Benefits
  npwp: "",
  phone_number: "",
  bpjs_pensiun: "",
  bpjs_kesehatan: "",
  bpjs_tk: "",
  bank: "",
  bank_branch: "",
  bank_account_name: "",
  bank_account_number: ""
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  // Validasi field yang required sesuai dengan API
  const requiredFields = [
    { field: 'name', message: 'Nama pegawai harus diisi' },
    { field: 'position_id', message: 'Jabatan harus dipilih' },
    { field: 'department_id', message: 'Departemen harus dipilih' },
    { field: 'workinghour_id', message: 'Jam kerja harus dipilih' },
    { field: 'work_location_id', message: 'Lokasi kerja harus dipilih' },
    { field: 'ter_statuses_id', message: 'Status TER harus dipilih' },
    { field: 'salary', message: 'Gaji pokok harus diisi' },
    { field: 'hire_date', message: 'Tanggal mulai kerja harus diisi' },
  ];

  for (const item of requiredFields) {
    if (!values[item.field as keyof typeof values]) {
      console.error(`Validation failed: ${item.message}`);
      return false;
    }
  }

  return true;
}
