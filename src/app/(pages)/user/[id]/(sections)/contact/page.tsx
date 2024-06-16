import React from "react";
import Info from "./info";

interface propsTypes {}

const Settings: React.FC<propsTypes> = () => {
  return (
    <div className="bg-white h-full rounded-md shadow-sm laptop:pl-2">
      <div className="flex-1 h-full">
        <Info />
      </div>
    </div>
  );
};

export default Settings;
