import Image from "@/app/components/image";
import { useAuth } from "@/app/context/auth";
import { useProductsContext } from "@/app/context/products";
import { FormatDate } from "@/app/utils/formatDate";
import Link from "next/link";
import React, { useState } from "react";
import { MdDelete, MdDone, MdEdit, MdStar } from "react-icons/md";
import { MoonLoader } from "react-spinners";

export const ReviewItem = ({
  deleteLoading,
  item,
  DeleteReview,
  confirm,
  setConfirm,
  change,
  setChange,
  ChangeReview,
  updateLoading,
}: any) => {
  // product
  const { product } = useProductsContext();
  // auth state
  const { currentUser } = useAuth();
  // Function to format the rating
  const formatRating = (rating: any) => {
    if (rating < 1000) return rating;
    if (rating < 10000) return `${(rating / 1000).toFixed(0)}k`;
    if (rating < 1000000) return `${Math.floor(rating / 1000)}k`;
    return `${(rating / 1000000).toFixed(1)}m`;
  };

  return (
    <>
      <div className="bg-white flex w-full flex-col rounded-xl overflow-hidden shadow-sm relative">
        {confirm === item.reviewId && (
          <div className="absolute w-full h-full z-10 bg-gray-100">
            <div className="flex items-center justify-evenly h-full">
              <div
                onClick={() => setConfirm(false)}
                className="cursor-pointer hover:brightness-95 text-red-500 font-semibold"
              >
                No
              </div>
              <div
                onClick={() => {
                  DeleteReview(item.reviewId);
                }}
                className="cursor-pointer hover:brightness-95 text-green-500 text-semibold"
              >
                {deleteLoading ? <MoonLoader size={16} color="green" /> : "Yes"}
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col laptop:flex-row gap-2 p-2">
          <div className="flex items-center gap-2 w-full">
            <Link
              href={`/user/${item.reviewer.userId}/products`}
              className="w-8 h-8 rounded-full overflow-hidden"
            >
              <Image
                alt={item?.reviewer?.name}
                src={item?.reviewer?.cover?.url}
                style={{
                  zIndex: 1,
                  cursor: "pointer",
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                }}
              />
            </Link>
            <h4 className="whitespace-nowrap max-w-80 overflow-hidden overflow-ellipsis">
              {item?.reviewer.name}
            </h4>
            <div className="flex items-center gap-1 text-sm">
              <MdStar size={20} color="orange" />
              {formatRating(item.reviewer.rating || 0)}
            </div>
            {currentUser?.userId === item?.reviewer?.userId && (
              <div className="flex ml-auto">
                <MdEdit
                  onClick={() =>
                    setChange({ text: item.text, reviewId: item?.reviewId })
                  }
                  color="red"
                  size={20}
                  className="hover:brightness-95 cursor-pointer"
                />
              </div>
            )}
            {(currentUser?.userId === item?.reviewer?.userId ||
              currentUser?.userId === product?.seller?.userId) && (
              <div className="flex">
                <MdDelete
                  onClick={() => setConfirm(item.reviewId)}
                  color="red"
                  size={20}
                  className="hover:brightness-95 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center w-full gap-2">
          {change?.reviewId === item?.reviewId ? (
            <div className="w-3/4 flex items-center bg-white rounded-xl ml-4">
              <textarea
                value={change?.text}
                onChange={(e) =>
                  setChange((prev: any) => ({ ...prev, text: e.target.value }))
                }
                className="h-full w-full p-2 pl-4 bg-transparent"
                placeholder="Text here..."
                maxLength={300}
              />
              <div className="p-2 h-full flex items-center cursor-pointer hover:brightness-90">
                {updateLoading ? (
                  <MoonLoader color="green" size={24} />
                ) : (
                  <MdDone
                    color={change?.text === item?.text ? "red" : "green"}
                    size={24}
                    onClick={() => {
                      if (item.text === change.text) {
                        setChange(null);
                      } else {
                        ChangeReview(item?.reviewId);
                      }
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <p className="p-2 pl-4 pt-0">{item?.text}</p>
          )}
          <div className="flex items-center gap-1 text-sm ml-auto text-gray-300 mr-4 mb-2 whitespace-nowrap">
            {FormatDate(item.createdAt)}
          </div>
        </div>
      </div>
    </>
  );
};
