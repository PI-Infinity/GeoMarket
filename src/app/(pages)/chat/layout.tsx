"use client";
import { useApp } from "@/app/context/app";
import { redirect, usePathname } from "next/navigation";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Rooms from "./rooms";
import { IoMdArrowDropleft } from "react-icons/io";
import { useChat } from "@/app/context/chat";
import Image from "@/app/components/image";
import { useAuth } from "@/app/context/auth";
import { withAuth } from "../(auth)/withAuth";

interface propsTypes {
  children: any;
}

const Chat: React.FC<propsTypes> = ({ children }) => {
  const { currentUser } = useAuth();

  // useLayoutEffect(() => {
  //   if (!currentUser) {
  //     console.log("run");
  //     redirect("/login");
  //   }
  // }, [currentUser]);

  useEffect(() => {
    // Scroll to the top of the window
    window.scrollTo(0, 0);
  }, [children]);

  // chat context
  const { openChatList } = useChat();

  return (
    <div
      className={`flex-1 flex flex-col laptop:flex-row items-center justify-center w-full gap-2 laptop:gap-4 h-[calc(100vh-8.5rem)]`}
    >
      <div
        className={`bg-gray-100 fixed z-30 ${
          openChatList ? "top-20 laptop:top-0" : "top-0"
        } flex flex-col laptop:flex-row gap-4 items-center w-full  h-full h-full laptop:py-12 laptop:w-3/4 laptop:mr-14 laptop:relative`}
      >
        <div
          className={`h-full w-full absolute  ${
            openChatList ? "top-0 left-0" : "-left-full"
          } laptop:left-0  laptop:w-80 w-full laptop:relative flex z-20 gap-2 laptop:gap-0 laptop:rounded-xl`}
          // style={{ left: pathname === "/chat" ? "0" : "-80%" }}
        >
          <Rooms />
        </div>
        <div className="relative flex-1 w-full h-full text-black laptop:rounded-xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Chat);
