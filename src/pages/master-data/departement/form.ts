import { ref } from "vue";

interface DepartemenForm {
  name: string;
}

export let forms = ref<DepartemenForm>({
  name: "",
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return values.name !== "";
}
