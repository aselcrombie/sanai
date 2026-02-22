import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 py-12">
      <div className="mx-auto max-w-prose">
        <Link
          href="/"
          className="inline-block text-zinc-400 hover:text-white"
        >
          ← Back
        </Link>
        <h1 className="mt-6 text-2xl font-semibold text-white">
          Terms of Use
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: placeholder</p>
        <div className="mt-8 space-y-6 text-zinc-300 text-sm leading-relaxed">
          <p>
            This is a placeholder for the Terms of Use. For App Store
            preparation, replace with your full terms covering acceptable use,
            disclaimers, and liability.
          </p>
          <p>
            Use of sanAI Studio is at your own risk. Do not use the service to
            generate content that violates platform guidelines or the law.
          </p>
        </div>
      </div>
    </div>
  );
}
