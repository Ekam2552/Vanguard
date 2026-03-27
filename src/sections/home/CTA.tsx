"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/Button";

const WORDS = ["Beautiful", "Timeless", "Refined", "Bespoke", "Exquisite", "Elevated"];
const HOLD_DURATION = 2800; // ms to hold each word before cycling

// Register plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CTA() {
  const formRef = useRef<HTMLFormElement>(null);
  const wordContainerRef = useRef<HTMLDivElement>(null);
  
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build letter spans for a word and inject into the container
  const injectWord = useCallback((word: string) => {
    const container = wordContainerRef.current;
    if (!container) return;
    container.innerHTML = "";
    word.split("").forEach((letter) => {
      const span = document.createElement("span");
      span.className = "letter-char";
      span.style.display = "inline-block";
      span.style.willChange = "transform, opacity";
      span.textContent = letter;
      container.appendChild(span);
    });
  }, []);

  // Animate entrance of current letters, then schedule next cycle
  const animateEntrance = useCallback(() => {
    const container = wordContainerRef.current;
    if (!container) return;
    const letters = container.querySelectorAll(".letter-char");

    gsap.set(letters, { y: "110%", opacity: 0, filter: "blur(8px)" });
    gsap.to(letters, {
      y: "0%",
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.04,
      onComplete: () => {
        isAnimatingRef.current = false;
        timeoutRef.current = setTimeout(cycleToNext, HOLD_DURATION);
      },
    });
  }, []);

  const cycleToNext = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const container = wordContainerRef.current;
    if (!container) return;
    const letters = container.querySelectorAll(".letter-char");

    gsap.to(letters, {
      y: "-110%",
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.4,
      ease: "power2.in",
      stagger: 0.02,
      onComplete: () => {
        currentIndexRef.current = (currentIndexRef.current + 1) % WORDS.length;
        injectWord(WORDS[currentIndexRef.current]);
        animateEntrance();
      },
    });
  }, [injectWord, animateEntrance]);

  useEffect(() => {
    const ctx = gsap.context(() => {});

    // 3. Initial Word Injection + Animation
    injectWord(WORDS[0]);
    const initTimeout = setTimeout(() => {
      animateEntrance();
    }, 400);

    return () => {
      ctx.revert();
      clearTimeout(initTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [injectWord, animateEntrance]);

  return (
    <section id="cta-section" className="relative w-full h-[250vh] -mt-[100vh] z-10 pointer-events-none">
      {/* ── CTA CONTENT (Sticky — Revealed behind Testimonials) ── */}
      <div
        className="sticky top-0 flex flex-col min-h-[100dvh] w-full overflow-hidden bg-[#946e47] pointer-events-auto"
      >

        <div className="relative flex-1 flex w-full items-center px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-24">
            
            {/* Left Column: Typography Tension */}
            <div className="flex flex-col items-start gap-2 relative z-10">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-semibold mb-6">
                Get in Touch
              </span>
              <div>
                <h2 className="text-lg font-light tracking-tight text-white/60 md:text-xl lg:text-2xl whitespace-nowrap">
                  Let&apos;s design you something
                </h2>
              </div>
              <div
                className="w-full"
                style={{
                  fontSize: "clamp(3.5rem, 8vw, 8rem)",
                  height: "1em",
                  overflowY: "clip",
                  overflowX: "visible",
                }}
              >
                <div
                  ref={wordContainerRef}
                  className="font-bold tracking-tighter text-white leading-[0.95] -ml-[0.05em] whitespace-nowrap"
                  style={{ fontSize: "inherit" }}
                  aria-live="polite"
                />
              </div>
            </div>

            {/* Right Column: Double-Bezel Form */}
            <div className="cta-form-container relative flex justify-end">
              <div className="w-full max-w-[480px] rounded-[2.5rem] bg-white/[0.05] p-1.5 ring-1 ring-white/20 backdrop-blur-sm shadow-2xl">
                <div className="rounded-[calc(2.5rem-0.375rem)] bg-[#946e47] p-6 md:p-12 [@media(max-height:600px)]:p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <form 
                    ref={formRef}
                    className="flex flex-col gap-4 md:gap-6 [@media(max-height:600px)]:gap-4"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-white font-semibold ml-1">
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        placeholder="Alexander Vanguard"
                        className="w-full rounded-2xl bg-black/[0.05] px-6 py-3 md:py-4 [@media(max-height:600px)]:py-2.5 text-sm text-white placeholder-white/30 ring-1 ring-white/20 transition-all duration-500 focus:outline-none focus:ring-white/40 focus:bg-black/[0.1]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-white font-semibold ml-1">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        placeholder="lex@studio.com"
                        className="w-full rounded-2xl bg-black/[0.05] px-6 py-3 md:py-4 [@media(max-height:600px)]:py-2.5 text-sm text-white placeholder-white/30 ring-1 ring-white/20 transition-all duration-500 focus:outline-none focus:ring-white/40 focus:bg-black/[0.1]"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase tracking-widest text-white font-semibold ml-1">
                        Project Brief
                      </label>
                      <textarea 
                        rows={3}
                        placeholder="Tell us about the space you envision..."
                        className="w-full rounded-2xl bg-black/[0.05] px-6 py-3 md:py-4 [@media(max-height:600px)]:py-2.5 text-sm text-white placeholder-white/30 ring-1 ring-white/20 transition-all duration-500 focus:outline-none focus:ring-white/40 focus:bg-black/[0.1] resize-none"
                      />
                    </div>

                    <div className="mt-4 flex justify-start">
                      <Button variant="primary" className="cursor-pointer">
                        Send Inquiry
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
