"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Lenis from "lenis";

interface ScrollContextType {
  lenis: Lenis | null;
  setLenis: (instance: Lenis | null) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  return (
    <ScrollContext.Provider value={{ lenis, setLenis }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
}
