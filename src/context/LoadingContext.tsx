"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
  isLoaded: boolean;
  setIsLoaded: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoaded, setIsLoaded }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
