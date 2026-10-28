import { FAQS } from "@/lib/content";

// FAQPage schema from the same data the section renders, so the markup and
// the answers an assistant reads can never disagree.
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

// Pin the palette dark like the panels around it.
const DARK_VARS = {
  "--paper": "#ffffff",
  "--ink": "#0a0a0a",
} as React.CSSProperties;

/**
 * Questions people put to search engines and AI assistants before they get
 * in touch. Native <details>, deliberately: no client state, so the section
 * stays a server component and every answer ships in the served HTML, where
 * crawlers read it. Do not convert this to a JS-toggled accordion.
 */
export default function Faq() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      style={DARK_VARS}
      className="bg-ink px-6 py-16 text-paper md:px-10 md:py-20"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <div className="mb-8 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/65">
        FAQ
      </div>
      <h2 id="faq-title" className="section-heading">
        Questions<span className="text-accent">.</span>
      </h2>

      <ul className="mt-10 max-w-2xl border-t border-paper/15">
        {FAQS.map((faq) => (
          <li key={faq.question} className="border-b border-paper/15">
            <details className="group py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-medium leading-snug text-paper transition-colors hover:text-paper/80 md:text-lg [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span
                  aria-hidden
                  className="mt-0.5 shrink-0 font-mono text-paper/60 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/75 md:text-base">
                {faq.answer}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
