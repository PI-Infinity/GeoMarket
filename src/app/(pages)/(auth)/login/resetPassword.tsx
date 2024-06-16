import Button from "@/app/components/button";
import { Input } from "@/app/components/input";
import { useApp } from "@/app/context/app";
import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { BounceLoader } from "react-spinners";

interface PropsType {
  openReset: boolean;
  setOpenReset: (open: boolean) => void;
  email: string;
  setEmail: (prev: string) => void;
  SendEmail: () => void;
  loading: boolean;
}

const ResetPassword: React.FC<PropsType> = ({
  openReset,
  setOpenReset,
  email,
  setEmail,
  SendEmail,
  loading,
}) => {
  const { activeLanguage } = useApp();
  return (
    <div
      className={`absolute top-0 left-0 w-full h-full flex items-center justify-center scale-${
        openReset ? 1 : 0
      } z-10`}
      style={{
        WebkitBackdropFilter: "blur(50px)",
        backdropFilter: "blur(50px)",
      }}
    >
      <MdClose
        onClick={() => {
          setOpenReset(false);
          setEmail("");
        }}
        size={30}
        color="red"
        className="absolute top-4 right-4 cursor-pointer hover:brightness-105"
      />
      <div
        onClick={(e: any) => e.stopPropagation()}
        className={`w-full laptop:w-1/3 flex flex-col gap-4 items-center transition-transform relative scale-${
          openReset ? "1" : "0"
        } transition-transform pl-4 pr-4 laptop:pl-4 laptop:pr-4 bottom-16 laptop:bottom-0`}
      >
        <h3 style={{ color: "#ccc", margin: 0, padding: 0 }}>
          {activeLanguage.resetPassword}
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "#ccc",
            letterSpacing: "0.5px",
            textAlign: "center",
            lineHeight: "24px",
          }}
        >
          {activeLanguage.resetPasswordInstructions}
        </p>
        <Input
          label={activeLanguage.email}
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              SendEmail();
            }
          }}
        />
        <div className="h-12 w-full">
          <Button
            title={activeLanguage.send}
            onClick={SendEmail}
            background={"green"}
            disabled={false}
            color={"red"}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
