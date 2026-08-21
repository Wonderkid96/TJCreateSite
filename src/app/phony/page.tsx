import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Phony",
  // Root layout sets alternates.canonical to the homepage. Metadata merges
  // shallowly across segments, so without this the page would inherit that
  // and wrongly canonicalise to https://www.tjcreate.co.uk/.
  alternates: {
    canonical: "https://www.tjcreate.co.uk/phony",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PhonyPage() {
  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-display font-bold">Phony</h1>
          <p className="text-xl text-ink-soft">One of you is lying</p>
        </div>

        <p className="text-lg leading-relaxed text-ink">
          A party word game for three or more people in the same room. Everyone gets the same
          secret word, except one player who gets nothing at all. Take it in turns to say a word
          out loud, then vote for whoever you think is bluffing. Available on iPhone.
        </p>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">How to play</h2>
          <ol className="list-decimal list-inside space-y-2 text-base leading-relaxed">
            <li>One person opens a case and reads out the three-word code. Everyone else joins with it.</li>
            <li>Everyone looks at their own card. All but one of you gets the secret word.</li>
            <li>Going round in the order the app sets, each player says one word out loud about it.</li>
            <li>Say a word that does not hand it to the imposter, but proves to everyone else that you know it.</li>
            <li>Then everyone votes, imposter included. Sitting it out gives you away.</li>
          </ol>
        </div>

        <div className="space-y-4 pt-4">
          <p className="text-base">Something broken, or an idea for it? Get in touch:</p>
          <a
            href="mailto:hello@tjcreate.co.uk"
            className="inline-block text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            hello@tjcreate.co.uk
          </a>
        </div>

        <div className="pt-8 border-t border-line flex gap-6">
          <Link
            href="/phony/support"
            className="text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            Support
          </Link>
          <Link
            href="/phony/privacy"
            className="text-accent-link hover:text-accent-link/80 transition-colors underline"
          >
            Privacy policy
          </Link>
        </div>
      </div>
    </main>
  );
}
