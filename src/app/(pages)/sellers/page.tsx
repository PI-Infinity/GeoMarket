"use client";
import Filter from "@/app/components/filter";
import ProductList from "@/app/components/product-list";
import Search from "@/app/components/search";
import { useApp } from "@/app/context/app";
import { useProductsContext } from "@/app/context/products";
import fetchRecommendedUsers from "@/app/hooks/getRecommendedUsers";
import { useEffect, useRef, useState } from "react";
import SellersList from "./sellers-list";

export default function Sellers() {
  // app context
  const { loading, isMobile, apiUrl } = useApp();

  // sellers
  const [sellers, setSellers] = useState<[]>([]);
  const [page, setPage] = useState(1);
  const [totalSellers, setTotalSellers] = useState(null);
  const [search, setSearch] = useState("");
  const sellersRef = useRef(null);

  const GetUsers = async () => {
    try {
      const response = await fetchRecommendedUsers({ apiUrl });
      setSellers(response.data.users);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    GetUsers();
  }, [apiUrl]);

  return (
    <div
      className={`flex-1 flex items-start justify-between w-full ${
        isMobile ? "pr-0" : "pr-4"
      }`}
      style={{ transition: "ease-in 200ms" }}
    >
      <div className={`w-full h-full ml-0`}>
        <div
          className={`ml-0 mr-0 laptop:ml-2 laptop:mr-14
          h-full flex flex-col gap-2 items-center`}
        >
          <div className="w-full flex">
            <Search search={search} setSearch={setSearch} />
          </div>
          <div
            ref={sellersRef}
            className={`flex-1 w-full rounded-md laptop:shadow-sm
            text-black`}
          >
            <SellersList sellers={sellers} totalSellers={totalSellers} />
          </div>
        </div>
      </div>
    </div>
  );
}
