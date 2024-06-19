// utils/cookies.ts
import Cookies from "js-cookie";
import cookie from "cookie";

// Set a cookie with a default expiration of 7 days and path '/'
export const setCookie = (name: string, value: string, days: number = 7) => {
  Cookies.set(name, value, { expires: days, path: "/" });
};

// Get a cookie
export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

// Remove a cookie
export const removeCookie = (name: string) => {
  Cookies.remove(name, { path: "/" });
};

export function parseCookies(req: any) {
  // The cookie header is available in the request headers in server-side contexts
  return cookie.parse(req ? req.headers.cookie || "" : "");
}
