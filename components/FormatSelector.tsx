"use client";

import type { Format } from "@/lib/renderSlide";

type Props = {
  value: Format;
  onChange: (f: Format) => void;
};

export function FormatSelector({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300">Format</label>
      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={() => onChange("stories")}
          className={`flex-1 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
            value === "stories"
              ? "border-[#C8B6FF] bg-[#C8B6FF]/10 text-white"
              : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
          }`}
        >
          <span className="font-medium">Stories</span>
          <span className="mt-1 block text-xs opacity-80">9:16</span>
        </button>
        <button
          type="button"
          onClick={() => onChange("carousel")}
          className={`flex-1 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
            value === "carousel"
              ? "border-[#C8B6FF] bg-[#C8B6FF]/10 text-white"
              : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
          }`}
        >
          <span className="font-medium">Carousel</span>
          <span className="mt-1 block text-xs opacity-80">1:1</span>
        </button>
      </div>
    </div>
  );
}
