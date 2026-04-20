"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const fmt = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/London",
        hour12: false,
      }).format(new Date());
      setTime(fmt);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-paper border-b border-line">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-10 py-5">
        <a
          href="#top"
          data-cursor="hover"
          aria-label="TJCREATE — Home"
          className="inline-flex items-end"
        >
          <span className="font-sans font-bold text-ink text-xl md:text-2xl leading-none tracking-[-0.01em]">
            TJCREATE
          </span>
          <span
            aria-hidden
            className="inline-block h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-accent ml-1 mb-[0.15em]"
          />
        </a>

        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.2em]">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              data-cursor="hover"
              className="relative group"
            >
              <span className="text-muted mr-2">
                0{i + 1}
              </span>
              <span className="group-hover:text-accent transition-colors">
                {l.label}
              </span>
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span>Lincoln, UK</span>
          <span className="text-muted">·</span>
          <span>{time}</span>
        </div>

        <a
          href="#contact"
          data-cursor="hover"
          className="md:hidden font-mono text-[11px] uppercase tracking-[0.2em]"
        >
          Menu
        </a>
      </div>
    </header>
  );
}
