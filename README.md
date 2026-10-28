# tjcreate.co.uk

Portfolio site for Toby Johnson (TJCreate), freelance graphic and motion designer in Lincoln. Live at https://www.tjcreate.co.uk on Vercel; pushing `main` deploys production.

## Stack

Next.js 16 (App Router), React 19, Tailwind 4, `motion`, Lenis for desktop smooth scrolling, Playwright for tests. Node 22.18 or newer (the asset scripts import TypeScript directly).

## Commands

| Task | Command |
| --- | --- |
| Dev server | `npm run dev` |
| Production build and serve | `npm run build && npm start` |
| Lint and typecheck | `npm run lint && npx tsc --noEmit` |
| Tests against the live site | `npm run test:visual` |
| Tests against a local server | `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test` |
| Regenerate share images | `node scripts/og-images.mjs` |
| Regenerate icons and favicon | `node scripts/icons.mjs` |

Run the share-image script after changing any project's image, poster or background colour; run the icon script after changing `src/app/icon.svg`.

## Where things live

- `src/lib/site.ts`: site URL, names, contact email, social profiles and the schema.org `@id`s. Everything imports from here.
- `src/lib/content.ts`: projects, services, clients and FAQ. The pages, the sitemap, the JSON-LD and `/llms.txt` are all generated from this file.
- `src/app/layout.tsx`: metadata defaults and the JSON-LD entity graph (Person, ProfessionalService, SoftwareApplication, WebSite).
- `src/app/projects/[slug]/page.tsx`: one page per project with breadcrumb, WebPage and VideoObject or ImageObject schema.
- `src/app/sitemap.ts`, `robots.ts`, `manifest.ts`, `llms.txt/route.ts`: crawler surfaces. Bump `CONTENT_LAST_UPDATED` in the sitemap when copy changes.
- `next.config.ts`: redirects for retired URLs, security headers and cache headers.
- `src/app/<app>/`: landing, privacy, support and terms pages for the apps TJCreate publishes.
- `public/og/`: generated share images, one per project. `public/icons/`: generated PWA icons.

## Conventions

- Images under `public/work` are WebP. Vercel's image optimiser passes AVIF through unresized, so do not add AVIF sources.
- Only referenced files go in `public/`. Masters stay in the client project folders.
- Auto-playing motion stops on its own and respects `prefers-reduced-motion` via the `useMediaQuery` hook.
- Site copy is UK English with no em dashes, and the site never shows prices.

## Checks before deploying

Lint, typecheck and build clean; Playwright green against a local production build (`tests/seo.spec.ts` covers the schema, sitemap, redirects and headers); the change looked at in a browser at phone and desktop widths.
