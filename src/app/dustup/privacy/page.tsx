import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dust-Up Privacy Policy",
  description:
    "Privacy policy for Dust-Up, the household chore game by TJCreate: what the app collects, who processes it and how to delete your data.",
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
          <p className="text-ink-soft">Last updated: 11 October 2026</p>
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
              Dust-Up holds account details, household game records, and
              information needed to run sign-in, subscriptions and optional
              notifications. We do not sell your data or use advertising SDKs.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What we collect</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Email address</strong>: to create and secure your
                account, whether you sign up with Sign in with Apple or with
                an email address and password. If you use Sign in with Apple
                and choose to hide your address, we only ever see Apple&apos;s
                private relay address.
              </li>
              <li>
                <strong>Account identifier</strong>: a unique ID that keeps
                your score attached to you.
              </li>
              <li>
                <strong>How you appear in the game</strong>: the display name
                you choose, your emoji and your colour. These can appear to
                members of your household in game screens. Service providers
                may process account and game data as described below.
              </li>
              <li>
                <strong>The game itself</strong>: the jobs on your board, who
                did what and when, how long each took, points, streaks,
                personal bests and past seasons. This is the whole point of the
                app: it is the scoreboard.
              </li>
              <li>
                <strong>Things people in your household write</strong>: the
                names of jobs, dares, notes left when a job is sent back, and
                titles of favours in the shop. These are shown within the
                household that uses them.
              </li>
              <li>
                <strong>An earlier battle cry, if you recorded one in a beta</strong>:
                a voice clip of up to five seconds. Recording and playback are
                switched off. Earlier recordings may remain in storage, and
                account deletion attempts to remove them.
              </li>
              <li>
                <strong>Your household and who is in it</strong>: which
                household you belong to, when you joined, and the invite codes
                used to let somebody in.
              </li>
              <li>
                <strong>Notification tokens, if enabled</strong>: associated
                with signed-in devices so the app can deliver optional
                household notifications. You can manage notification access
                in your device settings.
              </li>
              <li>
                <strong>Subscription and purchase information</strong>:
                household access status, purchase and entitlement details,
                expiry information, and identifiers used to connect access
                to an account. <strong>We do not hold your card details.</strong>{" "}
                Apple handles App Store payment.
              </li>
              <li>
                <strong>Score and technical records</strong>: records used to
                operate the game, investigate problems and support recovery,
                plus technical and diagnostic information processed by the
                services that run the app.
              </li>
            </ul>
            <p>
              Dust-Up does not ask for your location, contacts, photos or
              health data. We do not use advertising SDKs or track you across
              other apps and websites for advertising.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Why we collect it</h2>
            <p>
              All of it exists to run the game: to keep the score, to show your
              household what everybody has done this week, to let people join
              your household, and to tell you when somebody has finished
              something. We use scores, streaks and activity to show personal
              progress and household results. We do not sell data or use
              advertising SDKs.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Who we share it with</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Supabase</strong> (database and authentication hosting):
                stores account and household game data on our behalf,
                including earlier battle-cry recordings that remain in storage.
              </li>
              <li>
                <strong>Apple</strong>: handles signing in with Apple if you
                choose it, takes the payment for any subscription, and delivers
                the notifications the app sends.
              </li>
              <li>
                <strong>RevenueCat</strong>: tells our app whether your
                household&apos;s subscription access is active. It processes an
                account identifier, purchase and entitlement information, and
                technical information needed to provide its subscription service.
              </li>
            </ul>
            <p>
              We do not sell your data to advertisers or data brokers.
              Household content is processed by the services needed to run
              the app.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Other people in your household</h2>
            <p>
              Dust-Up is played together, so everybody in your household can
              see the board: what you have finished, how long it took, the
              points you scored, and anything you have written into the game.
              That is how the game is designed to work. Household access is
              restricted to that household; our hosting service processes
              the data to provide it.
            </p>
            <p>
              An admin in your household can remove somebody from it. Doing so
              stops that person seeing the board.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Children</h2>
            <p>
              An adult in a household can set up a child seat. A child seat
              has no separate sign-in account.
            </p>
            <p>
              On the Deluxe plan an adult in the household can add a{" "}
              <strong>child seat</strong>. A child seat is not an account.
              There is no email address, no password and no way to log in to
              it. The adult chooses a name and emoji, and the child plays on a
              device where an adult is already signed in. The seat also has
              household membership and game records. We suggest a first name
              or nickname rather than a full name.
            </p>
            <p>
              An admin can remove a child seat. Removing a seat and deleting
              shared game history are different actions. A child seat has no
              separate account or device notification token; notifications
              are associated with signed-in devices. The app does not show
              adverts.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">How long we keep it</h2>
            <p>
              Ending a subscription does not itself delete household records.
              An account-deletion request can fail or stop part way, and
              shared game records or accepted actions may remain. This page
              does not give a retention period for every type of data and
              copy. Some data may remain in device storage, backups, logs or
              provider systems after a request. Email us to ask about data
              that may remain or to make a privacy request.
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
                <strong>Ask us to delete your account</strong>, ask what data
                we hold about you, or request a correction by emailing{" "}
                <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
                  hello@tjcreate.co.uk
                </a>
                . An account-deletion request can fail or stop part way. It
                does not verify erasure from every device, backup, log or
                provider. Shared game history and records of accepted game
                actions may remain, and earlier recordings may remain if
                removal does not succeed. We do not describe retained records
                as anonymous. Contact us if the request fails or you want us
                to review data that remains. Deleting your account does not
                cancel an App Store subscription; manage that in your Apple
                Account settings.
              </li>
            </ul>
            <p>
              Depending on the law that applies, you may be able to ask for
              access, correction, deletion or a copy of your personal data, or
              object to or restrict some uses. You can also complain to the{" "}
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
