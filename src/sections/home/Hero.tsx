"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/Button";
import Image from "next/image";
import { useLoading } from "@/context/LoadingContext";

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoOverlayRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const metaFrameRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const philosophyImageWrapperRef = useRef<HTMLDivElement>(null);
  const philosophyImageRef = useRef<HTMLDivElement>(null);

  // Helper to split text into words for GSAP highlight
  const splitText = (text: string) => {
    return text.split(" ").map((word, i) => (
      <span key={i} className="philosophy-word inline-block mr-[0.25em] opacity-20 transition-colors duration-300">
        {word}
      </span>
    ));
  };

  useEffect(() => {
    // --- Mouse Parallax on video ---
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 30;
      const y = (clientY / window.innerHeight - 0.5) * 30;

      if (parallaxRef.current) {
        gsap.to(parallaxRef.current, {
          x,
          y,
          duration: 1.2,
          ease: "power2.out",
        });
      }

      // Subtle glow follows mouse
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: x * 0.5,
          y: y * 0.5,
          duration: 1.8,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { isLoaded } = useLoading();

  useEffect(() => {
    // Only animate in once the loader is completely finished
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      // --- Hero entrance: text lines ---
      gsap.fromTo(
        ".hero-text-line",
        { y: 120, opacity: 0, filter: "blur(12px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.4,
          stagger: 0.08,
          ease: "power4.out",
          delay: 0.2, // Slightly reduced delay now that it's synced with reveal
        }
      );

      // --- Hero entrance: video wrapper scales in ---
      gsap.fromTo(
        videoWrapperRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8, ease: "power3.out", delay: 0.4 }
      );

      // --- Hero entrance: radial glow breathes in ---
      gsap.fromTo(
        glowRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.2, ease: "power2.out", delay: 0.3 }
      );

      // --- Hero entrance: metadata stagger ---
      gsap.fromTo(
        ".meta-item",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          delay: 1.0,
        }
      );

      // --- Hero entrance: scroll indicator ---
      gsap.fromTo(
        ".scroll-indicator",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 1.4 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [isLoaded]);

  useEffect(() => {
    // Secondary effect for scroll-triggered pinning/content stays separate from entrance sync
    const ctx = gsap.context(() => {
      // --- Scroll indicator pulse loop ---
      gsap.to(".scroll-line", {
        scaleY: 1,
        opacity: 0.3,
        duration: 1.4,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      });

      // ─────────────────────────────────────────────────
      // PINNED SCROLL TIMELINE (Hero → Video → Philosophy)
      // ─────────────────────────────────────────────────

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // ── Phase 1 (0–0.3): Fade out hero text + metadata + glow ──
      tl.to(
        heroContentRef.current,
        { opacity: 0, y: -60, filter: "blur(8px)", duration: 0.3, ease: "power2.inOut" },
        0
      );

      tl.to(
        metaFrameRef.current,
        { opacity: 0, duration: 0.2, ease: "power2.inOut" },
        0
      );

      tl.to(
        glowRef.current,
        { opacity: 0, scale: 1.5, duration: 0.3, ease: "power2.inOut" },
        0
      );

      // ── Phase 2 (0.05–0.35): Expand video to fullscreen ──
      tl.fromTo(
        videoWrapperRef.current,
        {
          width: videoWrapperRef.current?.offsetWidth || "320px",
          height: videoWrapperRef.current?.offsetHeight || "220px",
        },
        {
          width: "100vw",
          height: "100vh",
          borderRadius: "0px",
          padding: "0px",
          x: 0,
          y: 0,
          boxShadow: "none",
          duration: 0.35,
          ease: "power2.inOut",
        },
        0.05
      );

      tl.to(
        parallaxRef.current,
        {
          borderRadius: "0px",
          boxShadow: "none",
          x: 0,
          y: 0,
          duration: 0.35,
          ease: "power2.inOut",
        },
        0.05
      );

      // ── Phase 3 (0.15–0.35): Darken overlay for philosophy readability ──
      tl.to(
        videoOverlayRef.current,
        { opacity: 0.85, duration: 0.2, ease: "power2.inOut" },
        0.15
      );

      // ── Phase 4 (0.4–0.85): Philosophy content fades in ──
      tl.to(
        ".philosophy-eyebrow",
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.1, ease: "power3.out" },
        0.4
      );

      tl.to(
        ".philosophy-rule",
        { scaleX: 1, opacity: 1, duration: 0.08, ease: "power3.out" },
        0.42
      );

      tl.to(
        ".philosophy-heading",
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.12, ease: "power3.out" },
        0.44
      );

      tl.to(
        ".philosophy-paragraphs",
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.15, ease: "power3.out" },
        0.46
      );

      // Slide in the philosophy image
      tl.to(
        philosophyImageWrapperRef.current,
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.25,
          ease: "back.out(1.2)",
        },
        0.45
      );

      // Word-by-word scroll highlight
      tl.to(
        ".philosophy-word",
        {
          opacity: 1,
          stagger: { amount: 0.35 },
          duration: 0.05,
          ease: "none",
        },
        0.5
      );

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative z-10 flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* Radial glow orb */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute z-0"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: "800px",
          maxHeight: "800px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 40%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Text + CTA content layer */}
      <div
        ref={heroContentRef}
        className="relative z-20 flex w-full max-w-7xl flex-col items-center px-0 text-center md:px-12"
      >
        {/* Eyebrow tag */}
        <div className="overflow-hidden mb-8">
          <span className="hero-text-line block text-[10px] uppercase tracking-[0.4em] text-white/30 font-medium">
            Vol. 01 — Interior Architecture
          </span>
        </div>

        {/* Thin accent rule */}
        <div className="overflow-hidden mb-8 w-12">
          <div className="hero-text-line h-px w-full bg-white/20" />
        </div>

        <h1 className="text-[24vw] sm:text-8xl lg:text-[10rem] font-light tracking-tighter leading-[0.8] md:leading-[0.92]">
          <div className="overflow-hidden py-1">
            <div className="hero-text-line whitespace-nowrap">Ethereal</div>
          </div>
          <div className="overflow-hidden py-1">
            <div className="hero-text-line whitespace-nowrap">Spaces</div>
          </div>
        </h1>

        <div className="overflow-hidden mt-8 w-24">
          <div className="hero-text-line h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>

        <div className="mt-10 hero-text-line">
          <Button href="/work">Explore Portfolio</Button>
        </div>
      </div>

      {/* METADATA FRAME */}
      <div
        ref={metaFrameRef}
        className="absolute inset-0 z-30 pointer-events-none p-8 md:p-12 hidden md:flex flex-col justify-between"
      >
        <div className="flex justify-between items-start">
          <div className="meta-item text-[9px] uppercase tracking-[0.3em] font-mono text-white/25 leading-relaxed">
            Vanguard Studio<br />
            <span className="text-white/15">Architectural Visuals</span>
          </div>
          <div className="meta-item text-[9px] uppercase tracking-[0.3em] font-mono text-white/25 text-right">
            Est. 2026<br />
            <span className="text-white/15">San Francisco, CA</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="meta-item text-[9px] uppercase tracking-[0.3em] font-mono text-white/25">
            37.7749° N<br />
            <span className="text-white/15">122.4194° W</span>
          </div>
          <div className="scroll-indicator flex flex-col items-center gap-2">
            <span className="text-[9px] uppercase tracking-[0.3em] font-mono text-white/25">Scroll</span>
            <div className="relative h-8 w-px bg-white/10 overflow-hidden">
              <div className="scroll-line absolute top-0 left-0 w-full h-full bg-white/40 origin-top scale-y-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Video element */}
      <div
        ref={videoWrapperRef}
        className="absolute z-10 overflow-hidden rounded-[2.5rem] p-1.5 bg-white/[0.03] ring-1 ring-white/[0.08]"
        style={{
          width: "clamp(300px, 32vw, 520px)",
          height: "clamp(200px, 22vw, 360px)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          ref={parallaxRef}
          className="relative w-full h-full overflow-hidden rounded-[calc(2.5rem-0.375rem)] bg-[#050505] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-80"
            src="/home/hero/video.mp4"
          />
        </div>
        <div
          ref={videoOverlayRef}
          className="absolute inset-0 z-10 bg-black opacity-40"
        />
      </div>

      {/* PHILOSOPHY STATEMENT */}
      <div
        ref={philosophyRef}
        className="absolute inset-0 z-20 flex items-center pointer-events-none overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 w-full max-w-7xl mx-auto px-6 md:px-12 items-center gap-12">
          <div className="md:col-span-8 flex flex-col items-start text-left">
            <span
              className="philosophy-eyebrow block text-[10px] uppercase tracking-[0.4em] text-white/40 font-medium mb-6 opacity-0 translate-y-5"
              style={{ filter: "blur(8px)" }}
            >
              Our Philosophy
            </span>

            <div
              className="philosophy-rule h-px w-16 bg-gradient-to-r from-white/30 to-transparent mb-10 opacity-0 scale-x-0 origin-left"
            />

            <h2
              className="philosophy-heading text-3xl font-light tracking-tight leading-tight md:text-5xl lg:text-7xl mb-12 opacity-0 translate-y-8"
              style={{ filter: "blur(8px)" }}
            >
              Where heritage meets<br className="hidden lg:block" /> meticulous craft
            </h2>

            <div 
              className="philosophy-paragraphs space-y-8 max-w-xl opacity-0 translate-y-8"
              style={{ filter: "blur(8px)" }}
            >
              <p className="text-sm leading-relaxed text-white/80 md:text-lg">
                {splitText(
                  "Every space we shape is a curated dialogue between material and memory. We draw from architectural heritage to compose environments that feel both timeless and startlingly present."
                )}
              </p>

              <p className="text-sm leading-relaxed text-white/80 md:text-lg">
                {splitText(
                  "Our process is meticulous by nature — an obsessive refinement of proportion, light, and texture until each element exists in silent harmony with the whole."
                )}
              </p>

              <p className="text-sm leading-relaxed text-white/80 md:text-lg">
                {splitText(
                  "The result is never decoration. It is atmosphere — sculpted with the precision of an architect and the intuition of an artist."
                )}
              </p>
            </div>
          </div>

          <div className="md:col-span-4 relative hidden md:block h-full">
            <div
              ref={philosophyImageWrapperRef}
              className="absolute top-1/2 -translate-y-1/2 left-0 w-[120%] rotate-2 opacity-0 translate-x-20"
              style={{ filter: "blur(20px)" }}
            >
              <div className="rounded-[2.5rem] bg-white/[0.03] p-2 ring-1 ring-white/[0.08] shadow-2xl overflow-hidden aspect-[4/5]">
                <div
                  ref={philosophyImageRef}
                  className="relative h-full w-full overflow-hidden rounded-[calc(2.5rem-0.5rem)] bg-[#050505] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                >
                  <Image
                    src="/home/philosophy/philosophy-accent.png"
                    alt="Architectural details"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
