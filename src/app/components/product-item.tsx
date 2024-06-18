"use client";
import { useAuth } from "@/app/context/auth";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import nProgress from "nprogress";
import React, { useEffect, useRef, useState } from "react";
import { FaHeart, FaImages } from "react-icons/fa";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { MdDiamond, MdStar } from "react-icons/md";
import { useApp } from "../context/app";
import { useProductsContext } from "../context/products";
import { useUserContext } from "../context/user";
import Image from "./image";

interface PropTypes {
  item: any;
  from?: string;
  UnSave?: any;
}

const SellerItem: React.FC<PropTypes> = ({ item, from, UnSave }) => {
  // current path name
  const pathname = usePathname();

  // router
  const router = useRouter();

  // auth user
  const { currentUser } = useAuth();

  // app context
  const { apiUrl, activeLanguage, isMobile } = useApp();

  // categories
  const { categories } = useProductsContext();

  // user context
  const { setProduct: setProductState, setUser } = useUserContext();

  // product
  const [product, setProduct] = useState(item);

  // Function to format the rating
  const formatRating = (rating: any) => {
    if (rating < 1000) return rating;
    if (rating < 10000) return `${(rating / 1000).toFixed(0)}k`;
    if (rating < 1000000) return `${Math.floor(rating / 1000)}k`;
    return `${(rating / 1000000).toFixed(1)}m`;
  };

  // get cover
  const cover = product?.gallery?.findIndex((i: any) => i.cover);

  // active image
  const [active, setActive] = useState(cover);

  /**
   * Save/unsave product
   */

  interface ActionsProps {
    saved: Boolean;
    rating: Boolean;
    fetched: Boolean;
  }
  // user actions
  const [actions, setActions] = useState<ActionsProps>({
    saved: false,
    rating: false,
    fetched: false,
  });

  // check current user actions in product
  useEffect(() => {
    const CheckProduct = async () => {
      try {
        const response = await axios.get(
          apiUrl +
            "/api/v1/products/check/" +
            product?.productId +
            "?user=" +
            currentUser.userId
        );
        setActions({ ...response.data.data, fetched: true });
      } catch (error: any) {
        console.log("product check error: " + error);
      }
    };
    if (currentUser && currentUser?.userId !== product?.seller.userId) {
      CheckProduct();
    }
  }, [currentUser, product?.productId]);

  const SaveProduct = async (action: string) => {
    try {
      if (action === "save") {
        setActions((prev: any) => ({ ...prev, saved: true }));
      } else {
        if (UnSave) {
          UnSave();
        }
        setActions((prev: any) => ({ ...prev, saved: false }));
      }
      await axios.patch(
        apiUrl +
          "/api/v1/products/" +
          product?.productId +
          "/save?action=" +
          action,
        {
          userId: currentUser.userId,
        }
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  const SetRating = async () => {
    try {
      setActions((prev: any) => ({ ...prev, rating: true }));
      setProduct((prev: any) => ({ ...prev, rating: prev.rating + 1 }));
      const response = await axios.patch(
        apiUrl + "/api/v1/products/" + product?.productId + "/rating",
        {
          targetUser: product?.seller.userId,
          currentUser: currentUser?.userId,
        }
      );
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
      className={`box-border rounded-xl bg-white laptop:p-4 flex flex-col justify-center shadow-md`}
    >
      <div className="flex mb-4 gap-4 w-full items-center p-4 laptop:p-0 pb-0">
        <div className="flex items-center gap-2 w-full justify-between">
          <Link
            href={`/user/product/${product?.productId}?category=${product?.category}`}
          >
            <h3
              onClick={() => {
                setProductState(product);
              }}
              className="text-xl font-bold hover:text-gray"
              style={{ whiteSpace: "nowrap" }}
            >
              {product?.title?.ka}
            </h3>
          </Link>
          <div className={`flex items-center gap-1 text-md`}>
            <MdStar color="orange" size={20} />
            {formatRating(product?.rating || 0)}
          </div>
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
              href={`/user/product/${product?.productId}?category=${product?.category}`}
              key={index}
              className="relative min-w-full aspect-square bg-gray-300 hover:brightness-95 transition-all overflow-hidden"
              style={{ scrollSnapAlign: "center" }}
            >
              <Image
                alt={item?.seller?.name}
                onClick={() => {
                  setProductState(product);
                }}
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

      <div className="laptop:mt-4 flex items-center p-4 laptop:p-0">
        <div className="flex flex-col gap-1">
          <Link
            href={
              !pathname.includes("/user") &&
              !pathname.includes("/profile" && "/products")
                ? `/user/${product?.seller?.userId}/products`
                : pathname
            }
            className="flex gap-2 items-center hover:brightness-95 transition-all"
            onClick={
              from !== "user"
                ? () => {
                    setUser(product?.seller);
                  }
                : undefined
            }
          >
            <div className="flex items-center gap-2">
              <div
                className={`relative shadow-md w-10 h-10 laptop:w-8 laptop:h-8 aspect-square overflow-hidden bg-gray-300 rounded-full overflow-hidden flex items-center justify-center`}
              >
                <Image
                  alt={product?.seller?.name}
                  src={product?.seller?.cover?.url}
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                    zIndex: 0,
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div>{product?.seller?.name}</div>
              {pathname === "/" && (
                <div className="flex items-center gap-2 ml-auto">
                  <MdDiamond
                    size={20}
                    className={`${
                      product?.seller?.subscription?.type !== "Free"
                        ? "text-orange-500"
                        : "text-gray-400"
                    } hover:brightness-90`}
                  />
                </div>
              )}
            </div>
          </Link>

          <p className="text-gray-600">
            {categories?.find((i: any) => i.value === product?.category).label}
          </p>
          <div className="flex items-center gap-2 text-green-500 font-semibold">
            {product?.price?.byOrder && activeLanguage.byOrder}
            {!product?.price?.byOrder &&
              parseFloat(product?.price?.value).toFixed(2)}{" "}
            {product?.price?.byOrder ? "" : "₾"}
          </div>
        </div>
        {(!currentUser ||
          (currentUser?.userId !== product?.seller.userId &&
            actions.fetched)) && (
          <div className="flex items-center gap-4 ml-auto">
            <div
              className={
                !actions?.rating
                  ? "hover:brightness-95 transition-all cursor-pointer text-gray-300"
                  : "text-orange-200"
              }
              onClick={
                currentUser && !actions.rating ? () => SetRating() : undefined
              }
            >
              <MdStar size={32} />
            </div>

            <div
              className=" hover:brightness-95 transition-all cursor-pointer"
              onClick={
                currentUser
                  ? () => SaveProduct(actions.saved ? "remove" : "save")
                  : () => {
                      router.push("/login");
                    }
              }
            >
              <FaHeart
                size={23}
                className={`cursor-pointer ${
                  actions?.saved ? "text-red-500" : "text-gray-300"
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerItem;
