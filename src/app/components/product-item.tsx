"use client";
import { useAuth } from "@/app/context/auth";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaHeart, FaImages } from "react-icons/fa";
import { MdDiamond, MdOutlineReviews, MdStar } from "react-icons/md";
import { useApp } from "../context/app";
import { useProductsContext } from "../context/products";
import { useUserContext } from "../context/user";
import Image from "./image";
import { BsCardList } from "react-icons/bs";
import { formatNumbers } from "../utils/formatNumbers";

interface PropTypes {
  item: any;
  from?: string;
  UnSave?: any;
  activeGrid?: any;
}

const SellerItem: React.FC<PropTypes> = ({
  item,
  from,
  UnSave,
  activeGrid,
}) => {
  // current path name
  const pathname = usePathname();

  // router
  const router = useRouter();

  // auth user
  const { currentUser, setDestination } = useAuth();

  // app context
  const { apiUrl, activeLanguage, isMobile } = useApp();

  // categories
  const { categories } = useProductsContext();

  // user context
  const { setProduct: setProductState, setUser } = useUserContext();

  // product
  const [product, setProduct] = useState(item);

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
    if (currentUser?.userId === product?.seller.userId) {
      return;
    }
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
    if (currentUser?.userId === product?.seller.userId) {
      return;
    }
    try {
      setActions((prev: any) => ({ ...prev, rating: true }));
      setProduct((prev: any) => ({ ...prev, rating: prev.rating + 1 }));
      await axios.patch(
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
      className={`box-border rounded-xl bg-white laptop:p-4 flex flex-col shadow-md`}
    >
      <div
        className={`flex ${
          activeGrid === "double" ? "mb-2 p-2 px-3" : "mb-4 p-4"
        }  gap-4 w-full items-center laptop:p-0 pb-0`}
      >
        <div className="flex items-center gap-1 w-full justify-between relative">
          <Link
            href={`/user/product/${product?.productId}?category=${product?.category}`}
          >
            <div
              onClick={() => {
                setProductState(product);
              }}
              className={`font-bold hover:text-gray whitespace-nowrap overflow-hidden overflow-ellipsis ${
                activeGrid === "double"
                  ? "max-w-32 text-md"
                  : "max-w-80 text-xl"
              } laptop:max-w-56`}
            >
              {product?.title?.ka}
            </div>
          </Link>

          <div className={`flex items-center gap-1 text-sm`}>
            <MdStar color="orange" size={18} />
            {formatNumbers(product?.rating || 0)}
          </div>
        </div>
      </div>
      <div className="relative">
        {product?.price?.newPrice?.length > 0 && (
          <div className="bg-red-500 text-sm absolute right-0 top-2 z-10 text-white py-1 px-3 rounded-bl-full rounded-tl-full">
            -
            {((parseInt(product.price.value) -
              parseInt(product.price.newPrice)) /
              parseInt(product.price.value)) *
              100}
            %
          </div>
        )}
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

      <div
        className={`laptop:mt-4 flex items-center ${
          activeGrid === "double" ? "p-2 pl-3" : "p-4"
        } laptop:p-0`}
      >
        <div className="w-full flex flex-col gap-1">
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
            <div className="flex items-center gap-2 max-w-full">
              <div
                className={`relative shadow-md ${
                  activeGrid === "double" ? "w-6 h-6" : "w-8 h-8"
                } laptop:w-8 laptop:h-8 aspect-square overflow-hidden bg-gray-300 rounded-full overflow-hidden flex items-center justify-center`}
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
              <div className="flex items-center gap-2">
                <div
                  style={{ fontWeight: 600, fontSize: "12px" }}
                  className={`whitespace-nowrap overflow-hidden overflow-ellipsis ${
                    activeGrid === "double"
                      ? "max-w-24 text-sm"
                      : "max-w-80 text-md"
                  } laptop:max-w-56`}
                >
                  {product?.seller?.name}
                </div>

                <div className={`flex items-center`} style={{ gap: "1px" }}>
                  <MdStar color="orange" size={14} />
                  <span
                    style={{
                      fontSize: "12px",
                      gap: "1px",
                      position: "relative",
                      fontWeight: 500,
                    }}
                  >
                    {formatNumbers(product?.seller?.rating || 0)}
                  </span>
                </div>
              </div>
              {/* {pathname === "/" && (
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
              )} */}
            </div>
          </Link>

          <p
            className={`text-gray-400 ${
              activeGrid === "double" ? "text-sm" : "text-md"
            } laptop:text-md`}
          >
            {categories?.find((i: any) => i.value === product?.category).label}
          </p>
          <div
            className={`flex min-h-14 flex-col gap-2 ${
              activeGrid === "double" ? "text-sm" : "text-md"
            } text-green-500 font-semibold laptop:text-md`}
          >
            {product.price?.byOrder ? (
              <div className="font-semibold flex items-center gap-1 text-orange-500 text-sm w-full">
                <span className="text-sm font-semibold">
                  {activeLanguage.byOrder}
                </span>
                {product?.price.createTime?.length > 0 && (
                  <span className="text-sm font-semibold whitespace-nowrap overflow-hidden max-w-2/3 overflow-ellipsis ">
                    ({product?.price.createTime})
                  </span>
                )}
              </div>
            ) : (
              <div className="font-semibold flex items-center gap-1 text-orange-500 text-sm">
                <span className="text-sm font-semibold">
                  {activeLanguage?.made}
                </span>
              </div>
            )}
            <div>
              {product?.price?.newPrice?.length > 0 && (
                <span className="font-semibold mr-2 text-sm text-green-500">
                  {parseFloat(product.price?.newPrice).toFixed(2)}₾
                </span>
              )}
              <span
                className={`font-semibold text-sm ${
                  product?.price?.newPrice?.length > 0
                    ? "text-gray-300 line-through"
                    : "text-green-500"
                }`}
              >
                {product.price?.value === "byAgreement"
                  ? "₾ " + activeLanguage?.byAgreement
                  : parseFloat(product?.price?.value).toFixed(2)}
                {product.price?.value === "byAgreement" ? "" : "₾"}
              </span>
            </div>
          </div>
          <div className="flex w-full items-center">
            <div
              className={`w-full flex items-center ${
                activeGrid === "double"
                  ? "gap-2 relative right-1"
                  : "gap-4 mt-1"
              }`}
              style={{
                opacity:
                  !currentUser || currentUser?.userId !== product?.seller.userId
                    ? 1
                    : 0.3,
              }}
            >
              <div
                className={
                  !actions?.rating
                    ? ` ${
                        (!currentUser ||
                          currentUser?.userId !== product?.seller.userId) &&
                        "hover:brightness-95 transition-all cursor-pointer"
                      }  text-gray-300`
                    : "text-orange-200"
                }
                onClick={
                  currentUser && !actions.rating
                    ? () => SetRating()
                    : currentUser && actions?.rating
                    ? undefined
                    : () => {
                        if (pathname?.includes("user")) {
                          setDestination({
                            productId: product?.productId,
                            userId: product?.seller?.userId,
                            page: "user",
                          });
                        } else {
                          setDestination({
                            productId: null,
                            userId: null,
                            page: null,
                          });
                        }
                        router.push("/login");
                      }
                }
              >
                <MdStar size={activeGrid === "double" ? 28 : 32} />
              </div>
              <div
                className={`${
                  (!currentUser ||
                    currentUser?.userId !== product?.seller.userId) &&
                  "hover:brightness-95 cursor-pointer transition-all"
                }`}
                onClick={
                  currentUser
                    ? () => SaveProduct(actions.saved ? "remove" : "save")
                    : () => {
                        if (pathname?.includes("user")) {
                          setDestination({
                            productId: product?.productId,
                            userId: product?.seller?.userId,
                            page: "product",
                          });
                        } else {
                          setDestination({
                            productId: null,
                            userId: null,
                            page: null,
                          });
                        }
                        router.push("/login");
                      }
                }
              >
                <div className="flex items-center gap-2 rounded-full py-1 px-3 shadow-md">
                  <FaHeart
                    size={activeGrid === "double" ? 12 : 18}
                    className={`${
                      (!currentUser ||
                        currentUser?.userId !== product?.seller.userId) &&
                      "cursor-pointer"
                    } ${actions?.saved ? "text-red-500" : "text-gray-300"}`}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      color: actions?.saved ? "red" : "gray",
                    }}
                  >
                    {actions?.saved ? "შენახული" : "შენახვა"}
                  </span>
                </div>
              </div>
            </div>
            <Link
              href={`/user/product/${product?.productId}`}
              className={`flex items-center gap-1 text-md ml-auto text-gray-400 cursor-pointer hover:brightness-90`}
            >
              <BsCardList size={isMobile ? 16 : 20} />
              {formatNumbers(product?.reviews || 0)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerItem;
