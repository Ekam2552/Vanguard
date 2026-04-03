"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TEAM = [
  { 
    name: "Julian Vanguard", 
    role: "Founder / Principal architect", 
    color: "bg-[#1a1a1a]",
    image: "/about/team/julian.png"
  },
  { 
    name: "Søren Kjeldsen", 
    role: "Creative Director", 
    color: "bg-[#252528]",
    image: "/about/team/soren.png"
  },
  { 
    name: "Elena Rossi", 
    role: "Lead Material Specialist", 
    color: "bg-[#1e201e]",
    image: "/about/team/elena.png"
  },
  { 
    name: "Marcus Thorne", 
    role: "Technical Director", 
    color: "bg-[#2c2c2e]",
    image: "/about/team/marcus.png"
  },
  { name: "Clara Amara", role: "Lighting Designer", color: "bg-[#1c1e1c]" },
  { name: "Arjun Mehta", role: "Interior Architect", color: "bg-[#252525]" },
  { name: "Sofia Chen", role: "Furniture Designer", color: "bg-[#1e2220]" },
  { name: "Liam O'Shea", role: "Structural Engineer", color: "bg-[#2a2a2c]" },
  { name: "Isabella Vask", role: "Senior Stylist", color: "bg-[#202022]" },
  { name: "Taro Tanaka", role: "Landscape Architect", color: "bg-[#1a1c1a]" },
  { name: "Nina Petrov", role: "Render Master", color: "bg-[#222225]" },
  { name: "David Foster", role: "Project Manager", color: "bg-[#1c1e20]" },
];

export function Team() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!horizontalRef.current || !sectionRef.current) return;

      const totalWidth = horizontalRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const xScroll = -(totalWidth - viewportWidth);

      // 1. MASTER HORIZONTAL TIMELINE
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalWidth * 0.6}`, // HIGHER VELOCITY
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      // Horizontal Slide
      mainTl.to(horizontalRef.current, {
        x: xScroll,
        ease: "none",
      });

      // 2. INTERNAL PARALLAX (CODROPS STYLE)
      // INCREASED DEPTH
      cardsRef.current.forEach((card) => {
        if (!card) return;
        const inner = card.querySelector(".team-image-inner");
        if (!inner) return;

        gsap.fromTo(inner, 
          { x: "-20%" }, 
          {
            x: "20%", 
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: mainTl,
              start: "left right",
              end: "right left",
              scrub: true,
            }
          }
        );
      });

      // 3. ENTRANCE FADE-UP FOR TEXT
      gsap.fromTo(".team-intro-text",
        { y: 30, opacity: 0, filter: "blur(10px)" },
        { 
          y: 0, 
          opacity: 1, 
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-[#050505] flex flex-col justify-center">
      {/* Intro Block - Optimized for vertical space */}
      <div className="max-w-[1400px] mx-auto w-full px-6 mb-8 md:mb-12">
        <span className="team-intro-text block rounded-full px-3 py-1 text-[10px] w-max uppercase tracking-[0.3em] font-medium border border-white/10 bg-white/5 mb-6">
          The Collective
        </span>
        <h2 className="team-intro-text text-4xl md:text-5xl lg:text-[4.5vw] font-light tracking-tighter leading-none text-white overflow-hidden">
          A Symphony of <span className="italic text-white/40">Specialists.</span>
        </h2>
      </div>

      {/* Horizontal Track Wrapper */}
      <div className="relative w-full">
        <div 
          ref={horizontalRef} 
          className="flex gap-10 md:gap-14 px-[10vw] flex-nowrap items-center"
        >
          {TEAM.map((member, index) => (
            <div
              key={index}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="relative w-[70vw] md:w-[30vw] flex-shrink-0 group"
            >
              {/* Outer Shell (Double-Bezel) */}
              <div className="relative aspect-[4/5] p-1.5 rounded-[2.5rem] bg-white/5 border border-white/10 overflow-hidden group">
                
                {/* Inner Core (Parallax Image Placeholder) */}
                <div className="relative w-full h-full overflow-hidden rounded-[calc(2.5rem-0.375rem)]">
                  <div className="team-image-inner absolute top-0 left-[-25%] w-[150%] h-full">
                    {/* Background Color Fallback */}
                    <div className={`absolute inset-0 ${member.color}`}>
                      {member.image && (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover opacity-80"
                          sizes="(max-width: 768px) 70vw, 30vw"
                          priority={index < 4}
                        />
                      )}
                      {/* Modern Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    </div>
                  </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                  <div className="overflow-hidden">
                    <span className="block text-[10px] uppercase tracking-[0.4em] text-white/40 mb-1 transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-700">
                      {member.role}
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-2xl md:text-3xl font-light tracking-tight text-white transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-700 delay-75">
                      {member.name}
                    </h3>
                  </div>
                </div>

                {/* Subtle Highlight Lines */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
