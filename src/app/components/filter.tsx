"use client";
import { useApp } from "@/app/context/app";
import { Typography } from "@mui/material";
import React, { useState } from "react";
import { MdDone } from "react-icons/md";
import { useProductsContext } from "../context/products";
import FilterItem from "./filter-item";
import { Input } from "./input";

const Filter: React.FC = () => {
  //app context
  const { activeLanguage } = useApp();

  // products context
  const { categories, setPrice } = useProductsContext();

  // price range
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);

  const AcceptRange = () => {
    setPrice([minPrice > 0 ? minPrice : 0, maxPrice > 0 ? maxPrice : 100000]);
  };
  return (
    <div className="laptop:p-4 flex flex-col gap-8 w-full laptop:w-80">
      <ul className="flex flex-col gap-2">
        {categories.map((item: any, index: number) => (
          <FilterItem key={index} item={item} />
        ))}
      </ul>
      <ul className="hidden laptop:flex flex-col gap-2 w-full">
        <div style={{ boxSizing: "border-box", padding: "4px", width: "100%" }}>
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

          <div className="w-full flex items-center justify-center gap-2 mt-2 ">
            <Input
              label="Min"
              value={minPrice}
              type="text"
              onChange={(e: any) => setMinPrice(e.target.value)}
            />

            <Input
              label="Max"
              value={maxPrice}
              type="text"
              onChange={(e: any) => setMaxPrice(e.target.value)}
            />
            <div
              onClick={AcceptRange}
              style={{
                cursor: minPrice > 0 ? "pointer" : "default",
              }}
              className="h-11 aspect-square flex items-center justify-center"
            >
              <MdDone size={24} color={minPrice > 0 ? "green" : "gray"} />
            </div>
          </div>
        </div>
      </ul>
    </div>
  );
};

export default Filter;
