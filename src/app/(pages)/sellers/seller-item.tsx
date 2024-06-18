"use client";
import Image from "@/app/components/image";
import { useProductsContext } from "@/app/context/products";
import { useUserContext } from "@/app/context/user";
import { useRouter } from "next/navigation";
import React from "react";
import { CgProductHunt } from "react-icons/cg";
import { FaUsers } from "react-icons/fa";
import { MdDiamond, MdStar } from "react-icons/md";

interface PropTypes {
  item: any;
}

const SellerItem: React.FC<PropTypes> = ({ item }) => {
  // router
  const router = useRouter();

  // user state
  const { setUser } = useUserContext();

  // products context
  const { categories } = useProductsContext();

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
      <div className="flex gap-4 w-full items-center px-2 py-4 pb-2">
        <h3 className="text-md font-bold" style={{ whiteSpace: "nowrap" }}>
          {item.name}
        </h3>
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
            router.push(`/user/${item?.userId}`);
            setUser(item);
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
      <div className="laptop:mt-4 flex items-center p-4 laptop:p-0 w-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h4 className="text-black font-semibold">
              {categories?.find((i: any) => i.value === item?.category)?.label}
            </h4>
          </div>
          <div className="flex items-center gap-3 shadow-md rounded-full py-1 px-3">
            <div className={`flex items-center text-md gap-1`}>
              <CgProductHunt size={23} />
              {item?.productsLength}
            </div>
            <div className={`flex items-center gap-1 text-md`}>
              <MdStar color="orange" size={23} />
              {formatRating(item.rating || 0)}
            </div>
            <div className={`flex items-center text-md gap-1`}>
              <FaUsers size={22} />
              {item?.productsLength}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerItem;
