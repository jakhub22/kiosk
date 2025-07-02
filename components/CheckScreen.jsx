import { ChevronRight, User } from "lucide-react";
import React from "react";

const transformName = (name) => {
  if (!name) return "";
  return [...name].filter((_, index) => index % 2 === 0).join("•") + "•";
};

export default function CheckScreen({ setStep }) {
  return (
    <div className="h-full flex flex-col justify-between items-center px-[85px]">
      <div className="font-zona700 text-[46px]">Та овог нэрээ шалгаарай</div>
      <div className="flex flex-col items-center justify-center gap-[72px]">
        <div className="w-[282px] h-[282px] rounded-full bg-[#48484A] flex items-center justify-center">
          <User size={132} />
        </div>
        <div className="font-zona400 text-[56px] text-white">
          {transformName(atob(localStorage.getItem("first_name")))}{" "}
          {transformName(atob(localStorage.getItem("last_name")))}
        </div>
      </div>
      <div className="pb-[100px] w-full">
        <button
          onClick={() => setStep("amount")}
          className="h-[132px] relative rounded-[42px] bg-linear-to-r from-[#079A80] to-[#B170BD] w-full flex items-center justify-center font-zona700 text-[46px] disabled:text-[#FFFFFF52] disabled:from-[#2C2C2C] disabled:to-[#181818]"
        >
          Үргэлжлүүлэх
          <ChevronRight
            size={62}
            className="absolute right-[52px] top-1/2 -translate-y-1/2"
          />
        </button>
      </div>
    </div>
  );
}
