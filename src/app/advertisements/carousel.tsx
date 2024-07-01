import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useAdsContext } from "../context/advertisments";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useApp } from "../context/app";

const Carousel = () => {
  const { currentAd } = useAdsContext();
  const { activeLanguage } = useApp();
  const router = useRouter();
  return (
    currentAd && (
      <>
        <div
          onClick={() => router.push("/support")}
          // onClick={() => router.push(currentAd?.url)}
          className={`relative overflow-hidden rounded-xl shadow-md bg-gray-50 text-gray-300 flex items-center justify-center hover:brightness-90 cursor-pointer`}
          style={{
            width: "100%",
            aspectRatio: 3.5,
            fontWeight: 600,
            cursor: "pointer",
            transition: "ease-in 200ms",
          }}
        >
          <Image
            src={currentAd.img}
            alt={currentAd.ad}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            placeholder="blur"
            blurDataURL={currentAd.img} // You might want to use a lower resolution image for the blurDataURL
          />
          <Link href="/support" className="flex justify-end p-2 w-full h-full">
            <div
              style={{ fontSize: "12px" }}
              className="absolute z-10 bg-white text-red-500 p-1 px-3 shadow-md rounded-full text-sm font-semibold"
            >
              {activeLanguage?.ad}
            </div>
          </Link>
          <Link
            onClick={(e) => e.stopPropagation()}
            href="/advertisements?from=ads"
            style={{
              fontSize: "12px",
              background: "rgba(0,0,0,0.4)",
              cursor: "pointer",
            }}
            className="absolute z-10 bottom-2 right-2 text-white px-2 shadow-md rounded-full text-sm font-semibold"
          >
            <MdOutlineKeyboardDoubleArrowRight
              size={20}
              className="hover:brightness-90"
            />
          </Link>
        </div>
      </>
    )
  );
};

export default Carousel;
