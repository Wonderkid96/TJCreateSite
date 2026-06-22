// Central constant so the address only needs updating in one place.
const CONTACT_EMAIL = "hello@tjcreate.co.uk";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

/**
 * Site footer: wordmark + positioning, location/availability, quick nav, and
 * legal disclosures. Email + socials live in the "Say hello" panel directly
 * above, so they're intentionally not repeated here.
 *
 * Native <details> only (no client state), so this is a server component.
 */
export default function SiteFooter() {
  return (
    <section
      aria-label="Footer"
      style={
        {
          "--paper": "#fffdf8",
          "--ink": "#0a0a0a",
          "--signal": "#80ef80",
        } as React.CSSProperties
      }
      className="relative bg-ink px-6 pb-12 pt-16 text-paper md:px-10 md:pb-14 md:pt-20"
    >
      <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr]">
        {/* Brand + positioning + availability */}
        <div>
          <a
            href="#top"
            data-cursor="hover"
            aria-label="TJCREATE — back to top"
            className="font-display text-2xl leading-none tracking-[-0.02em] md:text-3xl"
          >
            TJCREATE<span className="text-accent">.</span>
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/60">
            Graphic and motion design for record labels, artists and brands.
          </p>
          <div className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/70">
            <span aria-hidden className="relative inline-flex h-1.5 w-1.5">
              <span
                className="absolute inset-0 rounded-full opacity-70 animate-ping"
                style={{ backgroundColor: "var(--signal)" }}
              />
              <span
                className="relative inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--signal)" }}
              />
            </span>
            Available for work
          </div>
          <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/45">
            Lincoln, UK · Working remotely
          </div>
        </div>

        {/* Quick nav */}
        <nav aria-label="Footer">
          <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/45">
            Menu
          </div>
          <ul className="space-y-2.5">
            {NAV.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  data-cursor="hover"
                  className="font-display text-lg uppercase tracking-tight text-paper/85 transition-colors hover:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Legal — constrained two-up, not full width */}
      <div className="mt-14">
        <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/45">
          Legal
        </div>
        <div className="grid max-w-xl grid-cols-1 gap-3">
          <details className="group rounded-[2px] border border-paper/20 bg-paper/5 px-4 py-3 md:px-5 md:py-4">
            <summary className="flex list-none cursor-pointer select-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
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
            <ul className="mt-4 space-y-2.5 border-t border-paper/15 pt-4 text-sm leading-relaxed text-paper/80">
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
                  className="underline decoration-paper/40 underline-offset-4 transition-colors hover:text-accent"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </li>
            </ul>
          </details>

          <details className="group rounded-[2px] border border-paper/20 bg-paper/5 px-4 py-3 md:px-5 md:py-4">
            <summary className="flex list-none cursor-pointer select-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
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
            <ul className="mt-4 space-y-2.5 border-t border-paper/15 pt-4 text-sm leading-relaxed text-paper/80">
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
                  className="underline decoration-paper/40 underline-offset-4 transition-colors hover:text-accent"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </li>
            </ul>
          </details>
        </div>
      </div>

      {/* Bottom row */}
      <footer
        aria-label="Site footer"
        className="mt-12 flex flex-wrap items-end justify-between gap-3 border-t border-paper/15 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 md:mt-14"
      >
        <div>© Toby Johnson, 2026</div>
        <div>Made in Lincoln</div>
      </footer>
    </section>
  );
}
