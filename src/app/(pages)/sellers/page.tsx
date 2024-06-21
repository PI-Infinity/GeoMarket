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
  const [sellers, setSellers] = useState<any>([]);
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
        limit: 8,
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

  const AddSellers = async () => {
    const newPage = page + 1;
    try {
      const data = await getUsers({
        apiUrl,
        search,
        page: newPage,
        limit: 8,
        onlySellers: "true",
      });
      setTotalSellers(data.totalUsers);
      setSellers((prevSellers: any) => {
        // Create a new set with existing sellers IDs for quick lookup
        const existingIds = new Set(
          prevSellers.map((seller: any) => seller.userId)
        );

        // Filter out duplicates from the newly fetched sellerss based on sellers ID
        const filteredNewsellerss = data.data.users.filter(
          (p: any) => !existingIds.has(p.sellersId)
        );

        if (filteredNewsellerss.length > 0) {
          return [...prevSellers, ...filteredNewsellerss];
        } else {
          return [...prevSellers];
        }
      });

      setPage(newPage);
    } catch (error) {
      console.log(error);
    }
  };

  // products ref
  const productsRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const handleScroll = () => {
      // Ensure productsRef.current is not null before accessing its properties
      if (productsRef.current) {
        const { bottom } = productsRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the bottom of the component is near the bottom of the window viewport
        if (bottom <= windowHeight + 200) {
          if (totalSellers && totalSellers > sellers.length) {
            // setLoadMore(true);
            AddSellers();
          }
        }
      }
    };

    // Register the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sellers.length, totalSellers, productsRef]);

  return (
    <div
      className={`flex items-start justify-between w-full laptop:w-3/4 ${
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
            <Search
              search={search}
              setSearch={setSearch}
              disableSuggestions={true}
            />
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
