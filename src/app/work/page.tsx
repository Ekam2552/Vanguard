"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLoading } from "@/context/LoadingContext";

import { WorkNav } from "@/components/WorkNav";
import { CategoriesGallery } from "@/sections/work/CategoriesGallery";
import { ResidencesCarousel } from "@/sections/work/ResidencesCarousel";

const SPACE_CATEGORIES = ["All", "Living", "Kitchen", "Bedroom", "Bathroom"];
const PROJECT_TYPE = "Complete Residences";

export default function Work() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoaded } = useLoading();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "expo.out",
          duration: 1.5
        }
      });

      tl.fromTo(
        ".work-title",
        { y: 60, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.8, ease: "power4.out" },
        0.2
      )
      .fromTo(
        ".work-subtitle",
        { y: 30, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out" },
        0.4
      )
      .fromTo(
        ".work-line",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 2, ease: "expo.inOut" },
        0.1
      )
      .fromTo(
        ".work-nav-item",
        { y: 20, opacity: 0, filter: "blur(4px)" },
        { 
          y: 0, 
          opacity: 1, 
          filter: "blur(0px)", 
          duration: 1.2, 
          stagger: 0.05, 
          ease: "power3.out" 
        },
        0.6
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <main ref={containerRef} className="relative w-full z-10 min-h-[100dvh] overflow-x-hidden pb-32">
      <div className="max-w-7xl mx-auto pt-48 px-4 md:px-12">
        <div className="mb-24 flex items-end justify-between border-b border-white/10 pb-12 relative work-header">
          {/* Animated Line */}
          <div className="absolute bottom-0 left-0 w-full h-px bg-white/10 origin-left work-line opacity-0" />
          
          <div className="overflow-hidden">
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter work-title opacity-0">
              Selected Works
            </h1>
          </div>
          
          <div className="overflow-hidden">
            <p className="hidden md:block text-white/40 max-w-xs text-sm work-subtitle opacity-0">
              An archive of our most defining spatial interventions.
            </p>
          </div>
        </div>

        <WorkNav 
          categories={SPACE_CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          projectType={PROJECT_TYPE}
        />
      </div>

      {/* GALLERY SECTIONS */}
      {activeCategory !== PROJECT_TYPE ? (
        <div className="max-w-7xl mx-auto px-4 md:px-12 mt-12">
          <CategoriesGallery activeCategory={activeCategory} />
        </div>
      ) : (
        <ResidencesCarousel />
      )}
    </main>
  );
}
