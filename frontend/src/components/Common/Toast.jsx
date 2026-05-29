import React from "react";
import {
  ToastContainer as ReactToastifyContainer,
  toast,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (type, message) => {
  if (type === "success") {
    toast.success(message, { position: "bottom-right" });
  } else if (type === "error") {
    toast.error(message, { position: "bottom-right" });
  } else {
    toast.info(message, { position: "bottom-right" });
  }
};

export const ToastContainer = () => (
  <ReactToastifyContainer
    position="bottom-right"
    autoClose={3500}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
  />
);
