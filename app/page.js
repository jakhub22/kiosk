"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    let timer = setTimeout(() => router.replace("/"), 60000);

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => router.replace("/"), 60000);
    };

    window.addEventListener("touchstart", reset);
    window.addEventListener("mousemove", reset);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("touchstart", reset);
      window.removeEventListener("mousemove", reset);
    };
  }, [router]);

  // Disable context menu & keyboard
  // useEffect(() => {
  //   const disableRightClick = (e) => e.preventDefault();
  //   const disableKey = (e) => e.preventDefault();

  //   document.addEventListener("contextmenu", disableRightClick);
  //   window.addEventListener("keydown", disableKey);

  //   return () => {
  //     document.removeEventListener("contextmenu", disableRightClick);
  //     window.removeEventListener("keydown", disableKey);
  //   };
  // }, []);

  return (
    <main className="flex flex-col items-center justify-center h-[1920px] w-full text-center">
      <h1 className="text-4xl font-bold mb-10">Тавтай морилно уу</h1>
      <button className="bg-blue-600 text-white text-2xl px-8 py-4 rounded-xl active:scale-95">
        Үйлчилгээ сонгох
      </button>
    </main>
  );
}
