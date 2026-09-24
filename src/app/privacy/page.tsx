import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  // Root layout canonicalises to the homepage; override so this page doesn't inherit it.
  alternates: {
    canonical: "https://www.tjcreate.co.uk/privacy",
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
          <h1 className="text-4xl font-display font-bold mb-2">Privacy Policy</h1>
          <p className="text-ink-soft">Last updated: 24 September 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-base leading-relaxed">
          <p>
            This site and the tools below are run by Toby Johnson (trading as TJCreate), Lincoln,
            United Kingdom. Questions go to{" "}
            <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
              hello@tjcreate.co.uk
            </a>
            . Each app has its own policy on its own page.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">This website</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>No accounts, no forms, no advertising or tracking cookies.</li>
              <li>
                Vercel Speed Insights records anonymous page performance figures (load times, not who
                you are).
              </li>
              <li>Fonts are served by Adobe Fonts, which sees your IP address when it delivers them.</li>
              <li>If you email me, I keep that conversation to reply and work with you. Nothing is sold or shared.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">TJ Mail Bridge</h2>
            <p>
              TJ Mail Bridge is a private tool that lets me read, organise and draft email in my own
              Gmail accounts from my own computer. It is not offered to anyone else.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>It only accesses Gmail accounts I own and have signed in with myself.</li>
              <li>Email data stays on my machine. It is not stored on any server, sold, or used for advertising.</li>
              <li>
                Its use of Google data follows the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  className="text-accent-link hover:text-accent-link/80"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </li>
              <li>
                Access can be revoked at any time from{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  className="text-accent-link hover:text-accent-link/80"
                >
                  your Google account permissions
                </a>
                .
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your rights</h2>
            <p>
              Under UK GDPR you can ask to see, correct or delete anything I hold about you. Email{" "}
              <a href="mailto:hello@tjcreate.co.uk" className="text-accent-link hover:text-accent-link/80">
                hello@tjcreate.co.uk
              </a>
              . You can also complain to the Information Commissioner&apos;s Office (
              <a href="https://ico.org.uk" className="text-accent-link hover:text-accent-link/80">
                ico.org.uk
              </a>
              ).
            </p>
          </div>

          <div className="pt-8 border-t border-line">
            <Link href="/" className="text-accent-link hover:text-accent-link/80 transition-colors underline">
              Back to TJCreate
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
