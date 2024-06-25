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
import { useProductsContext } from "../context/products";

const NavigatorMobile: React.FC = () => {
  // define path name
  const pathname = usePathname();

  // router
  const router = useRouter();

  // current user context
  const { currentUser, setCurrentUser, setDestination } = useAuth();

  // notification context
  const { totalUnreads } = useNotifications();

  // app context
  const { setOpenBackDrop } = useApp();

  // products
  const { setRerenderProducts } = useProductsContext();

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
    } else if (scrollPosition === 0) {
      setRerenderProducts((prev: any) => !prev);
    } else {
      router.push("/");
    }
  };

  return (
    <div
      className={`fixed bottom-7 z-30 shadow-md laptop:w-16 px-4  rounded-xl mr-2 ${
        (pathname.includes("/login") ||
          pathname.includes("/signup") ||
          pathname.includes("/chat/") ||
          pathname.startsWith("/admin")) &&
        "hidden"
      } h-12 w-[calc(100%-1rem)] z-20  laptop:hidden`}
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
            size={32}
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
            className={`w-8 bg-gray-200 aspect-square flex items-center justify-center hover:brightness-90 transition-all rounded-full`}
          >
            <div
              style={{ border: "1.5px solid #d9d9d9" }}
              className="shadow-ms rounded-full overflow-hidden h-full w-full"
            >
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
          <div className={`w-8 noneflex-col gap-12 laptop:w-full items-center`}>
            <div
              className="cursor-pointer hover:brightness-105"
              onClick={
                currentUser
                  ? Logout
                  : () => {
                      router.push("/login");
                      setDestination({
                        productId: null,
                        userId: null,
                        page: null,
                      });
                    }
              }
            >
              <MdLogout
                className={`text-red-500 cursor-pointer hover:brightness-95`}
                size={26}
              />
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          whiteSpace: "nowrap",
          background: "white",
          width: "100%",
          overflow: "hidden",
        }}
        className="text-red-500 rounded-full mt-1 h-6 text-center  flex items-center justify-center"
      >
        <div
          style={{ fontSize: "12px" }}
          className="animate-marquee font-semibold"
        >
          პლატფორმა მუშაობს სატესტო რეჟიმში, ხარვეზების დაფიქსირების შემთხვევაში{" "}
          <Link
            href="/support"
            style={{
              fontSize: "12px",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            className="font-bold ml-1"
          >
            მოგვწერეთ!
          </Link>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NavigatorMobile;
