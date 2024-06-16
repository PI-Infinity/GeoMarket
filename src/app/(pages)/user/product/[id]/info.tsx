import Button from "@/app/components/button";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { Breadcrumbs, Typography } from "@mui/material";
import axios from "axios";
import Image from "@/app/components/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaHeart, FaUser } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { MdDiamond, MdSaveAlt, MdShare, MdStar } from "react-icons/md";
import { useProductsContext } from "@/app/context/products";
import ShareComponent from "../../../../components/shareComponent";
import Cookies from "js-cookie";
import { v4 } from "uuid";
import { useChat } from "@/app/context/chat";

interface propsTypes {
  data: any;
  setConfirmPopup: any;
  setAlert: any;
  setData: any;
}

const Info: React.FC<propsTypes> = ({ data, setData }) => {
  // router
  const router = useRouter();

  // app context
  const { setLoading, apiUrl, activeLanguage, language } = useApp();

  // auth context
  const { currentUser } = useAuth();

  // products context
  const { setCategory } = useProductsContext();

  // Function to format the rating
  const formatResults = (rating: any) => {
    if (rating < 1000) return rating;
    if (rating < 10000) return `${(rating / 1000).toFixed(0)}k`;
    if (rating < 1000000) return `${Math.floor(rating / 1000)}k`;
    return `${(rating / 1000000).toFixed(1)}m`;
  };

  /**
   * Save/unsave product
   */

  interface ActionsProps {
    saved: Boolean;
    rating: Boolean;
    fetched: Boolean;
  }
  // user actions
  const [actions, setActions] = useState<ActionsProps>({
    saved: false,
    rating: false,
    fetched: false,
  });

  // check current user actions in product
  useEffect(() => {
    const CheckProduct = async () => {
      try {
        const response = await axios.get(
          apiUrl +
            "/api/v1/products/check/" +
            data.productId +
            "?user=" +
            currentUser.userId
        );
        setActions({ ...response.data.data, fetched: true });
      } catch (error: any) {
        console.log("product check error: " + error);
      }
    };
    if (currentUser && data?.seller?.userId !== currentUser?.userId) {
      CheckProduct();
    }
  }, [currentUser, data?.productId]);

  const SaveProduct = async (action: string) => {
    try {
      if (action === "save") {
        setActions((prev: any) => ({ ...prev, saved: true }));
      } else {
        setActions((prev: any) => ({ ...prev, saved: false }));
      }
      await axios.patch(
        apiUrl +
          "/api/v1/products/" +
          data.productId +
          "/save?action=" +
          action,
        {
          userId: currentUser.userId,
        }
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  // give rating
  const SetRating = async () => {
    try {
      setActions((prev: any) => ({ ...prev, rating: true }));
      setData((prev: any) => ({
        ...prev,
        seller: { ...prev.seller, rating: prev.seller.rating + 1 },
      }));
      const response = await axios.patch(
        apiUrl + "/api/v1/products/" + data.productId + "/rating",
        {
          targetUser: data?.seller.userId,
          currentUser: currentUser?.userId,
        }
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  /**
   * share options
   */
  const [openShareOptions, setOpenShareOptions] = useState(false);

  /**
   * starting chat with seller or continue old
   */
  const { setActiveRoom, setChats, chats } = useChat();

  const SetChat = async () => {
    const roomId = v4();
    const room = {
      roomId: roomId,
      members: [
        {
          id: currentUser?.userId,
          status: "active",
        },
        {
          id: data?.seller?.userId,
          status: "active",
          cover: data.seller?.cover,
          name: data?.seller?.name,
        },
      ],
      lastMessage: "",
      status: "read",
      targetProduct: data,
    };
    router.push(`/chat/${room.roomId}`);
    setActiveRoom(room);
  };

  return (
    <div className="relative p-0 laptop:p-2 flex-1 flex gap-4 w-full laptop:w-1/3 max-h-full rounded-xl bg-gray-100 shadow-sm text-black overflow-y-auto">
      <div className="text-black rounded-xl w-full p-4 flex flex-col bg-white">
        <div className="flex items-center w-full">
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">
              {activeLanguage.products}
            </Link>
            <Link
              color="inherit"
              href="/"
              onClick={() => setCategory(data?.category)}
            >
              {activeLanguage[data?.category]}
            </Link>

            <p color="text.primary">
              {language === "ka" ? data?.title?.ka : data?.title?.en}
            </p>
          </Breadcrumbs>
          <div className="flex items-center gap-1 ml-auto text-gray-400">
            <IoMdEye size={24} />
            <span>{formatResults(data?.views?.length)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 m-4">
          <Link
            href={`/user/${data?.seller?.userId}/products`}
            onClick={() => setLoading(true)}
            className={`shadow-sm w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center`}
          >
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <Image
                alt={data?.seller?.name}
                src={data?.seller?.cover?.url}
                style={{
                  zIndex: 1,
                  cursor: "pointer",
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                }}
              />
            </div>
          </Link>

          <MdDiamond
            size={24}
            className={`${
              data?.seller?.subscription?.type !== "Free"
                ? "text-orange-500"
                : "text-gray-400"
            } hover:brightness-90`}
          />

          <Link
            href={`/user/${data?.seller?.userId}/products`}
            onClick={() => setLoading(true)}
            className="flex gap-4 items-center"
          >
            <h4 className="font-semibold text-md">{data?.seller?.name}</h4>{" "}
            <div className="flex items-center gap-1 tex-sm">
              {formatResults(data?.seller?.rating)}
              <MdStar size={16} color="orange" />
            </div>
          </Link>
        </div>
        <h1 className="ml-4">
          {language === "ka" ? data?.title?.ka : data?.title?.en}
        </h1>
        <h3 className="flex items-center gap-2 text-green-500 font-semibold mt-4 ml-4">
          {data?.price?.byOrder && activeLanguage.byOrder + ":"}
          {data?.price?.byOrder ? (
            <span className="text-black">{data?.price?.value}</span>
          ) : data?.price?.value?.length > 0 ? (
            parseFloat(data?.price?.value).toFixed(2)
          ) : (
            ""
          )}{" "}
          {data?.price?.byOrder ? "" : "₾"}
        </h3>
        <p
          style={{
            overflow: "auto",
            maxHeight: "16rem",
          }}
          className="text-black p-4 pt-2 mt-auto rounded-xl bg-white h-full min-h-40"
        >
          {language === "ka" ? data?.description?.ka : data?.description?.en}
        </p>
        <div className="">
          {openShareOptions && (
            <ShareComponent
              setOpenShareOptions={setOpenShareOptions}
              path={`/user/product/${data?.productId}`}
            />
          )}
        </div>
        <div className="h-12 mt-4 flex items-center gap-4">
          {currentUser?.userId !== data?.seller?.userId && (
            <Button
              title={activeLanguage.buy}
              background="green"
              color="white"
              onClick={() => {
                setLoading(true);
                SetChat();
              }}
            />
          )}
          {data &&
            currentUser?.userId !== data?.seller?.userId &&
            actions.fetched && (
              <div
                className={
                  !actions.rating
                    ? "hover:brightness-95 transition-all cursor-pointer text-gray-300"
                    : "text-orange-200"
                }
                onClick={
                  currentUser
                    ? () => {
                        !actions?.rating ? SetRating() : undefined;
                      }
                    : () => {
                        router.push("/login");
                        setLoading(true);
                      }
                }
              >
                <MdStar size={32} />
              </div>
            )}
          {data &&
            currentUser?.userId !== data?.seller?.userId &&
            actions.fetched && (
              <div
                className=" hover:brightness-95 transition-all cursor-pointer"
                onClick={
                  currentUser
                    ? () => SaveProduct(actions.saved ? "remove" : "save")
                    : () => {
                        router.push("/login");
                        setLoading(true);
                      }
                }
              >
                <FaHeart
                  size={24}
                  className={`cursor-pointer ${
                    actions?.saved ? "text-red-500" : "text-gray-300"
                  }`}
                />
              </div>
            )}
          <MdShare
            size={32}
            className="text-gray-300 cursor-pointer hover:brightness-95"
            onClick={() => setOpenShareOptions(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default Info;
