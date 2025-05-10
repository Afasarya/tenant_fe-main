import { Dropdown } from "@/interfaces/dropdown";
import { ref } from "vue";

export const genderOptions = ref<Dropdown[]>([
  { id: "male", name: "Laki-laki" },
  { id: "female", name: "Perempuan" },
]);

export const maritalStatusOptions = ref<Dropdown[]>([
  { id: "Belum Kawin", name: "Belum Kawin" },
  { id: "Kawin", name: "Kawin" },
  { id: "Cerai Hidup", name: "Cerai Hidup" },
  { id: "Cerai Mati", name: "Cerai Mati" },
]);

export const salaryStatusOptions = ref<Dropdown[]>([
  { id: "All In", name: "All In" },
  { id: "Gross", name: "Gross" },
  { id: "Net", name: "Net" },
]);

export const activeTabOptions = ref([
  { id: "basic", name: "Informasi Dasar", icon: "fa fa-user" },
  { id: "personal", name: "Data Pribadi", icon: "fa fa-id-card" },
  { id: "address", name: "Alamat & Kontak", icon: "fa fa-map-marker" },
  { id: "employment", name: "Informasi Kepegawaian", icon: "fa fa-briefcase" },
  { id: "banking", name: "Rekening & Benefit", icon: "fa fa-credit-card" },
]);
