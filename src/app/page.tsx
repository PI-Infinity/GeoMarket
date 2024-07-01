"use client";
import Filter from "@/app/components/filter";
import ProductList from "@/app/components/product-list";
import Search from "@/app/components/search";
import { useEffect } from "react";
import Carousel from "./advertisements/carousel";
import { useApp } from "./context/app";
import { useProductsContext } from "./context/products";

export default function Index() {
  // app context
  const { isMobile } = useApp();
  // products context
  const { search, setSearch, productsRef, setScrollY } = useProductsContext();

  // clean scrollY
  useEffect(() => {
    setScrollY(false);
  }, []);

  const files = [
    {
      fileId: "",
      path: "/chat",
      url: "/artist.jpg",
      title: "file 1",
    },
    {
      fileId: "",
      path: "/chat",
      url: "/market2.jpg",
      title: "file 2",
    },
    {
      fileId: "",
      path: "/chat",
      url: "/handmade.jpg",
      title: "file 2",
    },
    {
      fileId: "",
      path: "/chat",
      url: "/items.jpg",
      title: "file 3",
    },
    {
      fileId: "",
      path: "/chat",
      url: "/market.jpg",
      title: "file 3",
    },
  ];

  return (
    <div
      className={`flex-1 flex items-start flex-col laptop:flex-row justify-between w-full ${
        isMobile ? "pr-0" : "pr-4"
      }`}
      style={{ transition: "ease-in 200ms" }}
    >
      {/* <div
        className="w-full mb-4 laptop:hidden flex overflow-x-scroll relative"
        style={{
          minHeight: "500px",
          overflowY: "hidden",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch", // Enables momentum scrolling on iOS Safari
        }}
      >
        {files?.map((file: any, index: number) => (
          <div
            // href={`/${file.path}`}
            style={{
              height: "100%",
              minWidth: "100%",
              scrollSnapAlign: "center",
              overflow: "hidden",
            }}
            key={index}
            className="relative bg-gray-300 hover:brightness-95 transition-all overflow-hidden flex items-center"
          >
            <Image
              alt={file?.title}
              src={file?.url}
              style={{
                cursor: "pointer",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div> */}

      <div className="flex-1 flex w-full h-full laptop:hidden pb-2">
        <Carousel />
      </div>
      {!isMobile && (
        <div
          className={`w-80 bg-white rounded-xl h-full shadow-sm fixed min-h-[calc(100%-8.5rem)]`}
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
          <div className="hidden flex-1 laptop:flex items-center gap-2 w-full h-full">
            <Carousel />
          </div>
          <div className="w-full flex mt-2 laptop:mt-0">
            <Search search={search} setSearch={setSearch} />
          </div>
          <div
            ref={productsRef}
            className={`flex-1 w-full rounded-md 
            text-black mt-2 laptop:mt-0`}
          >
            <ProductList />
          </div>
        </div>
      </div>
    </div>
  );
}
