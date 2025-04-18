import { ref } from "vue";

interface LocationForm {
  name: string;
  allowance: number;
}

export let forms = ref<LocationForm>({
  name: "",
  allowance: 0,
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return values.name !== "" && values.allowance !== 0;
}
