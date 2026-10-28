// Renders the PNG icon set and favicon.ico from src/app/icon.svg:
//
//   node scripts/icons.mjs
//
// Writes public/icons/icon-192.png, icon-512.png, icon-512-maskable.png (the
// mark at 80% inside a white field, per the maskable safe zone) and
// src/app/favicon.ico (16, 32 and 48px PNG entries in an ICO container, which
// every current browser reads). The manifest lists the PNGs; Next.js wires
// favicon.ico and icon.svg itself.
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = path.resolve(import.meta.dirname, "..");
const SVG = path.join(ROOT, "src", "app", "icon.svg");
const OUT = path.join(ROOT, "public", "icons");

const svg = await readFile(SVG);
await mkdir(OUT, { recursive: true });

const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

await writeFile(path.join(OUT, "icon-192.png"), await png(192));
await writeFile(path.join(OUT, "icon-512.png"), await png(512));

// Maskable: platforms crop to a circle or squircle, so keep the mark inside
// the central 80% on a solid field.
const inner = await png(410);
const maskable = await sharp({ create: { width: 512, height: 512, channels: 3, background: "#ffffff" } })
  .composite([{ input: inner, left: 51, top: 51 }])
  .png()
  .toBuffer();
await writeFile(path.join(OUT, "icon-512-maskable.png"), maskable);

// ICO container around PNG entries.
const sizes = [16, 32, 48];
const entries = await Promise.all(sizes.map((size) => png(size)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(entries.length, 4);
const dir = Buffer.alloc(16 * entries.length);
let offset = 6 + dir.length;
entries.forEach((buf, i) => {
  const size = sizes[i];
  const o = i * 16;
  dir.writeUInt8(size === 256 ? 0 : size, o);
  dir.writeUInt8(size === 256 ? 0 : size, o + 1);
  dir.writeUInt8(0, o + 2); // palette
  dir.writeUInt8(0, o + 3); // reserved
  dir.writeUInt16LE(1, o + 4); // colour planes
  dir.writeUInt16LE(32, o + 6); // bits per pixel
  dir.writeUInt32LE(buf.length, o + 8);
  dir.writeUInt32LE(offset, o + 12);
  offset += buf.length;
});
await writeFile(path.join(ROOT, "src", "app", "favicon.ico"), Buffer.concat([header, dir, ...entries]));

console.log("icons written: icon-192.png, icon-512.png, icon-512-maskable.png, favicon.ico");
