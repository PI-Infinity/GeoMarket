"use client";
import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useApp } from "./app";
import { useAuth } from "./auth";
import fetchProducts from "../hooks/getProducts";

/**
 * Products state context
 */

const ProductsContext = createContext<any>(null);

export const useProductsContext = () => useContext(ProductsContext);

// Define the Product interface
interface Product {
  productId: string;
  title: string;
  // other product fields
}

export const ProductsContextWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  // app context
  const { apiUrl, activeLanguage } = useApp();

  /**
   * get products from db
   */
  const [products, setProducts] = useState<Product[]>([]);

  // active grid style on mobile
  const [activeGrid, setActiveGrid] = useState("double");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState([0, 100000]);
  const [byOrder, setByOrder] = useState(true);
  const [rerenderProducts, setRerenderProducts] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(null);
  const [displayedIds, setDisplayedIds] = useState<any>([]);

  useEffect(() => {
    const GetProducts = async () => {
      setLoadingProducts(true);
      const data = await fetchProducts({
        apiUrl,
        search,
        category,
        price,
        page: 1,
        byOrder,
        // displayedIds: displayedIds?.length > 0 ? displayedIds.join(",") : "",
      });
      setProducts(data.data.products);
      if (data.totalProducts === 1) {
        setActiveGrid("single");
      } else {
        setActiveGrid("double");
      }
      setTotalProducts(data.totalProducts);
      // setDisplayedIds(data.data.products?.map((i: any) => i?.productId));
      setPage(1);
      setLoadingProducts(false);
    };
    GetProducts();
  }, [rerenderProducts, category, search, price, byOrder]);

  const AddProducts = async () => {
    const newPage = page + 1;
    try {
      const data = await fetchProducts({
        apiUrl,
        search,
        category,
        price,
        page: newPage,
        byOrder,
        // displayedIds: displayedIds?.length > 0 ? displayedIds.join(",") : "",
      });
      setProducts((prevProducts) => {
        // Create a new set with existing product IDs for quick lookup
        const existingIds = new Set(
          prevProducts.map((product) => product.productId)
        );

        // Filter out duplicates from the newly fetched products based on product ID
        const filteredNewProducts = data.data.products.filter(
          (p: any) => !existingIds.has(p.productId)
        );

        if (filteredNewProducts.length > 0) {
          return [...prevProducts, ...filteredNewProducts];
        } else {
          return [...prevProducts];
        }
      });
      // setDisplayedIds((prevIds: any) => {
      //   // Create a new set with existing product IDs for quick lookup
      //   const existingIds = new Set(prevIds);

      //   // Filter out duplicates from the newly fetched products based on product ID
      //   const filteredNewProducts = data.data.products.filter(
      //     (p: any) => !existingIds.has(p.productId)
      //   );

      //   // Map filtered products to get their IDs
      //   const newProductIds = filteredNewProducts.map((p: any) => p.productId);

      //   if (newProductIds.length > 0) {
      //     return [...prevIds, ...newProductIds];
      //   } else {
      //     return prevIds;
      //   }
      // });
      setPage(newPage);
    } catch (error) {
      console.log(error);
    }
  };

  // products ref
  const productsRef = useRef<HTMLDivElement>();
  const [scrollY, setScrollY] = useState(false);

  // Function to scroll back to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      // Ensure productsRef.current is not null before accessing its properties
      if (productsRef.current) {
        const { bottom } = productsRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (window.pageYOffset > 300) {
          setScrollY(true);
        } else {
          setScrollY(false);
        }

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

  const categories = [
    {
      value: "",
      label: activeLanguage?.all,
    },
    {
      value: "souvenirs",
      label: activeLanguage?.souvenirs,
    },
    {
      value: "paintings",
      label: activeLanguage?.paintings,
    },
    {
      value: "accessories",
      label: activeLanguage?.accessories,
    },
    {
      value: "jewellery",
      label: activeLanguage?.jewellery,
    },

    // {
    //   value: "clothing-footwear",
    //   label: "Clothing / Footwear",
    // },
    // {
    //   value: "clothing-footwear",
    //   label: "Clothing / Footwear",
    // },
    {
      value: "decorations",
      label: activeLanguage?.decorations,
    },
    {
      value: "dishes",
      label: activeLanguage?.dishes,
    },
    {
      value: "toys",
      label: activeLanguage?.toys,
    },
    {
      value: "other",
      label: activeLanguage?.other,
    },

    // {
    //   value: "food",
    //   label: "Food",
    // },
    // {
    //   value: "beverages",
    //   label: "Beverages",
    // },
  ];

  return (
    <ProductsContext.Provider
      value={{
        products,
        setProducts,

        rerenderProducts,
        setRerenderProducts,
        category,
        setCategory,
        categories,
        loadingProducts,
        setLoadingProducts,
        search,
        setSearch,
        price,
        setPrice,
        byOrder,
        setByOrder,
        productsRef,
        scrollToTop,
        scrollY,
        setScrollY,
        totalProducts,
        activeGrid,
        setActiveGrid,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
