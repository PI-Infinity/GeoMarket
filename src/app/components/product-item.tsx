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
  const { setLoading, apiUrl, activeLanguage, isMobile } = useApp();

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

  // active img
  const [activeImg, setActiveImg] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;

        const totalImages = product?.gallery?.length || 0;
        const imageWidth = scrollWidth / totalImages;

        if (scrollLeft < imageWidth / 2) {
          setActiveImg(0);
        } else if (
          scrollLeft > imageWidth / 2 &&
          scrollLeft < imageWidth * 1.5
        ) {
          setActiveImg(1);
        } else if (
          scrollLeft > imageWidth * 1.5 &&
          scrollLeft < imageWidth * 2.5
        ) {
          setActiveImg(2);
        } else if (
          scrollLeft > imageWidth * 2.5 &&
          scrollLeft < imageWidth * 3.5
        ) {
          setActiveImg(3);
        } else if (
          scrollLeft > imageWidth * 2.5 &&
          scrollLeft < imageWidth * 3.5
        ) {
          setActiveImg(4);
        }
      }
    };

    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [product]);

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
          <h3 className="text-xl font-bold" style={{ whiteSpace: "nowrap" }}>
            {product?.title?.ka}
          </h3>
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
          ref={scrollContainerRef}
        >
          {reorderedGallery?.map((file: any, index: number) => (
            <div
              key={index}
              className="relative min-w-full aspect-square bg-gray-300 hover:brightness-95 transition-all overflow-hidden"
              style={{ scrollSnapAlign: "center" }}
            >
              <Image
                alt={item?.seller?.name}
                onClick={() => {
                  setLoading(true);
                  router.push(
                    `/user/product/${product?.productId}?category=${product?.category}`
                  );
                  setProductState(product);
                  nProgress.start();
                }}
                src={file?.url}
                style={{
                  aspectRatio: 1,
                  cursor: "pointer",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </div>
        <div>
          {reorderedGallery?.length > 1 && (
            <div
              style={{
                WebkitBackdropFilter: "blur(10px)",
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.1)",
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-14 rounded-md p-1 shadow-md absolute bottom-2 left-2 z-10 flex flex-col gap-1"
            >
              {reorderedGallery?.map((i: any, index: number) => {
                return (
                  <div
                    onClick={() => {
                      if (scrollContainerRef?.current) {
                        const scrollWidth =
                          scrollContainerRef?.current?.scrollWidth;
                        const totalImages = product?.gallery?.length || 0;
                        const imageWidth = scrollWidth / totalImages;
                        scrollContainerRef.current.scrollTo({
                          left: imageWidth * index,
                          behavior: "smooth",
                        });
                      }
                      setActiveImg(index);
                    }}
                    key={index}
                    className="relative aspect-square rounded-md w-full hover:brightness-95 transition-all overflow-hidden"
                    style={{
                      scrollSnapAlign: "center",
                      filter:
                        index === activeImg
                          ? "brightness(1.1)"
                          : "brightness(0.5)",
                      border:
                        index === activeImg
                          ? "1.5px solid rgba(255,255,255,0.5)"
                          : "1.5px solid rgba(255,255,255,0)",
                    }}
                  >
                    <Image
                      alt={item?.seller?.name}
                      src={i?.url}
                      style={{
                        aspectRatio: 1,
                        cursor: "pointer",
                        width: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                );
              })}
            </div>
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
                    if (
                      !pathname.includes("/user") &&
                      !pathname.includes("/profile" && "/products")
                    ) {
                      setLoading(true);
                      nProgress.start();
                    }
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
                    size={24}
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
                currentUser && !actions.rating
                  ? () => SetRating()
                  : currentUser && actions.rating
                  ? undefined
                  : () => {
                      router.push("/login");
                      setLoading(true);
                    }
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
                      setLoading(true);
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
