import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dust-Up Support",
  // Root layout sets alternates.canonical to the homepage. Metadata merges
  // shallowly across segments, so without this the page would inherit that
  // and wrongly canonicalise to https://www.tjcreate.co.uk/.
  alternates: {
    canonical: "https://www.tjcreate.co.uk/dustup/support",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DustUpSupportPage() {
  return (
    <main className="min-h-screen bg-paper text-ink p-6">
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Dust-Up Support</h1>
          <p className="text-ink-soft">We usually reply within a couple of days.</p>
        </div>

        <div className="space-y-6 text-base leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Get in touch</h2>
            <p>
              For bugs, questions, or anything else about Dust-Up, email{" "}
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
            <h2 className="text-2xl font-bold">Nobody can join my household</h2>
            <p>
              An invite code is eight characters, shown in two groups of four
              like <span className="font-mono">4KTM 9PBQ</span>. Each code
              works <strong>once</strong>, and it stops working after 24 hours,
              so invite one person at a time and make a fresh code for the next
              one. If a code goes astray you can revoke it, and if it has
              already been used it cannot be used again by anybody else.
            </p>
            <p>
              A free household holds two people. If the app says the house is
              full, that is what has happened — Deluxe lifts the limit.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">The week reset and I lost my points</h2>
            <p>
              The week closes at 7pm on Sunday, London time, and a new one
              starts straight after. Your points for the week that just ended
              are not lost: they go into the record. Your XP, your best streak
              and your season standing all carry across. Nothing in Dust-Up
              ever takes points away once you have earned them.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">I paid and the app still says Free</h2>
            <p>
              Give it a few seconds — the app checks with the App Store after a
              purchase and updates itself. If it is still wrong, open the
              subscription screen and tap <strong>Restore purchases</strong>,
              which is the fix for a new phone as well. Make sure you are
              signed in to the same Apple Account you bought it with. If it
              still will not budge, email us and say roughly when you bought
              it.
            </p>
            <p>
              Remember that a subscription is bought by the household, so if
              somebody you live with has already paid, you do not need to.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Cancelling</h2>
            <p>
              Subscriptions are managed by Apple, not by us: open the Settings
              app, tap your name, then Subscriptions. Cancelling stops the next
              payment and you keep everything until the period you have paid
              for runs out.
            </p>
            <p>
              <strong>Cancelling never deletes anything.</strong> Your seasons
              and your history stay exactly where they are, hidden rather than
              erased, and they all come back if you subscribe again.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Adding and removing people</h2>
            <p>
              An admin can invite somebody, remove somebody, or pause a seat
              for a person who is away. Pausing a seat keeps that person&apos;s
              record and takes them off this week&apos;s board, which is what you
              want for somebody on holiday. On Deluxe, an admin can also add a
              child seat: a name and an emoji, with no email address and no
              login, for a child playing on a device you already own.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Starting over, and deleting your data</h2>
            <p>
              Profile → Start again clears your household&apos;s board and scores.
              It cannot be undone, and it does not cancel a subscription.
            </p>
            <p>
              To delete your account altogether, email us at the address above
              from the address you signed up with and we will remove it within
              30 days. See the{" "}
              <Link
                href="/dustup/privacy"
                className="text-accent-link hover:text-accent-link/80 underline"
              >
                Privacy Policy
              </Link>{" "}
              for what is held and why.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-line flex flex-wrap gap-x-6 gap-y-2">
          <Link
            href="/"
            className="text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            TJCreate
          </Link>
          <Link
            href="/dustup/privacy"
            className="text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="/dustup/terms"
            className="text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            Terms of Use
          </Link>
        </div>
      </div>
    </main>
  );
}
