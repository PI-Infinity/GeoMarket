"use client";
import React from "react";
import UploadingRules from "../../profile/(sections)/products/addProduct/uploadingRules";
import { useApp } from "@/app/context/app";

const Page = () => {
  const { activeLanguage } = useApp();
  return (
    <div className="w-full flex flex-col items-center justify-center mt-4">
      <h3 className="text-black">{activeLanguage?.productUploadingRules}:</h3>
      <UploadingRules />;
    </div>
  );
};

export default Page;
