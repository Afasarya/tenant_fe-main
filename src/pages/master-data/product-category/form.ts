import { ref } from "vue";

interface CategoryForm {
  name: string;
}

export let forms = ref<CategoryForm>({
  name: "",
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return values.name !== "";
}
