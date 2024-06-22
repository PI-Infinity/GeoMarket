"use client";
import Image from "@/app/components/image";
import SelectComponent from "@/app/components/select";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { MdDiamond, MdStar } from "react-icons/md";
import Item from "./item";

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

  return (
    <div className="bg-white h-full w-full rounded-xl shadow-sm flex gap-2">
      <div
        className="flex-1 p-2 flex flex-col gap-2 w-full"
        ref={subscriptionsRef}
      >
        {subscriptions?.map((item: any, index: number) => {
          return <Item key={index} item={item} />;
        })}
      </div>
      <div className="w-96 hidden laptop:flex">Add Subscription:</div>
    </div>
  );
};

export default Page;
