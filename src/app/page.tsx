"use client";
import Filter from "@/app/components/filter";
import ProductList from "@/app/components/product-list";
import Search from "@/app/components/search";
import { useEffect } from "react";
import { useProductsContext } from "./context/products";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useApp } from "./context/app";

export default function Index() {
  // app context
  const { loading, isMobile } = useApp();
  // products context
  const { search, setSearch, productsRef, setScrollY } = useProductsContext();

  // clean scrollY
  useEffect(() => {
    setScrollY(false);
  }, []);

  return (
    <div
      className={`flex-1 flex items-start justify-between w-full ${
        isMobile ? "pr-0" : "pr-4"
      }`}
      style={{ opacity: loading ? "0" : "1", transition: "ease-in 200ms" }}
    >
      {!isMobile && (
        <div
          className={`w-80 bg-white rounded-xl h-full shadow-sm fixed h-[calc(100%-8.5rem)]`}
        >
          <Filter />
        </div>
      )}
      <div className={`w-full h-full ml-0 laptop:ml-80`}>
        <div
          className={`ml-0 mr-0 laptop:ml-2 laptop:mr-14
          h-full flex flex-col gap-2 items-center`}
        >
          <div className="w-full laptop:hidden">
            <Filter />
          </div>
          <div className="w-full flex">
            <Search search={search} setSearch={setSearch} />
          </div>
          <div
            ref={productsRef}
            className={`flex-1 w-full rounded-md laptop:shadow-sm
            text-black`}
          >
            <ProductList />
          </div>
        </div>
      </div>
    </div>
  );
}
