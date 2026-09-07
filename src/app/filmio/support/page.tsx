import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FILMIO Support",
  alternates: {
    canonical: "https://www.tjcreate.co.uk/filmio/support",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function FilmioSupportPage() {
  return (
    <main className="min-h-screen bg-paper text-ink p-6">
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">FILMIO Support</h1>
          <p className="text-ink-soft">We usually reply within a couple of days.</p>
        </div>

        <div className="space-y-6 text-base leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Get in touch</h2>
            <p>
              For bugs, account issues, or anything else about FILMIO, email{" "}
              <a
                href="mailto:hello@tjcreate.co.uk"
                className="text-accent-link hover:text-accent-link/80 underline"
              >
                hello@tjcreate.co.uk
              </a>
              .
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Delete your account</h2>
            <p>
              You can permanently delete your FILMIO account, ratings, reviews,
              chat history, and social connections at any time from inside the
              app: Settings → Delete Account. This can&apos;t be undone. If you
              can&apos;t access the app, email us at the address above and
              we&apos;ll delete it for you.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Report or block someone</h2>
            <p>
              Use the Report control on any profile, review, or chat message
              to flag content that breaks our{" "}
              <Link href="/filmio/terms" className="text-accent-link hover:text-accent-link/80 underline">
                Terms of Use
              </Link>
              . You can block another user from their profile at any time;
              blocking hides their content from you and yours from them.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-line flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/filmio" className="text-accent-link hover:text-accent-link/80 transition-colors underline">
            Back to FILMIO
          </Link>
          <Link href="/filmio/privacy" className="text-accent-link hover:text-accent-link/80 transition-colors underline">
            Privacy Policy
          </Link>
          <Link href="/filmio/terms" className="text-accent-link hover:text-accent-link/80 transition-colors underline">
            Terms of Use
          </Link>
        </div>
      </div>
    </main>
  );
}
