import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ferret Privacy Policy",
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
          <h1 className="text-4xl font-display font-bold mb-2">Ferret Privacy Policy</h1>
          <p className="text-ink-soft">Last updated: 17 June 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-6 text-base leading-relaxed">
          <p>
            Ferret is operated by Toby Johnson (trading as TJCreate), Lincoln, United Kingdom
            (&quot;we&quot;, &quot;us&quot;). This policy explains what data Ferret collects, why, and your rights
            under UK GDPR. If you have any questions, contact us at{" "}
            <a href="mailto:hello@tjcreate.co.uk" className="text-accent hover:text-accent/80">
              hello@tjcreate.co.uk
            </a>
            .
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">The short version</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Your scan photos stay on your device. We send an image to our AI providers only to identify the item in it. We do not store your photos on our servers.</li>
              <li>We collect the minimum needed to run your account, your subscription, and the scan limits.</li>
              <li>We do not sell your data, and we do not use it for advertising or cross-app tracking.</li>
              <li>You can delete your account and all associated data from inside the app at any time.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">1. What we collect</h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold">Account information.</h3>
                <p>
                  When you sign in with Apple, we receive a user identifier and your email address (which may be an Apple private-relay address), and optionally the name you choose to share. This is stored by our backend provider (Supabase) to operate your account.
                </p>
              </div>

              <div>
                <h3 className="font-bold">Subscription information.</h3>
                <p>
                  If you subscribe to Ferret Pro, our payments provider (RevenueCat) and Apple process your purchase. We receive your subscription status and a subscription identifier. We never receive or store your card or payment details; those are handled by Apple.
                </p>
              </div>

              <div>
                <h3 className="font-bold">Usage information.</h3>
                <p>
                  We record scan events (the type of scan and a timestamp) so we can enforce free and Pro scan limits and understand overall usage. These records are linked to your account identifier.
                </p>
              </div>

              <div>
                <h3 className="font-bold">Scan feedback.</h3>
                <p>
                  If you mark a result as correct or incorrect, we store that feedback to improve identification accuracy.
                </p>
              </div>

              <div>
                <h3 className="font-bold">Photos and scans.</h3>
                <p>
                  The photos you capture are stored only on your device, in the app&apos;s private storage, as your scan History. To identify an item, the app sends the relevant image to our AI providers for processing. We do not retain those images on our servers after the identification request.
                </p>
              </div>

              <div>
                <h3 className="font-bold">We do not collect your location.</h3>
                <p>
                  Ferret does not request or use location data.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">2. Who processes your data</h2>
            <p>
              We use the following providers to deliver the service. Each acts as a processor or independent service under its own terms:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Supabase</strong> — account, authentication, and the usage/feedback records described above.
              </li>
              <li>
                <strong>Google (Gemini API)</strong> — receives a scan image to identify the item. Used for processing only.
              </li>
              <li>
                <strong>Anthropic (Claude API)</strong> — receives a scan image when you choose Deep Search (a Pro feature), to provide a closer second-opinion check. Used for processing only.
              </li>
              <li>
                <strong>eBay</strong> — receives a text description of an identified item (not your photo) to return recent completed-listing prices, for Pro users.
              </li>
              <li>
                <strong>RevenueCat and Apple</strong> — subscription processing and Sign in with Apple.
              </li>
            </ul>
            <p>
              We send these providers only what each needs for its task. We do not authorise them to use your data to train models on our behalf or for their own advertising.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">3. Why we can use your data (legal bases)</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide the app and your account, and to deliver scans you request (performance of a contract).</li>
              <li>To enforce scan limits and keep the service working and secure (legitimate interests).</li>
              <li>To process your subscription (performance of a contract).</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">4. How long we keep it</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Account and subscription records: for as long as you have an account.</li>
              <li>Usage and feedback records: retained while your account is active.</li>
              <li>Photos: kept on your device until you delete them or the app; not stored by us.</li>
              <li>When you delete your account (see below), your account, usage, and feedback records are removed.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">5. Your rights</h2>
            <p>
              Under UK GDPR you have the right to access, correct, delete, or port your data, to object to or restrict processing, and to withdraw consent. To exercise any of these, email{" "}
              <a href="mailto:hello@tjcreate.co.uk" className="text-accent hover:text-accent/80">
                hello@tjcreate.co.uk
              </a>
              .
            </p>
            <p>
              You can delete your account and all associated data directly in the app: Settings → Delete account. This permanently removes your account, scan history, and local data.
            </p>
            <p>
              You also have the right to complain to the UK Information Commissioner&apos;s Office ({" "}
              <a href="https://ico.org.uk" className="text-accent hover:text-accent/80">
                ico.org.uk
              </a>
              ).
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">6. AI-generated results</h2>
            <p>
              Item identifications, price estimates, and eBay completed-listing references shown in Ferret are AI-generated estimates for guidance only. They are not valuations or financial advice. Always check an item yourself before buying.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">7. Children</h2>
            <p>
              Ferret is not directed at children and is rated 4+. We do not knowingly collect data from children.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">8. Changes</h2>
            <p>
              We may update this policy. We will change the &quot;last updated&quot; date above and, for significant changes, surface a notice in the app.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">9. Contact</h2>
            <p>
              Toby Johnson (TJCreate), Lincoln, United Kingdom —{" "}
              <a href="mailto:hello@tjcreate.co.uk" className="text-accent hover:text-accent/80">
                hello@tjcreate.co.uk
              </a>
            </p>
          </div>

          <div className="pt-8 border-t border-line">
            <Link href="/ferret" className="text-accent hover:text-accent/80 transition-colors underline">
              Back to Ferret
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
