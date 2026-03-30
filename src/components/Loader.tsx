import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLoading } from "@/context/LoadingContext";

interface LoaderProps {
  onFinished: () => void;
}

export function Loader({ onFinished }: LoaderProps) {
  const { setIsLoaded } = useLoading();

  const [percentage, setPercentage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const leftLineGroupRef = useRef<HTMLDivElement>(null);
  const rightLineGroupRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const isMobile = window.innerWidth < 768;
    const moveDist = isMobile ? "65vw" : "50vw";
    const yOffset = isMobile ? 24 : 40;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onFinished();
        }
      });

      // 1. Initial State: Lines meet at center
      gsap.set([lineLeftRef.current, lineRightRef.current], { scaleX: 0, opacity: 0 });

      // 2. Expansion Phase (Center to Outer Edges)
      tl.to([lineLeftRef.current, lineRightRef.current], {
        opacity: 1,
        scaleX: 1,
        duration: 3, 
        ease: "power2.inOut",
        onUpdate: function() {
          const progress = this.progress();
          setPercentage(Math.round(progress * 100));
        }
      })
      
      // 3. Percentage Fade-out (Before break)
      .to(percentRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut"
      })

      // 4. Snappy Break Phase (Increased gap for text clearance)
      .addLabel("break")
      .to(leftLineGroupRef.current, {
        y: -yOffset, 
        duration: 0.4,
        ease: "back.out(1.5)"
      }, "break")
      .to(rightLineGroupRef.current, {
        y: yOffset,
        duration: 0.4,
        ease: "back.out(1.5)"
      }, "break")

      // 5. Horizontal Slide/Lock Phase (Slide and pull text in)
      .addLabel("slide", "+=0.2")
      .to(leftLineGroupRef.current, {
        x: moveDist, 
        duration: 1.6,
        ease: "power4.inOut" // Accelerate then decelerate
      }, "slide")
      .to(rightLineGroupRef.current, {
        x: `-${moveDist}`, 
        duration: 1.6,
        ease: "power4.inOut"
      }, "slide")
      
      // 6. Reveal Phase (Curtains carry the lines out of view)
      .addLabel("reveal", "+=0.4")
      .add(() => {
        setIsLoaded(true); 
      }, "reveal")
      .to(topCurtainRef.current, {
        yPercent: -100,
        duration: 1.4,
        ease: "power4.inOut"
      }, "reveal")
      .to(bottomCurtainRef.current, {
        yPercent: 100,
        duration: 1.4,
        ease: "power4.inOut"
      }, "reveal")
      .to(containerRef.current, {
        display: "none",
        duration: 0
      });
    });

    return () => ctx.revert();
  }, [onFinished]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none overflow-hidden"
    >
      {/* Top Curtain / Left Line Group */}
      <div 
        ref={topCurtainRef}
        className="absolute top-0 left-0 w-screen h-1/2 bg-[#050505] pointer-events-auto"
      >
        <div 
          ref={leftLineGroupRef}
          className="absolute right-1/2 bottom-0 w-1/2 h-[1.5px]"
        >
          <div className="absolute right-full bottom-[2px] pr-4 text-white font-sans text-4xl md:text-7xl tracking-wide font-light whitespace-nowrap leading-none">
            Vanguard
          </div>
          <div 
            ref={lineLeftRef}
            className="w-full h-full bg-white origin-right opacity-0"
          />
        </div>
      </div>

      {/* Bottom Curtain / Right Line Group */}
      <div 
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 w-screen h-1/2 bg-[#050505] pointer-events-auto"
      >
         <div 
          ref={rightLineGroupRef}
          className="absolute left-1/2 top-[-1.5px] w-1/2 h-[1.5px]"
        >
          <div className="absolute left-full top-[2px] pl-4 text-white font-sans text-4xl md:text-7xl tracking-wide font-light whitespace-nowrap leading-none">
            Interiors
          </div>
          <div 
            ref={lineRightRef}
            className="w-full h-full bg-white origin-left opacity-0"
          />
        </div>
      </div>

      {/* Percentage Counter */}
      <div 
        ref={percentRef}
        className="absolute bottom-10 right-10 z-20 pointer-events-auto"
      >
        <span className="text-white font-sans text-sm tracking-[0.2em] font-medium tabular-nums opacity-40">
          {percentage}%
        </span>
      </div>
    </div>
  );
}



