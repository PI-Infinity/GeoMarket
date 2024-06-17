import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useUserContext } from "@/app/context/user";
import Image from "@/app/components/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import nProgress from "nprogress";
import { FaUser } from "react-icons/fa";
import { MdDiamond, MdImage, MdShare, MdStar } from "react-icons/md";
import { useEffect, useState } from "react";
import ShareComponent from "@/app/components/shareComponent";
import axios from "axios";
import { OnlineBadge } from "@/app/components/onlineBadge";

const LeftBar = () => {
  // get section title
  const pathname = usePathname();
  const section = pathname.split("/")[3];

  // user context
  const { user } = useUserContext();

  // app context
  const { apiUrl, activeLanguage, language } = useApp();

  // filter filter
  const filterItems = [
    {
      value: "products",
      label: activeLanguage.products,
    },
    {
      value: "contact",
      label: activeLanguage.contact,
    },
  ];

  // Function to format the rating
  const formatRating = (rating: any) => {
    if (rating < 1000) return rating;
    if (rating < 10000) return `${(rating / 1000).toFixed(0)}k`;
    if (rating < 1000000) return `${Math.floor(rating / 1000)}k`;
    return `${(rating / 1000000).toFixed(1)}m`;
  };

  /**
   * share options
   */
  const [openShareOptions, setOpenShareOptions] = useState(false);

  // defines user is online or not
  const [online, setOnline] = useState(false);
  useEffect(() => {
    const GetUserStatus = async () => {
      try {
        const response = await axios.get(
          apiUrl + "/api/v1/users/" + user?.userId + "/status"
        );
        if (response.data.status === "success") {
          setOnline(response.data.data.status);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    if (user?.userId?.length > 0) {
      GetUserStatus();
    }

    const intervalId = setInterval(() => {
      GetUserStatus();
    }, 300000); // 300000 milliseconds = 5 minutes

    // Clean up the interval on component unmount or when targetUser changes
    return () => clearInterval(intervalId);
  }, [user]);

  return (
    <div
      style={{
        display: !pathname.includes("user/products") ? "flex" : "none",
      }}
      className={`laptop:h-[calc(100%-8rem)] w-full laptop:ml-2 pb-8 laptop:w-80 laptop:fixed laptop:left-0 bg-white rounded-xl h-full shadow-sm flex flex-col items-center text-black`}
    >
      <div className="flex items-center gap-2 w-full p-4">
        <MdDiamond
          size={28}
          className={`${
            user?.subscription?.type !== "Free"
              ? "text-orange-500"
              : "text-gray-400"
          } hover:brightness-90`}
        />
        <MdShare
          size={24}
          className="text-gray-300 cursor-pointer hover:brightness-95 ml-auto"
          onClick={() => setOpenShareOptions(true)}
        />
      </div>
      {openShareOptions && (
        <div className="mb-4">
          <ShareComponent
            setOpenShareOptions={setOpenShareOptions}
            path={`/user/${user?.userId}/products`}
          />
        </div>
      )}
      <OnlineBadge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        variant="dot"
        isonline={online ? "online" : "offline"}
      >
        <div
          style={{ width: "150px", height: "150px" }}
          className=" bg-gray-300 rounded-full overflow-hidden flex items-center justify-center relative"
        >
          <Image
            alt={user?.name}
            src={user?.cover?.url}
            style={{
              aspectRatio: 1,
              zIndex: 0,
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </OnlineBadge>

      <div className="mt-4 text-lg font-semibold">{user?.name}</div>
      <div className="flex items-center gap-1 mt-4">
        <MdStar size={24} color="orange" />
        <span>{user?.rating ? formatRating(user?.rating) : 0}</span>
      </div>
      {(language === "ka" && user?.about?.ka?.length > 0) ||
      (language === "en" && user?.about?.en?.length > 0) ? (
        <div className="p-4 w-full rounded-md font-normal italic text-center">
          {language === "ka" ? user?.about?.ka : user?.about?.en}
        </div>
      ) : null}

      <ul className="mt-8 flex flex-col gap-2 w-80 laptop:w-64">
        {filterItems.map((item: any, index: number) => {
          return (
            <Link
              key={index}
              href={`${item.value}`}
              className="hover:brightness-95 flex items-center w-full bg-gray-50 text-black font-semibold cursor-pointer shadow-sm rounded-xl"
            >
              <div
                className={`w-4 h-4 rounded-full ml-4 bg-${
                  item.value === section ? "red" : "gray"
                }-500`}
              ></div>
              <div className="p-2 pl-4">{item.label}</div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default LeftBar;
