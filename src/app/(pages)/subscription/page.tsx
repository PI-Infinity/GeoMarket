"use client";
import Button from "@/app/components/button";
import { useApp } from "@/app/context/app";
import { useEffect, useState } from "react";
import { MdDiamond, MdOutlineDone } from "react-icons/md";
import Item from "./item";
import { useAuth } from "@/app/context/auth";

const Page = () => {
  useEffect(() => {
    // Scroll to the top of the window
    window.scrollTo(0, 0);
  }, []);
  // app context
  const { activeLanguage } = useApp();

  // use auth
  const { currentUser } = useAuth();

  // period annually or monthly
  const [period, setPeriod] = useState(currentUser?.subscription?.time);

  useEffect(() => {
    setPeriod(currentUser?.subscription?.time || "monthly");
  }, [currentUser]);

  // subscription items
  const items = [
    {
      status: "active",
      value: "Free",
      options: {
        topLevelSorting: false,
        products: 10,
      },
      price: 0,
      description: ["10 Products", "Top Level Sorting"],
      btn: "",
      icon: <MdDiamond color="gray" size={28} />,
    },
    {
      status: "active",
      value: "Economy",
      time: "monthly",
      options: {
        topLevelSorting: true,
        products: 20,
      },
      price: 16,
      description: ["20 Products", "Top Level Sorting"],
      btn: "",
      icon: <MdDiamond color="orange" size={28} />,
    },
    {
      status: "active",
      value: "Economy",
      time: "annually",
      options: {
        topLevelSorting: true,
        products: 20,
      },
      price: 155,
      description: ["20 Products", "Top Level Sorting"],
      btn: "",
      icon: <MdDiamond color="orange" size={28} />,
    },
    {
      status: "active",
      value: "Normal",
      time: "monthly",
      options: {
        topLevelSorting: true,
        products: 30,
      },
      price: 21,
      description: ["30 Products", "Top Level Sorting"],
      btn: "",
      icon: <MdDiamond color="orange" size={28} />,
    },
    {
      status: "active",
      value: "Normal",
      time: "annually",
      options: {
        topLevelSorting: true,
        products: 30,
      },
      price: 204,
      description: ["30 Products", "Top Level Sorting"],
      btn: "",
      icon: <MdDiamond color="orange" size={28} />,
    },
    {
      status: "active",
      value: "Premium",
      time: "monthly",
      options: {
        topLevelSorting: true,
        products: 100,
      },
      price: 31,
      description: ["100 Products", "Top Level Sorting"],
      btn: "",
      icon: <MdDiamond color="orange" size={28} />,
    },
    {
      status: "active",
      value: "Premium",
      time: "annually",
      options: {
        topLevelSorting: true,
        products: 100,
      },
      price: 301,
      description: ["100 Products", "Top Level Sorting"],
      btn: "",
      icon: <MdDiamond color="orange" size={28} />,
    },
    {
      status: "active",
      value: "Premium+",
      time: "monthly",
      options: {
        topLevelSorting: true,
        products: 100000,
      },
      price: 50,
      description: ["Unlimited Products", "Top Level Sorting"],
      btn: "",
      icon: <MdDiamond color="orange" size={28} />,
    },
    {
      status: "active",
      value: "Premium+",
      time: "annually",
      options: {
        topLevelSorting: true,
        products: 100000,
      },
      price: 495,
      description: ["Unlimited Products", "Top Level Sorting"],
      btn: "",
      icon: <MdDiamond color="orange" size={28} />,
    },
  ];

  return (
    <div className="w-full pl-4 pr-4 text-gray-500 flex flex-col items-center justify-center gap-4 laptop:gap-8 mt-4 pb-16 laptop:pb-0">
      <div className="mr-0 laptop:mr-20 mt-0 laptop:mt-8 flex items-center justify-center gap-4 w-full">
        <div
          onClick={() => setPeriod("monthly")}
          className={`relative flex items-center gap-2 justify-center w-1/2 laptop:w-64 rounded-xl text-center p-4 pt-3 pb-4 shadow-md font-semibold ${
            period === "monthly"
              ? "cursor-default hover:none text-black bg-white"
              : "cursor-pointer hover:brightness-95 text-inherit bg-gray-100"
          }`}
        >
          {period === "monthly" && <MdOutlineDone color="red" size={24} />}
          monthly
        </div>
        <div
          onClick={() => setPeriod("annually")}
          className={`relative flex items-center gap-2 justify-center w-1/2 laptop:w-64 rounded-xl text-center p-4 pt-3 pb-4 shadow-md font-semibold ${
            period === "annually"
              ? "cursor-default hover:none bg-white text-black"
              : "cursor-pointer hover:brightness-95 bg-gray-100"
          }`}
        >
          {period === "annually" && <MdOutlineDone color="red" size={24} />}
          annually <span className="text-green-500 font-semibold">(-19%)</span>
        </div>
      </div>
      <div className="mr-0 laptop:mr-20 w-full laptop:h-96 laptop:w-4/5 rounded-xl shadow-sm p-4 laptop:p-8 flex flex-col laptop:flex-row items-center justify-center gap-4 bg-white">
        {items
          ?.filter(
            (it: any) =>
              it?.time?.toLowerCase() === period?.toLowerCase() || !it?.time
          )
          ?.map((item: any, index: any) => {
            return <Item item={item} key={index} period={period} />;
          })}
      </div>
      <div className="w-full laptop:w-4/5 h-40 mr-0 laptop:mr-20 rounded-xl shadow-sm flex items-center justify-between pl-16 pr-16 bg-white">
        <div>
          <h1>Have questions?</h1>
          <p className="text-xl">Request call!</p>
        </div>

        <div className="h-11 w-40">
          <Button
            title={activeLanguage.support}
            onClick={() => alert("Support")}
            background="red"
            color="white"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
