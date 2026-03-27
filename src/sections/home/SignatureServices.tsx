"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

const SERVICES = [
  {
    num: "01",
    title: "Interior\nArchitecture",
    desc: "Strategic structural interventions and spatial planning that redefine the skeletal essence of luxury environments.",
    img: "/home/signatureServices/InteriorArchitecture.png",
  },
  {
    num: "02",
    title: "Bespoke\nFurnishings",
    desc: "Curated material palettes and custom-tailored furniture pieces designed to exist in silent dialogue with the architecture.",
    img: "/home/signatureServices/BespokeFurnishings.png",
  },
  {
    num: "03",
    title: "Turnkey\nStyling",
    desc: "A masterclass in detail — atmospheric finishing and art curation that transforms a space into a living narrative.",
    img: "/home/signatureServices/TurnkeyStyling.png",
  }
];

export function SignatureServices() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (triggerRef.current && panelsRef.current) {
        // Pin the signature services trigger section for a brief dwell
        ScrollTrigger.create({
          trigger: triggerRef.current,
          start: "top top",
          end: "+=100%",
          pin: true,
        });

        // Show/hide the fixed panels
        ScrollTrigger.create({
          trigger: triggerRef.current,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => gsap.set(panelsRef.current, { autoAlpha: 1 }),
          onEnterBack: () => gsap.set(panelsRef.current, { autoAlpha: 1 }),
          onLeaveBack: () => gsap.set(panelsRef.current, { autoAlpha: 0 }),
        });

        // Hide panels once the testimonials section fully covers the viewport
        ScrollTrigger.create({
          trigger: ".testimonials-section",
          start: "top top",
          onEnter: () => gsap.set(panelsRef.current, { autoAlpha: 0 }),
          onLeaveBack: () => gsap.set(panelsRef.current, { autoAlpha: 1 }),
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── SIGNATURE SERVICES PANELS (Fixed Position — revealed by z-index layering) ── */}
      <div
        ref={panelsRef}
        className="fixed inset-0 z-[5] flex flex-col md:flex-row invisible opacity-0"
        style={{ pointerEvents: "none" }}
      >
        {SERVICES.map((service, i) => (
          <div
            key={i}
            onClick={() => {
              // Only trigger active state on mobile/tablet (touch devices)
              if (window.innerWidth < 1281) {
                setActivePanel(activePanel === i ? null : i);
              }
            }}
            data-active={activePanel === i}
            className="group relative h-1/3 w-full overflow-hidden border-b border-white/5 md:h-full md:w-1/3 md:border-b-0 md:border-r bg-neutral-900 pointer-events-auto cursor-pointer"
          >
            <Image
              src={service.img}
              alt={service.title.replace('\n', ' ')}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={i === 0}
              className="object-cover scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-100 group-data-[active=true]:scale-100"
            />
            
            {/* Base Overlay */}
            <div className="absolute inset-0 bg-black/40 transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-black/70 group-data-[active=true]:bg-black/70" />
            {/* Subtle vignette for depth */}
            <div className="absolute inset-0 bg-gradient-to-tr md:bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            
            {/* Content Container */}
            <div className="absolute inset-0 flex flex-row items-center justify-between p-8 md:flex-col md:items-start md:justify-end md:p-12">
              
              {/* Desktop Number (Hidden on mobile) */}
              <span className="
                hidden md:block
                relative mb-4
                text-[10px] uppercase tracking-[0.5em] text-white/30 
                transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] 
                md:group-hover:-translate-y-8 md:group-hover:opacity-0
                md:group-data-[active=true]:-translate-y-8 md:group-data-[active=true]:opacity-0
              ">
                {service.num}
              </span>
              
              {/* Content Wrapper */}
              <div className="
                flex w-full flex-row items-center justify-between 
                md:block md:w-auto
                transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] 
                md:group-hover:-translate-y-16 md:group-data-[active=true]:-translate-y-16
              ">
                
                {/* Heading & Mobile Number Group */}
                <div className="flex items-start gap-4 transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-4 md:group-hover:translate-x-0 group-data-[active=true]:-translate-x-4 md:group-data-[active=true]:translate-x-0">
                  {/* Mobile Number */}
                  <span className="
                    block md:hidden
                    mt-1.5
                    text-[9px] uppercase tracking-[0.5em] text-white/30 
                    transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] 
                    group-hover:-translate-x-4 group-hover:opacity-0
                    group-data-[active=true]:-translate-x-4 group-data-[active=true]:opacity-0
                  ">
                    {service.num}
                  </span>
                  
                  {/* Heading */}
                  <h3 className="text-xl font-light tracking-tight text-white md:text-3xl lg:text-4xl leading-tight whitespace-pre-line">
                    {service.title}
                  </h3>
                </div>
                
                {/* Paragraph */}
                <p className="
                  text-xs text-white/50 leading-relaxed md:text-sm md:mt-6
                  max-w-[150px] text-left md:max-w-[280px] md:text-left
                  opacity-0 
                  translate-x-8 md:translate-x-0 md:translate-y-8
                  transition-all duration-700 delay-100 ease-[cubic-bezier(0.32,0.72,0,1)] 
                  group-hover:opacity-100 group-hover:translate-x-0 md:group-hover:translate-y-0
                  group-data-[active=true]:opacity-100 group-data-[active=true]:translate-x-0 md:group-data-[active=true]:translate-y-0
                ">
                  {service.desc}
                </p>
                
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── SIGNATURE SERVICES TRIGGER SECTION (z-1 — reveals fixed panels behind, pinned briefly) ── */}
      <section
        ref={triggerRef}
        className="relative z-[1] h-[50vh] pointer-events-none"
      />
    </>
  );
}
