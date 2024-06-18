import Button from "@/app/components/button";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import axios from "axios";
import React, { useState } from "react";
import { MdClose, MdDelete, MdDone } from "react-icons/md";
import { v4 } from "uuid";

const Item = ({ item, period }: any) => {
  // app context
  const { apiUrl, loading: appLoading } = useApp();
  // auth state
  const { currentUser, setCurrentUser } = useAuth();
  // activation loading
  const [loading, setLoading] = useState(false);

  // activation function
  const Activate = async (variant: any) => {
    const subscription = variant;

    try {
      setLoading(true);
      const response = await axios.post(apiUrl + "/api/v1/subscriptions", {
        subscription: subscription,
        user: currentUser.userId,
      });
      if (response.data.status === "success") {
        setCurrentUser((prev: any) => ({ ...prev, subscription }));
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error.response.data.message);
    }
  };

  // unactive
  const UnActive = async () => {
    const canceled = {
      status: "canceled",
      cancelDate: new Date(),
    };
    try {
      setLoading(true);
      const response = await axios.patch(
        apiUrl + "/api/v1/subscriptions/" + currentUser.userId,
        { canceled }
      );
      if (response.data.status === "success") {
        setCurrentUser((prev: any) => ({
          ...prev,
          subscription: {
            ...currentUser?.subscription,
            type: "Free",
            status: "active",
            options: {
              topLevelSorting: false,
              products: 10,
            },
            price: 0,
            activationDate: new Date(),
            expireDate: "",
          },
        }));
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
    <div
      className={`relative w-full laptop:w-72 h-80 bg-gray-50 text-black shadow-md rounded-xl p-4 flex flex-col`}
    >
      {currentUser?.subscription?.price === item.price && (
        <div className="absolute top-2 left-2 h-3 w-3 rounded-full shadow-md bg-red-500" />
      )}
      <div className="flex flex-col items-center gap-8 w-full rounded-md mt-4">
        <div>
          <div className="text-gray text-center flex items-center gap-2">
            <div>{item.icon}</div> <h2 className="mr-6">{item.value}</h2>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-full pl-8 pr-8 text-green-500 flex items-center gap-1">
          <h3>{item.price}₾</h3>/<h4>{period && period[0]}.</h4>
        </div>

        <div className="flex flex-col">
          {item?.description?.map((itm: any, index: any) => {
            return (
              <p className="text-md flex items-center gap-2" key={index}>
                {item.value === "Free" && index === 1 ? (
                  <MdClose size={18} color="red" />
                ) : (
                  <MdDone color="green" size={18} />
                )}{" "}
                {itm}
              </p>
            );
          })}
        </div>
      </div>
      {!appLoading && (
        <div className="h-11 mt-auto">
          {currentUser?.subscription?.price > item.price || item.price === 0 ? (
            ""
          ) : (
            <Button
              title={
                currentUser?.subscription?.price === item.price
                  ? "Cancel"
                  : "Select"
              }
              background={
                currentUser?.subscription?.price === item.price
                  ? "red"
                  : "green"
              }
              color="white"
              onClick={
                currentUser?.subscription?.price === item.price ||
                item.value === "Free"
                  ? () => UnActive()
                  : () =>
                      Activate({
                        user: currentUser?.userId,
                        status: item.status,
                        type: item.value,
                        time: item.time,
                        activationDate: new Date(),
                        options: item.options,
                        price: item.price,
                        expireDate:
                          period === "monthly"
                            ? new Date(
                                new Date().setMonth(new Date().getMonth() + 1)
                              ) // add 1 Monthly
                            : new Date(
                                new Date().setFullYear(
                                  new Date().getFullYear() + 1
                                )
                              ), // add 1 year
                      })
              }
              loading={loading}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Item;
