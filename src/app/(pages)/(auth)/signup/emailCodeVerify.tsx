import Button from "@/app/components/button";
import { Input } from "@/app/components/input";
import SimpleSnackbar from "@/app/components/snackBar";
import { useApp } from "@/app/context/app";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { TbReload } from "react-icons/tb";

interface PropsType {
  active: boolean;
  setActive: (prev: boolean) => void;
  codeInput: string;
  setCodeInput: (prev: string) => void;
  Register: () => void;
  code: string;
  registerLoading: boolean;
  SendEmail: () => void;
}

const Verify: React.FC<PropsType> = ({
  active,
  codeInput,
  setCodeInput,
  Register,
  code,
  setActive,
  registerLoading,
  SendEmail,
}) => {
  // alert message
  const { activeLanguage } = useApp();

  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full flex items-center justify-center scale-${
        active ? 1 : 0
      }`}
      style={{
        WebkitBackdropFilter: "blur(50px)",
        backdropFilter: "blur(50px)",
      }}
    >
      <MdClose
        onClick={() => {
          setActive(false);
          setCodeInput("");
        }}
        size={30}
        color="red"
        className="absolute top-4 right-4 cursor-pointer hover:brightness-105"
      />
      <div
        onClick={(e: any) => e.stopPropagation()}
        className={`w-1/3 flex flex-col gap-4 items-center transition-transform relative scale-${
          active ? "1" : "0"
        } transition-transform`}
      >
        <div className="flex gap-4 items-center">
          <h4 className="text-black text-center">
            {activeLanguage.codeSentSuccessfullyToEmail}
          </h4>
        </div>
        <Input
          label={activeLanguage.enterCode}
          type="text"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              code === codeInput
                ? Register()
                : setAlert({
                    active: true,
                    text: activeLanguage.wrongVerificationCode,
                    type: "error",
                  });
            }
          }}
        />

        <div className="h-12 w-full">
          <Button
            title={activeLanguage.confirm}
            background={"green"}
            color={"#fff"}
            loading={registerLoading}
            onClick={() => {
              code === codeInput
                ? Register()
                : setAlert({
                    active: true,
                    text: activeLanguage.wrongVerificationCode,
                    type: "error",
                  });
            }}
          />
        </div>
        <div
          onClick={SendEmail}
          style={{ whiteSpace: "nowrap" }}
          className="hover:brightness-105 w-2/5 text-black flex items-center justify-center gap-2 font-semibold p-1 pl-4 pr-4 rounded-full bg-gray-200 cursor-pointer"
        >
          {activeLanguage.resend}{" "}
          <div>
            <TbReload />
          </div>
        </div>
      </div>
      <SimpleSnackbar alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default Verify;
