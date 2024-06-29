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
          className="w-full relative py-1 flex items-center gap-2 text-gray-400 whitespace-nowrap"
          style={{
            fontWeight: 600,
            transition: "ease-in 200ms",
          }}
        >
          <div className="bg-gray-100 w-2/6">
            <Link href="/support" className="flex w-full h-full">
              <div
                style={{ fontSize: "12px" }}
                className="bg-white text-red-500 p-1 px-3 shadow-sm rounded-full flex items-center gap-1 text-sm font-semibold"
              >
                <FaTruckFast size={16} />
                {activeLanguage?.ad}
              </div>
            </Link>
          </div>

          <div
            style={{ fontSize: "16px" }}
            className="flex items-center justify-center font-semibold gap-1 w-2/6 "
          >
            {currentDelivery?.ad}
          </div>

          <div className="w-2/6" onClick={(e) => e.stopPropagation()}>
            <Link
              href="/advertisements?from=delivery"
              className="flex justify-end w-full h-full"
            >
              <div
                style={{ fontSize: "12px" }}
                className="bg-white text-red-500 p-1 px-3 shadow-sm rounded-full text-sm font-semibold flex items-center gap-1"
              >
                {activeLanguage?.all}
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
