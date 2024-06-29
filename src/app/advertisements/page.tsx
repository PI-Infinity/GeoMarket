"use client";
import React from "react";
import { useAdsContext } from "../context/advertisments";
import Image from "next/image";
import Button from "../components/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "../context/app";

const Ads = () => {
  const { activeLanguage } = useApp();
  const { shuffledAds, shuffledDeliveries } = useAdsContext();
  const router = useRouter();
  const searchParams = useSearchParams().get("from");

  let list;
  if (searchParams === "ads") {
    list = shuffledAds;
  } else {
    list = shuffledDeliveries;
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <h4 className="text-gray-400 pl-2">{activeLanguage?.advertisements}</h4>
      {list?.map((item: any, index: number) => {
        return (
          <div key={index} className="w-full p-2 shadow-md rounded-xl bg-white">
            <div
              className={`relative overflow-hidden rounded-xl shadow-md bg-gray-50 text-gray-300 flex items-center mb-2 hover:brightness-90 cursor-pointer`}
              style={{
                width: "100%",
                aspectRatio: 3.5,
                fontWeight: 600,
                cursor: "pointer",
                transition: "ease-in 200ms",
              }}
            >
              <Image
                src={item.img}
                alt={item.ad}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                placeholder="blur"
                blurDataURL={item.img} // You might want to use a lower resolution image for the blurDataURL
              />
            </div>
            <div className="text-black flex flex-col gap-1">
              <h3 className="pl-2">{item.ad}</h3>
              <p className="text-black pl-2 text-sm">{item?.description}</p>
              <div className="h-11 w-full">
                <Button
                  title={activeLanguage?.seeMore}
                  background="green"
                  color="white"
                  onClick={() => router.push("/support")}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Ads;
