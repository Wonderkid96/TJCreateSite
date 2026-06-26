import type { CSSProperties } from "react";
import Image from "next/image";
import { PROJECTS, CLIENTS_WITH_LOGOS } from "@/lib/content";
import { posterFor, PreviewBanner } from "../shared";
import HeroSlider, { type Slide } from "../HeroSlider";

export const metadata = { title: "Preview · Poster" };

// Pin the palette so the image/overlay sections stay dark regardless of theme.
const DARK_VARS = {
  "--paper": "#fffdf8",
  "--ink": "#0a0a0a",
  "--muted": "#8a8378",
  "--line": "rgba(255, 253, 248, 0.14)",
} as CSSProperties;

const DISCIPLINES = [
  { n: "01", k: "Graphic", t: "Identity, print, packaging, posters." },
  { n: "02", k: "Motion", t: "Lyric videos, visualisers, titles, social." },
  { n: "03", k: "3D", t: "Product, type, scenes, campaign imagery." },
];

// Curated best work for the hero slider, in show order.
const BEST = [
  "together-we-stand",
  "jgrrey",
  "grumble",
  "offcut",
  "headphone-animation",
  "filtered-gig",
];

export default function PosterPreview() {
  const slides: Slide[] = BEST.map((slug) => PROJECTS.find((p) => p.slug === slug))
    .filter((p): p is (typeof PROJECTS)[number] => Boolean(p && posterFor(p)))
    .map((p) => ({
      src: posterFor(p)!,
      title: p.title,
      meta: `${p.title} · ${p.client}`,
      video: p.video,
    }));

  return (
    <main className="bg-ink text-paper">
      {/* ── Hero: timed best-work slider with masthead overlaid ──────────── */}
      <section style={DARK_VARS}>
        <HeroSlider slides={slides}>
          <div className="absolute inset-x-6 top-28 z-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-paper/65 md:inset-x-10">
            <span>TJCreate · Portfolio</span>
            <span>Issue 01 / 2026</span>
          </div>
          <div className="absolute inset-x-6 bottom-20 z-10 md:inset-x-10 md:bottom-24">
            <h1 className="font-expanded text-[clamp(2.6rem,12vw,12rem)] uppercase leading-[0.82] tracking-[-0.02em]">
              Toby
              <br />
              <span className="text-accent">Johnson.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-snug text-paper/85 md:text-xl">
              Graphic, motion and 3D for music, culture and brands.
            </p>
          </div>
        </HeroSlider>
      </section>

      {/* ── Manifesto ────────────────────────────────────────────────────── */}
      <section className="bg-paper px-6 py-32 text-ink md:px-10 md:py-52">
        <p className="font-expanded text-[clamp(3rem,13vw,12rem)] uppercase leading-[0.84] tracking-[-0.02em]">
          I make
          <br />
          <span className="text-accent">campaign</span>
          <br />
          worlds.
        </p>
      </section>

      {/* ── Work: tile grid of all work ──────────────────────────────────── */}
      <section id="work" className="bg-ink px-6 py-24 text-paper md:px-10 md:py-32">
        <div className="mb-12 flex items-end justify-between md:mb-16">
          <h2 className="font-expanded text-[clamp(2rem,6vw,5rem)] uppercase leading-[0.9] tracking-[-0.01em]">
            Work
          </h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/55">
            {String(PROJECTS.length).padStart(2, "0")} projects
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {PROJECTS.map((p) => {
            const src = posterFor(p);
            return (
              <a
                key={p.slug}
                href="#work"
                className="group relative block aspect-square overflow-hidden rounded-[3px]"
                style={{ backgroundColor: p.bg ?? "#0a0a0a" }}
              >
                {p.video ? (
                  <video
                    src={p.video}
                    poster={p.videoPoster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                ) : src ? (
                  <Image
                    src={src}
                    alt={p.alt ?? p.title}
                    fill
                    sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                    <span className="font-expanded text-lg uppercase tracking-wide text-paper/90">
                      {p.title}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-black/0" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="font-expanded text-base uppercase tracking-wide text-white">
                    {p.title}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                    {p.category} · {p.year}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ── Disciplines as giant numbered rows ───────────────────────────── */}
      <section>
        {DISCIPLINES.map((d, i) => (
          <div
            key={d.n}
            className={
              "flex flex-col gap-2 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-10 md:py-20 " +
              (i % 2 === 0 ? "bg-paper text-ink" : "bg-ink text-paper border-y border-paper/15")
            }
          >
            <div className="flex items-baseline gap-6">
              <span className="font-mono text-sm tracking-[0.2em] text-accent">{d.n}</span>
              <span className="font-expanded text-[clamp(3rem,11vw,9rem)] uppercase leading-[0.85] tracking-[-0.02em]">
                {d.k}
              </span>
            </div>
            <p className="max-w-xs font-mono text-[12px] uppercase leading-relaxed tracking-[0.15em] opacity-70 md:text-right">
              {d.t}
            </p>
          </div>
        ))}
      </section>

      {/* ── About: full-bleed about-me image + overlaid bold text ────────── */}
      <section
        id="about"
        style={DARK_VARS}
        className="relative flex min-h-screen items-center overflow-hidden bg-ink text-paper"
      >
        {/* Full-bleed portrait — the subject already sits to the right of frame,
            so a left-to-right darken carries the copy with no seam. */}
        <Image
          src="/work/imported/portraits/toby-about.avif"
          alt="Portrait of Toby Johnson"
          fill
          sizes="100vw"
          className="object-cover object-[58%_56%]"
        />
        {/* Darken the left for legibility; face stays clear on the right. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />
        {/* Mobile: text overlaps more, so add a vertical darken too. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent md:hidden" />

        <div className="relative w-full px-6 md:px-10">
          <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/65">
            About
          </div>
          <p className="font-expanded max-w-2xl text-[clamp(1.8rem,5.2vw,4.4rem)] uppercase leading-[0.96] tracking-tight md:max-w-3xl">
            I'm Toby, a designer building <span className="text-accent">strategic visuals</span>{" "}
            for music, culture and brands.
          </p>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/80">
            Artwork, posters, motion, 3D, socials, release campaigns, tour assets. I pull the
            pieces together so the whole thing feels intentional, not stitched together at the end.
          </p>
        </div>
      </section>

      {/* ── Positioning poster ───────────────────────────────────────────── */}
      <section className="bg-accent px-6 py-32 text-ink md:px-10 md:py-52">
        <p className="font-expanded text-[clamp(2.6rem,10vw,9rem)] uppercase leading-[0.88] tracking-[-0.02em]">
          For brands
          <br />
          with something
          <br />
          to say.
        </p>
      </section>

      {/* ── Clients as a giant type list ─────────────────────────────────── */}
      <section className="px-6 py-24 md:px-10 md:py-36">
        <div className="mb-10 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/60">
          Worked with
        </div>
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
          {CLIENTS_WITH_LOGOS.slice(0, 12).map((c) => (
            <span
              key={c.name}
              className="font-expanded text-[clamp(1.4rem,4vw,3.4rem)] uppercase leading-tight tracking-tight text-paper/40 transition-colors hover:text-paper"
            >
              {c.name}
            </span>
          ))}
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section id="contact" className="bg-paper px-6 py-32 text-ink md:px-10 md:py-44">
        <a
          href="mailto:hello@tjcreate.co.uk"
          className="font-expanded block text-[clamp(2.6rem,13vw,11rem)] uppercase leading-[0.84] tracking-[-0.02em] transition-colors hover:text-accent"
        >
          Say
          <br />
          hello<span className="text-accent">.</span>
        </a>
        <div className="mt-10 font-mono text-sm uppercase tracking-[0.2em] text-ink/60">
          hello@tjcreate.co.uk
        </div>
      </section>

      <PreviewBanner label="C — Poster (slider hero · tile grid · image about)" />
    </main>
  );
}
