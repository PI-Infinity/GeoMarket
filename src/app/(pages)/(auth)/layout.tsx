"use client";
import { useAuth } from "@/app/context/auth";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect } from "react";
import { withAuth } from "./withAuth";
import { withoutAuth } from "./withoutAuth";

interface propsTypes {
  children: any;
}

const Layout: React.FC<propsTypes> = ({ children }) => {
  return (
    <div
      style={{ height: "calc(100vh - 8.5rem)" }}
      className="flex-grow w-2/3 rounded-md"
    >
      <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID || ""}>
        {children}
      </GoogleOAuthProvider>
    </div>
  );
};

export default withoutAuth(Layout);
