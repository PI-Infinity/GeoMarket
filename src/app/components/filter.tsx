"use client";
import { useApp } from "@/app/context/app";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import React, { useState } from "react";
import { AiOutlinePercentage } from "react-icons/ai";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdClose,
  MdDone,
} from "react-icons/md";
import { useProductsContext } from "../context/products";
import FilterItem from "./filter-item";
import { Input } from "./input";
import { Category } from "@mui/icons-material";

const Filter: React.FC = () => {
  //app context
  const { activeLanguage } = useApp();

  // products context
  const {
    categories,
    setPrice,
    price,
    byOrder,
    setByOrder,
    sales,
    setSales,
    sort,
    setSort,
    category,
    setCategory,
  } = useProductsContext();

  // price range
  const defaultPrices = [0, 100000];
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);

  const AcceptRange = () => {
    setPrice([minPrice > 0 ? minPrice : 0, maxPrice > 0 ? maxPrice : 100000]);
  };

  // open/hide filter
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <div
      style={{ maxHeight: "70vh" }}
      className="laptop:p-4 flex flex-col laptop:gap-4 w-full laptop:w-80 laptop:overflow-y-auto"
    >
      <ul className="flex laptop:flex-col gap-2 overflow-x-auto max-w-screen py-2 laptop:py-0">
        {categories.map((item: any, index: number) => (
          <FilterItem
            key={index}
            item={item}
            category={category}
            setCategory={setCategory}
          />
        ))}
      </ul>
      <div className="flex flex-col gap-2 w-full pl-2 laptop:pl-0 laptop:mt-2">
        <div className="text-gray-400 text-sm flex laptop:flex-col items-center laptop:items-start gap-1 laptop:gap-4 mt-1 cursor-pointer">
          <div
            className={` items-center gap-1 inline-block relative mt-1 py-1 px-3 rounded-full shadow-sm  ${
              sales ? "bg-red-500 text-white" : "text-gray-400 bg-white"
            } cursor-pointer`}
            onClick={() => setSales((prev: any) => !prev)}
          >
            <div
              className="flex items-center gap-1 text-sm"
              style={{ fontWeight: 500 }}
            >
              <AiOutlinePercentage />

              {activeLanguage?.sales}
            </div>
          </div>
          <div className="flex items-center w-full">
            <div
              className="inline-block"
              onClick={() => setOpenFilter((prev: boolean) => !prev)}
            >
              {openFilter ? (
                <MdArrowDropDown size={20} color="red" />
              ) : (
                <MdArrowDropUp size={20} color="red" />
              )}
            </div>
            <span
              className="text-sm mr-2"
              onClick={() => setOpenFilter((prev: boolean) => !prev)}
            >
              {activeLanguage?.filter}
            </span>
            {(category !== "" ||
              price[0] !== 0 ||
              price[1] !== 100000 ||
              !byOrder ||
              sales ||
              sort !== "random") && (
              <div
                className="ml-auto mr-4"
                onClick={() => {
                  setCategory("");
                  setPrice([0, 100000]);
                  setByOrder(true);
                  setSales(false);
                  setSort("random");
                  setOpenFilter(false);
                }}
              >
                <MdClose
                  color="red"
                  size={28}
                  className="cursor-pointer hover:brightness-90"
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={`transition-transform transform duration-300 ease-in-out  ${
            openFilter
              ? "scale-100 opacity-100 p-2"
              : "scale-90 opacity-0 h-0 absolute -z-10"
          }`}
          style={{ boxSizing: "border-box", width: "100%" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              right: "4px",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                color: "green",
                position: "relative",
                bottom: "2px",
              }}
            >
              {"₾"}
            </span>
            <Typography
              variant="body2"
              sx={{
                marginBottom: "4px",
                fontSize: "16px",
                fontWeight: "600",
                letterSpacing: "0.5px",
                color: "#222",
              }}
            >
              {activeLanguage.priceRange}
            </Typography>
          </div>

          <div className="w-full flex laptop:flex-col items-center laptop:items-start justify-center gap-2 mt-2 ">
            <div className="flex items-center w-full gap-2">
              <Input
                label="Min"
                value={minPrice}
                type="number"
                padding="py-2 p-3"
                onChange={(e: any) => setMinPrice(e.target.value)}
                disabled={
                  JSON.stringify(defaultPrices) !== JSON.stringify(price)
                }
              />

              <Input
                label="Max"
                value={maxPrice}
                type="number"
                padding="py-2 px-3"
                onChange={(e: any) => setMaxPrice(e.target.value)}
                disabled={
                  JSON.stringify(defaultPrices) !== JSON.stringify(price)
                }
              />
              {JSON.stringify(defaultPrices) !== JSON.stringify(price) ? (
                <div
                  onClick={() => {
                    setPrice([0, 100000]);
                    setMinPrice(0);
                    setMaxPrice(100000);
                  }}
                  style={{
                    cursor:
                      minPrice > 0 || maxPrice < 100000 ? "pointer" : "default",
                  }}
                  className={`hover:brightness-95 bg-white h-10 aspect-square flex items-center justify-center shadow-md rounded-xl`}
                >
                  <MdClose size={24} color="red" />
                </div>
              ) : (
                <div
                  onClick={AcceptRange}
                  style={{
                    cursor:
                      minPrice > 0 || maxPrice < 100000 ? "pointer" : "default",
                  }}
                  className={`${
                    minPrice > 0 && "hover:brightness-95"
                  } bg-white h-10 aspect-square flex items-center justify-center shadow-md rounded-xl`}
                >
                  <MdDone
                    size={24}
                    color={
                      minPrice > 0 || maxPrice < 100000 ? "green" : "#e5e5e5"
                    }
                  />
                </div>
              )}
            </div>

            <FormControlLabel
              style={{ position: "relative", left: "8px" }}
              control={
                <Checkbox
                  checked={byOrder}
                  onChange={() => setByOrder((prev: any) => !prev)}
                  inputProps={{ "aria-label": "By Order" }}
                  sx={{
                    color: "red",
                    "&.Mui-checked": {
                      color: "red",
                    },
                    "& .MuiSvgIcon-root": {
                      fill: "red",
                    },
                  }}
                />
              }
              label={activeLanguage?.byOrder}
              sx={{
                "& .MuiFormControlLabel-label": {
                  whiteSpace: "nowrap",
                  color: "#b9b9b9",
                  fontSize: "14px",
                  fontWeight: "500",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
