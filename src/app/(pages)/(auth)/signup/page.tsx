"use client";
import Button from "@/app/components/button";
import { Input } from "@/app/components/input";
import SimpleSnackbar from "@/app/components/snackBar";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Verify from "./emailCodeVerify";
import nProgress from "nprogress";
import { CheckBox } from "@mui/icons-material";
import { Checkbox, FormControl, FormControlLabel } from "@mui/material";
import { setCookie } from "@/app/utils/cookies";
import { useChat } from "@/app/context/chat";

const Register = () => {
  useEffect(() => {
    // Scroll to the top of the window
    window.scrollTo(0, 0);
  }, []);
  // app router
  const router = useRouter();
  // current user
  const { setCurrentUser } = useAuth();

  // app context
  const { activeLanguage } = useApp();

  // identify states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptRules, setAcceptRules] = useState(false);

  // Add these variables to your component to track the state
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  // verify email states
  const [verify, setVerify] = useState(false);
  const [code, setCode] = useState("");
  const [codeInput, setCodeInput] = useState("");

  // app context
  const { apiUrl, isMobile } = useApp();

  // chat context
  const { destination } = useChat();

  // alert message
  const [alert, setAlert] = useState({ active: false, type: "", text: "" });

  /**
   * Send verify email
   */
  // sending loading state
  const [sendingLoading, setSendingLoading] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const SendEmail = async () => {
    // disable focus on an element with ID'
    function disableFocus() {
      if (ref.current) {
        ref.current.blur();
      }
    }
    disableFocus();
    if (
      name?.length < 1 ||
      email?.length < 1 ||
      password?.length < 1 ||
      confirmPassword?.length < 1 ||
      !acceptRules
    ) {
      return setAlert({
        active: true,
        text: activeLanguage.pleaseInputFields,
        type: "error",
      });
    }
    if (!email?.includes("@") || email?.length < 6 || email?.length > 40) {
      return setAlert({
        active: true,
        text: activeLanguage.incorrectEmail,
        type: "error",
      });
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      return setAlert({
        active: true,
        text: activeLanguage.incorrectEmail,
        type: "error",
      });
    }

    if (name?.length < 2 || name?.length > 30) {
      return setAlert({
        active: true,
        text: activeLanguage.firstNameLengthIncorrect,
        type: "error",
      });
    }
    if (password?.length < 8 || password?.length > 40) {
      return setAlert({
        active: true,
        text: activeLanguage.incorrectPassword,
        type: "error",
      });
    }
    if (password !== confirmPassword) {
      return setAlert({
        active: true,
        text: activeLanguage.passwordsDoNotMatch,
        type: "error",
      });
    }
    try {
      setSendingLoading(true);
      const response = await axios.post(
        apiUrl + "/api/v1/users/sendVerifyEmail",
        {
          email: email,
        }
      );

      setVerify(true);
      setCode(response.data.code);

      setSendingLoading(false);
    } catch (error: any) {
      console.log(error.response);
      setSendingLoading(false);
      setAlert({
        active: true,
        text: error.response.data.message,
        type: "error",
      });
    }
  };

  /**
   * Registration
   */
  const [registerLoading, setRegisterLoading] = useState(false);

  const Register = async () => {
    // if hone includes country code continue, if not alert error
    try {
      // Signup user
      setRegisterLoading(true);
      const response = await axios.post(apiUrl + "/api/v1/users/signup", {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        acceptPrivacy: true,
        acceptTerms: true,
      });
      setCurrentUser(response.data.user);
      setCookie(
        "GeoMarket:currentUser",
        JSON.stringify({
          userId: response.data.user.userId,
          admin: response.data.user.admin,
        })
      );
      if (destination?.page === "product") {
        router.push("/user/product/" + destination?.productId);
      } else if (destination?.page === "user") {
        router.push("/user/" + destination?.userId + "/products");
      } else {
        router.push("/");
      }
      setTimeout(() => {
        setVerify(false);
        setRegisterLoading(false);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setCode("");
        setCodeInput("");
      }, 1500);
    } catch (err: any) {
      setCode("");
      setCodeInput("");
      // error handlers
      console.log(err.response);
      setAlert({
        active: true,
        text: err.response.data.message,
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-1 flex-grow flex-col w-full min-h-full items-center justify-center">
      <div className="flex flex-col h-full w-full laptop:w-1/3 pl-4 pr-4 laptop:pl-0 laptop:pr-4 items-center justify-center gap-4">
        <Input
          label={activeLanguage.firstName + "*"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          warning={false}
          returnKeyType="next"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const nextField = document.getElementById(
                "email"
              ) as HTMLInputElement;
              if (nextField) {
                nextField?.focus();
              }
            }
          }}
        />

        <Input
          id="email"
          label={activeLanguage.email + "*"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          returnKeyType="next"
          warning={false}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const nextField = document.getElementById(
                "pass"
              ) as HTMLInputElement;
              if (nextField) {
                nextField?.focus();
              }
            }
          }}
        />
        <Input
          id="pass"
          label={activeLanguage.password + "*"}
          value={password}
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          handleClickShowPassword={handleClickShowPassword}
          handleMouseDownPassword={handleMouseDownPassword}
          returnKeyType="next"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const nextField = document.getElementById(
                "confirmPass"
              ) as HTMLInputElement;
              if (nextField) {
                nextField?.focus();
              }
            }
          }}
          password={true}
        />
        <Input
          ref={ref}
          id="confirmPass"
          label={activeLanguage.confirmPassword + "*"}
          value={confirmPassword}
          type={showPassword ? "text" : "password"}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPassword={showPassword}
          handleClickShowPassword={handleClickShowPassword}
          handleMouseDownPassword={handleMouseDownPassword}
          password={true}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const nextField = document.getElementById(
                "btn"
              ) as HTMLInputElement;
              if (nextField) {
                nextField?.focus();
              }
              SendEmail();
            }
          }}
        />
        <FormControlLabel
          sx={{ color: "gray" }}
          style={{ width: "100%", padding: "0 0.5rem" }}
          control={
            <Checkbox
              checked={acceptRules}
              onChange={() => setAcceptRules((prev: boolean) => !prev)}
              name="შეკვეთით"
              sx={{ color: "Black" }}
            />
          }
          label={activeLanguage.confirmTerms}
        />
        <div className="h-12 w-full">
          <Button
            id="btn"
            background={"green"}
            color="#fff"
            onClick={SendEmail}
            loading={sendingLoading}
            title={activeLanguage.createAccount}
          />
        </div>
        <Link
          className="button"
          href={"/login"}
          style={{
            letterSpacing: "0.5px",
            color: "red",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "14px",
            margin: 0,
          }}
        >
          {activeLanguage.login}
        </Link>
      </div>
      <Verify
        active={verify}
        setActive={setVerify}
        codeInput={codeInput}
        setCodeInput={setCodeInput}
        Register={Register}
        code={code}
        registerLoading={registerLoading}
        SendEmail={SendEmail}
      />
      <SimpleSnackbar alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default Register;
