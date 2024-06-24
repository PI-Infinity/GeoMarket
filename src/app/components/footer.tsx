"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  // define path name
  const pathname = usePathname();
  return (
    <div
      className={`p-2${
        (pathname.startsWith("/admin") ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/signup")) &&
        "hidden"
      } bg-white shadow-sm fixed bottom-0 z-20 w-full border-[1px] h-10 hidden desktop:flex`}
    >
      <div className="pl-8 text-black h-full w-40 bg-white z-10 flex items-center">
        &copy; Copyright
      </div>
      <div
        style={{ fontSize: "12px" }}
        className="text-red-500 h-full w-full text-center font-semibold flex items-center justify-center animate-marquee"
      >
        პლატფორმა მუშაობს სატესტო რეჟიმში, ხარვეზების დაფიქსირების შემთხვევაში{" "}
        <Link
          href="/support"
          style={{
            fontSize: "12px",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          className="font-bold ml-2"
        >
          მოგვწერეთ!
        </Link>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
