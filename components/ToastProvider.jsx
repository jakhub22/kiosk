"use client";

import { CircleX, X } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      autoClose={3000}
      hideProgressBar={true}
      closeOnClick
      position="top-center"
      pauseOnHover={true}
      draggable={true}
      theme="dark"
      closeButton={<X size={42} />}
      icon={<CircleX size={42} fill="#D7361F" />}
      toastClassName={() =>
        "flex flex-row p-8 text-3xl font-regular gap-x-4 mx-auto min-h-10 rounded-[42px] border-baraglSaaral/60 bg-darkGray2/10 items-start rounded-2xl cursor-pointer"
      }
    />
  );
}
