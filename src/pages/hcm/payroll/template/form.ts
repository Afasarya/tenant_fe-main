import { ref } from "vue";

interface PayrollTemplate {
  name: string;
  description: string;
  effective_date: string;
  status: boolean;
  is_active: number;
  selected_components: any[];
}

export let forms = ref<PayrollTemplate>({
  name: "",
  description: "",
  effective_date: "",
  status: true,
  is_active: 1,
  selected_components: []
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