import { ref } from "vue";

interface Purchase {
  project_id: string;
  chart_of_account_code: string;
  product_id: string;
  quantity: string;
  price: number;
  description: string;
  remarks: string;
}
interface HeaderPurchase {
  project_id: any;
  number: string;
  date: string;
  expected_delivery: string;
  department_id?: string;
  status?: string;
  total: number;
}

export let forms = ref<Purchase>({
  project_id: "",
  chart_of_account_code: "",
  product_id: "",
  quantity: "",
  description: "",
  price: 0,
  remarks: "",
});

export let headerForms = ref<HeaderPurchase>({
  project_id: "",
  number: "",
  date: "",
  expected_delivery: "",
  department_id: "",
  total: 0,
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.chart_of_account_code !== "" &&
    values.product_id !== "" &&
    values.price !== 0 &&
    values.quantity !== ""
  );
}

export function validateHeader() {
  formSubmitted.value = true;
  const values = headerForms.value;

  return values.date !== "" && values.expected_delivery !== "";
}
