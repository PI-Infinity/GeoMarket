"use client";
import Image from "@/app/components/image";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useChat } from "@/app/context/chat";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { MoonLoader } from "react-spinners";
import Input from "./input";
import MessageItem from "./messageItem";
import { OnlineBadge } from "@/app/components/onlineBadge";
import { usePathname } from "next/navigation";

const ChatRoom = () => {
  // use app context
  const { setLoading, apiUrl } = useApp();
  // chat context
  const {
    activeRoom,
    setChats,
    totalChats,
    loadingMessages,
    messagesRef,
    totalMessages,
    messages,
    AddMessages,
    setMessages,
    GetMessages,
    GetRoom,
  } = useChat();

  // current user
  const { currentUser } = useAuth();

  // define target user

  let targetUser =
    activeRoom.roomId?.length > 0 &&
    activeRoom?.members?.find((i: any) => i.id !== currentUser?.userId);

  // getting messages
  useEffect(() => {
    if (activeRoom?.roomId?.length > 0) {
      GetMessages();
    }
  }, [activeRoom?.roomId]);

  // pathname
  const pathname = usePathname();
  const roomId = pathname.split("/").pop();

  useEffect(() => {
    if (roomId && activeRoom?.roomId?.length < 1) {
      GetRoom(roomId);
    }
  }, [roomId, currentUser]);

  return (
    <div className="w-full h-full rounded-xl shadow-md flex flex-col overflow-hidden">
      <div className="h-16 shadow-md w-full bg-gray-50 flex items-center z-10 gap-2 pl-4 p-2">
        <OnlineBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          isonline={activeRoom.online ? "online" : "offline"}
        >
          <Link
            onClick={() => setLoading(true)}
            href={`/user/${targetUser?.userId}/products`}
            className={`cursor-pointer hover:brightness-95 relative shadow-md w-10 h-10 aspect-square overflow-hidden bg-gray-300 rounded-full overflow-hidden flex items-center justify-center`}
          >
            <Image
              alt={targetUser?.name}
              src={targetUser?.cover?.url}
              style={{
                aspectRatio: 1,
                zIndex: 0,
                width: "100%",
              }}
            />
          </Link>
        </OnlineBadge>

        <Link
          onClick={() => setLoading(true)}
          href={`/user/${targetUser?.userId}/products`}
        >
          <h4 className="cursor-pointer hover:brightness-95 ml-2">
            {targetUser?.name}
          </h4>
        </Link>
        <Link href="/chat" className="flex laptop:hidden ml-auto">
          <MdClose color="red" size={24} />
        </Link>
        {activeRoom?.targetProduct && (
          <Link
            onClick={() => setLoading(true)}
            href={`/user/product/${activeRoom?.targetProduct?.productId}`}
            className={`hidden h-full w-1/3 ml-auto mr-2 cursor-pointer hover:brightness-95 relative shadow-md aspect-square overflow-hidden bg-gray-50 rounded-md overflow-hidden laptop:flex items-center gap-2 pl-2`}
          >
            <div
              className={`relative shadow-md w-8 h-8 aspect-square overflow-hidden rounded-md overflow-hidden`}
            >
              <Image
                alt={activeRoom?.targetProduct.title.ka}
                src={
                  activeRoom?.targetProduct?.gallery?.find(
                    (it: any) => it.cover
                  ).url
                }
                style={{
                  aspectRatio: 1,
                  zIndex: 0,
                  width: "100%",
                }}
              />
            </div>
            <h4 className="cursor-pointer hover:brightness-95">
              {activeRoom?.targetProduct?.title?.ka}
            </h4>
            <div className="ml-auto pr-2">
              <MdClose
                size={24}
                color="red"
                className="hover:brightness-95 cursor-pointer"
                onClick={() => alert("remove item from chat")}
              />
            </div>
          </Link>
        )}
      </div>
      <div
        className="flex-1 overflow-y-auto p-2"
        style={{
          display: "flex",
          flexDirection: "column-reverse",
        }}
        ref={messagesRef}
      >
        {loadingMessages ? (
          <div className="h-full w-full flex items-center justify-center">
            <MoonLoader size={30} />
          </div>
        ) : (
          messages?.length > 0 &&
          messages?.map((item: any, index: number) => {
            return <MessageItem key={index} item={item} />;
          })
        )}
        {messages?.length > 29 &&
          totalMessages &&
          totalMessages > messages?.length && (
            <div className="w-full flex justify-center">
              <div
                className="border-full rounded-full shadow-md px-3 py-1 cursor-pointer hover:bgightness-95 w-32 text-center"
                onClick={AddMessages}
              >
                Load More
              </div>
            </div>
          )}
      </div>
      <div className="h-20 w-full">
        <Input messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
};

export default ChatRoom;
