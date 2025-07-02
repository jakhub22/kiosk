import Image from "next/image";
import React from "react";

export default function LoaderScreen() {
  return (
    <div className="w-full text-center flex flex-col h-full">
      <div className="font-zona700 text-[46px]">Та түр хүлээгээрэй</div>
      <div className="flex-1 flex items-center justify-center">
        <Image src="/assets/searchuser.gif" width={668} height={668} alt="" />
      </div>
    </div>
  );
}
