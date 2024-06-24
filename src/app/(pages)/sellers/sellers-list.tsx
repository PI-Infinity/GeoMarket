"use client";
import { useApp } from "@/app/context/app";
import SellerItem from "./seller-item";
import React from "react";

interface PropsTypes {
  sellers: any;
  totalSellers: any;
}

const SellersList: React.FC<PropsTypes> = ({ sellers, totalSellers }) => {
  const { activeLanguage } = useApp();
  return (
    <div className="h-full rounded-xl">
      {totalSellers !== null && sellers?.length < 1 && (
        <div className="text-gray-400 flex w-full items-center justify-center text-red-500 pt-4">
          {activeLanguage?.notFound}
        </div>
      )}
      <div className="grid grid-cols-2 p-0 laptop:grid-cols-4 gap-2 z-10 pb-4 rounded-md">
        {sellers &&
          sellers.map((item: any) => (
            <SellerItem item={item} key={item.userId} />
          ))}
      </div>
    </div>
  );
};

export default SellersList;
