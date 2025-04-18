import { ref } from "vue";

interface Employee {
  name: string;
  position_id: string;
  department_id: string;
  workinghour_id: string;
  salary: number;
  hire_date: string;
  status: boolean;
  work_location_id: string;
  ter_statuses_id: string;
}

export let forms = ref<Employee>({
  name: "",
  position_id: "",
  department_id: "",
  workinghour_id: "",
  salary: 0,
  hire_date: "",
  status: true,
  work_location_id: "",
  ter_statuses_id: "",
});

export let formSubmitted = ref<boolean>(false);

export function validate() {
  formSubmitted.value = true;
  const values = forms.value;

  return (
    values.name !== "" &&
    values.position_id !== "" &&
    values.department_id !== "" &&
    values.workinghour_id !== "" &&
    values.salary !== 0 &&
    values.hire_date !== "" &&
    values.work_location_id !== "" &&
    values.ter_statuses_id !== ""
  );
}
