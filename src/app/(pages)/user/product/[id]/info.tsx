import Button from "@/app/components/button";
import Image from "@/app/components/image";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useChat } from "@/app/context/chat";
import { useProductsContext } from "@/app/context/products";
import { Breadcrumbs } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaHeart, FaTimes } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { MdDiamond, MdShare, MdStar, MdTimer } from "react-icons/md";
import { v4 } from "uuid";
import ShareComponent from "../../../../components/shareComponent";
import { format } from "date-fns";
import { CiCalendarDate } from "react-icons/ci";

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
  const { apiUrl, activeLanguage, language } = useApp();

  // auth context
  const { currentUser, setDestination } = useAuth();

  // products context
  const { setCategory } = useProductsContext();

  // Function to format the rating
  const formatResults = (rating: any) => {
    if (!rating) return 0;
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
  }
  // user actions
  const [actions, setActions] = useState<ActionsProps>({
    saved: false,
    rating: false,
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
        console.log(error.response);
        console.log("product check error: " + error);
      }
    };
    if (currentUser && data?.seller?.userId !== currentUser?.userId) {
      if (data?.productId) {
        CheckProduct();
      }
    }
  }, [currentUser, data?.productId]);

  const SaveProduct = async (action: string) => {
    try {
      if (action === "save") {
        setActions((prev: any) => ({ ...prev, saved: true }));
        setData((prev: any) => ({
          ...prev,
          saves: prev.saves + 1,
        }));
      } else {
        setActions((prev: any) => ({ ...prev, saved: false }));
        setData((prev: any) => ({
          ...prev,
          saves: prev.saves - 1,
        }));
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
        rating: prev.rating + 1,
        seller: { ...prev.seller, rating: prev.seller.rating + 1 },
      }));
      await axios.patch(
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
  const { setActiveRoom } = useChat();

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
          phone: data?.seller?.phone?.number,
        },
      ],
      lastMessage: "",
      status: "read",
    };
    router.push(
      `/chat/${room.roomId}?user=${data.seller.userId}&product=${data.productId}`
    );
    setActiveRoom(room);
  };

  return (
    <div className="relative p-0 laptop:p-2 flex-1 flex gap-4 w-full laptop:w-1/3 max-h-full rounded-xl bg-gray-100 shadow-sm text-black overflow-y-auto">
      <div className="text-black rounded-xl w-full p-4 flex flex-col bg-white">
        <div className="text-sm text-gray-400 mb-2 flex items-center ml-2 gap-2">
          <CiCalendarDate size={20} />
          {data?.createdAt
            ? format(new Date(data.createdAt), "yyyy-MM-dd HH:mm")
            : ""}
          <div className="flex items-center gap-1 ml-auto text-gray-400">
            <IoMdEye size={24} />
            <span>{formatResults(data?.views)}</span>
          </div>
        </div>
        <div className="flex items-center w-full text-sm ml-2">
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/" className="text-sm">
              {activeLanguage.products}
            </Link>
            <Link
              color="inherit"
              href="/"
              onClick={() => setCategory(data?.category)}
              style={{ opacity: 0.6 }}
              className="text-sm"
            >
              {activeLanguage[data?.category]}
            </Link>
          </Breadcrumbs>
        </div>
        <h2 className="ml-2 mt-4">
          {language === "ka" ? data?.title?.ka : data?.title?.en}
        </h2>
        <div className="flex items-center gap-2 m-4">
          <Link
            href={`/user/${data?.seller?.userId}/products`}
            className={`shadow-sm w-10 aspect-square bg-gray-300 rounded-full overflow-hidden flex items-center justify-center`}
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
            size={20}
            className={`${
              data?.seller?.subscription?.type !== "Free"
                ? "text-orange-500"
                : "text-gray-400"
            } hover:brightness-90`}
          />

          <Link
            href={`/user/${data?.seller?.userId}/products`}
            className="flex gap-2 items-center"
          >
            <h4 className="font-semibold text-md">{data?.seller?.name}</h4>{" "}
            <div className="flex items-center gap-1 tex-sm">
              <MdStar size={18} color="orange" />
              {formatResults(data?.seller?.rating)}
            </div>
          </Link>
        </div>

        <h3 className="flex items-center gap-2 text-green-500 font-semibold  ml-2">
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
          className="text-black p-4 pl-2 pt-2 mt-auto rounded-xl bg-white h-full min-h-40"
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
              title="Starting to Buy"
              background="green"
              color="white"
              onClick={() => {
                if (currentUser) {
                  SetChat();
                } else {
                  router.push("/login");
                  setDestination({
                    productId: data?.productId,
                    page: "product",
                  });
                }
              }}
            />
          )}
          {data && currentUser?.userId !== data?.seller?.userId && (
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
                      setDestination({
                        productId: data?.productId,
                        page: "product",
                      });
                    }
              }
            >
              <MdStar size={32} />
            </div>
          )}
          {data && currentUser?.userId !== data?.seller?.userId && (
            <div
              className=" hover:brightness-95 transition-all cursor-pointer"
              onClick={
                currentUser
                  ? () => SaveProduct(actions.saved ? "remove" : "save")
                  : () => {
                      router.push("/login");
                      setDestination({
                        productId: data?.productId,
                        page: "product",
                      });
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
