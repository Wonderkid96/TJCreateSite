import Link from "next/link";
import type { Metadata } from "next";

const TITLE = "Page not found";

export const metadata: Metadata = {
  title: TITLE,
  description: "That page isn't here. The work, services and contact details are one click away.",
  robots: { index: false, follow: false },
  // Without these the 404 inherits the homepage's share titles.
  openGraph: { title: `${TITLE} · TJCreate` },
  twitter: { title: `${TITLE} · TJCreate` },
};

const BUTTON =
  "hero-btn-lift relative inline-flex items-center gap-2 px-5 md:px-6 py-3 rounded-full font-sans font-semibold tracking-tight text-base md:text-lg border border-ink transition-colors transition-transform duration-300";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-[100dvh] flex-col items-center justify-center gap-10 px-6 md:px-10 py-24 text-center">
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
        <Link href="/" className={`${BUTTON} bg-ink text-paper hover:border-accent hover:bg-accent`}>
          <span className="tabular-nums">Home.</span>
          <span aria-hidden>→</span>
        </Link>
        <Link href="/#work" className={`${BUTTON} text-ink hover:border-accent hover:text-accent-link`}>
          <span className="tabular-nums">See work.</span>
          <span aria-hidden>→</span>
        </Link>
        <Link href="/#contact" className={`${BUTTON} text-ink hover:border-accent hover:text-accent-link`}>
          <span className="tabular-nums">Get in touch.</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </main>
  );
}
