"use client";
import React from "react";
import { MoonLoader } from "react-spinners";
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
  } = useProductsContext();

  return (
    <div className={`h-full rounded-xl`}>
      <div className="flex desktop:hidden w-full h-8 justify-between items-center px-2">
        <div className="text-sm flex items-center gap-1 mb-2">
          Total: ({totalProducts || 0})
        </div>
        <div className="text-sm flex items-center gap-1 mb-2">
          View:
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
          Not Found
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
