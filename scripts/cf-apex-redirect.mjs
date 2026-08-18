#!/usr/bin/env node
/**
 * Create the apex -> www 301 redirect for tjcreate.co.uk in Cloudflare.
 *
 *   node scripts/cf-apex-redirect.mjs            # dry run, changes nothing
 *   node scripts/cf-apex-redirect.mjs --apply    # writes the rule
 *
 * Reads CLOUDFLARE_ZONE_API_TOKEN from .env.local (never printed).
 * Token needs, scoped to the tjcreate.co.uk zone only:
 *   Zone -> Zone             -> Read
 *   Zone -> Dynamic Redirect -> Edit
 *
 * Why a script and not a curl one-liner: the dynamic-redirect phase is written
 * with a PUT to the phase entrypoint, and that PUT REPLACES every rule in the
 * phase. A naive curl would silently wipe any other redirect rules on the zone.
 * This reads the current rules first and appends to them.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://api.cloudflare.com/client/v4";

const APEX = "tjcreate.co.uk";
const CANONICAL = "https://www.tjcreate.co.uk";
const PHASE = "http_request_dynamic_redirect";
const RULE_DESCRIPTION = "Apex to www 301 (canonical host)";

const APPLY = process.argv.includes("--apply");

function loadToken() {
  let raw;
  try {
    raw = readFileSync(join(ROOT, ".env.local"), "utf8");
  } catch {
    fail(".env.local not found at repo root.");
  }
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*CLOUDFLARE_ZONE_API_TOKEN\s*=\s*(.+?)\s*$/);
    if (m) {
      const v = m[1].replace(/^["']|["']$/g, "");
      if (v) return v;
    }
  }
  fail(
    "CLOUDFLARE_ZONE_API_TOKEN is not set in .env.local.\n" +
      "Add it, then re-run. See the header of this file for the exact token scopes."
  );
}

function fail(msg) {
  console.error(`\nERROR: ${msg}\n`);
  process.exit(1);
}

/**
 * @param opts.softNotFound  Return null on a 404 instead of exiting. Used for
 *   the phase entrypoint, which legitimately does not exist until the zone has
 *   its first redirect rule.
 */
async function cf(token, path, init = {}, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  let body;
  try {
    body = await res.json();
  } catch {
    fail(`Non-JSON response from ${path} (HTTP ${res.status}).`);
  }
  if (!body.success && res.status === 404 && opts.softNotFound) return null;
  if (!body.success) {
    const errs = (body.errors || [])
      .map((e) => `  [${e.code}] ${e.message}`)
      .join("\n");
    fail(
      `Cloudflare rejected ${init.method || "GET"} ${path} (HTTP ${res.status}):\n${errs || "  (no detail)"}`
    );
  }
  return body.result;
}

const token = loadToken();

// 1. Confirm the token works and report its scope-relevant state.
const verify = await cf(token, "/user/tokens/verify");
console.log(`Token status: ${verify.status}`);

// 2. Resolve the zone.
const zones = await cf(token, `/zones?name=${encodeURIComponent(APEX)}`);
if (!zones.length) {
  fail(
    `No zone named ${APEX} visible to this token.\n` +
      "Check the token's Zone Resources include that zone, and that it has Zone -> Zone -> Read."
  );
}
const zone = zones[0];
console.log(`Zone: ${zone.name}  id=${zone.id}  status=${zone.status}`);

// 3. Read the existing rules in the dynamic-redirect phase.
//    A 404 here just means the phase entrypoint has not been created yet.
const rs = await cf(
  token,
  `/zones/${zone.id}/rulesets/phases/${PHASE}/entrypoint`,
  {},
  { softNotFound: true }
);
const entrypointExists = rs !== null;
const existing = entrypointExists ? rs.rules || [] : [];

console.log(
  `\nExisting rules in ${PHASE}: ${entrypointExists ? existing.length : "none (phase not yet created)"}`
);
existing.forEach((r, i) => {
  console.log(`  ${i + 1}. ${r.description || "(no description)"}`);
  console.log(`     when: ${r.expression}`);
});

// 4. Idempotency: bail if a rule already targets the apex host.
const clash = existing.find(
  (r) => r.description === RULE_DESCRIPTION || (r.expression || "").includes(`"${APEX}"`)
);
if (clash) {
  console.log(
    `\nA rule matching the apex host already exists ("${clash.description || "no description"}").` +
      "\nNothing to do. Delete or edit it in the dashboard if it is wrong."
  );
  process.exit(0);
}

// 5. Build the new rule. Path and query string are preserved, so deep links
//    and campaign parameters survive the hop.
const rule = {
  description: RULE_DESCRIPTION,
  expression: `(http.host eq "${APEX}")`,
  action: "redirect",
  action_parameters: {
    from_value: {
      status_code: 301,
      target_url: {
        expression: `concat("${CANONICAL}", http.request.uri.path)`,
      },
      preserve_query_string: true,
    },
  },
  enabled: true,
};

const payload = {
  rules: [...existing, rule],
};

console.log("\nRule to add:");
console.log(`  when:   http.host eq "${APEX}"`);
console.log(`  then:   301 -> concat("${CANONICAL}", http.request.uri.path)`);
console.log(`  query:  preserved`);
console.log(`\nPUT would send ${payload.rules.length} rule(s) total (existing + this one).`);

if (!APPLY) {
  console.log("\nDRY RUN. Nothing was changed. Re-run with --apply to write it.");
  process.exit(0);
}

// 6. Write. PUT on the phase entrypoint replaces the whole rule list, which is
//    why `existing` is carried through above.
await cf(token, `/zones/${zone.id}/rulesets/phases/${PHASE}/entrypoint`, {
  method: "PUT",
  body: JSON.stringify(payload),
});

console.log("\nApplied. Verifying live behaviour...\n");

// 7. Prove it from outside. Cloudflare propagates these in seconds, but give
//    it a moment before asserting.
await new Promise((r) => setTimeout(r, 5000));

for (const url of [`https://${APEX}/`, `https://${APEX}/ferret`, `${CANONICAL}/`]) {
  const res = await fetch(url, { redirect: "manual" });
  const loc = res.headers.get("location");
  console.log(`${url}\n  -> HTTP ${res.status}${loc ? `  Location: ${loc}` : ""}`);
}

console.log(
  "\nExpected: the two apex URLs return 301 with a www Location (and /ferret keeps its path).\n" +
    "The www URL should still return 200 and must NOT redirect."
);
