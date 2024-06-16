import React from "react";
import Security from "./security";

const Settings = () => {
  return (
    <div
      className="bg-white w-full h-full rounded-md shadow-sm pl-2"
      style={{ overflowY: "scroll" }}
    >
      <div className="flex-1 w-full">
        <Security />
      </div>
    </div>
  );
};

export default Settings;
