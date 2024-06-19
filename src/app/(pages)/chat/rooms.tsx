"use client";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useChat } from "@/app/context/chat";
import { MoonLoader } from "react-spinners";
import RoomItem from "./room-item";
import getChats from "@/app/hooks/getChats";

const Rooms = () => {
  // app context
  const { apiUrl } = useApp();

  // auth context
  const { currentUser } = useAuth();

  const {
    chats,
    setChats,
    totalChats,
    page,
    setPage,

    loadingChats,
  } = useChat();

  // add chats
  const AddChats = async () => {
    const newPage = page + 1;
    try {
      const response = await getChats({ apiUrl, currentUser, newPage });
      setChats((prevChats: any) => {
        // Create a new set with existing message IDs for quick lookup
        const existingIds = new Set(prevChats.map((ch: any) => ch.roomId));

        // Filter out duplicates from the newly fetched messages based on message ID
        const filteredNewMessages = response.data.data.chats.filter(
          (ch: any) => !existingIds.has(ch.roomId)
        );

        if (filteredNewMessages.length > 0) {
          return [...prevChats, ...filteredNewMessages];
        } else {
          return prevChats; // No need to spread prevChats again if there are no new messages
        }
      });

      setPage(newPage);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full rounded-xl shadow-md laptop:bg-white h-full pt-2 laptop:p-2 flex flex-col gap-2 overflow-y-auto overflow-x-hidden p-2">
        {loadingChats ? (
          <div className="h-full w-full flex items-center justify-center">
            <MoonLoader size={30} />
          </div>
        ) : (
          chats?.map((item: any, index: number) => {
            return <RoomItem key={index} item={item} confirm={confirm} />;
          })
        )}

        {totalChats !== null && totalChats === 0 && (
          <div className="text-gray-400 flex w-full items-center justify-center text-red-500 mt-24">
            Not Found
          </div>
        )}

        {chats?.length > 7 && totalChats && totalChats > chats?.length && (
          <div className="w-full flex justify-center">
            <div
              className="border-full rounded-full shadow-md px-3 py-1 cursor-pointer hover:bgightness-95 w-32 text-center"
              onClick={AddChats}
            >
              Load More
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Rooms;
