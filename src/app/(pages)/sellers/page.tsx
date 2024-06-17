"use client";
import Search from "@/app/components/search";
import { useApp } from "@/app/context/app";
import getUsers from "@/app/hooks/getUsers";
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
      const response = await getUsers({
        apiUrl,
        search,
        page,
        onlySellers: "true",
      });
      setSellers(response.data.users);
      setTotalSellers(response.totalUsers);
      setPage(1);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    GetUsers();
  }, [apiUrl, search]);

  return (
    <div
      className={`flex-1 flex items-start justify-between w-full ${
        isMobile ? "pr-0" : "pr-16"
      }`}
      style={{ transition: "ease-in 200ms" }}
    >
      <div className={`w-full h-full ml-0`}>
        <div
          className={`ml-0 mr-0 laptop:ml-0 laptop:pr-2
          h-full flex flex-col gap-2 items-center w-full`}
        >
          <div className="w-full flex">
            <Search search={search} setSearch={setSearch} />
          </div>
          <div
            ref={sellersRef}
            className={`flex-1 w-full rounded-md 
            text-black`}
          >
            <SellersList sellers={sellers} totalSellers={totalSellers} />
          </div>
        </div>
      </div>
    </div>
  );
}
