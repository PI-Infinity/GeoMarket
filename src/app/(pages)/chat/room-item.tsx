"use client";
import Image from "@/app/components/image";
import { OnlineBadge } from "@/app/components/onlineBadge";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useChat } from "@/app/context/chat";
import { useUserContext } from "@/app/context/user";
import GetTimesAgo from "@/app/utils/getTimesAgo";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdDiamond, MdDoneAll, MdImage, MdRemove } from "react-icons/md";
import { MoonLoader } from "react-spinners";

const RoomItem = ({ item }: any) => {
  // app context
  const { apiUrl, activeLanguage } = useApp();

  // router
  const router = useRouter();

  // pathname
  const pathname = usePathname();

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
  const [deleteLoading, setDeleteLoading] = useState(false);

  const DeleteChat = async () => {
    try {
      setDeleteLoading(true);
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
      setDeleteLoading(false);
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

  return (
    <>
      {confirm.room === item.roomId ? (
        <div className="flex items-center justify-center rounded-xl w-full shadow-md p-2 cursor-pointer hover:brightness-95">
          {deleteLoading ? (
            <MoonLoader size={24} color="red" />
          ) : (
            <div className="flex items-center justify-evenly font-semibold w-full h-full">
              <div
                className="text-red-500 h-14 aspect-square flex items-center justify-center hover:brightness-90"
                onClick={() => setConfirm({ room: "" })}
              >
                {activeLanguage?.no}
              </div>
              <span className="text-sm font-semibold text-gray-400">
                {activeLanguage?.delete}?
              </span>
              <div
                onClick={DeleteChat}
                className="text-green-500 h-14 aspect-square flex items-center justify-center hover:brightness-90"
              >
                {activeLanguage?.yes}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => {
            setActiveRoom({ ...item, online });
            router.push(`/chat/${item.roomId}`);
          }}
          style={{
            background:
              activeRoom?.roomId === item.roomId && pathname !== "/chat"
                ? "rgba(0,0,0,0.1)"
                : "white",
          }}
          className="flex relative items-center rounded-xl shadow-md p-2 cursor-pointer hover:brightness-95"
        >
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
            className="ml-2 flex flex-col gap-1"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <MdDiamond
                  size={18}
                  color={
                    targetUser?.subscription?.type === "free"
                      ? "gray"
                      : "orange"
                  }
                />
              </div>
              <div className="laptop:max-w-32">
                <h4 className="max-w-72 overflow-hidden whitespace-nowrap overflow-ellipsis">
                  {targetUser?.name}
                </h4>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 overflow-hidden">
                {item?.lastMessage?.text?.length < 1 && (
                  <MdImage size={24} className="text-gray-400" />
                )}
                <span className="max-w-56 whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {item?.lastMessage?.text}
                </span>
                {item?.lastMessage?.sender === currentUser?.userId && (
                  <MdDoneAll
                    size={16}
                    color={
                      item?.lastMessage.status === "unread" ? "gray" : "red"
                    }
                  />
                )}
              </div>
            </div>
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            className="ml-auto text-red-300 h-full flex flex-col items-end justify-evenly gap-2 p-2 cursor-pointer hover:text-red-500 "
          >
            <span
              className="text-gray-500 whitespace-nowrap"
              style={{ fontSize: "12px" }}
            >
              {GetTimesAgo(item?.createdAt)}
            </span>
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
