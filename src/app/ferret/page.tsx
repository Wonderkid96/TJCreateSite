import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ferret",
  // Root layout sets alternates.canonical to the homepage. Metadata merges
  // shallowly across segments, so without this the page would inherit that
  // and wrongly canonicalise to https://www.tjcreate.co.uk/.
  alternates: {
    canonical: "https://www.tjcreate.co.uk/ferret",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function FerretPage() {
  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-display font-bold">Ferret</h1>
          <p className="text-xl text-ink-soft">
            AI-powered scanner for car boot sales and charity shops
          </p>
        </div>

        <p className="text-lg leading-relaxed text-ink">
          Ferret identifies resellable items and shows recent eBay completed-listing prices.
          Available on iPhone.
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

        <div className="pt-8 border-t border-line">
          <Link
            href="/ferret/privacy"
            className="text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
