import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dust-Up Terms of Use",
  description:
    "Terms of use for Dust-Up, the household chore game by TJCreate.",
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
          <p className="text-ink-soft">Last updated: 11 October 2026</p>
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
              Dust-Up offers access through App Store subscriptions. The
              available products, features, eligibility, price and billing
              period are shown in the app and in Apple&apos;s purchase
              confirmation before you buy. The offer shown there applies to
              that purchase. We do not list fixed prices or renewal terms in
              these terms because they can vary by storefront and current
              offer.
            </p>
            <p>
              Apple processes App Store payments. You can manage or cancel an
              active subscription in your Apple Account settings. Apple&apos;s
              purchase confirmation shows the terms that apply, including any
              renewal details. Contact us if you need help with the app.
            </p>
            <p>
              Ending a subscription does not itself delete household records.
              Access to older records or other features may change. See the{" "}
              <Link href="/dustup/privacy" className="text-accent-link hover:text-accent-link/80 underline">
                Privacy Policy
              </Link>{" "}
              for information about retention. Deleting your account does not
              cancel an App Store subscription.
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
              You write your own job names, dares and forfeits, shop favours
              and notes. You are responsible for what you write and for
              keeping it lawful and appropriate for everybody who shares the
              household with you. If children use a child seat in your
              household, adults are responsible for what they can see.
            </p>
            <p>
              You keep ownership of what you write. By putting it into the app
              you allow us to store and show it to your household to run the
              service. The service providers that process data are described
              in the{" "}
              <Link href="/dustup/privacy" className="text-accent-link hover:text-accent-link/80 underline">
                Privacy Policy
              </Link>
              .
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
              Dust-Up is provided as-is. We work to keep it reliable. We
              cannot confirm backup coverage or restoration behavior for
              every record. We don&apos;t guarantee the app will be error-free or
              available at all times. Nothing here limits any
              liability that cannot be limited by law, including your statutory
              rights as a consumer.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Ending your account</h2>
            <p>
              You can clear your household&apos;s game from Profile → Start again.
              You can ask us to delete your account by emailing{" "}
              <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
                hello@tjcreate.co.uk
              </a>
              . A deletion request can fail or stop part way. Shared game
              history and accepted game records may remain, and deletion is
              not verified across every device, backup, log or provider. See
              the{" "}
              <Link href="/dustup/privacy" className="text-accent-link hover:text-accent-link/80 underline">
                Privacy Policy
              </Link>{" "}
              for more information. Deleting your account does not cancel an
              App Store subscription; manage that in your Apple Account settings.
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
              Toby Johnson (TJCreate), Lincoln, United Kingdom:{" "}
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
