import { redirect } from "next/navigation";

export function withAdmin(Component: any) {
  return function WithAdmin(props: any) {
    const isAuthenticated = localStorage.getItem("GeoMarket:currentUser");
    const admin = isAuthenticated && JSON.parse(isAuthenticated)?.admin.active;
    if (isAuthenticated && !admin) {
      redirect("/");
    } else if (!isAuthenticated) {
      redirect("/login");
    }

    return <Component {...props} />;
  };
}
