import React from "react";
import UploadingRules from "../../profile/(sections)/products/addProduct/uploadingRules";

const Page = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-4">
      <h3 className="text-black">Product upload rules:</h3>
      <UploadingRules />;
    </div>
  );
};

export default Page;
