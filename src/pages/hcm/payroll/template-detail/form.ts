import { ref } from "vue";

interface PayrollTemplateDetail {
  payroll_template_id: string;
  payroll_component_id: string;
  amount: number;
  is_fixed: boolean;
}

export let forms = ref<PayrollTemplateDetail>({
  payroll_template_id: "",
  payroll_component_id: "",
  amount: 0,
  is_fixed: true
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.payroll_template_id !== "" &&
    values.payroll_component_id !== ""
  );
}