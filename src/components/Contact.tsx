"use client";

import { motion } from "motion/react";
import { useEffect, useState, useRef, lazy, Suspense } from "react";
import SnakeGame from "./SnakeGame";
import { SocialLinks } from "./SocialIcons";

const Envelope3D = lazy(() => import("./Envelope3D"));

// Central constant so the address only needs updating in one place.
const CONTACT_EMAIL = "hello@tjcreate.co.uk";

export default function Contact() {
  const [snakeOpen, setSnakeOpen] = useState(false);
  // Passed to Envelope3D so mouse tracking covers the full section,
  // not just the 55% canvas box.
  const sectionRef = useRef<HTMLElement>(null);

  // R3F + postprocessing is heavy: a continuous useFrame loop, multiple
  // lights, env map, chromatic aberration. Two perf gates:
  //  1. Skip on touch / coarse pointer devices — the 3D @ relies on cursor
  //     movement to feel alive, and it's the single biggest GPU cost on
  //     the page on mobile.
  //  2. On desktop, only mount once the section is close to view, so the
  //     Canvas isn't burning frames while the user is reading further up.
  const [showEnvelope, setShowEnvelope] = useState(false);
  // Eager mount once the browser is idle. The chunk and font are already
  // preloaded by Splash, so this just lets the WebGL context allocate,
  // parse the font, build TextGeometry and paint the first frame while
  // the user is still up the page. By the time they scroll to Contact
  // the scene is running, so there is no visible pop-in mid-scroll.
  // Touch / coarse-pointer devices stay opted out (the 3D @ feeds off
  // cursor movement and is the page's heaviest GPU cost).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    type IdleWindow = Window & {
      requestIdleCallback?: (
        cb: IdleRequestCallback,
        opts?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWindow;

    let id: number;
    if (w.requestIdleCallback) {
      id = w.requestIdleCallback(() => setShowEnvelope(true), { timeout: 800 });
    } else {
      id = window.setTimeout(() => setShowEnvelope(true), 250);
    }
    return () => {
      if (w.cancelIdleCallback) w.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);
  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact — say hello"
      // Pin --paper and --ink locally so the section is always dark
      // regardless of theme — the contact labels + grid are designed
      // against a permanent dark background.
      style={
        {
          "--paper": "#f4f1e9",
          "--ink": "#0a0a0a",
        } as React.CSSProperties
      }
      className="relative px-6 md:px-10 pt-20 md:pt-24 pb-20 md:pb-24 bg-ink text-paper overflow-hidden"
    >
      {/* 3D @ — covers top 55% of section only, fades out before content below.
          Only mounted once the section is near the viewport so the R3F
          loop doesn't burn frames while the user is browsing further up
          the page. */}
      <div className="absolute inset-x-0 top-0 h-[54%] pointer-events-none" aria-hidden>
        {showEnvelope && (
          <Suspense fallback={null}>
            <Envelope3D trackRef={sectionRef} />
          </Suspense>
        )}
      </div>

      {/* EMAIL cursor zone — header + big email link only.
          Cursor resets to default below this div. */}
      <div data-cursor="view" data-cursor-label="EMAIL" className="relative z-10">

      {/* Section header */}
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 mb-4">
            [ 04 / Contact ]
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -20% 0px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-tight"
          >
            Email <span className="italic">me</span>
          </motion.h2>
        </div>

        <div className="hidden md:block font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 text-right max-w-[24ch]">
          Available for commissions,
          <br />
          campaigns and ongoing support
        </div>
      </div>

      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="block group mt-3 md:mt-5"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-display text-[clamp(2.8rem,11vw,9rem)] leading-[0.86] tracking-tight"
        >
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-block"
            >
              hello<span className="text-accent">@</span>
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 1.1, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-block italic"
            >
              tjcreate
            </motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "0px 0px -20% 0px" }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-block"
            >
              .co.uk<span className="text-accent">→</span>
            </motion.span>
          </div>
        </motion.div>
      </a>

      </div>{/* end EMAIL cursor zone */}

      {/* Grid, legal and footer — default cursor from here down */}
      <div className="relative z-10">

      <div className="mt-14 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-paper/20 pt-8">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-2">
            Email
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            data-cursor="hover"
            className="text-lg hover:text-accent transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-2">
            Socials
          </div>
          <SocialLinks size={22} tone="paper" />
        </div>
      </div>

      <div className="mt-14 md:mt-16 border-t border-paper/20 pt-8 md:pt-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 mb-5">
          Legal
        </div>

        <div className="space-y-3">
          <details className="group rounded-[2px] border border-paper/20 bg-paper/5 px-4 py-3 md:px-5 md:py-4">
            <summary className="list-none cursor-pointer select-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/85">
                Terms &amp; Conditions
              </span>
              <span
                aria-hidden
                className="text-paper/70 transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <ul className="mt-4 border-t border-paper/15 pt-4 space-y-2.5 text-sm md:text-[15px] leading-relaxed text-paper/80">
              <li>
                Project scope, timelines and fees are agreed in writing before work starts.
              </li>
              <li>
                Client-supplied assets (logos, photography, copy, music) must have rights cleared
                by the client.
              </li>
              <li>
                Unless otherwise agreed in writing, usage rights for final deliverables transfer
                after full payment.
              </li>
              <li>
                For legal queries or a project-specific agreement, email{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="underline decoration-paper/40 underline-offset-4 hover:text-accent transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </li>
            </ul>
          </details>

          <details className="group rounded-[2px] border border-paper/20 bg-paper/5 px-4 py-3 md:px-5 md:py-4">
            <summary className="list-none cursor-pointer select-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/85">
                Privacy Policy
              </span>
              <span
                aria-hidden
                className="text-paper/70 transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <ul className="mt-4 border-t border-paper/15 pt-4 space-y-2.5 text-sm md:text-[15px] leading-relaxed text-paper/80">
              <li>
                Personal details you share (for example by email) are used only to reply to your
                enquiry and manage project communication.
              </li>
              <li>Information is not sold or shared for third-party marketing.</li>
              <li>
                Data is kept only as long as needed for communication, project delivery and basic
                business records.
              </li>
              <li>
                You can request access, correction or deletion of your personal information by
                emailing{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="underline decoration-paper/40 underline-offset-4 hover:text-accent transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </li>
            </ul>
          </details>

          {/* Easter egg: Snake Policy. Renders the full game inside the
              same disclosure pattern as T&Cs / Privacy — game only runs
              while the panel is open so idle CPU stays at zero. */}
          <details
            className="group rounded-[2px] border border-paper/20 bg-paper/5 px-4 py-3 md:px-5 md:py-4"
            onToggle={(e) => setSnakeOpen((e.currentTarget as HTMLDetailsElement).open)}
          >
            <summary className="list-none cursor-pointer select-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/85">
                Snake Policy
              </span>
              <span
                aria-hidden
                className="text-paper/70 transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <SnakeGame active={snakeOpen} />
          </details>
        </div>
      </div>

      </div>{/* end grid/legal zone */}

      <footer
        aria-label="Site footer"
        className="relative z-10 mt-16 md:mt-18 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50"
      >
        <div>© Toby Johnson, 2026</div>
        <div>Made in Lincoln</div>
      </footer>
    </section>
  );
}
