// Generates public/og/<slug>.jpg (1200x630) for every project: the project's
// still, contained on its own background colour, so a shared link shows the
// whole piece at the right ratio instead of a square crop. Run again after
// changing a project's image, poster or bg:
//
//   node scripts/og-images.mjs
//
// Node 22+ strips the types from content.ts on import; sharp comes from the
// Next.js install, so there is nothing extra to add.
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { PROJECTS } from "../src/lib/content.ts";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "og");
const WIDTH = 1200;
const HEIGHT = 630;
const PAD = 48;
const FALLING_FRAME = "/work/frames/frame_0001.webp";
const SKY = "/work/imported/bg/sky-long.avif";

await mkdir(OUT, { recursive: true });

for (const project of PROJECTS) {
  const still =
    project.image ?? project.videoPoster ?? (project.kind === "falling" ? FALLING_FRAME : null);
  if (!still) {
    console.warn(`skip ${project.slug}: no still`);
    continue;
  }

  const layers = [];
  if (project.kind === "falling") {
    const sky = await sharp(path.join(PUBLIC, SKY)).resize(WIDTH, HEIGHT, { fit: "cover" }).toBuffer();
    layers.push({ input: sky, left: 0, top: 0 });
  }

  const art = await sharp(path.join(PUBLIC, still))
    .resize(WIDTH - PAD * 2, HEIGHT - PAD * 2, { fit: "inside" })
    .toBuffer();
  const { width, height } = await sharp(art).metadata();
  layers.push({
    input: art,
    left: Math.round((WIDTH - width) / 2),
    top: Math.round((HEIGHT - height) / 2),
  });

  const out = path.join(OUT, `${project.slug}.jpg`);
  await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: project.bg ?? "#0a0a0a" } })
    .composite(layers)
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(out);
  console.log(`og/${project.slug}.jpg`);
}
