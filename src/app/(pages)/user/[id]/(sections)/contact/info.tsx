"use client";
import GoogleMap from "@/app/components/googleMap";
import SimpleSnackbar from "@/app/components/snackBar";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useUserContext } from "@/app/context/user";
import { ContactEmergency } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTelegram, FaViber, FaWhatsapp } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";

interface propsTypes {}

const Info: React.FC<propsTypes> = () => {
  // router
  const router = useRouter();

  // user context
  const { user } = useUserContext();

  // app context
  const { apiUrl, activeLanguage } = useApp();

  // auth context
  const { currentUser } = useAuth();

  // active address
  const [activeAddress, setActiveAddress] = useState({ address: "" });

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      setActiveAddress(user?.addresses?.find((i: any) => i.main));
    }
  }, [user]);

  // alert state
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  return (
    <div className="p-4 flex flex-col laptop:flex-row gap-8 w-full h-full pb-16 laptop:pb-4">
      <div className="flex-1 flex flex-col gap-4 w-full h-full">
        <div className="flex items-center gap-2">
          <ContactEmergency sx={{ fontSize: 24 }} />
          <span className="text-md font-semibold">
            {activeLanguage.contact}:
          </span>
        </div>
        <div className="flex flex-col gap-4 font-semibold w-full">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm">{activeLanguage.email}: </h4>
            <div className="font-normal">
              <h3>
                <a
                  href={`mailto:${user?.email}`}
                  className="text-blue-500 underline"
                >
                  {user?.email}
                </a>
              </h3>
            </div>
          </div>
          {user?.phone && user?.phone?.number.length > 0 && (
            <div className="flex flex-col gap-1">
              <h5 className="text-sm">{activeLanguage.phone}: </h5>
              <div className="font-normal">
                <h3>
                  <a
                    href={`tel:${user?.phone.number}`}
                    className="text-blue-500 underline"
                  >
                    {user?.phone.number}
                  </a>
                </h3>
              </div>
            </div>
          )}
          {user?.phone?.number?.length > 0 && (
            <div className="w-full flex items-center gap-2">
              {user?.phone?.whatsapp && (
                <a
                  href={`https://wa.me/${user.phone.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-gray-50 shadow-md rounded-md p-1"
                >
                  <FaWhatsapp size={24} />
                </a>
              )}
              {user?.phone?.viber && (
                <a
                  href={`viber://chat?number=${user.phone.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-gray-50 shadow-md rounded-md p-1"
                >
                  <FaViber size={24} />
                </a>
              )}
              {user?.phone?.telegram && (
                <a
                  href={`https://t.me/${user.phone.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-gray-50 shadow-md rounded-md p-1"
                >
                  <FaTelegram size={24} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4 w-full h-full">
        {user?.addresses?.length > 0 && (
          <div className="flex flex-col gap-2 w-full">
            <span className="text-sm font-semibold">
              {activeLanguage.address}:{" "}
            </span>
            <div className="flex items-center gap-2"></div>
            {user?.addresses?.length > 0 && (
              <div
                className="w-full max-h-32 rounded-md shadow-sm p-2 flex flex-col gap-1 bg-gray-100"
                style={{ overflowY: "auto" }}
              >
                {user?.addresses?.length > 0 &&
                  user?.addresses?.map((item: any, index: number) => {
                    return (
                      <div
                        onClick={() => setActiveAddress(item)}
                        className="bg-white p-2 text-sm rounded-md shadow-sm cursor-pointer hover:brightness-90 transition-all flex items-center justify-between"
                        style={{
                          border:
                            activeAddress?.address === item?.address
                              ? "2px solid red"
                              : "2px solid white",
                        }}
                        key={index}
                      >
                        <div className="flex items-center gap-2">
                          <MdLocationPin
                            color={item.main ? "red" : "gray"}
                            size={24}
                          />
                          <span>{item.address}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
        <div className="w-1/1 h-96">
          {user?.addresses?.length > 0 && <GoogleMap address={activeAddress} />}
        </div>
      </div>
      <SimpleSnackbar alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default Info;
