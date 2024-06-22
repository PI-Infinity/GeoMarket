"use client";
import React, { useEffect } from "react";
import { withAdmin } from "../(pages)/(auth)/withAdmin";
import { AdminContextWrapper } from "../context/admin";
import LeftBar from "./left-bar";

interface propsTypes {
  children: any;
}

const Layout: React.FC<propsTypes> = ({ children }) => {
  useEffect(() => {
    // Scroll to the top of the window
    window.scrollTo(0, 0);
  }, [children]);

  return (
    <AdminContextWrapper>
      <div
        className={`flex-1 flex flex-col laptop:flex-row items-start justify-between w-full gap-2 laptop:gap-4 h-full`}
      >
        <div className="w-full">
          <LeftBar />
          <div className="flex flex-col gap-4 items-center h-full laptop:ml-80 laptop:mr-14 laptop:pl-2 laptop:pr-4">
            <div className="relative flex-1 w-full h-full rounded-xl text-black">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AdminContextWrapper>
  );
};

export default withAdmin(Layout);
