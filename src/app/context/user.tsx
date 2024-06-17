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
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import getUser from "../hooks/getUser";

/**
 * User state context
 */

const UserContext = createContext<any>(null);

export const useUserContext = () => useContext(UserContext);

interface contextProps {
  children: ReactNode;
}

export const UserContextWrapper: React.FC<contextProps> = ({ children }) => {
  // app context
  const { apiUrl } = useApp();

  // auth state
  const { currentUser } = useAuth();

  // alert state
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  // path
  const pathname = usePathname();
  const userId = pathname.split("/")[2];

  /**
   * user
   */

  const [user, setUser] = useState({ userId: "" });

  const GetUser = async () => {
    try {
      const response = await getUser({ apiUrl, userId });
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      user?.userId?.length < 1 &&
      userId &&
      pathname.includes(`/user`) &&
      !pathname.includes(`/user/product`)
    ) {
      GetUser();
    }
  }, [userId, user?.userId, pathname]);

  /**
   * product
   */
  const [product, setProduct] = useState({
    productId: "",
    seller: { userId: "" },
  });

  const prevUrlRef = useRef("");

  // when navigation from product to product or from user to user with back btn dont replace old items
  useEffect(() => {
    const handlePopState = () => {
      const { pathname } = window.location;
      const productIdMatch = pathname.match(/^\/user\/product\/\w+/);
      const prevProductIdMatch = prevUrlRef.current.match(
        /^\/user\/product\/\w+/
      );

      if (productIdMatch && prevProductIdMatch) {
        setProduct({ productId: "", seller: { userId: "" } });
        setUser({ userId: "" });
      }

      // Update previous URL reference
      prevUrlRef.current = pathname;
    };

    // Listen to the popstate event (triggered when the user navigates back or forward)
    window.addEventListener("popstate", handlePopState);

    // Set the initial previous URL
    prevUrlRef.current = window.location.pathname;

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  /**
   * count visit in product page
   */
  const setView = async () => {
    const identifier = Cookies.get("uniqueIdentifier");
    try {
      await axios.post(
        apiUrl +
          "/api/v1/products/" +
          product?.productId +
          "/view?user=" +
          identifier
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (product?.productId?.length > 0) {
      if (product.seller?.userId !== currentUser?.userId) {
        setView();
      }
    }
  }, [product, currentUser]);

  return (
    <UserContext.Provider
      value={{
        alert,
        setAlert,
        user,
        setUser,
        product,
        setProduct,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
