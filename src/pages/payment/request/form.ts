import { ref } from "vue";

interface Payment {
  project_id: string;
  chart_of_account_code: string;
  product_id: string;
  quantity: string;
  price: number;
  description: string;
  remarks: string;
}
interface HeaderPayment {
  project_id: any;
  date: string;
  department_id?: string;
  status?: string;
  transaction_id?: string;
  module?: string;
  purchase_request_number?: string;
  project_name?: string;
}

interface ApprovalTax {
  ppn: number;
  pph21: number;
  pph22: number;
  pph24: number;
  pph_final: number;
}

export let forms = ref<Payment>({
  project_id: "",
  chart_of_account_code: "",
  product_id: "",
  quantity: "",
  description: "",
  price: 0,
  remarks: "",
});

export let headerForms = ref<HeaderPayment>({
  project_id: "",
  date: "",
  department_id: "",
});

export let taxForms = ref<ApprovalTax>({
  ppn: 0,
  pph21: 0,
  pph22: 0,
  pph24: 0,
  pph_final: 0,
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

  return values.date !== "";
}

export function validateTax() {
  formSubmitted.value = true;
  const values = taxForms.value;

  return (
    values.ppn !== 0 &&
    values.pph21 !== 0 &&
    values.pph22 !== 0 &&
    values.pph24 !== 0 &&
    values.pph_final !== 0
  );
}
