import React from "react";
import { useProductsContext } from "../context/products";

interface propsTypes {
  item: any;
}

const FilterItem: React.FC<propsTypes> = ({ item }) => {
  // products context
  const { category, setCategory } = useProductsContext();
  return (
    <div
      onClick={() => setCategory(item.value)}
      className={`flex items-center bg-gray-50 text-black font-semibold p-0 cursor-pointer shadow-sm rounded-xl px-2 ${
        item.value === category ? "bg-red-500 text-white" : "text-black"
      }`}
    >
      {/* <div
        className={`w-4 h-4 rounded-full rotate-45 ml-4 bg-${
          item.value === category ? "red" : "inherit"
      /> */}

      <div
        className={`p-2 rounded-xl h-10 w-full text-center whitespace-nowrap laptop:text-start laptop:pl-8 `}
      >
        {item.label}
      </div>
    </div>
  );
};

export default FilterItem;
