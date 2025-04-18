import { ref } from "vue";

interface AsetKategoriForm {
  name: string;
}

export let forms = ref<AsetKategoriForm>({
  name: "",
});
export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return values.name !== "";
}
