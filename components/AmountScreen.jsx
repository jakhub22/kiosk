"use client";

import axios from "axios";
import { cn } from "../lib/utlis";
import { ChevronRight, Delete, RefreshCcw } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";

export default function AmountScreen({ setStep }) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const formattedValue = Number(value || "0").toLocaleString();
  const paddedValue = formattedValue.split("");
  const buttonDisabled = value.length === 0 || loading;

  const handleDigit = (digit) => {
    if (value.length < 12) {
      setValue((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    setValue((prev) => prev.slice(0, -1));
  };

  const handleQuickAmount = (amount) => {
    setValue(amount);
  };

  const generateInvoice = async () => {
    const eventType = "RPT2025";
    if (isNaN(Number(value)) || Number(value) < 100) {
      toast.error(
        <div className="w-[600px]">
          <div className="font-zona700"> Уучлаарай</div>
          <br />
          Цэнэглэх доод дүн 100₮
        </div>
      );
      return;
    }
    setLoading(true);
    try {
      const result = await axios
        .post("/api/create-invoice", {
          amount: value,
          eventType: eventType,
          nfcId: atob(localStorage.getItem("nfc_id")),
        })
        .then((res) => res.data);
      if (result.code.startsWith("2")) {
        localStorage.setItem("amount", btoa(result.data.amount));
        localStorage.setItem("qr_code", btoa(result.data.qr_code));
        localStorage.setItem("invoice_id", btoa(result.data.id));
        setStep("qr");
      } else {
        toast.error(result.message || "Төлбөрийн мэдээлэл олдсонгүй.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Алдаа гарлаа."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between items-center px-[85px]">
      <div className="space-y-16">
        <div className="font-zona400 text-[46px] text-[#FFFFFF85]">
          Цэнэглэх дүн
        </div>
        {loading ? (
          <div className="font-zona700 text-[92px]">
            {paddedValue?.map((char, index) => (
              <span key={index}>{char}</span>
            ))}
            <span className="text-[46px] ml-2">MNT</span>
          </div>
        ) : (
          <>
            <div className="font-zona700 text-[92px]">
              {paddedValue?.map((char, index) => (
                <span key={index}>{char}</span>
              ))}
            </div>
            <div className="grid grid-cols-4 mt-10 text-white/90 gap-6 text-3xl">
              {quickAmounts?.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleQuickAmount(amount)}
                  className="px-8 py-7 justify-center items-center rounded-[32px] bg-[#2C2C2C] text-3xl font-zona400"
                >
                  {Number(amount).toLocaleString()}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {loading ? (
        <div className="w-full flex justify-center flex-col items-center space-y-[115px]">
          <div className="w-[412px] h-[412px] rounded-[42px] flex items-center justify-center bg-white">
            <Image src="/assets/loading.gif" width={668} height={668} alt="" />
          </div>
          <div className="font-zona400 text-[28px] text-[#FFFFFF85]">
            QR кодыг уншуулан цэнэглэлтээ хийнэ үү
          </div>
          <button
            disabled
            className="bg-[#181818] rounded-[62px] h-[124px] flex items-center justify-between px-[46px] w-fit gap-8 font-zona400 text-[32px] text-[#FFFFFF2E]"
          >
            <RefreshCcw size={48} />
            <div>Төлбөр шалгах</div>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1">
          <div
            className={cn(
              "grid font-zona400 transition-all duration-200 ease-in-out justify-items-center gap-10 items-center mx-auto grid-cols-3 size-[650px]"
            )}
          >
            {digits?.map((char, index) => {
              const handleClick = () => {
                if (char === "←") {
                  handleDelete();
                } else if (char !== "") {
                  handleDigit(char);
                }
              };
              const isDeleteButton = char === "←";

              return (
                <button
                  key={index}
                  onClick={handleClick}
                  className={cn(
                    "rounded-full text-5xl font-zona400 flex items-center justify-center bg-[#1C1C1E] text-white/90 size-32",
                    char === "" && "bg-transparent",
                    char !== "" && "active:bg-[#6B6B71]"
                  )}
                >
                  {isDeleteButton ? <Delete size={48} /> : char}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="pb-[100px] w-full">
        {!loading ? (
          <button
            onClick={() => generateInvoice()}
            disabled={buttonDisabled}
            className="h-[132px] relative rounded-[42px] bg-linear-to-r from-[#079A80] to-[#B170BD] w-full flex items-center justify-center font-zona700 text-[46px] disabled:text-[#FFFFFF52] disabled:from-[#2C2C2C] disabled:to-[#181818]"
          >
            Үргэлжлүүлэх
            <ChevronRight
              size={62}
              className="absolute right-[52px] top-1/2 -translate-y-1/2"
            />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "←"];
const quickAmounts = ["5000", "10000", "20000", "50000"];
