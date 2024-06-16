import { redirect } from "next/navigation";

export function withAuth(Component: any) {
  return function WithAuth(props: any) {
    const isAuthenticated = localStorage.getItem("GeoMarket:currentUser");

    if (!isAuthenticated) {
      redirect("/login");
      return null;
    }

    return <Component {...props} />;
  };
}
