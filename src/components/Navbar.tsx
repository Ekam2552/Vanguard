"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const [isGoldSection, setIsGoldSection] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  useEffect(() => {
    // Detect when navbar is over the gold section
    const handleScroll = () => {
      const ctaSection = document.getElementById("cta-section");
      const testimonials = document.querySelector(".testimonials-section");
      const footer = document.querySelector("footer");
      const navbarBottom = 60; // Approximate bottom of navbar area

      let isOverGold = false;

      // Ensure Testimonials (z-20) is not currently covering the navbar
      const isTestimonialsCovering = testimonials && testimonials.getBoundingClientRect().bottom >= navbarBottom;

      if (ctaSection && !isTestimonialsCovering) {
        const rect = ctaSection.getBoundingClientRect();
        // Check if navbar is within CTA bounds
        if (rect.top <= navbarBottom && rect.bottom >= navbarBottom) {
          isOverGold = true;
        }
      }

      // Also check if navbar is over the Footer (which is also gold)
      if (!isOverGold && footer) {
        const rect = footer.getBoundingClientRect();
        if (rect.top <= navbarBottom && rect.bottom >= navbarBottom) {
          isOverGold = true;
        }
      }
      
      setIsGoldSection(isOverGold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="fixed left-0 right-0 top-6 z-50 flex justify-center w-full px-4 pointer-events-none mix-blend-difference">
        <div className={clsx(
          "pointer-events-auto flex items-center justify-between rounded-full px-6 py-3 ring-1 ring-white/10 backdrop-blur-md w-full max-w-sm transition-all duration-700 ease-[var(--ease-custom)]",
          isGoldSection 
            ? "bg-white/20" 
            : "bg-white/5"
        )}>
          <Link href="/" className="text-sm font-medium tracking-widest uppercase">
            Vanguard
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="group relative flex h-6 w-6 flex-col justify-center gap-1.5 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            <span
              className={clsx(
                "block h-0.5 w-full bg-white transition-transform duration-700 ease-[var(--ease-custom)] origin-center",
                isOpen && "translate-y-[8px] rotate-45"
              )}
            />
            <span
              className={clsx(
                "block h-0.5 w-full bg-white transition-opacity duration-700 ease-[var(--ease-custom)]",
                isOpen && "opacity-0"
              )}
            />
            <span
              className={clsx(
                "block h-0.5 w-full bg-white transition-transform duration-700 ease-[var(--ease-custom)] origin-center",
                isOpen && "-translate-y-[8px] -rotate-45"
              )}
            />
          </button>
        </div>
      </header>

      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/90 backdrop-blur-3xl transition-all duration-700 ease-[var(--ease-custom)] flex flex-col items-center justify-center",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col items-center space-y-8">
          {navLinks.map((link, index) => (
            <div key={link.name} className="overflow-hidden">
              <Link
                href={link.href}
                className={clsx(
                  "block text-5xl md:text-7xl font-sans font-light tracking-tight transition-all duration-700 ease-[var(--ease-custom)] hover:text-white/50",
                  isOpen ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
                )}
                style={{ transitionDelay: isOpen ? `${100 + index * 50}ms` : '0ms' }}
              >
                {link.name}
              </Link>
            </div>
          ))}
        </nav>
        
        <div 
          className={clsx(
            "absolute bottom-12 flex flex-col items-center gap-4 transition-all duration-700 delay-300 ease-[var(--ease-custom)]",
            isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <p className="text-sm text-white/40 uppercase tracking-widest">Connect</p>
          <div className="flex gap-6">
            <a href="#" className="text-sm font-medium hover:text-white/70 transition-colors">Instagram</a>
            <a href="#" className="text-sm font-medium hover:text-white/70 transition-colors">Twitter</a>
            <a href="#" className="text-sm font-medium hover:text-white/70 transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </>
  );
};
