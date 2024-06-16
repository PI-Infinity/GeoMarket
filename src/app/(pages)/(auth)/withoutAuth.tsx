import { redirect } from "next/navigation";

export function withoutAuth(Component: any) {
  return function WithAuth(props: any) {
    const isAuthenticated = localStorage.getItem("GeoMarket:currentUser");

    if (isAuthenticated) {
      redirect("/");
      return null;
    }

    return <Component {...props} />;
  };
}
