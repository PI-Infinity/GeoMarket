import React, { useEffect } from "react";
import Button from "./button";
import { useApp } from "../context/app";

interface PropsType {
  confirmPopup: any;
}

const ConfirmPopup: React.FC<PropsType> = ({ confirmPopup }) => {
  const { activeLanguage, isMobile } = useApp();

  useEffect(() => {
    document.body.style.overflowY = "hidden";
  }, [confirmPopup]);

  return (
    <>
      {isMobile ? (
        <div
          className="fixed bottom-0 left-0 w-full h-80 flex flex-col flex flex-col items-center justify-center"
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
            className="text-black rounded-md flex flex-col items-center justify-center gap-8 bg-white z-100 w-5/6 py-4 shadow-sm"
          >
            <h3 className="text-center">{confirmPopup.text}</h3>
            <div className="flex items-center justify-center w-2/3 gap-4">
              <div className="w-full h-10">
                <Button
                  title={activeLanguage.no}
                  color="white"
                  background="red"
                  onClick={confirmPopup.close}
                />
              </div>
              <div className="w-full h-10">
                <Button
                  title={activeLanguage.yes}
                  color="white"
                  background="green"
                  onClick={confirmPopup.agree}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
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
            className="text-black rounded-xl flex flex-col items-center justify-center gap-8 bg-white z-100 w-2/3 h-1/3 shadow-sm"
          >
            <h3 className="text-center">{confirmPopup.text}</h3>
            <div className="flex items-center justify-center w-2/3 gap-4">
              <div className="w-full h-10">
                <Button
                  title={activeLanguage.no}
                  color="white"
                  background="red"
                  onClick={confirmPopup.close}
                />
              </div>
              <div className="w-full h-10">
                <Button
                  title={activeLanguage.yes}
                  color="white"
                  background="green"
                  onClick={confirmPopup.agree}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmPopup;
