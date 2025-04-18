import { ref } from "vue";

interface Project {
  name: string;
  customer_id: string;
  address: string;
  nominal: number;
}

export let forms = ref<Project>({
  name: "",
  address: "",
  customer_id: "",
  nominal: 0,
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.name !== "" &&
    values.address !== "" &&
    values.customer_id !== "" &&
    values.nominal !== 0
  );
}
