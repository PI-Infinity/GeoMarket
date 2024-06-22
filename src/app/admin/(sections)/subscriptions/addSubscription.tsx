import React, { useState } from "react";
import Search from "./search";
import { useApp } from "@/app/context/app";
import axios from "axios";
import Button from "@/app/components/button";
import { MdClose } from "react-icons/md";

const AddSubscription = ({ setRerender }: any) => {
  // user userId for pass to post request to add subscription
  const [user, setUser] = useState<any>(null);
  const [subscriptionVariant, setSubscriptionVariant] = useState<any>(null);

  // app context
  const { subscriptionItems, apiUrl } = useApp();

  // activation function
  const [loading, setLoading] = useState(false);

  const Activate = async () => {
    const subscription = {
      ...subscriptionVariant,
      user: user?.userId,
      activationDate: new Date(),
      expireDate:
        subscriptionVariant.time === "monthly"
          ? new Date(new Date().setMonth(new Date().getMonth() + 1)) // add 1 Monthly
          : new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // add 1 year
    };

    try {
      setLoading(true);
      const response = await axios.post(apiUrl + "/api/v1/subscriptions", {
        subscription: subscription,
        user: user?.userId,
      });
      if (response.data.status === "success") {
        setTimeout(() => {
          setRerender((prev: boolean) => !prev);
          setLoading(false);
          setUser(null);
          setSubscriptionVariant(null);
        }, 500);
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error.response.data.message);
    }
  };
  return (
    <div className="w-full p-4 m-2 shadow-md rounded-xl">
      <h3 className="">Add Subscription</h3>
      <div className="w-full p-2 shadow-md rounded-xl mb-2 relative">
        {(user || subscriptionVariant) && (
          <MdClose
            onClick={() => {
              setUser(null);
              setSubscriptionVariant(null);
            }}
            color="red"
            className="absolute right-2 top-2 cursor-pointer hover:brightness-95"
            size={24}
          />
        )}
        <div className="flex items-center gap-2 my-2">
          <h4>User:</h4>
          {user?.name}
        </div>
        <div className="flex items-center gap-2 my-2">
          <h4>Subscription:</h4>
          {(subscriptionVariant &&
            subscriptionVariant?.value + " / " + subscriptionVariant?.time) ||
            ""}
        </div>
      </div>
      <div className="h-10 w-full mb-4">
        <Button
          title="Activate"
          background="green"
          color="white"
          onClick={Activate}
          loading={loading}
          disabled={!user || !subscriptionVariant ? true : false}
        />
      </div>
      <Search setUser={setUser} />
      <h4 className="my-2">Choise subscription:</h4>
      <div className="mt-2 flex flex-col gap-2">
        {subscriptionItems?.map((item: any, index: number) => {
          if (item.value !== "Free") {
            return (
              <div
                onClick={() => setSubscriptionVariant(item)}
                key={index}
                className={`shadow-md rounded-xl p-4 bg-white text-gray-400  ${
                  subscriptionVariant?.price !== item?.price &&
                  "cursor-pointer hover:brightness-95 text-gray-600"
                }`}
              >
                <div>
                  Type: {item.value} / {item?.time}
                </div>
                <div>Price: {item.price}₾</div>
                <div>
                  <div>Products: {item.options.products}</div>
                  {item.options.topLevelSorting && <div>Top Level Sorting</div>}
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default AddSubscription;
