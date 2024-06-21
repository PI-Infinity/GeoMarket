import React from "react";
import Select from "react-select";
import { useApp } from "../context/app";

export default function SelectComponent({ data, value, setValue }: any) {
  const { activeLanguage } = useApp();

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Select
        options={data}
        className="w-full shadow-xl"
        defaultValue={value?.value === "" ? "" : value}
        onChange={setValue}
        placeholder={activeLanguage.category + "*"}
      />
    </div>
  );
}
