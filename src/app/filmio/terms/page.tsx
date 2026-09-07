import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FILMIO Terms of Use",
  alternates: {
    canonical: "https://www.tjcreate.co.uk/filmio/terms",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function FilmioTermsPage() {
  return (
    <main className="min-h-screen bg-paper text-ink p-6">
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">FILMIO Terms of Use</h1>
          <p className="text-ink-soft">Last updated: 19 August 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-base leading-relaxed">
          <p>
            These terms govern your use of FILMIO, made by Toby Johnson,
            trading as TJCreate (&quot;we&quot;, &quot;us&quot;). By creating an
            account, you agree to them.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your account</h2>
            <p>
              You must provide accurate information when you sign up.
              You&apos;re responsible for keeping your account secure. You
              must be old enough to use FILMIO under the law in your country,
              and in any case not under 13.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Acceptable use</h2>
            <p>
              FILMIO includes chat, reviews and profiles that other people can
              see. You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>post anything illegal, harassing, hateful, or sexually explicit</li>
              <li>impersonate another person</li>
              <li>use the app to spam, scrape, or abuse other users</li>
              <li>attempt to access another person&apos;s account or circumvent the app&apos;s security</li>
            </ul>
            <p>
              If you see something that breaks these rules, use the in-app
              Report control. You can also block anyone whose content or
              messages you don&apos;t want to see. We may remove content or
              suspend accounts that violate these terms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Content you post</h2>
            <p>
              You keep ownership of what you post (reviews, chat messages,
              your profile photo). By posting it, you give us permission to
              store and display it within the app to the people it&apos;s
              intended for (e.g. your circle, or anyone viewing your public
              profile).
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Film data</h2>
            <p>
              Film titles, posters, and metadata are sourced from The Movie
              Database (TMDB) and are used under TMDB&apos;s terms. FILMIO is
              not endorsed or certified by TMDB.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">No warranty</h2>
            <p>
              FILMIO is provided as-is. We work to keep it reliable, but we
              don&apos;t guarantee it will be error-free or available at all
              times.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Ending your account</h2>
            <p>
              You can delete your account at any time from Settings. We may
              suspend or terminate accounts that violate these terms.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Changes</h2>
            <p>
              We may update these terms. Continued use of the app after a
              change means you accept the update.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Contact</h2>
            <p>
              <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
                hello@tjcreate.co.uk
              </a>
            </p>
          </div>

          <div className="pt-8 border-t border-line flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/filmio" className="text-accent-link hover:text-accent-link/80 transition-colors underline">
              Back to FILMIO
            </Link>
            <Link href="/filmio/privacy" className="text-accent-link hover:text-accent-link/80 transition-colors underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
