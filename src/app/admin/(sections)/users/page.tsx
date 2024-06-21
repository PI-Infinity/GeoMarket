"use client";
import { useApp } from "@/app/context/app";
import getUsers from "@/app/hooks/getUsers";
import * as React from "react";
import Item from "./item";
import Sections from "./sections";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import { MoonLoader } from "react-spinners";

// Define the User type for better type safety
interface User {
  id: number;
  name: string;
  email: string;
  phone: { value: string };
}

export default function UsersTable() {
  const { apiUrl } = useApp();

  const [users, setUsers] = React.useState<User[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [search, setSearch] = React.useState("");
  const [totalUsers, setTotalUsers] = React.useState(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const GetUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers({
        apiUrl,
        search,
        page,
        limit: 13,
        onlySellers: "false",
        admin: "true",
      });

      setUsers(response.data.users);
      setTotalUsers(response.totalUsers);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.error(error.response?.data || error.message);
    }
  };

  React.useEffect(() => {
    GetUsers();
  }, [apiUrl, page]);

  // user ref
  const containerRef = React.useRef<any>(null);

  // pages
  const pages = (totalUsers && Math.ceil(totalUsers / 13)) || 1;

  const pageNumbers: number[] = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div style={{ height: "100%", overflowX: "scroll" }}>
      <Sections items={items} />
      <div
        className="min-w-full flex flex-col items-center justify-between min-h-full"
        ref={containerRef}
      >
        <div className="h-full w-full relative">
          {loading ? (
            <div
              style={{ height: "70vh" }}
              className="h-full flex items-center justify-center"
            >
              <MoonLoader size={32} color="red" />
            </div>
          ) : (
            users?.map((item: any, index: any) => {
              return (
                <Item item={item} index={index} key={index} items={items} />
              );
            })
          )}
        </div>
        {totalUsers && totalUsers > users?.length && (
          <div className="min-w-full flex justify-between items-center my-2 text-center shadow-md rounded-full py-1 px-3 font-semibold">
            <div
              onClick={() =>
                setPage((prev: any) => (prev > 1 ? (prev -= 1) : (prev = 1)))
              }
              className="cursor-pointer p-1 rounded-full shadow-md hover:brightness-95 bg-white"
            >
              <MdArrowLeft size={24} />
            </div>
            <div className="flex items-center">
              <div className="flex items-center gap-2 max-w-96 overflow-hidden whitespace-nowrap overflow-ellipsis">
                {pageNumbers?.map((i: any, index: number) => {
                  if (index < 10) {
                    return (
                      <div
                        className="cursor-pointer"
                        style={{ color: i === page ? "black" : "#b9b9b9" }}
                        onClick={() => setPage(i)}
                      >
                        {i}
                      </div>
                    );
                  }
                })}
              </div>
              {pageNumbers?.length > 10 && (
                <div style={{ color: "#b9b9b9" }}>...</div>
              )}
              <div
                className="ml-4 cursor-pointer"
                onClick={() => setPage(pageNumbers[pageNumbers.length - 1])}
              >
                {pageNumbers?.length > 10 &&
                  pageNumbers[pageNumbers.length - 1]}
              </div>
            </div>
            <div
              onClick={() =>
                setPage((prev: any) =>
                  prev < pageNumbers?.length
                    ? (prev += 1)
                    : (prev = pageNumbers?.length)
                )
              }
              className="cursor-pointer p-1 rounded-full shadow-md hover:brightness-95 bg-white"
            >
              <MdArrowRight size={24} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const items = [
  {
    value: "online",
    label: "Online",
    width:
      "min-w-20 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center justify-center overflow-x-auto",
  },
  {
    value: "name",
    label: "Name",
    width:
      "min-w-48 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
  },
  {
    value: "totalProducts",
    label: "Total Products",
    width:
      "min-w-32 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
  },
  {
    value: "categories",
    label: "Categories",
    width:
      "min-w-40 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
  },
  {
    value: "email",
    label: "Email",
    width:
      "min-w-56 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
  },
  {
    value: "phone",
    label: "Phone",
    width:
      "min-w-56 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
  },
  {
    value: "subscription",
    label: "Subscription",
    width:
      "min-w-40 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
  },
  {
    value: "addresses",
    label: "Addresses",
    width:
      "min-w-40 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
  },
  {
    value: "registerDate",
    label: "Register Date",
    width:
      "min-w-40 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
  },
  {
    value: "lastVisit",
    label: "Last Visit",
    width:
      "min-w-40 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
  },
];
