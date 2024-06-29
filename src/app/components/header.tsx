"use client";
import { useApp } from "@/app/context/app";
import Link from "next/link";
import { usePathname } from "next/navigation";
import nProgress from "nprogress";
import HeadRoom from "react-headroom";
import { MdAdd, MdPeople } from "react-icons/md";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useChat } from "../context/chat";
import { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import CarouselComponent from "../advertisements/delivery";

export default function Header() {
  // define path name
  const pathname = usePathname();

  // app context
  const { openMenu, setOpenMenu, isMobile, setIsLoading, activeLanguage } =
    useApp();

  // auth state
  const { currentUser, setDestination } = useAuth();

  // chat context
  const { setCreateChatMobile, createChatMobile } = useChat();

  // loading context

  useEffect(() => {
    setTimeout(() => {
      setIsLoading();
    }, 500);
  }, []);

  return (
    <HeadRoom
      downTolerance={10}
      upTolerance={10}
      disable={isMobile ? false : true}
      className={`fixed top-0 left-0 p-0 h-16 
      z-20 w-full `}
    >
      <ProgressBar
        height="0.3rem"
        color="#DA291C"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <div
        style={{
          boxSizing: "border-box",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          // background: isMobile ? "rgba(255,255,255,0.5)" : "white",
        }}
        className="h-full w-full laptop:p-4 laptop:h-20 flex items-center justify-between shadow-md  laptop:shadow-sm laptop:bg-white whitespace-nowrap"
      >
        {
          <Link
            href="/"
            className="flex items-center w-96 p-4 gap-4 cursor-default"
            style={{ color: "#DA291C" }}
          >
            <h1 className="cursor-pointer text-4xl">
              {pathname.startsWith("/admin") ? "Admin" : "Geo Market"}
            </h1>
          </Link>
        }

        {pathname !== "/sellers" && !pathname?.includes("/admin") && (
          <Link
            href="/sellers"
            className="hidden laptop:flex items-center gap-2 ml-auto shadow-md text-gray-500 rounded-full bg-gray-50 px-4 py-1 cursor-pointer hover:brightness-95"
          >
            <MdPeople size={20} color="red" />
            {activeLanguage?.sellers}
          </Link>
        )}
        <div
          className="flex min-w-24 items-center justify-end p-4 pr-3"
          style={{ display: pathname?.includes("/admin") ? "none" : "flex" }}
        >
          {pathname !== "/chat" && (
            <Link
              href={currentUser ? "/profile/products/addProduct" : "/login"}
              style={{ color: "#a9a9a9" }}
              onClick={
                currentUser
                  ? undefined
                  : () => {
                      setDestination({
                        productId: null,
                        userId: null,
                        page: null,
                      });
                    }
              }
              className="flex items-center gap-1 mr-6 rounded-full shadow-md px-3 py-1 cursor-pointer hover:brightness-95 bg-white"
            >
              <MdAdd size={24} color="red" />
            </Link>
          )}

          {pathname === "/chat" && !createChatMobile && (
            <div
              style={{ fontWeight: "600" }}
              onClick={() => setCreateChatMobile(true)}
              className="flex text-gray-300 text-sm laptop:hidden items-center gap-1 mr-6 rounded-full shadow-md px-3 py-1 cursor-pointer hover:brightness-95 bg-white"
            >
              <MdAdd size={18} />
              {activeLanguage?.new}
            </div>
          )}
          <div
            className="flex flex-col gap-1 cursor-pointer"
            onClick={() => setOpenMenu((prev: boolean) => !prev)}
          >
            <div
              className={`w-7 h-1 bg-red-500 rounded-xl transition-transform duration-200 ease-in-out transform ${
                openMenu ? "rotate-45 translate-y-2" : ""
              }`}
            ></div>
            <div
              className={`w-7 h-1 bg-red-500 rounded-xl transition-transform duration-200 ease-in-out transform ${
                openMenu ? "scale-0" : "scale-100"
              }`}
            ></div>
            <div
              className={`w-7 h-1 bg-red-500 rounded-xl transition-transform duration-200 ease-in-out transform ${
                openMenu ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></div>
          </div>
        </div>
      </div>
    </HeadRoom>
  );
}
