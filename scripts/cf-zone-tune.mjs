#!/usr/bin/env node
/**
 * Apply the zone-level performance and security settings for tjcreate.co.uk.
 *
 *   node scripts/cf-zone-tune.mjs            # dry run, prints current vs desired
 *   node scripts/cf-zone-tune.mjs --apply    # writes the changes
 *
 * Reads CLOUDFLARE_ZONE_API_TOKEN from .env.local (never printed).
 * Token needs, scoped to the tjcreate.co.uk zone:
 *   Zone -> Zone           -> Read
 *   Zone -> Zone Settings  -> Edit
 *
 * Every setting here is a single toggle in the Cloudflare dashboard, so any
 * change is trivially reversible. Deliberately NOT touched:
 *   - rocket_loader: already off, and must stay off. It defers and reorders
 *     scripts, which breaks hydration on a React app.
 *   - polish / mirage / webp: paid features, not editable on the Free plan.
 *   - cache rules for /work/*: unnecessary. Media already returns
 *     cf-cache-status HIT under Cloudflare's default extension caching, and
 *     next.config.ts already sends the long max-age + stale-while-revalidate.
 *   - edge-caching HTML: would serve stale pages after a Vercel deploy unless
 *     the cache is purged on every push. Not worth the failure mode.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://api.cloudflare.com/client/v4";
const ZONE_NAME = "tjcreate.co.uk";
const APPLY = process.argv.includes("--apply");

/**
 * Desired state. `why` is printed in the dry run so the reasoning travels with
 * the change rather than living only in a commit message.
 */
const DESIRED = [
  {
    id: "early_hints",
    value: "on",
    why: "Sends a 103 Early Hints response carrying the page's preconnect/preload hints, so the browser can open the Adobe Typekit connection while the origin is still generating the HTML. The display face is render-blocking and cross-origin, so this is the single biggest free LCP win available here.",
  },
  {
    id: "always_use_https",
    value: "on",
    why: "Redirects any plain http request to https at the edge. Without it an http hit depends on the origin or HSTS to upgrade, which is a wasted round trip and leaks one plaintext request.",
  },
  {
    id: "min_tls_version",
    value: "1.2",
    why: "TLS 1.0 and 1.1 are deprecated and fail modern security scans. 1.2 has been universal since roughly 2015; the only clients dropped are ones that cannot render this site anyway.",
  },
  {
    id: "browser_cache_ttl",
    value: 0,
    why: 'Sets "Respect Existing Headers" so the Cache-Control that next.config.ts sends for /work/* (max-age=604800 + stale-while-revalidate) is authoritative, instead of a dashboard value silently competing with it.',
  },
];

function fail(msg) {
  console.error(`\nERROR: ${msg}\n`);
  process.exit(1);
}

function loadToken() {
  let raw;
  try {
    raw = readFileSync(join(ROOT, ".env.local"), "utf8");
  } catch {
    fail(".env.local not found at repo root.");
  }
  const m = raw.match(/^CLOUDFLARE_ZONE_API_TOKEN\s*=\s*(.+?)\s*$/m);
  if (!m || !m[1]) fail("CLOUDFLARE_ZONE_API_TOKEN is not set in .env.local.");
  return m[1].replace(/^["']|["']$/g, "");
}

async function cf(token, path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const body = await res.json().catch(() => null);
  if (!body) fail(`Non-JSON response from ${path} (HTTP ${res.status}).`);
  if (!body.success) {
    const errs = (body.errors || []).map((e) => `  [${e.code}] ${e.message}`).join("\n");
    fail(`Cloudflare rejected ${init.method || "GET"} ${path} (HTTP ${res.status}):\n${errs}`);
  }
  return body.result;
}

const token = loadToken();

const zones = await cf(token, `/zones?name=${encodeURIComponent(ZONE_NAME)}`);
if (!zones.length) fail(`No zone named ${ZONE_NAME} visible to this token.`);
const zone = zones[0];
console.log(`Zone: ${zone.name}  plan: ${zone.plan?.name}\n`);

const current = Object.fromEntries(
  (await cf(token, `/zones/${zone.id}/settings`)).map((s) => [s.id, s])
);

const pending = [];
for (const d of DESIRED) {
  const s = current[d.id];
  if (!s) {
    console.log(`SKIP    ${d.id}: not present on this zone`);
    continue;
  }
  if (!s.editable) {
    console.log(`SKIP    ${d.id}: not editable on the ${zone.plan?.name} plan`);
    continue;
  }
  if (JSON.stringify(s.value) === JSON.stringify(d.value)) {
    console.log(`OK      ${d.id}: already ${JSON.stringify(d.value)}`);
    continue;
  }
  pending.push({ ...d, from: s.value });
}

if (!pending.length) {
  console.log("\nNothing to change.");
  process.exit(0);
}

console.log("\nChanges to make:\n");
for (const p of pending) {
  console.log(`  ${p.id}: ${JSON.stringify(p.from)} -> ${JSON.stringify(p.value)}`);
  console.log(`    ${p.why}\n`);
}

if (!APPLY) {
  console.log("DRY RUN. Nothing was changed. Re-run with --apply to write it.");
  process.exit(0);
}

for (const p of pending) {
  await cf(token, `/zones/${zone.id}/settings/${p.id}`, {
    method: "PATCH",
    body: JSON.stringify({ value: p.value }),
  });
  console.log(`applied  ${p.id} -> ${JSON.stringify(p.value)}`);
}

// Read back rather than trusting the write responses.
const after = Object.fromEntries(
  (await cf(token, `/zones/${zone.id}/settings`)).map((s) => [s.id, s])
);
console.log("\nRead-back:");
let drift = false;
for (const p of pending) {
  const got = after[p.id]?.value;
  const ok = JSON.stringify(got) === JSON.stringify(p.value);
  if (!ok) drift = true;
  console.log(`  ${ok ? "ok  " : "DRIFT"} ${p.id} = ${JSON.stringify(got)}`);
}
process.exit(drift ? 1 : 0);
