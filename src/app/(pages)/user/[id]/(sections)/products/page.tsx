"use client";
import React, { useEffect, useRef, useState } from "react";
import List from "./list";
import { useUserContext } from "@/app/context/user";
import axios from "axios";
import { useApp } from "@/app/context/app";
import getUsersProducts from "@/app/hooks/getUserProducts";

interface propsTypes {}

// Define the Product interface
interface Product {
  productId: string;
  title: string;
  // other product fields
}

const Products: React.FC<propsTypes> = () => {
  useEffect(() => {
    // Scroll to the top of the window
    window.scrollTo(0, 0);
  }, []);
  // user context
  const { user } = useUserContext();

  // app context
  const { apiUrl } = useApp();

  /**
   * Getting user products
   */
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(null);

  const GetProducts = async () => {
    try {
      setLoadingProducts(true);
      const list = await getUsersProducts({
        apiUrl,
        search,
        userId: user?.userId,
        page,
        limit: 8,
        status: "public",
      });
      setProducts(list.data.products);
      setTotalProducts(list.totalProducts);
      setPage(1);
      setLoadingProducts(false);
    } catch (error: any) {
      console.log(error);
      console.log("user - get products error");
    }
  };
  useEffect(() => {
    if (user?.userId?.length > 0) {
      GetProducts();
    }
  }, [user?.userId]);

  useEffect(() => {
    document.title = user?.name || "იტვირთება..."; // Sets the document name
  }, [user?.name]);

  const AddProducts = async () => {
    const newPage = page + 1;
    try {
      const response = await getUsersProducts({
        apiUrl,
        search,
        userId: user?.userId,
        page: newPage,
        limit: 8,
      });
      setTotalProducts(response.totalProducts);

      setProducts((prevProducts) => {
        // Create a new set with existing product IDs for quick lookup
        const existingIds = new Set(
          prevProducts.map((product) => product.productId)
        );

        // Filter out duplicates from the newly fetched products based on product ID
        const filteredNewProducts = response.data.products.filter(
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
  const productsRef = useRef<HTMLDivElement>();

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
  return (
    <List
      productsRef={productsRef}
      products={products}
      loadingProducts={loadingProducts}
      totalProducts={totalProducts}
    />
  );
};

export default Products;
