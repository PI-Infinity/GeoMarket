import { useApp } from "@/app/context/app";
import Link from "next/link";
import { usePathname } from "next/navigation";
import nProgress from "nprogress";
import { useAdminContext } from "../context/admin";

const LeftBar = () => {
  // admin context
  const { menuList } = useAdminContext();

  // get section title
  const pathname = usePathname();
  const section = pathname.split("/")[2] || "";

  return (
    <div
      className={`static laptop:h-[calc(100%-8.5rem)] h-full pb-8 laptop:pb-0 laptop:fixed w-full laptop:w-80 bg-white rounded-xl shadow-sm flex flex-col items-center text-black`}
    >
      <ul className="mt-4 flex flex-col gap-2 w-80 laptop:w-64">
        {menuList.map((item: any, index: number) => {
          return (
            <Link
              key={index}
              href={`/admin/${item.path}`}
              className="hover:brightness-95 flex items-center w-full bg-gray-50 text-black font-semibold cursor-pointer shadow-sm rounded-xl"
            >
              <div
                className={`w-4 h-4 ml-4 rounded-full bg-${
                  item.path === section ? "red" : "gray"
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
