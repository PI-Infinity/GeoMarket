"use client";
import Button from "@/app/components/button";
import { Input } from "@/app/components/input";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { removeCookie } from "@/app/utils/cookies";
import { Switch } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTelegram, FaViber, FaWhatsapp } from "react-icons/fa6";

export const AddFields = () => {
  const { activeLanguage } = useApp();
  const [name, setName] = useState<any>("");
  const [phone, setPhone] = useState<any>("");
  const [whatsapp, setWhatsapp] = useState(false);
  const [viber, setViber] = useState(false);
  const [telegram, setTelegram] = useState(false);

  const { currentUser, setCurrentUser, setOpenBackDrop, setDestination } =
    useAuth();

  const { apiUrl } = useApp();

  useEffect(() => {
    if (currentUser) {
      setPhone(currentUser?.phone?.number);
      setName(currentUser?.name);
    }
  }, [currentUser]);

  const [loading, setLoading] = useState(false);

  // save info
  const SaveInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(
        apiUrl + "/api/v1/users/" + currentUser?.userId,
        {
          name: name,
          phone: {
            number: phone || "",
            code: "",
            whatsapp: false,
            viber: false,
            telegram: false,
          },
        }
      );
      if (response.data.status === "success") {
        setCurrentUser((prev: any) => ({
          ...prev,
          name: name,
          phone: {
            number: phone || "",
            code: "",
            whatsapp: whatsapp,
            viber: viber,
            telegram: telegram,
          },
        }));
      }
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      setLoading(false);
      console.log(error.response.data.message);
    }
  };

  /**
   * Logout function
   */
  const router = useRouter();
  const Logout = async () => {
    try {
      setOpenBackDrop(true);

      removeCookie("GeoMarket:currentUser");

      setCurrentUser(null);
      // googleLogout();
      router.push("/login");

      setDestination({
        productId: null,
        userId: null,
        page: null,
      });
      setTimeout(() => {
        setOpenBackDrop(false);
      }, 700);
    } catch (error) {
      console.error("Logout error:", error);
      // Handle any errors here, such as updating UI to show an error message
    }
  };

  return (
    <div
      style={{
        display:
          currentUser &&
          (!currentUser?.phone?.number ||
            currentUser?.phone?.number?.length < 9 ||
            currentUser?.name === currentUser?.email)
            ? "flex"
            : "none",
      }}
      className="fixed top-0 z-40 w-full min-h-screen bg-gray-50 flex-col items-center justify-center gap-4 px-8 "
    >
      <div className="w-full laptop:w-1/3 flex flex-col items-center justify-center gap-2 relative bottom-16">
        <h2 className="text-black mb-8">{activeLanguage?.personalInfo}</h2>
        <div className="w-full flex flex-col gap-2">
          <h4 className="text-gray-300 ml-4" style={{ fontWeight: 500 }}>
            {activeLanguage.firstName +
              " " +
              activeLanguage?.and +
              " " +
              activeLanguage?.lastName +
              ", " +
              activeLanguage?.or +
              " " +
              activeLanguage?.title +
              "*"}
          </h4>
          <Input
            label={
              activeLanguage.firstName +
              " " +
              activeLanguage?.and +
              " " +
              activeLanguage?.lastName +
              ", " +
              activeLanguage?.or +
              " " +
              activeLanguage?.title +
              "*"
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            warning={false}
            returnKeyType="next"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const nextField = document.getElementById(
                  "phone"
                ) as HTMLInputElement;
                if (nextField) {
                  nextField?.focus();
                }
              }
            }}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <h4 className="text-gray-300 ml-4" style={{ fontWeight: 500 }}>
            {activeLanguage?.phone}
          </h4>
          <Input
            id="phone"
            label={activeLanguage.phone + "*"}
            value={phone?.number}
            onChange={(e) => setPhone(e.target.value)}
            type="text"
            returnKeyType="next"
            warning={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                SaveInfo();
              }
            }}
          />
        </div>
        <div className="w-full flex items-center gap-2">
          <div className="flex items-center bg-gray-50 shadow-md rounded-xl p-1 pr-3">
            <Switch
              checked={whatsapp}
              onChange={() => setWhatsapp((prev: any) => !prev)}
            />
            <FaWhatsapp size={24} color="black" />
          </div>
          <div className="flex items-center bg-gray-50 shadow-md rounded-xl p-1 pr-3">
            <Switch
              checked={viber}
              onChange={() => setViber((prev: any) => !prev)}
            />
            <FaViber size={24} color="black" />
          </div>
          <div className="flex items-center bg-gray-50 shadow-md rounded-xl p-1 pr-3">
            <Switch
              checked={telegram}
              onChange={() => setTelegram((prev: any) => !prev)}
            />
            <FaTelegram size={24} color="black" />
          </div>
        </div>
        <div className="w-full h-11 mt-8">
          <Button
            title={activeLanguage?.confirm}
            background="green"
            color="white"
            loading={loading}
            disabled={phone?.length < 9 || name?.length < 1 ? true : false}
            onClick={
              phone?.length < 9 || name?.length < 1
                ? () => undefined
                : () => SaveInfo()
            }
          />
        </div>
        <div className="w-full h-11 mt-8">
          <Button
            title={activeLanguage?.logout}
            background="red"
            color="white"
            disabled={phone?.length < 9 || name?.length < 1 ? true : false}
            onClick={Logout}
          />
        </div>
      </div>
    </div>
  );
};
