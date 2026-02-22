"use client";

import { useEffect, useMemo } from "react";
import type { Format } from "@/lib/renderSlide";

type Props = {
  blobs: Blob[];
  format: Format;
};

export function SlidePreview({ blobs, format }: Props) {
  const urls = useMemo(
    () => blobs.map((b) => URL.createObjectURL(b)),
    [blobs]
  );
  useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);

  const aspect = format === "stories" ? "9/16" : "1/1";

  const download = (index: number) => {
    const blob = blobs[index];
    const a = document.createElement("a");
    a.href = urls[index];
    a.download = `sanai-studio-slide-${index + 1}.png`;
    a.click();
  };

  const downloadAll = () => {
    blobs.forEach((blob, i) => {
      const a = document.createElement("a");
      a.href = urls[i];
      a.download = `sanai-studio-slide-${i + 1}.png`;
      a.click();
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-white">Preview</h2>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        }}
      >
        {urls.map((url, i) => (
          <div key={i} className="space-y-2">
            <div
              className="overflow-hidden rounded-lg bg-zinc-800"
              style={{ aspectRatio: aspect }}
            >
              <img
                src={url}
                alt={`Slide ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => download(i)}
              className="w-full rounded-lg border border-zinc-600 py-2 text-sm text-zinc-300 transition-colors hover:border-[#C8B6FF] hover:text-[#C8B6FF]"
            >
              Download {i + 1}
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={downloadAll}
        className="w-full rounded-full border-2 border-[#C8B6FF] py-3 font-medium text-[#C8B6FF] transition-colors hover:bg-[#C8B6FF]/10"
      >
        Download all PNGs
      </button>
    </div>
  );
}
