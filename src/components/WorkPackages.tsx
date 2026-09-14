"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";

type PackageOffer = {
  title: string;
  description: string;
  includes: string;
  readiness: string;
  action: string;
  proof?: { href: string; label: string };
};

const PACKAGES: PackageOffer[] = [
  {
    title: "Campaign Versioning",
    description: "For agencies and brand teams with an approved campaign master ready to roll out.",
    includes: "Agreed social and display versions, built to the supplied specs and output list. Toby gives the full set a final creative review before delivery.",
    readiness: "Masters, specs and output list checked",
    action: "Discuss campaign versioning",
    proof: { href: "/projects/together-we-stand", label: "See Together We Stand" },
  },
  {
    title: "Static Artwork to Motion",
    description: "For teams with static artwork ready to move.",
    includes: "One approved artwork developed into an agreed short animation or loop, with the listed exports. Toby reviews the final motion and delivery files.",
    readiness: "Artwork supplied and motion direction approved",
    action: "Discuss a motion upgrade",
    proof: { href: "/projects/baraka-loop", label: "See Joshua Baraka" },
  },
  {
    title: "Repeatable Motion Templates",
    description: "For teams producing the same kind of motion content repeatedly.",
    includes: "A reusable motion template built around one approved format, with agreed fields, an example output and handover. Toby completes the final creative review.",
    readiness: "Format and source assets approved",
    action: "Discuss a motion template",
    proof: { href: "/projects/carousel-square", label: "See a recurring motion template" },
  },
  {
    title: "Lyric Videos",
    description: "For artists, labels and managers preparing a release.",
    includes: "One lyric video built around the supplied track, lyrics and artwork, with any agreed social edits. Toby reviews the final timing, motion and exports.",
    readiness: "Final audio, lyrics and cleared artwork supplied",
    action: "Discuss a lyric video",
    proof: { href: "/projects/jb-wrong-places", label: "See Wrong Places" },
  },
  {
    title: "Captioned Video Cutdowns",
    description: "For teams turning an approved source film into platform-ready cutdowns.",
    includes: "An agreed number of captioned cutdowns from supplied footage, sized to the confirmed output list. Toby reviews captions, crops and final exports.",
    readiness: "Source footage and output count confirmed",
    action: "Discuss captioned cutdowns",
  },
  {
    title: "Design Production Blocks",
    description: "For agencies and in-house teams needing a spare pair of hands on a defined queue.",
    includes: "A fixed two or five day block for agreed graphic and motion production tasks. Toby reviews each final asset before handover.",
    readiness: "Two or five days booked, with priorities queued",
    action: "Discuss a production block",
  },
];

export default function WorkPackages({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const offer = PACKAGES[selected];

  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        if (!compact) return;
        next = (index + 1) % PACKAGES.length;
        break;
      case "ArrowLeft":
        if (!compact) return;
        next = (index - 1 + PACKAGES.length) % PACKAGES.length;
        break;
      case "ArrowDown":
        if (compact) return;
        next = (index + 1) % PACKAGES.length;
        break;
      case "ArrowUp":
        if (compact) return;
        next = (index - 1 + PACKAGES.length) % PACKAGES.length;
        break;
      case "Home": next = 0; break;
      case "End": next = PACKAGES.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <div data-no-reveal className={compact ? "mt-6 w-full" : "mt-6 grid w-full grid-cols-[270px_minmax(0,1fr)] gap-x-10"}>
      <div role="tablist" aria-label="Packages" aria-orientation={compact ? "horizontal" : "vertical"} className={compact ? "flex flex-wrap gap-2" : "row-span-2 flex flex-col items-stretch gap-1 self-start"}>
        {PACKAGES.map((item, index) => (
          <button
            key={item.title}
            ref={(node) => { tabs.current[index] = node; }}
            type="button"
            role="tab"
            id={`package-tab-${index}`}
            aria-controls={`package-panel-${index}`}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => handleKey(event, index)}
            className={`min-h-11 rounded-[2px] border px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper ${selected === index ? "border-paper bg-paper text-ink" : "border-paper/35 text-paper hover:border-paper"}`}
          >
            {item.title}
          </button>
        ))}
      </div>
      {PACKAGES.map((item, index) => (
        <div
          key={item.title}
          id={`package-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`package-tab-${index}`}
          hidden={selected !== index}
          tabIndex={0}
          className={`${compact ? "mt-6" : "col-start-2 row-start-1"} max-w-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper`}
        >
          <p className="text-lg leading-relaxed text-paper/90">{item.description}</p>
          <dl className={compact ? "mt-5 space-y-4" : "mt-4 grid grid-cols-[minmax(0,1fr)_180px] gap-6"}>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/70">Includes</dt>
              <dd className="mt-2 text-base leading-relaxed">{item.includes}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/70">Ready to start when</dt>
              <dd className="mt-2 text-base">{item.readiness}</dd>
            </div>
          </dl>
          {item.proof && (
            <Link prefetch={false} href={item.proof.href} className="mt-3 inline-flex min-h-11 items-center text-sm text-paper/80 underline underline-offset-4 hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper">
              {item.proof.label}
            </Link>
          )}
        </div>
      ))}
      <a
        href={`mailto:hello@tjcreate.co.uk?subject=${encodeURIComponent(offer.title + " enquiry")}`}
        className="col-start-2 mt-3 flex w-fit min-h-11 self-start items-center rounded-[2px] border border-paper/50 px-5 py-2 text-base hover:bg-paper hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
      >
        {offer.action}
      </a>
      <p className={`${compact ? "mt-5" : "col-start-2"} text-sm leading-snug text-paper/65`}>
        Original concepts, key art, full identities, bespoke 3D, broadcast packages,
        print approval and open-ended retainers are scoped separately.
      </p>
    </div>
  );
}
