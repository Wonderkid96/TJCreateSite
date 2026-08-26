import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dust-Up Terms of Use",
  // Root layout sets alternates.canonical to the homepage. Metadata merges
  // shallowly across segments, so without this the page would inherit that
  // and wrongly canonicalise to https://www.tjcreate.co.uk/.
  alternates: {
    canonical: "https://www.tjcreate.co.uk/dustup/terms",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DustUpTermsPage() {
  return (
    <main className="min-h-screen bg-paper text-ink p-6">
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Dust-Up Terms of Use</h1>
          <p className="text-ink-soft">Last updated: 26 August 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-base leading-relaxed">
          <p>
            These terms govern your use of Dust-Up, made by Toby Johnson,
            trading as TJCreate (&quot;we&quot;, &quot;us&quot;). By creating an
            account, you agree to them.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your account</h2>
            <p>
              You must provide accurate information when you sign up, and
              you&apos;re responsible for keeping your account secure. You must be
              at least 13 years old to hold an account, and old enough to use
              Dust-Up under the law in your country. Children younger than that
              can play through a child seat set up by an adult in the
              household, which is not an account and cannot be logged in to.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Households</h2>
            <p>
              Dust-Up is played by a household. Whoever creates the household
              is its admin, and can invite people in with a code, remove them
              again, and add or remove child seats. Everybody in a household
              can see the household&apos;s board and everything on it. If you
              don&apos;t want somebody to see what you do in the app, don&apos;t
              share a household with them.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Subscriptions</h2>
            <p>
              Dust-Up is free to play. The whole game — every job, the full
              scoreboard, this week&apos;s numbers, the current season and all the
              Extras — is free for two adults for as long as you like. Two
              optional subscriptions add to it:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Dust-Up Pro</strong> — £1.99 per month, or £19.99 per
                year. Adds the record: every past season, all-time numbers, and
                the history of each individual job.
              </li>
              <li>
                <strong>Dust-Up Deluxe</strong> — £4.99 per month, or £49.99
                per year, and includes everything in Pro. Adds the house:
                everybody past the free two, child seats, family mode and
                shared-device seats.
              </li>
            </ul>
            <p>
              Prices are shown in the App Store in your own currency before you
              buy, and the price shown there at the time of purchase is the one
              that applies.
            </p>
            <p>
              <strong>
                A subscription belongs to the household, not to the person who
                paid for it.
              </strong>{" "}
              Everybody in the household gets it at once. New households get a
              free 14-day trial of Deluxe, once.
            </p>
            <p>The usual App Store rules apply, and they are Apple&apos;s, not ours:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Payment is charged to your Apple Account when you confirm the
                purchase.
              </li>
              <li>
                A subscription renews automatically unless you turn off
                auto-renew at least 24 hours before the end of the current
                period.
              </li>
              <li>
                Your Apple Account is charged for the renewal within the 24
                hours before the current period ends.
              </li>
              <li>
                You can manage your subscription, or turn off auto-renew, in
                your Apple Account settings after buying it. We cannot do it
                for you.
              </li>
              <li>
                Refunds are handled by Apple under their terms, not by us,
                though do email us if something has gone wrong and we will help
                where we can.
              </li>
            </ul>
            <p>
              <strong>Nothing is deleted if a subscription ends.</strong> Your
              record is still there; the parts a subscription unlocks simply
              stop being shown until you subscribe again, and everything comes
              back when you do.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What a subscription does not do</h2>
            <p>
              Nothing you can buy affects the score. There are no bought
              points, no multipliers, no streak insurance and no extra spins of
              the wheel, and there never will be. A paying household and a free
              one score exactly the same for exactly the same work. What is
              sold is the record and the size of the household, never an
              advantage in the game.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">There is no real money in the game</h2>
            <p>
              The coins in Dust-Up are not money. They cannot be bought, sold,
              exchanged or cashed out, they have no value outside your own
              household, and they buy nothing except the favours you and the
              people you live with have written for each other. The Gamble
              wheel never spins for money. Forfeits and dares are written by
              your household and must never be money either.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Things you write</h2>
            <p>
              You write your own job names, your own dares and forfeits, your
              own shop favours and your own notes. We don&apos;t generate them and
              we don&apos;t moderate them, because they never leave your
              household — but you are responsible for what you write, and for
              keeping it lawful and appropriate for everybody who shares the
              household with you. If children are in your household, the adults
              in it are responsible for what those children can see.
            </p>
            <p>
              You keep ownership of what you write. By putting it into the app
              you give us permission to store it and show it to your own
              household, and to nobody else.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>use Dust-Up to harass, coerce or intimidate anybody you live with</li>
              <li>set a forfeit or dare that is unlawful, dangerous, degrading, or sexual</li>
              <li>attempt to reach another household&apos;s data, or to get around the app&apos;s security</li>
              <li>attempt to access another person&apos;s account</li>
              <li>share invite codes with people you would not let into your home</li>
            </ul>
            <p>We may suspend or remove accounts that break these terms.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Dust-Up is a game, not a contract</h2>
            <p>
              What the app scores, and what you agree to do about it, is
              between the people in your household. We are not a party to it.
              Dust-Up does not enforce anything, and a forfeit is only ever
              worth what the people who wrote it decide it is worth.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">No warranty</h2>
            <p>
              Dust-Up is provided as-is. We work to keep it reliable, and the
              scoreboard is backed up, but we don&apos;t guarantee the app will be
              error-free or available at all times. Nothing here limits any
              liability that cannot be limited by law, including your statutory
              rights as a consumer.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Ending your account</h2>
            <p>
              You can clear your household&apos;s game at any time from Profile →
              Start again, and you can ask us to delete your account by
              emailing{" "}
              <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
                hello@tjcreate.co.uk
              </a>
              . Deleting your account does not cancel a subscription — do that
              in your Apple Account settings.
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
            <h2 className="text-2xl font-bold">Governing law</h2>
            <p>
              These terms are governed by the law of England and Wales. If
              you&apos;re a consumer, you keep the protection of the mandatory law
              of the country you live in.
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
            <Link href="/dustup/privacy" className="text-accent-link hover:text-accent-link/80 transition-colors underline">
              Privacy Policy
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
