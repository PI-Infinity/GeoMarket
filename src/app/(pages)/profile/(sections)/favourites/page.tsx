"use client";
import ConfirmPopup from "@/app/components/confirmPopup";
import Search from "@/app/components/search";
import SimpleSnackbar from "@/app/components/snackBar";
import { useApp } from "@/app/context/app";
import Link from "next/link";
import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import { useProfileContext } from "@/app/context/profile";
import { useAuth } from "@/app/context/auth";
import List from "./list";

const Favourites = () => {
  // confirm popup to delete product
  const [confirmPopup, setConfirmPopup] = useState({
    active: false,
    close: null,
    agree: null,
    text: "",
  });

  // app context
  const { setSectionLoading } = useApp();

  // profile context
  const { alert, setAlert } = useProfileContext();

  // products context
  const { search, setSearch, productsRef } = useProfileContext();

  // auth context
  const { currentUser } = useAuth();

  return (
    <>
      <div className="flex flex-col gap-4 items-center w-full h-full mr-24">
        <div
          className="flex-1 w-full rounded-xl text-black laptop:p-4 laptop:bg-white laptop:shadow-sm"
          ref={productsRef}
          style={{ minHeight: "calc(100% - 9.5rem)" }}
        >
          <List setConfirmPopup={setConfirmPopup} />
        </div>
      </div>

      <SimpleSnackbar alert={alert} setAlert={setAlert} />
      <ConfirmPopup confirmPopup={confirmPopup} />
    </>
  );
};

export default Favourites;
