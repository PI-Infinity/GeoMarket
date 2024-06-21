import { useApp } from "@/app/context/app";
import { storage } from "@/app/firebase";
import axios from "axios";
import { deleteObject, listAll, ref } from "firebase/storage";
import React from "react";
import ProductItem from "./product-item";
import { useProfileContext } from "@/app/context/profile";
import { useAuth } from "@/app/context/auth";
import { CgLayoutGridSmall } from "react-icons/cg";

interface propsTypes {
  setConfirmPopup: any;
}

const List: React.FC<propsTypes> = ({ setConfirmPopup }) => {
  // app context
  const { apiUrl, setOpenBackDrop } = useApp();

  // profile context
  const { products, setProducts, setAlert, loadingProducts, totalProducts } =
    useProfileContext();

  /**
   * Delete Product
   */

  CgLayoutGridSmall;

  const DeleteProduct = async ({ itemId }: any) => {
    console.log(itemId);
    try {
      setOpenBackDrop(true);
      const response = await axios.delete(
        apiUrl + "/api/v1/products/" + itemId
      );
      // if (response.data.status === "success") {
      setProducts((prev: any) =>
        prev?.filter((i: any) => i.productId !== itemId)
      );
      // }
      setConfirmPopup(false);
      setTimeout(() => {
        setOpenBackDrop(false);
        setAlert({
          active: true,
          type: "success",
          text: "deleted successfully",
        });
      }, 500);
    } catch (error: any) {
      console.log(error);
      setAlert({
        active: true,
        type: "error",
        text: error.response,
      });
    }
  };

  return (
    <div className="flex-1 w-full h-full">
      {loadingProducts && (
        <div
          className="absolute w-full h-full overflow-hidden z-20"
          style={{
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
          }}
        />
      )}
      {totalProducts !== null && products?.length < 1 && (
        <div className="text-gray-400 my-4 flex w-full items-center justify-center text-red-500">
          Not Found
        </div>
      )}
      <div className="grid laptop:grid-cols-3 gap-2 laptop:gap-4 pb-4 laptop:pb-0">
        {products &&
          products?.map((item: any, index: any) => (
            <ProductItem
              setConfirmPopup={setConfirmPopup}
              DeleteProduct={DeleteProduct}
              item={item}
              key={index}
            />
          ))}
      </div>
    </div>
  );
};

export default List;
