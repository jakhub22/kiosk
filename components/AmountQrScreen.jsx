"use client";

import { QRCode } from "antd";
import { db } from "../firebaseConfig";
import { cn } from "../lib/utlis";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AmountQrScreen({ setStep }) {
  const paddedAmount = Number(
    atob(localStorage.getItem("amount")) || "0"
  ).toLocaleString();

  const invoiceId = atob(localStorage.getItem("invoice_id"));
  const qrCode = atob(localStorage.getItem("qr_code"));
  console.log(qrCode, "qrCode");

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (!invoiceId) return;
    const docRef = db.collection("merch-qpay-invoice").doc(invoiceId);
    const unsubscribe = docRef.onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        if (data.status === "PENDING") {
          setLoader(true);
        }
        if (data.status === "SUCCESS") {
          setStep("success");
        }
      }
    });
    return () => unsubscribe();
  }, [invoiceId]);

  const inquireInvoice = async () => {
    setShowQR(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const response = await axios
        .get("/api/inquire-invoice", {
          params: {
            invoiceId: invoiceId,
          },
        })
        .then((res) => res.data);
      const status = response?.data?.invoice_status;
      const code = response?.code;

      if (code === "20000" && status === "PAID") {
        setStep("success");
      } else if (code === "20000" && status === "OPEN") {
        toast.error(
          <div className="w-[600px]">
            <div className="font-zona700">Өөө</div>
            <br />
            Төлөлт хийгдээгүй байна.
          </div>
        );
      } else {
        setShowQR(false);
        toast.error(res?.data?.message || "Төлбөрийн мэдээлэл олдсонгүй.");
      }
    } catch (error) {
      setShowQR(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between items-center px-[85px]">
      <div className="space-y-16">
        <div className="font-zona400 text-[46px] text-[#FFFFFF85]">
          Цэнэглэх дүн
        </div>
        <div className="font-zona700 text-[92px]">
          {paddedAmount}
          <span className="text-[46px] ml-2">MNT</span>
        </div>
      </div>
      <div className="w-full flex justify-center flex-col items-center space-y-[115px]">
        {!loader ? (
          <div className="w-[412px] relative h-[412px] rounded-[42px] flex items-center justify-center bg-white">
            <QRCode
              value={qrCode}
              size={400}
              bordered={false}
              icon="/images/mlogo.png"
              iconSize={90}
            />
          </div>
        ) : (
          <Image src="/assets/qrloading.gif" height={412} width={412} alt="" />
        )}
        <div
          className={cn(
            "font-zona400 text-[28px] text-[#FFFFFF85]",
            loader && "text-white"
          )}
        >
          {!loader
            ? "QR кодыг уншуулан цэнэглэлтээ хийнэ үү"
            : "Уншиж байна түр хүлээнэ үү."}
        </div>
        {!loader && (
          <button
            onClick={() => inquireInvoice()}
            className="bg-[#181818] rounded-[62px] h-[124px] flex items-center justify-between px-[46px] w-fit gap-8 font-zona400 text-[32px] text-[#FFFFFFE5]"
          >
            <RefreshCcw size={48} />
            <div>Төлбөр шалгах</div>
          </button>
        )}
      </div>
      <div className="pb-[100px] w-full">
        <div />
      </div>
    </div>
  );
}
