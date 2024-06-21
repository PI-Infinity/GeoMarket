import Image from "@/app/components/image";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useChat } from "@/app/context/chat";
import { storage } from "@/app/firebase";
import axios from "axios";
import { deleteObject, listAll, ref } from "firebase/storage";
import { setConfig } from "next/config";
import React, { useEffect, useState } from "react";
import { MdClose, MdDelete, MdDone, MdDoneAll, MdRemove } from "react-icons/md";
import GetTimesAgo from "@/app/utils/getTimesAgo";
import { MoonLoader } from "react-spinners";

const MessagemItem = ({ item }: any) => {
  // messageData
  const [msg, setMsg] = useState({
    sender: { id: "" },
    text: "",
    status: "",
    messageId: "",
    roomId: "",
    file: { url: "", publicId: "", folder: "" },
    createdAt: "",
  });

  useEffect(() => {
    setMsg(item);
  }, [item]);
  // app context
  const { apiUrl } = useApp();

  // chat context
  const { setChats, setMessages, messages } = useChat();

  // current user
  const { currentUser, socket } = useAuth();

  // seen message
  const SeenMessage = async () => {
    try {
      if (msg?.sender.id !== currentUser?.userId && msg.status === "unread") {
        console.log("seen");

        await axios.patch(apiUrl + "/api/v1/messages/" + msg.messageId, {
          status: "seen",
        });
        // send socket request to user
        if (socket) {
          socket.emit("seenMessage", msg.sender.id);
        }
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    if (msg.messageId) {
      SeenMessage();
    }
  }, [msg.messageId]);

  // seen message in live
  // add message from socket
  useEffect(() => {
    if (socket) {
      // Use socket.on to listen for messages from the server
      socket.on("messageSeen", (newMsg: any) => {
        setMessages((prev: any) =>
          prev.map((i: any) => {
            if (i.messageId === msg.messageId && i.status === "unread") {
              return { ...i, status: "seen" };
            } else {
              return i;
            }
          })
        );
        setChats((prev: any) =>
          prev.map((i: any) => {
            if (i.roomId === msg.roomId) {
              return {
                ...i,
                lastMessage: { ...i.lastMessage, status: "read" },
              };
            } else {
              return i;
            }
          })
        );
        // Handle the received message as needed
      });
    }

    // Clean up the socket listener when component unmounts
    return () => {
      if (socket) {
        socket.off("messageSeen");
      }
    };
  }, [socket, msg]);

  /**
   * Delete message
   */
  // open config
  const [openConfig, setOpenConfig] = useState("");
  // confirm popup
  const [openConfrim, setOpenConfirm] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const DeleteMessage = async (msgId: any, publicId: any, folder: any) => {
    try {
      setDeleteLoading(true);
      const response = await axios.delete(
        apiUrl +
          "/api/v1/messages/" +
          msgId +
          "?currentUser=" +
          currentUser?.userId +
          "&publicId=" +
          publicId +
          "&folder=" +
          folder
      );
      if (response.data.status === "success") {
        setMsg({
          sender: { id: "" },
          text: "",
          status: "",
          messageId: "",
          roomId: "",
          file: { url: "", publicId: "", folder: "" },
          createdAt: "",
        });
        setMessages((prev: any) =>
          prev.filter((i: any) => i.messageId !== item.messageId)
        );
        setConfig("");
        setOpenConfirm(false);
        setDeleteLoading(false);
      }
    } catch (error: any) {
      console.log(error.response);
    }
  };

  return (
    <>
      {deleteLoading ? (
        <div
          className="rounded-full w-full flex flex-col msgs-center p-2 py-1 gap-1"
          style={{
            alignItems:
              msg.sender.id === currentUser?.userId ? "flex-end" : "flex-start",
          }}
        >
          <MoonLoader size={24} color="red" />
        </div>
      ) : (
        <>
          {msg?.messageId?.length > 0 && (
            <div
              className="rounded-full w-full flex flex-col msgs-center p-2 py-1 gap-1"
              style={{
                alignItems:
                  msg.sender.id === currentUser?.userId
                    ? "flex-end"
                    : "flex-start",
              }}
            >
              {openConfrim ? (
                <div className="flex items-center justify-evenly p-1 px-3 gap-2 bg-gray-50 shadow-md rounded-full">
                  <div
                    onClick={() => setOpenConfirm(false)}
                    className="cursor-pointer hover:brightness-95 w-8"
                  >
                    <MdClose size={24} color="red" />
                  </div>
                  <span className="text-sm font-semibold">Delete</span>
                  <div
                    onClick={() =>
                      DeleteMessage(
                        msg?.messageId,
                        msg?.file?.publicId,
                        msg?.file?.folder
                      )
                    }
                    className="cursor-pointer hover:brightness-95"
                  >
                    <MdDone size={24} color="green" />
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2"
                  style={{ maxWidth: "50%" }}
                >
                  {msg.sender.id !== currentUser?.userId &&
                    openConfig === msg?.messageId && (
                      <div className="flex items-center gap-2">
                        <MdDelete
                          onClick={() => setOpenConfirm(true)}
                          color="red"
                          size={16}
                        />
                        <span
                          className="text-gray-400"
                          style={{ fontSize: "12px" }}
                        >
                          {GetTimesAgo(msg?.createdAt)}
                        </span>
                      </div>
                    )}
                  <div
                    className="shadow-sm rounded-xl overflow-hidden flex flex-col items-end cursor-pointer hover:brightness-95"
                    style={{
                      background:
                        msg.sender.id === currentUser?.userId
                          ? "#f9f9f9"
                          : "red",
                      color:
                        msg.sender.id === currentUser?.userId
                          ? "black"
                          : "white",
                    }}
                  >
                    {msg?.file?.url?.length > 0 && (
                      <div className="w-48 relative aspect-square shadow-md">
                        <Image
                          onClick={() => setOpenConfig(msg?.messageId)}
                          alt={currentUser?.name}
                          src={msg?.file?.url}
                          style={{
                            aspectRatio: 1,
                            zIndex: 0,
                            width: "100%",
                          }}
                        />
                        {msg.sender.id === currentUser?.userId &&
                          (msg?.file || msg?.file?.url?.length > 0) &&
                          msg?.text.length < 1 && (
                            <MdDoneAll
                              size={16}
                              className="absolute z-10 bottom-2 right-2"
                              color={msg.status === "unread" ? "gray" : "red"}
                            />
                          )}
                      </div>
                    )}
                    {msg.text?.length > 0 && (
                      <div className="flex items-center gap-2 p-1 px-3">
                        <p
                          onClick={
                            openConfig === msg?.messageId
                              ? () => setOpenConfig("")
                              : () => setOpenConfig(msg?.messageId)
                          }
                          className="whitespace-nowrap"
                        >
                          {msg.text}
                        </p>

                        {msg.sender.id === currentUser?.userId && (
                          <MdDoneAll
                            size={16}
                            color={msg.status === "unread" ? "gray" : "red"}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  {msg.sender.id === currentUser?.userId &&
                    openConfig === msg?.messageId && (
                      <div className="flex items-center gap-1">
                        <span
                          className="text-gray-400"
                          style={{ fontSize: "12px", whiteSpace: "nowrap" }}
                        >
                          {GetTimesAgo(msg?.createdAt)}
                        </span>
                        <MdDelete
                          onClick={() => setOpenConfirm(true)}
                          color="red"
                          size={16}
                        />
                      </div>
                    )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MessagemItem;
