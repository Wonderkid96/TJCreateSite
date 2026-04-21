"use client";

import {
  motion,
} from "motion/react";
import { useEffect, useState } from "react";

export default function Contact() {
  return (
    <section
      id="contact"
      // Pin --paper and --ink locally so the section is always dark
      // regardless of theme — the tunnel + its labels + the contact
      // grid are designed against a permanent dark background.
      style={
        {
          "--paper": "#f4f1e9",
          "--ink": "#0a0a0a",
        } as React.CSSProperties
      }
      className="relative px-6 md:px-10 pt-16 md:pt-20 pb-24 md:pb-32 bg-ink text-paper overflow-hidden"
    >
      <div className="flex items-start justify-between mb-10 md:mb-14">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
          [ 05 / Contact ]
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 text-right">
          Let&apos;s make
          <br />
          something!
        </div>
      </div>

      <TunnelBlock />

      <a
        href="mailto:hello@tjcreate.co.uk"
        data-cursor="view"
        data-cursor-label="EMAIL"
        className="block group mt-10 md:mt-14"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-display text-[clamp(3rem,14vw,16rem)] leading-[0.85] tracking-tighter"
        >
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
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
              viewport={{ once: true, margin: "-100px" }}
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
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-block"
            >
              .co.uk<span className="text-accent">→</span>
            </motion.span>
          </div>
        </motion.div>
      </a>

      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-paper/20 pt-10">
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
            Instagram
          </div>
          <a
            href="https://instagram.com/tj.create"
            data-cursor="hover"
            className="text-lg hover:text-accent transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            @tj.create
          </a>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-2">
            LinkedIn
          </div>
          <a
            href="https://linkedin.com/in/tobyjohnsoncreate"
            data-cursor="hover"
            className="text-lg hover:text-accent transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            /tobyjohnsoncreate
          </a>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 mb-2">
            Location
          </div>
          <div className="text-lg">Lincoln, UK</div>
        </div>
      </div>

      <div className="mt-14 md:mt-16 border-t border-paper/20 pt-10 md:pt-12">
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
        </div>
      </div>

      <div className="mt-24 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">
        <div>© Toby Johnson, 2026</div>
        <div>Made in Lincoln</div>
      </div>
    </section>
  );
}

/**
 * Tunnel block placeholder — tunnel visuals are temporarily disabled.
 * Keep the click target and center lockup clear/stable while iterating.
 */
function TunnelBlock() {
  return (
    <a
      href="mailto:hello@tjcreate.co.uk"
      data-cursor="view"
      data-cursor-label="LET'S TALK"
      aria-label="Email hello@tjcreate.co.uk"
      className="relative block w-full mx-auto overflow-hidden h-[48vh] sm:h-[52vh] md:h-[58vh] lg:h-[62vh] min-h-[300px] max-h-[78vh] select-none"
      style={{
        background:
          "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(244,241,233,0.06) 0%, rgba(10,10,10,0.25) 32%, rgba(10,10,10,0.88) 100%)",
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden
      >
        <TypeLine />
      </div>
    </a>
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
        if (prev >= full.length) {
          window.clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 66);
    return () => window.clearInterval(timer);
  }, []);

  const typed = full.slice(0, count);

  return (
    <div
      className="pointer-events-auto font-display leading-[0.9] tracking-tight whitespace-nowrap text-white transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(false)}
      style={{
        fontSize: "clamp(2.4rem, 8vw, 7.6rem)",
        textShadow: "0 1px 0 rgba(10,10,10,0.14), 0 8px 20px rgba(10,10,10,0.1)",
        transform: hovered
          ? "translateX(-0.95ch) scale(0.96)"
          : "translateX(0) scale(1)",
      }}
    >
      {typed}
      <span className="inline-flex items-end align-baseline text-accent">
        <span className="inline-block">.</span>
        <span
          className={`inline-block overflow-hidden align-bottom transition-[width] duration-240 ease-[steps(2,end)] ${hovered ? "w-[2ch]" : "w-0"}`}
        >
          ..
        </span>
        <motion.span
          className="inline-block align-baseline"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
        >
          |
        </motion.span>
      </span>
    </div>
  );
}
