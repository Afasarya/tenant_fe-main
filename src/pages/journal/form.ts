import { ref } from "vue";

interface BankForm {
  bank_id: string;
  account_name: string;
  account_number: string;
}

export let forms = ref<BankForm>({
  bank_id: "",
  account_name: "",
  account_number: "",
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.bank_id !== "" &&
    values.account_name !== "" &&
    values.account_number !== ""
  );
}
