import { ref } from "vue";
interface TarifPajakForm {
  type: string | number;
  rate: number | string;
  description: string;
}

export let forms = ref<TarifPajakForm>({
  type: "",
  rate: "",
  description: "",
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return values.type !== "" && values.rate !== "" && values.description !== "";
}
