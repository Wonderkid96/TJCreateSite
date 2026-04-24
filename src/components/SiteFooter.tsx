"use client";

import { useState } from "react";
import SnakeGame from "./SnakeGame";
import { SocialLinks } from "./SocialIcons";

export default function SiteFooter() {
  const [snakeOpen, setSnakeOpen] = useState(false);

  return (
    <footer
      aria-label="Site footer"
      style={
        {
          "--paper": "#f4f1e9",
          "--ink": "#0a0a0a",
        } as React.CSSProperties
      }
      className="bg-ink text-paper px-6 md:px-10 pt-14 pb-10 md:pt-16 md:pb-12"
    >
      {/* Socials + email row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-paper/20 pb-10">
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

      {/* Legal dropdowns */}
      <div className="mt-10 space-y-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60 mb-5">
          Legal
        </div>

        <details className="group rounded-xl border border-paper/20 bg-paper/5 px-4 py-3 md:px-5 md:py-4">
          <summary className="list-none cursor-pointer select-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/85">
              Terms &amp; Conditions
            </span>
            <span aria-hidden className="text-paper/70 transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <ul className="mt-4 border-t border-paper/15 pt-4 space-y-2.5 text-sm md:text-[15px] leading-relaxed text-paper/80">
            <li>Project scope, timelines and fees are agreed in writing before work starts.</li>
            <li>Client-supplied assets (logos, photography, copy, music) must have rights cleared by the client.</li>
            <li>Unless otherwise agreed in writing, usage rights for final deliverables transfer after full payment.</li>
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
            <span aria-hidden className="text-paper/70 transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <ul className="mt-4 border-t border-paper/15 pt-4 space-y-2.5 text-sm md:text-[15px] leading-relaxed text-paper/80">
            <li>Personal details you share (for example by email) are used only to reply to your enquiry and manage project communication.</li>
            <li>Information is not sold or shared for third-party marketing.</li>
            <li>Data is kept only as long as needed for communication, project delivery and basic business records.</li>
            <li>
              You can request access, correction or deletion of your personal information by emailing{" "}
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

        <details
          className="group rounded-xl border border-paper/20 bg-paper/5 px-4 py-3 md:px-5 md:py-4"
          onToggle={(e) => setSnakeOpen((e.currentTarget as HTMLDetailsElement).open)}
        >
          <summary className="list-none cursor-pointer select-none flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/85">
              Snake Policy
            </span>
            <span aria-hidden className="text-paper/70 transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <SnakeGame active={snakeOpen} />
        </details>
      </div>

      {/* Copyright bar */}
      <div className="mt-16 md:mt-20 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">
        <div>© Toby Johnson, 2026</div>
        <div>Made in Lincoln</div>
      </div>
    </footer>
  );
}
