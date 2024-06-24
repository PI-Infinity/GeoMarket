import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useUserContext } from "@/app/context/user";
import axios from "axios";
import React, { useState } from "react";
import { MdSend } from "react-icons/md";
import { MoonLoader } from "react-spinners";
import { v4 } from "uuid";

const ReviewInput = ({ setList, setTotalReviews }: any) => {
  // app context
  const { apiUrl, activeLanguage } = useApp();

  // auth state
  const { currentUser } = useAuth();

  // input field
  const [textInput, setTextInput] = useState("");

  // loading adding
  const [loading, setLoading] = useState(false);

  // product context
  const { product } = useUserContext();

  const AddReview = async () => {
    const newReview = {
      reviewId: v4(),
      reviewer: {
        userId: currentUser?.userId,
        name: currentUser?.name,
        cover: currentUser?.cover,
        rating: currentUser?.rating,
      },
      text: textInput,
      createdAt: new Date(),
    };
    try {
      setLoading(true);
      const response = await axios.post(
        apiUrl + "/api/v1/products/" + product?.productId + "/reviews",
        {
          ...newReview,
        }
      );
      if (response.data.status === "success") {
        setList((prev: any) => [newReview, ...prev]);
        setTextInput("");
        setTotalReviews((prev: any) => (prev += 1));
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    } catch (error: any) {
      console.log(error.response);
    }
  };
  return (
    <div className="h-full w-full bg-gray-50 flex items-center gap-2 rounded-xl overflow-hidden shadow-md pr-2">
      <textarea
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        className="h-full w-full p-2 pl-4 bg-transparent"
        placeholder={activeLanguage?.typeHere}
        maxLength={300}
      />
      <div className="h-full w-20 flex items-center justify-center">
        {loading ? (
          <MoonLoader size={20} color="green" />
        ) : (
          <MdSend
            onClick={AddReview}
            size={32}
            color="gray"
            className="cursor-pointer hover:brightness-95"
          />
        )}
      </div>
    </div>
  );
};

export default ReviewInput;
