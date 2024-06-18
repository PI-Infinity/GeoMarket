"use client";
import Button from "@/app/components/button";
import { Input } from "@/app/components/input";
import SimpleSnackbar from "@/app/components/snackBar";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ResetPassword from "./resetPassword";
import nProgress from "nprogress";
import { useSession, signIn, signOut } from "next-auth/react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { setCookie } from "@/app/utils/cookies";

const Login = () => {
  // current user
  const { setCurrentUser } = useAuth();

  // app router
  const router = useRouter();

  useEffect(() => {
    // Scroll to the top of the window
    window.scrollTo(0, 0);
  }, []);

  // alert message
  const [alert, setAlert] = useState({ active: false, type: "", text: "" });

  // login email and password states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Add these variables to your component to track the state
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  // backend url
  const { apiUrl, activeLanguage } = useApp();

  // sending loading state
  const [sendingLoading, setSendingLoading] = useState(false);

  /**
   * Login function
   */
  const login = async () => {
    if (email?.length < 1 || email?.length < 1) {
      return setAlert({
        active: true,
        text: activeLanguage.pleaseInputNecessaryFields,
        type: "warning",
      });
    }
    if (!email?.includes("@") || !email?.includes(".")) {
      return setAlert({
        active: true,
        text: activeLanguage.incorrectEmail,
        type: "warning",
      });
    }
    try {
      setSendingLoading(true);
      // post login to backend
      await axios
        .post(apiUrl + "/api/v1/users/login", {
          email: email,
          password: password,
        })
        .then(async (data) => {
          setCurrentUser(data.data.user);
          setCookie(
            "GeoMarket:currentUser",
            JSON.stringify({
              userId: data.data.user.userId,
              admin: data.data.user.admin,
            })
          );
          router.push("/");
        });
      setTimeout(() => {
        setSendingLoading(false);
      }, 3000);
    } catch (err: any) {
      console.log(err.response.data.message);
      setSendingLoading(false);
      // alert errors to be visible for users
      setAlert({
        active: true,
        text: err.response.data.message,
        type: "error",
      });
    }
  };

  /**
   * this is states for reset passwords.
   * email input and to open/close reset password popup
   */
  const [emailInput, setEmailInput] = useState("");
  const [resetPopup, setResetPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * send email to reset password
   * after send request, user gettings link to navigate to beautyverse web, where user can set new password
   */

  async function SendEmail() {
    try {
      setLoading(true);
      await axios.post(apiUrl + "/api/v1/users/forgotPassword", {
        email: emailInput,
      });
      // If the email is sent successfully, handle the response here
      setAlert({
        active: true,
        text: activeLanguage.codeSentSuccessfullyToEmail,
        type: "success",
      });
      setEmailInput("");
      setResetPopup(false);
      setLoading(false);
    } catch (error) {
      setAlert({
        active: true,
        text: "error",
        type: "error",
      });
      setLoading(false);
    }
  }

  /**
   * Google auth
   */

  const handleGoogleAuth = async (userEmail: any) => {
    try {
      // Use the token or profile information to register/sign in the user in your backend
      // Example:
      const response = await axios.post(`${apiUrl}/api/v1/users/providerauth`, {
        email: userEmail,
      });

      if (response.data && response.data.user) {
        setCurrentUser(response.data.user);
        setCookie(
          "GeoMarket:currentUser",
          JSON.stringify({
            userId: response.data.user.userId,
            admin: response.data.user.admin,
          })
        );

        router.push("/");
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      // Handle sign-in errors here
    }
  };

  interface DecodedJwtPayload {
    email?: string; // Use '?' to indicate that the property is optional
    // Include other expected properties from the payload here
  }

  return (
    <div className="flex flex-1 flex-grow flex-col w-full min-h-full items-center justify-center pl-4 pr-4 laptop:pl-0 laptop:pr-4">
      <ResetPassword
        openReset={resetPopup}
        setOpenReset={setResetPopup}
        email={emailInput}
        setEmail={setEmailInput}
        SendEmail={SendEmail}
        loading={loading}
      />
      <div className="flex flex-col w-full laptop:w-1/3 h-full items-center justify-center gap-4">
        <Input
          label={activeLanguage.email}
          // label={activeLanguage.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          warning={false}
          returnKeyType="next"
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
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label={activeLanguage.password}
          showPassword={showPassword}
          handleClickShowPassword={handleClickShowPassword}
          handleMouseDownPassword={handleMouseDownPassword}
          password={true}
          returnKeyType="done"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              login();
            }
          }}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <h4
            onClick={() => setResetPopup(true)}
            style={{
              letterSpacing: "0.5px",
              color: "gray",
              textDecoration: "underline",
              fontSize: "14px",
              margin: 0,
              cursor: "pointer",
            }}
            className="hover"
          >
            {activeLanguage.forgotPassword}
            {/* {activeLanguage.forgotPassword} */}
          </h4>
          <div className="h-12 w-full">
            <Button
              background={"green"}
              color={"#ccc"}
              onClick={login}
              loading={sendingLoading}
              title={activeLanguage.login}
            />
          </div>
        </div>
        <div className="flex w-full items-center gap-3">
          <div
            style={{ height: "1.5px" }}
            className="rounded-full w-full bg-gray-300"
          />
          <span className="text-gray-400">Or</span>
          <div
            style={{ height: "1.5px" }}
            className="rounded-full w-full bg-gray-300"
          />
        </div>
        <GoogleLogin
          onSuccess={(credentialResponse: any) => {
            const decoded = jwtDecode<DecodedJwtPayload>(
              credentialResponse?.credential
            );
            if (decoded) {
              handleGoogleAuth(decoded?.email);
            }
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />

        <Link href={"/signup"} className="h-12 w-full">
          <Button
            background={"red"}
            color={"green"}
            onClick={() => undefined}
            title={activeLanguage.createAccount}
          />
        </Link>
      </div>
      <SimpleSnackbar alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default Login;
