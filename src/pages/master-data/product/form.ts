import { ref } from "vue";

interface ProductForm {
  sku: string;
  chart_of_account_code: string;
  unit_id: string;
  name: string;
  description: string;
  price: string;
  type: string;
  category_id: string;
}

export let forms = ref<ProductForm>({
  sku: "",
  chart_of_account_code: "",
  unit_id: "",
  name: "",
  description: "",
  price: "",
  type: "",
  category_id: "",
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.name !== "" &&
    values.sku !== "" &&
    values.chart_of_account_code !== "" &&
    values.unit_id !== "" &&
    values.description !== "" &&
    values.price !== "" &&
    values.type !== "" &&
    values.category_id !== ""
  );
}
