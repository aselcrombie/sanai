# sanAI Studio

Turn your path into powerful stories. This app helps users create visual stories from their personal journey.

A minimal PWA MVP: upload 5–10 images, enter a topic, choose Instagram Stories (9:16) or Carousel (1:1), generate slide texts via OpenAI, overlay text on images in the browser, preview and download PNGs. No backend storage, no auth, no database. iPhone-first, deployable on Vercel.

---

## Project structure

```
sanai/
├── app/
│   ├── api/generate/route.ts   # OpenAI slide text generation
│   ├── create/page.tsx         # Creator flow
│   ├── offline/page.tsx        # PWA offline fallback
│   ├── privacy/page.tsx       # Privacy policy placeholder
│   ├── terms/page.tsx         # Terms placeholder
│   ├── layout.tsx
│   ├── page.tsx               # Landing
│   └── globals.css
├── components/
│   ├── CreatorFlow.tsx        # State + API + render orchestration
│   ├── FormatSelector.tsx
│   ├── ImageUploader.tsx
│   ├── PwaRegister.tsx        # Service worker registration
│   └── SlidePreview.tsx
├── lib/
│   └── renderSlide.ts         # Canvas overlay (client-side)
├── public/
│   ├── manifest.json
│   ├── sw.js                  # Service worker
│   ├── icon-192.png           # Add PWA icon (192×192)
│   └── icon-512.png           # Add PWA icon (512×512)
├── .env.example
└── README.md
```

---

## Environment setup

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```
2. Add your OpenAI API key:
   ```bash
   OPENAI_API_KEY=sk-your-key-here
   ```
   Get a key at [OpenAI API keys](https://platform.openai.com/api-keys).

---

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Start Creating** → upload 5–10 images, set topic and format → **Generate slides** → preview and download.

---

## Deploy to Vercel

1. Push the repo to GitHub (or connect your Git provider in Vercel).
2. In [Vercel](https://vercel.com): **Add New Project** → import this repo.
3. Set **Environment Variable**: `OPENAI_API_KEY` = your key (e.g. from [OpenAI](https://platform.openai.com/api-keys)).
4. Deploy. The app runs on the free tier; only the `/api/generate` route uses the server (OpenAI calls).

---

## Test on iPhone

1. Deploy to Vercel (or use a tunnel like `ngrok` to expose `localhost`).
2. Open the app URL in **Safari** (Chrome on iOS uses WebKit; Safari is the one that matters for “Add to Home Screen”).
3. Tap the **Share** button (square with arrow) → **Add to Home Screen**.
4. Open the app from the home screen and test:
   - Upload photos (camera or library)
   - Enter topic, choose format, generate
   - Preview and download PNGs

If something fails (e.g. canvas or download), test in Safari’s private window to rule out extensions.

---

## PWA icons (optional but recommended)

Add two PNGs to `public/`:

- `icon-192.png` (192×192)
- `icon-512.png` (512×512)

They’re referenced in `public/manifest.json` and in `app/layout.tsx` for “Add to Home Screen”. Any simple logo or “Z” graphic is fine for the MVP.

---

## Next improvements after MVP

1. **UX**: Drag-to-reorder images; edit slide text before re-rendering; optional font/size for overlay.
2. **Quality**: More overlay styles (e.g. solid bar, blur); optional high-res export (2x).
3. **Reliability**: Retry for `/api/generate`; clearer errors when the key is missing or rate-limited.
4. **PWA**: Background sync or “ready for offline” hint after first load; prompt “Add to Home Screen” after first successful creation.
5. **Compliance**: Replace placeholder Privacy and Terms with full text before any store or public launch.
6. **Analytics (if needed later)**: Only after adding a proper consent flow; keep MVP without tracking.

Keep the stack simple; avoid adding a DB or auth until you have a clear need.
