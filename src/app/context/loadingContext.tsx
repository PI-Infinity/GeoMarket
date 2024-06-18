"use client";
// context/LoadingContext.js
import React, { createContext, useState, useContext } from "react";

const LoadingContext = createContext<any>(null);

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
