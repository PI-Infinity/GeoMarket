import { useApp } from "@/app/context/app";
import { useUserContext } from "@/app/context/user";
import axios from "axios";
import Image from "@/app/components/image";
import { useRouter } from "next/navigation";
import nProgress from "nprogress";
import React, { useEffect, useState } from "react";
import { FaUser, FaUsers } from "react-icons/fa";
import { MdDiamond, MdStar } from "react-icons/md";
import getUsers from "@/app/hooks/getUsers";
import { useProductsContext } from "@/app/context/products";
import { CgProductHunt } from "react-icons/cg";

const RecommendedUsers = () => {
  // app context
  const { apiUrl } = useApp();

  // products context
  const { categories } = useProductsContext();

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
        onlySellers: "true",
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
    <div className="w-full flex flex-col laptop:flex-row items-center gap-2 p-2 overflow-x-auto">
      {users?.length > 0 &&
        users?.map((item: any, index: number) => {
          return (
            <div
              onClick={() => {
                router.push(`/user/${item.userId}/products`);
                setUser(item);
              }}
              key={index}
              className="relative shadow-xl hover:brightness-90 cursor-pointer transition-all text-black flex flex-col gap-2 w-full laptop:max-w-60 overflow-hidden  h-full bg-white rounded-xl p-4"
            >
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
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm">
                    <CgProductHunt size={23} />
                    {item?.productsLength}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <MdStar size={20} color="orange" />
                    {formatRating(item.rating || 0)}
                  </div>
                  <div className={`flex items-center text-md gap-1`}>
                    <FaUsers size={22} />
                    {item?.productsLength}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <MdDiamond
                    size={16}
                    className={`${
                      item?.subscription?.type !== "Free"
                        ? "text-orange-500"
                        : "text-gray-400"
                    } hover:brightness-90`}
                  />
                  <h4 className="text-black font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {item.name}
                  </h4>
                </div>
                <span className="text-black text-sm whitespace-nowrap">
                  {
                    categories?.find((i: any) => i.value === item.category)
                      .label
                  }
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default RecommendedUsers;
