"use client";
import { useApp } from "@/app/context/app";
import getUsers from "@/app/hooks/getUsers";
import React, { useEffect, useState } from "react";
import Search from "./search";
import { useChat } from "@/app/context/chat";

const Chats = () => {
  // app context
  const { activeLanguage } = useApp();

  // chat state
  const { createChatMobile, setCreateChatMobile } = useChat();

  // active state
  const [activeState, setActiveState] = useState("start");

  return (
    <>
      <div className="shadow-md h-full laptop:bg-white hidden relative rounded-xl laptop:flex items-center justify-center">
        {activeState === "start" ? (
          <div
            onClick={() => setActiveState("search")}
            className="py-2 px-4 w-80 rounded-full text-center cursor-pointer hover:brightness-95 shadow-md text-green-500 bg-white font-semibold"
          >
            {activeLanguage?.startConversation}
          </div>
        ) : (
          <div className="w-2/3 absolute top-32">
            <Search />
          </div>
        )}
      </div>
      <div
        onClick={() => {
          setCreateChatMobile(false);
        }}
        className="w-2/3 absolute -top-2 z-20 w-full h-screen pt-24 px-8"
        style={{
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          transform: createChatMobile ? "scale(1)" : "scale(0)",
          opacity: createChatMobile ? "1" : "0",
          transition: "ease-in 200ms",
        }}
      >
        <div className="flex-1" onClick={(e) => e.stopPropagation()}>
          <Search />
        </div>
      </div>
    </>
  );
};

export default Chats;
