"use client";
import Button from "@/app/components/button";
import { Input } from "@/app/components/input";
import SimpleSnackbar from "@/app/components/snackBar";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { Person } from "@mui/icons-material";
import { Switch } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { FaTelegram, FaViber, FaWhatsapp } from "react-icons/fa";
import { MdAdd, MdLocationPin, MdRemove } from "react-icons/md";
import GoogleMap from "../../../../components/googleMap";
import { MapAutoComplete } from "../../../../components/mapAutocomplete";

interface propsTypes {}

const Info: React.FC<propsTypes> = ({}) => {
  // current user state
  const { currentUser, setCurrentUser } = useAuth();

  // app state
  const { apiUrl, activeLanguage } = useApp();

  /**
   * alert message
   */
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  // new states
  const [name, setName] = useState(currentUser?.name);
  const [phone, setPhone] = useState(currentUser?.phone?.number);
  const [whatsapp, setWhatsapp] = useState(currentUser?.phone.whatsapp);
  const [viber, setViber] = useState(currentUser?.phone.viber);
  const [telegram, setTelegram] = useState(currentUser?.phone.telegram);
  const [about, setAbout] = useState(currentUser?.about);
  const [addresses, setAddresses] = useState(currentUser?.address);
  const [addressInput, setAddressInput] = useState({ address: "" });

  // active language input switcher for about
  const [activeLanguageInputAbout, setActiveLanguageInputAbout] =
    useState("KA");

  useEffect(() => {
    setName(currentUser?.name);
    setPhone(currentUser?.phone?.number);
    setWhatsapp(currentUser?.phone?.whatsapp);
    setViber(currentUser?.phone?.viber);
    setTelegram(currentUser?.phone?.telegram);
    setAbout(currentUser?.about);
    setAddresses(currentUser?.addresses || []);
  }, [currentUser]);

  // loading saves
  const [loading, setLoading] = useState(false);

  // save info
  const SaveInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(
        apiUrl + "/api/v1/users/" + currentUser?.userId,
        {
          name: name,
          phone: { number: phone || "", code: "", whatsapp, viber, telegram },
          about: about,
          addresses: addresses,
        }
      );
      if (response.data.status === "success") {
        setCurrentUser(response.data.user);
      }
      setTimeout(() => {
        setLoading(false);
        setAlert({
          active: true,
          text: "Info changed succesfully",
          type: "success",
        });
      }, 1000);
    } catch (error: any) {
      setLoading(false);
      console.log(error.response.data.message);
    }
  };

  // define main address
  const [address, setAddress] = useState({ latitide: "", longitude: "" });

  useEffect(() => {
    if (addresses?.length > 0) {
      let main = addresses?.find((i: any) => i.main);
      setAddress(main);
    }
  }, [addresses]);

  return (
    <div className="p-4 flex flex-col laptop:flex-row laptop:gap-8 gap-2 pb-8 laptop:pb-4 w-full bg-white h-full rounded-xl shadow-sm">
      <div className="flex-1 flex flex-col gap-4 w-full bg-white relative">
        <div className="flex items-center gap-2">
          <Person sx={{ fontSize: 24 }} />
          {/* <span>{activeLanguage.security}:</span> */}
          <span className="text-md font-semibold">
            {activeLanguage.personalInfo}:
          </span>
        </div>
        <div className="flex flex-col gap-4 font-semibold w-full">
          <div className="flex flex-col gap-1">
            <span className="text-sm">{activeLanguage.email}: </span>
            <div className="font-normal">{currentUser?.email}</div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm">
              {activeLanguage.firstName +
                " " +
                activeLanguage?.and +
                " " +
                activeLanguage?.lastName +
                ", " +
                activeLanguage?.or +
                " " +
                activeLanguage?.title}
              :{" "}
            </span>
            <div className="font-normal">
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
                  activeLanguage?.title
                }
                value={name || ""}
                onChange={(e) => setName(e.target.value)}
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm">{activeLanguage.phone}: </span>
            <div className="font-normal">
              <Input
                label={activeLanguage.phone}
                value={phone || ""}
                onChange={(e) => setPhone(e.target.value)}
                type="text"
              />
            </div>
          </div>
          {phone?.length > 8 && (
            <div className="w-full flex items-center gap-2">
              <div className="flex items-center bg-gray-50 shadow-md rounded-xl p-1 pr-3">
                <Switch
                  checked={whatsapp}
                  onChange={() => setWhatsapp((prev: any) => !prev)}
                />
                <FaWhatsapp size={24} />
              </div>
              <div className="flex items-center bg-gray-50 shadow-md rounded-xl p-1 pr-3">
                <Switch
                  checked={viber}
                  onChange={() => setViber((prev: any) => !prev)}
                />
                <FaViber size={24} />
              </div>
              {/* <div className="flex items-center bg-gray-50 shadow-md rounded-xl p-1 pr-3">
                <Switch
                  checked={telegram}
                  onChange={() => setTelegram((prev: any) => !prev)}
                />
                <FaTelegram size={24} />
              </div> */}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2 w-full">
            <span className="text-sm font-semibold">
              {activeLanguage.about}:{" "}
            </span>
            <ReactCountryFlag
              className="emojiFlag"
              onClick={() => setActiveLanguageInputAbout("KA")}
              countryCode="GE"
              style={{
                opacity: activeLanguageInputAbout === "KA" ? 1 : 0.5,
                cursor: "pointer",
              }}
              aria-label="Georgia"
            />
            <ReactCountryFlag
              className="emojiFlag"
              onClick={() => setActiveLanguageInputAbout("EN")}
              countryCode="GB"
              style={{
                opacity: activeLanguageInputAbout === "EN" ? 1 : 0.5,
                cursor: "pointer",
              }}
              aria-label="United States"
            />
            <span className="ml-auto text-sm text-gray-300">
              (
              {activeLanguageInputAbout === "KA"
                ? about?.ka?.length
                : about?.en?.length}
              )
            </span>
          </div>
          <textarea
            id="about"
            placeholder={`${activeLanguage.about} (${activeLanguage.max} 250)`}
            maxLength={250}
            className="w-full h-48 rounded-xl p-2 shadow-md bg-white mb-8 laptop:mb-16"
            value={activeLanguageInputAbout === "KA" ? about?.ka : about?.en}
            onChange={(e) => {
              const { value } = e.target;
              if (activeLanguageInputAbout === "KA") {
                setAbout({ ...about, ka: value });
              } else {
                setAbout({ ...about, en: value });
              }
            }}
          />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4 w-full h-full">
        <div className="flex flex-col gap-2 w-full">
          <span className="text-sm font-semibold">
            {activeLanguage.address}:{" "}
          </span>
          <div className="flex items-center gap-2">
            <MapAutoComplete setAddress={setAddressInput} />{" "}
            {addressInput?.address && (
              <div
                onClick={() => {
                  let fullObj =
                    addresses?.length > 0
                      ? addressInput
                      : { ...addressInput, main: true };
                  setAddresses((prev: any) => [...prev, fullObj]);
                  setAddressInput({ address: "" });
                }}
                className="w-10 h-10 flex items-center justify-center shadow-md rounded-xl bg-green-200 hover:brightness-90 cursor-pointer transition-all"
              >
                <MdAdd size={30} />
              </div>
            )}
          </div>
          {addresses?.length > 0 && (
            <div
              className="w-full laptop:max-h-32 rounded-xl shadow-sm p-2 flex flex-col gap-1 bg-gray-100"
              style={{ overflowY: "auto" }}
            >
              {addresses?.length > 0 &&
                addresses?.map((item: any, index: number) => {
                  return (
                    <div key={index} className="flex w-full items-center gap-2">
                      <div
                        onClick={() =>
                          setAddresses((prev: any) => {
                            // Check if the current item has 'main' set to true
                            const isMain = item.main;

                            // If it's already main, return the previous state
                            if (isMain) return prev;

                            return prev.map((addr: any, i: number) => {
                              // Set 'main: true' for the clicked item
                              if (i === index) {
                                return { ...addr, main: true };
                              }

                              // Remove 'main' from any other item that has it
                              if (addr.main) {
                                const { main, ...rest } = addr;
                                return rest;
                              }

                              // Return the item unchanged if it was neither clicked nor has 'main'
                              return addr;
                            });
                          })
                        }
                        className="w-full bg-white p-2 text-sm rounded-xl shadow-sm cursor-pointer hover:brightness-90 transition-all flex items-center justify-between"
                        style={{
                          border: item.main
                            ? "2px solid red"
                            : "2px solid white",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <MdLocationPin
                            color={item.main ? "red" : "gray"}
                            size={24}
                          />
                          <span className="text-sm">{item.address}</span>
                        </div>
                        <div>
                          {item?.main && (
                            <span className="font-semibold text-red-500 text-sm">
                              {activeLanguage.main}
                            </span>
                          )}
                        </div>
                      </div>
                      <MdRemove
                        size={24}
                        color="red"
                        className="cursor-pointer hover:brightness-90"
                        onClick={() =>
                          setAddresses((prev: any) => {
                            // Filter out the item to be removed
                            const updatedAddresses = prev.filter(
                              (i: any) => i.address !== item.address
                            );

                            // Check if the removed item had main=true
                            const removedMain = item.main;

                            // If removed item had main=true, update the next item's main to true
                            if (removedMain && updatedAddresses.length > 0) {
                              updatedAddresses[0].main = true;
                            }

                            return updatedAddresses;
                          })
                        }
                      />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
        <div className="h-96 rounded-xl">
          {addresses?.length > 0 && <GoogleMap address={address} />}
        </div>
      </div>
      {(currentUser?.name !== name ||
        (currentUser?.phone?.number !== phone && phone?.length > 8) ||
        currentUser?.about?.ka !== about?.ka ||
        currentUser?.about?.en !== about?.en ||
        currentUser?.phone?.whatsapp !== whatsapp ||
        currentUser?.phone?.viber !== viber ||
        currentUser?.phone?.telegram !== telegram ||
        JSON.stringify(addresses) !== JSON.stringify(currentUser?.addresses)) &&
        currentUser && (
          <div className="h-10 w-full left-0 laptop:hidden mt-8">
            <Button
              title={activeLanguage.save}
              background="green"
              color="white"
              onClick={SaveInfo}
              //   {...props}
              loading={loading}
            />
          </div>
        )}
      <SimpleSnackbar alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default Info;
