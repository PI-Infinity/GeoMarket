"use client";
import { useAdminContext } from "@/app/context/admin";
import React from "react";

const Page = () => {
  // analytics stats
  const { stats } = useAdminContext();

  //for products
  const maxCount =
    stats?.visits.visitsByDate?.reduce(
      (max: any, item: any) => (item.count > max ? item.count : max),
      0
    ) || 1;

  return (
    <div className="p-4">
      <div className="flex items-center gap-1">
        <h4>Unique visitoris:</h4>
        <span className="text-red-500 font-semibold">
          {stats?.visits.uniqueVisitors}
        </span>
      </div>
      <h4 className="mt-4">Visits by date:</h4>
      <div className="h-48 shadow-md rounded-xl w-full mt-2 flex items-center gap-2 overflow-x-auto">
        {stats?.visits?.visitsByDate?.map((item: any, index: number) => {
          // Calculate the height percentage
          const heightPercentage = (item.count / maxCount) * 100;
          return (
            <div
              key={index}
              className="min-w-12 h-full p-4 flex justify-end items-center flex-col"
            >
              <span style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                {item?.count}
              </span>
              <div
                className="bg-red-500 w-4 rounded-full"
                style={{ height: `${heightPercentage}%` }}
              ></div>
              <span
                style={{
                  fontSize: "10px",
                  whiteSpace: "nowrap",
                  color: "#b9b9b9",
                }}
              >
                {item?.date.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
