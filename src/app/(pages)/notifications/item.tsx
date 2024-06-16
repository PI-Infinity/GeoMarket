import Image from "@/app/components/image";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useNotifications } from "@/app/context/notifications";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Item = (item: any, index: any) => {
  const [notification, setNotification] = useState(item.item);

  const { setTotalUnreads } = useNotifications();

  const { apiUrl } = useApp();

  const { currentUser } = useAuth();

  const router = useRouter();

  // change notification status
  const ReadNotification = async (notificationId: string) => {
    try {
      setNotification({ ...notification, status: "read" });
      const response = await axios.patch(
        apiUrl +
          "/api/v1/users/" +
          currentUser?.userId +
          "/notifications/" +
          notificationId,
        { ...notification, status: "read" }
      );
      if (response.data.status === "success") {
        setTotalUnreads((prev: number) => (prev -= 1));
      }
    } catch (error: any) {
      console.log(error.response);
    }
  };
  return (
    <div
      onClick={
        notification?.status === "unread"
          ? () => ReadNotification(notification?.notificationId)
          : undefined
      }
      className={`p-4 border-[1px] border-gray-200 rounded-xl shadow-md flex gap-2 relative ${
        notification?.status === "unread"
          ? "bg-red-500 text-white cursor-pointer hover:brightness-95"
          : "text-gray-400"
      }`}
    >
      <div>
        <div className="shadow-ms rounded-full overflow-hidden h-12 w-12">
          <Image
            alt={notification?.sender?.name || notification?.sender}
            src={
              notification?.sender?.cover ? notification?.sender?.cover.url : ""
            }
            style={{
              width: "100%",
              height: "100%",
              cursor:
                notification.sender !== "Geo Market" ? "pointer" : "default",
            }}
            onClick={
              notification.sender !== "Geo Market"
                ? () =>
                    router.push(`/user/${notification?.sender.userId}/products`)
                : undefined
            }
          />
        </div>
      </div>
      <div className="flex flex-col">
        <h4
          style={{
            cursor:
              notification.sender !== "Geo Market" ? "pointer" : "default",
          }}
          onClick={
            notification.sender !== "Geo Market"
              ? () =>
                  router.push(`/user/${notification?.sender.userId}/products`)
              : undefined
          }
        >
          {notification?.sender?.name || notification?.sender}
        </h4>
        <p className="text-sm">{notification?.text}</p>
      </div>
    </div>
  );
};

export default Item;
