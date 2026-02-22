"use client";

import { useCallback, useRef, useState, useEffect } from "react";

const HEIC_TYPES = ["image/heic", "image/heif"];

const MAX_IMAGES = 10;

const PROCESSING_MESSAGES = [
  "✨ preparing image...",
  "✨ converting HEIC...",
  "✨ optimizing...",
];

function isHeic(file: File): boolean {
  return HEIC_TYPES.includes(file.type) || /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name);
}

function isImage(file: File): boolean {
  return file.type.startsWith("image/") || isHeic(file) || /\.(heic|heif)$/i.test(file.name);
}

export type ImageSource = File | Blob;

type ProcessingItem = { id: number; file: File };

type Props = {
  value: ImageSource[];
  urls: string[];
  onChange: (files: ImageSource[]) => void;
  className?: string;
};

function ProcessingPlaceholder({ message }: { message: string }) {
  return (
    <div className="relative flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-xl bg-zinc-800/80 animate-card-shimmer">
      <div className="h-9 w-9 rounded-full bg-[#C8B6FF]/30 animate-shimmer" />
      <p className="px-2 text-center text-xs text-zinc-400">{message}</p>
    </div>
  );
}

export function ImageUploader({ value, urls, onChange, className = "" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processingItems, setProcessingItems] = useState<ProcessingItem[]>([]);
  const [processingMessageIndex, setProcessingMessageIndex] = useState(0);
  const [limitMessage, setLimitMessage] = useState(false);

  useEffect(() => {
    if (processingItems.length === 0) return;
    const id = setInterval(() => {
      setProcessingMessageIndex((i) => (i + 1) % PROCESSING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(id);
  }, [processingItems.length]);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files ? Array.from(e.target.files) : [];
      const images = list.filter((f) => isImage(f));
      if (images.length === 0) {
        e.target.value = "";
        return;
      }

      const slotsLeft = MAX_IMAGES - value.length;
      if (slotsLeft <= 0) {
        e.target.value = "";
        setLimitMessage(true);
        return;
      }

      const allowed = images.slice(0, slotsLeft);
      if (images.length > slotsLeft) {
        setLimitMessage(true);
      }

      const items: ProcessingItem[] = allowed.map((file, i) => ({
        id: Date.now() + i,
        file,
      }));
      setProcessingItems(items);
      setProcessingMessageIndex(0);
      e.target.value = "";

      try {
        const heic2any = (await import("heic2any")).default;
        const converted: ImageSource[] = await Promise.all(
          allowed.map(async (file): Promise<ImageSource> => {
            if (isHeic(file)) {
              const result = await heic2any({
                blob: file,
                toType: "image/jpeg",
                quality: 0.92,
              });
              const blob = Array.isArray(result) ? result[0] : result;
              return blob ?? file;
            }
            return file;
          })
        );
        const next = [...value, ...converted].slice(0, MAX_IMAGES);
        onChange(next);
        if (allowed.length === images.length) setLimitMessage(false);
      } catch (err) {
        console.error("HEIC conversion failed:", err);
        const fallback = [...value, ...allowed].slice(0, MAX_IMAGES);
        onChange(fallback);
      } finally {
        setProcessingItems([]);
      }
    },
    [value, onChange]
  );

  const remove = useCallback(
    (index: number) => {
      const next = value.filter((_, i) => i !== index);
      onChange(next);
      setLimitMessage(false);
    },
    [value, onChange]
  );

  const openPicker = () => inputRef.current?.click();

  const isProcessing = processingItems.length > 0;
  const totalCount = value.length + processingItems.length;
  const atLimit = totalCount >= MAX_IMAGES;
  const currentMessage = PROCESSING_MESSAGES[processingMessageIndex];

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,image/heic,image/heif,.heic,.heif"
        multiple
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((_, i) => (
          <div
            key={i}
            className="relative aspect-square overflow-hidden rounded-xl bg-zinc-800"
          >
            <img
              src={urls[i] ?? ""}
              alt=""
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1.5 text-white"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
        {processingItems.map((item) => (
          <ProcessingPlaceholder key={item.id} message={currentMessage} />
        ))}
        {!atLimit && (
          <button
            type="button"
            onClick={openPicker}
            disabled={isProcessing}
            className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-zinc-600 text-zinc-500 transition-colors hover:border-[#C8B6FF] hover:text-[#C8B6FF] disabled:opacity-50"
            aria-label="Add image"
          >
            +
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        {value.length} / {MAX_IMAGES} images
        {isProcessing ? " (converting…)" : ""}. HEIC/HEIF are converted to JPEG.
      </p>
      {limitMessage && (
        <p className="mt-1 text-xs text-amber-400/90">
          Maximum {MAX_IMAGES} images allowed.
        </p>
      )}
    </div>
  );
}
