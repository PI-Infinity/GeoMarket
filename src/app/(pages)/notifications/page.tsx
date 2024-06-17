"use client";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useNotifications } from "@/app/context/notifications";
import Item from "./item";

// Define the subscription interface
interface Subscription {
  _id: string;
  title: string;
  // other subscription fields
}

const Notifications = () => {
  // app context
  const { apiUrl, activeLanguage } = useApp();
  // auth state
  const { currentUser } = useAuth();

  // Notifications context
  const {
    notifications,
    setNotifications,
    notificationsRef,
    totalNotifications,
  } = useNotifications();

  // format order date to display format
  const DefineDate = (dateValue: any) => {
    const date = new Date(dateValue);

    // Example format: "February 25, 2024, 16:35"
    // Adjust the format according to your needs
    const formattedDate = date.toLocaleString("en-US", {
      month: "short", // "February"
      day: "2-digit", // "25"
      year: "numeric", // "2024"
      hour: "2-digit", // "16"
      minute: "2-digit", // "35"
      hour12: false,
    });
    return formattedDate;
  };

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white h-full w-full laptop:w-3/5 rounded-xl shadow-sm flex flex-col items-center">
        <h3 className="p-4 pb-0 text-gray-400">
          {activeLanguage.notifications}
        </h3>
        {totalNotifications !== null && totalNotifications === 0 && (
          <div className="text-gray-400 flex w-full items-center justify-center text-red-500 my-8">
            Not Found
          </div>
        )}
        <div
          className="flex-1 p-4 flex flex-col gap-2 w-full"
          ref={notificationsRef}
        >
          {notifications?.map((item: any, index: number) => {
            return <Item key={index} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
