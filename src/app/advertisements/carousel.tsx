import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAdsContext } from "../context/advertisments";

const Carousel = () => {
  const { currentAd } = useAdsContext();

  return (
    currentAd && (
      <>
        <Link
          href="/support"
          className={`relative overflow-hidden rounded-xl shadow-md bg-gray-50 text-gray-300 flex items-center justify-center mb-2 hover:brightness-90 cursor-pointer`}
          style={{
            width: "100%",
            aspectRatio: 3.5,
            fontWeight: 600,
            cursor: "pointer",
            transition: "ease-in 200ms",
          }}
        >
          <Image
            src={currentAd.path}
            alt={currentAd.ad}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            placeholder="blur"
            blurDataURL={currentAd.path} // You might want to use a lower resolution image for the blurDataURL
          />
          <div
            // style={{ background: "rgba(0,0,0,0.3)" }}
            className="flex justify-end p-2 w-full h-full"
          >
            <div
              style={{ fontSize: "12px" }}
              className="absolute z-10 bg-white text-red-500 p-1 px-3 shadow-md rounded-full text-sm font-semibold"
            >
              რეკლამა
            </div>
          </div>
        </Link>
      </>
    )
  );
};

export default Carousel;
