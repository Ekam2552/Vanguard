"use client";

import { useEffect, useRef, useState, useCallback, ReactNode } from "react";
import Lenis from "lenis";
import { Loader } from "./Loader";

export default function SmoothScrolling({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const lenisRef = useRef<Lenis | null>(null);

  const handleFinished = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      if (!isLoading) {
        lenisRef.current.start();
      } else {
        lenisRef.current.stop();
      }
    }
  }, [isLoading]);

  return (
    <>
      <Loader onFinished={handleFinished} />
      <div>
        {children}
      </div>
    </>

  );
}


