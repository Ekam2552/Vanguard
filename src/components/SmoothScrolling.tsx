"use client";

import { useEffect, useRef, useState, useCallback, ReactNode } from "react";
import Lenis from "lenis";
import { Loader } from "./Loader";
import { ScrollProvider, useScroll } from "@/context/ScrollContext";

export default function SmoothScrolling({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleFinished = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <ScrollProvider>
      <LenisObserver isLoading={isLoading}>
        <Loader onFinished={handleFinished} />
        <div>
          {children}
        </div>
      </LenisObserver>
    </ScrollProvider>
  );
}

function LenisObserver({ children, isLoading }: { children: ReactNode, isLoading: boolean }) {
  const { setLenis } = useScroll();
  const lenisRef = useRef<Lenis | null>(null);

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
    setLenis(lenis);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, [setLenis]);

  useEffect(() => {
    if (lenisRef.current) {
      if (!isLoading) {
        lenisRef.current.start();
      } else {
        lenisRef.current.stop();
      }
    }
  }, [isLoading]);

  return <>{children}</>;
}


