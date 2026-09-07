import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FILMIO Privacy Policy",
  alternates: {
    canonical: "https://www.tjcreate.co.uk/filmio/privacy",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function FilmioPrivacyPage() {
  return (
    <main className="min-h-screen bg-paper text-ink p-6">
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">FILMIO Privacy Policy</h1>
          <p className="text-ink-soft">Last updated: 19 August 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-base leading-relaxed">
          <p>
            FILMIO is made by Toby Johnson, trading as TJCreate, Lincoln, United
            Kingdom (&quot;we&quot;, &quot;us&quot;). This policy explains what data FILMIO
            collects, why, and what you can do about it. If you have any
            questions, contact us at{" "}
            <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
              hello@tjcreate.co.uk
            </a>
            .
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What we collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Email address</strong> — to create and secure your
                account, whether you sign up with Sign in with Apple or email
                and password.
              </li>
              <li>
                <strong>Account identifier</strong> — a unique ID tied to your
                profile, used to keep your ratings, chat messages and social
                connections attached to you.
              </li>
              <li>
                <strong>Ratings, reviews and watch history</strong> — the
                films you rate, mark as seen, save to your watchlist, or mark
                not interested. This is the core of the app: it&apos;s what
                your recommendations are built from.
              </li>
              <li>
                <strong>Chat messages and other content you post</strong> —
                messages in circle chat, written reviews, your bio, username
                and display name.
              </li>
              <li>
                <strong>Profile photo</strong> — if you choose to upload one,
                from your own photo library. We never access your photo
                library without your explicit selection.
              </li>
              <li>
                <strong>Friend and circle connections</strong> — who you&apos;re
                friends with, which circles you belong to, and what you&apos;ve
                invited people to watch.
              </li>
            </ul>
            <p>
              We do not collect location data, contacts, or advertising
              identifiers. We do not use analytics or advertising SDKs, and we
              do not track you across other apps or websites.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Why we collect it</h2>
            <p>
              Everything above exists to run the app: to generate your
              personal recommendations, to let you track what you&apos;ve
              watched, and to let you watch things with people you know. We
              don&apos;t sell data, and we don&apos;t use your data for
              advertising.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Who we share it with</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Supabase</strong> (database and authentication
                hosting) — stores your account and app data securely on our
                behalf.
              </li>
              <li>
                <strong>The Movie Database (TMDB)</strong> — we send film
                titles and IDs to TMDB&apos;s API to fetch posters, cast and
                metadata. We don&apos;t send your personal data to TMDB.
              </li>
              <li>
                <strong>Apple</strong> — if you sign in with Apple, Apple
                handles that authentication step; we only receive what you
                choose to share (your email, or Apple&apos;s private relay
                address).
              </li>
            </ul>
            <p>We don&apos;t share your data with advertisers, data brokers, or anyone else.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Other people using FILMIO</h2>
            <p>
              Ratings you make public through your profile (your Top 10,
              favourites, and completed reviews) are visible to other FILMIO
              users who view your profile. Chat messages are visible to the
              members of the circle you send them in. You can report content
              or block another user at any time from within the app; blocking
              removes that person&apos;s messages and profile from what you see,
              and from what they can see of you.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your rights</h2>
            <p>You can:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Delete your account</strong> at any time from
                Settings → Delete Account. This permanently removes your
                profile, ratings, reviews, chat history and social
                connections. This action can&apos;t be undone.
              </li>
              <li>
                <strong>Ask us what data we hold about you</strong>, or ask us
                to correct it, by emailing{" "}
                <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
                  hello@tjcreate.co.uk
                </a>
                .
              </li>
            </ul>
            <p>
              If you&apos;re in the UK or EU, you have rights under UK GDPR / EU
              GDPR to access, correct, delete, or export your data, and to
              complain to the{" "}
              <a href="https://ico.org.uk" className="text-accent-link hover:text-accent-link/80">
                ICO
              </a>{" "}
              (or your local data protection authority) if you think
              we&apos;ve mishandled it.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Children</h2>
            <p>
              FILMIO isn&apos;t directed at children and isn&apos;t intended for
              use by anyone under 13.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Changes to this policy</h2>
            <p>
              If this policy changes in a way that matters, we&apos;ll update
              the date at the top and, for significant changes, let you know
              in the app.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Contact</h2>
            <p>
              Toby Johnson (TJCreate), Lincoln, United Kingdom —{" "}
              <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
                hello@tjcreate.co.uk
              </a>
            </p>
          </div>

          <div className="pt-8 border-t border-line flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/filmio" className="text-accent-link hover:text-accent-link/80 transition-colors underline">
              Back to FILMIO
            </Link>
            <Link href="/filmio/terms" className="text-accent-link hover:text-accent-link/80 transition-colors underline">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
