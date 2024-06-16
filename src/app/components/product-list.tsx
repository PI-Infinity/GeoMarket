"use client";
import React from "react";
import { useProductsContext } from "../context/products";
import ProductItem from "./product-item";
import { useApp } from "../context/app";

const ProductList: React.FC = () => {
  // products
  const { products, totalProducts } = useProductsContext();

  return (
    <div className={`h-full rounded-xl`}>
      {totalProducts !== null && totalProducts < 1 && (
        <div className="text-gray-400 flex w-full items-center justify-center text-red-500 pt-4">
          Not Found
        </div>
      )}
      <div
        className={`grid grid-cols-1 p-0 laptop:grid-cols-4 gap-2 z-10 pb-4 rounded-md`}
      >
        {products &&
          products?.map((item: any) => (
            <ProductItem item={item} key={item.productId} />
          ))}
      </div>
    </div>
  );
};

export default ProductList;
