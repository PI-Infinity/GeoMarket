"use client";
import React from "react";
import { useAdminContext } from "../context/admin";
import { IoReload } from "react-icons/io5";
import { MoonLoader } from "react-spinners";

const Page = () => {
  const { stats, setRerender, loading } = useAdminContext();

  // for users
  const maxCount =
    stats?.registrationsByDate?.reduce(
      (max: any, item: any) => (item.count > max ? item.count : max),
      0
    ) || 1;

  //for products
  const maxCountProducts =
    stats?.uploadsByDate?.reduce(
      (max: any, item: any) => (item.count > max ? item.count : max),
      0
    ) || 1;

  return (
    <>
      {loading ? (
        <div
          style={{ height: "400px" }}
          className="w-1/2 flex items-center justify-center"
        >
          <MoonLoader size={32} color="red" />
        </div>
      ) : (
        <div className="p-4 ">
          <div
            className="absolute right-4 top-4 cursor-pointer hover:brightness-95 h-8 w-8 flex items-center justify-center"
            onClick={() => setRerender((prev: boolean) => !prev)}
          >
            <IoReload size={24} />
          </div>
          <h3>Users:</h3>
          <div className="text-black mt-2 flex flex-col laptop:flex-row gap-2 laptop:gap-4">
            <div className="flex items-center gap-1">
              Total:{" "}
              <span className="font-semibold text-red-500">
                {stats?.stats?.totalUsers}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`h-3 w-3 rounded-full ${
                  stats?.stats?.onlineUsers > 0 ? "bg-green-500" : "bg-gray-400"
                }`}
              />{" "}
              Online:{" "}
              <span className="font-semibold text-red-500">
                {stats?.stats?.onlineUsers}
              </span>
            </div>
            <div>
              Seller:{" "}
              <span className="font-semibold text-red-500">
                {stats?.stats?.sellerUsers}
              </span>
            </div>
            <div>
              No Seller:{" "}
              <span className="font-semibold text-red-500">
                {stats?.stats?.noSellerUsers}
              </span>
            </div>
          </div>
          <div className="mt-8">
            <h4>Las 30 Days Registers:</h4>
            <div className="h-48 shadow-md rounded-xl w-full mt-2 flex items-center gap-2 overflow-x-auto">
              {stats?.registrationsByDate?.map((item: any, index: number) => {
                // Calculate the height percentage
                const heightPercentage = (item.count / maxCount) * 100;
                return (
                  <div
                    key={index}
                    className="min-w-12 h-full p-4 flex justify-end items-center flex-col"
                  >
                    <span style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                      {item?.count}
                    </span>
                    <div
                      className="bg-red-500 w-4 rounded-full"
                      style={{ height: `${heightPercentage}%` }}
                    ></div>
                    <span
                      style={{
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        color: "#b9b9b9",
                      }}
                    >
                      {item?._id}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <h3 className="mt-8">Products:</h3>
          <div className="text-black mt-2 flex flex-col laptop:flex-row gap-2 laptop:gap-4">
            <div className="flex items-center gap-1">
              Total:{" "}
              <span className="font-semibold text-red-500">
                {stats?.productsStats?.totalProducts}
              </span>
            </div>
            <div className="flex items-center gap-1">
              Public:
              <span className="font-semibold text-red-500">
                {stats?.productsStats?.publicProducts}
              </span>
            </div>
            <div className="flex items-center gap-1">
              Draft:
              <span className="font-semibold text-red-500">
                {stats?.productsStats?.draftProducts}
              </span>
            </div>
            <div className="flex items-center gap-1">
              Pending:
              <span className="font-semibold text-red-500">
                {stats?.productsStats?.pendingProducts}
              </span>
            </div>
            <div className="flex items-center gap-1">
              Rejected:
              <span className="font-semibold text-red-500">
                {stats?.productsStats?.rejectedProducts}
              </span>
            </div>
          </div>
          <div className="mt-8">
            <h4>Las 30 Days Registers:</h4>
            <div className="h-48 shadow-md rounded-xl w-full mt-2 flex items-center gap-2 overflow-x-auto">
              {stats?.uploadsByDate?.map((item: any, index: number) => {
                // Calculate the height percentage
                const heightPercentage = (item.count / maxCountProducts) * 100;
                return (
                  <div
                    key={index}
                    className="min-w-12 h-full p-4 flex justify-end items-center flex-col"
                  >
                    <span style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                      {item?.count}
                    </span>
                    <div
                      className="bg-red-500 w-4 rounded-full"
                      style={{ height: `${heightPercentage}%` }}
                    ></div>
                    <span
                      style={{
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        color: "#b9b9b9",
                      }}
                    >
                      {item?._id}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
