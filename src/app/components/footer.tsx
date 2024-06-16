"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
  // define path name
  const pathname = usePathname();
  return (
    <div
      className={`p-2 pl-8 ${
        (pathname.startsWith("/admin") ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/signup")) &&
        "hidden"
      } bg-white shadow-sm fixed bottom-0 z-20 w-full border-[1px] h-10 hidden desktop:visible`}
    >
      <div className="text-black">&copy; Copyright</div>
    </div>
  );
}
