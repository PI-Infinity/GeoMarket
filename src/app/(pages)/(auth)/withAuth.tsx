import { getCookie } from "@/app/utils/cookies";
import { redirect } from "next/navigation";

export function withAuth(Component: any) {
  return function WithAuth(props: any) {
    const auth = getCookie("GeoMarket:currentUser");

    if (!auth) {
      redirect("/login");
      return null;
    }

    return <Component {...props} />;
  };
}
