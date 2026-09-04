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

            {/* Deep links into the product, one step quieter than the primary
                link above (paper/45 against paper/80) so the section still
                reads as a mark, a few lines and a link rather than a menu.
                They wrap rather than scroll: four labels do not fit one line
                in the 672px column at 10px mono with 0.2em tracking, and a
                second line here costs nothing, where a horizontal scroll
                would hide half of them behind a gesture.

                No rel="nofollow": these are Toby's own products, disclosed as
                such by the `owns:` relation in the page's Organization
                schema, which is the honest way to declare the relationship.
                Marking a self-owned link nofollow would suppress the one
                thing it is here to do, which is give Googlebot a crawl path
                to pages it has discovered and never fetched. */}
            {product.deepLinks && (
              <ul
                aria-label={`More from ${product.name}`}
                className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-paper/8 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/45"
              >
                {product.deepLinks.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      className="transition-colors hover:text-accent-link"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
