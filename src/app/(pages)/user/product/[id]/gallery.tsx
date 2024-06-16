import Image from "@/app/components/image";
import React, { useEffect, useState } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { MdStar } from "react-icons/md";

interface propsTypes {
  list: any;
  rating: number;
}

const Gallery: React.FC<propsTypes> = ({ list, rating }) => {
  // get cover
  const cover = list?.findIndex((i: any) => i.cover);

  // active image
  const [active, setActive] = useState(cover);
  useEffect(() => {
    setActive(cover);
  }, [cover]);

  // Function to format the rating
  const formatRating = (rating: any) => {
    if (rating < 1000) return rating;
    if (rating < 10000) return `${(rating / 1000).toFixed(0)}k`;
    if (rating < 1000000) return `${Math.floor(rating / 1000)}k`;
    return `${(rating / 1000000).toFixed(1)}m`;
  };

  return (
    <div className="laptop:p-2 flex-1 flex flex-col laptop:flex-row gap-0 laptop:gap-2 w-full h-full rounded-xl bg-gray-100 shadow-sm text-black overflow-y-auto">
      <div
        className="laptop:w-40 w-96 h-full flex laptop:flex-col gap-2 laptop:gap-0"
        style={{ maxHeight: "35.5rem", overflowY: "auto" }}
      >
        {list?.map((itm: any, index: number) => {
          return (
            <div
              key={index}
              onClick={() => setActive(index)}
              className={`relative shadow-md border-[3px] border-${
                active === index ? "red" : "white"
              }-500 mb-2 w-24 h-24 laptop:h-32 laptop:w-32 overflow-hidden bg-gray-300 rounded-xl overflow-hidden`}
            >
              <Image
                alt={itm?.fileId}
                src={itm.url}
                style={{
                  aspectRatio: 1,
                  zIndex: 0,
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="w-full laptop:h-fit relative shadow-md aspect-square overflow-hidden rounded-xl">
        <div
          style={{
            background: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
          className="flex items-center gap-1 tex-sm absolute top-4 left-4 pt-1 pb-1 pl-2 pr-2 rounded-full z-10"
        >
          <MdStar size={32} color="orange" />
          <h3>{rating && formatRating(rating)}</h3>
        </div>

        <Image
          alt={list && list[active]?.fileId}
          src={(list && list[active]?.url) || ""}
          style={{
            aspectRatio: 1,
            zIndex: 0,
            objectFit: "cover",
            height: "100%",
            width: "100%",
          }}
        />

        {list?.length > 1 && (
          <div
            className="absolute z-10 bottom-8 w-full h-0 bg-white text-white flex items-center justify-between pl-4 pr-4"
            style={{ transform: "translateY(50%)" }}
          >
            <IoMdArrowDropleft
              onClick={
                active === 0
                  ? undefined
                  : () => setActive((prev: number) => prev - 1)
              }
              className="text-gray-50 cursor-pointer hover:brightness-90"
              size={40}
            />
            <IoMdArrowDropright
              onClick={
                active === list?.length - 1
                  ? undefined
                  : () => setActive((prev: number) => prev + 1)
              }
              className="text-gray-50 cursor-pointer hover:brightness-90"
              size={40}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
