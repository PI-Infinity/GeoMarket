import { useApp } from "@/app/context/app";
import { storage } from "@/app/firebase";
import axios from "axios";
import { deleteObject, listAll, ref } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useProfileContext } from "@/app/context/profile";
import { useAuth } from "@/app/context/auth";
import ProductItem from "@/app/components/product-item";
import getFavouriteProducts from "@/app/hooks/getFavouriteProducts";
import addFavouriteProducts from "@/app/hooks/addFavouriteProducts";

interface propsTypes {
  setConfirmPopup: any;
}

const List: React.FC<propsTypes> = ({ setConfirmPopup }) => {
  // app context
  const { apiUrl, setOpenBackDrop } = useApp();

  // profile context
  const { setAlert, productsRef } = useProfileContext();

  // auth context
  const { currentUser } = useAuth();

  /**
   * Get favourite products
   */

  // Define the Product interface
  interface Product {
    productId: string;
    title: string;
    // other product fields
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(null);

  const GetProducts = async () => {
    try {
      setLoadingProducts(true);
      const list = await getFavouriteProducts({ apiUrl, currentUser });
      setProducts(list.data.products);
      setPage(1);
      setTotalProducts(list.totalProducts);
      setLoadingProducts(false);
    } catch (error: any) {}
  };

  useEffect(() => {
    if (apiUrl) {
      GetProducts();
    }
  }, [currentUser]);

  const AddProducts = async () => {
    const newPage = page + 1;
    try {
      const response = await addFavouriteProducts({
        apiUrl,
        currentUser,
        newPage,
      });
      setTotalProducts(response.data.totalProducts);

      setProducts((prevProducts) => {
        // Create a new set with existing product IDs for quick lookup
        const existingIds = new Set(
          prevProducts.map((product) => product.productId)
        );

        // Filter out duplicates from the newly fetched products based on product ID
        const filteredNewProducts = response.data.data.products.filter(
          (p: any) => !existingIds.has(p.productId)
        );

        if (filteredNewProducts.length > 0) {
          return [...prevProducts, ...filteredNewProducts];
        } else {
          return [...prevProducts];
        }
      });

      setPage(newPage);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Ensure productsRef.current is not null before accessing its properties
      if (productsRef.current) {
        const { bottom } = productsRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the bottom of the component is near the bottom of the window viewport
        if (bottom <= windowHeight + 200) {
          if (totalProducts && totalProducts > products.length) {
            // setLoadMore(true);
            AddProducts();
          }
        }
      }
    };

    // Register the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [products.length, totalProducts, productsRef]);

  /**
   * Unsave item from local state
   */

  const DeleteProduct = async (itemId: any) => {
    setProducts((prev: any) => prev.filter((i: any) => i.productId !== itemId));
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
      {totalProducts !== null && totalProducts < 1 && (
        <div className="text-gray-400 flex w-full items-center justify-center text-red-500">
          Not Found
        </div>
      )}
      <div className="grid laptop:grid-cols-3 gap-2 laptop:gap-4 ">
        {products &&
          products?.map((item: any) => (
            <ProductItem
              UnSave={() => DeleteProduct(item.productId)}
              item={item}
              key={item.productId}
            />
          ))}
      </div>
    </div>
  );
};

export default List;
