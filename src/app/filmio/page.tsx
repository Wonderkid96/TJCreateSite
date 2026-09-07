import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FILMIO",
  // Root layout sets alternates.canonical to the homepage. Metadata merges
  // shallowly across segments, so without this the page would inherit that
  // and wrongly canonicalise to https://www.tjcreate.co.uk/.
  alternates: {
    canonical: "https://www.tjcreate.co.uk/filmio",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function FilmioPage() {
  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-display font-bold">FILMIO</h1>
          <p className="text-xl text-ink-soft">
            Taste-based film tracking and recommendations
          </p>
        </div>

        <p className="text-lg leading-relaxed text-ink">
          FILMIO learns your taste from what you actually rate, not what&apos;s
          trending. Rate films, build a Top 10, and see exactly what to watch
          tonight, solo or with the people you watch with. Available on
          iPhone.
        </p>

        <div className="space-y-4 pt-4">
          <p className="text-base">
            Questions? Get in touch:
          </p>
          <a
            href="mailto:hello@tjcreate.co.uk"
            className="inline-block text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            hello@tjcreate.co.uk
          </a>
        </div>

        <div className="pt-8 border-t border-line flex flex-wrap gap-x-6 gap-y-2">
          <Link
            href="/filmio/support"
            className="text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            Support
          </Link>
          <Link
            href="/filmio/privacy"
            className="text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="/filmio/terms"
            className="text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            Terms of Use
          </Link>
        </div>
      </div>
    </main>
  );
}
