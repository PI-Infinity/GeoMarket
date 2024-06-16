"use client";
import React, { Suspense, useEffect, useState } from "react";
import LeftBar from "./left-bar";
import { useApp } from "@/app/context/app";
import { ProfileContextWrapper } from "@/app/context/profile";
import { useAuth } from "@/app/context/auth";
import { useRouter } from "next/navigation";
import { withAuth } from "../(auth)/withAuth";

interface propsTypes {
  children: any;
}

const User: React.FC<propsTypes> = ({ children }) => {
  const { currentUser } = useAuth();
  const router = useRouter();
  useEffect(() => {
    // Scroll to the top of the window
    window.scrollTo(0, 0);
  }, [children]);
  const { sectionLoading } = useApp();

  return (
    <ProfileContextWrapper>
      <div
        className={`flex-1 flex flex-col laptop:flex-row items-start justify-between w-full gap-2 laptop:gap-4 h-full`}
      >
        <LeftBar />
        <div className="flex flex-col gap-4 items-center w-full h-full laptop:ml-80 laptop:mr-14 laptop:pl-2 laptop:pr-4">
          <div className="relative flex-1 w-full h-full rounded-xl text-black">
            {sectionLoading && (
              <div
                className="h-full w-full z-10 absolute rounded-xl"
                style={{
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                }}
              />
            )}
            {children}
          </div>
        </div>
      </div>
    </ProfileContextWrapper>
  );
};

export default withAuth(User);
