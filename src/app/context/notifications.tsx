"use client";
import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { useApp } from "./app";
import { useAuth } from "./auth";

/**
 * Notificationscontext state
 */

const Notifications = createContext<any>(null);

export const useNotifications = () => useContext(Notifications);

interface contextProps {
  children: ReactNode;
}
// Define the subscription interface
interface Notification {
  notificationId: string;
  // other subscription fields
}

export const NotificationsContextWrapper: React.FC<contextProps> = ({
  children,
}) => {
  // app context
  const { apiUrl } = useApp();
  // auth context
  const { currentUser } = useAuth();

  useEffect(() => {
    document.title = "შეტყობინებები" || "იტვირთება..."; // Sets the document name
  }, []);

  /**
   *  Notifications
   * */
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [page, setPage] = useState(1);
  const [totalNotifications, setTotalNotifications] = useState(null);
  const [totalUnreads, setTotalUnreads] = useState(null);

  const GetNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const list = await axios.get(
        apiUrl +
          `/api/v1/users/${currentUser?.userId}/notifications?page=${page}&limit=15`
      );
      setNotifications(list.data.data.notifications);
      setPage(1);
      setTotalNotifications(list.data.total);
      setTotalUnreads(list.data.totalUnreads);
      setLoadingNotifications(false);
    } catch (error: any) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    if (apiUrl && currentUser) {
      GetNotifications();
    }
  }, [currentUser]);

  const AddNotifications = async () => {
    const newPage = page + 1;
    try {
      const response = await axios.get(
        apiUrl +
          `/api/v1/users/${currentUser?.userId}/notifications?page=${newPage}&limit=3`
      );
      setTotalNotifications(response.data.total);

      setNotifications((prevnotifications) => {
        // Create a new set with existing subscription IDs for quick lookup
        const existingIds = new Set(
          prevnotifications.map((notification) => notification.notificationId)
        );

        // Filter out duplicates from the newly fetched notifications based on subscription ID
        const filteredNewnotifications =
          response.data.data.notifications.filter(
            (p: any) => !existingIds.has(p.notificationId)
          );

        if (filteredNewnotifications?.length > 0) {
          return [...prevnotifications, ...filteredNewnotifications];
        } else {
          return [...prevnotifications];
        }
      });

      setPage(newPage);
    } catch (error) {
      console.log(error);
    }
  };

  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Ensure notificationsRef.current is not null before accessing its properties
      if (notificationsRef.current) {
        const { bottom } = notificationsRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the bottom of the component is near the bottom of the window viewport
        if (bottom <= windowHeight + 200) {
          if (
            totalNotifications &&
            totalNotifications > notifications?.length
          ) {
            // setLoadMore(true);
            AddNotifications();
          }
        }
      }
    };

    // Register the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [notifications?.length, totalNotifications, notificationsRef]);

  return (
    <Notifications.Provider
      value={{
        notifications,
        notificationsRef,
        loadingNotifications,
        totalUnreads,
        totalNotifications,
        setTotalUnreads,
        setNotifications,
      }}
    >
      {children}
    </Notifications.Provider>
  );
};
