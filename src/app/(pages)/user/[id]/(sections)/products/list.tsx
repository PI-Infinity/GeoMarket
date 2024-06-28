"use client";
import Carousel from "@/app/advertisements/carousel";
import ProductItem from "@/app/components/product-item";
import { useApp } from "@/app/context/app";
import React from "react";

interface propsTypes {
  productsRef: any;
  products: any;
  loadingProducts: any;
  totalProducts: any;
}

const List: React.FC<propsTypes> = ({
  productsRef,
  products,
  loadingProducts,
  totalProducts,
}: any) => {
  return (
    <div
      className="flex-1 w-full h-full laptop:bg-white relative"
      ref={productsRef}
      style={{ minHeight: "100vh" }}
    >
      <div className="w-full p-2 mt-auto laptop:hidden">
        <Carousel />
      </div>
      {loadingProducts && (
        <div
          className="absolute w-full h-full overflow-hidden z-20 rounded-md"
          style={{
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
          }}
        />
      )}

      {totalProducts !== null && totalProducts < 1 && (
        <div className="text-gray-400 flex w-full items-center justify-center text-red-500 py-4">
          Not Found
        </div>
      )}
      <div className="grid laptop:grid-cols-4 gap-2 laptop:p-2 laptop:gap-4 pb-4 laptop:pb-0">
        {products &&
          products?.map((item: any) => (
            <ProductItem item={item} key={item.productId} from="user" />
          ))}
      </div>
    </div>
  );
};

export default List;
