"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: "AURA Residence", category: "Residential", span: "col-span-1 md:col-span-8 md:row-span-2", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" },
  { title: "NEXUS Tech", category: "Commercial", span: "col-span-1 md:col-span-4", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" },
  { title: "OBSIDIAN Lounge", category: "Hospitality", span: "col-span-1 md:col-span-4", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" },
  { title: "VELVET Studio", category: "Commercial", span: "col-span-1 md:col-span-6", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop" },
  { title: "LUMINA Penthouse", category: "Residential", span: "col-span-1 md:col-span-6", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" },
];

export default function Work() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bento-card",
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative w-full pt-48 pb-32 px-4 md:px-12 max-w-7xl mx-auto z-10 min-h-[100dvh]">
      <div className="mb-24 flex items-end justify-between border-b border-white/10 pb-12">
        <div>
          <h1 className="text-6xl md:text-8xl font-light tracking-tighter">Selected Works</h1>
        </div>
        <p className="hidden md:block text-white/40 max-w-xs text-sm">An archive of our most defining spatial interventions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px] md:auto-rows-[400px]">
        {projects.map((project, idx) => (
          <div key={idx} className={`bento-card relative p-2 rounded-[2rem] bg-white/5 ring-1 ring-white/10 backdrop-blur-xl group cursor-pointer ${project.span}`}>
            <div className="relative w-full h-full rounded-[calc(2rem-0.5rem)] overflow-hidden bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <Image
                src={project.img}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={idx < 2}
                className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity transition-all duration-1000 ease-[var(--ease-custom)] group-hover:scale-105 group-hover:opacity-80 group-hover:mix-blend-normal"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[var(--ease-custom)]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2">{project.category}</p>
                  <h3 className="text-2xl font-light text-white">{project.title}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform duration-700">
                  <span className="text-white text-xl">→</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
