"use client";
import Button from "@/app/components/button";
import { Input } from "@/app/components/input";
import SimpleSnackbar from "@/app/components/snackBar";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { SecurityOutlined } from "@mui/icons-material";
import { Alert } from "@mui/material";
import axios from "axios";
// import { signOut } from "next-auth/react";
import { useState } from "react";
import { BounceLoader } from "react-spinners";
// import { googleLogout } from "@react-oauth/google";

const Security = ({}) => {
  // alert message
  const { setOpenBackDrop, apiUrl, setConfirm, storeInfo, activeLanguage } =
    useApp();

  // current user
  const { currentUser, setCurrentUser } = useAuth();

  // alert
  const [alert, setAlert] = useState({ active: false, type: "", text: "" });

  // define passwords states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Add these variables to your component to track the state
  interface StateProps {
    active: boolean;
    name: string;
  }
  // Add these variables to your component to track the state
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  /**
   * password change function
   *  */
  // open change passwords
  const [loading, setLoading] = useState(false);

  const Changing = async () => {
    try {
      if (newPassword !== confirmPassword) {
        return setAlert({
          active: true,
          text: activeLanguage.newPasswordMismatch,
          type: "error",
        });
      }
      setLoading(true);
      await axios.patch(
        apiUrl + "/api/v1/users/changePassword/" + currentUser?.userId,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
      return setAlert({
        active: true,
        text: activeLanguage.passwordChangedSuccessfully,
        type: "success",
      });
    } catch (error: any) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
      return setAlert({
        active: true,
        text: JSON.stringify(error.response.data.message),
        type: "error",
      });
    }
  };

  /**
   * Delete account function
   */

  // const DeleteAccount = async () => {
  //   setOpenBackDrop({ active: true }); // Assuming this starts some loading indication in the UI

  //   try {
  //     // Perform the deletion request to your backend
  //     await axios.delete(`${apiUrl}/api/v1/users/${currentUser?.userId}`);

  //     // Optionally handle additional cleanup or state updates before signing the user out
  //     // ...

  //     // Sign the user out after successful account deletion
  //     // await signOut({ redirect: false, callbackUrl: "/" });

  //     // Clear any local state or storage that references the user
  //     localStorage.removeItem("eStore:currentUser"); // Ensure the key matches what you use elsewhere
  //     setCurrentUser(null);
  //     googleLogout();
  //     localStorage.removeItem("eStore:Order");
  //     setOrder({
  //       items: [],
  //       shipping: {
  //         cost: 0,
  //         currency: storeInfo?.currency,
  //         address: "",
  //         addationalInfo: "",
  //         phone: "",
  //         estimatedDelivery: "",
  //         paymentMethod: "",
  //         estimatedTax: 0,
  //       },
  //       buyer: {
  //         firstName: "",
  //         lastName: "",
  //         id: "",
  //         email: "",
  //       },
  //       promotions: [],
  //       comment: "",
  //       returnPolicy: "",
  //     });

  //     // Reset any confirmation or alert states as needed
  //     setConfirm({ active: false, agree: null, text: "", close: null });

  //     // Optionally, redirect the user or update the UI state to reflect that the account has been deleted
  //     // ...
  //   } catch (error: any) {
  //     console.error(
  //       "Error deleting account:",
  //       error.response?.data?.message || error.message
  //     );

  //     // Update UI state to stop loading indication
  //     setOpenBackDrop({ active: false });

  //     // Display an alert to the user indicating the error
  //     setAlert({
  //       active: true,
  //       text:
  //         error.response?.data?.message ||
  //         "An error occurred while deleting the account.",
  //       type: "error",
  //     });
  //   }
  // };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <SecurityOutlined sx={{ fontSize: 22 }} />
        <span className="text-md font-semibold">
          {activeLanguage.changePassword}:
        </span>
      </div>

      <div className="w-full laptop:w-2/5 flex flex-col gap-2">
        <>
          <div>
            <Input
              label={activeLanguage.oldPassword}
              // label={activeLanguage.oldPassword}
              value={oldPassword}
              type={showPassword ? "text" : "password"}
              showPassword={showPassword}
              handleClickShowPassword={handleClickShowPassword}
              handleMouseDownPassword={handleMouseDownPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              password={true}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const nextField = document.getElementById(
                    "new"
                  ) as HTMLInputElement;
                  if (nextField) {
                    nextField?.focus();
                  }
                }
              }}
            />
          </div>
          <div>
            <Input
              label={activeLanguage.newPassword}
              // label={activeLanguage.newPassword}
              value={newPassword}
              type={showPassword ? "text" : "password"}
              showPassword={showPassword}
              handleClickShowPassword={handleClickShowPassword}
              handleMouseDownPassword={handleMouseDownPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              id="outlined-basic"
              password={true}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const nextField = document.getElementById(
                    "confirm"
                  ) as HTMLInputElement;
                  if (nextField) {
                    nextField?.focus();
                  }
                }
              }}
            />
          </div>
          <div>
            <Input
              label={activeLanguage.confirmNewPassword}
              // label={activeLanguage.confirmNewPassword}
              value={confirmPassword}
              showPassword={showPassword}
              handleClickShowPassword={handleClickShowPassword}
              handleMouseDownPassword={handleMouseDownPassword}
              type={showPassword ? "text" : "password"}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // Call your function here
                  Changing(); // Replace this with your function call
                }
              }}
              id="confirm"
              password={true}
            />
          </div>
        </>

        {oldPassword?.length > 7 &&
          newPassword?.length > 7 &&
          confirmPassword?.length > 7 && (
            <div className="h-10">
              <Button
                title={activeLanguage.save}
                background="green"
                color="white"
                onClick={Changing}
                //   {...props}
                loading={loading}
              />
            </div>
          )}
      </div>
      {/* 
          <Button
            variant="contained"
            style={{
              backgroundColor: loading ? "#ccc" : "black",
              color: "white",
            }}
            className="icon"
            sx={{
              width: "100%",
              borderRadius: "50px",

              height: "40px",
            }}
            onClick={() =>
              setConfirm({
                active: true,
                text: "Are you sure to want to delete this account?",
                close: () => setConfirm(false),
                agree: () => DeleteAccount(),
              })
            }
            //   {...props}
          >
            {loading ? (
              <BounceLoader
                color={"Black"}
                loading={loading}
                size={20}
              />
            ) : (
              activeLanguage.deleteAccount
            )}
          </Button> */}
      <SimpleSnackbar alert={alert} setAlert={setAlert} />
    </div>
  );
};

export default Security;
