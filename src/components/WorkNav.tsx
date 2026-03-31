"use client";

import React from "react";
import clsx from "clsx";

interface PillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: "group" | "standalone";
}

const Pill = ({ label, isActive, onClick, variant = "group" }: PillProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative rounded-full text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer whitespace-nowrap",
        // Group styling
        variant === "group" && "px-6 py-2.5",
        // Standalone styling
        variant === "standalone" && "px-8 py-4 ring-1 ring-white/10 backdrop-blur-md",
        // Active/Inactive state
        isActive
          ? "bg-white text-black shadow-lg"
          : variant === "group" 
            ? "text-white/40 hover:text-white" 
            : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
      )}
    >
      {label}
    </button>
  );
};

interface WorkNavProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  projectType: string;
}

export const WorkNav = ({
  categories,
  activeCategory,
  onCategoryChange,
  projectType,
}: WorkNavProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full">
      {/* SPACE CATEGORIES GROUP */}
      <div className="work-nav-item opacity-0 flex items-center p-1.5 rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur-md overflow-x-auto no-scrollbar max-w-full">
        {categories.map((cat) => (
          <Pill
            key={cat}
            label={cat}
            isActive={activeCategory === cat}
            onClick={() => onCategoryChange(cat)}
            variant="group"
          />
        ))}
      </div>

      {/* STANDALONE TYPE PILL */}
      <div className="work-nav-item opacity-0">
        <Pill
          label={projectType}
          isActive={activeCategory === projectType}
          onClick={() => onCategoryChange(projectType)}
          variant="standalone"
        />
      </div>
    </div>
  );
};
