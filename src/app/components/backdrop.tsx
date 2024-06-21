"use client";
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useApp } from "@/app/context/app";

export default function SimpleBackdrop() {
  const { openBackDrop } = useApp();

  return (
    <div className="bg-red-500">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
