@AGENTS.md

# tjcreate.co.uk portfolio site

Toby Johnson's (TJCreate) portfolio. Live at https://www.tjcreate.co.uk on Vercel (project tj-create-site); Cloudflare holds the DNS in DNS-only mode. Pushing `main` deploys production, and Claude runs that deploy after the checks below pass.

## Stack and commands

Next.js 16 App Router, React 19, Tailwind 4, `motion`, Lenis (desktop only), Playwright. Read the matching guide in `node_modules/next/dist/docs/` before using a framework API (see AGENTS.md).

- `npm run lint && npx tsc --noEmit && npm run build`
- `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test` against a local `npm start` (the default target is the live site)
- `node scripts/og-images.mjs` after changing a project's image, poster or `bg`; `node scripts/icons.mjs` after changing `src/app/icon.svg`

Done means: lint, typecheck and build clean, Playwright green locally, and the change checked in a browser at phone and desktop widths. After a deploy, check the live page, not just the Vercel status.

## Key files

- `src/lib/site.ts` holds the URL, names, contact email, social URLs and schema `@id`s. Import them; never retype them.
- `src/lib/content.ts` holds every project, service, client and FAQ. Pages, sitemap, JSON-LD and `/llms.txt` are generated from it, so copy changes go there.
- `src/app/layout.tsx` carries the metadata defaults and the JSON-LD entity graph. Project pages hang their schema off its `@id`s.
- `src/app/sitemap.ts`, `robots.ts`, `manifest.ts` and `llms.txt/route.ts` are the crawler surfaces. Bump `CONTENT_LAST_UPDATED` in the sitemap when copy changes.
- `next.config.ts` holds the redirects for retired URLs plus the security and cache headers.

## Conventions

- Images under `public/work` are WebP. Vercel passes AVIF sources through unresized, so never add an AVIF master.
- Only referenced assets go in `public/`. Masters live in the client project folders.
- Anchor targets clear the fixed header through `scroll-padding-top` on `html`, not per-id margins.
- Auto-playing motion stops on its own (WCAG 2.2.2) and respects `prefers-reduced-motion` through `useMediaQuery`.
- No prices anywhere on the site.
- Stage with named paths, never `git add -A`: `.codex/` is Codex's working folder and stays untracked.

## Don't

- Don't redesign. The look is settled; changes are content, performance and SEO unless Toby asks for more.
- Don't touch `feat/shop`. The shop is parked and must not go live.
- Don't reorganise the Brain folder structure, and don't edit `Brain/raw/`, ever.

## Brain integration

Toby's knowledge system lives at `/Users/Music/Developer/Personal/Mind/Brain/`. Read before writing copy:

- `Brain/wiki/freelance/portfolio-site.md` (stack, hosting, in-flight work)
- `Brain/wiki/freelance/brand.md` (visual system; this site is the canonical implementation)
- `Brain/wiki/freelance/built-tools.md` (other things Toby has shipped)
- `Brain/wiki/freelance/voice.md` (voice rules and banned phrases)
- `Brain/CLAUDE.md` and `Brain/CRITICAL_FACTS.md` (universal rules)

Start from `Brain/index.md` to find the right page. Facts about Toby, clients, rates and voice are Brain-only: never write them to a plugin memory or learning store, and never let a voice or brand skill build a parallel profile.

## Voice and style

- No em dashes in site copy. Use commas, full stops, parentheses, or rewrite. Non-negotiable.
- Direct, dry, plain. No corporate fluff. No "I'd be happy to."
- Match Toby's writing in `Brain/wiki/freelance/voice.md`. Copy states facts the Brain or the site already holds; invent nothing.
