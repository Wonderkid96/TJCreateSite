// Central constant so the address only needs updating in one place.
const CONTACT_EMAIL = "hello@tjcreate.co.uk";

/**
 * Legal disclosures + footer. Split out of the Contact section so the
 * "Say hello" moment can be its own full-bleed slide panel while the
 * legal/footer content flows normally below the stacked deck.
 *
 * Native <details> only (no client state), so this is a server component.
 */
export default function SiteFooter() {
  return (
    <section
      aria-label="Legal and footer"
      style={
        {
          "--paper": "#fffdf8",
          "--ink": "#0a0a0a",
        } as React.CSSProperties
      }
      className="relative bg-ink px-6 pb-14 pt-16 text-paper md:px-10 md:pb-16 md:pt-20"
    >
      <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
        Legal
      </div>

      {/* Constrained two-up so the disclosures don't span the full width. */}
      <div className="grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
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

      <footer
        aria-label="Site footer"
        className="mt-12 flex items-end justify-between border-t border-paper/15 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 md:mt-14"
      >
        <div>© Toby Johnson, 2026</div>
        <div>Made in Lincoln</div>
      </footer>
    </section>
  );
}
