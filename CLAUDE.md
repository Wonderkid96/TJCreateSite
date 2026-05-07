@AGENTS.md

# tjcreate.co.uk portfolio site

This is the Next.js portfolio site for Toby Johnson (TJCreate). Live at tjcreate.co.uk.

## Brain integration

Toby maintains a personal knowledge system at:
`~/Library/Mobile Documents/com~apple~CloudDocs/Brain/`

Source-of-truth pages for this project:
- [[portfolio-site]] in `Brain/wiki/freelance/portfolio-site.md` (stack, hosting, in-flight work)
- [[brand]] in `Brain/wiki/freelance/brand.md` (visual system, the site is the canonical implementation)
- [[built-tools]] in `Brain/wiki/freelance/built-tools.md` (other things Toby has shipped)

Toby's universal rules and voice are in `Brain/CLAUDE.md` and `Brain/CRITICAL_FACTS.md`. Read them before writing in his voice.

## Auto-capture rule

When you make a non-trivial decision, learn a new fact about the codebase, finish a piece of work worth remembering, or change something that future-you would want to know, append a one-line entry to:

`Brain/inbox.md`

Format: `- YYYY-MM-DD HH:MM portfolio: <thing that happened>`

Use the user's local time. Don't ask permission, just file it. Keep it terse, factual, no em dashes.

If a change is large enough to warrant updating the wiki page directly (e.g. a stack swap, a new in-flight pattern), update `Brain/wiki/freelance/portfolio-site.md` instead, and mention what changed in `Brain/log.md`.

## Voice and style

- No em dashes. Use commas, full stops, parentheses, or rewrite. This is non-negotiable.
- Direct, dry, plain. No corporate fluff. No "I'd be happy to."
- Match Toby's writing in `Brain/wiki/freelance/voice.md` if you're writing copy for the site.

## Don't

- Don't reorganise the Brain folder structure.
- Don't edit `Brain/raw/`, ever.
- Don't write long essays in wiki pages. Compact, scannable, useful.
