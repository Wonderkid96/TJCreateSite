import Image from "next/image";
import { PROJECTS, SERVICES, CLIENTS_WITH_LOGOS } from "@/lib/content";
import { posterFor, PreviewBanner } from "../shared";

// ── Draft copy (confident + direct, Toby's voice). Easy to swap later. ───────
const HERO_SUB =
  "I build campaign worlds for music, culture and brands. Artwork, motion, identity and 3D, pulled into one system that actually holds together.";

const HOOK = ["Anyone can make it", "look good."];
const HOOK_ACCENT = "I make it make sense.";

const PROCESS = [
  { n: "01", k: "Listen", t: "Take the brief, the references and the friction. Find the real point before touching a pixel." },
  { n: "02", k: "Frame", t: "Shape one idea strong enough to carry the whole campaign, not just the first asset." },
  { n: "03", k: "Build", t: "Artwork, motion and 3D made as one system, so every piece feels like it belongs." },
  { n: "04", k: "Ship", t: "Deliver everything ready to run. On time, on spec, sized for every channel." },
];

const POSITION = ["Brands hire me when", "nice", "isn't enough."];

export const metadata = {
  title: "Preview · Narrative",
  robots: { index: false, follow: false },
};

export default function NarrativePreview() {
  const work = PROJECTS.slice(0, 6);

  return (
    <main className="bg-paper text-ink">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col justify-end px-6 pb-16 pt-40 md:px-10 md:pb-24">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
          Graphic · Motion · 3D · Lincoln, UK
        </div>
        <h1 className="font-expanded mt-6 text-[clamp(3.2rem,14vw,13rem)] uppercase leading-[0.86] tracking-[-0.01em]">
          Toby
          <br />
          Johnson<span className="text-accent">.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-snug text-ink/80 md:text-2xl">
          {HERO_SUB}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#work"
            className="inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-6 py-3 font-semibold text-paper transition-colors hover:border-accent hover:bg-accent"
          >
            View work <span aria-hidden>→</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            Email me <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      {/* ── Statement hook ───────────────────────────────────────────────── */}
      <section className="bg-ink px-6 py-28 text-paper md:px-10 md:py-44">
        <p className="font-expanded text-[clamp(2.4rem,8vw,7rem)] uppercase leading-[0.92] tracking-[-0.01em]">
          {HOOK.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
          <span className="block text-accent">{HOOK_ACCENT}</span>
        </p>
      </section>

      {/* ── Work ─────────────────────────────────────────────────────────── */}
      <section id="work" className="px-6 py-28 md:px-10 md:py-44">
        <div className="mb-14 flex items-end justify-between md:mb-20">
          <h2 className="font-expanded text-[clamp(2rem,6vw,5rem)] uppercase leading-[0.9] tracking-[-0.01em]">
            Selected work
          </h2>
          <div className="hidden text-right font-mono text-[11px] uppercase tracking-[0.2em] text-muted md:block">
            Print · Identity · Motion · 3D
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-7">
          {work.map((p) => {
            const src = posterFor(p);
            return (
              <a
                key={p.slug}
                href="#work"
                className="group relative block aspect-square overflow-hidden rounded-[3px]"
                style={{ backgroundColor: p.bg ?? "#0a0a0a" }}
              >
                {src && (
                  <Image
                    src={src}
                    alt={p.alt ?? p.title}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div>
                    <div className="font-expanded text-xl uppercase tracking-wide text-white">
                      {p.title}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                      {p.client} · {p.year}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                    {p.category}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section className="border-t border-line px-6 py-28 md:px-10 md:py-40">
        <div className="mb-14 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
          How it works
        </div>
        <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step) => (
            <div key={step.n} className="bg-paper p-8 md:p-10">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                {step.n}
              </div>
              <div className="font-expanded mt-6 text-3xl uppercase tracking-tight md:text-4xl">
                {step.k}
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/70">{step.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Positioning statement ────────────────────────────────────────── */}
      <section className="bg-ink px-6 py-28 text-paper md:px-10 md:py-44">
        <p className="font-expanded max-w-5xl text-[clamp(2.2rem,7vw,6rem)] uppercase leading-[0.95] tracking-[-0.01em]">
          {POSITION[0]} <span className="italic lowercase text-accent">{POSITION[1]}</span> {POSITION[2]}
        </p>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-paper/70">
          When the work has to carry weight, range and a clear point of view, that is where I do my best work.
        </p>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-28 md:px-10 md:py-44">
        <h2 className="font-expanded mb-14 text-[clamp(2rem,6vw,5rem)] uppercase leading-[0.9] tracking-[-0.01em] md:mb-20">
          What I do
        </h2>
        <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={s.title} className="bg-paper p-8 md:p-12">
              <h3 className="font-expanded text-3xl uppercase tracking-tight md:text-4xl">
                {s.title}
              </h3>
              <p className="mt-5 max-w-[30ch] leading-relaxed text-ink/70">{s.blurb}</p>
              <ul className="mt-8 space-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-3">
                    <span className="inline-block h-1 w-1 rounded-full bg-accent" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────────────── */}
      <section className="border-t border-line px-6 py-28 md:px-10 md:py-40">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] border border-line">
              <Image
                src="/work/imported/portraits/toby-about.avif"
                alt="Portrait of Toby Johnson"
                fill
                sizes="(max-width:767px) 100vw, 40vw"
                className="object-cover object-[52%_84%]"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center md:col-span-7">
            <p className="font-expanded text-[clamp(1.6rem,3.4vw,3rem)] uppercase leading-[1.02] tracking-tight">
              I&apos;m Toby, a designer building strategic visuals for music, culture and brands.
            </p>
            <p className="mt-6 max-w-[40rem] text-lg leading-relaxed text-ink/70">
              Artwork, posters, motion, 3D, socials, release campaigns, tour assets. I pull the pieces together so the whole thing feels intentional, not stitched together at the end.
            </p>
            <div
              className="mt-8 h-[2px] w-full rounded-full"
              style={{ background: "var(--spectrum)" }}
            />
          </div>
        </div>
      </section>

      {/* ── Clients ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mb-12 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
          Trusted by labels, agencies and artists
        </div>
        <div className="grid grid-cols-2 items-center gap-x-10 gap-y-10 sm:grid-cols-3 md:grid-cols-5">
          {CLIENTS_WITH_LOGOS.slice(0, 10).map((c) => (
            <div key={c.name} className="relative h-8 opacity-60">
              <Image src={c.logo} alt={c.name} fill className="object-contain" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section id="contact" className="bg-ink px-6 py-28 text-paper md:px-10 md:py-40">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">
          Let&apos;s make something
        </div>
        <a
          href="mailto:hello@tjcreate.co.uk"
          className="font-expanded mt-8 block text-[clamp(2.4rem,11vw,9rem)] uppercase leading-[0.86] tracking-[-0.01em] transition-colors hover:text-accent"
        >
          hello<span className="text-accent">@</span>
          <br />
          tjcreate
          <br />
          .co.uk<span className="text-accent">→</span>
        </a>
      </section>

      <PreviewBanner label="B — Narrative Scroll" />
    </main>
  );
}
