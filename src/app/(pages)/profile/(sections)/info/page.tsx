import React from "react";
import Info from "./infos";

interface propsTypes {}

const PersonalInfo: React.FC<propsTypes> = () => {
  return (
    <div className="bg-white h-full rounded-xl shadow-sm laptop:pl-2">
      <div className="flex-1">
        <PersonalInfo />
      </div>
    </div>
  );
};

export default Info;
