import Image from "@/app/components/image";
import { formatNumbers } from "@/app/utils/formatNumbers";
import React, { useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { MdStar } from "react-icons/md";

interface propsTypes {
  list: any;
  rating: number;
  saves: number;
  user: any;
  price: any;
}

const Gallery: React.FC<propsTypes> = ({
  list,
  rating,
  saves,
  user,
  price,
}) => {
  // get cover
  const cover = list?.findIndex((i: any) => i.cover);

  // active image
  const [active, setActive] = useState(cover);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.scrollTo({
        left: galleryRef.current.offsetWidth * active,
        behavior: "smooth",
      });
    }
  }, [active]);

  // Filter items with .cover true
  const coverItems = list && list?.filter((item: any) => item?.cover);

  // Filter items with .cover false or undefined
  const nonCoverItems = list && list.filter((item: any) => !item?.cover);

  // Concatenate coverItems first and then nonCoverItems
  const reorderedGallery = coverItems &&
    nonCoverItems && [...coverItems, ...nonCoverItems];

  return (
    <div className="laptop:p-2 flex-1 flex flex-col laptop:flex-row gap-0 laptop:gap-2 w-full h-full rounded-xl bg-gray-100 shadow-sm text-black overflow-y-auto">
      <div
        className="laptop:w-36 w-full h-full flex laptop:flex-col gap-2 laptop:gap-0"
        style={{ maxHeight: "35.5rem", overflowY: "auto" }}
      >
        {list?.map((itm: any, index: number) => {
          return (
            <div
              key={index}
              onClick={() => setActive(index)}
              className={`relative shadow-md border-[3px] hover:brightness-75 mb-2 w-1/5 aspect-square laptop:h-28 laptop:w-28 overflow-hidden bg-gray-300 rounded-xl overflow-hidden`}
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
          className="flex items-center gap-1 tex-sm absolute top-2 left-2 pt-1 pb-1 pl-2 pr-2 rounded-full z-10"
        >
          <MdStar size={24} color="orange" />
          <h4 className="">{rating && formatNumbers(rating)}</h4>
          <FaHeart size={18} color="red" className="ml-2" />
          <h4 className="">{saves && formatNumbers(saves)}</h4>
        </div>

        <div
          ref={galleryRef}
          className="w-full flex overflow-x-scroll aspect-square relative"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch", // Enables momentum scrolling on iOS Safari
          }}
        >
          {price?.newPrice?.length > 0 && (
            <div className="bg-red-500 text-sm absolute right-0 top-2 z-10 text-white py-1 px-3 rounded-bl-full rounded-tl-full">
              -
              {(
                ((parseInt(price.value) - parseInt(price.newPrice)) /
                  parseInt(price.value)) *
                100
              ).toFixed()}
              %
            </div>
          )}
          {reorderedGallery?.map((file: any, index: number) => (
            <div
              key={index}
              className="relative min-w-full aspect-square bg-gray-300 hover:brightness-95 transition-all overflow-hidden"
              style={{ scrollSnapAlign: "center" }}
            >
              <Image
                alt={user?.name}
                src={file?.url}
                style={{
                  aspectRatio: 1,
                  zIndex: 0,
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
