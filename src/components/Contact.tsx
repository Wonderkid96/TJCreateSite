"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import SnakeGame from "./SnakeGame";
import { SocialLinks } from "./SocialIcons";

export default function Contact() {
  const [snakeOpen, setSnakeOpen] = useState(false);
  return (
    <section
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
      className="relative px-6 md:px-10 pt-24 md:pt-32 pb-24 md:pb-32 bg-ink text-paper overflow-hidden"
    >
      {/* Section header — matches Work / Services / About framing:
          small mono slug + big serif heading on the left, aligned right
          label on the far side. */}
      <div className="flex items-end justify-between mb-16 md:mb-24">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 mb-4">
            [ 05 / Contact ]
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -20% 0px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] tracking-tight"
          >
            Say <span className="italic">hello</span>
          </motion.h2>
        </div>

        <div className="hidden md:block font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 text-right max-w-[24ch]">
          Let&apos;s make
          <br />
          something!
        </div>
      </div>

      <a
        href="mailto:hello@tjcreate.co.uk"
        data-cursor="view"
        data-cursor-label="EMAIL"
        className="block mt-6 md:mt-8 text-center"
      >
        <TypeLine />
      </a>

      <a
        href="mailto:hello@tjcreate.co.uk"
        data-cursor="view"
        data-cursor-label="EMAIL"
        className="block group mt-10 md:mt-14"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-display text-[clamp(3rem,14vw,16rem)] leading-[0.85] tracking-tighter"
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

      <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-paper/20 pt-10">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-2">
            Email
          </div>
          <a
            href="mailto:hello@tjcreate.co.uk"
            data-cursor="hover"
            className="text-lg hover:text-accent transition-colors"
          >
            hello@tjcreate.co.uk
          </a>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-2">
            Socials
          </div>
          <SocialLinks size={22} tone="paper" />
        </div>
      </div>

      <div className="mt-20 md:mt-24 border-t border-paper/20 pt-10 md:pt-12">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 mb-5">
          Legal
        </div>

        <div className="space-y-3">
          <details className="group rounded-xl border border-paper/20 bg-paper/5 px-4 py-3 md:px-5 md:py-4">
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
                  href="mailto:hello@tjcreate.co.uk"
                  className="underline decoration-paper/40 underline-offset-4 hover:text-accent transition-colors"
                >
                  hello@tjcreate.co.uk
                </a>
                .
              </li>
            </ul>
          </details>

          <details className="group rounded-xl border border-paper/20 bg-paper/5 px-4 py-3 md:px-5 md:py-4">
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
                  href="mailto:hello@tjcreate.co.uk"
                  className="underline decoration-paper/40 underline-offset-4 hover:text-accent transition-colors"
                >
                  hello@tjcreate.co.uk
                </a>
                .
              </li>
            </ul>
          </details>

          {/* Easter egg: Snake Policy. Renders the full game inside the
              same disclosure pattern as T&Cs / Privacy — game only runs
              while the panel is open so idle CPU stays at zero. */}
          <details
            className="group rounded-xl border border-paper/20 bg-paper/5 px-4 py-3 md:px-5 md:py-4"
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

      <footer
        aria-label="Site footer"
        className="mt-24 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50"
      >
        <div>© Toby Johnson, 2026</div>
        <div>Made in Lincoln</div>
      </footer>
    </section>
  );
}

function TypeLine() {
  const full = "Let's talk";
  const [count, setCount] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    setCount(0);
    const timer = window.setInterval(() => {
      setCount((prev) => {
        if (prev >= full.length) { window.clearInterval(timer); return prev; }
        return prev + 1;
      });
    }, 66);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="flex items-baseline justify-center font-display text-[clamp(3.5rem,13vw,16rem)] leading-[0.85] tracking-tighter text-paper whitespace-nowrap select-none transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
      style={{ transform: hovered ? "scale(0.97)" : "scale(1)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {full.slice(0, count)}
      <span className="text-accent">.</span>
      <DotSlot hovered={hovered} delayIn={40} delayOut={130} />
      <DotSlot hovered={hovered} delayIn={200} delayOut={40} />
      <motion.span
        aria-hidden
        className="text-accent"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
      >
        |
      </motion.span>
    </div>
  );
}

function DotSlot({ hovered, delayIn, delayOut }: { hovered: boolean; delayIn: number; delayOut: number }) {
  return (
    <span
      aria-hidden
      className="text-accent inline-flex items-baseline overflow-hidden"
      style={{
        maxWidth: hovered ? "1ch" : "0",
        transition: "max-width 120ms steps(1,end)",
        transitionDelay: `${hovered ? delayIn : delayOut}ms`,
      }}
    >
      <span className="whitespace-nowrap">.</span>
    </span>
  );
}
