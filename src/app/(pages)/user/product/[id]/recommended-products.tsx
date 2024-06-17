import { useApp } from "@/app/context/app";
import { useUserContext } from "@/app/context/user";
import axios from "axios";
import Image from "@/app/components/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import nProgress from "nprogress";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdDiamond, MdStar } from "react-icons/md";
import fetchRecommendedProducts from "@/app/hooks/getRecommendedProducts";

const RecommendedProducts = () => {
  // app context
  const { apiUrl, activeLanguage } = useApp();

  // router
  const router = useRouter();

  // user context
  const { setProduct } = useUserContext();

  // current category
  const searchParams = useSearchParams().get("category");

  // product id
  const productId = usePathname().split("/")[3];

  /**
   * getting recommended products
   */
  const [products, setProducts] = useState<[]>([]);

  const GetProducts = async () => {
    try {
      const response = await fetchRecommendedProducts({
        apiUrl,
        searchParams,
        productId,
      });
      if (response) {
        setProducts(response.data.products);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetProducts();
  }, [apiUrl, searchParams, productId]);

  // Function to format the rating
  const formatRating = (rating: any) => {
    if (rating < 1000) return rating;
    if (rating < 10000) return `${(rating / 1000).toFixed(0)}k`;
    if (rating < 1000000) return `${Math.floor(rating / 1000)}k`;
    return `${(rating / 1000000).toFixed(1)}m`;
  };
  return (
    <div className="w-full flex flex-col bg-gray-100 p-2 h-full rounded-xl items-center gap-2 laptop:max-w-2/3">
      {products?.length > 0 &&
        products?.map((item: any, index: number) => {
          let cover = item.gallery.find((i: any) => i.cover);
          return (
            <div
              key={index}
              onClick={() => {
                setProduct(item);
                router.push(
                  `/user/product/${item.productId}?category=${item.category}`
                );
              }}
              className="cursor-pointer text-black flex flex-col gap-2 w-full laptop:h-1/6 hover:brightness-90 transition-all"
            >
              <div
                className="flex h-full rounded-xl p-2  pl-4 bg-white relative"
                style={{
                  boxSizing: "border-box",
                }}
              >
                <div className="flex items-center gap-4 w-1/4 laptop:w-1/3">
                  <div
                    className={`relative w-full shadow-md aspect-square overflow-hidden bg-gray-300 rounded-xl flex items-center justify-center`}
                  >
                    <Image
                      alt={item?.seller.name}
                      src={cover?.url}
                      style={{
                        aspectRatio: 1,
                        zIndex: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
                <div className="pl-4 flex flex-col justify-center">
                  <MdDiamond
                    size={16}
                    className={`${
                      item?.seller?.subscription?.type !== "Free"
                        ? "text-orange-500"
                        : "text-gray-400"
                    } hover:brightness-90 absolute right-2 top-2`}
                  />

                  <div className="flex items-center gap-1 text-sm">
                    {formatRating(item.rating)} <MdStar color="orange" />
                  </div>

                  <h3 className="text-black font-semibold">{item.title.ka}</h3>
                  <p className="text-black font-normal text-sm">
                    {activeLanguage[item.category]}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default RecommendedProducts;
