"use client";
import axios from "axios";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useApp } from "./app";
import getAuthUser from "../hooks/getAuthUser";
import { getCookie, removeCookie, setCookie } from "../utils/cookies";
import { useSearchParams } from "next/navigation";

// Create an authenticated user context state
const Auth = createContext<any>(null);

export const useAuth = () => useContext(Auth);

interface contextProps {
  children: ReactNode;
}

export const AuthContextWrapper: React.FC<contextProps> = ({ children }) => {
  // Current user state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [rerenderUser, setRerenderUser] = useState(false);

  // App context to get API URL
  const { apiUrl } = useApp();

  // Socket server reference
  const socket = useRef<any>();

  // Connect to the socket server
  useEffect(() => {
    const connectSocket = () => {
      socket.current = io(apiUrl);

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });
    };

    connectSocket();
  }, [apiUrl]);

  // Add user to online users collection
  useEffect(() => {
    if (currentUser) {
      socket.current.emit("addUser", currentUser.userId);
    }
  }, [currentUser]);

  // Function to get the authenticated user
  const GetUser = async (userStorage: any) => {
    try {
      const response = await getAuthUser({ apiUrl, userStorage });
      if (response.data.user) {
        setCurrentUser(response.data.user);
        setCookie(
          "GeoMarket:currentUser",
          JSON.stringify({
            userId: response.data.user.userId,
            admin: response.data.user.admin,
          })
        );
      } else {
        removeCookie("GeoMarket:currentUser");
        setCurrentUser(null);
      }
    } catch (error: any) {
      if (error?.response?.data?.message === "User not found with this id") {
        removeCookie("GeoMarket:currentUser");
        setCurrentUser(null);
      }
    } finally {
      setLoading(false); // Set loading to false once the user is fetched
    }
  };

  // Schedule to reload the user every day at a specific time
  const scheduleGetUser = (userStorage: any) => {
    const now = new Date();
    const targetTime = new Date(now);
    targetTime.setHours(23);
    targetTime.setMinutes(59);
    targetTime.setSeconds(0);

    if (now >= targetTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const delay = targetTime.getTime() - now.getTime();

    setTimeout(() => {
      GetUser(userStorage);
      const intervalId = setInterval(
        () => GetUser(userStorage),
        24 * 60 * 60 * 1000
      );
      return () => clearInterval(intervalId);
    }, delay);
  };

  // Initialize the user from localStorage and schedule user fetching
  useEffect(() => {
    const localUser = getCookie("GeoMarket:currentUser");

    if (localUser) {
      GetUser(localUser);
      scheduleGetUser(localUser);
    } else {
      setLoading(false); // Set loading to false if no local user
    }
  }, [rerenderUser]);

  // if add fields is turn on disable scrolling
  useEffect(() => {
    if (
      currentUser &&
      (!currentUser?.phone?.number ||
        currentUser?.phone?.number?.length < 9 ||
        currentUser?.name === currentUser?.email)
    ) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [currentUser]);

  // destination page after login or register
  interface Destination {
    productId: string | null;
    page: string | null;
    userId: string | null;
  }
  const [destination, setDestination] = useState<Destination | null>(null);

  return (
    <Auth.Provider
      value={{
        currentUser,
        setCurrentUser,
        socket: socket.current,
        destination,
        setDestination,
        setRerenderUser,
      }}
    >
      {children}
    </Auth.Provider>
  );
};
