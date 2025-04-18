import { ref } from "vue";

interface TarifPajakList {
  id: number;
  type: string;
  rate: number;
  description: string;
}

interface TarifPajak {
  id: number;
  name: string;
}

export const data: TarifPajakList[] = [
  {
    id: 1,
    type: "Pph21",
    rate: 10,
    description: "Rate PPH 21",
  },
  {
    id: 2,
    type: "BPJS Kesehatan",
    rate: 3,
    description: "Rate BPJS Kesehatan",
  },
  {
    id: 3,
    type: "BPJS Ketenagakerjaan",
    rate: 4,
    description: "Test Rate",
  },
];

export let taxType = ref<TarifPajak[]>([
  { id: 1, name: "Pph21" },
  { id: 2, name: "BPJS Kesehatan" },
  { id: 3, name: "BPJS Ketenagakerjaan" },
]);
