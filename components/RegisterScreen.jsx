import { cn } from "../lib/utlis";
import axios from "axios";
import { ChevronRight, Delete } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import LoaderScreen from "./LoaderScreen";

export default function RegisterScreen({ setStep }) {
  const [loader, setLoader] = useState(false);
  const [inputMode, setInputMode] = useState("letters");
  const [paddedNumber, setPaddedNumber] = useState(Array(10).fill("_"));
  const [notFound, setNotFound] = useState(false);
  const padItems = inputMode === "letters" ? cyrillicPad : digits;
  const buttonDisabled = paddedNumber.includes("_");

  const handleDigit = (value) => {
    const maxLength = 10;
    const currentLength = paddedNumber.filter((c) => c !== "_").length;
    if (currentLength >= maxLength) return;

    const isLetter = /^[А-ЯЁӨҮ]$/.test(value);
    const isDigit = /^\d$/.test(value);

    if (isLetter && inputMode === "letters") {
      const next = [...paddedNumber];
      const index = next.findIndex((c) => c === "_");

      if (index !== -1 && index < 2) {
        next[index] = value;
        setPaddedNumber(next);

        const filledLetters = next.slice(0, 2).filter((c) => c !== "_");
        if (filledLetters.length === 2) {
          setTimeout(() => setInputMode("numbers"), 100);
        }
      }

      return;
    }

    if (isDigit && inputMode === "numbers") {
      const next = [...paddedNumber];
      const index = next.findIndex((c) => c === "_");
      if (index !== -1) {
        next[index] = value;
        setPaddedNumber(next);
      }
    }
  };

  const handleDelete = () => {
    setNotFound(false);
    setPaddedNumber((prev) => {
      const lastIndex = [...prev].reverse().findIndex((c) => c !== "_");
      if (lastIndex === -1) return prev;

      const index = prev.length - 1 - lastIndex;
      const next = [...prev];
      next[index] = "_";

      if (index < 2) {
        setInputMode("letters");
      }
      return next;
    });
  };

  const checkRegister = async () => {
    setLoader(true);
    try {
      const eventType = "RPT2025";
      const result = await axios
        .get("/api/check-register", {
          params: {
            eventType,
            registerNumber: paddedNumber.join(""),
          },
        })
        .then((res) => res.data);
      console.log(result, "result");
      if (result?.code.startsWith("2")) {
        setNotFound(false);
        localStorage.setItem("first_name", btoa(result.data.first_name));
        localStorage.setItem("last_name", btoa(result.data.last_name));
        localStorage.setItem("nfc_id", btoa(result.data.nfc_id));
        localStorage.setItem("balance", btoa(result.data.balance));
        setStep("check");
      } else {
        setNotFound(true);
        localStorage.removeItem("first_name");
        localStorage.removeItem("last_name");
        localStorage.removeItem("nfc_id");
        localStorage.removeItem("balance");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  };

  if (loader) return <LoaderScreen />;
  return (
    <div className="w-full flex h-full flex-col items-center justify-between px-[85px]">
      <div>
        <div className="font-zona700 text-[46px] pb-[100px]">
          Регистрийн дугаар оруулах
        </div>
        <div className="flex gap-7">
          {paddedNumber?.map((char, index) => {
            const isFilled = char !== "_";
            const showDash = inputMode === "letters" && !isFilled && index < 2;

            return (
              <div
                key={index}
                className={cn(
                  "w-[76px] border-b-6 h-[140px] flex items-center justify-center font-zona700 text-7xl",
                  isFilled ? "text-white/90" : "text-[#3A3A3C]",
                  notFound
                    ? "border-[#D7361F]"
                    : isFilled
                    ? "border-[#079A80]"
                    : "border-[#3A3A3C]"
                )}
              >
                {isFilled ? char : showDash ? "-" : "•"}
              </div>
            );
          })}
        </div>
        {notFound && (
          <p className="text-[#D7361F] text-3xl font-zona400 text-center pt-[60px]">
            Бүртгэлтэй хэрэглэгч олдсонгүй.
          </p>
        )}
      </div>
      <div
        className={cn(
          "grid font-zona400 transition-all duration-200 ease-in-out justify-items-center gap-10 items-center mx-auto",
          inputMode === "letters"
            ? "grid-cols-6 size-[824px]"
            : "grid-cols-3 size-[650px]"
        )}
      >
        {padItems?.map((char, index) => {
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
                "rounded-full text-5xl font-zona400 flex items-center justify-center bg-[#1C1C1E] text-white/90",
                inputMode === "letters" ? "size-28 text-4xl" : "size-32",
                char === "" && "bg-transparent",
                char !== "" && "active:bg-[#6B6B71]"
              )}
            >
              {isDeleteButton ? <Delete size={48} /> : char}
            </button>
          );
        })}
      </div>
      <div className="pb-[100px] w-full">
        <button
          onClick={() => checkRegister()}
          disabled={buttonDisabled}
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

const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "←"];
const cyrillicPad = [
  "А",
  "Б",
  "В",
  "Г",
  "Д",
  "Е",
  "Ё",
  "Ж",
  "З",
  "И",
  "Й",
  "К",
  "Л",
  "М",
  "Н",
  "О",
  "Ө",
  "П",
  "Р",
  "С",
  "Т",
  "У",
  "Ү",
  "Ф",
  "Х",
  "Ц",
  "Ч",
  "Ш",
  "Щ",
  "Ъ",
  "Ь",
  "Ы",
  "Э",
  "Ю",
  "Я",
  "←",
];
