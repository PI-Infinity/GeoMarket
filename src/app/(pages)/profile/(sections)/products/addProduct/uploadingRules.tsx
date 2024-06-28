"use client";
import { useApp } from "@/app/context/app";
import { useState } from "react";
import { MdClose, MdDone } from "react-icons/md";

const UploadingRules = ({ rejectReasons }: any) => {
  const { productUploadingRules } = useApp();
  return (
    <div className="w-full text-black flex flex-col justify-center items-center">
      <div className="my-2 flex flex-col gap-4 shadow-md px-2 py-4 rounded-xl">
        {productUploadingRules?.map((item: any, index: number) => {
          return (
            <div className="pl-4" key={index}>
              <div className="pl-2">
                <h4 className="flex items-center gap-1">
                  {rejectReasons?.find((i: any) => i === item?.value) ? (
                    <MdClose color="red" size={18} />
                  ) : (
                    <MdDone color="green" size={18} />
                  )}
                  {item?.title}
                </h4>
                <p className="ml-2 text-md">{item?.description}</p>
              </div>
            </div>
          );
        })}
        {rejectReasons?.find(
          (it: any) => !productUploadingRules?.some((i: any) => i.value === it)
        ) && (
          <div className="pl-4">
            <div className="pl-2">
              <h4 className="flex items-center gap-1">
                <MdClose color="red" size={18} />
                {rejectReasons?.find((it: any) =>
                  productUploadingRules?.some((i: any) => i.value !== it)
                )}
              </h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadingRules;
