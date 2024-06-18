import { useApp } from "@/app/context/app";
import { useUserContext } from "@/app/context/user";
import axios from "axios";
import Image from "@/app/components/image";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdDiamond, MdStar } from "react-icons/md";
import getUsers from "@/app/hooks/getUsers";

const RecommendedUsers = () => {
  // app context
  const { apiUrl } = useApp();

  // router
  const router = useRouter();

  /**
   * getting recommended users
   */
  const [users, setUsers] = useState<[]>([]);

  const GetUsers = async () => {
    try {
      const response = await getUsers({
        apiUrl,
        page: 1,
        limit: 6,
        search: "",
      });
      setUsers(response.data.users);
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    GetUsers();
  }, [apiUrl]);

  // Function to format the rating
  const formatRating = (rating: any) => {
    if (rating < 1000) return rating;
    if (rating < 10000) return `${(rating / 1000).toFixed(0)}k`;
    if (rating < 1000000) return `${Math.floor(rating / 1000)}k`;
    return `${(rating / 1000000).toFixed(1)}m`;
  };

  // user context
  const { setUser } = useUserContext();

  return (
    <div className="w-full flex laptop:h-32 flex-col laptop:flex-row items-center gap-2 p-2 overflow-x-auto">
      {users?.length > 0 &&
        users?.map((item: any, index: number) => {
          return (
            <div
              onClick={() => {
                router.push(`/user/${item.userId}/products`);
                setUser(item);
              }}
              key={index}
              className="relative hover:brightness-90 cursor-pointer transition-all text-black flex flex-col gap-2 w-full laptop:max-w-48 overflow-hidden  h-full bg-white rounded-xl p-4"
            >
              <MdDiamond
                size={16}
                className={`${
                  item?.subscription?.type !== "Free"
                    ? "text-orange-500"
                    : "text-gray-400"
                } hover:brightness-90 absolute top-2 right-2`}
              />

              <div className="flex items-center gap-4">
                <div
                  className={`relative shadow-md w-10 h-10 aspect-square overflow-hidden bg-gray-300 rounded-full overflow-hidden flex items-center justify-center`}
                >
                  <Image
                    alt={item?.name}
                    src={item?.cover?.url}
                    style={{
                      aspectRatio: 1,
                      zIndex: 0,
                      width: "100%",
                    }}
                  />
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {formatRating(item.rating || 0)}{" "}
                  <MdStar size={20} color="orange" />
                </div>
              </div>

              <h3 className="text-black font-semibold whitespace-nowrap">
                {item.name}
              </h3>
            </div>
          );
        })}
    </div>
  );
};

export default RecommendedUsers;
