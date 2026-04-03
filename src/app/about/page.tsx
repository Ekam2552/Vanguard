import { Manifesto } from "@/sections/about/Manifesto";
import { DesignEthos } from "@/sections/about/DesignEthos";
import { Team } from "@/sections/about/Team";

export default function About() {
  return (
    <main className="min-h-screen w-full bg-[#050505]">
      {/* Noise Overlay is handled globally in globals.css */}
      <Manifesto />
      <DesignEthos />
      <Team />
    </main>
  );
}
