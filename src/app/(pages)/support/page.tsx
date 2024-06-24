"use client";
import Button from "@/app/components/button";
import { Input } from "@/app/components/input";
import SimpleSnackbar from "@/app/components/snackBar";
import { useApp } from "@/app/context/app";
import axios from "axios";
import React, { useState } from "react";
import { MdSend } from "react-icons/md";
import { MoonLoader } from "react-spinners";

export default function Page() {
  // api context
  const { apiUrl, activeLanguage } = useApp();

  // fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [text, setText] = useState("");

  // alert message
  const [alert, setAlert] = useState({ active: false, type: "", text: "" });

  // send message to email
  const [loading, setLoading] = useState(false);
  const SendEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.post(apiUrl + "/emails/support", {
        name,
        email,
        text,
      });
      if (response.data.status === "success") {
        setLoading(false);
        setName("");
        setEmail("");
        setText("");
        return setAlert({
          active: true,
          text: activeLanguage.messageSentSuccessfully,
          type: "success",
        });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="w-full laptop:w-2/5 rounded-xl mt-8 laptop:mt-20 flex flex-col items-center p-2">
        <div className="flex flex-col items-center">
          <h2 className="text-black">{activeLanguage.support}</h2>
          <span className="text-gray-400 text-sm mb-4 text-center px-8">
            {activeLanguage?.typicallyAnswer}
          </span>
        </div>
        <div className="w-full">
          <Input
            label={activeLanguage?.name + "*"}
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            warning={true}
          />
        </div>
        <div className="w-full mt-2 w-full">
          <Input
            label={activeLanguage?.email + "*"}
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="w-full mt-2 w-full">
          <Input
            label={activeLanguage?.phone + " " + activeLanguage.optional}
            type="text"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
          />
        </div>
        <div className="h-48 mt-2 w-full bg-white flex items-center gap-2 rounded-xl overflow-hidden shadow-md pr-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-full w-full p-2 pl-4 bg-transparent text-black"
            placeholder={activeLanguage?.text + "*"}
            maxLength={300}
          />
        </div>
        <div className="h-11 w-full mt-2">
          <Button
            background="green"
            color="white"
            loading={loading}
            onClick={SendEmail}
            title={activeLanguage?.send}
            disabled={
              name?.length < 1 ||
              email?.length < 8 ||
              !email?.includes("@") ||
              text?.length < 10
                ? true
                : false
            }
          />
        </div>
      </div>
      <SimpleSnackbar alert={alert} setAlert={setAlert} />
    </div>
  );
}
