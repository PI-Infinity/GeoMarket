"use client";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useProductsContext } from "@/app/context/products";
import { useProfileContext } from "@/app/context/profile";
import { FormControlLabel, Switch } from "@mui/material";
import Image from "@/app/components/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { MdDateRange, MdDelete, MdStar } from "react-icons/md";
import { FormatDate } from "@/app/utils/formatDate";
import Button from "@/app/components/button";

interface PropTypes {
  item: any;
  setConfirmPopup?: any;
  DeleteProduct?: any;
  Confirm?: any;
  Reject?: any;
  actionLoading?: any;
}

const ProductItem: React.FC<PropTypes> = ({
  item,
  setConfirmPopup,
  DeleteProduct,
  Confirm,
  Reject,
  actionLoading,
}) => {
  // router
  const router = useRouter();

  // auth state
  const { currentUser } = useAuth();

  // app context
  const { activeLanguage } = useApp();

  // categories
  const { categories } = useProductsContext();

  // user total of products
  const { totalProducts } = useProfileContext();

  // Function to format the rating
  const formatRating = (rating: any) => {
    if (rating < 1000) return rating;
    if (rating < 10000) return `${(rating / 1000).toFixed(0)}k`;
    if (rating < 1000000) return `${Math.floor(rating / 1000)}k`;
    return `${(rating / 1000000).toFixed(1)}m`;
  };

  // get cover
  const cover = item.gallery?.findIndex((i: any) => i.cover);

  // active image
  const [active, setActive] = useState(cover);

  /**
   * define user subscription config
   * if use can to add more product than he can with his sunscription
   */
  const DefineAccess = () => {
    let access;
    if (currentUser?.subscription?.status === "active") {
      if (totalProducts < currentUser?.subscription?.options?.products) {
        access = true;
      } else {
        access = false;
      }
    }
    return access;
  };

  return (
    <div
      style={{
        filter: item.status === "public" ? "brightness(1)" : "brightness(0.95)",
      }}
      className="box-border rounded-xl bg-gray-50 p-4 flex flex-col justify-center cursor-pointer shadow-md max-w-80"
    >
      <p className="text-xl font-bold">Status: {item?.status}</p>
      <div className="flex mb-2 mt-2 gap-4 w-full items-center justify-between">
        <div className="flex items-center gap-1 text-md">
          {FormatDate(item.createdAt)}
        </div>
      </div>
      {item?.status === "inReview" && (
        <div className="mb-4 flex items-center gap-4">
          <div className="w-full h-10">
            <Button
              title="Reject"
              background="red"
              color="white"
              onClick={() => Reject(item.productId)}
              loading={actionLoading.active && actionLoading.type === "reject"}
            />
          </div>
          <div className="w-full h-10" onClick={() => Confirm(item.productId)}>
            <Button
              title="Confirm"
              background="green"
              color="white"
              onClick={() => Confirm(item.productId)}
              loading={actionLoading.active && actionLoading.type === "confirm"}
            />
          </div>
        </div>
      )}
      <div className="mb-2 flex items-center">
        <div
          className="flex items-center gap-2"
          onClick={() => {
            router.push(`/user/${item?.seller?.userId}/products`);
          }}
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
            {item?.seller?.cover?.url?.length > 0 && (
              <Image
                alt={item?.seller?.name}
                src={item?.seller?.cover?.url}
                style={{
                  aspectRatio: 1,
                  cursor: "pointer",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
          <h4>{item?.seller?.name}</h4>
        </div>
      </div>
      <div className="hover:brightness-95 relative w-full aspect-square bg-gray-200 rounded-xl overflow-hidden">
        <Image
          alt={item?.seller?.name}
          onClick={() => {
            router.push(
              `/user/product/${item?.productId}?category=${item?.category}`
            );
          }}
          src={item?.gallery[active]?.url}
          style={{ aspectRatio: 1, cursor: "pointer", objectFit: "cover" }}
        />

        {item.gallery?.length > 1 && (
          <div
            className="absolute z-10 bottom-8 w-full h-0 bg-white text-white flex items-center justify-between"
            style={{ transform: "translateY(50%)" }}
          >
            <div className="p-4">
              <IoMdArrowDropleft
                onClick={
                  active === 0
                    ? () => setActive(item.gallery?.length - 1)
                    : (e) => {
                        setActive((prev: number) => prev - 1);
                      }
                }
                className="text-gray-50 cursor-pointer hover:brightness-90"
                size={40}
              />
            </div>
            <div className="p-4">
              <IoMdArrowDropright
                onClick={
                  active === item.gallery?.length - 1
                    ? () => setActive(0)
                    : (e) => {
                        setActive((prev: number) => prev + 1);
                      }
                }
                className="text-gray-50 cursor-pointer hover:brightness-90"
                size={40}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-bold">{item?.title?.ka}</h3>
        <h3 className="text-xl font-bold">{item?.title?.en}</h3>
        <p className="text-gray-600">
          {categories?.find((i: any) => i.value === item?.category).label}
        </p>
        <p className="text-gray-600">{item?.description.ka}</p>
        <p className="text-gray-600">{item?.description.en}</p>
        <div className="flex items-center gap-2 text-green-500 font-semibold">
          {item.price?.byOrder && activeLanguage.byOrder}
          {!item.price?.byOrder && parseFloat(item.price?.value).toFixed(2)}
          {item.price?.byOrder ? "" : "₾"}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
