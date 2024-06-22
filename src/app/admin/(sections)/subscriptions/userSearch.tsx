"use client";
import Image from "@/app/components/image";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";

const Search = ({ setUser }: any) => {
  const { apiUrl, activeLanguage } = useApp();

  const { currentUser } = useAuth();

  const [search, setSearch] = useState("");

  const [suggestions, setSuggesions] = useState([]);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const GetSuggesations = async () => {
      try {
        const response = await axios.get(
          apiUrl +
            `/api/v1/users?search=${search}&page=1&limit=12&onlySellers=false`
        );
        setSuggesions(response.data.data.users);
      } catch (error: any) {
        console.log(error.response.data.message);
      }
    };
    if (search?.length > 0 && hide) {
      GetSuggesations();
    } else {
      setSuggesions([]);
    }
  }, [search]);

  return (
    <div className="w-full flex flex-col text-gray-400">
      <h4 className="mb-2">Find User</h4>
      <div className="w-full h-11 rounded-xl flex items-center overflow-hidden shadow-sm">
        <div className="min-w-14 flex items-center justify-center bg-gray-300 h-full">
          <MdSearch size={30} color="white" />
        </div>
        <input
          value={search}
          onChange={(e) => {
            setHide(true);
            setSearch(e.target.value);
          }}
          placeholder={
            activeLanguage && typeof activeLanguage.search === "string"
              ? activeLanguage.search
              : "Search user by name..."
          }
          className="h-full w-full p-4 text-black"
        />
        {search?.length > 0 && (
          <div
            onClick={() => setSearch("")}
            className="bg-white h-full cursor-pointer hover:brightness-95 px-2 flex items-center justify-center"
          >
            <MdClose size={24} color="red" />
          </div>
        )}
      </div>
      <div
        className={`bg-white w-full mt-${
          suggestions?.length > 0 ? 2 : 0
        } rounded-xl shadow-sm flex flex-col gap-2 p-${
          suggestions?.length > 0 ? 4 : 0
        } mt-${suggestions?.length > 0 ? 1 : 0} max-h-96 overflow-auto`}
      >
        {search?.length > 0 &&
        suggestions?.filter((i: any) => i.userId !== currentUser?.userId)
          ?.length < 1 ? (
          <div className="m-4 color-red">Not Found</div>
        ) : (
          suggestions
            ?.filter((i: any) => i.userId !== currentUser?.userId)
            ?.map((item: any, index: number) => {
              return (
                <span
                  className="text-black text-sm font-semibold cursor-pointer hover:brightness-110 flex items-center gap-2"
                  key={index}
                  onClick={() => {
                    setUser(item);
                    setSuggesions([]);
                    setHide(false);
                    setSearch("");
                  }}
                >
                  <Link
                    href={`/user/${item.userId}/products`}
                    onClick={(e) => e.stopPropagation()}
                    className={`cursor-pointer hover:brightness-95 relative shadow-md w-10 h-10 aspect-square overflow-hidden bg-gray-300 rounded-full overflow-hidden flex items-center justify-center`}
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
                  </Link>
                  <span className="text-sm whitespace-nowrap font-semibold max-w-64 laptop:max-w-96  overflow-hidden overflow-ellipsis">
                    {item.name}
                  </span>
                </span>
              );
            })
        )}
      </div>
    </div>
  );
};

export default Search;
