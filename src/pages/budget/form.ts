import { ref } from "vue";

interface Budget {
  project_id: string;
  chart_of_account_code: string;
  year: string;
  amount: number;
}
interface HeaderBudget {
  project_id: any;
  year: string;
  nomor: string;
  status?: string;
  project_value: number;
}

export let forms = ref<Budget>({
  project_id: "",
  chart_of_account_code: "",
  year: "",
  amount: 0,
});

export let headerForms = ref<HeaderBudget>({
  project_id: "",
  year: "",
  nomor: "",
  status: "",
  project_value: 0,
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return values.chart_of_account_code !== "" && values.amount !== 0;
}

export function validateHeader() {
  formSubmitted.value = true;
  const values = headerForms.value;

  return values.year !== "" && values.nomor !== "";
}
