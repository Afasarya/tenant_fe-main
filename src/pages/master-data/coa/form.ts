import { ref } from "vue";

interface COAForm {
  name: string;
  code: string;
  categoryId: string | number;
  parentId?: string | number;
  type: string;
  children?: COAForm[] | any[];
}

export let forms = ref<COAForm>({
  name: "",
  code: "",
  categoryId: "",
  parentId: "",
  type: "D",
  children: [],
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.name !== "" &&
    values.code !== "" &&
    values.categoryId !== "" &&
    values.type !== ""
  );
}
