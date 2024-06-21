import { useApp } from "@/app/context/app";
import { useUserContext } from "@/app/context/user";
import getReviews from "@/app/hooks/getReviews";
import React, { useEffect, useState } from "react";
import ReviewInput from "./review-input";
import { ReviewItem } from "./review-item";
import axios from "axios";

const Reviews = () => {
  // app context
  const { apiUrl } = useApp();
  // product context
  const { product } = useUserContext();
  /**
   * reviews
   */

  // list
  const [list, setList] = useState<any>([]);
  const [totalReviews, setTotalReviews] = useState<any>(null);
  const [page, setPage] = useState(1);

  const GetReviews = async () => {
    try {
      const response = await getReviews({
        apiUrl,
        productId: product?.productId,
        newPage: 1,
      });

      if (response.status === "success") {
        setList(response.data.reviews);
      }
      setTotalReviews(response.totalReviews || 0);
      setPage(1);
    } catch (error: any) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    if (product?.productId) {
      GetReviews();
    }
  }, [product]);

  // add reviews
  const AddReviews = async () => {
    try {
      const newPage = page + 1;
      const response = await getReviews({
        apiUrl,
        productId: product?.productId,
        newPage,
      });

      if (response.status === "success") {
        setList((prevReviews: any) => {
          // Create a new set with existing review IDs for quick lookup
          const existingIds = new Set(
            prevReviews.map((review: any) => review.reviewId)
          );

          // Filter out duplicates from the newly fetched reviews based on review ID
          const filteredNewreviews = response.data.reviews.filter(
            (p: any) => !existingIds.has(p.reviewId)
          );

          if (filteredNewreviews.length > 0) {
            return [...prevReviews, ...filteredNewreviews];
          } else {
            return [...prevReviews];
          }
        });
      }
      setTotalReviews(response.totalReviews);
      setPage(newPage);
    } catch (error: any) {
      console.log(error.response);
    }
  };

  /**
   * Delete review
   */
  // confirm delete
  const [confirm, setConfirm] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const DeleteReview = async (reviewId: any) => {
    try {
      setDeleteLoading(true);
      const response = await axios.delete(
        apiUrl +
          "/api/v1/products/" +
          product?.productId +
          "/reviews/" +
          reviewId
      );
      if (response.data.status === "success") {
        setList((prev: any) =>
          prev.filter((i: any) => i.reviewId !== reviewId)
        );
        setConfirm(false);
        setTotalReviews((prev: any) => (prev -= 1));
        setTimeout(() => {
          setDeleteLoading(false);
        }, 200);
      }
    } catch (error: any) {
      console.log(error.response);
    }
  };

  // change review
  const [change, setChange] = useState<any>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const ChangeReview = async (reviewId: any) => {
    try {
      setUpdateLoading(true);
      const response = await axios.patch(
        apiUrl +
          "/api/v1/products/" +
          product?.productId +
          "/reviews/" +
          reviewId,
        {
          reviewId: reviewId,
          text: change.text,
        }
      );
      if (response.data.status === "success") {
        setList((prev: any) =>
          prev.map((i: any) => {
            if (i.reviewId === reviewId) {
              return { ...i, text: change.text };
            } else {
              return i;
            }
          })
        );
        setChange(false);
        setTimeout(() => {
          setUpdateLoading(false);
        }, 200);
      }
    } catch (error: any) {
      console.log(error.response);
    }
  };

  return (
    <div className="pt-2 laptop:p-4 flex flex-col gap-2 w-full">
      <h3 className="text-gray-400 font-semibold text-sm ml-2 laptop:ml-4 mb-2">
        Comments ({totalReviews})
      </h3>
      <ReviewInput setList={setList} setTotalReviews={setTotalReviews} />
      <div className="flex flex-col gap-2 items-center w-full bg-white rounded-xl">
        {totalReviews !== null && list?.length === 0 && (
          <div className="my-4 ml-4 text-gray-400 flex w-full items-center text-red-500">
            Not Found
          </div>
        )}
        {list &&
          list?.map((item: any, index: number) => {
            return (
              <ReviewItem
                deleteLoading={deleteLoading}
                key={index}
                item={item}
                DeleteReview={DeleteReview}
                confirm={confirm}
                setConfirm={setConfirm}
                ChangeReview={ChangeReview}
                change={change}
                setChange={setChange}
                updateLoading={updateLoading}
              />
            );
          })}
        {totalReviews > list?.length && (
          <div
            onClick={AddReviews}
            className="text-sm my-2 mt-4 text-red-500 cursor-pointer hover:brightness-90"
          >
            Load More
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
