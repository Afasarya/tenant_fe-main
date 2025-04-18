import { Dropdown } from "@/interfaces/dropdown";
import { ref } from "vue";

export const daysOption = ref<Dropdown[]>([
  { id: "Senin", name: "Senin" },
  { id: "Selasa", name: "Selasa" },
  { id: "Rabu", name: "Rabu" },
  { id: "Kamis", name: "Kamis" },
  { id: "Jumat", name: "Jumat" },
  { id: "Sabtu", name: "Sabtu" },
  { id: "Minggu", name: "MInggu" },
]);

export const statusOption = ref<Dropdown[]>([
  { id: true, name: "Aktif" },
  { id: false, name: "Tidak Aktif" },
]);

export const companyOptions = [];
