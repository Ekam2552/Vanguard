"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cascade-card",
        { y: 150, opacity: 0, rotationX: 10 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cascade-container",
            start: "top 80%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative w-full pt-48 pb-32 px-4 md:px-12 max-w-7xl mx-auto z-10">
      <div className="max-w-4xl">
        <span className="rounded-full px-3 py-1 text-[10px] w-max uppercase tracking-[0.2em] font-medium border border-white/10 bg-white/5 mb-8 inline-block">The Studio</span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-tight mb-12">
          Rejecting the mundane. <br/>
          <span className="text-white/40 italic">Embracing the profound.</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/60 font-light leading-relaxed max-w-2xl">
          Vanguard was founded on a singular premise: that the spaces we inhabit shape the architecture of our minds. We design not just for aesthetic impact, but for psychological resonance.
        </p>
      </div>

      <div className="cascade-container relative mt-32 md:mt-48 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
        <div className="cascade-card relative z-10 w-full md:w-[45%] md:translate-x-12 p-2 rounded-[2rem] bg-white/5 ring-1 ring-white/10 backdrop-blur-xl md:-rotate-2">
          <div className="relative aspect-square w-full rounded-[calc(2rem-0.5rem)] bg-[#111] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=2070&auto=format&fit=crop"
              alt="Interior 1"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover w-full h-full opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
            />
          </div>
        </div>
        
        <div className="cascade-card relative z-20 w-full md:w-[40%] p-2 rounded-[2rem] bg-[#050505]/40 ring-1 ring-white/10 backdrop-blur-2xl md:translate-y-24 md:rotate-3 shadow-2xl">
          <div className="relative aspect-[4/5] w-full rounded-[calc(2rem-0.5rem)] bg-[#0a0a0a] overflow-hidden p-12 flex flex-col justify-end shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            <h3 className="text-3xl font-light mb-4 text-white">The Method</h3>
            <p className="text-white/50 text-sm leading-relaxed">We strip away the non-essential until only the pure geometry remains. Then, we sculpt with light.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
