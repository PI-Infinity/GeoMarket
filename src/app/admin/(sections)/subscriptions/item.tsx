import Button from "@/app/components/button";
import Image from "@/app/components/image";
import SelectComponent from "@/app/components/select";
import { useApp } from "@/app/context/app";
import { FormatDate } from "@/app/utils/formatDate";
import { formatNumbers } from "@/app/utils/formatNumbers";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { MdDiamond, MdStar } from "react-icons/md";

const Item = ({ item, setSubscriptions }: any) => {
  // app context
  const { apiUrl } = useApp();

  /**
   * changing subscription status
   */
  // activation loading
  const [loading, setLoading] = useState(false);

  const UnActive = async () => {
    const canceled = {
      status: "canceled",
      cancelDate: new Date(),
    };
    try {
      setLoading(true);
      const response = await axios.patch(
        apiUrl + "/api/v1/subscriptions/" + item.user?.userId + "/cancel",
        { canceled }
      );
      if (response.data.status === "success") {
        setSubscriptions((prev: any) =>
          prev.map((i: any) => {
            if (i.subscriptionId === item.subscriptionId) {
              const updatedItem = { ...i, ...canceled };
              return updatedItem;
            }
            return i;
          })
        );
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error.response.data.message);
    }
  };
  return (
    <div className="w-full bg-white p-4 border-[1px] border-gray-200 rounded-xl shadow-md flex flex-col gap-2 relative">
      <div className="absolute right-4 top-4 flex flex-col items-end gap-4">
        <MdDiamond
          size={28}
          className={`${
            item?.status === "active"
              ? "text-orange-500"
              : item?.status === "canceled"
              ? "text-red-500"
              : "text-gray-300"
          } cursor-pointer hover:brightness-90 `}
        />
        <Link
          href={`/user/${item?.user?.userId}/products`}
          style={{ width: "30px", height: "30px" }}
          className=" bg-gray-300 rounded-full overflow-hidden flex items-center justify-center relative cursor-pointer hover:brightness-95"
        >
          <Image
            alt={item?.user?.name}
            src={item?.user?.cover?.url}
            style={{
              aspectRatio: 1,
              zIndex: 0,
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
        </Link>
        <Link href={`/user/${item?.user?.userId}/products`}>
          <h4>{item?.user?.name}</h4>
        </Link>
        <div className="flex items-center gap-1">
          <MdStar color="orange" />
          {formatNumbers(item?.user?.rating)}
        </div>
        {item?.status !== "canceled" && (
          <div className="h-8 w-24">
            <Button
              background="red"
              color="white"
              onClick={UnActive}
              title="Cancel"
              loading={loading}
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4 rounded-full"
          style={{
            background:
              item?.status === "active"
                ? "green"
                : item?.status === "canceled"
                ? "red"
                : "gray",
          }}
        />
        <h4 className="text-sm">Status: </h4>
        <span className="text-sm">
          {item?.status.charAt(0).toUpperCase() + item?.status.slice(1)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <h4 className="text-sm">Type: </h4>
        <span className="text-sm">
          {item?.type} /{" "}
          {item?.time.charAt(0).toUpperCase() + item?.time.slice(1)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <h4 className="text-sm">Price: </h4>
        <span className="text-sm">{item?.price}₾</span>
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="text-sm">Options: </h4>
        <span className="ml-4 text-sm">
          Unclocked products:{" "}
          <span className="font-semibold">
            {item?.options.products === 100000
              ? "Unlimited"
              : item?.options.products}
          </span>
        </span>
        <span className="ml-4 text-sm">
          Top Level Sorting:{" "}
          <span className="font-semibold text-sm">
            {item?.options.topLevelSorting ? "True" : "False"}
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <h4 className="text-sm">Activate Date: </h4>
        <span className="text-sm">{FormatDate(item?.activationDate)}</span>
      </div>
      <div className="flex items-center gap-2">
        <h4 className="text-sm">Expire Date: </h4>
        <span className="text-sm">{FormatDate(item?.expireDate)}</span>
      </div>
      {item?.cancelDate && (
        <div className="flex items-center gap-2">
          <h4 className="text-sm">Cancel Date: </h4>
          <span className="text-sm">{FormatDate(item?.cancelDate)}</span>
        </div>
      )}
    </div>
  );
};

export default Item;
