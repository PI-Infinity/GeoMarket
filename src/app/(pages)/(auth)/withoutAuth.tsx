import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { getCookie } from "@/app/utils/cookies";

export function withoutAuth(Component: any) {
  return function WithoutAuth(props: any) {
    const auth = getCookie("GeoMarket:currentUser");

    if (auth) {
      redirect("/");
    }

    return <Component {...props} />;
  };
}
