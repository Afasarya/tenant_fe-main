import { Dropdown } from "@/interfaces/dropdown";
import { ref } from "vue";

export let customerTypeOptions = ref<Dropdown[]>([
  { id: "corporate", name: "Corporate" },
  { id: "individual", name: "Individual" },
]);

export const statusCustomerOption = ref<Dropdown[]>([
  { id: "aktif", name: "Aktif" },
  { id: "inactive", name: "Tidak Aktif" },
]);
