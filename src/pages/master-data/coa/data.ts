import { Dropdown } from "@/interfaces/dropdown";
import { ref } from "vue";

interface COA {
  id: number;
  code: string | number;
  name: string;
  type: string;
  parentName?: string;
}

export const CoaLsit: COA[] = [
  {
    id: 1,
    name: "Kas",
    type: "asset",
    code: "A1001",
    parentName: "",
  },
  {
    id: 2,
    name: "Piutang",
    type: "asset",
    code: "A1002",
    parentName: "",
  },
  {
    id: 3,
    name: "Rekening Bank",
    type: "asset",
    code: "A1003",
    parentName: "",
  },
];

export let coaTypeOpt = ref<Dropdown[]>([
  { id: "D", name: "Debit" },
  { id: "K", name: "Kredit" },
]);
