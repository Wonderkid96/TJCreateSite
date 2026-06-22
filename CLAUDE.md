@AGENTS.md

# tjcreate.co.uk portfolio site

This is the Next.js portfolio site for Toby Johnson (TJCreate). Live at tjcreate.co.uk.

## Brain integration

Toby maintains a personal knowledge system at:
`/Users/Music/Developer/Mind/Brain/`

You may **read** these pages for context:
- `Brain/wiki/freelance/portfolio-site.md` (stack, hosting, in-flight work)
- `Brain/wiki/freelance/brand.md` (visual system, the site is the canonical implementation)
- `Brain/wiki/freelance/built-tools.md` (other things Toby has shipped)
- `Brain/wiki/freelance/voice.md` for voice rules when writing copy
- `Brain/CLAUDE.md` and `Brain/CRITICAL_FACTS.md` for universal rules and voice

Start by reading `Brain/index.md` to find the right page.

## ECC harness rules

The machine runs the `everything-claude-code` plugin. Standard rules apply:

- **Use ECC tools when the task fits.** TypeScript review → `typescript-reviewer` or `/ecc:code-review`. Planning → `planner` or `/ecc:plan`. TDD → `tdd-guide`. Build/type errors → `build-error-resolver`. Next.js / library docs → `documentation-lookup` (Context7) since this Next.js version has breaking changes vs training data (see `AGENTS.md`). Voice/brand writing → `brand-voice` with `Brain/wiki/freelance/voice.md` and `brand.md` as the source profile. Name the tool in chat before invoking.
- **Brain authority wins over ECC stores.** Do not write Toby-specific facts to ECC's MCP memory graph (`mcp__plugin_everything-claude-code_memory__*`). Do not promote Toby-specific patterns via `/ecc:promote` or `/ecc:learn`. Generic coding patterns fine; identity, clients, rates, voice are Brain-only.
- **Point voice/brand skills at the Brain**, never let them create a parallel profile store.

## Voice and style

- No em dashes. Use commas, full stops, parentheses, or rewrite. This is non-negotiable.
- Direct, dry, plain. No corporate fluff. No "I'd be happy to."
- Match Toby's writing in `Brain/wiki/freelance/voice.md` if you're writing copy for the site.

## Don't

- Don't reorganise the Brain folder structure.
- Don't edit `Brain/raw/`, ever.
- Don't write long essays in wiki pages. Compact, scannable, useful.
