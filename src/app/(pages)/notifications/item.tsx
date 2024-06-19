import Image from "@/app/components/image";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useNotifications } from "@/app/context/notifications";
import GetTimesAgo from "@/app/utils/getTimesAgo";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdEye } from "react-icons/io";
import { MdClose, MdDone, MdRemove } from "react-icons/md";
import { MoonLoader } from "react-spinners";

const Item = (item: any, index: any) => {
  const [notification, setNotification] = useState(item.item);

  useEffect(() => {
    setNotification(item.item);
  }, [item]);

  const { setTotalUnreads, setNotifications } = useNotifications();

  const { apiUrl } = useApp();

  const { currentUser } = useAuth();

  const router = useRouter();

  // change notification status
  const ReadNotification = async (notificationId: string) => {
    try {
      setNotifications((prev: any) =>
        prev.map((i: any) => {
          if (i?.notificationId === notificationId) {
            return { ...i, status: "read" };
          } else {
            return i;
          }
        })
      );
      const response = await axios.patch(
        apiUrl +
          "/api/v1/users/" +
          currentUser?.userId +
          "/notifications/" +
          notificationId,
        {
          ...notification,
          status: "read",
          sender: notification?.sender?.userId,
        }
      );
      if (response.data.status === "success") {
        setTotalUnreads((prev: number) => (prev -= 1));
      }
    } catch (error: any) {
      console.log(error.response);
    }
  };

  // delete confirm
  const [confirm, setConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const Delete = async () => {
    try {
      setDeleteLoading(true);

      const response = await axios.delete(
        apiUrl +
          "/api/v1/users/" +
          currentUser?.userId +
          "/notifications/" +
          notification.notificationId
      );
      if (response.data.status === "success") {
        setNotifications((prev: any) =>
          prev.filter(
            (i: any) => i?.notificationId !== notification?.notificationId
          )
        );
        setDeleteLoading(false);
        setConfirm("");
      }
    } catch (error: any) {
      setDeleteLoading(false);
      setConfirm("");
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
      className={`p-2 border-[1px] border-gray-200 rounded-xl shadow-md flex gap-4 relative ${
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
      <div className="flex flex-col gap-1">
        <h4
          style={{
            cursor:
              notification.sender !== "Geo Market" ? "pointer" : "default",
          }}
        >
          {notification?.sender?.name || notification?.sender}
        </h4>
        <div className="flex items-center gap-2">
          <p className="text-sm">
            {notification?.type === "save"
              ? "შეინახა თქვენი პროდუქტი"
              : notification?.type === "rating"
              ? "მიანიჭა რეიტინგი თქვენს პროდუქტს"
              : notification?.type
              ? "მოგესალმებით! გისურვებთ ბედნიერ მოგზურობას ქართული ნიჭის სამყაროში <3"
              : ""}
          </p>
          {notification?.productId && (
            <Link href={`/user/product/${notification?.productId}`}>
              <IoMdEye size={24} className="text-gray-300" />
            </Link>
          )}
        </div>
      </div>
      {confirm ? (
        <div className="ml-auto flex items-center justify-evenly p-1 px-3 gap-2 bg-gray-50 shadow-md rounded-full">
          <div
            onClick={() => setConfirm("")}
            className="cursor-pointer hover:brightness-95"
          >
            <MdClose size={24} color="red" />
          </div>
          <span className="text-sm font-semibold">Delete</span>
          <div onClick={Delete} className="cursor-pointer hover:brightness-95">
            {deleteLoading ? (
              <MoonLoader size={16} color="red" />
            ) : (
              <MdDone size={24} color="green" />
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          className="ml-auto text-red-300 h-full flex flex-col items-end justify-evenly gap-2  cursor-pointer hover:text-red-500 pr-2"
        >
          <span className="text-gray-500" style={{ fontSize: "12px" }}>
            {GetTimesAgo(notification?.createdAt)}
          </span>
          <MdRemove
            size={12}
            onClick={() => setConfirm(notification?.notificationId)}
          />
        </div>
      )}
    </div>
  );
};

export default Item;
