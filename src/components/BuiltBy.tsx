import Image from "next/image";
import { OWN_PRODUCTS } from "@/lib/content";

/**
 * Own products — things built under TJCreate rather than for a client.
 *
 * Deliberately the smallest section on the page. It sits between the client
 * wall and the contact panel, and it is not a sales pitch: a mark, a few
 * lines, and a link. Anything bigger competes with the work above it.
 */
export default function BuiltBy() {
  return (
    <section
      id="built"
      aria-label="Products built by TJCreate"
      className="bg-ink px-6 py-14 text-paper md:px-10 md:py-16"
    >
      <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/50">
        Also built
      </div>

      <ul className="flex max-w-2xl flex-col gap-10">
        {OWN_PRODUCTS.map((product) => (
          <li key={product.name} className="border-t border-paper/12 pt-6">
            <Image
              src={product.logo}
              alt={`${product.name} logo`}
              width={product.logoWidth}
              height={product.logoHeight}
              className="h-auto w-[124px]"
            />

            <p className="mt-5 text-sm leading-relaxed text-paper/70">
              {product.blurb}
            </p>

            {/* Native <details>, deliberately: no client state, so this whole
                section stays a server component and the expanded copy ships
                inside the served HTML. Crawlers index expand/collapse text
                they can see in the markup; they do not index text a click has
                to go and fetch. Do not convert this to a JS-toggled panel. */}
            <details className="group mt-4">
              <summary className="flex w-fit cursor-pointer list-none items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50 transition-colors hover:text-paper [&::-webkit-details-marker]:hidden">
                {product.detailsLabel}
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="mt-3 space-y-2.5 border-l border-paper/15 pl-4 text-[13px] leading-relaxed text-paper/60">
                {product.details.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </details>

            <a
              href={product.url}
              className="mt-5 inline-flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/80 transition-colors hover:text-accent-link"
            >
              {product.linkLabel}
              <span aria-hidden>&rarr;</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
