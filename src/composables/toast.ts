import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const showSuccessToast = (message: string, duration?: number) => {
  toast.success(message || "", {
    hideProgressBar: true,
    autoClose: duration || 4000,
    theme: "colored",
  });
};

const showErrorToast = (message: string, duration?: number) => {
  toast.error(message || "", {
    hideProgressBar: true,
    autoClose: duration || 4000,
    theme: "colored",
  });
};

export { showSuccessToast, showErrorToast };
