// Central constant so the address only needs updating in one place.
const CONTACT_EMAIL = "hello@tjcreate.co.uk";

/**
 * Site footer, stripped to the essentials: Terms and Privacy as small-print
 * toggles, plus the copyright line. Email + socials live in the "Say hello"
 * panel directly above, so nothing else is repeated here.
 *
 * The legal text is kept behind native <details> (no client state, so this
 * stays a server component) rather than deleted — the privacy statement is a
 * real disclosure — but collapsed by default so the footer reads as small
 * print until someone wants the detail.
 */
export default function SiteFooter() {
  return (
    <section
      aria-label="Footer"
      style={
        {
          "--paper": "#fffdf8",
          "--ink": "#0a0a0a",
        } as React.CSSProperties
      }
      className="relative bg-ink px-6 py-8 text-paper md:px-10 md:py-10"
    >
      {/* Contrast deliberately not pushed lower than this. An earlier pass had
          the footer at 10px / 45-60% opacity white on pure black, directly
          under a full-height black panel — it was present but read as though
          the page simply ended. Simplified, not invisible. */}
      <div className="flex flex-col gap-5 border-t border-paper/25 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/70 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-md space-y-3">
          <LegalNote label="Terms & Conditions">
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
              <LegalEmail />.
            </li>
          </LegalNote>

          <LegalNote label="Privacy Policy">
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
              emailing <LegalEmail />.
            </li>
          </LegalNote>
        </div>

        <div className="shrink-0 text-paper/70">© Toby Johnson, 2026</div>
      </div>
    </section>
  );
}

/** One collapsed legal disclosure, rendered as small print. */
function LegalNote({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-2 text-paper/85 transition-colors hover:text-paper [&::-webkit-details-marker]:hidden">
        {label}
        <span
          aria-hidden
          className="text-paper/60 transition-transform duration-300 group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <ul className="mt-3 max-w-md list-none space-y-2 border-l border-paper/15 pl-4 text-[11px] normal-case leading-relaxed tracking-normal text-paper/80">
        {children}
      </ul>
    </details>
  );
}

function LegalEmail() {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="underline decoration-paper/40 underline-offset-4 transition-colors hover:text-accent"
    >
      {CONTACT_EMAIL}
    </a>
  );
}
