/**
 * Brand icons used across the site (About + Contact). Inline SVG so they
 * inherit currentColor for hover states and carry no extra network cost.
 * Stroke-based Instagram + solid-mark LinkedIn to sit alongside the rest
 * of the site's line-icon treatment (theme toggle, back-to-top, modal
 * close).
 */

export const INSTAGRAM_URL = "https://instagram.com/tj.create";
export const LINKEDIN_URL = "https://linkedin.com/in/tobyjohnsoncreate";
export const BEHANCE_URL = "https://www.behance.net/tobyjohnson5";

export function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="shrink-0 transition-transform duration-300 group-hover:-translate-y-[1px]"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="shrink-0 transition-transform duration-300 group-hover:-translate-y-[1px]"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export function BehanceIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="shrink-0 transition-transform duration-300 group-hover:-translate-y-[1px]"
    >
      <path d="M7.803 5.731c.589 0 1.119.051 1.605.155.483.103.895.28 1.243.529.344.248.614.568.804.974.189.404.285.904.285 1.495 0 .638-.143 1.18-.432 1.618-.288.436-.719.791-1.286 1.065.769.224 1.345.615 1.727 1.174.38.558.57 1.232.57 2.018 0 .643-.126 1.238-.378 1.729-.252.491-.598.901-1.04 1.232a4.764 4.764 0 01-1.49.699 6.608 6.608 0 01-1.745.225H1.5V5.731h6.303zm-.35 4.668c.494 0 .898-.12 1.208-.361.308-.243.464-.617.464-1.12 0-.27-.049-.494-.147-.671-.097-.179-.229-.32-.396-.42-.17-.1-.362-.17-.576-.218a3.19 3.19 0 00-.693-.066H4.059v2.856H7.453zm.16 4.884c.269 0 .525-.027.764-.079.241-.052.455-.14.644-.264.188-.124.34-.286.456-.487.115-.202.172-.458.172-.768 0-.613-.174-1.051-.521-1.315-.346-.263-.8-.396-1.362-.396H4.059v3.309h3.554zM22.5 14.485c-.335.977-.872 1.725-1.607 2.241-.736.514-1.638.773-2.711.773-.805 0-1.514-.133-2.127-.4a4.39 4.39 0 01-1.559-1.128 4.838 4.838 0 01-.954-1.712 6.81 6.81 0 01-.326-2.127c0-.757.114-1.455.346-2.094.231-.639.563-1.188.995-1.646.434-.458.958-.816 1.573-1.07.616-.256 1.308-.385 2.074-.385.811 0 1.521.153 2.126.46.605.306 1.099.714 1.482 1.22.383.506.661 1.085.832 1.734.171.65.234 1.322.191 2.018h-6.381c.029.787.271 1.393.725 1.819.455.425 1.027.638 1.717.638.539 0 .987-.122 1.347-.366.36-.245.607-.591.733-1.044l2.523.869zm-4.339-5.271c-.412 0-.77.068-1.076.205a2.304 2.304 0 00-.771.545 2.48 2.48 0 00-.466.773 3.33 3.33 0 00-.188.909h4.878c-.079-.737-.326-1.315-.748-1.737-.421-.42-.966-.695-1.629-.695zm-3.14-3.483h5.357v1.458h-5.357V5.731z" />
    </svg>
  );
}

/**
 * Horizontal Instagram + LinkedIn + Behance icon row. Reused in About (below bio)
 * and Contact footer.
 */
export function SocialLinks({
  size = 22,
  className = "",
  tone = "ink",
}: {
  size?: number;
  className?: string;
  tone?: "ink" | "paper";
}) {
  const base =
    tone === "paper"
      ? "text-paper/85 hover:text-accent"
      : "text-ink/80 hover:text-accent";
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      <a
        href={INSTAGRAM_URL}
        data-cursor="hover"
        aria-label="Toby Johnson on Instagram"
        className={`transition-colors group inline-flex ${base}`}
        target="_blank"
        rel="me noopener noreferrer"
      >
        <InstagramIcon size={size} />
      </a>
      <a
        href={LINKEDIN_URL}
        data-cursor="hover"
        aria-label="Toby Johnson on LinkedIn"
        className={`transition-colors group inline-flex ${base}`}
        target="_blank"
        rel="me noopener noreferrer"
      >
        <LinkedInIcon size={size} />
      </a>
      <a
        href={BEHANCE_URL}
        data-cursor="hover"
        aria-label="Toby Johnson on Behance"
        className={`transition-colors group inline-flex ${base}`}
        target="_blank"
        rel="me noopener noreferrer"
      >
        <BehanceIcon size={size} />
      </a>
    </div>
  );
}
