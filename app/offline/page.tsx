export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f0f0f] px-6 text-center">
      <h1 className="text-2xl font-semibold text-white">You&apos;re offline</h1>
      <p className="mt-2 text-zinc-400">
        sanAI Studio needs a connection to create stories. Try again when you&apos;re back online.
      </p>
      <a
        href="/"
        className="mt-6 rounded-full bg-[#C8B6FF] px-6 py-3 font-medium text-[#0f0f0f]"
      >
        Go home
      </a>
    </div>
  );
}
