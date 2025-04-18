import { ref } from "vue";

interface JamKerjaForm {
  name: string;
  startTime: string;
  endTime: string;
  status: boolean;
}

export let forms = ref<JamKerjaForm>({
  name: "",
  startTime: "",
  endTime: "",
  status: true,
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return values.name !== "" && values.startTime !== "" && values.endTime !== "";
}
