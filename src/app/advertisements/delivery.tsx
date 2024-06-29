import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaTruckFast } from "react-icons/fa6";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useAdsContext } from "../context/advertisments";
import { useApp } from "../context/app";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

const CarouselComponent = () => {
  const { currentDelivery } = useAdsContext();
  const { activeLanguage } = useApp();
  const router = useRouter();

  return (
    <div className="flex-1 w-full">
      <div className="w-full h-full overflow-hidden flex items-center">
        <div
          onClick={() => router.push("/support")}
          className="w-full relative py-1 flex items-center gap-2 text-gray-400 whitespace-nowrap animate-marquee"
          style={{
            fontWeight: 600,
            transition: "ease-in 200ms",
          }}
        >
          <div className=" z-10 bg-gray-100 px-2">
            <Link href="/support" className="flex justify-end w-full h-full">
              <div
                style={{ fontSize: "12px" }}
                className="bg-white text-red-500 p-1 px-3 shadow-md rounded-full text-sm font-semibold"
              >
                {activeLanguage?.ad}
              </div>
            </Link>
          </div>

          <div
            style={{ fontSize: "16px" }}
            className="flex items-center gap-1 mr-6"
          >
            {currentDelivery.ad}
            <FaTruckFast size={18} />
            <div style={{ fontSize: "12px", marginLeft: "8px" }}>
              {currentDelivery?.description}
            </div>
          </div>

          <div className="px-2 ml-auto" onClick={(e) => e.stopPropagation()}>
            <Link
              href="/advertisements?from=delivery"
              className="flex justify-end w-full h-full"
            >
              <div
                style={{ fontSize: "12px" }}
                className="bg-white text-red-500 p-1 px-3 shadow-md rounded-full text-sm font-semibold"
              >
                <MdOutlineKeyboardDoubleArrowRight
                  size={20}
                  className="hover:brightness-90"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselComponent;
