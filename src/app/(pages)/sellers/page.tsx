"use client";
import Search from "@/app/components/search";
import { useApp } from "@/app/context/app";
import getUsers from "@/app/hooks/getUsers";
import { useEffect, useRef, useState } from "react";
import SellersList from "./sellers-list";
import Carousel from "@/app/advertisements/carousel";
import FilterItem from "@/app/components/filter-item";
import { useProductsContext } from "@/app/context/products";
import "../../globals.css";

export default function Sellers() {
  // app context
  const { isMobile, apiUrl } = useApp();

  // categories
  const { categories } = useProductsContext();

  // sellers
  const [sellers, setSellers] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalSellers, setTotalSellers] = useState(null);
  const [search, setSearch] = useState("");
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [category, setCategory] = useState("");

  const GetUsers = async () => {
    try {
      setLoadingSellers(true);
      const response = await getUsers({
        apiUrl,
        search,
        category,
        page,
        limit: 8,
        onlySellers: "true",
      });
      setSellers(response.data.users);
      setTotalSellers(response.totalUsers);
      setPage(1);
      setLoadingSellers(false);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    GetUsers();
  }, [apiUrl, search, category]);

  const AddSellers = async () => {
    const newPage = page + 1;
    try {
      const data = await getUsers({
        apiUrl,
        search,
        category,
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
          (p: any) => !existingIds.has(p.userId)
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
  const sellersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Ensure sellersRef.current is not null before accessing its properties
      if (sellersRef.current) {
        const { bottom } = sellersRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the bottom of the component is near the bottom of the window viewport
        if (bottom <= windowHeight + 200) {
          if (totalSellers && totalSellers > sellers.length) {
            AddSellers();
          }
        }
      }
    };

    // Register the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sellers.length, totalSellers, sellersRef]);

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
          <div className="flex-1 flex w-full h-full">
            <Carousel />
          </div>
          <div className="w-full flex">
            <Search
              search={search}
              setSearch={setSearch}
              disableSuggestions={true}
            />
          </div>
          <div className="w-full">
            <ul className="flex gap-2 overflow-x-auto max-w-screen py-2 laptop:py-2 scrollbar-hide">
              {categories.map((item: any, index: number) => (
                <FilterItem
                  key={index}
                  item={item}
                  category={category}
                  setCategory={setCategory}
                />
              ))}
            </ul>
          </div>
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none; /* IE and Edge */
              scrollbar-width: none; /* Firefox */
            }
          `}</style>
          <div
            ref={sellersRef}
            className={`flex-1 w-full rounded-md 
            text-black`}
          >
            <SellersList
              sellers={sellers}
              totalSellers={totalSellers}
              loadingSellers={loadingSellers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
