import type { CSSProperties } from "react";
import Image from "next/image";
import { PROJECTS, SERVICES, CLIENTS_WITH_LOGOS } from "@/lib/content";
import { posterFor, PreviewBanner } from "../shared";
import LogoMarquee from "@/components/LogoMarquee";

export const metadata = { title: "Preview · Poster Cover" };

// Pin the palette so dark sections stay dark regardless of theme.
const DARK_VARS = {
  "--paper": "#fffdf8",
  "--ink": "#0a0a0a",
  "--muted": "#8a8378",
  "--line": "rgba(255, 253, 248, 0.14)",
} as CSSProperties;

const CONTENTS = [
  { n: "01", k: "Work" },
  { n: "02", k: "Process" },
  { n: "03", k: "Services" },
  { n: "04", k: "Studio" },
  { n: "05", k: "Contact" },
];

export default function PosterCoverPreview() {
  const feature = PROJECTS.find((p) => p.slug === "together-we-stand") ?? PROJECTS[0];
  const grid = PROJECTS.filter((p) => posterFor(p) && p.slug !== feature.slug).slice(0, 4);

  return (
    <main className="bg-paper text-ink">
      {/* ── Cover hero (full-bleed image + masthead) ─────────────────────── */}
      <section style={DARK_VARS} className="relative min-h-screen overflow-hidden bg-ink text-paper">
        <Image
          src="/work/imported/portraits/toby-about.avif"
          alt="Portrait of Toby Johnson"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_28%] opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/55" />

        {/* Cover furniture */}
        <div className="absolute inset-x-6 top-28 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-paper/70 md:inset-x-10">
          <span>TJCreate · Portfolio</span>
          <span>Issue 01 / 2026</span>
        </div>
        <div className="absolute right-3 top-1/2 hidden origin-center -translate-y-1/2 rotate-90 font-mono text-[11px] uppercase tracking-[0.4em] text-paper/60 lg:block">
          Graphic · Motion · 3D · Lincoln UK
        </div>

        {/* Masthead — sized to stay on-screen at every width */}
        <div className="absolute inset-x-6 bottom-12 md:inset-x-10 md:bottom-16">
          <h1 className="font-expanded text-[clamp(2.6rem,12vw,12rem)] uppercase leading-[0.82] tracking-[-0.02em]">
            Toby
            <br />
            <span className="text-accent">Johnson.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-snug text-paper/85 md:text-xl">
            Campaign worlds for music, culture and brands. Graphic, motion and 3D, built as one system.
          </p>
        </div>
      </section>

      {/* ── Contents index (editorial) ───────────────────────────────────── */}
      <section className="border-b border-line px-6 py-20 md:px-10 md:py-28">
        <div className="mb-10 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">Contents</div>
        <ul className="border-t border-line">
          {CONTENTS.map((c) => (
            <li key={c.n} className="group flex items-baseline justify-between border-b border-line py-5">
              <span className="font-expanded text-[clamp(1.6rem,5vw,3.4rem)] uppercase leading-none tracking-tight transition-colors group-hover:text-accent">
                {c.k}
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{c.n}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Featured work + grid ─────────────────────────────────────────── */}
      <section id="work" className="px-6 py-24 md:px-10 md:py-32">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="font-expanded text-[clamp(2rem,6vw,5rem)] uppercase leading-[0.9] tracking-[-0.01em]">
            Selected work
          </h2>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-muted md:inline">
            Feature + index
          </span>
        </div>

        {/* Feature piece */}
        <a href="#work" className="group relative mb-6 block aspect-[16/10] w-full overflow-hidden rounded-[3px]" style={{ backgroundColor: feature.bg ?? "#111" }}>
          {posterFor(feature) && (
            <Image src={posterFor(feature)!} alt={feature.alt ?? feature.title} fill sizes="100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-black/0" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-6 md:p-8">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">Feature · {feature.category}</div>
              <div className="font-expanded mt-2 text-3xl uppercase tracking-tight text-white md:text-5xl">{feature.title}</div>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">{feature.client} · {feature.year}</div>
          </div>
        </a>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {grid.map((p) => (
            <a key={p.slug} href="#work" className="group relative block aspect-square overflow-hidden rounded-[3px]" style={{ backgroundColor: p.bg ?? "#111" }}>
              <Image src={posterFor(p)!} alt={p.alt ?? p.title} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="font-expanded text-base uppercase tracking-wide text-white">{p.title}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">{p.year}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Statement (accent field) ─────────────────────────────────────── */}
      <section className="bg-accent px-6 py-28 text-ink md:px-10 md:py-40">
        <p className="font-expanded text-[clamp(2.4rem,8vw,7rem)] uppercase leading-[0.9] tracking-[-0.02em]">
          Design with
          <br />
          a point of view.
        </p>
      </section>

      {/* ── Services as an editorial list (dark) ─────────────────────────── */}
      <section style={DARK_VARS} className="bg-ink px-6 py-24 text-paper md:px-10 md:py-32">
        <div className="mb-12 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/55">What I do</div>
        <ul className="border-t border-line">
          {SERVICES.map((s) => (
            <li key={s.num} className="grid grid-cols-1 gap-3 border-b border-line py-8 md:grid-cols-12 md:items-baseline md:gap-6">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent md:col-span-1">{s.num}</span>
              <h3 className="font-expanded text-[clamp(1.8rem,5vw,3.4rem)] uppercase leading-none tracking-tight md:col-span-5">{s.title}</h3>
              <p className="text-paper/70 md:col-span-6">{s.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Clients (marquee) ────────────────────────────────────────────── */}
      <section className="border-b border-line py-24 md:py-32">
        <div className="mb-12 flex flex-col gap-3 px-6 md:flex-row md:items-end md:justify-between md:px-10">
          <h2 className="font-expanded text-[clamp(1.8rem,5vw,4rem)] uppercase leading-[0.9] tracking-[-0.01em]">Worked with</h2>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Labels · Agencies · Artists</div>
        </div>
        <LogoMarquee items={CLIENTS_WITH_LOGOS} />
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section id="contact" style={DARK_VARS} className="bg-ink px-6 py-28 text-paper md:px-10 md:py-40">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">Let's make something</div>
        <a href="mailto:hello@tjcreate.co.uk" className="font-expanded mt-8 block text-[clamp(2.4rem,11vw,9rem)] uppercase leading-[0.86] tracking-[-0.01em] transition-colors hover:text-accent">
          hello<span className="text-accent">@</span>
          <br />
          tjcreate
          <br />
          .co.uk<span className="text-accent">→</span>
        </a>
      </section>

      <PreviewBanner label="C2 — Poster Cover (editorial)" />
    </main>
  );
}
