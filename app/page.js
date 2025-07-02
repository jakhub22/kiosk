/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowLeft, ChevronUp, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utlis";
import CheckScreen from "../components/CheckScreen";
import RegisterScreen from "../components/RegisterScreen";
import AmountScreen from "../components/AmountScreen";
import AmountQrScreen from "../components/AmountQrScreen";
import SuccessScreen from "../components/SuccessScreen";

export default function Home() {
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState("");

  const handleSwipeUp = async () => {
    setStep("register");
    setModalOpen(true);
    await controls.start({
      y: 0,
      transition: { type: "spring", stiffness: 300 },
    });

    setIsDragging(false);
  };

  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    const disableKey = (e) => e.preventDefault();

    document.addEventListener("contextmenu", disableRightClick);
    window.addEventListener("keydown", disableKey);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      window.removeEventListener("keydown", disableKey);
    };
  }, []);

  function renderScreen() {
    switch (step) {
      case "check":
        return <CheckScreen setStep={setStep} />;
      case "register":
        return <RegisterScreen setStep={setStep} />;
      case "amount":
        return <AmountScreen setStep={setStep} />;
      case "qr":
        return <AmountQrScreen setStep={setStep} />;
      case "success":
        return <SuccessScreen setStep={setStep} setModalOpen={setModalOpen} />;
      default:
        break;
    }
  }

  function backStep() {
    switch (step) {
      case "check":
        setStep("register");
        break;
      case "register":
        setStep("");
        break;
      case "amount":
        setStep("check");
        break;
      case "qr":
        setStep("amount");
        break;
      case "success":
        setStep("qr");
        break;
      default:
        break;
    }
  }

  return (
    <main>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/assets/pt.mp4" type="video/mp4" />
      </video>
      <div className="w-full">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={800}
          height={124}
          className="absolute top-1/6 left-1/2 -translate-x-1/2"
        />
      </div>
      <div>
        <div className="absolute w-full bottom-0 z-0 h-[888px] bg-linear-to-b from-[#0F0F0F00] via-[#0F0F0FD1] to-[#0F0F0F]" />
        <img
          src="/images/Group 12.png"
          alt="logo"
          className="absolute z-10 bottom-0 left-1/2 -translate-x-1/2"
        />
        <div className="absolute z-10 bottom-1/5 left-1/2 -translate-x-1/2 text-white font-zona700 text-[46px]">
          Дансаа цэнэглэх
        </div>
        <motion.button
          className={cn(
            "h-[200px] z-10 w-[200px] rounded-full bg-gradient-to-br from-[#079A80] to-[#B170BD] flex items-center justify-center absolute bottom-0 left-1/2 -translate-x-1/2",
            isDragging
              ? "animate-none"
              : "animate-bounce [animation-duration:3s]"
          )}
          drag="y"
          dragConstraints={{ top: -150, bottom: 0 }}
          dragElastic={0.2}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(_, info) => {
            if (info.offset.y < -50) {
              handleSwipeUp();
            } else {
              controls.start({
                y: 0,
                transition: { type: "spring", stiffness: 300 },
              });
              setIsDragging(false);
            }
          }}
          animate={controls}
        >
          <ChevronUp size={120} />
        </motion.button>
      </div>
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 text-center left-0 w-full h-screen bg-[#000000]/90 backdrop-blur-3xl rounded-t-2xl shadow-xl z-50 flex flex-col"
          >
            <div className="flex w-full justify-between p-[58px]">
              {step !== "register" ? (
                <button
                  className="w-[108px] h-[108px] rounded-full bg-[#2C2C2C] flex items-center justify-center"
                  onClick={() => backStep()}
                >
                  <ArrowLeft size={40} />
                </button>
              ) : (
                <div />
              )}
              <button
                className="w-[108px] h-[108px] rounded-full bg-[#2C2C2C] flex items-center justify-center"
                onClick={() => setModalOpen(false)}
              >
                <X size={40} />
              </button>
            </div>
            <div className="flex-1 overflow-auto">{renderScreen()}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
