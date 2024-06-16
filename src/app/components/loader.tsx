"use client";
import Image from "next/legacy/image";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import { useEffect } from "react";
import { useApp } from "../context/app";

const Loader = () => {
  let pathname = usePathname();
  let searchParams = useSearchParams();

  const { loading, setLoading, setSectionLoading } = useApp();

  useEffect(() => {
    const handleStop = () => {
      // setTimeout(() => {
      NProgress.done();
      setLoading(false);
      setSectionLoading(false);
      // }, 200);
    };
    handleStop();
  }, [pathname, searchParams]);

  return (
    <>
      {loading && (
        <div
          className="w-full h-full fixed z-50 top-0 right-0 flex items-center justify-center overflow-hidden"
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div className="h-10 w-10 relative">
            <img src={"/Georgia-xl.gif"} alt="GIF" className="w-full h-full" />
          </div>
        </div>
      )}
    </>
  );
};

export default Loader;
