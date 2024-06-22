"use client";
import Button from "@/app/components/button";
import Image from "@/app/components/image";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useProductsContext } from "@/app/context/products";
import { FormatDate } from "@/app/utils/formatDate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaImages } from "react-icons/fa";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

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
  Confirm,
  Reject,
  actionLoading,
}) => {
  // router
  const router = useRouter();

  // app context
  const { activeLanguage } = useApp();

  // categories
  const { categories } = useProductsContext();

  // get cover
  const cover = item.gallery?.findIndex((i: any) => i.cover);

  // active image
  const [active, setActive] = useState(cover);

  // Filter items with .cover true
  const coverItems = item?.gallery.filter((item: any) => item?.cover);

  // Filter items with .cover false or undefined
  const nonCoverItems = item?.gallery.filter((item: any) => !item?.cover);

  // Concatenate coverItems first and then nonCoverItems
  const reorderedGallery = [...coverItems, ...nonCoverItems];

  return (
    <div
      style={{
        filter: item.status === "public" ? "brightness(1)" : "brightness(0.95)",
      }}
      className="box-border rounded-xl bg-gray-50 p-4 flex flex-col cursor-pointer shadow-md laptop:max-w-80"
    >
      <p className="text-md font-bold">Status: {item?.status}</p>
      <div className="flex mb-2 mt-2 gap-4 w-full items-center justify-between">
        <div className="flex items-center gap-1 text-sm">
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

      <div
        className="flex items-center gap-2 w-full"
        onClick={() => {
          router.push(`/user/${item?.seller?.userId}/products`);
        }}
      >
        <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
          <Image
            alt={item?.seller?.name}
            src={item?.seller?.cover?.url}
            style={{
              aspectRatio: 1,
              cursor: "pointer",
              objectFit: "cover",
            }}
          />
        </div>
        <h4 className="text-sm">{item?.seller?.name}</h4>
      </div>

      <div
        className="w-full flex overflow-x-scroll aspect-square relative mt-4"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch", // Enables momentum scrolling on iOS Safari
        }}
      >
        {reorderedGallery?.map((file: any, index: number) => (
          <Link
            href={`/user/product/${item?.productId}?category=${item?.category}`}
            key={index}
            className="relative min-w-full aspect-square bg-gray-300 hover:brightness-95 transition-all overflow-hidden"
            style={{ scrollSnapAlign: "center" }}
          >
            <Image
              alt={item?.seller?.name}
              src={file?.url}
              style={{
                aspectRatio: 1,
                cursor: "pointer",
                width: "100%",
                objectFit: "cover",
              }}
            />
          </Link>
        ))}
      </div>
      <div>
        {reorderedGallery?.length > 1 && (
          <FaImages
            size={16}
            className="shadow-xl absolute z-10 bottom-2 right-2"
            color="white"
          />
        )}
      </div>
      <div className="flex flex-col gap-1 mt-4">
        <h3 className="text-md font-bold">{item?.title?.ka}</h3>
        <h3 className="text-md font-bold">{item?.title?.en}</h3>
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
