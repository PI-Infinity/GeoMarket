"use client";
import Image from "@/app/components/image";
import { OnlineBadge } from "@/app/components/onlineBadge";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useChat } from "@/app/context/chat";
import { useUserContext } from "@/app/context/user";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdDiamond, MdDoneAll, MdImage, MdRemove } from "react-icons/md";

const RoomItem = ({ item }: any) => {
  // app context
  const { apiUrl, setLoading, isMobile } = useApp();

  // router
  const router = useRouter();

  // pathname
  const pathname = usePathname();

  // products context
  const { setProduct } = useUserContext();

  // defines room id from path
  const {
    activeRoom,
    setActiveRoom,
    setChats,
    setOpenChatList,
    setUnreadChats,
  } = useChat();

  // auth state
  const { currentUser } = useAuth();

  // target user
  let targetUser = item.members?.find((i: any) => i.id !== currentUser?.userId);

  // delete confirm
  const [confirm, setConfirm] = useState({ room: "" });

  const DeleteChat = async () => {
    try {
      const response = await axios.delete(
        apiUrl +
          "/api/v1/chats/" +
          confirm?.room +
          "?userId=" +
          currentUser?.userId
      );
      if (response.data.status === "success") {
        setChats((prev: any) =>
          prev.filter((i: any) => i.roomId !== confirm?.room)
        );
      }
      setConfirm({ room: "" });
      if (activeRoom?.roomId === confirm.room) {
        router.push("/chat");
      }
    } catch (error: any) {
      setConfirm({ room: "" });
      console.log(error.response);
    }
  };

  // defines user is online or not
  const [online, setOnline] = useState(false);
  useEffect(() => {
    const GetUserStatus = async () => {
      try {
        const response = await axios.get(
          apiUrl + "/api/v1/users/" + targetUser?.id + "/status"
        );
        if (response.data.status === "success") {
          setOnline(response.data.data.status);
          if (
            activeRoom.roomId?.length > 0 &&
            activeRoom.members.some((i: any) => i.id === targetUser.id)
          ) {
            setActiveRoom((prev: any) => ({
              ...prev,
              online: response.data.data.status,
            }));
          }
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    if (targetUser) {
      GetUserStatus();
    }

    const intervalId = setInterval(() => {
      GetUserStatus();
    }, 300000); // 300000 milliseconds = 5 minutes

    // Clean up the interval on component unmount or when targetUser changes
    return () => clearInterval(intervalId);
  }, [targetUser]);

  // read chat
  const OpenChatAndRead = async (item: any) => {
    setActiveRoom({ ...item, online });
    router.push(`/chat/${item.roomId}`);
    setOpenChatList(false);
    if (isMobile) {
      setLoading(true);
    }
    if (
      item?.lastMessage?.status === "unread" &&
      item?.lastMessage?.sender !== currentUser?.userId
    ) {
      console.log("run");
      // Update the last message in the chats array
      setChats((prev: any) => {
        return prev.map((chat: any) => {
          if (chat.roomId === item?.roomId) {
            return {
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                status: "read",
                online: online,
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

  return (
    <>
      {confirm.room === item.roomId ? (
        <div className="flex items-center rounded-xl w-full shadow-md p-2 cursor-pointer hover:brightness-95">
          <div className="flex items-center justify-evenly font-semibold w-full h-full">
            <div
              className="text-red-500 w-1/4 aspect-square flex items-center justify-center hover:brightness-90"
              onClick={() => setConfirm({ room: "" })}
            >
              No
            </div>{" "}
            <div
              onClick={DeleteChat}
              className="text-green-500 w-1/4 aspect-square flex items-center justify-center hover:brightness-90"
            >
              Yes
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => OpenChatAndRead(item)}
          style={{
            background:
              activeRoom?.roomId === item.roomId && pathname !== "/chat"
                ? "rgba(0,0,0,0.1)"
                : "white",
          }}
          className="flex relative items-center rounded-xl shadow-md p-2 cursor-pointer hover:brightness-95"
        >
          {item?.targetProduct && (
            <Link
              style={{ border: "2px solid red" }}
              href={`/user/product/${item?.targetProduct?.productId}`}
              className="w-8 h-8 top-2 aspect-square absolute z-10 left-1 1top-1 shadow-xl bg-red-500 rounded-full overflow-hidden hover:brightness-90"
            >
              <Image
                alt={item?.targetProduct?.title.ka}
                src={item?.targetProduct?.gallery.find((i: any) => i.cover).url}
                style={{
                  aspectRatio: 1,
                  zIndex: 0,
                  width: "100%",
                }}
              />
            </Link>
          )}
          <OnlineBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
            isonline={online ? "online" : "offline"}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`cursor-pointer hover:brightness-95 relative shadow-md w-14 h-14 overflow-hidden bg-gray-300 rounded-full overflow-hidden flex items-center justify-center`}
            >
              <Image
                onClick={() =>
                  router.push(`/user/${targetUser?.userId}/products`)
                }
                alt={targetUser?.name}
                src={targetUser?.cover?.url}
                style={{
                  aspectRatio: 1,
                  zIndex: 0,
                  width: "100%",
                }}
              />
            </div>
          </OnlineBadge>

          <div
            style={{
              color:
                item?.lastMessage?.status === "unread" &&
                item?.lastMessage?.sender !== currentUser?.userId
                  ? "red"
                  : "black",
            }}
            className="ml-4 flex flex-col gap-1"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <MdDiamond
                  size={24}
                  color={
                    targetUser?.subscription?.type === "free"
                      ? "gray"
                      : "orange"
                  }
                />
              </div>
              <h4>{targetUser?.name}</h4>
            </div>
            <div>
              {item?.lastMessage?.text?.length < 1 && (
                <MdImage size={24} color="gray" />
              )}
              <p className="flex items-center gap-1 overflow-hidden">
                {item?.lastMessage?.text}
                {item?.lastMessage?.sender === currentUser?.userID && (
                  <MdDoneAll
                    size={16}
                    color={
                      item?.lastMessage.status === "unread" ? "gray" : "red"
                    }
                  />
                )}
              </p>
            </div>
          </div>
          <div className="ml-auto text-red-300 h-full flex flex-col justify-evenly p-2 cursor-pointer hover:text-red-500 ">
            <MdRemove
              size={16}
              onClick={() => setConfirm({ room: item.roomId })}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default RoomItem;
