"use client";
import Image from "@/app/components/image";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useChat } from "@/app/context/chat";
import axios from "axios";
import React, { useState } from "react";
import { MdClose, MdImage, MdSend } from "react-icons/md";
import { v4 } from "uuid";
import { handleFileUpload } from "./fileInput";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/app/firebase";
import { MoonLoader } from "react-spinners";

const Input = ({ setMessages }: any) => {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<any>(null);

  // current user
  const { currentUser, socket } = useAuth();

  // current chat
  const { activeRoom, setChats, chats, GetChats, bottomRef, messagesRef } =
    useChat();

  const fileInput = async (event: any) => {
    // setUploadingCover(true);
    const file = event.target.files[0];
    if (!file) return;

    setFile(file);
  };

  // app context
  const { apiUrl } = useApp();

  // Send Message
  const [uploadLoading, setUploadLoading] = useState(false);
  let formData = new FormData();
  formData.append("image", file);

  const SendMessage = async (newMsg: any) => {
    try {
      let newMessage = {
        ...newMsg,
        file: file,
        room: {
          ...activeRoom,
          members: activeRoom?.members?.map((i: any) => {
            return { id: i.id, status: i.status };
          }),
        },
      };
      setUploadLoading(true);
      formData.append("message", JSON.stringify(newMessage));

      const response = await axios.post(`${apiUrl}/api/v1/messages`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.status === "success") {
        newMessage = response.data.data.message;
      }

      setUploadLoading(false);

      // Add the new message to the messages array
      setMessages((prev: any) => [newMessage, ...prev]);
      setTimeout(() => {
        requestAnimationFrame;
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 100);
      // Clear the input field
      setInput("");
      setFile(null);
      // Update the last message in the chats array
      setChats((prev: any) =>
        prev.map((chat: any) => {
          if (chat.roomId === newMessage.roomId) {
            return {
              ...chat,
              lastMessage: {
                sender: currentUser?.userId,
                text: newMessage.text,
                status: "unread",
              },
            };
          }
          return chat;
        })
      );

      // Check if a chat with matching member IDs already exists
      const existingChat = chats.find((chat: any) =>
        chat.members.every((member: any) =>
          activeRoom.members.some(
            (newMember: any) => newMember.id === member.id
          )
        )
      );

      if (!existingChat) {
        // Add new room (assuming room is structured appropriately)
        GetChats();
      }

      // send socket request to user
      if (socket) {
        socket.emit("sendMessage", newMessage);
      }

      // Optionally handle response if needed
      console.log("Message sent successfully");
    } catch (error: any) {
      console.log(
        "Error sending message:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="h-full w-full bg-gray-50 flex items-center">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-full w-full p-2 pl-4 bg-transparent"
        placeholder="Text here..."
      />
      <div className="flex items-center gap-4">
        <div className="cursor-pointer hover:brightness-90 mr-4">
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            accept="image/jpeg, image/png, image/webp"
            onClick={(e: any) => {}}
            onChange={(e: any) => {
              e.preventDefault();
              fileInput(e);
            }}
          />
          {file ? (
            <div className="h-16 relative aspect-square rounded-xl shadow-md overflow-hidden">
              <MdClose
                size={16}
                color="red"
                className="absolute z-10 top-1 right-1 cursor-pointer hover:brightness-95"
                onClick={uploadLoading ? undefined : () => setFile(null)}
              />
              {uploadLoading && (
                <div
                  style={{ transform: "translateX(-50%) translateY(-50%)" }}
                  className="absolute z-20 left-1/2 top-1/2 bg-red"
                >
                  <MoonLoader size={24} color="white" />
                </div>
              )}
              <Image
                alt={currentUser?.name}
                src={file ? URL.createObjectURL(file) : null}
                style={{
                  aspectRatio: 1,
                  zIndex: 0,
                  width: "100%",
                  filter: uploadLoading ? "brightness(0.5)" : "none",
                }}
              />
            </div>
          ) : (
            <label
              htmlFor="fileInput"
              style={{ cursor: "pointer" }}
              className={`hover:brightness-105`}
            >
              <MdImage size={32} color="gray" />
            </label>
          )}
        </div>
        <div
          className="cursor-pointer hover:brightness-90 mr-4"
          onClick={
            uploadLoading
              ? undefined
              : () =>
                  SendMessage({
                    roomId: activeRoom.roomId,
                    messageId: v4(),
                    sender: { id: currentUser?.userId, status: "active" },
                    receiver: {
                      id: activeRoom?.members?.find(
                        (i: any) => i.id !== currentUser?.userId
                      ).id,
                      status: "active",
                    },
                    text: input,
                    file: file,
                    createdAt: new Date(),
                    status: "unread",
                  })
          }
        >
          <div className="w-10 flex justify-center">
            {uploadLoading ? (
              <MoonLoader size={24} className="text-green" />
            ) : (
              <MdSend size={32} color="gray" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Input;
