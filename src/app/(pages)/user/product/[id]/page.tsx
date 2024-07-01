"use client";
import ConfirmPopup from "@/app/components/confirmPopup";
import SimpleSnackbar from "@/app/components/snackBar";
import { useApp } from "@/app/context/app";
import { useUserContext } from "@/app/context/user";
import getProduct from "@/app/hooks/getProduct";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Gallery from "./gallery";
import Info from "./info";
import RecommendedProducts from "./recommended-products";
import Reviews from "./reviews";
import Cookies from "js-cookie";
import axios from "axios";
import { useAuth } from "@/app/context/auth";
import Head from "next/head";
import Carousel from "@/app/advertisements/carousel";

const UserProductsPage: React.FC = () => {
  // product id
  const productId = usePathname().split("/")[3];

  // app state
  const { apiUrl, activeLanguage } = useApp();

  // auth context
  const { currentUser } = useAuth();

  /**
   * getting product
   */
  const { product, setProduct } = useUserContext();

  const GetProduct = async () => {
    try {
      const response = await getProduct({
        apiUrl,
        productId,
        requestBy: currentUser?.userId,
      });
      if (response) {
        setProduct(response.data);
      }
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    if (productId && product?.productId?.length < 1) {
      GetProduct();
    }
  }, [productId, product?.productId, currentUser]);

  /**
   * confirm popup state
   */
  const [confirmPopup, setConfirmPopup] = useState({
    active: false,
    close: null,
    agree: null,
    text: "",
  });

  // alert state
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  /**
   * count visit in product page
   */
  const setView = async () => {
    const identifier = Cookies.get("GeoMarket:uniqueIdentifier");
    try {
      await axios.post(
        apiUrl +
          "/api/v1/products/" +
          product?.productId +
          "/view?user=" +
          identifier
      );
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    if (product?.productId?.length > 0) {
      if (product.seller?.userId !== currentUser?.userId) {
        setView();
      }
    }
  }, [product, currentUser]);

  useEffect(() => {
    document.title = product?.title?.ka || "იტვირთება..."; // Sets the document title for the current page
  }, [product?.title]);

  return (
    <div className="flex-1 flex flex-col laptop:flex-row items-start justify-between w-full h-full gap-2 pb-16 laptop:pb-0">
      <div className="flex flex-col w-full h-full gap-2">
        <div className="flex flex flex-col laptop:flex-row gap-2 w-full h-full">
          <div className="flex flex-col gap-4 w-full laptop:w-3/5">
            <Gallery
              list={product?.gallery}
              rating={product?.rating}
              saves={product?.saves}
              user={product?.seller}
              price={product?.price}
            />
          </div>
          <Info
            data={product}
            setData={setProduct}
            setConfirmPopup={setConfirmPopup}
            setAlert={setAlert}
          />
        </div>
        <div className="flex-1 mt-2 laptop:hidden">
          <Carousel />
        </div>
        <div>
          <div className="rounded-xl  w-full overflow-hidden">
            <Reviews />
          </div>
        </div>
      </div>
      <div
        className="mt-4 mb-0 laptop:hidden"
        style={{ height: "1px", width: "100%", background: "#d9d9d9" }}
      />

      <div className="w-full flex flex-col laptop:w-1/3 laptop:mr-2">
        <div className="flex-1 mt-2 hidden laptop:flex">
          <Carousel />
        </div>
        <div className="p-2">
          <h3 className="text-gray-400 font-semibold text-sm">
            {activeLanguage?.recommendedProducts}:
          </h3>
        </div>
        <div className="w-full rounded-xl h-full">
          <RecommendedProducts />
        </div>
      </div>

      <ConfirmPopup confirmPopup={confirmPopup} />
      <SimpleSnackbar alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default UserProductsPage;
