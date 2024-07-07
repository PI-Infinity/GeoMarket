"use client";
import { useApp } from "@/app/context/app";
import SellerItem from "./seller-item";
import React from "react";
import { MoonLoader } from "react-spinners";

interface PropsTypes {
  sellers: any;
  totalSellers: any;
  loadingSellers: boolean;
}

const SellersList: React.FC<PropsTypes> = ({
  sellers,
  totalSellers,
  loadingSellers,
}) => {
  const { activeLanguage } = useApp();
  return (
    <div className="h-full rounded-xl">
      {totalSellers !== null && sellers?.length < 1 && (
        <div className="text-gray-400 flex w-full items-center justify-center text-red-500 pt-4">
          {activeLanguage?.notFound}
        </div>
      )}
      {loadingSellers && (
        <div className="w-full flex items-center justify-center h-56">
          <MoonLoader size={40} color="red" />
        </div>
      )}
      <div className="grid grid-cols-2 p-0 laptop:grid-cols-4 gap-2 z-10 pb-4 rounded-md">
        {!loadingSellers &&
          sellers &&
          sellers.map((item: any) => (
            <SellerItem item={item} key={item.userId} />
          ))}
      </div>
    </div>
  );
};

export default SellersList;
