"use client";
import Image from "@/app/components/image";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { Badge } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  MdArrowDropUp,
  MdChat,
  MdLogout,
  MdNotifications,
} from "react-icons/md";
import { useChat } from "../context/chat";
import { useNotifications } from "../context/notifications";
import { removeCookie } from "../utils/cookies";
import { BsChatHeartFill } from "react-icons/bs";

const Navigator: React.FC = () => {
  // define path name
  const pathname = usePathname();

  // router
  const router = useRouter();

  // current user context
  const { currentUser, setCurrentUser, setDestination } = useAuth();

  // notification context
  const { totalUnreads } = useNotifications();

  // app context
  const { setOpenBackDrop, sMobile } = useApp();

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
      router.push("/login");

      setDestination({
        productId: null,
        userId: null,
        page: null,
      });

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
      } h-12 laptop:h-[calc(100%-8.5rem)] w-[calc(100%-1rem)] z-20 hidden laptop:flex laptop:flex-col items-center justify-between`}
      style={{
        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",
        background: "white",
      }}
    >
      <div
        className={`flex rounded-md w-full h-full flex-row justify-between laptop:justify-start p-0 laptop:flex-col gap-4 items-center`}
      >
        {currentUser?.admin?.active && (
          <Link
            href={"/admin"}
            className="bg-red w-10 h-10 rounded-full bg-red-500 flex justify-center items-center cursor-pointer hover:brightness-95 shadow-md"
          >
            <h2>A</h2>
          </Link>
        )}
        {!pathname.includes("/profile") && (
          <Link
            href={currentUser ? "/profile/products" : "/login"}
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
        )}
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
                className="text-gray-300 cursor-pointer hover:brightness-95"
              />
            </Badge>
          </Link>
        )}
        <Link
          href={currentUser ? `/chat` : "/login"}
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
        >
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
              size={30}
              className="text-gray-300 cursor-pointer hover:brightness-95"
            />
          </Badge>
        </Link>
        <MdArrowDropUp
          color="red"
          size={32}
          className={`${
            scrollPosition > 100 ? "scale-1" : "scale-0"
          } transition-all cursor-pointer hover:brightness-95`}
        />
        {pathname.includes("/profile") && (
          <div
            className={`laptop:mt-auto laptop:bm-8 none laptop:flex flex-col gap-12 laptop:w-full items-center`}
          >
            <div
              className="cursor-pointer hover:brightness-105"
              onClick={Logout}
            >
              <MdLogout color="black" size={24} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigator;
