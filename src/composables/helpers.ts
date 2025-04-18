import { computed } from "vue";

const convertCurrency = (
  val: any,
  prefix: boolean = false,
  fraction: boolean = true
) => {
  const formattedCurrency = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: fraction ? 2 : 0,
    maximumFractionDigits: fraction ? 2 : 0,
  }).format(val);

  return `${prefix ? "Rp. " : ""}${formattedCurrency}`;
};

const currentProjectId = computed(() => {
  if (localStorage.getItem("current_project") === "null") return "";
  return localStorage.getItem("current_project");
});

const currentUser = computed(() => {
  return JSON.parse(localStorage.getItem("current_user") as any);
});

const tenant = computed(() => {
  return JSON.parse(localStorage.getItem("tenant") as any);
});

export { convertCurrency, currentProjectId, currentUser, tenant };
