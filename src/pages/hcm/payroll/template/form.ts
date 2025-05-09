import { ref } from "vue";
import dayjs from "dayjs";

interface PayrollTemplate {
  name: string;
  description: string;
  effective_date: string;
  status: boolean;
  is_active: number;
  selected_components: number[];
}

// PERBAIKAN: Inisialisasi dengan tanggal default
export let forms = ref<PayrollTemplate>({
  name: "",
  description: "",
  effective_date: dayjs(new Date()).format("YYYY-MM-DD"), // Set default to today
  status: true,
  is_active: 1,
  selected_components: []
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  // PERBAIKAN: Log untuk debugging
  console.log("Validating form with values:", {
    name: values.name,
    description: values.description,
    effective_date: values.effective_date,
    status: values.status
  });

  // Validasi dasar - pastikan field tidak kosong
  if (values.name === "" || values.description === "" || values.effective_date === "") {
    console.log("Validation failed: Missing required fields");
    return false;
  }
  
  return true;
}