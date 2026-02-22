/**
 * Client-side only. Renders one image with text overlay to canvas and returns PNG blob.
 * No server, no storage.
 */

export type Format = "stories" | "carousel";

const PASTEL_COLORS = [
  "#C8B6FF", // lavender
  "#F8C8DC", // dusty pink
  "#B7E4C7", // sage
  "#F3E5AB", // beige
  "#A9D6E5", // sky blue
] as const;

const DIMENSIONS: Record<Format, { w: number; h: number }> = {
  stories: { w: 1080, h: 1920 },
  carousel: { w: 1080, h: 1080 },
};

function getPastelGradient(index: number): [string, string] {
  const i = index % PASTEL_COLORS.length;
  const j = (index + 1) % PASTEL_COLORS.length;
  return [PASTEL_COLORS[i], PASTEL_COLORS[j]];
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    const metrics = ctx.measureText(test);
    if (metrics.width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderSlideToBlob(
  imageUrl: string,
  text: string,
  format: Format,
  index: number
): Promise<Blob> {
  const { w, h } = DIMENSIONS[format];

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.crossOrigin = "anonymous";
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = imageUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2d not available");

  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const ratio = w / h;
  const imgRatio = iw / ih;

  let sx = 0,
    sy = 0,
    sw = iw,
    sh = ih;
  if (imgRatio > ratio) {
    sw = ih * ratio;
    sx = (iw - sw) / 2;
  } else {
    sh = iw / ratio;
    sy = (ih - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

  const [c1, c2] = getPastelGradient(index);
  const gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, `${c1}40`);
  gradient.addColorStop(1, `${c2}50`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  const padding = w * 0.08;
  const maxTextWidth = w - padding * 2;
  const fontSize = Math.round(w / 14);
  ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
  const lineHeight = fontSize * 1.35;
  const lines = wrapText(ctx, text, maxTextWidth, lineHeight);
  const totalHeight = lines.length * lineHeight;
  let y = h / 2 - totalHeight / 2 + lineHeight * 0.5;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  const shadowOffset = Math.max(2, w / 400);
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = shadowOffset * 4;
  ctx.shadowOffsetX = shadowOffset;
  ctx.shadowOffsetY = shadowOffset;

  for (const line of lines) {
    ctx.fillText(line, w / 2, y, maxTextWidth);
    y += lineHeight;
  }

  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  y = h / 2 - totalHeight / 2 + lineHeight * 0.5;
  for (const line of lines) {
    ctx.fillText(line, w / 2, y, maxTextWidth);
    y += lineHeight;
  }

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/png",
      0.92
    );
  });
}
