"use client";
import ConfirmPopup from "@/app/components/confirmPopup";
import Search from "@/app/components/search";
import SimpleSnackbar from "@/app/components/snackBar";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { useProfileContext } from "@/app/context/profile";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import List from "./list";

interface propsTypes {}

const Products: React.FC<propsTypes> = () => {
  // confirm popup to delete product
  const [confirmPopup, setConfirmPopup] = useState({
    active: false,
    close: null,
    agree: null,
    text: "",
  });

  // profile context
  const { alert, setAlert } = useProfileContext();

  // products context
  const { search, setSearch, productsRef } = useProfileContext();

  // auth context
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!confirmPopup.active) {
      document.body.style.overflowY = "auto";
    }
  }, [confirmPopup.active]);

  return (
    <div className="overflow-hidden rounded-xl flex-1">
      <div className="flex flex-col gap-2 items-center w-full h-full laptop:mr-24">
        <div className="w-full flex flex-col laptop:flex-row gap-2">
          <div className="w-full">
            <Search
              search={search}
              setSearch={setSearch}
              userId={currentUser?.userId}
            />
          </div>
          <div>
            <Link
              href={"/profile/products/addProduct"}
              className="h-11 text-white font-bold px-3 bg-green-500 rounded-xl flex items-center justify-center cursor-pointer hover:brightness-95"
            >
              {" "}
              <MdAdd size={32} />
              <span className="font-semibold">დამატება</span>
            </Link>
          </div>
        </div>
        <div
          className="flex-1 w-full rounded-xl text-black laptop:p-4 laptop:bg-white laptop:shadow-sm"
          ref={productsRef}
        >
          <List setConfirmPopup={setConfirmPopup} />
        </div>
      </div>
      <SimpleSnackbar alert={alert} setAlert={setAlert} />
      <ConfirmPopup confirmPopup={confirmPopup} />
    </div>
  );
};

export default Products;
