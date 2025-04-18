const viewMode = (currentRoute: string) => {
  if (currentRoute?.includes("edit")) return "edit";
  if (currentRoute?.includes("detail")) return "detail";

  return "add";
};

export { viewMode };
