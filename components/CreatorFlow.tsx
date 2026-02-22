"use client";

import { useCallback, useState, useEffect } from "react";
import { ImageUploader, type ImageSource } from "@/components/ImageUploader";
import { FormatSelector } from "@/components/FormatSelector";
import { SlidePreview } from "@/components/SlidePreview";
import { renderSlideToBlob, type Format } from "@/lib/renderSlide";

const LOADING_MESSAGES = [
  "✨ thinking...",
  "✨ cooking your story...",
  "✨ structuring your narrative...",
  "✨ whispering to the algorithm...",
  "✨ almost ready...",
];

export function CreatorFlow() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [format, setFormat] = useState<Format>("stories");
  const [sources, setSources] = useState<ImageSource[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [renderedBlobs, setRenderedBlobs] = useState<Blob[]>([]);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setLoadingMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(id);
  }, [loading]);

  const onSourcesChange = useCallback((newSources: ImageSource[]) => {
    setSources(newSources);
    setUrls((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u));
      return newSources.map((s) => URL.createObjectURL(s));
    });
    setRenderedBlobs([]);
    setError(null);
  }, []);

  const generate = useCallback(async () => {
    const count = sources.length;
    if (count < 1) {
      setError("Add at least one image.");
      return;
    }
    const desc = description.trim();
    if (!desc) {
      setError("Enter your story description.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: projectName.trim(),
          description: desc,
          imageCount: count,
          format: format === "stories" ? "stories" : "carousel",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to generate texts.");
        return;
      }
      const texts = Array.isArray(data.texts) ? data.texts : [];
      if (texts.length !== count) {
        setError("Slide count mismatch. Try again.");
        return;
      }

      const blobs: Blob[] = [];
      for (let i = 0; i < urls.length; i++) {
        const blob = await renderSlideToBlob(urls[i], texts[i], format, i);
        blobs.push(blob);
      }
      setRenderedBlobs(blobs);
    } catch (e) {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [sources.length, description, projectName, format, urls]);

  const canGenerate = sources.length >= 1 && description.trim().length > 0 && !loading;

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <label className="block text-sm font-medium text-zinc-300">Project name</label>
        <input
          type="text"
          placeholder="e.g. My journey into IT"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-[#C8B6FF]"
          maxLength={120}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300">Description (your full story)</label>
        <textarea
          placeholder="Write your story here. It will be split into one slide per image, with 5–7 sentences per slide..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="mt-2 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 outline-none focus:border-[#C8B6FF]"
          maxLength={8000}
        />
      </div>

      <FormatSelector value={format} onChange={setFormat} />

      <div>
        <label className="block text-sm font-medium text-zinc-300">Images</label>
        <ImageUploader
          value={sources}
          urls={urls}
          onChange={onSourcesChange}
          className="mt-2"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-6 py-8">
          <div className="h-8 w-8 rounded-full bg-[#C8B6FF]/40 animate-shimmer" />
          <p className="text-center text-sm text-zinc-400">
            {LOADING_MESSAGES[loadingMessageIndex]}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={generate}
          disabled={!canGenerate}
          className="w-full rounded-full bg-[#C8B6FF] py-4 font-medium text-[#0f0f0f] transition-opacity disabled:opacity-50 active:opacity-90"
        >
          Generate slides
        </button>
      )}

      {renderedBlobs.length > 0 && (
        <SlidePreview blobs={renderedBlobs} format={format} />
      )}
    </div>
  );
}
