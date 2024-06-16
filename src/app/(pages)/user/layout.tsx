"use client";
import { useApp } from "@/app/context/app";
import { UserContextWrapper } from "@/app/context/user";
import React, { useEffect } from "react";
import LeftBar from "./[id]/left-bar";
import { usePathname } from "next/navigation";

interface propsTypes {
  children: any;
}

const User: React.FC<propsTypes> = ({ children }) => {
  useEffect(() => {
    // Scroll to the top of the window
    window.scrollTo(0, 0);
  }, []);
  // pathname
  const pathname = usePathname();

  return (
    <div
      style={{ minHeight: "calc(100vh - 8.5rem" }}
      className="flex-1 flex flex-col laptop:flex-row items-start laptop:justify-between w-full laptop:pr-2 h-full gap-2"
    >
      {!pathname.includes("user/product") && <LeftBar />}
      <div
        className={`flex flex-col gap-2 items-center w-full h-full laptop:ml-${
          pathname.includes("user/product") ? 0 : 80
        } laptop:mr-16 laptop:pl-${pathname.includes("user/product") ? 0 : 2}`}
      >
        <div className="flex-1 w-full laptop:p-2 h-full overflow-hidden laptop:bg-white rounded-xl laptop:shadow-sm text-black">
          {children}
        </div>
      </div>
    </div>
  );
};

export default User;
