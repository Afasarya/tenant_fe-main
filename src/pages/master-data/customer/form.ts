import { ref } from "vue";

interface CustomerForm {
  code: string;
  name: string;
  address: string;
  phone: number | string;
  email: string;
  contactPerson: number | string;
  type: string | number;
}

export let forms = ref<CustomerForm>({
  code: "",
  name: "",
  type: "",
  address: "",
  contactPerson: "",
  email: "",
  phone: "",
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.name !== "" &&
    values.address !== "" &&
    values.phone !== "" &&
    values.contactPerson !== "" &&
    values.email !== "" &&
    values.type !== ""
  );
}
