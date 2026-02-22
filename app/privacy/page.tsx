import Link from "next/link";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: placeholder</p>
        <div className="mt-8 space-y-6 text-zinc-300 text-sm leading-relaxed">
          <p>
            This is a placeholder for the Privacy Policy. For App Store
            preparation, replace with your full policy covering: what data (if
            any) is collected, how it is used, and that no personal data is
            stored on servers for this MVP.
          </p>
          <p>
            sanAI Studio is designed to work without storing your images or topic on
            our servers. Image processing happens on your device. Only slide
            text generation uses an external API (OpenAI); the topic and slide
            count are sent for that purpose only.
          </p>
        </div>
      </div>
    </div>
  );
}
