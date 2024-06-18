// components/Loading.js
"use client";
import Image from "next/image";
import georgiaGif from "public/Georgia-xl.gif";
import { useApp } from "../context/app";

const Loading = () => {
  // loading
  const { isLoading } = useApp();

  return (
    <div
      style={{ display: isLoading ? "flex" : "none", background: "#fff" }}
      className="fixed inset-0 flex items-center justify-center gap-1 bg-red-500 z-50"
    >
      <div className="h-8 w-8">
        <Image
          src={georgiaGif}
          alt="Geo Market"
          style={{
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <span style={{ color: "#DA291C" }} className="ml-2 text-3xl font-bold">
        Geo Market
      </span>
    </div>
  );
};

export default Loading;
