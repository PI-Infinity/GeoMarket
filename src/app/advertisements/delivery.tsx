import React, { useEffect, useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import "@/app/globals.css";
import Link from "next/link";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { useAdsContext } from "../context/advertisments";
import { useApp } from "../context/app";

const Delivery = () => {
  const { shuffledDeliveries } = useAdsContext();
  const { activeLanguage } = useApp();

  return (
    <div className="flex items-center gap-2 w-full relative overflow-hidden">
      <div className="p-2 h-full absolute z-10 -left-2 bg-gray-100">
        <div
          style={{ fontSize: "12px" }}
          className="z-10 bg-white text-red-500 p-1 px-3 shadow-md rounded-full text-sm font-semibold"
        >
          {activeLanguage?.ad}
        </div>
      </div>
      <div className="w-full flex gap-2 items-center overflow-hidden hide-scrollbar relative">
        <div className="animate-marquee flex gap-2">
          {Array(5)
            .fill(shuffledDeliveries)
            .flat()
            .map((item: any, index: number) => (
              <div
                key={index}
                className="py-1 my-2 px-3 w-full relative rounded-xl text-gray-300 flex items-center gap-1 hover:brightness-90 cursor-pointer"
                style={{
                  width: "100%",
                  fontWeight: 600,
                  transition: "ease-in 200ms",
                }}
              >
                <h4
                  className="text-gray-400 whitespace-nowrap"
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    textDecoration: "underline",
                  }}
                >
                  {item?.ad}
                </h4>
                <div>
                  <TbTruckDelivery size={16} className="text-gray-500" />
                </div>
              </div>
            ))}
        </div>
      </div>
      <Link
        href="/advertisements?from=delivery"
        style={{
          fontSize: "12px",
          cursor: "pointer",
        }}
        className="absolute w-12 z-10 bottom-0 h-full right-0 flex items-center justify-end px-2 text-red-500 bg-gray-100 text-sm font-semibold "
      >
        <MdOutlineKeyboardDoubleArrowRight
          size={24}
          className="hover:brightness-90"
        />
      </Link>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-marquee {
          display: flex;
          width: 500%;
          animation: marquee 60s linear infinite;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default Delivery;
