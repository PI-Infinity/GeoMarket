import React from "react";
import { useProductsContext } from "../context/products";

interface propsTypes {
  item: any;
}

const FilterItem: React.FC<propsTypes> = ({ item }) => {
  // products context
  const { category, setCategory } = useProductsContext();
  return (
    <li
      onClick={() => setCategory(item.value)}
      className={`${
        item.value === category ? "bg-red-500 text-white" : "inherit"
      } min-w-32 overflow-hidden flex items-center bg-gray-50 text-black font-semibold p-0 cursor-pointer shadow-sm  rounded-xl`}
    >
      {/* <div
        className={`w-4 h-4 rounded-full rotate-45 ml-4 bg-${
          item.value === category ? "red" : "inherit"
        }-500`}
      /> */}
      <div
        className={` p-2  h-10 w-full text-center laptop:text-start laptop:pl-8`}
      >
        {item.label}
      </div>
    </li>
  );
};

export default FilterItem;
