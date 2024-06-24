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

const UserProductsPage: React.FC = () => {
  // product id
  const productId = usePathname().split("/")[3];

  // app state
  const { apiUrl, activeLanguage } = useApp();

  /**
   * gettin product
   */
  const { product, setProduct } = useUserContext();

  const GetProduct = async () => {
    try {
      const response = await getProduct({ apiUrl, productId });
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
  }, [productId, product?.productId]);

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
            />
          </div>
          <Info
            data={product}
            setData={setProduct}
            setConfirmPopup={setConfirmPopup}
            setAlert={setAlert}
          />
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

      <div className="w-full flex flex-col laptop:w-96 laptop:mr-2">
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
