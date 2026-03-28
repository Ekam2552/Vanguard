"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

const TOP_BRANDS = [
  { name: "Architectural Digest", src: "/home/testimonials/ArchitecturalDigest.svg", w: 270, h: 20 },
  { name: "Vogue", src: "/home/testimonials/Vogue.svg", w: 120, h: 32 },
  { name: "Elle Decor", src: "/home/testimonials/ElleDecor.svg", w: 150, h: 35 },
  { name: "Wallpaper*", src: "/home/testimonials/WallpaperMagazine.svg", w: 140, h: 32 },
  { name: "Dwell", src: "/home/testimonials/Dwell.svg", w: 100, h: 38 },
];

const BOTTOM_BRANDS = [
  { name: "The Local Project", src: "/home/testimonials/TheLocalProject.svg", w: 180, h: 40 },
  { name: "Dezeen", src: "/home/testimonials/Dezeen.svg", w: 110, h: 36 },
  { name: "Design Milk", src: "/home/testimonials/DesignMilk.svg", w: 145, h: 50 },
  { name: "Livingetc", src: "/home/testimonials/LivingEtc.svg", w: 120, h: 36 },
  { name: "House & Garden", src: "/home/testimonials/HouseAndGarden.svg", w: 130, h: 36 },
];

const TESTIMONIAL_SETS = [
  {
    dark: "Vanguard doesn't just design rooms; they curate atmospheres that redefine the meaning of sanctuary.",
    gold: "The level of detail and material mastery is unmatched in the high-end residential space today."
  },
  {
    dark: "A masterclass in spatial choreography. Every sightline is calculated, yet feels deeply organic.",
    gold: "They transformed our penthouse into a living gallery. The restraint is just as powerful as the execution."
  },
  {
    dark: "Uncompromising quality. Vanguard speaks the language of understated luxury with absolute fluency.",
    gold: "A rare breed of designers who understand that true elegance whispers. The result is timeless."
  }
];

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const topPathRef = useRef<SVGPathElement>(null);
  const bottomPathRef = useRef<SVGPathElement>(null);
  const topLogosRef = useRef<HTMLDivElement>(null);
  const bottomLogosRef = useRef<HTMLDivElement>(null);
  const setsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add({
      isLargeDesktop: "(min-width: 1281px)",
      isTablet: "(min-width: 768px) and (max-width: 1280px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const { isLargeDesktop, isTablet, isMobile } = context.conditions as any;

      // 1. Initial State: Fade/Blur Up Section (Minus the center cards, which have their own loop)
      gsap.from(".pedigree-content", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        filter: "blur(12px)",
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.2,
      });

      // 1B. The Auto-Cycling GSAP Timeline
      const sliderTl = gsap.timeline({ repeat: -1, paused: true });

      setsRef.current.forEach((set, index) => {
        if (!set) return;
        const animLayers = set.querySelectorAll('.gsap-anim-layer');
        
        // Ensure all are hidden physically initially
        gsap.set(animLayers, { opacity: 0 });
        gsap.set(set, { pointerEvents: 'none' });

        // Entry
        sliderTl.add(() => { gsap.set(set, { pointerEvents: 'auto' }); }, index === 0 ? 0 : "+=0");
        sliderTl.fromTo(animLayers,
          { y: 80, opacity: 0, filter: "blur(12px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.4, ease: "power3.out", stagger: 0.15 },
          index === 0 ? 0 : "+=0" // Start perfectly when previous exits
        );

        // Dwell
        sliderTl.to({}, { duration: 5.5 });

        // Exit
        sliderTl.add(() => { gsap.set(set, { pointerEvents: 'none' }); });
        sliderTl.to(animLayers,
          { y: -60, opacity: 0, filter: "blur(8px)", duration: 1.2, ease: "power3.inOut", stagger: 0.1 }
        );
      });

      // Start slider when section enters viewport
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        onEnter: () => sliderTl.play(),
      });

      // 2. Infinity Carousel Logic: Top Path (Moving Left-to-Right)
      const topLogos = topLogosRef.current?.children;
      if (topLogos && topPathRef.current) {
        let topD = "M -500,-450 Q 735,1100 1970,-450"; // default curve
        if (isTablet) {
          topD = "M -500,20 L 1970,20"; // Tight to the 600px container
        } else if (isMobile) {
          topD = "M -500,20 L 1970,20"; // Tight to the 1000px container
        }
        topPathRef.current.setAttribute("d", topD);

        const logoArray = Array.from(topLogos);
        logoArray.forEach((logo, i) => {
          let duration = 25;
          if (isTablet) duration = 35; // Slower horizontal glide on tablet
          if (isMobile) duration = 15;

          gsap.timeline({
            repeat: -1,
            defaults: { ease: "none" }
          }).to(logo, {
            motionPath: {
              path: topPathRef.current!,
              align: topPathRef.current!,
              alignOrigin: [0.5, 0.5],
              start: i / logoArray.length,
              end: 1 + (i / logoArray.length),
            },
            duration: duration,
          });
        });
      }

      // 3. Infinity Carousel Logic: Bottom Path (Moving Right-to-Left)
      const bottomLogos = bottomLogosRef.current?.children;
      if (bottomLogos && bottomPathRef.current) {
        let bottomD = "M -500,1150 Q 735,-80 1970,1150"; // default curve
        if (isTablet) {
          bottomD = "M -500,630 L 1970,630"; // Container is 650px heights
        } else if (isMobile) {
          bottomD = "M -500,980 L 1970,980"; // Container is 1000px heights
        }
        bottomPathRef.current.setAttribute("d", bottomD);

        const logoArray = Array.from(bottomLogos);
        logoArray.forEach((logo, i) => {
          let duration = 30;
          if (isTablet) duration = 40;
          if (isMobile) duration = 18;

          gsap.timeline({
            repeat: -1,
            defaults: { ease: "none" }
          }).to(logo, {
            motionPath: {
              path: bottomPathRef.current!,
              align: bottomPathRef.current!,
              alignOrigin: [0.5, 0.5],
              start: 1 - (i / logoArray.length),
              end: 0 - (i / logoArray.length),
            },
            duration: duration,
          });
        });
      }

      return () => {
        sliderTl.kill();
      };
    }, sectionRef);

    return () => mm.revert();
  }, []);



  return (
    <section ref={sectionRef} className="testimonials-section relative z-20 bg-[#050505] w-full min-h-screen min-[1281px]:min-h-[180vh] py-32 flex flex-col items-center justify-between overflow-hidden">
      
      {/* ── TOP HEADING (Bold Tension) ── */}
      <div className="pedigree-content z-10 flex flex-col items-center gap-8 px-4 text-center mt-24">
        <span className="rounded-full border border-white/10 px-4 py-1 text-[10px] uppercase tracking-[0.4em] text-white/40">
          The Pedigree
        </span>
        <h2 className="max-w-7xl text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[0.9] uppercase px-4">
          Recognized <br /> 
          By The <span className="italic">Best</span>
        </h2>
      </div>

      {/* ── CURVED LOGO CAROUSELS & CENTER AREA ── */}
      <div className="relative w-full flex-none flex flex-col items-center justify-center h-[1000px] md:h-[650px] min-[1281px]:h-auto min-[1281px]:min-h-[800px] min-[1281px]:flex-1 my-12">
        
        {/* Invisible SVG Paths (The Rails) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible opacity-0">
          <path 
            ref={topPathRef} 
            d="M -500,-450 Q 735,1100 1970,-450" 
            fill="none" 
            id="topPath" 
          />
          <path 
            ref={bottomPathRef} 
            d="M -500,1150 Q 735,-80 1970,1150" 
            fill="none" 
            id="bottomPath" 
          />
        </svg>

        {/* Top Logo Container */}
        <div ref={topLogosRef} className="absolute inset-0 pointer-events-none">
          {TOP_BRANDS.map((brand, i) => (
            <div key={i} className="absolute flex items-center justify-center">
              <Image
                src={brand.src}
                alt={brand.name}
                width={brand.w}
                height={brand.h}
                className="opacity-20 brightness-0 invert"
                style={{ width: brand.w, height: brand.h }}
              />
            </div>
          ))}
        </div>

        {/* ── CENTER CARDS (3 Sets Stacked via CSS Grid + Auto-Cycling) ── */}
        <div className="relative z-10 grid grid-cols-1 grid-rows-1 place-items-center w-full px-6">
          {TESTIMONIAL_SETS.map((set, i) => (
            <div 
              key={i}
              ref={el => { setsRef.current[i] = el; }}
              className="col-start-1 row-start-1 flex flex-col md:flex-row gap-8 w-full justify-center"
            >
              {/* Dark Card */}
              <div className="gsap-anim-layer opacity-0">
                <div className="group relative w-full md:w-80 h-[400px] rounded-[2rem] bg-white/5 p-1.5 ring-1 ring-white/10 transition-transform duration-700 hover:scale-[1.02]">
                   <div className="h-full w-full rounded-[calc(2rem-0.375rem)] bg-[#1A1A1A] p-8 flex flex-col justify-end shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                     <div className="w-12 h-12 bg-indigo-500/20 rounded-full mb-6" />
                     <p className="text-sm text-white font-medium leading-relaxed italic">
                       "{set.dark}"
                     </p>
                   </div>
                </div>
              </div>
              
              {/* Gold Card */}
              <div className="gsap-anim-layer opacity-0">
                <div className="group relative w-full md:w-80 h-[400px] rounded-[2rem] bg-white/5 p-1.5 ring-1 ring-white/10 transition-transform duration-700 hover:scale-[1.02] md:translate-y-12">
                   <div className="h-full w-full rounded-[calc(2rem-0.375rem)] bg-[#946e47] p-8 flex flex-col justify-end shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                     <div className="w-12 h-12 bg-white/10 rounded-full mb-6" />
                     <p className="text-sm text-white font-medium leading-relaxed italic">
                       "{set.gold}"
                     </p>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Logo Container */}
        <div ref={bottomLogosRef} className="absolute inset-0 pointer-events-none">
          {BOTTOM_BRANDS.map((brand, i) => (
            <div key={i} className="absolute flex items-center justify-center">
              <Image
                src={brand.src}
                alt={brand.name}
                width={brand.w}
                height={brand.h}
                className="opacity-20 brightness-0 invert"
                style={{ width: brand.w, height: brand.h }}
              />
            </div>
          ))}
        </div>

      </div>

      {/* ── BOTTOM HEADING (Quote) ── */}
      <div className="pedigree-content z-10 flex flex-col items-center gap-6 px-4 text-center pb-24">
        <h3 className="max-w-2xl text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
          A Legacy of <br /> <span className="italic font-serif">Refined</span> Spaces
        </h3>
        <p className="max-w-md text-sm text-white/30 leading-relaxed">
          Through careful curation and obsessive attention to detail, we've established ourselves as the premier studio for architectural excellence.
        </p>
      </div>

    </section>
  );
}
