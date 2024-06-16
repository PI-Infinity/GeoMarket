"use client";
import Image from "@/app/components/image";
import SelectComponent from "@/app/components/select";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { MdDiamond, MdStar } from "react-icons/md";

// Define the subscription interface
interface Subscription {
  subscriptionId: string;
  title: string;
  // other subscription fields
}

const Page = () => {
  // app context
  const { apiUrl } = useApp();
  // auth state
  const { currentUser } = useAuth();
  // get invoices
  const [subscriptions, setsubscriptions] = useState<Subscription[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const [page, setPage] = useState(1);
  const [totalSubscriptions, setTotalSubscriptions] = useState(null);

  const GetSubscriptions = async () => {
    try {
      setLoadingSubscriptions(true);
      const list = await axios.get(
        apiUrl + `/api/v1/subscriptions?page=1&limit=3`
      );
      setsubscriptions(list.data.data.subscriptions);
      setPage(1);
      setTotalSubscriptions(list.data.totalSubscriptions);
      setLoadingSubscriptions(false);
    } catch (error: any) {}
  };

  useEffect(() => {
    if (apiUrl) {
      GetSubscriptions();
    }
  }, [currentUser]);

  const AddSubscriptions = async () => {
    const newPage = page + 1;
    try {
      const response = await axios.get(
        apiUrl + `/api/v1/subscriptions?page=${newPage}&limit=3`
      );
      setTotalSubscriptions(response.data.totalSubscriptions);

      setsubscriptions((prevsubscriptions) => {
        // Create a new set with existing subscription IDs for quick lookup
        const existingIds = new Set(
          prevsubscriptions.map((subscription) => subscription.subscriptionId)
        );

        // Filter out duplicates from the newly fetched subscriptions based on subscription ID
        const filteredNewsubscriptions =
          response.data.data.subscriptions.filter(
            (p: any) => !existingIds.has(p.subscriptionId)
          );

        if (filteredNewsubscriptions?.length > 0) {
          return [...prevsubscriptions, ...filteredNewsubscriptions];
        } else {
          return [...prevsubscriptions];
        }
      });

      setPage(newPage);
    } catch (error) {
      console.log(error);
    }
  };

  const subscriptionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Ensure subscriptionsRef.current is not null before accessing its properties
      if (subscriptionsRef.current) {
        const { bottom } = subscriptionsRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the bottom of the component is near the bottom of the window viewport
        if (bottom <= windowHeight + 200) {
          if (
            totalSubscriptions &&
            totalSubscriptions > subscriptions?.length
          ) {
            // setLoadMore(true);
            AddSubscriptions();
          }
        }
      }
    };

    // Register the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [subscriptions?.length, totalSubscriptions, subscriptionsRef]);

  // format order date to display format
  const DefineDate = (dateValue: any) => {
    const date = new Date(dateValue);

    // Example format: "February 25, 2024, 16:35"
    // Adjust the format according to your needs
    const formattedDate = date.toLocaleString("en-US", {
      month: "short", // "February"
      day: "2-digit", // "25"
      year: "numeric", // "2024"
      hour: "2-digit", // "16"
      minute: "2-digit", // "35"
      hour12: false,
    });
    return formattedDate;
  };

  // Function to format the rating
  const formatRating = (rating: any) => {
    if (rating < 1000) return rating;
    if (rating < 10000) return `${(rating / 1000).toFixed(0)}k`;
    if (rating < 1000000) return `${Math.floor(rating / 1000)}k`;
    return `${(rating / 1000000).toFixed(1)}m`;
  };

  /**
   * changing subscription status
   */
  const [changeStatus, setChangeStatus] = useState({ value: "" });

  return (
    <div className="bg-white h-full w-full rounded-xl shadow-sm flex gap-2">
      <div
        className="flex-1 p-2 flex flex-col gap-2 w-full"
        ref={subscriptionsRef}
      >
        {subscriptions?.map((item: any, index: number) => {
          return (
            <div
              key={index}
              className="p-4 border-[1px] border-gray-200 rounded-xl shadow-md flex flex-col gap-2 relative"
            >
              <div className="absolute right-4 top-4 flex flex-col items-end gap-4">
                <MdDiamond
                  size={28}
                  className={`${
                    item?.status === "active"
                      ? "text-orange-500"
                      : item?.status === "canceled"
                      ? "text-red-500"
                      : "text-gray-300"
                  } cursor-pointer hover:brightness-90 `}
                />
                <Link
                  href={`/user/${item?.user?.userId}/products`}
                  style={{ width: "30px", height: "30px" }}
                  className=" bg-gray-300 rounded-full overflow-hidden flex items-center justify-center relative cursor-pointer hover:brightness-95"
                >
                  <Image
                    alt={item?.user?.name}
                    src={item?.user?.cover?.url}
                    style={{
                      aspectRatio: 1,
                      zIndex: 0,
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Link>
                <Link href={`/user/${item?.user?.userId}/products`}>
                  <h4>{item?.user?.name}</h4>
                </Link>
                <div className="flex items-center gap-1">
                  <MdStar color="orange" />
                  {formatRating(item?.user?.rating)}
                </div>
                <SelectComponent
                  data={[
                    { value: "active", label: "Active" },
                    { value: "canceled", label: "Canceled" },
                    { value: "expired", label: "Expired" },
                  ]}
                  value={changeStatus}
                  setValue={setChangeStatus}
                />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full"
                  style={{
                    background:
                      item?.status === "active"
                        ? "green"
                        : item?.status === "canceled"
                        ? "red"
                        : "gray",
                  }}
                />
                <h4 className="text-sm">Status: </h4>
                <span className="text-sm">
                  {item?.status.charAt(0).toUpperCase() + item?.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm">Type: </h4>
                <span className="text-sm">
                  {item?.type} /{" "}
                  {item?.time.charAt(0).toUpperCase() + item?.time.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm">Price: </h4>
                <span className="text-sm">{item?.price}₾</span>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-sm">Options: </h4>
                <span className="ml-4 text-sm">
                  Unclocked products:{" "}
                  <span className="font-semibold">
                    {item?.options.products === 100000
                      ? "Unlimited"
                      : item?.options.products}
                  </span>
                </span>
                <span className="ml-4 text-sm">
                  Top Level Sorting:{" "}
                  <span className="font-semibold text-sm">
                    {item?.options.topLevelSorting ? "True" : "False"}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm">Activate Date: </h4>
                <span className="text-sm">
                  {DefineDate(item?.activationDate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm">Expire Date: </h4>
                <span className="text-sm">{DefineDate(item?.expireDate)}</span>
              </div>
              {item.cancelDate && (
                <div className="flex items-center gap-2">
                  <h4 className="text-sm">Cancel Date: </h4>
                  <span className="text-sm">
                    {DefineDate(item?.cancelDate)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="w-96 flex">Add Subscription:</div>
    </div>
  );
};

export default Page;
