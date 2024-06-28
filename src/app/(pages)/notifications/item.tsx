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
import { useUserContext } from "@/app/context/user";

const Item = (item: any, index: any) => {
  const [notification, setNotification] = useState(item.item);

  useEffect(() => {
    setNotification(item.item);
  }, [item]);

  const { setTotalUnreads, setNotifications } = useNotifications();

  const { apiUrl, activeLanguage, productUploadingRules } = useApp();

  const { currentUser } = useAuth();

  const { setProduct } = useUserContext();

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
          : () => {
              if (notification?.type === "product-reject") {
                router.push("/profile/products");
              } else {
                router.push(`/user/product/${notification?.productId})`);
                setProduct(notification?.product);
              }
            }
      }
      className={`p-2 border-[1px] border-gray-200 rounded-xl shadow-md flex gap-4 relative cursor-pointer ${
        notification?.status === "unread"
          ? "bg-red-500 text-white  hover:brightness-95"
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
      <div className="flex flex-col w-full">
        <div className="w-full flex items-center">
          <h4
            style={{
              cursor:
                notification.sender !== "Geo Market" ? "pointer" : "default",
            }}
          >
            {notification?.sender?.name || notification?.sender}{" "}
          </h4>
          <span
            className={`${
              notification?.status === "unread" ? "text-white" : "text-gray-400"
            } whitespace-nowrap ml-auto`}
            style={{ fontSize: "12px" }}
          >
            {GetTimesAgo(notification?.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2 w-full">
          <div className="text-sm">
            {notification?.type === "save" ? (
              "შეინახა თქვენი პროდუქტი"
            ) : notification?.type === "rating" ? (
              "მიანიჭა რეიტინგი თქვენს პროდუქტს"
            ) : notification?.type === "review" ? (
              "დატოვა კომენტარი თქვენს პროდუქტზე"
            ) : notification?.type === "welcome" ? (
              "მოგესალმებით! გისურვებთ ბედნიერ მოგზურობას ქართული ნიჭის სამყაროში <3"
            ) : notification?.type === "product-reject" ? (
              <div className="flex flex-col gap-1">
                <span className="whitespace-nowrap">
                  პროდუქტი {} არ დადასტურდა! მიზეზი:
                </span>
                <div className="flex flex-col gap-1">
                  {notification?.text?.map((i: any, x: any) => {
                    let rsn = productUploadingRules?.find(
                      (it: any) => it.value === i
                    );
                    if (
                      !productUploadingRules?.find((it: any) => it.value === i)
                    ) {
                      return (
                        <div
                          key={index}
                          className="text-sm flex items-center gap-1"
                        >
                          <MdClose
                            size={16}
                            color={
                              notification?.status === "unread"
                                ? "white"
                                : "red"
                            }
                          />
                          {i}
                        </div>
                      );
                    } else {
                      return (
                        <span
                          key={x}
                          className="text-sm flex items-center gap-1"
                        >
                          <MdClose
                            size={16}
                            color={
                              notification?.status === "unread"
                                ? "white"
                                : "red"
                            }
                          />
                          {rsn?.title}
                        </span>
                      );
                    }
                  })}
                  {notification?.type === "product-reject" && (
                    <Link
                      onClick={(e) => e.stopPropagation()}
                      href={`/terms/productUpload`}
                      className="flex text-sm gap-1 mt-2 max-w-32 items-center justify-center shadow-md rounded-full px-2 bg-white text-gray-300"
                    >
                      Rules <IoMdEye size={24} className="text-gray-300" />
                    </Link>
                  )}
                </div>
              </div>
            ) : notification?.type === "product-public" ? (
              "პროდუქტი გამოქვეყნდა წარმატებით!"
            ) : notification?.type === "product-draft" ? (
              `პროდუქტი დადასტურდა, მაგრამ არ გამოქვეყნდა! მიზეზი: ${notification?.text}`
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {confirm ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute ml-auto right-2 bottom-2 flex items-center justify-evenly h-12 p-1 px-3 gap-2 bg-gray-50 shadow-md rounded-full"
        >
          <div
            onClick={() => setConfirm("")}
            className="cursor-pointer hover:brightness-95"
          >
            <MdClose size={24} color="red" />
          </div>
          <span className="text-sm font-semibold">
            {activeLanguage?.delete}
          </span>
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
          className="absolute right-2 text-red-300 h-full flex flex-col items-end justify-evenly gap-2  cursor-pointer hover:text-red-500 pr-2"
        >
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
