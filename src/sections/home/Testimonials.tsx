"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Any testimonial-specific animations can go here
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="testimonials-section relative z-10 bg-[#050505] w-full min-h-[200vh]">
      {/* Empty for now as requested */}
    </section>
  );
}
