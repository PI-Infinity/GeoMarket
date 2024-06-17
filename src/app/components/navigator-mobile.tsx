"use client";
import Image from "@/app/components/image";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { Badge } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import nProgress from "nprogress";
import React, { memo, useEffect, useState } from "react";
import { BsChatHeartFill } from "react-icons/bs";
import { GrHomeOption } from "react-icons/gr";
import {
  MdArrowDropUp,
  MdLogout,
  MdNotifications,
  MdPeople,
} from "react-icons/md";
import { useChat } from "../context/chat";
import { useNotifications } from "../context/notifications";
import { removeCookie } from "../utils/cookies";

const NavigatorMobile: React.FC = () => {
  // define path name
  const pathname = usePathname();

  // router
  const router = useRouter();

  // current user context
  const { currentUser, setCurrentUser } = useAuth();

  // notification context
  const { totalUnreads } = useNotifications();

  // app context
  const { setOpenBackDrop } = useApp();

  // chat context
  const { unreadChats } = useChat();

  /**
   * Logout function
   */
  const Logout = async () => {
    try {
      setOpenBackDrop(true);

      removeCookie("GeoMarket:currentUser");

      setCurrentUser(null);
      // googleLogout();
      router.push("/");
      setTimeout(() => {
        setOpenBackDrop(false);
      }, 700);
    } catch (error) {
      console.error("Logout error:", error);
      // Handle any errors here, such as updating UI to show an error message
    }
  };

  // State to store scroll position
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    if (scrollPosition > 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  return (
    <div
      className={`fixed bottom-2 z-30 laptop:top-20 laptop:mt-2 shadow-md laptop:w-16 px-4 laptop:px-0 laptop:py-4 laptop:right-0 laptop:pb-4 laptop:shadow-sm  rounded-xl mr-2 laptop:bg-white ${
        (pathname.includes("/login") ||
          pathname.includes("/signup") ||
          pathname.includes("/chat/") ||
          pathname.startsWith("/admin")) &&
        "hidden"
      } h-12 bg-white-50 laptop:bg-white laptop:h-[calc(100%-8.5rem)] w-[calc(100%-1rem)] z-20 flex laptop:hidden laptop:flex-col items-center justify-between`}
      style={{
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
      }}
    >
      <div
        className={`flex rounded-md w-full h-full flex-row justify-between laptop:justify-start p-0 laptop:flex-col gap-4 items-center`}
      >
        <div
          className="laptop:hidden relative flex items-center justify-center"
          onClick={handleClick}
        >
          <MdArrowDropUp
            size={24}
            color="red"
            className={`${
              scrollPosition > 300 ? "scale-1" : "scale-0"
            } transition-all cursor-pointer hover:brightness-95`}
          />

          <GrHomeOption
            size={30}
            className={`${
              pathname === "/" ? "text-red-500" : "text-gray-300"
            } cursor-pointer hover:brightness-95 absolute`}
          />
        </div>
        {currentUser?.admin?.active && (
          <Link
            href={"/admin"}
            className="bg-red w-10 h-10 rounded-full bg-red-500 flex justify-center items-center cursor-pointer hover:brightness-95 shadow-md"
          >
            <h2>A</h2>
          </Link>
        )}
        <Link href="/sellers">
          <MdPeople
            size={36}
            className={`${
              pathname === "/sellers" ? "text-red-500" : "text-gray-300"
            } cursor-pointer hover:brightness-95`}
          />
        </Link>
        <Link href={currentUser ? `/chat` : "/login"}>
          <Badge
            badgeContent={unreadChats?.length}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "red", // Sets the badge background color
                color: "white", // Sets the badge text color
              },
            }}
          >
            <BsChatHeartFill
              size={28}
              className={`${
                pathname.includes("/chat") ? "text-red-500" : "text-gray-300"
              } cursor-pointer hover:brightness-95`}
            />
          </Badge>
        </Link>
        {currentUser && (
          <Link href={`/notifications`}>
            <Badge
              badgeContent={totalUnreads}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "red", // Sets the badge background color
                  color: "white", // Sets the badge text color
                },
              }}
            >
              <MdNotifications
                size={32}
                className={`${
                  pathname === "/notifications"
                    ? "text-red-500"
                    : "text-gray-300"
                } cursor-pointer hover:brightness-95`}
              />
            </Badge>
          </Link>
        )}
        {!pathname.includes("/profile") ? (
          <Link
            href={currentUser ? "/profile/products" : "/login"}
            className={`w-8 laptop:w-3/5 bg-gray-200 aspect-square flex items-center justify-center hover:brightness-90 transition-all rounded-full`}
          >
            <div className="shadow-ms rounded-full overflow-hidden h-full w-full">
              <Image
                alt={currentUser?.name || "alt"}
                src={currentUser?.cover?.url}
                style={{
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </Link>
        ) : (
          <div
            className={`laptop:mt-auto w-8 laptop:bm-8 none laptop:flex flex-col gap-12 laptop:w-full items-center`}
          >
            <div
              className="cursor-pointer hover:brightness-105"
              onClick={currentUser ? Logout : () => router.push("/login")}
            >
              <MdLogout
                className={`text-red-500 cursor-pointer hover:brightness-95`}
                size={26}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigatorMobile;
