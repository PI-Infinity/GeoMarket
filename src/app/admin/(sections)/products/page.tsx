"use client";
import { useApp } from "@/app/context/app";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import ProductItem from "./product-item";
import { BounceLoader } from "react-spinners";

// Define the Product interface
interface Product {
  productId: string;
  title: string;
  // other product fields
}

const Page = () => {
  // app context
  const { apiUrl } = useApp();

  // filter products by status
  const [status, setStatus] = useState("inReview");
  /**
   * Getting user products
   */

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(null);
  const [rerender, setRerender] = useState(false);

  const GetProducts = async () => {
    try {
      setLoadingProducts(true);
      const list = await axios.get(
        apiUrl + `/api/v1/products?search=${search}&page=1&status=${status}`
      );
      setProducts(list.data.data.products);
      setTotalProducts(list.data.totalProducts);
      setPage(1);
      setLoadingProducts(false);
    } catch (error: any) {}
  };
  useEffect(() => {
    if (apiUrl) {
      GetProducts();
    }
  }, [apiUrl, search, rerender, status]);

  const AddProducts = async () => {
    const newPage = page + 1;
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/products?search=${search}&page=${newPage}&status=${status}`
      );
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

  // products ref
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Ensure productsRef.current is not null before accessing its properties
      if (productsRef.current) {
        const { bottom } = productsRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the bottom of the component is near the bottom of the window viewport
        if (bottom <= windowHeight + 200) {
          if (totalProducts && totalProducts > products.length) {
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

  // action loading
  const [actionLoading, setActionLoading] = useState({
    active: false,
    type: "",
  });

  /**
   * public product
   */
  const Confirm = async (productId: any) => {
    try {
      setActionLoading({ active: true, type: "confirm" });
      const response = await axios.patch(
        apiUrl + "/api/v1/products/" + productId + "/confirm",
        {
          status: "draft",
        }
      );
      if (response.data.status === "success") {
        setRerender((prev: any) => !prev);
        setActionLoading({ active: false, type: "" });
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  /**
   * Block Product
   */
  const Reject = async (productId: any) => {
    try {
      setActionLoading({ active: true, type: "reject" });
      const response = await axios.patch(
        apiUrl + "/api/v1/products/" + productId,
        {
          status: "rejected",
        }
      );
      if (response.data.status === "success") {
        setRerender((prev: boolean) => !prev);
        setActionLoading({ active: false, type: "" });
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="w-full p-2">
      <div className="flex items-center gap-4 my-2 mb-4">
        <div
          className={`p-4 pt-2 pb-2 rounded-xl cursor-pointer hover:brightness-95 shadow-md ${
            status === "inReview" && "bg-green-500"
          }`}
          onClick={() => setStatus("inReview")}
        >
          In Review
        </div>
        <div
          className={`p-4 pt-2 pb-2 rounded-xl cursor-pointer hover:brightness-95 shadow-md ${
            status === "public" && "bg-green-500"
          }`}
          onClick={() => setStatus("public")}
        >
          Public
        </div>
        <div
          className={`p-4 pt-2 pb-2 rounded-xl cursor-pointer hover:brightness-95 shadow-md ${
            status === "rejected" && "bg-green-500"
          }`}
          onClick={() => setStatus("rejected")}
        >
          Rejected
        </div>
        <div
          className={`p-4 pt-2 pb-2 rounded-xl cursor-pointer hover:brightness-95 shadow-md ${
            status === "draft" && "bg-green-500"
          }`}
          onClick={() => setStatus("draft")}
        >
          in Draft
        </div>
      </div>
      <div ref={productsRef} className="grid grid-cols-4 w-full gap-2">
        {loadingProducts ? (
          <BounceLoader color="red" size={40} className="m-24" />
        ) : (
          <>
            {products?.length < 1 ? (
              <div className="text-black m-24">Not Found</div>
            ) : (
              products?.map((item: any, index: number) => {
                return (
                  <ProductItem
                    item={item}
                    key={index}
                    Confirm={Confirm}
                    Reject={Reject}
                    actionLoading={actionLoading}
                  />
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
