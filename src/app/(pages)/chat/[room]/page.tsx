"use client";
import Image from "@/app/components/image";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useChat } from "@/app/context/chat";
import axios from "axios";
import Link from "next/link";
import { act, useEffect, useState } from "react";
import { MdAdd, MdCall, MdClose } from "react-icons/md";
import { MoonLoader } from "react-spinners";
import Input from "./input";
import MessageItem from "./messageItem";
import { OnlineBadge } from "@/app/components/onlineBadge";
import { usePathname } from "next/navigation";

const ChatRoom = () => {
  // app context
  const { apiUrl } = useApp();

  // chat context
  const {
    activeRoom,
    loadingMessages,
    messagesRef,
    totalMessages,
    messages,
    AddMessages,
    setMessages,
    GetMessages,
    GetRoom,
    setOpenChatList,
    setChats,
    setUnreadChats,
    setActiveRoom,
  } = useChat();

  // current user
  const { currentUser } = useAuth();

  // define target user

  let targetUser =
    activeRoom.roomId?.length > 0 &&
    activeRoom?.members?.find((i: any) => i.id !== currentUser?.userId);

  // read chat
  const OpenChatAndRead = async (item: any) => {
    setOpenChatList(false);
    if (
      item?.lastMessage?.status === "unread" &&
      item?.lastMessage?.sender !== currentUser?.userId
    ) {
      // Update the last message in the chats array
      setChats((prev: any) => {
        return prev.map((chat: any) => {
          if (chat.roomId === item?.roomId) {
            return {
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                status: "read",
                online: activeRoom?.online,
              },
            };
          } else {
            return chat;
          }
        });
      });

      setUnreadChats((prev: any) =>
        prev.filter((i: any) => i.roomId !== item.roomId)
      );

      try {
        await axios.patch(apiUrl + "/api/v1/chats/" + item.roomId, {
          lastMessage: {
            status: "read",
            sender: item?.lastMessage?.sender,
            text: item?.lastMessage?.text,
          },
        });
      } catch (error) {
        console.error("Error updating chat status:", error);
      }
    }
  };

  // getting messages
  useEffect(() => {
    if (activeRoom?.roomId?.length > 0) {
      OpenChatAndRead(activeRoom);
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
    <div className="relative w-full h-full rounded-xl shadow-md flex flex-col overflow-hidden">
      <div className="h-16 shadow-md w-full bg-gray-50 flex items-center z-10 gap-2 pl-4 p-2">
        <OnlineBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          isonline={activeRoom.online ? "online" : "offline"}
        >
          <Link
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

        <Link href={`/user/${targetUser?.userId}/products`}>
          <h4 className="cursor-pointer hover:brightness-95 ml-2">
            {targetUser?.name}
          </h4>
        </Link>
        <div className="ml-auto flex items-center gap-8">
          {!targetUser?.phone?.number && (
            <a
              href={`tel:${targetUser?.phone?.number}`}
              className="no-underline"
            >
              <div className="cursor-pointer hover:brightness-95 flex items-center gap-2">
                <MdCall size={24} className="text-gray-500" />
                599484604
                {targetUser?.phone?.number}
              </div>
            </a>
          )}

          <Link href="/chat" className="pr-2">
            <MdClose
              size={24}
              color="red"
              className="hover:brightness-95 cursor-pointer"
            />
          </Link>
        </div>
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
