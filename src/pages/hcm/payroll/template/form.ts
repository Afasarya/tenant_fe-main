import { ref } from "vue";

interface PayrollTemplate {
  name: string;
  description: string;
  effective_date: string;
  status: boolean;
}

export let forms = ref<PayrollTemplate>({
  name: "",
  description: "",
  effective_date: "",
  status: true
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.name !== "" &&
    values.description !== "" &&
    values.effective_date !== ""
  );
}