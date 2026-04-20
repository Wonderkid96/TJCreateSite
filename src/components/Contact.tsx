"use client";

import { motion } from "motion/react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative px-6 md:px-10 py-24 md:py-40 bg-ink text-paper overflow-hidden"
    >
      <div className="flex items-start justify-between mb-16 md:mb-24">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
          [ 05 — Contact ]
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 text-right">
          Let&apos;s make
          <br />
          something good.
        </div>
      </div>

      <a
        href="mailto:hello@tjcreate.co.uk"
        data-cursor="view"
        data-cursor-label="EMAIL"
        className="block group"
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

      <div className="mt-24 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">
        <div>© Toby Johnson, 2026</div>
        <div>Made in Lincoln</div>
      </div>
    </section>
  );
}
