#!/usr/bin/env node
/**
 * Trims each traced SVG's viewBox to the tight bounding box of its paths so
 * logos crop in on their artwork instead of rendering with source-PNG padding.
 *
 * Usage:   node scripts/trim-svg-viewbox.mjs
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = path.join(__dirname, "..", "public", "work", "imported", "logos");

// Extract every numeric coordinate from a path d="..." string. Potrace emits
// absolute M L C commands so we can just grab all floats. Crude but correct for
// our bounds math.
function extractCoords(d) {
  const nums = d.match(/-?\d+(?:\.\d+)?/g) ?? [];
  const xs = [];
  const ys = [];
  for (let i = 0; i < nums.length - 1; i += 2) {
    xs.push(parseFloat(nums[i]));
    ys.push(parseFloat(nums[i + 1]));
  }
  return { xs, ys };
}

async function trimFile(file) {
  const full = path.join(LOGOS_DIR, file);
  let svg = await fs.readFile(full, "utf8");

  // Pull every `d="..."` attribute across all <path> elements.
  const dMatches = Array.from(svg.matchAll(/\bd="([^"]+)"/g)).map((m) => m[1]);
  if (dMatches.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const d of dMatches) {
    const { xs, ys } = extractCoords(d);
    for (const x of xs) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }
    for (const y of ys) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (!Number.isFinite(minX) || !Number.isFinite(maxY)) return null;

  // Pad 2% around content so strokes don't kiss the edge.
  const w = maxX - minX;
  const h = maxY - minY;
  const padX = w * 0.02;
  const padY = h * 0.02;
  const vb = `${(minX - padX).toFixed(2)} ${(minY - padY).toFixed(2)} ${(w + padX * 2).toFixed(2)} ${(h + padY * 2).toFixed(2)}`;

  // Replace existing viewBox; also drop fixed width/height so CSS controls size.
  let next = svg.replace(/\bviewBox="[^"]+"/, `viewBox="${vb}"`);
  next = next.replace(/\bwidth="[^"]+"/, `width="100%"`);
  next = next.replace(/\bheight="[^"]+"/, `height="100%"`);
  await fs.writeFile(full, next);
  return { file, viewBox: vb };
}

// Only trim the Potrace-generated SVGs (they use absolute M/L/C commands so
// our coord extractor is accurate). Pre-authored vector logos (e.g. the
// Illustrator-exported Analogue Leeds file) use relative commands that would
// break naive coord extraction — leave them alone.
const POTRACE_FILES = new Set([
  "instrumental.svg",
  "mahogany.svg",
  "marathon.svg",
  "moves.svg",
  "new-soil.svg",
  "women-in-jazz.svg",
  "tjc.svg",
  "jgrrey.svg",
  "hot-wax.svg",
  "corto-alto.svg",
  "pace.svg",
]);
const files = (await fs.readdir(LOGOS_DIR)).filter(
  (f) => f.endsWith(".svg") && POTRACE_FILES.has(f),
);
console.log(`Trimming ${files.length} SVG(s)…`);
for (const f of files) {
  const res = await trimFile(f);
  if (res) console.log(`  ${res.file} → viewBox="${res.viewBox}"`);
}
console.log("Done.");
