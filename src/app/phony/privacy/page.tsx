import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Phony Privacy Policy",
  // Root layout sets alternates.canonical to the homepage. Metadata merges
  // shallowly across segments, so without this the page would inherit that
  // and wrongly canonicalise to https://www.tjcreate.co.uk/.
  alternates: {
    canonical: "https://www.tjcreate.co.uk/phony/privacy",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PhonyPrivacyPage() {
  return (
    <main className="min-h-screen bg-paper text-ink p-6">
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Phony Privacy Policy</h1>
          <p className="text-ink-soft">Last updated: 21 August 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-base leading-relaxed">
          <p>
            Phony is operated by Toby Johnson (trading as TJCreate), Lincoln, United Kingdom
            (&quot;we&quot;, &quot;us&quot;). This policy explains what data Phony collects, why, and your
            rights under UK GDPR. If you have any questions, contact us at{" "}
            <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
              hello@tjcreate.co.uk
            </a>
            .
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">The short version</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>There is no account. You never give us an email address, a password, or your real name.</li>
              <li>We store the display name you type and an anonymous ID, so the people in your game can tell each other apart.</li>
              <li>Game data is deleted when the room closes, and any room left idle for a day is deleted automatically.</li>
              <li>No analytics, no advertising, no trackers, and nothing is sold or shared for marketing.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">1. What we collect</h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold">An anonymous ID.</h3>
                <p>
                  The first time you open Phony, our backend provider (Supabase) creates an
                  anonymous identifier for your device. It is what lets the server tell one player
                  in a room from another. It is not linked to your Apple ID, your email address, or
                  anything else that identifies you, and we cannot use it to work out who you are.
                </p>
              </div>

              <div>
                <h3 className="font-bold">The name you choose.</h3>
                <p>
                  You type a display name so the rest of the room knows which card is yours. It is
                  stored on your device so you do not have to type it again, and it is stored with
                  the room while you are in a game. Pick whatever you like. It does not have to be
                  your real name.
                </p>
              </div>

              <div>
                <h3 className="font-bold">Game data.</h3>
                <p>
                  While a game is running we store the room code, who is in the room, the secret
                  word for the round, who was given the imposter card, and who voted for whom. This
                  is the game itself. Without it the app cannot work.
                </p>
              </div>

              <div>
                <h3 className="font-bold">What we do not collect.</h3>
                <p>
                  Phony does not ask for or use your location, contacts, photos, camera, microphone,
                  health data, or payment details. There is nothing to buy in the app. We do not run
                  analytics, we do not use advertising identifiers, and we do not track you across
                  other apps or websites.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">2. Who processes your data</h2>
            <p>
              <strong>Supabase</strong> is the only third party involved. It provides the anonymous
              sign-in and the database that holds the game while it is being played. Data is stored
              in Supabase&apos;s Ireland region (eu-west-1), inside the EEA. Nothing is sent anywhere
              else, and no other service receives your data.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">3. How long we keep it</h2>
            <p>
              Game data lives as long as the game does. When the last player leaves a room, the room
              and everything in it is deleted. Any room that sits untouched for 24 hours is deleted
              automatically, players included. Your display name stays on your own device until you
              change it or delete the app.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">4. Legal basis</h2>
            <p>
              We process this data under legitimate interests (UK GDPR Article 6(1)(f)), specifically
              running a game you asked to play. The amount involved is the minimum the game needs to
              function, and none of it is used to build a profile of you.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">5. Your rights</h2>
            <p>
              Under UK GDPR you have the right to access, correct, or erase your personal data, to
              object to processing, and to complain to the Information Commissioner&apos;s Office.
            </p>
            <p>
              In practice, leaving a room deletes your player record from it immediately, and
              deleting the app removes the name stored on your device. Because there is no account,
              we hold nothing that outlives your last game. If you want to make a request anyway,
              email{" "}
              <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
                hello@tjcreate.co.uk
              </a>{" "}
              and we will respond within 30 days. Be aware that without an account there may be
              nothing left for us to look up.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">6. Children</h2>
            <p>
              Phony is a party word game suitable for a general audience. It does not collect data
              for profiling or advertising, and it has no chat, no user-uploaded content, and no way
              to contact strangers. Players type a display name that is visible only to the people
              in their own room.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">7. Changes</h2>
            <p>
              If this policy changes, the date at the top of this page changes with it. Material
              changes will be noted in the app&apos;s release notes.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-line">
          <Link
            href="/phony"
            className="text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            Back to Phony
          </Link>
        </div>
      </div>
    </main>
  );
}
