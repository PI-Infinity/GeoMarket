"use client";
import { useApp } from "@/app/context/app";
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";

const Menu: React.FC = () => {
  /**
   * app context
   */
  const { openMenu, setOpenMenu, activeLanguage, language, setLanguage } =
    useApp();

  // animation opening to menu window
  const [transition, setTransition] = useState(false);
  useEffect(() => {
    setTransition(openMenu);
  }, [openMenu]);

  return (
    <div
      onClick={() => setOpenMenu(false)}
      style={{
        WebkitBackdropFilter: "blur(10px)",
        backdropFilter: "blur(10px)",
      }}
      className={`h-full w-full top-0 fixed ${
        openMenu ? "flex" : "hidden"
      } z-40 laptop:p-0`}
    >
      <div
        className={`rounded-xl shadow-md fixed top-16 laptop:top-20 mt-2 laptop:right-2 bg-white h-96 w-full laptop:w-80 scale-${
          transition ? 1 : 0
        } p-4 transition-all duration-200 ease text-black font-semibold flex flex-col gap-2`}
      >
        <div>{activeLanguage?.support}</div>
        <div>{activeLanguage?.privacyPolicy}</div>
        <div>{activeLanguage?.about}</div>
        <div>{activeLanguage?.howToUse}</div>
        <div>{activeLanguage?.termsAndRules}</div>

        <div
          className={`flex w-24 mt-8 flex-row items-center rounded-md bg-gray-50 overflow-hidden shadow-sm`}
        >
          <div
            style={{ opacity: language === "en" ? 0.3 : 1 }}
            className="w-full h-full p-1.5 transition-all cursor-pointer"
          >
            <ReactCountryFlag
              className="emojiFlag"
              onClick={() => setLanguage("ka")}
              countryCode="GE"
              style={{
                fontSize: "24px",
              }}
              aria-label="Georgia"
            />
          </div>

          <div
            style={{ opacity: language === "ka" ? 0.3 : 1 }}
            className={`w-full h-full p-1.5 brightness-95 hover:brightness-90 transition-all cursor-pointer`}
          >
            <ReactCountryFlag
              className="emojiFlag"
              onClick={() => setLanguage("en")}
              countryCode="GB"
              style={{
                fontSize: "24px",
              }}
              aria-label="United States"
            />
          </div>
        </div>
        <div className="text-sm mt-auto text-gray-300 font-normal">
          &copy; Copyright
        </div>
      </div>
    </div>
  );
};

export default Menu;
