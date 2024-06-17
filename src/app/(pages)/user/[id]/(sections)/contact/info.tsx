"use client";
import Button from "@/app/components/button";
import GoogleMap from "@/app/components/googleMap";
import { Input } from "@/app/components/input";
import SimpleSnackbar from "@/app/components/snackBar";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useChat } from "@/app/context/chat";
import { useUserContext } from "@/app/context/user";
import { ContactEmergency, Person } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTelegram, FaViber, FaWhatsapp } from "react-icons/fa";
import { MdChat, MdLocationPin } from "react-icons/md";
import { v4 } from "uuid";

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

  /**
   * sending letter to email
   */
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [phone, setPhone] = useState("");
  // const [letter, setLetter] = useState("");

  // letter send
  // const Send = async () => {
  //   try {
  //     if (name?.length < 1 || email?.length < 1 || letter?.length < 1) {
  //       return setAlert({
  //         active: true,
  //         type: "error",
  //         text: activeLanguage.pleaseInputNecessaryFields,
  //       });
  //     }
  //     if (!email.includes("@")) {
  //       return setAlert({
  //         active: true,
  //         type: "error",
  //         text: activeLanguage.incorrectEmail,
  //       });
  //     }
  //     setLoading(true);
  //     const formattedMessage = letter.replace(/\n/g, "<br>");
  //     const response = await axios.post(apiUrl + "/api/v1/sendemails", {
  //       email: user?.email,
  //       title: "Geo Market - ახალი შეტყობინება",
  //       message: formattedMessage,
  //     });
  //     if (response.data.status === "success") {
  //       setLoading(false);
  //       setAlert({
  //         active: true,
  //         text: activeLanguage.messageSentSuccessfully,
  //         type: "success",
  //       });
  //       setLetter("");
  //     }
  //   } catch (error: any) {
  //     setAlert({
  //       active: true,
  //       text: error.response.data.message,
  //       type: "error",
  //     });
  //     console.log(error.response.data.message);
  //     console.log("Send emails error");
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="p-4 flex flex-col laptop:flex-row gap-8 w-full h-full pb-16 laptop:pb-4">
      <div className="flex-1 flex flex-col gap-4 w-full h-full">
        <div className="flex items-center gap-2">
          <ContactEmergency sx={{ fontSize: 24 }} />
          {/* <span>{activeLanguage.security}:</span> */}
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

        {/* {user?.userId !== currentUser?.userId && (
          <div className="h-full w-full rounded-md shadow-md p-4 flex flex-col gap-2 relative right-4">
            <h3 className="m-2 font-semibold">
              {activeLanguage.sendLetterText}
            </h3>
            <div>
              <Input
                label={activeLanguage.name + "*"}
                value={name}
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Input
                label={activeLanguage.email + " *"}
                value={email}
                type="text"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                label={activeLanguage.phone + " " + activeLanguage.optional}
                value={phone}
                type="text"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <textarea
                id="about"
                placeholder={`${activeLanguage.text}*`}
                maxLength={250}
                className="w-full h-24 rounded-md p-2 shadow-md bg-white"
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
              />
            </div>
            <div className="h-11">
              <Button
                title={activeLanguage.send}
                background="green"
                color="white"
                onClick={Send}
                loading={loading}
              />
            </div>
          </div>
        )} */}
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
