"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MasonryGrid } from "@/components/work/MasonryGrid";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

import { useLoading } from "@/context/LoadingContext";
import { useScroll } from "@/context/ScrollContext";
import { Portal } from "@/components/Portal";

interface CategoryProject {
  id: string;
  title: string;
  color: string;
}

const DUMMY_PROJECTS: Record<string, CategoryProject[]> = {
  All: [
    { id: "1", title: "Project Alpha", color: "bg-blue-900/20" },
    { id: "2", title: "Project Beta", color: "bg-purple-900/20" },
    { id: "3", title: "Project Gamma", color: "bg-emerald-900/20" },
    { id: "4", title: "Project Delta", color: "bg-amber-900/20" },
    { id: "5", title: "Project Epsilon", color: "bg-rose-900/20" },
    { id: "6", title: "Project Zeta", color: "bg-cyan-900/20" },
    { id: "7", title: "Project Eta", color: "bg-indigo-900/20" },
    { id: "8", title: "Project Theta", color: "bg-teal-900/20" },
  ],
  Living: [
    { id: "l1", title: "Modern Lounge", color: "bg-slate-800/40" },
    { id: "l2", title: "Minimalist Hall", color: "bg-zinc-800/40" },
    { id: "l3", title: "The Hearth", color: "bg-neutral-800/40" },
  ],
  Kitchen: [
    { id: "k1", title: "Chef's Dream", color: "bg-stone-800/40" },
    { id: "k2", title: "Stone Island", color: "bg-orange-950/20" },
  ],
  Bedroom: [
    { id: "b1", title: "Quiet Sanctuary", color: "bg-sky-950/20" },
    { id: "b2", title: "Velvet Suite", color: "bg-violet-950/20" },
  ],
  Bathroom: [
    { id: "ba1", title: "Marble Spa", color: "bg-teal-950/20" },
  ],
};

interface CategoriesGalleryProps {
  activeCategory: string;
}

const ProjectCard = ({ 
  project, 
  index, 
  onSelect 
}: { 
  project: CategoryProject; 
  index: number; 
  onSelect: (e: React.MouseEvent) => void;
}) => {
  return (
    <div 
      className="gallery-item opacity-0 w-full h-full p-2 group cursor-pointer"
      onClick={onSelect}
    >
      {/* DOUBLE-BEZEL ARCHITECTURE */}
      <div className="relative w-full h-full rounded-[2.5rem] bg-white/5 ring-1 ring-white/10 p-2 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-white/[0.08] group-hover:ring-white/20">
        <div className={clsx(
          "w-full h-full rounded-[calc(2.5rem-0.5rem)] flex flex-col items-center justify-center p-8 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]",
          project.color
        )}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 mb-2">0{index + 1}</span>
          <h3 className="text-xl font-light tracking-tight text-white/60 group-hover:text-white transition-colors duration-500">
            {project.title}
          </h3>
        </div>
        
        {/* INNER GLOSS SHINE */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>
    </div>
  );
};

export const CategoriesGallery = ({ activeCategory }: CategoriesGalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useLoading();
  const { lenis } = useScroll();
  const [selectedProject, setSelectedProject] = useState<{ project: CategoryProject; rect: DOMRect } | null>(null);
  
  const projects = DUMMY_PROJECTS[activeCategory] || DUMMY_PROJECTS["All"];

  const handleSelect = (e: React.MouseEvent, project: CategoryProject) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setSelectedProject({ project, rect });
  };

  useEffect(() => {
    if (!lenis || !isLoaded) return;
    
    if (selectedProject) {
      lenis.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis.start();
      document.body.style.overflow = "unset";
    }
    
    return () => {
      lenis.start();
      document.body.style.overflow = "unset";
    };
  }, [selectedProject, lenis, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (selectedProject) return; 

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray(".gallery-item");
      
      items.forEach((item: any, i: number) => {
        gsap.fromTo(
          item,
          { 
            y: 30, 
            opacity: 0, 
            filter: "blur(8px)",
            scale: 0.98
          },
          { 
            y: 0, 
            opacity: 1, 
            filter: "blur(0px)", 
            scale: 1,
            duration: 1.2, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 92%", // Reveal slightly before it fully enters
              toggleActions: "play none none none",
              once: true,
            }
          }
        );
      });
    }, containerRef);

    // Refresh ScrollTrigger as masonry layouts can shift dimensions
    setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [activeCategory, isLoaded]); // RE-RUN ON CATEGORY CHANGE OR LOAD SUCCESS

  return (
    <section ref={containerRef} className="w-full mt-12 pb-24">
      <MasonryGrid 
        items={projects}
        renderItem={(project, index) => (
          <ProjectCard 
            project={project} 
            index={index} 
            onSelect={(e) => handleSelect(e, project)} 
          />
        )}
      />

      {/* MODAL OVERLAY */}
      {selectedProject && (
        <Portal>
          <Modal 
            selectedProject={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        </Portal>
      )}
    </section>
  );
};

const Modal = ({ 
  selectedProject, 
  onClose 
}: { 
  selectedProject: { project: CategoryProject; rect: DOMRect }; 
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { rect } = selectedProject;
    
    const ctx = gsap.context(() => {
      // Calculate exact center coordinates to avoid percentage-based interpolation warping
      const targetWidth = Math.min(window.innerWidth * 0.9, 1200);
      const targetHeight = window.innerHeight * 0.7;
      const targetLeft = (window.innerWidth - targetWidth) / 2;
      const targetTop = (window.innerHeight - targetHeight) / 2;

      // Background Fade
      gsap.fromTo(".modal-bg", 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      // Expansion from Source
      gsap.fromTo(contentRef.current, 
        {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: "2.5rem",
          xPercent: 0,
          yPercent: 0,
          margin: 0,
        },
        {
          top: targetTop,
          left: targetLeft,
          width: targetWidth,
          height: targetHeight,
          borderRadius: "4rem",
          duration: 1.2,
          ease: "custom-expo",
        }
      );

      // Content Reveal
      gsap.fromTo(".modal-content-inner", 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, delay: 0.8, duration: 0.8, ease: "power3.out" }
      );

      // Close Button
      gsap.fromTo(".modal-close", 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 1, scale: 1, delay: 1, duration: 0.6, ease: "back.out(2)" }
      );
    });

    // Custom Ease for that "Viscous" feel
    gsap.registerEase("custom-expo", (progress: number) => {
      return progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    });

    return () => ctx.revert();
  }, [selectedProject]);

  const handleClose = () => {
    const { rect } = selectedProject;
    
    gsap.to(contentRef.current, {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      borderRadius: "2.5rem",
      duration: 0.8,
      ease: "power4.inOut",
      onComplete: onClose
    });

    gsap.to(".modal-bg", { opacity: 0, duration: 0.6 });
    gsap.to(".modal-content-inner, .modal-close", { opacity: 0, duration: 0.4 });
  };

  return (
    <div ref={modalRef} className="fixed inset-0 z-[100]">
      {/* BACKDROP */}
      <div 
        className="modal-bg absolute inset-0 bg-black/80 backdrop-blur-3xl cursor-zoom-out"
        onClick={handleClose}
      />

      {/* EXPANDING CONTAINER */}
      <div 
        ref={contentRef}
        className="fixed bg-white/5 ring-1 ring-white/10 p-4 shadow-2xl overflow-hidden"
      >
        <div className={clsx(
          "modal-content-inner w-full h-full rounded-[3.5rem] flex flex-col items-center justify-center p-12",
          selectedProject.project.color
        )}>
          <span className="text-xs uppercase tracking-[0.5em] text-white/20 mb-4">Case Study</span>
          <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-white">
            {selectedProject.project.title}
          </h2>
          <div className="mt-12 max-w-lg text-center text-white/40 leading-relaxed font-light">
            An immersive spatial narrative exploring the intersection of form, function, and Vanguard's architectural signature. 
          </div>
        </div>

        {/* CLOSE BUTTON */}
        <button 
          onClick={handleClose}
          className="modal-close absolute top-12 right-12 w-16 h-16 rounded-full bg-white text-black flex items-center justify-center group overflow-hidden cursor-pointer"
        >
          <div className="relative z-10 font-light text-xl transition-transform duration-500 group-hover:rotate-90">✕</div>
          <div className="absolute inset-0 bg-neutral-200 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 origin-center" />
        </button>
      </div>
    </div>
  );
};
