"use client";
import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useApp } from "./app";
import { useAuth } from "./auth";
import { redirect, useRouter } from "next/navigation";
import fetchProducts from "../hooks/getUserProducts";

/**
 * Profile state context
 */

const ProfileContext = createContext<any>(null);

export const useProfileContext = () => useContext(ProfileContext);

interface contextProps {
  children: ReactNode;
}

// Define the Product interface
interface Product {
  productId: string;
  title: string;
  // other product fields
}

export const ProfileContextWrapper: React.FC<contextProps> = ({ children }) => {
  // app context
  const { apiUrl } = useApp();

  // auth state
  const { currentUser } = useAuth();

  /**
   * Getting user products
   */
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(null);

  const GetProducts = async () => {
    try {
      setLoadingProducts(true);
      const list = await fetchProducts({
        apiUrl,
        search,
        userId: currentUser?.userId,
        page,
        limit: 8,
      });
      setProducts(list.data.products);
      setTotalProducts(list.totalProducts);
      setPage(1);
      setLoadingProducts(false);
    } catch (error: any) {}
  };
  useEffect(() => {
    if (currentUser?.userId) {
      GetProducts();
    }
  }, [currentUser?.userId, search]);

  const AddProducts = async () => {
    const newPage = page + 1;
    try {
      const response = await fetchProducts({
        apiUrl,
        search,
        userId: currentUser?.userId,
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

  // alert state
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  useEffect(() => {
    document.title = "პირადი გვერდი" || "იტვირთება..."; // Sets the document name
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        products,
        totalProducts,
        setProducts,
        GetProducts,
        alert,
        setAlert,
        search,
        setSearch,
        loadingProducts,
        productsRef,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
