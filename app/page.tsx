import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f]">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 safe-area-inset-bottom">
        <h1 className="text-center font-semibold tracking-tight text-white text-4xl sm:text-5xl">
          sanAI Studio
        </h1>
        <p className="mt-3 text-center text-lg text-[#C8B6FF]">
          Turn your path into powerful stories.
        </p>
        <p className="mt-6 max-w-sm text-center text-zinc-400 text-sm leading-relaxed">
          Upload your photos, add a topic, and get AI-written slide texts. Export
          Instagram-ready stories or carousels—no account, no storage, all on your device.
        </p>
        <Link
          href="/create"
          className="mt-10 min-w-[200px] rounded-full bg-[#C8B6FF] px-8 py-4 text-center font-medium text-[#0f0f0f] transition-opacity active:opacity-90"
        >
          Start Creating
        </Link>
        <nav className="mt-16 flex gap-8 text-sm text-zinc-500">
          <Link href="/privacy" className="hover:text-zinc-300">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-zinc-300">
            Terms
          </Link>
        </nav>
      </main>
    </div>
  );
}
