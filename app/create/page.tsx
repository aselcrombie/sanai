"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { CreatorFlow } from "@/components/CreatorFlow";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-[#0f0f0f]/95 px-4 py-3 backdrop-blur safe-area-inset-bottom">
        <Link
          href="/"
          className="text-zinc-400 transition-colors hover:text-white"
          aria-label="Back to home"
        >
          ←
        </Link>
        <span className="font-medium text-white">sanAI Studio</span>
        <span className="w-6" />
      </header>
      <main className="px-4 pb-8 pt-6">
        <CreatorFlow />
      </main>
    </div>
  );
}
