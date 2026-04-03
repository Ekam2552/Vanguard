"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const IMAGES = [
  {
    src: "/about/manifesto-2.png", // Sculptural (Tall)
    alt: "Sculptural chair in a high-ceilinged concrete room",
    gridClass: "col-span-12 md:col-start-8 md:col-end-13 self-start",
    aspect: "aspect-[16/10] md:aspect-[4/4.2]"
  },
  {
    src: "/about/manifesto-1.png", // Minimalist (Wide)
    alt: "Minimalist stone corridor with dramatic lighting",
    gridClass: "col-span-12 md:col-start-1 md:col-end-7 z-10",
    aspect: "aspect-[16/10] md:aspect-[4/3]"
  }
];

export function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. ROW 1 TIMELINE (TEXT + IMAGE 1)
      if (row1Ref.current) {
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: row1Ref.current,
            start: "top 85%", // Slightly earlier for mobile
            toggleActions: "play none none none"
          }
        });

        tl1.fromTo(
          row1Ref.current.querySelectorAll(".row-1-text"),
          { y: 40, opacity: 0, filter: "blur(12px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.4,
            stagger: 0.1,
            ease: "expo.out"
          }
        );

        tl1.fromTo(
          row1Ref.current.querySelector(".bezel-inner-wrapper"),
          { clipPath: "inset(0 100% 0 0)" },
          { 
            clipPath: "inset(0 0% 0 0%)", 
            duration: 1.4,
            ease: "expo.inOut"
          },
          "<0.1"
        );
      }

      // 2. ROW 2 TIMELINE (IMAGE 2 + QUOTE)
      if (row2Ref.current) {
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: row2Ref.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });

        tl2.fromTo(
          row2Ref.current.querySelector(".bezel-inner-wrapper"),
          { clipPath: "inset(0 0% 0 100%)" },
          { 
            clipPath: "inset(0 0% 0 0%)", 
            duration: 1.4,
            ease: "expo.inOut"
          }
        );

        tl2.fromTo(
          row2Ref.current.querySelectorAll(".row-2-text"),
          { y: 30, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out"
          },
          "<0.1"
        );
      }

      // 3. PARALLAX
      const innerImages = gsap.utils.toArray(".bezel-inner-image");
      innerImages.forEach((img: any) => {
        gsap.to(img, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-24 md:py-40 overflow-hidden bg-[#050505] px-6 md:px-12 xl:px-0">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-20 md:gap-y-32 items-start">
          
          {/* ROW 1: TEXT + IMAGE 1 */}
          <div ref={row1Ref} className="col-span-12 grid grid-cols-1 md:grid-cols-12 items-start gap-y-12 md:gap-0">
            <div className="col-span-12 md:col-start-1 md:col-span-5 flex flex-col justify-start pt-4">
              <span className="row-1-text block rounded-full px-3 py-1 text-[10px] w-max uppercase tracking-[0.3em] font-medium border border-white/10 bg-white/5 mb-6 md:mb-8">
                The Manifesto
              </span>
              <h2 className="row-1-text text-4xl md:text-7xl lg:text-[6.2vw] font-light tracking-tighter leading-none md:leading-[0.9] text-white mb-8 md:mb-10">
                Rejecting the <br className="hidden md:block" /> 
                <span className="italic text-white/40 md:ml-0">Mundane.</span>
              </h2>
              <div className="space-y-6 md:space-y-8">
                <p className="row-1-text text-lg md:text-2xl font-light leading-snug text-white/80">
                  At Julian Vanguard Studio, we believe architecture is the silent language of memory. 
                  We don’t merely inhabit rooms; we exist within dialogues of shadow and stone.
                </p>
                <div className="row-1-text w-12 h-px bg-white/30" />
                <p className="row-1-text text-sm md:text-base font-light leading-relaxed text-white/40 max-w-sm">
                  Our method is reductive by necessity. We strip away the non-essential until only the pure geometry is left to capture the light. The result isn’t just luxury—it is permanence.
                </p>
              </div>
            </div>

            <div className="col-span-12 md:col-start-7 md:col-span-6 image-reveal-block relative flex items-start">
              <div className={`bezel-inner-wrapper relative w-full rounded-[2.5rem] md:rounded-l-[4rem] bg-[#111] overflow-hidden z-10 ${IMAGES[0].aspect}`}>
                <Image
                  src={IMAGES[0].src}
                  alt={IMAGES[0].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="bezel-inner-image object-cover scale-110 opacity-70 group-hover:opacity-100 transition-opacity duration-1000"
                />
              </div>
            </div>
          </div>

          {/* ROW 2: IMAGE 2 + QUOTE */}
          <div ref={row2Ref} className="col-span-12 grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-0 items-center">
            <div className="col-span-12 md:col-start-1 md:col-span-7 image-reveal-block relative flex items-center order-2 md:order-1">
              <div className={`bezel-inner-wrapper relative w-full rounded-[2.5rem] md:rounded-r-[4rem] bg-[#111] overflow-hidden z-10 ${IMAGES[1].aspect}`}>
                <Image
                  src={IMAGES[1].src}
                  alt={IMAGES[1].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="bezel-inner-image object-cover scale-110 opacity-70 group-hover:opacity-100 transition-opacity duration-1000"
                />
              </div>
            </div>

            <div className="col-span-12 md:col-start-8 md:col-span-5 px-0 md:px-12 flex flex-col gap-6 order-1 md:order-2 mb-8 md:mb-0">
              <blockquote className="row-2-text text-xl md:text-3xl font-light italic tracking-tight text-white/60">
                &ldquo;True opulence isn’t found in what is added, but in what cannot be removed.&rdquo;
              </blockquote>
              <div className="row-2-text flex items-center gap-4">
                <div className="w-8 h-px bg-white/10" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/30">Julian Vanguard</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
