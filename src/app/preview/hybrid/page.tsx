import type { CSSProperties } from "react";
import Image from "next/image";
import { PROJECTS, SERVICES, CLIENTS_WITH_LOGOS } from "@/lib/content";
import { posterFor, PreviewBanner } from "../shared";
import LogoMarquee from "@/components/LogoMarquee";

export const metadata = {
  title: "Preview · Hybrid",
  robots: { index: false, follow: false },
};

// Pin the palette so the hero stays dark regardless of the active theme,
// matching how Services/Contact lock their own dark backgrounds.
const DARK_VARS = {
  "--paper": "#fffdf8",
  "--ink": "#0a0a0a",
  "--muted": "#8a8378",
} as CSSProperties;

// ── Draft copy (confident + direct, Toby's voice). Swap freely. ──────────────
const HERO_SUB =
  "Graphic, motion and 3D for music, culture and brands. Campaign worlds built as one system, not stitched together at the end.";

const PROCESS = [
  { n: "01", k: "Listen", t: "Take the brief, the references and the friction. Find the real point before touching a pixel." },
  { n: "02", k: "Frame", t: "Shape one idea strong enough to carry the whole campaign, not just the first asset." },
  { n: "03", k: "Build", t: "Artwork, motion and 3D made as one system, so every piece feels like it belongs." },
  { n: "04", k: "Ship", t: "Deliver everything ready to run. On time, on spec, sized for every channel." },
];

export default function HybridPreview() {
  const work = PROJECTS.slice(0, 6);

  return (
    <main className="bg-paper text-ink">
      {/* ── Hero (bold dark type — C's punch, full name kept on-screen) ───── */}
      <section
        style={DARK_VARS}
        className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-ink px-6 pb-16 pt-32 text-paper md:px-10 md:pb-24"
      >
        <div className="absolute inset-x-6 top-28 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-paper/55 md:inset-x-10">
          <span>Graphic · Motion · 3D</span>
          <span className="hidden sm:inline">Est. Lincoln, UK</span>
        </div>
        {/* Sized so the widest word (JOHNSON) stays fully inside the viewport at
            every breakpoint — bold, but never clipped off the edge. */}
        <h1 className="font-expanded text-[clamp(2.4rem,12vw,12rem)] uppercase leading-[0.84] tracking-[-0.015em]">
          Toby
          <br />
          <span className="text-accent">Johnson.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-snug text-paper/80 md:text-2xl">{HERO_SUB}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#work" className="inline-flex items-center gap-2 rounded-full border border-paper bg-paper px-6 py-3 font-semibold text-ink transition-colors hover:border-accent hover:bg-accent hover:text-paper">
            View work <span aria-hidden>→</span>
          </a>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-paper px-6 py-3 font-semibold text-paper transition-colors hover:border-accent hover:text-accent">
            Email me <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      {/* ── Manifesto hook (paper — alternates with the dark hero above) ──── */}
      <section className="px-6 py-28 md:px-10 md:py-44">
        <p className="font-expanded text-[clamp(2.4rem,11vw,11rem)] uppercase leading-[0.86] tracking-[-0.02em]">
          I make
          <br />
          <span className="text-accent">campaign</span> worlds.
        </p>
      </section>

      {/* ── Work (on the homepage) ───────────────────────────────────────── */}
      <section id="work" className="px-6 py-28 md:px-10 md:py-40">
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
              <a key={p.slug} href="#work" className="group relative block aspect-square overflow-hidden rounded-[3px]" style={{ backgroundColor: p.bg ?? "#0a0a0a" }}>
                {src && (
                  <Image src={src} alt={p.alt ?? p.title} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div>
                    <div className="font-expanded text-xl uppercase tracking-wide text-white">{p.title}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">{p.client} · {p.year}</div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">{p.category}</span>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section className="border-t border-line px-6 py-28 md:px-10 md:py-40">
        <div className="mb-14 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">How it works</div>
        <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step) => (
            <div key={step.n} className="bg-paper p-8 md:p-10">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{step.n}</div>
              <div className="font-expanded mt-6 text-3xl uppercase tracking-tight md:text-4xl">{step.k}</div>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/70">{step.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Positioning (full-bleed accent field) ────────────────────────── */}
      <section className="bg-accent px-6 py-28 text-ink md:px-10 md:py-44">
        <p className="font-expanded text-[clamp(2.6rem,9vw,8rem)] uppercase leading-[0.9] tracking-[-0.02em]">
          For brands
          <br />
          with something
          <br />
          to say.
        </p>
        <p className="mt-10 max-w-xl text-lg leading-relaxed text-ink/80">
          When the work has to carry weight, range and a clear point of view, that is where I do my best work.
        </p>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="px-6 py-28 md:px-10 md:py-40">
        <h2 className="font-expanded mb-14 text-[clamp(2rem,6vw,5rem)] uppercase leading-[0.9] tracking-[-0.01em] md:mb-20">What I do</h2>
        <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={s.title} className="bg-paper p-8 md:p-12">
              <h3 className="font-expanded text-3xl uppercase tracking-tight md:text-4xl">{s.title}</h3>
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
              <Image src="/work/imported/portraits/toby-about.avif" alt="Portrait of Toby Johnson" fill sizes="(max-width:767px) 100vw, 40vw" className="object-cover object-[52%_84%]" />
            </div>
          </div>
          <div className="flex flex-col justify-center md:col-span-7">
            <p className="font-expanded text-[clamp(1.6rem,3.4vw,3rem)] uppercase leading-[1.02] tracking-tight">
              I&apos;m Toby, a designer building strategic visuals for music, culture and brands.
            </p>
            <p className="mt-6 max-w-[40rem] text-lg leading-relaxed text-ink/70">
              Artwork, posters, motion, 3D, socials, release campaigns, tour assets. I pull the pieces together so the whole thing feels intentional, not stitched together at the end.
            </p>
            <div className="mt-8 h-[2px] w-full rounded-full" style={{ background: "var(--spectrum)" }} />
          </div>
        </div>
      </section>

      {/* ── Clients (bold header + auto-scrolling logo marquee) ──────────── */}
      <section className="border-t border-line py-24 md:py-32">
        <div className="mb-12 flex flex-col gap-3 px-6 md:flex-row md:items-end md:justify-between md:px-10">
          <h2 className="font-expanded text-[clamp(1.8rem,5vw,4rem)] uppercase leading-[0.9] tracking-[-0.01em]">
            Worked with
          </h2>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Labels · Agencies · Artists
          </div>
        </div>
        {/* Mask-rendered logos in one uniform weight, slow auto-scroll —
            fixes the uneven-weight clutter of a static grid. */}
        <LogoMarquee items={CLIENTS_WITH_LOGOS} />
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section id="contact" className="bg-ink px-6 py-28 text-paper md:px-10 md:py-40">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">Let&apos;s make something</div>
        <a href="mailto:hello@tjcreate.co.uk" className="font-expanded mt-8 block text-[clamp(2.4rem,11vw,9rem)] uppercase leading-[0.86] tracking-[-0.01em] transition-colors hover:text-accent">
          hello<span className="text-accent">@</span>
          <br />
          tjcreate
          <br />
          .co.uk<span className="text-accent">→</span>
        </a>
      </section>

      <PreviewBanner label="Hybrid — B structure + C boldness + logos" />
    </main>
  );
}
