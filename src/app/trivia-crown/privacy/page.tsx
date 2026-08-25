import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trivia Crown Privacy Policy",
  // Root layout sets alternates.canonical to the homepage. Metadata merges
  // shallowly across segments, so without this the page would inherit that
  // and wrongly canonicalise to https://www.tjcreate.co.uk/.
  alternates: {
    canonical: "https://www.tjcreate.co.uk/trivia-crown/privacy",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-paper text-ink p-6">
      <div className="max-w-3xl mx-auto py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Trivia Crown Privacy Policy</h1>
          <p className="text-ink-soft">Last updated: 25 August 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-base leading-relaxed">
          <p>
            Trivia Crown is operated by Toby Johnson (trading as TJCreate), Lincoln, United
            Kingdom (&quot;we&quot;, &quot;us&quot;). Trivia Crown is a production tool that creates quiz
            episodes and publishes them to our own YouTube channel. This policy explains what
            data it touches and why. If you have any questions, contact us at{" "}
            <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
              hello@tjcreate.co.uk
            </a>
            .
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">The short version</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Trivia Crown signs in to one Google account: our own, the one that owns the Trivia Crown YouTube channel.</li>
              <li>It uses that access to upload our videos, set their titles, descriptions, thumbnails and playlists, and to read our own channel&apos;s performance figures.</li>
              <li>It does not collect anything from viewers, and it cannot access anybody else&apos;s Google account.</li>
              <li>We do not sell data, and we do not use it for advertising or cross-app tracking.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">1. Google and YouTube data we access</h2>
            <p>
              Trivia Crown uses YouTube API Services. When the operator authorises it, Google
              issues a token that lets the tool act on the Trivia Crown channel only. With that
              token it can:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>upload video files to the channel and set their metadata, thumbnails, chapters and scheduled publication time;</li>
              <li>create and update playlists on the channel;</li>
              <li>read the channel&apos;s own analytics, such as views and audience retention, so we can judge which episodes worked.</li>
            </ul>
            <p>
              That is the full extent of it. The tool has no ability to read a viewer&apos;s
              account, watch history, subscriptions or any other person&apos;s data.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">2. Where that data is stored</h2>
            <p>
              The authorisation token is stored on the operator&apos;s own computer, in a file that
              is not shared, published or committed to any code repository. Analytics figures we
              retrieve are kept locally alongside our production records. No Google or YouTube
              data is sent to any third party.
            </p>
            <p>
              Access can be withdrawn at any time from{" "}
              <a
                href="https://myaccount.google.com/permissions"
                className="text-accent-link hover:text-accent-link/80"
              >
                Google account permissions
              </a>
              , which immediately revokes the token and stops the tool publishing.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">3. Viewers of the channel</h2>
            <p>
              If you watch a Trivia Crown video on YouTube, your relationship is with YouTube,
              not with us. YouTube collects data about that visit under its own policies, and we
              receive only aggregate figures for our own channel, such as total views and
              average watch time. We cannot identify individual viewers.
            </p>
            <p>
              Comments you leave are public and are handled by YouTube. We may read, reply to,
              hide or remove comments on our own videos.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">4. Limited use</h2>
            <p>
              Trivia Crown&apos;s use of information received from Google APIs adheres to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                className="text-accent-link hover:text-accent-link/80"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements. We do not transfer this data to others,
              use it for advertising, or allow humans to read it except where required for
              security, to comply with the law, or where the operator is inspecting their own
              channel&apos;s figures.
            </p>
            <p>
              By using YouTube API Services, this tool is also bound by the{" "}
              <a href="https://www.youtube.com/t/terms" className="text-accent-link hover:text-accent-link/80">
                YouTube Terms of Service
              </a>
              , and Google&apos;s handling of data is described in the{" "}
              <a href="https://policies.google.com/privacy" className="text-accent-link hover:text-accent-link/80">
                Google Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">5. Other services we use to make episodes</h2>
            <p>
              These handle episode production, not personal data. No viewer information reaches
              any of them.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>ElevenLabs</strong>: converts our written quiz-master script into narration.
              </li>
              <li>
                <strong>Anthropic (Claude API)</strong>: drafts and independently checks quiz questions before they are used.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">6. Your rights</h2>
            <p>
              Under UK GDPR you have the right to access, correct, delete or port your data, to
              object to or restrict processing, and to withdraw consent. Since Trivia Crown holds
              no personal data about viewers, there is normally nothing for us to return, but if
              you believe we hold something about you, email{" "}
              <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
                hello@tjcreate.co.uk
              </a>{" "}
              and we will respond within one month.
            </p>
            <p>
              You also have the right to complain to the UK Information Commissioner&apos;s Office (
              <a href="https://ico.org.uk" className="text-accent-link hover:text-accent-link/80">
                ico.org.uk
              </a>
              ).
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">7. Changes</h2>
            <p>
              We may update this policy. We will change the &quot;last updated&quot; date above.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">8. Contact</h2>
            <p>
              Toby Johnson (TJCreate), Lincoln, United Kingdom.{" "}
              <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
                hello@tjcreate.co.uk
              </a>
            </p>
          </div>

          <div className="pt-8 border-t border-line">
            <Link
              href="/trivia-crown"
              className="text-accent-link hover:text-accent-link/80 transition-colors underline"
            >
              Back to Trivia Crown
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
