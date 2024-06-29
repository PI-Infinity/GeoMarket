import React, { useEffect, useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import "@/app/globals.css";

const deliveries = [
  { id: "Uni Box", logo: "" },
  { id: "Onway", logo: "" },
  { id: "Easyway", logo: "" },
  { id: "Geo-express", logo: "" },
  { id: "Glovo", logo: "" },
  { id: "Walt", logo: "" },
  { id: "Georgian-Post", logo: "" },
];

// Function to shuffle array
const shuffleArray = (array: any[]): any[] => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const Delivery = () => {
  const [shuffledDeliveries, setShuffledDeliveries] = useState<any[]>([]);

  const shuffleAndSetDeliveries = () => {
    setShuffledDeliveries(shuffleArray([...deliveries]));
  };

  useEffect(() => {
    shuffleAndSetDeliveries(); // Initial shuffle on mount
  }, []);

  return (
    <div className="flex items-center gap-2 w-full relative overflow-hidden">
      <div className="p-2 h-full absolute z-10 -left-2 bg-gray-100">
        <div
          style={{ fontSize: "12px" }}
          className="z-10 bg-white text-red-500 p-1 px-3 shadow-md rounded-full text-sm font-semibold"
        >
          რეკლამა
        </div>
      </div>
      <div className="w-full flex gap-2 items-center overflow-hidden hide-scrollbar relative">
        <div className="animate-marquee flex gap-2">
          {Array(5)
            .fill(shuffledDeliveries)
            .flat()
            .map((item: any, index: number) => (
              <div
                key={index}
                className="py-1 my-2 px-3 w-full relative rounded-xl text-gray-300 flex items-center gap-1 hover:brightness-90 cursor-pointer"
                style={{
                  width: "100%",
                  fontWeight: 600,
                  transition: "ease-in 200ms",
                }}
              >
                <h4
                  className="text-gray-400 whitespace-nowrap"
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    textDecoration: "underline",
                  }}
                >
                  {item?.id}
                </h4>
                <div>
                  <TbTruckDelivery size={16} className="text-gray-500" />
                </div>
              </div>
            ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-marquee {
          display: flex;
          width: 500%;
          animation: marquee 60s linear infinite;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default Delivery;
