import { getCookie } from "@/app/utils/cookies";
import { redirect } from "next/navigation";

export function withAdmin(Component: any) {
  return function WithAdmin(props: any) {
    const auth = getCookie("GeoMarket:currentUser");
    const admin = auth && JSON.parse(auth)?.admin.active;
    if (auth && !admin) {
      redirect("/");
    } else if (!auth) {
      redirect("/login");
    }

    return <Component {...props} />;
  };
}
