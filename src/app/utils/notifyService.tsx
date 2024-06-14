import { toast } from "react-toastify";

export const notify = (msg: string, type: string) => {
  const options: any = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  if (type === "success") {
    toast.success(msg, options);
  } else if (type === "error") {
    toast.error(msg, options);
  }
};
