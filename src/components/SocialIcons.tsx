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
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.2.247 1.986 1.217 2.47.402.205.813.311 1.219.311 1.319 0 2.016-.681 2.313-1.752l2.007.8zM15.998 13.368h4.931c-.056-1.132-.547-2.143-2.306-2.143-1.655 0-2.532 1.019-2.625 2.143zM6.272 20.089l-2.283-3.917H3.03V20.09H0V4h6.272c2.56 0 4.534 1.345 4.534 5.999 0 2.565-.967 4.312-2.573 5.115L11 20.089H6.272zm.48-10.05c0-2.078-.968-3.039-2.626-3.039H3.03v6.164h1.096c1.658 0 2.626-1.063 2.626-3.126z" />
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
