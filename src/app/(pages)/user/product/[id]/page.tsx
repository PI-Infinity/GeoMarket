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
import RecommendedUsers from "./recommended-Users";
import RecommendedProducts from "./recommended-products";

// interface ProductTypes {
//   _id: string;
//   gallery: { url: string }[];
//   rating: any;
//   seller: any;
// }

const UserProductsPage: React.FC = () => {
  // product id
  const productId = usePathname().split("/")[3];

  // app state
  const { apiUrl } = useApp();

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
            <Gallery list={product?.gallery} rating={product?.rating} />
          </div>
          <Info
            data={product}
            setData={setProduct}
            setConfirmPopup={setConfirmPopup}
            setAlert={setAlert}
          />
        </div>
        <div>
          <div className="m-2">
            <h3>Reviews:</h3>
            <div className="rounded-xl shadow-md h-24 w-full"></div>
          </div>
        </div>
        <div className="m-2">
          <h3>Recommended Sellers:</h3>
        </div>
        <div className="w-full laptop:max-w-2/3 h-30 shadow-sm rounded-xl bg-gray-100">
          <RecommendedUsers />
        </div>
      </div>
      <div className="w-full laptop:w-96 laptop:mr-16">
        <div className="m-2">
          <h3>Recommended Products:</h3>
        </div>
        <div className="w-full  bg-white rounded-xl h-full shadow-sm">
          <RecommendedProducts />
        </div>
      </div>
      <ConfirmPopup confirmPopup={confirmPopup} />
      <SimpleSnackbar alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default UserProductsPage;
