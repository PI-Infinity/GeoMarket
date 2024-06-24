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
import { MoonLoader } from "react-spinners";
import Link from "next/link";
import { BsCardList } from "react-icons/bs";
import { formatNumbers } from "@/app/utils/formatNumbers";

const RecommendedProducts = () => {
  // app context
  const { apiUrl, activeLanguage, isMobile } = useApp();

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
  const [totalProducts, setTotalProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  const GetProducts = async () => {
    try {
      setLoading(true);
      const response = await fetchRecommendedProducts({
        apiUrl,
        searchParams,
        productId,
      });
      if (response) {
        setProducts(response.data.products);
        setTotalProducts(response.totalProducts);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetProducts();
  }, [apiUrl, searchParams, productId]);

  return (
    <div className="w-full flex flex-col h-full rounded-xl items-center gap-2">
      {totalProducts !== null && products.length === 0 && (
        <div className="mt-8 text-gray-400 flex w-full items-center justify-center text-red-500">
          {activeLanguage?.notFound}
        </div>
      )}
      {loading ? (
        <div className="w-full flex items-center justify-center h-80">
          <MoonLoader size={24} color="red" />
        </div>
      ) : (
        products?.length > 0 &&
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
              className="shadow-xl bg-white rounded-xl overflow-hidden cursor-pointer text-black flex gap-2 w-full laptop:h-1/6 hover:brightness-90 transition-al p-2"
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
              <div className="pl-4 flex flex-col justify-center gap-1">
                <div className="text-black font-semibold flex items-center gap-1">
                  <div>
                    <MdDiamond
                      size={16}
                      className={`${
                        item?.seller?.subscription?.type !== "Free"
                          ? "text-orange-500"
                          : "text-gray-400"
                      } hover:brightness-90`}
                    />
                  </div>
                  <div className="text-md font-semibold whitespace-nowrap max-w-32 overflow-hidden overflow-ellipsis">
                    {item.title.ka}
                  </div>
                </div>
                <p className="text-black font-normal text-sm">
                  {activeLanguage[item.category]}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-green-500 font-semibold">
                    {item?.price?.byOrder && activeLanguage.byOrder}
                    {!item?.price?.byOrder &&
                      parseFloat(item?.price?.value).toFixed(2)}{" "}
                    {item?.price?.byOrder ? "" : "₾"}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <MdStar color="orange" />
                    {formatNumbers(item.rating)}
                  </div>
                  <Link
                    href={`/user/product/${item?.productId}`}
                    className={`flex items-center gap-1 text-sm text-gray-400 cursor-pointer hover:brightness-90`}
                  >
                    <BsCardList />
                    {formatNumbers(item?.reviews || 0)}
                  </Link>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default RecommendedProducts;
