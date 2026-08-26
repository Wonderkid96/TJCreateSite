import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dust-Up Privacy Policy",
  // Root layout sets alternates.canonical to the homepage. Metadata merges
  // shallowly across segments, so without this the page would inherit that
  // and wrongly canonicalise to https://www.tjcreate.co.uk/.
  alternates: {
    canonical: "https://www.tjcreate.co.uk/dustup/privacy",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DustUpPrivacyPage() {
  return (
    <main className="min-h-screen bg-paper text-ink p-6">
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Dust-Up Privacy Policy</h1>
          <p className="text-ink-soft">Last updated: 26 August 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-base leading-relaxed">
          <p>
            Dust-Up is made by Toby Johnson, trading as TJCreate, Lincoln,
            United Kingdom (&quot;we&quot;, &quot;us&quot;). It is a game a
            household plays together: you set up the jobs that need doing in
            your home, and the app keeps score. This policy explains what data
            it holds, why, and what you can do about it. If you have any
            questions, contact us at{" "}
            <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
              hello@tjcreate.co.uk
            </a>
            .
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">The short version</h2>
            <p>
              Dust-Up holds your email address, the name you play under, and
              the record of the game your household is playing. It has no
              advertising, no analytics, and no tracking of any kind. Nothing
              in it is sold or shared with anybody outside the three services
              listed below, all of which are there to make the app work.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What we collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Email address</strong> — to create and secure your
                account, whether you sign up with Sign in with Apple or with
                an email address and password. If you use Sign in with Apple
                and choose to hide your address, we only ever see Apple&apos;s
                private relay address.
              </li>
              <li>
                <strong>Account identifier</strong> — a unique ID that keeps
                your score attached to you.
              </li>
              <li>
                <strong>How you appear in the game</strong> — the display name
                you choose, your emoji and your colour. Nobody outside your own
                household ever sees these.
              </li>
              <li>
                <strong>The game itself</strong> — the jobs on your board, who
                did what and when, how long each took, points, streaks,
                personal bests and past seasons. This is the whole point of the
                app: it is the scoreboard.
              </li>
              <li>
                <strong>Things people in your household write</strong> — the
                names of jobs, the dares written for the Gamble wheel, notes
                left when a job is sent back, and the titles of favours in the
                shop. All of it is written by your household, for your
                household.
              </li>
              <li>
                <strong>Your household and who is in it</strong> — which
                household you belong to, when you joined, and the invite codes
                used to let somebody in.
              </li>
              <li>
                <strong>A notification token for each device</strong> — so the
                app can tell you when somebody else in the house has finished a
                job. Dust-Up never sends notifications about you, only about
                other people.
              </li>
              <li>
                <strong>Which subscription your household is on</strong> —
                whether it is on Free, Pro or Deluxe, and when that runs out.
                <strong> We never see or hold your card details.</strong>{" "}
                Payment is handled entirely by Apple.
              </li>
              <li>
                <strong>A change log of the scoreboard</strong> — every change
                to a score is recorded so that scores can be put back if
                something goes wrong. It is a backup, and it is treated as one.
              </li>
            </ul>
            <p>
              We do not collect location data, contacts, photos, health data,
              or advertising identifiers. Dust-Up contains no analytics SDK and
              no advertising SDK, and we do not track you across other apps or
              websites.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Why we collect it</h2>
            <p>
              All of it exists to run the game: to keep the score, to show your
              household what everybody has done this week, to let people join
              your household, and to tell you when somebody has finished
              something. We do not sell data, and we do not use it for
              advertising or profiling.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Who we share it with</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Supabase</strong> (database and authentication hosting)
                — stores your account and your household&apos;s game data on our
                behalf. The database is hosted in the United Kingdom.
              </li>
              <li>
                <strong>Apple</strong> — handles signing in with Apple if you
                choose it, takes the payment for any subscription, and delivers
                the notifications the app sends.
              </li>
              <li>
                <strong>RevenueCat</strong> — tells our app whether your
                household&apos;s subscription is currently active. It receives an
                account identifier and the status of the purchase. It does not
                receive your name, your email address, or anything about your
                game.
              </li>
            </ul>
            <p>
              We do not share your data with advertisers, data brokers, or
              anyone else.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Other people in your household</h2>
            <p>
              Dust-Up is played together, so everybody in your household can
              see the board: what you have finished, how long it took, the
              points you scored, and anything you have written into the game.
              That is the game working as intended. Nobody outside your
              household can see any of it, and households cannot see each
              other.
            </p>
            <p>
              An admin in your household can remove somebody from it. Doing so
              stops that person seeing the board.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Children</h2>
            <p>
              Dust-Up is not directed at children, and a child cannot sign
              themselves up for it.
            </p>
            <p>
              On the Deluxe plan an adult in the household can add a{" "}
              <strong>child seat</strong>. A child seat is not an account.
              There is no email address, no password and no way to log in to
              it. The adult types a name and picks an emoji, and the child
              plays on a device the adult already owns and is already signed in
              on. The only personal information involved is that name, and we
              would suggest a first name or a nickname rather than a full one.
            </p>
            <p>
              An adult in the household can remove a child seat at any time,
              which removes that name. We do not knowingly collect any other
              information from or about children, and we never send a child a
              notification or show them an advert, because the app has neither.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">How long we keep it</h2>
            <p>
              Your household&apos;s game data is kept for as long as the household
              is using the app, because past seasons are part of what the app
              is for. If you ask us to delete your account, we delete it. If
              your subscription ends, nothing is deleted — the older parts of
              your record simply stop being shown until you subscribe again.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your rights</h2>
            <p>You can:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Clear your household&apos;s game</strong> from Profile →
                Start again. This wipes the board and the scores and cannot be
                undone.
              </li>
              <li>
                <strong>Ask us to delete your account</strong>, or ask us what
                data we hold about you, or ask us to correct it, by emailing{" "}
                <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
                  hello@tjcreate.co.uk
                </a>
                . We will action a deletion request within 30 days.
              </li>
            </ul>
            <p>
              If you&apos;re in the UK or EU, you have rights under UK GDPR / EU
              GDPR to access, correct, delete, or export your data, and to
              complain to the{" "}
              <a href="https://ico.org.uk" className="text-accent-link hover:text-accent-link/80">
                ICO
              </a>{" "}
              (or your local data protection authority) if you think we&apos;ve
              mishandled it.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Changes to this policy</h2>
            <p>
              If this policy changes in a way that matters, we&apos;ll update the
              date at the top and, for significant changes, let you know in the
              app.
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
            <Link href="/" className="text-accent-link hover:text-accent-link/80 transition-colors underline">
              TJCreate
            </Link>
            <Link href="/dustup/terms" className="text-accent-link hover:text-accent-link/80 transition-colors underline">
              Terms of Use
            </Link>
            <Link href="/dustup/support" className="text-accent-link hover:text-accent-link/80 transition-colors underline">
              Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
