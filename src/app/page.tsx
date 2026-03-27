"use client";

import { Hero } from "@/sections/home/Hero";
import { SignatureServices } from "@/sections/home/SignatureServices";
import { Testimonials } from "@/sections/home/Testimonials";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  return (
    <main className="relative min-h-screen w-full bg-[#050505] selection:bg-white selection:text-black">
      <Hero />
      <SignatureServices />
      <Testimonials />
    </main>
  );
}
