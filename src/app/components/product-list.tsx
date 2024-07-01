"use client";
import React, { useState } from "react";
import { LiaSortSolid } from "react-icons/lia";
import { MoonLoader } from "react-spinners";
import { useApp } from "../context/app";
import { useProductsContext } from "../context/products";
import ProductItem from "./product-item";

const ProductList: React.FC = () => {
  // products
  const {
    products,
    totalProducts,
    activeGrid,
    setActiveGrid,
    loadingProducts,
    sort,
    setSort,
  } = useProductsContext();

  // app context
  const { activeLanguage } = useApp();

  // open sort
  const [openSortList, setOpenSortList] = useState(false);

  return (
    <div className={`h-full rounded-xl`}>
      <div className="flex w-full h-8 justify-between items-center px-2 mb-2 relative">
        <div className="text-sm flex items-center gap-1  w-1/3">
          {activeLanguage?.total}:{" "}
          <span className="" style={{ fontSize: "14px" }}>
            ({totalProducts || 0})
          </span>
        </div>
        <div className="w-1/3 flex justify-center items-center text-gray-400">
          <LiaSortSolid
            size={16}
            color={sort !== "random" ? "red" : "inherit"}
            className="cursor-pointer hover:brightness-95"
            onClick={() => setOpenSortList((prev: any) => !prev)}
          />

          <div
            style={{
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
            }}
            className={`absolute top-8 z-10 flex flex-col items-center gap-1 rounded-xl shadow-md p-2 w-40 transition-transform transform duration-200 ease-in-out  ${
              openSortList
                ? "scale-100 opacity-100 p-2"
                : "scale-50 opacity-0 h-0 absolute -z-10"
            }`}
          >
            <div
              className="w-full text-center text-sm py-1 px-3 rounded-full bg-gray-50 shadow-md cursor-pointer hover:brightness-95"
              style={{ color: sort === "random" ? "red" : "inherit" }}
              onClick={() => {
                setOpenSortList(false);
                setSort("random");
              }}
            >
              {activeLanguage?.random}
            </div>
            <div
              className="w-full text-center text-sm py-1 px-3 rounded-full bg-gray-50 shadow-md cursor-pointer hover:brightness-95"
              style={{ color: sort === "rating" ? "red" : "inherit" }}
              onClick={() => {
                setOpenSortList(false);
                setSort("rating");
              }}
            >
              {activeLanguage?.rating}
            </div>
            <div
              className="w-full text-center text-sm py-1 px-3 rounded-full bg-gray-50 shadow-md cursor-pointer hover:brightness-95"
              style={{ color: sort === "date" ? "red" : "inherit" }}
              onClick={() => {
                setOpenSortList(false);
                setSort("date");
              }}
            >
              {activeLanguage?.date}
            </div>
            {/* <div
                className="w-full text-center text-sm py-1 px-3 rounded-full bg-gray-50 shadow-md cursor-pointer hover:brightness-95"
                style={{ color: sort === "highPrice" ? "red" : "inherit" }}
                onClick={() => {
                  setOpenSortList(false);
                  setSort("highPrice");
                }}
              >
                High Price
              </div>
              <div
                className="w-full text-center text-sm py-1 px-3 rounded-full bg-gray-50 shadow-md cursor-pointer hover:brightness-95"
                style={{ color: sort === "lowPrice" ? "red" : "inherit" }}
                onClick={() => {
                  setOpenSortList(false);
                  setSort("lowPrice");
                }}
              >
                Low Price
              </div> */}
          </div>
        </div>
        <div className="text-sm flex items-center justify-end gap-1  w-1/3">
          {/* {activeLanguage?.view}: */}
          <div className="flex items-center gap-2 ml-2">
            <div className="flex items-center gap-0.5">
              <div
                className="h-4 w-2 rounded-sm"
                onClick={() => setActiveGrid("double")}
                style={{
                  border:
                    activeGrid === "double"
                      ? "1.3px solid red"
                      : "1.3px solid gray",
                  background: activeGrid === "double" ? "red" : "none",
                }}
              />
              <div
                className="h-4 w-2 rounded-sm"
                onClick={() => setActiveGrid("double")}
                style={{
                  border:
                    activeGrid === "double"
                      ? "1.3px solid red"
                      : "1.3px solid gray",
                  background: activeGrid === "double" ? "red" : "none",
                }}
              />
            </div>
            <div
              className="h-4 w-4 rounded-sm"
              onClick={() => setActiveGrid("single")}
              style={{
                border:
                  activeGrid === "single"
                    ? "1.3px solid red"
                    : "1.3px solid gray",
                background: activeGrid === "single" ? "red" : "none",
              }}
            />
          </div>
        </div>
      </div>
      {totalProducts !== null && totalProducts < 1 && !loadingProducts && (
        <div className="text-gray-400 flex w-full items-center justify-center text-red-500 pt-4">
          {activeLanguage?.notFound}
        </div>
      )}
      {loadingProducts && (
        <div className="w-full flex items-center justify-center h-56">
          <MoonLoader size={40} color="red" />
        </div>
      )}
      <div
        className={`grid ${
          activeGrid === "single" ? "grid-cols-1" : "grid-cols-2"
        } p-0 laptop:grid-cols-4 gap-2 z-10 pb-4 rounded-md`}
      >
        {!loadingProducts &&
          products &&
          products?.map((item: any) => (
            <ProductItem
              item={item}
              key={item.productId}
              activeGrid={activeGrid}
            />
          ))}
      </div>
    </div>
  );
};

export default ProductList;
