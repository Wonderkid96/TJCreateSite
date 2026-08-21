import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Phony Support",
  // Root layout sets alternates.canonical to the homepage. Metadata merges
  // shallowly across segments, so without this the page would inherit that
  // and wrongly canonicalise to https://www.tjcreate.co.uk/.
  alternates: {
    canonical: "https://www.tjcreate.co.uk/phony/support",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PhonySupportPage() {
  return (
    <main className="min-h-screen bg-paper text-ink p-6">
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Phony Support</h1>
          <p className="text-ink-soft">We usually reply within a couple of days.</p>
        </div>

        <div className="space-y-6 text-base leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Get in touch</h2>
            <p>
              For bugs, questions, or anything else about Phony, email{" "}
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
            <h2 className="text-2xl font-bold">Nobody can join my case</h2>
            <p>
              An invite code is three words of four letters, like{" "}
              <span className="font-mono">atom-barn-bolt</span>. The app types the
              hyphens for you, so just type the letters. Everyone needs to be on
              the internet, though you do not need to be on the same network.
              Codes stop working once the room closes.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">The game will not start</h2>
            <p>
              Phony needs at least three players in the room before the leader can
              start a round. If somebody closes the app mid game, the room hands
              leadership to somebody else and carries on.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Report a name or a player</h2>
            <p>
              Players type their own display name, so it is possible for somebody
              to pick something offensive. If that happens, email us at the
              address above with the invite code and we will look into it. The
              quickest fix in the moment is to close the room and open a new one,
              which removes everybody and invalidates the old code.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your data</h2>
            <p>
              There is no account. Phony never asks for an email address, a
              password, or your real name, so there is no account to delete. The
              display name you type and the game data for a round are deleted
              when the room closes, and any room left idle for a day is deleted
              automatically. See the{" "}
              <Link
                href="/phony/privacy"
                className="text-accent-link hover:text-accent-link/80 underline"
              >
                Privacy Policy
              </Link>{" "}
              for the detail.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-line flex flex-wrap gap-x-6 gap-y-2">
          <Link
            href="/phony"
            className="text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            Back to Phony
          </Link>
          <Link
            href="/phony/privacy"
            className="text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </main>
  );
}
