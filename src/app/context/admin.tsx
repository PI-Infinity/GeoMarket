"use client";
import { ReactNode, createContext, useContext, useState } from "react";

/**
 * Admin state context
 */

const AdminContext = createContext<any>(null);

export const useAdminContext = () => useContext(AdminContext);

interface contextProps {
  children: ReactNode;
}

export const AdminContextWrapper: React.FC<contextProps> = ({ children }) => {
  return (
    <AdminContext.Provider value={{ menuList }}>
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
  {
    path: "subscriptions",
    label: "Subscriptions",
  },
  {
    path: "analytics",
    label: "Analytics",
  },
  {
    path: "conversations",
    label: "Conversations",
  },
];
