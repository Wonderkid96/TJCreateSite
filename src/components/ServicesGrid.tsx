"use client";

import { Fragment, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useMediaQuery } from "@/lib/use-media-query";
import { SERVICES } from "@/lib/content";

/**
 * Services as a word grid: one ruled grid whose words re-label in place as you
 * scroll, instead of three boards wiping over each other. The stage pins the
 * same way the wipe did. Crossing a trigger changes the active discipline, and
 * every slot (counter, title and the nine capability cells) rolls its word up
 * to the next one with a short stagger while the blurb crossfades.
 *
 * Each slot stacks every discipline's word in one grid area and clips to the
 * tallest, so the layout never moves when the words change. The rolling words
 * are decoration (aria-hidden). The readable copy is a plain heading, paragraph
 * and list per discipline, kept in the DOM for screen readers and crawlers.
 *
 * The wrapper must NOT be overflow-hidden: that would break the sticky stage.
 */

export type Ground = "ink" | "paper";

// The ground is one colour for the whole section; the hairlines are the
// site's own: --line on paper, the Clients panel's white at 20% on ink.
const GROUNDS: Record<Ground, CSSProperties> = {
  ink: { "--g-bg": "var(--ink)", "--g-fg": "var(--paper)", "--g-line": "rgba(255, 255, 255, 0.2)" } as CSSProperties,
  paper: { "--g-bg": "var(--paper)", "--g-fg": "var(--ink)", "--g-line": "var(--line)" } as CSSProperties,
};

// Runway per discipline, in svh. The wipe used 130; the grid changes less of
// the screen at each step, so it holds a little less.
const RUNWAY_PER_STATE_VH = 120;
// Deadband so resting on a trigger can't flick between two disciplines: the
// next one comes in at its trigger and only goes back once scrolled this far
// below it.
const HYSTERESIS = 0.06;
// Delay between neighbouring cells, in reading order, when the words roll.
const STAGGER_MS = 35;

// Grid areas (row / column) for the capability cells, in reading order. Row 2's
// middle columns belong to the title block, and the top-left cell to the
// counter. Nine cells: a discipline with more than nine items needs a bigger
// grid (the screen-reader list always carries every item). A discipline with
// fewer leaves its last cells blank.
const CELLS = ["1 / 2", "1 / 3", "1 / 4", "2 / 1", "2 / 4", "3 / 1", "3 / 2", "3 / 3", "3 / 4"];

const pad = (n: number) => String(n).padStart(2, "0");

export default function ServicesGrid({ ground = "ink" }: { ground?: Ground }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const compact = useMediaQuery("(max-width: 1023px), (max-height: 760px)");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const total = SERVICES.length;
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive((prev) => {
      let next = prev;
      while (next < total - 1 && p >= (next + 1) / total) next++;
      while (next > 0 && p < next / total - HYSTERESIS) next--;
      return next;
    });
  });

  // Phones, short screens and reduced motion: no pin and no rolling words.
  // Each discipline is a block of its own with a ruled list underneath.
  if (reduced || compact) {
    return (
      <div
        ref={ref}
        id="services"
        role="region"
        aria-label="Services"
        className="services-grid"
        style={GROUNDS[ground]}
      >
        <h2 className="sr-only">Services</h2>
        {SERVICES.map((s, i) => (
          <div key={s.title} className="services-grid-block">
            <div className="services-grid-meta font-mono">
              <span>Services</span>
              <span>
                {pad(i + 1)} / {pad(total)}
              </span>
            </div>
            <h3 className="services-grid-title font-display">
              {s.title}
              <span className="text-accent">.</span>
            </h3>
            <p className="services-grid-copy">{s.blurb}</p>
            <ul role="list" className="services-grid-list font-display">
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
              {/* Keeps an odd list's last row ruled as two cells. */}
              {s.items.length % 2 === 1 && <li aria-hidden="true" />}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      id="services"
      role="region"
      aria-label="Services"
      className="services-grid relative"
      style={{ ...GROUNDS[ground], height: `${total * RUNWAY_PER_STATE_VH}svh` }}
    >
      <div className="sr-only">
        <h2>Services</h2>
        {SERVICES.map((s) => (
          <div key={s.title}>
            <h3>{s.title}</h3>
            <p>{s.blurb}</p>
            <ul>
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div aria-hidden="true" className="sticky top-0 h-svh overflow-hidden">
        <div className="services-grid-board">
          <div className="services-grid-cell services-grid-meta font-mono" style={{ gridArea: "1 / 1" }}>
            <span>Services</span>
            <span>
              <Slot inline options={SERVICES.map((_, i) => pad(i + 1))} active={active} delay={0} /> /{" "}
              {pad(total)}
            </span>
          </div>

          <div className="services-grid-cell services-grid-centre" style={{ gridArea: "2 / 2 / 3 / 4" }}>
            <Slot
              className="services-grid-title font-display"
              options={SERVICES.map((s) => (
                <Fragment key={s.title}>
                  {s.title}
                  <span className="text-accent">.</span>
                </Fragment>
              ))}
              active={active}
              delay={0}
            />
            <div className="services-grid-blurbs">
              {SERVICES.map((s, i) => (
                <p key={s.title} className="services-grid-copy" data-active={i === active}>
                  {s.blurb}
                </p>
              ))}
            </div>
          </div>

          {CELLS.map((area, k) => (
            <div key={area} className="services-grid-cell" style={{ gridArea: area }}>
              <Slot
                className="services-grid-word font-display"
                options={SERVICES.map((s) => s.items[k] ?? "")}
                active={active}
                delay={(k + 1) * STAGGER_MS}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// One slot: every option sits in the same grid area, so the slot takes the
// size of the largest and clips the rest. The active option sits at 0, earlier
// ones above and later ones below, so stepping forward rolls the words up and
// stepping back rolls them down.
function Slot({
  options,
  active,
  delay,
  inline = false,
  className = "",
}: {
  options: ReactNode[];
  active: number;
  delay: number;
  inline?: boolean;
  className?: string;
}) {
  return (
    <span className={`slot ${inline ? "slot-inline" : ""} ${className}`}>
      {options.map((option, i) => (
        <span
          key={i}
          className="slot-option"
          style={{ transform: `translateY(${(i - active) * 100}%)`, transitionDelay: `${delay}ms` }}
        >
          <span>{option}</span>
        </span>
      ))}
    </span>
  );
}
