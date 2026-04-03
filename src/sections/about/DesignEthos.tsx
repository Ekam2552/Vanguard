"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CARDS = [
  {
    id: "01",
    label: "Materiality",
    title: "Commitment to \nAuthentic Substance.",
    p1: "Our designs are rooted in the honesty of the physical world. We reject the synthetic in favor of rare stone, hand-woven silk, and reclaimed timber—materials that carry history in their grain.",
    p2: "Every slab of marble is hand-selected; every bolt of fabric is felt for its specific weight and drape. We believe luxury is tactile, not just visual.",
    bg: "bg-[#050505]", // EXACT MATCH with global background
  },
  {
    id: "02",
    label: "Tailored Experience",
    title: "Bespoke is the \nOnly Dialect.",
    p1: "At Vanguard, nothing is off-the-shelf. We treat every structure as a one-of-one composition, precisely engineered for the specific life that will inhabit it.",
    p2: "From custom-cast metallic hardware to zero-sightline cabinetry, every detail is a conversation between our studio and the client's unique rhythm.",
    bg: "bg-[#080808]",
  },
  {
    id: "03",
    label: "Global Sourcing",
    title: "Artisans Without \nBorders.",
    p1: "True quality requires searching the edges of the map. We maintain a network of master craftsmen, international stone-yards, and hidden galleries spanning four continents.",
    p2: "Whether it's Murano glass-blowers or Kyoto joinery experts, we bring the world's most elite skills to your single-site sanctuary.",
    bg: "bg-[#050505]", // Reset to base black for seamless transition to Team section
  },
];

export function DesignEthos() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      
      // 1. INITIAL REVEAL (CARD 01)
      // We trigger this as the section enters view, NOT when it pins
      if (cards[0]) {
        gsap.fromTo(
          cards[0].querySelectorAll(".ethos-text"),
          { y: 40, opacity: 0, filter: "blur(12px)" },
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
              toggleActions: "play none none none"
            }
          }
        );
      }

      // 2. PINNED STACKING TIMELINE (CARDS 02 & 03)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%", // Adjusted for the 2 interactive cards
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });

      // CARDS 2 & 3 STACKING
      [cards[1], cards[2]].forEach((card, i) => {
        if (!card) return;
        const index = i + 1; // Actual index in the full array

        // Card Slide Up
        tl.fromTo(card, 
          { yPercent: 100 },
          { 
            yPercent: 0, 
            ease: "none",
          },
          i * 1.5 // Space out the scrub
        );

        // Text reveal synced with slide
        tl.fromTo(card.querySelectorAll(".ethos-text"),
          { y: 40, opacity: 0, filter: "blur(12px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out"
          },
          i * 1.5 + 0.4
        );

        // Previous Card Scale/Dim
        const prevCard = cards[index - 1];
        if (prevCard) {
          tl.to(prevCard, {
            scale: 0.95,
            opacity: 0.5,
            filter: "blur(8px)",
            ease: "none",
          }, i * 1.5);
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-[#050505]">
      {/* Cards Container */}
      <div ref={containerRef} className="relative w-full h-screen">
        {CARDS.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => { cardsRef.current[index] = el; }}
            className={`absolute inset-0 w-full h-full flex flex-col justify-center ${index === 0 ? "" : "border-t border-white/5"} ${item.bg} z-[${index + 10}]`}
          >
            {/* GRID CONTENT */}
            <div className="max-w-[1400px] mx-auto w-full px-6 md:px-0">
              <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-y-12">
                
                {/* LEFT: INDEX + HEADING */}
                <div className="col-span-12 md:col-start-2 md:col-span-11 xl:col-start-2 xl:col-span-5 flex flex-col gap-8">
                  <div className="flex items-center gap-6 ethos-text">
                    <span className="text-white/20 text-7xl md:text-[8vw] font-light tracking-tighter leading-none italic">
                      {item.id}
                    </span>
                    <span className="block h-px w-12 bg-white/10 hidden md:block" />
                    <span className="block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em] font-medium border border-white/10 bg-white/5 text-white/50">
                      {item.label}
                    </span>
                  </div>
                  
                  <h2 className="ethos-text text-5xl md:text-7xl lg:text-[5vw] font-light tracking-tighter leading-[0.9] text-white whitespace-pre-line">
                    {item.title}
                  </h2>
                </div>

                {/* RIGHT: COPY */}
                <div className="col-span-12 md:col-start-2 md:col-span-10 xl:col-start-8 xl:col-span-4 flex flex-col gap-10">
                  <div className="ethos-text space-y-8">
                    <p className="text-xl md:text-2xl font-light leading-snug text-white/80">
                      {item.p1}
                    </p>
                    <div className="w-12 h-px bg-white/30" />
                    <p className="text-base font-light leading-relaxed text-white/40">
                      {item.p2}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* DECORATIVE HAIRLINE SIDES (Full Bleed Definition) */}
            <div className="absolute inset-y-0 left-0 w-px bg-white/5" />
            <div className="absolute inset-y-0 right-0 w-px bg-white/5" />
          </div>
        ))}
      </div>
    </section>
  );
}
