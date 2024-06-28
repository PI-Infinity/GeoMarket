import { Metadata } from "next";
import React from "react";

interface propsTypes {
  children: any;
}

const Product: React.FC<propsTypes> = ({ children }) => {
  return <div className="flex-1">{children}</div>;
};

export default Product;
