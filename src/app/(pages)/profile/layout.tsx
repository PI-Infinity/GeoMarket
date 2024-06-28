"use client";
import { ProfileContextWrapper } from "@/app/context/profile";
import React, { useEffect } from "react";
import { withAuth } from "../(auth)/withAuth";
import LeftBar from "./left-bar";
import Delivery from "@/app/advertisements/delivery";

interface propsTypes {
  children: any;
}

const User: React.FC<propsTypes> = ({ children }) => {
  useEffect(() => {
    // Scroll to the top of the window
    window.scrollTo(0, 0);
  }, [children]);

  return (
    <ProfileContextWrapper>
      <div
        className={`flex-1 flex flex-col laptop:flex-row items-start justify-between w-full gap-2 laptop:gap-4 h-full`}
      >
        <div className="flex-1 flex w-full laptop:hidden">
          <Delivery />
        </div>
        <LeftBar />
        <div className="flex flex-col gap-4 items-center w-full h-full laptop:ml-80 laptop:mr-14 laptop:pl-2 laptop:pr-4">
          <div className="relative flex-1 w-full h-full rounded-xl text-black">
            {children}
          </div>
        </div>
      </div>
    </ProfileContextWrapper>
  );
};

export default withAuth(User);
