"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import getChats from "../hooks/getChats";
import getMessages from "../hooks/getMessages";
import getRoom from "../hooks/getRoom";
import getUnreadChats from "../hooks/getUnreadChats";
import { useApp } from "./app";
import { useAuth } from "./auth";

/**
 * Chat context
 */

const Chat = createContext<any>(null);

export const useChat = () => useContext(Chat);

interface contextProps {
  children: ReactNode;
}

export const ChatContextWrapper: React.FC<contextProps> = ({ children }) => {
  // app context
  const { apiUrl } = useApp();

  // auth context
  const { currentUser } = useAuth();

  /**
   * Chats
   */

  const [chats, setChats] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalChats, setTotalChats] = useState(0);
  const [loadingChats, setLoadingChats] = useState(false);

  const GetChats = async () => {
    try {
      setLoadingChats(true);
      const response = await getChats({ apiUrl, currentUser, newPage: 1 });
      if (response.status === "success") {
        setChats(response.data.chats);
        setTotalChats(response.total);
        setLoadingChats(false);
        setPage(1);
      }
    } catch (error: any) {
      setLoadingChats(false);
      console.log("chats getting error");
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    if (currentUser) {
      GetChats();
    }
  }, [currentUser]);

  /**
   * Room
   */

  // active room
  const [activeRoom, setActiveRoom] = useState({ roomId: "" });

  /**
   * Socket connections
   */
  const { socket } = useAuth();

  useEffect(() => {
    if (socket) {
      socket.on("getUsers", (data: any) => {
        // console.log("Users in chat component:", data);
      });

      return () => {
        socket.off("getUsers");
      };
    }
  }, [socket]);

  /**
   * chat messages
   */

  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState<any>([]);
  const [messagesPage, setMessagesPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(null);

  const messagesRef = useRef<any>();

  // get messages
  const GetMessages = async () => {
    try {
      setLoadingMessages(true);
      const response = await getMessages({
        apiUrl,
        activeRoom,
        page: 1,
        currentUser,
      });

      if (response.status === "success") {
        setMessages(response.data.messages);
        setTotalMessages(response.total);
        setLoadingMessages(false);
        setMessagesPage(1);
      }
    } catch (error: any) {
      setLoadingMessages(false);
      console.log(error.response.data.message);
    }
  };

  // add messages
  const AddMessages = async () => {
    const newPage = messagesPage + 1;
    try {
      const response = await getMessages({
        apiUrl,
        activeRoom,
        page: newPage,
        currentUser,
      });

      setMessages((prevMessages: any) => {
        const existingIds = new Set(
          prevMessages.map((msg: any) => msg.messageId)
        );

        // Filtering out duplicates from the newly fetched messages
        const filteredNewMessages = response.data.messages.filter(
          (msg: any) => !existingIds.has(msg.messageId)
        );

        // If there are new messages, prepend them to the previous messages
        // Also, update the page state and set loading more to false
        if (filteredNewMessages.length > 0) {
          setMessagesPage(newPage);
          return [...prevMessages, ...filteredNewMessages];
        } else {
          // If there are no new messages, just return the previous messages
          return prevMessages;
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * define room if page reload
   */
  const pathname = usePathname();
  const roomId = pathname.split("/")[2];

  const router = useRouter();

  const GetRoom = async (id: any) => {
    try {
      const response = await getRoom({ apiUrl, id });
      if (response.status === "success") {
        if (
          response.data.chat.members.find(
            (i: any) => i.id === currentUser?.userId
          )
        ) {
          setActiveRoom(response.data.chat);
          if (!response.data.chat) {
            router.push("/chat");
          }
          return response.data.chat;
        }
      } else {
        if (pathname.includes("/chat")) {
          router.push("/chat");
        }
      }
    } catch (error: any) {
      console.log(error.response);
    }
  };

  // add message from socket
  useEffect(() => {
    if (socket) {
      // Use socket.on to listen for messages from the server
      socket.on("getMessage", async (newMsg: any) => {
        if (newMsg.roomId === activeRoom?.roomId) {
          setMessages((prev: any) => [newMsg, ...prev]);
        }
        const foundedChat = chats?.find((i: any) => i.roomId === newMsg.roomId);
        if (!foundedChat) {
          const chat = await GetRoom(newMsg.roomId);
          console.log(chat);
          setChats((prev: any) => [...prev, chat]);
        } else {
          setChats((prev: any) =>
            prev.map((i: any) => {
              if (i.roomId === newMsg.roomId) {
                return {
                  ...i,
                  lastMessage: {
                    text: newMsg.text,
                    sender: newMsg.sender.id,
                    status: pathname.includes(newMsg?.roomId)
                      ? "read"
                      : "unread",
                  },
                };
              } else {
                return i; // Return unchanged if roomId doesn't match
              }
            })
          );
        }
        if (!pathname.includes(newMsg?.roomId)) {
          setUnreadChats((prev: any) => [
            ...prev,
            {
              roomId: newMsg.roomId,
              lastMessage: {
                text: newMsg.text,
                sender: newMsg.sender.id,
                status: "unread",
              },
            },
          ]);
        }

        // Handle the received message as needed
      });
    }

    // Clean up the socket listener when component unmounts
    return () => {
      if (socket) {
        socket.off("getMessage");
      }
    };
  }, [socket, chats, activeRoom, roomId]);

  // open chat list in mobile
  const [openChatList, setOpenChatList] = useState(false);

  useEffect(() => {
    if (pathname === "/chat") {
      setMessages([]);
      setOpenChatList(true);
    } else {
      setOpenChatList(false);
    }
  }, [pathname]);

  /**
   * get unread messages
   */
  const [unreadChats, setUnreadChats] = useState<any>([]);

  const GetUnreadMessages = async () => {
    try {
      const response = await getUnreadChats({ apiUrl, currentUser });
      if (response.status === "success") {
        setUnreadChats(response.data);
      }
    } catch (error: any) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    if (currentUser) {
      GetUnreadMessages();
    }
  }, [currentUser]);

  /**
   * open create new chat for mobile
   */
  const [createChatMobile, setCreateChatMobile] = useState(false);

  return (
    <Chat.Provider
      value={{
        activeRoom,
        setActiveRoom,
        chats,
        setChats,
        page,
        setPage,
        search,
        setSearch,
        totalChats,
        setTotalChats,
        GetChats,
        GetRoom,
        messages,
        messagesRef,
        GetMessages,
        AddMessages,
        setMessages,
        totalMessages,
        loadingMessages,
        openChatList,
        setOpenChatList,
        unreadChats,
        setUnreadChats,
        createChatMobile,
        setCreateChatMobile,
      }}
    >
      {children}
    </Chat.Provider>
  );
};
