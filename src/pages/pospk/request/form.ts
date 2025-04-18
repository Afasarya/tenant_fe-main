import { ref } from "vue";

interface Payment {
  project_id: string;
  chart_of_account_code: string;
  product_id: string;
  quantity: string;
  price: number;
  description: string;
  remark: string;
}
interface HeaderPospk {
  project_id: any;
  date: string;
  status?: string;
  recommendation_id?: string;
  recommendation_number?: string;
  project_name?: string;
  due_date: string;
  type?: string;
  term_of_payment?: string;
  franco?: string;
}

interface ApprovalTax {
  ppn: number;
  pph: number;
}

export let forms = ref<Payment>({
  project_id: "",
  chart_of_account_code: "",
  product_id: "",
  quantity: "",
  description: "",
  price: 0,
  remark: "",
});

export let headerForms = ref<HeaderPospk>({
  project_id: "",
  date: "",
  due_date: "",
  term_of_payment: "",
  franco: "",
  type: "",
  recommendation_id: "",
});

export let taxForms = ref<ApprovalTax>({
  ppn: 0,
  pph: 0,
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

  return (
    values.date !== "" &&
    values.due_date !== "" &&
    values.type !== "" &&
    values.recommendation_id !== ""
  );
}

export function validateTax() {
  formSubmitted.value = true;
  const values = taxForms.value;

  return values.ppn !== 0 && values.pph !== 0;
}
