"use client";
import Button from "@/app/components/button";
import Image from "@/app/components/image";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useProductsContext } from "@/app/context/products";
import { FormatDate } from "@/app/utils/formatDate";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaImages } from "react-icons/fa";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { MdClose, MdDelete, MdDone } from "react-icons/md";

interface PropTypes {
  item: any;
  setConfirmPopup?: any;
  DeleteProduct?: any;
  Confirm?: any;
  Reject?: any;
  actionLoading?: any;
}

const ProductItem: React.FC<PropTypes> = ({
  item,
  Confirm,
  Reject,
  actionLoading,
  setConfirmPopup,
  DeleteProduct,
}) => {
  // router
  const router = useRouter();

  // app context
  const { activeLanguage, productUploadingRules } = useApp();

  // categories
  const { categories } = useProductsContext();

  // Filter items with .cover true
  const coverItems = item?.gallery.filter((item: any) => item?.cover);

  // Filter items with .cover false or undefined
  const nonCoverItems = item?.gallery.filter((item: any) => !item?.cover);

  // Concatenate coverItems first and then nonCoverItems
  const reorderedGallery = [...coverItems, ...nonCoverItems];

  // reject reasons
  const [openRejectReasons, setOpenRejectReasons] = useState(false);
  const [rejectReasons, setRejectReasons] = useState<any>([]);

  // custom reject reason
  const [customText, setCustomText] = useState("");

  return (
    <div
      style={{
        filter: item.status === "public" ? "brightness(1)" : "brightness(0.95)",
      }}
      className="relative overflow-hidden box-border rounded-xl bg-gray-50 p-4 flex flex-col cursor-pointer shadow-md laptop:max-w-80"
    >
      <div>
        <div className="flex items-center justify-between w-full">
          <p className="text-md font-bold">Status: {item?.status}</p>
          <MdDelete
            onClick={() =>
              setConfirmPopup({
                active: true,
                text: activeLanguage.askDeleteProduct,
                close: () =>
                  setConfirmPopup({
                    active: false,
                    close: null,
                    agree: null,
                    text: "",
                  }),
                agree: () => {
                  DeleteProduct({
                    itemId: item?.productId,
                  });
                },
              })
            }
            color="red"
            size={24}
            className="hover:brightness-90 cursor-pointer"
          />
        </div>
        <div className="flex mb-2 mt-2 gap-4 w-full items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            {FormatDate(item.createdAt)}
          </div>
        </div>

        {item?.status !== "draft" && (
          <div className="mb-4 flex items-center gap-4">
            {item?.status !== "rejected" && (
              <div className="w-full h-10">
                <Button
                  title="Reject"
                  background="red"
                  color="white"
                  onClick={() => setOpenRejectReasons(true)}
                  loading={
                    actionLoading.active &&
                    actionLoading.type === "reject" &&
                    actionLoading?.item === item?.productId
                  }
                />
              </div>
            )}
            {item?.status !== "public" && (
              <div className="w-full h-10">
                <Button
                  title="Confirm"
                  background="green"
                  color="white"
                  onClick={() => Confirm(item.productId)}
                  loading={
                    actionLoading.active &&
                    actionLoading.type === "confirm" &&
                    actionLoading?.item === item?.productId
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div
        className="flex items-center gap-2 w-full"
        onClick={() => {
          router.push(`/user/${item?.seller?.userId}/products`);
        }}
      >
        <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
          <Image
            alt={item?.seller?.name}
            src={item?.seller?.cover?.url}
            style={{
              aspectRatio: 1,
              cursor: "pointer",
              objectFit: "cover",
            }}
          />
        </div>
        <h4 className="text-sm">{item?.seller?.name}</h4>
      </div>

      <div
        className="w-full flex overflow-x-scroll aspect-square relative mt-4"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch", // Enables momentum scrolling on iOS Safari
        }}
      >
        {item?.price?.newPrice?.length > 0 && (
          <div className="bg-red-500 text-sm absolute right-0 top-2 z-10 text-white py-1 px-3 rounded-bl-full rounded-tl-full">
            -
            {((parseInt(item.price.value) - parseInt(item.price.newPrice)) /
              parseInt(item.price.value)) *
              100}
            %
          </div>
        )}
        {reorderedGallery?.map((file: any, index: number) => (
          <Link
            href={`/user/product/${item?.productId}?category=${item?.category}`}
            key={index}
            className="relative min-w-full aspect-square bg-gray-300 hover:brightness-95 transition-all overflow-hidden"
            style={{ scrollSnapAlign: "center" }}
          >
            <Image
              alt={item?.seller?.name}
              src={file?.url}
              style={{
                aspectRatio: 1,
                cursor: "pointer",
                width: "100%",
                objectFit: "cover",
              }}
            />
          </Link>
        ))}
        <div>
          {reorderedGallery?.length > 1 && (
            <FaImages
              size={16}
              className="shadow-xl absolute z-10 bottom-2 right-2"
              color="white"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-4">
        <h3 className="text-md font-bold">{item?.title?.ka}</h3>
        <h3 className="text-md font-bold">{item?.title?.en}</h3>
        <p className="text-gray-600">
          {categories?.find((i: any) => i.value === item?.category).label}
        </p>
        <p className="text-gray-600">{item?.description.ka}</p>
        <p className="text-gray-600">{item?.description.en}</p>
        <div
          className={`flex flex-col gap-2 text-sm text-green-500 font-semibold laptop:text-md`}
        >
          {item.price?.byOrder ? (
            <div className="font-semibold flex items-center gap-1 text-orange-500 text-sm">
              <span className="text-sm font-semibold">
                {activeLanguage.byOrder}
              </span>
              {item?.price.createTime?.length > 0 && (
                <span className="text-sm font-semibold">
                  ({item?.price.createTime})
                </span>
              )}
            </div>
          ) : (
            <div className="font-semibold flex items-center gap-1 text-orange-500 text-sm">
              <span className="text-sm font-semibold">
                {activeLanguage?.made}
              </span>
            </div>
          )}
          <div>
            {item?.price?.newPrice?.length > 0 && (
              <span className="font-semibold mr-2 text-sm text-green-500">
                {parseFloat(item.price?.newPrice).toFixed(2)}₾
              </span>
            )}
            <span
              className={`font-semibold text-sm ${
                item?.price?.newPrice?.length > 0
                  ? "text-gray-300 line-through"
                  : "text-green-500"
              }`}
            >
              {item.price?.value === "byAgreement"
                ? "₾ " + activeLanguage?.byAgreement
                : parseFloat(item?.price?.value).toFixed(2)}
              {item.price?.value === "byAgreement" ? "" : "₾"}
            </span>
          </div>
        </div>
      </div>
      {openRejectReasons && (
        <div className="absolute z-10 bg-gray-50 h-full flex flex-col gap-2 pb-8">
          <MdClose
            onClick={() => {
              setOpenRejectReasons(false);
              setRejectReasons([]);
            }}
            color="red"
            size={24}
            className="absolute right-2 top-0 cursor-pointer hover:brightness-95"
          />
          <h4>Reject Reasons:</h4>
          <div className="overflow-y-auto px-2 pb-2">
            {productUploadingRules?.map((itm: any, index: number) => {
              return (
                <div
                  key={index}
                  style={{
                    border: rejectReasons?.includes(itm?.value)
                      ? "1.5px solid red"
                      : "1.5px solid white",
                  }}
                  onClick={
                    rejectReasons?.includes(itm?.value)
                      ? () =>
                          setRejectReasons((prev: any) =>
                            prev?.filter((i: any) => i !== itm?.value)
                          )
                      : () =>
                          setRejectReasons((prev: any) => [...prev, itm.value])
                  }
                  className="shadow-md p-2 bg-gray-50 rounded-xl hover:brightness-95 cursor-pointer mt-2"
                >
                  <h4 className="text-sm">{itm?.title}</h4>
                  <p className="text-sm">{itm?.description}</p>
                </div>
              );
            })}
          </div>
          <div>
            {rejectReasons?.map((i: any) => {
              if (!productUploadingRules?.find((it: any) => it.value === i)) {
                return (
                  <div
                    key={i}
                    style={{
                      border: "1.5px solid red",
                    }}
                    className="p-2 shadow-md rounded-xl cursor-pointer bg-gray-50 hover:brightness-95"
                    onClick={() =>
                      setRejectReasons((prev: any) =>
                        prev?.filter((it: any) => it !== i)
                      )
                    }
                  >
                    7. {i}
                  </div>
                );
              }
            })}
          </div>

          <div className="w-full flex items-center gap-2 mt-2">
            <textarea
              id="about"
              placeholder={`Custom reason...`}
              className="w-full h-full rounded-xl p-2 shadow-md bg-white laptop:mb-0"
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
              }}
            />
            <div
              onClick={
                customText?.length > 0
                  ? () => {
                      setRejectReasons((prev: any) => [...prev, customText]);
                      setCustomText("");
                    }
                  : undefined
              }
              style={{ cursor: customText?.length > 0 ? "pointer" : "auto" }}
              className="w-12 aspect-square rounded-md shadow-md flex items-center justify-center"
            >
              <MdDone
                size={32}
                color={customText?.length > 0 ? "green" : "#d9d9d9"}
              />
            </div>
          </div>

          <div className="h-11">
            <Button
              title="Confirm"
              background="green"
              color="white"
              onClick={() => Reject(item.productId, rejectReasons)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductItem;
