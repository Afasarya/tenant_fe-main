import { ref } from "vue";

interface VendorForm {
  name: string;
  address: string;
  phone: number | string;
  email: string;
  taxNumber: number | string;
  contactPerson: number | string;
  type: string | number;
  status: string;
}

export let forms = ref<VendorForm>({
  name: "",
  type: "",
  address: "",
  contactPerson: "",
  email: "",
  phone: "",
  status: "aktif",
  taxNumber: 0,
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.name !== "" &&
    values.taxNumber !== "" &&
    values.address !== "" &&
    values.phone !== "" &&
    values.contactPerson !== "" &&
    values.type !== ""
  );
}
