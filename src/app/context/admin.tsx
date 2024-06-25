"use client";
import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApp } from "./app";

/**
 * Admin state context
 */

const AdminContext = createContext<any>(null);

export const useAdminContext = () => useContext(AdminContext);

interface contextProps {
  children: ReactNode;
}

export const AdminContextWrapper: React.FC<contextProps> = ({ children }) => {
  const { apiUrl } = useApp();

  // rerender stats
  const [rerender, setRerender] = useState(false);
  const [loading, setLoading] = useState(false);
  /**
   * get dashboard stats
   */
  const [stats, setStats] = useState(null);

  const GetStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiUrl + "/api/v1/admin");
      if (response.data.status === "success") {
        setStats(response.data.data);
        setLoading(false);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    GetStats();
  }, [rerender]);
  return (
    <AdminContext.Provider value={{ menuList, stats, setRerender, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

/**
 * Menu items
 */

export const menuList = [
  {
    path: "",
    label: "Dashboard",
  },
  {
    path: "products",
    label: "Products",
  },
  {
    path: "users",
    label: "Users",
  },
  // {
  //   path: "subscriptions",
  //   label: "Subscriptions",
  // },
  {
    path: "analytics",
    label: "Analytics",
  },
  {
    path: "conversations",
    label: "Conversations",
  },
];
