import { ref } from "vue";

interface JabatanForm {
  name: string;
}

export let forms = ref<JabatanForm>({
  name: "",
});

interface ApprovalForm {
  id?: string | number;
  user_id: string;
  module: string;
  position_name: string;
  description: string;
  order: string;
  project_id?: string | null;
}

export const initialApprovalForm: ApprovalForm = {
  id: "",
  user_id: "",
  module: "",
  position_name: "",
  description: "",
  order: "",
  project_id: null,
};

export let formSubmitted = ref<boolean>(false);
export let approvalForms = ref<ApprovalForm>({ ...initialApprovalForm });

export function validate() {
  formSubmitted.value = true;
  const values = approvalForms.value;

  return (
    values.user_id !== "" &&
    values.position_name !== "" &&
    values.description !== "" &&
    values.order !== ""
  );
}
