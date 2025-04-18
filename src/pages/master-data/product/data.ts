import { Dropdown } from "@/interfaces/dropdown";
import { ref } from "vue";

export const productTypeOptions = ref<Dropdown[]>([
  { id: "good", name: "Barang" },
  { id: "service", name: "Jasa" },
]);
