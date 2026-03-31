"use client";

import React from "react";
import clsx from "clsx";

interface MasonryGridProps {
  items: any[];
  renderItem: (item: any, index: number, spanClass: string) => React.ReactNode;
}

export const MasonryGrid = ({ items, renderItem }: MasonryGridProps) => {
  // Pattern logic: repeats every 6 items
  const getGridSpan = (index: number) => {
    const pattern = index % 6;
    switch (pattern) {
      case 0: return "md:col-span-8 md:row-span-2 min-h-[500px]"; // Hero
      case 1: return "md:col-span-4 md:row-span-1 min-h-[250px]"; // Top Right
      case 2: return "md:col-span-4 md:row-span-1 min-h-[250px]"; // Bottom Right
      case 3: return "md:col-span-4 md:row-span-2 min-h-[500px]"; // Vertical Left
      case 4: return "md:col-span-8 md:row-span-1 min-h-[250px]"; // Wide Top
      case 5: return "md:col-span-8 md:row-span-1 min-h-[250px]"; // Wide Bottom
      default: return "md:col-span-4 md:row-span-1 min-h-[250px]";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
      {items.map((item, idx) => (
        <div key={idx} className={clsx("w-full h-full", getGridSpan(idx))}>
          {renderItem(item, idx, getGridSpan(idx))}
        </div>
      ))}
    </div>
  );
};
