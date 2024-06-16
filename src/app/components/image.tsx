import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Image = ({ src, alt, onClick, style }: any) => {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (alt && !src) {
      setLoad(true);
    }
  }, [src, alt]);

  return (
    <div
      style={{
        ...style,
        overflow: "hidden",
        zIndex: 0,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      className="text-gray-300 bg-gray-100"
      onClick={onClick}
    >
      <div
        className="opacity-1 absolute -top-1  w-full h-full opacity"
        style={{ opacity: load ? 0 : 1, transition: "ease-out 250ms" }}
      >
        <Skeleton className="h-full w-full" />
      </div>
      {src && src?.length > 0 ? (
        <img
          src={src}
          alt={alt}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: load ? 1 : 0,
            transition: "ease-in 250ms",
          }}
          onLoad={() => setLoad(true)}
        />
      ) : (
        <FaUser size="50%" />
      )}
    </div>
  );
};

export default Image;
