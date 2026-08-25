import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trivia Crown",
  // Root layout sets alternates.canonical to the homepage. Metadata merges
  // shallowly across segments, so without this the page would inherit that
  // and wrongly canonicalise to https://www.tjcreate.co.uk/.
  alternates: {
    canonical: "https://www.tjcreate.co.uk/trivia-crown",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TriviaCrownPage() {
  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-display font-bold">Trivia Crown</h1>
          <p className="text-xl text-ink-soft">
            An evergreen quiz show, published to YouTube
          </p>
        </div>

        <p className="text-lg leading-relaxed text-ink">
          Trivia Crown produces general-knowledge quiz episodes and publishes them to the
          YouTube channel <span className="whitespace-nowrap">@triviacrown</span>. Every question is
          checked against an independent source before it goes out, and that source is shown
          on screen with the answer.
        </p>

        <p className="text-base leading-relaxed text-ink-soft">
          The publishing tool is operated by TJCreate and uploads only to its own channel. It
          does not collect data from viewers or from anybody else&apos;s Google account.
        </p>

        <div className="space-y-4 pt-4">
          <p className="text-base">Questions? Get in touch:</p>
          <a
            href="mailto:hello@tjcreate.co.uk"
            className="inline-block text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            hello@tjcreate.co.uk
          </a>
        </div>

        <div className="pt-8 border-t border-line">
          <Link
            href="/trivia-crown/privacy"
            className="text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            Privacy policy
          </Link>
        </div>
      </div>
    </main>
  );
}
