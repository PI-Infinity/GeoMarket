"use client";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useProductsContext } from "@/app/context/products";
import { useProfileContext } from "@/app/context/profile";
import { FormControlLabel, Switch } from "@mui/material";
import Image from "@/app/components/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowDropleft, IoMdArrowDropright, IoMdEye } from "react-icons/io";
import { MdBlock, MdDateRange, MdDelete, MdInfo, MdStar } from "react-icons/md";
import { RiEjectFill, RiEjectLine } from "react-icons/ri";
import axios from "axios";
import nProgress from "nprogress";
import { FaImages } from "react-icons/fa";
import { BsCardList } from "react-icons/bs";

interface PropTypes {
  item: any;
  setConfirmPopup: any;
  DeleteProduct: any;
}

const ProductItem: React.FC<PropTypes> = ({
  item,
  setConfirmPopup,
  DeleteProduct,
}) => {
  // router
  const router = useRouter();

  // auth state
  const { currentUser } = useAuth();

  // app context
  const { activeLanguage, apiUrl } = useApp();

  // categories
  const { categories } = useProductsContext();

  // user total of products
  const { totalProducts } = useProfileContext();

  /**
   * product
   */
  const [product, setProduct] = useState(item);

  // Function to format the rating
  const formatRating = (rating: any) => {
    if (rating < 1000) return rating;
    if (rating < 10000) return `${(rating / 1000).toFixed(0)}k`;
    if (rating < 1000000) return `${Math.floor(rating / 1000)}k`;
    return `${(rating / 1000000).toFixed(1)}m`;
  };

  // get cover
  const cover = product.gallery?.findIndex((i: any) => i.cover);

  /**
   * define user subscription config
   * if use can to add more product than he can with his sunscription
   */
  const DefineAccess = () => {
    let access;

    if (totalProducts < currentUser?.subscription?.options?.products) {
      access = true;
    } else {
      access = false;
    }

    return access;
  };

  /**
   * change item status
   */
  const ChangeStatus = async (status: any) => {
    try {
      const response = await axios.patch(
        apiUrl + "/api/v1/products/" + item?.productId,
        {
          status: status,
        }
      );
      if (response.data.status === "success") {
        setProduct((prev: any) => ({ ...prev, status: status }));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  // Filter items with .cover true
  const coverItems = product?.gallery.filter((item: any) => item?.cover);

  // Filter items with .cover false or undefined
  const nonCoverItems = product?.gallery.filter((item: any) => !item?.cover);

  // Concatenate coverItems first and then nonCoverItems
  const reorderedGallery = [...coverItems, ...nonCoverItems];

  return (
    <div
      style={{
        filter:
          product.status === "public" ? "brightness(1)" : "brightness(0.95)",
      }}
      className="box-border rounded-xl bg-gray-50 p-4 flex flex-col justify-center cursor-pointer shadow-md"
    >
      <div className="flex mb-4 gap-4 w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/user/product/${product?.productId}`}
            className="hover:brightness-95 cursor-pointer"
          >
            <IoMdEye size={32} className="text-gray-500" />
          </Link>
          <div className="flex items-center gap-1 text-md">
            <MdStar color="orange" size={20} />
            {formatRating(product.rating)}
          </div>
          <Link
            href={`/user/product/${product?.productId}`}
            className={`flex items-center gap-1 text-md ml-auto text-gray-400 cursor-pointer hover:brightness-90`}
          >
            <BsCardList size={20} />
            {formatRating(product?.reviews || 0)}
          </Link>
        </div>
        <div
          onClick={() =>
            setConfirmPopup({
              active: true,
              text: activeLanguage.askDeleteProduct,
              close: () =>
                setConfirmPopup({
                  active: false,
                  close: null,
                  agree: null,
                  text: "",
                }),
              agree: () =>
                DeleteProduct(item?.productId, item?.gallery[0]?.folderId),
            })
          }
          className="hover:brightness-90 cursor-pointer"
        >
          <MdDelete color="red" size={24} />
        </div>
      </div>
      <div className="flex-1 relative">
        <div
          className="w-full flex overflow-x-scroll aspect-square relative"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch", // Enables momentum scrolling on iOS Safari
          }}
        >
          {reorderedGallery?.map((file: any, index: number) => (
            <Link
              href={`/profile/products/editProduct?id=${item?.productId}`}
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
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold">{item?.title?.ka}</h3>
          <p className="text-gray-600">
            {categories?.find((i: any) => i.value === item?.category).label}
          </p>
          <div className="flex items-center gap-2 text-green-500 font-semibold">
            {product.price?.byOrder && activeLanguage.byOrder}
            {!product.price?.byOrder &&
              parseFloat(product.price?.value).toFixed(2)}
            {product.price?.byOrder ? "" : "₾"}
          </div>
        </div>
        {product.status === "inReview" ? (
          <div className="text-orange-500 text-center flex items-center gap-2">
            <MdInfo size={24} />
            {activeLanguage.inReview}...
          </div>
        ) : product.status === "rejected" ? (
          <div className="text-red-500 text-center flex flex-col items-end gap-2">
            <div className="flex items-center gap-1">
              <MdBlock size={24} /> <h4>{activeLanguage.rejected}...</h4>
            </div>
            <span className="text-sm">{activeLanguage.rejectedText}</span>
            <Link
              href="/terms"
              className="text-red font-semibold"
              style={{ textDecoration: "underline" }}
            >
              {activeLanguage.termsAndRules}
            </Link>
          </div>
        ) : (
          <div className="ml-auto">
            <FormControlLabel
              control={
                <Switch
                  checked={product.status === "public"}
                  onChange={
                    DefineAccess()
                      ? () =>
                          ChangeStatus(
                            product.status === "public" ? "draft" : "public"
                          )
                      : () =>
                          alert(
                            `You have reached your maximum ${currentUser?.subscription?.options?.products} product publishing. If you want to publish more products, you need to change your subscription.`
                          )
                  }
                />
              }
              label={activeLanguage[product.status]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
