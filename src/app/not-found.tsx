import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found",
  description: "That page isn't here. Head back to the work.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center gap-10 px-6 md:px-10 py-24 text-center">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        Not Found
      </div>

      <h1 className="font-display text-[clamp(4rem,18vw,16rem)] leading-[0.85] tracking-tight">
        Lost the <span className="italic">page</span>
        <span className="text-accent">.</span>
      </h1>

      <p className="max-w-[40ch] text-base md:text-lg text-muted">
        That URL doesn&apos;t go anywhere. The work is one click away.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="hero-btn-lift relative inline-flex items-center gap-2 px-5 md:px-6 py-3 rounded-full font-sans font-semibold tracking-tight text-base md:text-lg border border-ink bg-ink text-paper hover:border-accent hover:bg-accent transition-colors transition-transform duration-300"
        >
          <span className="tabular-nums">Home.</span>
          <span>→</span>
        </Link>
        <Link
          href="/#work"
          className="hero-btn-lift relative inline-flex items-center gap-2 px-5 md:px-6 py-3 rounded-full font-sans font-semibold tracking-tight text-base md:text-lg border border-ink text-ink hover:border-accent hover:text-accent transition-colors transition-transform duration-300"
        >
          <span className="tabular-nums">See work.</span>
          <span>→</span>
        </Link>
      </div>
    </main>
  );
}
