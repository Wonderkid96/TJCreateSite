#!/usr/bin/env node
/**
 * Trace the PNG client logos into clean black-on-transparent SVGs using Potrace.
 * Run once from the project root:
 *   node scripts/trace-logos.mjs
 */
import { trace } from "potrace";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = path.join(__dirname, "..", "public", "work", "imported", "logos");

const PNGs = [
  "instrumental.png",
  "mahogany.png",
  "marathon.png",
  "moves.png",
  "new-soil.png",
  "women-in-jazz.png",
  "tjc.png",
  // Artist logos
  "jgrrey.png",
  "hot-wax.png",
  "corto-alto.png",
  "joshua-baraka.png",
  "pace.png",
];

// Potrace options — tuned for flat logo tracing at 256×256 source resolution.
const options = {
  threshold: 180, // midpoint → captures both white and light-grey pixels
  turdSize: 4, // remove very small noise particles (px)
  optCurve: true,
  optTolerance: 0.2,
  alphaMax: 1, // allow corners
  color: "#0a0a0a", // ink
  background: "transparent",
};

async function traceOne(name) {
  const input = path.join(LOGOS_DIR, name);
  const output = path.join(LOGOS_DIR, name.replace(/\.png$/, ".svg"));
  return new Promise((resolve, reject) => {
    trace(input, options, (err, svg) => {
      if (err) return reject(err);
      fs.writeFile(output, svg).then(() => {
        const size = Buffer.byteLength(svg);
        console.log(`  ${name} → ${path.basename(output)}  (${size} B)`);
        resolve();
      }).catch(reject);
    });
  });
}

// Skip PNGs that no longer exist on disk (they were cleaned up after their
// SVG siblings were produced). Only trace ones still present.
const toTrace = [];
for (const png of PNGs) {
  try {
    await fs.access(path.join(LOGOS_DIR, png));
    toTrace.push(png);
  } catch {
    // source PNG gone — SVG already exists, skip.
  }
}

console.log(`Tracing ${toTrace.length} logo(s) with Potrace…`);
for (const png of toTrace) await traceOne(png);
console.log("Done.");
