"use client";
import { useApp } from "@/app/context/app";
import getUsers from "@/app/hooks/getUsers";
import React, { useEffect, useState } from "react";
import Search from "./search";
import { useChat } from "@/app/context/chat";

const Chats = () => {
  // app state
  const { openChatList } = useChat();

  // app context
  const { isMobile } = useApp();

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
            Start New Conversation
          </div>
        ) : (
          <div className="w-2/3 absolute top-32">
            <Search />
          </div>
        )}
      </div>
    </>
  );
};

export default Chats;
