import { Check } from "lucide-react";
import React from "react";

export default function SuccessScreen({ setStep, setModalOpen }) {
  const paddedAmount = Number(atob(localStorage.getItem("amount")) || "0");
  const paddedBalance = Number(atob(localStorage.getItem("balance")) || "0");
  const totalBalance = paddedAmount + paddedBalance;

  const formattedAmount = paddedAmount.toLocaleString();
  const formattedBalance = paddedBalance.toLocaleString();
  const formattedTotal = totalBalance.toLocaleString();
  return (
    <div className="h-full flex flex-col justify-between items-center px-[85px]">
      <div>
        <div className="w-full flex justify-center">
          <div className="bg-[#21C7A3] h-[151px] w-[151px] rounded-full flex items-center justify-center">
            <Check size={80} className="text-[#0F0F0F]" />
          </div>
        </div>
        <div className="space-y-[74px]">
          <div className="font-zona700 text-[92px]">
            {paddedAmount}
            <span className="text-[46px] ml-2">MNT</span>
          </div>
          <div className="font-zona400 text-[46px] text-[#FFFFFF85]">
            Цэнэглэлт амжилттай хийгдлээ.
          </div>
        </div>
      </div>
      <div className="w-full px-[50px]">
        <div className="flex w-full items-center justify-between py-[62px]">
          <div className="font-zona400 text-[32px] text-[#FFFFFF85]">
            Үлдэгдэл
          </div>
          <div className="font-zona700 text-[32px] text-[#FFFFFF85]">
            ₮{formattedBalance}
          </div>
        </div>
        <div className="flex w-full items-center justify-between py-[62px] border-b border-[#6B6B71]">
          <div className="font-zona400 text-[32px] text-[#FFFFFF85]">
            Цэнэглэлт
          </div>
          <div className="font-zona700 text-[32px] text-[#FFFFFF85]">
            ₮{formattedBalance}
          </div>
        </div>
        <div className="flex w-full items-center justify-between py-[62px]">
          <div className="font-zona400 text-[32px] text-[#FFFFFFE5]">
            Нийт үлдэгдэл
          </div>
          <div className="font-zona700 text-[32px] text-[#FFFFFFE5]">
            ₮{formattedBalance}
          </div>
        </div>
      </div>
      <div className="pb-[100px] w-full">
        <button
          onClick={() => {
            setStep("");
            setModalOpen(false);
          }}
          className="h-[132px] relative rounded-[42px] bg-linear-to-r from-[#079A80] to-[#B170BD] w-full flex items-center justify-center font-zona700 text-[46px] disabled:text-[#FFFFFF52] disabled:from-[#2C2C2C] disabled:to-[#181818]"
        >
          Дуусгах
          <Check
            size={62}
            className="absolute right-[52px] top-1/2 -translate-y-1/2"
          />
        </button>
      </div>
    </div>
  );
}
