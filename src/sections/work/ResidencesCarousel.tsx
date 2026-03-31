"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import clsx from "clsx";
import { useLoading } from "@/context/LoadingContext";
import { useScroll } from "@/context/ScrollContext";
import { Portal } from "@/components/Portal";

interface ResidenceProject {
  id: string;
  title: string;
  subtitle: string;
  color: string;
}

const RESIDENCE_PROJECTS: ResidenceProject[] = [
  { id: "r1", title: "The Obsidian House", subtitle: "Reykjavík, Iceland", color: "bg-zinc-900" },
  { id: "r2", title: "Lumina Pavilion", subtitle: "Kyoto, Japan", color: "bg-stone-800" },
  { id: "r3", title: "Azure Cliff Villa", subtitle: "Amalfi Coast, Italy", color: "bg-blue-950" },
  { id: "r4", title: "Desert Monolith", subtitle: "Joshua Tree, USA", color: "bg-orange-950" },
  { id: "r5", title: "Emerald Canopy", subtitle: "Amazon Basin, Brazil", color: "bg-emerald-950" },
  { id: "r6", title: "Silicon Sanctuary", subtitle: "Palo Alto, USA", color: "bg-slate-900" },
  { id: "r7", title: "Marble Mirage", subtitle: "Oman Desert, Oman", color: "bg-neutral-800" },
  { id: "r8", title: "Echo Valley Lodge", subtitle: "Swiss Alps, Switzerland", color: "bg-cyan-950" },
  { id: "r9", title: "Zenith Penthouse", subtitle: "New York City, USA", color: "bg-indigo-950" },
  { id: "r10", title: "Boreal Retreat", subtitle: "Lofoten, Norway", color: "bg-gray-900" },
];

export const ResidencesCarousel = () => {
  const { isLoaded } = useLoading();
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    cardWidth: 500,
    cardHeight: 280,
    radius: 850,
    perspective: 2500
  });
  const [rotationY, setRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedResidence, setSelectedResidence] = useState<{ project: ResidenceProject; rect: DOMRect; i: number } | null>(null);
  
  const { lenis } = useScroll();
  const hasDragged = useRef(false);

  const itemCount = RESIDENCE_PROJECTS.length;
  const rotateStep = 360 / itemCount;

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      let config = { 
        width: w,
        cardWidth: 500, 
        cardHeight: 280, 
        radius: 850, 
        perspective: 2500 
      };

      if (w < 768) { // Mobile
        config = { 
          width: w,
          cardWidth: 180, 
          cardHeight: 110, 
          radius: 320, 
          perspective: 850 
        };
      } else if (w < 1024) { // Tablet
        config = { 
          width: w,
          cardWidth: 380, 
          cardHeight: 210, 
          radius: 600, 
          perspective: 1800 
        };
      }

      setDimensions(config);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Drag logic
  const dragX = useRef(0);
  const startX = useRef(0);

  useEffect(() => {
    if (!isLoaded) return;

    // Initial Entrance
    const ctx = gsap.context(() => {
      gsap.fromTo(".carousel-card", 
        { 
          y: 400, 
          opacity: 0, 
          rotateX: -20,
          scale: 0.8
        },
        { 
          y: 0, 
          opacity: 1, 
          rotateX: 0,
          scale: 1,
          duration: 1.5, 
          stagger: {
            each: 0.04,
            from: "center"
          },
          ease: "expo.out"
        }
      );
    }, stageRef);

    return () => ctx.revert();
  }, [isLoaded]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    hasDragged.current = false;
    startX.current = e.clientX;
    dragX.current = rotationY;
    if (ringRef.current) ringRef.current.style.cursor = "grabbing";
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    if (Math.abs(e.clientX - startX.current) > 5) {
      hasDragged.current = true;
    }
    
    const delta = (e.clientX - startX.current) * 0.2; // Sensitivity
    const newRotation = dragX.current + delta;
    
    gsap.to(ringRef.current, {
      rotationY: newRotation,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => setRotationY(gsap.getProperty(ringRef.current, "rotationY") as number)
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    if (ringRef.current) {
      ringRef.current.style.cursor = "grab";
      
      // Snapping Logic
      const snapRotation = Math.round(rotationY / rotateStep) * rotateStep;
      
      gsap.to(ringRef.current, {
        rotationY: snapRotation,
        duration: 0.8,
        ease: "back.out(1.2)", // Sophisticated snap-back
        onUpdate: () => setRotationY(gsap.getProperty(ringRef.current, "rotationY") as number)
      });
    }
  };

  return (
    <div 
      ref={stageRef}
      className="relative w-full h-[400px] md:h-[700px] flex items-center justify-center py-12 md:py-40 select-none touch-none bg-[#050505]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* 3D Container with Perspective */}
      <div 
        className="w-full h-full flex items-center justify-center"
        style={{ perspective: `${dimensions.perspective}px` }}
      >
        
        {/* The Rotating Ring */}
        <div 
          ref={ringRef}
          className="relative preserve-3d cursor-grab"
          style={{ 
            transformStyle: "preserve-3d",
            width: `${dimensions.cardWidth}px`,
            height: `${dimensions.cardHeight}px`
          }}
        >
          {RESIDENCE_PROJECTS.map((project, i) => {
            // Absolute rotation of the card in world space
            const worldRotation = rotationY + (i * rotateStep);
            
            // True Euclidean modulo for JS (handles negative infinite loops)
            const modRot = ((worldRotation % 360) + 360) % 360;
            // Map 0-360 back to -180 to 180 for proper left/right parallax and centering
            const relativeRotation = modRot > 180 ? modRot - 360 : modRot;
            
            const parallaxX = (relativeRotation / 180) * 100;
            const isCenter = Math.abs(relativeRotation) < 5;

            return (
              <div 
                key={project.id}
                className="absolute top-0 left-0"
                id={`card-${project.id}`}
                style={{
                  transform: `rotateY(${i * rotateStep}deg) translateZ(${dimensions.radius}px)`,
                  width: `${dimensions.cardWidth}px`,
                  height: `${dimensions.cardHeight}px`,
                  transformStyle: "preserve-3d",
                }}
              >
                <div 
                  className={clsx(
                    "carousel-card relative w-full h-full backface-hidden",
                    isCenter && "cursor-pointer"
                  )}
                  onPointerUp={(e) => {
                    if (!hasDragged.current && isCenter) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setSelectedResidence({ project, rect, i });
                    }
                  }}
                >
                  {/* DOUBLE-BEZEL ARCHITECTURE */}
                <div className={clsx(
                  "w-full h-full p-1.5 md:p-2 bg-white/5 ring-1 ring-white/10 rounded-2xl md:rounded-[2rem] overflow-hidden transition-all duration-700",
                  isCenter && "group hover:ring-white/20"
                )}>
                  <div className={clsx(
                    "w-full h-full rounded-[calc(1rem-0.125rem)] md:rounded-[calc(2rem-0.5rem)] relative overflow-hidden transition-transform duration-700 group-hover:scale-[1.03]",
                    project.color
                  )}>
                    {/* Content */}
                    <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end">
                      <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-white/40 mb-0.5 md:mb-2 font-medium leading-none">Residence 0{i + 1}</p>
                      <h3 className="text-sm md:text-2xl font-light tracking-tight text-white mb-0.5 md:mb-1 leading-none">{project.title}</h3>
                      <p className="text-[10px] md:text-xs text-white/30 font-light italic leading-none">{project.subtitle}</p>
                    </div>
                  </div>
                </div>
                
                  {/* AMBIENT SHADOW BELOW */}
                  <div 
                    className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/40 blur-2xl rounded-full opacity-60" 
                    style={{ transform: "rotateX(90deg)" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DRAG INSTRUCTION */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 group">
        <div className="w-40 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.4em] font-light">Drag to explore</span>
      </div>

      {/* FULL SCREEN MODAL PORTAL */}
      {selectedResidence && (
        <Portal>
          <ResidenceModal 
            selectedResidence={selectedResidence} 
            onClose={() => setSelectedResidence(null)} 
          />
        </Portal>
      )}
    </div>
  );
};

const ResidenceModal = ({ 
  selectedResidence, 
  onClose 
}: { 
  selectedResidence: { project: ResidenceProject; rect: DOMRect; i: number }; 
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { lenis } = useScroll();
  
  useEffect(() => {
    if (lenis) {
      lenis.stop();
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (lenis) {
        lenis.start();
        document.body.style.overflow = "unset";
      }
    };
  }, [lenis]);

  const { rect } = selectedResidence;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const cardWidth = isMobile ? 180 : (typeof window !== "undefined" && window.innerWidth < 1024 ? 380 : 500);
  const scale = rect.width / cardWidth;

  const startProps = {
      padding: (isMobile ? 16 : 32) * scale,
      residenceSize: (isMobile ? 8 : 10) * scale,
      residenceMb: (isMobile ? 2 : 8) * scale,
      titleSize: (isMobile ? 14 : 24) * scale,
      titleMb: (isMobile ? 2 : 4) * scale,
      subtitleSize: (isMobile ? 10 : 12) * scale,
      outerRadius: (isMobile ? 16 : 32) * scale,
      innerRadius: (isMobile ? 14 : 24) * scale,
      mediaPadding: (isMobile ? 6 : 8) * scale
  };

  useEffect(() => {
    
    const ctx = gsap.context(() => {
      const targetWidth = window.innerWidth;
      const targetHeight = window.innerHeight;

      // Hide original card immediately on expansion start to avoid the flash hole
      gsap.set(`#card-${selectedResidence.project.id}`, { opacity: 0 });

      // Background Fade
      gsap.fromTo(".modal-bg", 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      // Expansion from Source bounding client rect
      gsap.fromTo(heroRef.current, 
        {
          position: "absolute",
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: `${startProps.outerRadius}px`,
          padding: `${startProps.mediaPadding}px`,
          margin: 0,
        },
        {
          top: 0,
          left: 0,
          width: targetWidth,
          height: targetHeight,
          borderRadius: "0px",
          padding: "0px",
          duration: 1.2,
          ease: "custom-expo",
        }
      );

      // Inner Image Expansion to remove the Bezel dynamically
      gsap.fromTo(".modal-inner-media",
         { borderRadius: `${startProps.innerRadius}px` },
         { borderRadius: "0px", duration: 1.2, ease: "custom-expo" }
      );

      // Seamless Text Morph Sequence
      gsap.fromTo(".modal-text-container",
        { padding: `${startProps.padding}px`, opacity: 1 },
        { padding: isMobile ? "32px" : "64px", duration: 1.2, ease: "custom-expo" }
      );
      
      gsap.fromTo(".modal-text-residence",
        { fontSize: `${startProps.residenceSize}px`, marginBottom: `${startProps.residenceMb}px` },
        { fontSize: isMobile ? "10px" : "14px", marginBottom: isMobile ? "8px" : "16px", duration: 1.2, ease: "custom-expo" }
      );
      
      gsap.fromTo(".modal-text-title",
        { fontSize: `${startProps.titleSize}px`, marginBottom: `${startProps.titleMb}px` },
        { fontSize: isMobile ? "36px" : "64px", marginBottom: isMobile ? "8px" : "16px", duration: 1.2, ease: "custom-expo" }
      );
      
      gsap.fromTo(".modal-text-subtitle",
        { fontSize: `${startProps.subtitleSize}px` },
        { fontSize: isMobile ? "14px" : "20px", duration: 1.2, ease: "custom-expo" }
      );

      // Close Button
      gsap.fromTo(".modal-close", 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, delay: 0.8, duration: 0.8, ease: "back.out(2)" }
      );
      
      // Bottom detail reveal
      gsap.fromTo(".modal-extra-content",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.9, ease: "power3.out" }
      );
    });

    gsap.registerEase("custom-expo", (progress: number) => {
      return progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    });

    return () => ctx.revert();
  }, [selectedResidence]);

  const handleClose = () => {
    // Reverse animations precisely using calculated scale projections via overwrite to kill ongoing delayed tweens
    gsap.to(heroRef.current, {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      borderRadius: `${startProps.outerRadius}px`,
      padding: `${startProps.mediaPadding}px`,
      duration: 0.8,
      ease: "power3.inOut",
      overwrite: true,
      onComplete: () => {
        // Hide the clone instantly to prevent double-layering with the original
        gsap.set(heroRef.current, { opacity: 0 });
        // Restore original card visibility once clone is visually hidden
        gsap.set(`#card-${selectedResidence.project.id}`, { opacity: 1 });
        onClose();
      }
    });

    gsap.to(".modal-inner-media", {
       borderRadius: `${startProps.innerRadius}px`,
       duration: 0.8,
       ease: "power3.inOut",
       overwrite: true
    });

    gsap.to(".modal-gloss", { opacity: 0, duration: 0.8, ease: "power3.inOut", overwrite: true });

    gsap.to(".modal-text-container", { padding: `${startProps.padding}px`, duration: 0.8, ease: "power3.inOut", overwrite: true });
    gsap.to(".modal-text-residence", { fontSize: `${startProps.residenceSize}px`, marginBottom: `${startProps.residenceMb}px`, duration: 0.8, ease: "power3.inOut", overwrite: true });
    gsap.to(".modal-text-title", { fontSize: `${startProps.titleSize}px`, marginBottom: `${startProps.titleMb}px`, duration: 0.8, ease: "power3.inOut", overwrite: true });
    gsap.to(".modal-text-subtitle", { fontSize: `${startProps.subtitleSize}px`, duration: 0.8, ease: "power3.inOut", overwrite: true });

    gsap.to(".modal-bg, .modal-close, .modal-extra-content", { opacity: 0, duration: 0.3, overwrite: true });
  };

  return (
    <div ref={modalRef} className="fixed inset-0 z-[100] overflow-y-auto no-scrollbar" data-lenis-prevent="true">
      {/* BACKDROP */}
      <div 
        className="modal-bg fixed inset-0 bg-[#050505] cursor-zoom-out"
        onClick={handleClose}
      />

      {/* spacer to force height below the absolute hero */}
      <div className="w-full h-[100vh] relative pointer-events-none" />

      {/* EXPANDING HERO */}
      <div 
        ref={heroRef}
        className="absolute z-10 overflow-hidden shadow-2xl bg-white/5 ring-1 ring-white/10"
      >
        <div className={clsx(
          "modal-inner-media w-full h-full relative overflow-hidden",
          selectedResidence.project.color
        )}>
           {/* Repositioned Typography */}
           <div className="modal-text-container absolute bottom-0 left-0 flex flex-col justify-end w-full max-w-5xl will-change-transform">
             <p className="modal-text-residence uppercase tracking-[0.3em] text-white/40 font-medium whitespace-nowrap leading-none transform-gpu" style={{ WebkitFontSmoothing: 'antialiased' }}>Residence 0{selectedResidence.i + 1}</p>
             <h2 className="modal-text-title font-light tracking-tight text-white whitespace-normal leading-none transform-gpu" style={{ WebkitFontSmoothing: 'antialiased' }}>{selectedResidence.project.title}</h2>
             <p className="modal-text-subtitle text-white/30 font-light italic whitespace-nowrap leading-none transform-gpu" style={{ WebkitFontSmoothing: 'antialiased' }}>{selectedResidence.project.subtitle}</p>
           </div>
        </div>
      </div>

      {/* CLOSE CORNER */}
      <button 
        onClick={handleClose}
        className="modal-close fixed top-8 right-8 md:top-12 md:right-12 z-50 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center group overflow-hidden cursor-pointer"
      >
        <div className="relative z-10 font-light text-xl transition-transform duration-500 group-hover:rotate-90">✕</div>
        <div className="absolute inset-0 bg-neutral-200 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 origin-center" />
      </button>

      {/* SCROLLABLE PROJECT DETAILS */}
      <div className="modal-extra-content relative z-10 w-full min-h-[100vh] bg-[#050505] flex items-center justify-center border-t border-white/5">
         <div className="text-center max-w-xl px-4">
            <h3 className="text-sm md:text-2xl font-light text-white/30 tracking-widest uppercase mb-8">Spatial Narrative</h3>
            <p className="text-lg md:text-2xl font-light text-white/60 leading-relaxed">
              Every curve, texture, and shadow in the {selectedResidence.project.title} was engineered to evoke a sense of grounding and architectural permanence.
            </p>
         </div>
      </div>
    </div>
  );
};
