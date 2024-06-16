"use client";
import Image from "@/app/components/image";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useUserContext } from "@/app/context/user";
import { useUser } from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import nProgress from "nprogress";
import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { MdDiamond, MdStar } from "react-icons/md";

interface PropTypes {
  item: any;
}

const SellerItem: React.FC<PropTypes> = ({ item }) => {
  // current path name
  const pathname = usePathname();

  // router
  const router = useRouter();

  // auth user
  const { currentUser } = useAuth();

  // app context
  const { setLoading, apiUrl, activeLanguage } = useApp();

  // user state
  const { setUser } = useUserContext();

  // Function to format the rating
  const formatRating = (rating: any) => {
    if (rating < 1000) return rating;
    if (rating < 10000) return `${(rating / 1000).toFixed(0)}k`;
    if (rating < 1000000) return `${Math.floor(rating / 1000)}k`;
    return `${(rating / 1000000).toFixed(1)}m`;
  };

  /**
   * Save/unsave product
   */

  interface ActionsProps {
    saved: Boolean;
    rating: Boolean;
    fetched: Boolean;
  }

  return (
    <div
      className={`box-border rounded-xl bg-white laptop:p-4 flex flex-col justify-center shadow-md`}
    >
      <div className="flex mb-4 gap-4 w-full items-center p-4 laptop:p-0 pb-0">
        <div className="flex items-center gap-2 ml-auto">
          <MdDiamond
            size={24}
            className={`${
              item?.subscription?.type !== "Free"
                ? "text-orange-500"
                : "text-gray-400"
            } hover:brightness-90`}
          />
        </div>
      </div>
      <div className="relative w-full aspect-square bg-gray-300 laptop:rounded-xl hover:brightness-95 transition-all overflow-hidden">
        <Image
          alt={item?.name}
          onClick={() => {
            setLoading(true);
            router.push(`/user/${item?.userId}`);
            setUser(item);
            nProgress.start();
          }}
          src={item?.cover?.url}
          style={{
            aspectRatio: 1,
            cursor: "pointer",
            width: "100%",
            objectFit: "cover",
          }}
        />
        <img />
      </div>
      <div className="laptop:mt-4 flex items-center p-4 laptop:p-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold" style={{ whiteSpace: "nowrap" }}>
              {item.name}
            </h3>
          </div>
          <div className={`flex items-center gap-1 text-md`}>
            <MdStar color="orange" size={20} />
            {formatRating(item.rating || 0)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerItem;
