"use client";
import { useApp } from "@/app/context/app";
import getUsers from "@/app/hooks/getUsers";
import * as React from "react";
import Item from "./item";
import Sections from "./sections";
import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import { MoonLoader } from "react-spinners";
import getAdminUsers from "@/app/hooks/getAdminUsers";
import { GrPowerReset } from "react-icons/gr";

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
  const [sort, setSort] = React.useState({ sortField: "", sortOrder: "" });

  const GetUsers = async ({ srch, pg, srt }: any) => {
    setLoading(true);
    try {
      const response = await getAdminUsers({
        apiUrl,
        search: srch,
        page: pg,
        limit: 12,
        sort: srt,
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
    GetUsers({ srch: search, pg: page, srt: sort });
  }, [apiUrl, page, sort]);

  const ResetData = () => {
    setSearch("");
    setPage(1);
    setSort({ sortField: "", sortOrder: "" });
    GetUsers({ srch: "", pg: 1, srt: { sortField: "", sortOrder: "" } });
  };

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
      <div className="flex items-center gap-4 p-2">
        <div
          onClick={ResetData}
          className="m-2 cursor-pointer hover:brightness-95 flex items-center gap-2"
        >
          Reset
          <div className="h-6 flex items-center">
            {loading ? (
              <MoonLoader size={20} color="red" />
            ) : (
              <GrPowerReset size={20} />
            )}
          </div>
        </div>
      </div>
      <Sections items={items} sort={sort} setSort={setSort} />
      <div
        style={{ minHeight: "73vh" }}
        className="min-w-full flex flex-col items-center justify-between"
        ref={containerRef}
      >
        <div className="h-full w-full relative">
          {loading ? (
            <div
              style={{ height: "60vh" }}
              className="flex items-center justify-center"
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
                        key={index}
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
    value: "index",
    label: "N",
    width:
      "min-w-16 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center justify-center overflow-x-auto",
    sort: true,
  },
  {
    value: "online",
    label: "Online",
    width:
      "min-w-24 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center justify-center overflow-x-auto",
    sort: true,
  },
  {
    value: "name",
    label: "Name",
    width:
      "min-w-48 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
    sort: false,
  },
  {
    value: "totalProducts",
    label: "Total Products",
    width:
      "min-w-40 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center justify-center overflow-x-auto",
    sort: true,
  },
  {
    value: "categories",
    label: "Categories",
    width:
      "min-w-32 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
    sort: true,
  },
  {
    value: "email",
    label: "Email",
    width:
      "min-w-32 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
    sort: false,
  },
  {
    value: "phone",
    label: "Phone",
    width:
      "min-w-36 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
    sort: true,
  },
  {
    value: "subscription",
    label: "Subscription",
    width:
      "min-w-32 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center justify-center overflow-x-auto",
    sort: true,
  },
  {
    value: "addresses",
    label: "Addresses",
    width:
      "min-w-32 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
    sort: true,
  },
  {
    value: "registerDate",
    label: "Register Date",
    width:
      "min-w-40 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
    sort: true,
  },
  {
    value: "lastVisit",
    label: "Last Visit",
    width:
      "min-w-32 py-2 px-4 overflow-hidden text-sm whitespace-nowrap overflow-ellipsis border-r-[1px] border-b-[1px] h-10 flex items-center overflow-x-auto",
    sort: true,
  },
];
