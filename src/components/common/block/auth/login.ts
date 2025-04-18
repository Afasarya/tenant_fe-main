import { ref } from "vue";

interface LoginForm {
  email: string;
  password: string;
  tenant_id: string;
}

export let forms = ref<LoginForm>({
  email: "",
  password: "",
  tenant_id: "",
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.email !== "" && values.password !== "" && values.tenant_id !== ""
  );
}
