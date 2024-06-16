import React from "react";
import Button from "./button";
import { useApp } from "../context/app";

interface PropsType {
  confirmPopup: any;
}

const ConfirmPopup: React.FC<PropsType> = ({ confirmPopup }) => {
  const { activeLanguage } = useApp();
  return (
    <div
      className="z-20 absolute w-full h-full flex flex-col top-0 left-0 flex flex-col items-center justify-center"
      style={{
        transform: `scale(${confirmPopup.active ? 1 : 0})`,
        opacity: confirmPopup.active ? 1 : 0,
        borderRadius: confirmPopup.active ? "0" : "500px",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
      }}
      onClick={confirmPopup.close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="text-black rounded-md flex flex-col items-center justify-center gap-8 bg-white z-100 w-1/3 h-1/3 shadow-sm"
      >
        <h2 className="text-center">{confirmPopup.text}</h2>
        <div className="flex items-center justify-center w-1/3 gap-4">
          <Button
            title={activeLanguage.no}
            color="black"
            background="gray"
            onClick={confirmPopup.close}
          />
          <Button
            title={activeLanguage.yes}
            color="white"
            background="green"
            onClick={confirmPopup.agree}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
