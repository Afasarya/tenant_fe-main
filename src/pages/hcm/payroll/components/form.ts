import { ref } from "vue";

interface PayrollComponent {
  name: string;
  description: string;
  type_component: string;
  type_value: string;
  amount: number;
  is_permanent: number;
  is_pajak: number;
  status: string;
}

export let forms = ref<PayrollComponent>({
  name: "",
  description: "",
  type_component: "kredit",
  type_value: "fix",
  amount: 0,
  is_permanent: 1,
  is_pajak: 0,
  status: "active"
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.name !== "" &&
    values.description !== "" &&
    values.type_component !== ""
  );
}