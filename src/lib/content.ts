export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  category: "Graphic" | "Motion" | "3D" | "Identity" | "Print";
  tags: string[];
  blurb: string;
  image?: string;
  imageHover?: string; // used for "day-night" hover swap
  video?: string;
  videoPoster?: string;
  kind?: "image" | "video" | "falling" | "day-night"; // "falling" = falling video composited over sky
  bg?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "together-we-stand",
    title: "Together We Stand",
    client: "Brighton Dome",
    year: "2025",
    category: "Print",
    tags: ["Poster", "Event"],
    blurb:
      "Screen-printed campaign for the Brighton Dome record-label showcase — Balimaya Project, Corto.Alto, Rebecca Vasmant Ensemble.",
    image: "/work/imported/posters/together-we-stand-mockup.jpg",
    kind: "image",
    bg: "#1c1a16",
  },
  {
    slug: "grumble",
    title: "Grumble / The Pylons",
    client: "Band Campaign",
    year: "2025",
    category: "Identity",
    tags: ["Identity", "Photography"],
    blurb:
      "Campaign artwork and identity for Grumble's The Pylons — band on location, title treatment, typographic system.",
    image: "/work/imported/banners/grumble-pylons.jpg",
    kind: "image",
    bg: "#0f0f0f",
  },
  {
    slug: "jgrrey",
    title: "Jgrrey",
    client: "Gig Poster",
    year: "2024",
    category: "Graphic",
    tags: ["Poster", "Music"],
    blurb:
      "Poster campaign for Jgrrey's tour — 'Playing gigs just so I can see you'. Printed in blueprint indigo.",
    image: "/work/imported/posters/jgrrey-mu.avif",
    kind: "image",
    bg: "#1a1a1a",
  },
  {
    slug: "falling-on-sky",
    title: "Your Cries Falling",
    client: "Toby Johnson",
    year: "2024",
    category: "Motion",
    tags: ["Motion", "Release"],
    blurb:
      "Release visual for Your Cries Falling — figure falling through a slow-drifting sky. Subtle, loops forever.",
    kind: "falling",
    bg: "#0a0a0a",
  },
  {
    slug: "filtered-gig",
    title: "Filtered",
    client: "Gig Poster",
    year: "2024",
    category: "Graphic",
    tags: ["Poster", "Music"],
    blurb:
      "Poster artwork for Filtered — teal ink, heavy type, Toby Johnson on the bill.",
    image: "/work/imported/posters/filtered-gig-mockup2.jpg",
    kind: "image",
    bg: "#0a3b45",
  },
  {
    slug: "offcut",
    title: "Offcut",
    client: "Product Packaging",
    year: "2024",
    category: "Print",
    tags: ["Packaging", "3D"],
    blurb:
      "Packaging system for the Offcut product line — black-on-black, zero wasted surface.",
    image: "/work/imported/projects/box-grid.jpg",
    kind: "image",
    bg: "#0a0a0a",
  },
  {
    slug: "liar-liar",
    title: "Liar Liar",
    client: "Visualiser",
    year: "2024",
    category: "Motion",
    tags: ["Motion", "Music Video"],
    blurb:
      "Looping visualiser for Liar Liar — Apple Motion scene, built for repeat plays without fatigue.",
    video: "/work/imported/motion/liar-liar-apple-motion.mp4",
    kind: "video",
    bg: "#0a0a0a",
  },
  {
    slug: "fashion-tiles",
    title: "Fashion Tiles",
    client: "Editorial Motion",
    year: "2024",
    category: "Motion",
    tags: ["Motion", "Editorial"],
    blurb:
      "Editorial motion set — tile-driven system built in After Effects, designed to scale across formats.",
    video: "/work/imported/motion/fashion-tiles.mp4",
    kind: "video",
    bg: "#0a0a0a",
  },
  {
    slug: "heart-motion",
    title: "Heart",
    client: "Brand Motion",
    year: "2024",
    category: "Motion",
    tags: ["Motion", "Loop"],
    blurb:
      "Short brand loop — minimal object, big personality. Plays forever without feeling repetitive.",
    video: "/work/imported/motion/heart.mp4",
    kind: "video",
    bg: "#0a0a0a",
  },
  {
    slug: "phone-booth",
    title: "Phone Booth",
    client: "3D Still",
    year: "2024",
    category: "3D",
    tags: ["3D", "Scene"],
    blurb:
      "Day/night scene study — same 3D environment, two different lighting passes. Hover to flip.",
    image: "/work/imported/day-night/phone-booth-day.png",
    imageHover: "/work/imported/day-night/phone-booth-night.png",
    kind: "day-night",
    bg: "#101418",
  },
  {
    slug: "baraka-loop",
    title: "Joshua Baraka",
    client: "Release Loop",
    year: "2025",
    category: "Motion",
    tags: ["Motion", "Release"],
    blurb:
      "Release-cycle motion loop for Joshua Baraka — single-take animation, built to feel like one continuous breath.",
    video: "/work/imported/motion/baraka-loop.mp4",
    kind: "video",
    bg: "#0a0a0a",
  },
  {
    slug: "wonderkid",
    title: "Wonderkid",
    client: "Packaging Mockup",
    year: "2024",
    category: "Graphic",
    tags: ["Packaging", "Mockup"],
    blurb:
      "Wonderkid — limited product packaging rendered in-bag. Typography meets product photography.",
    image: "/work/imported/posters/wonderkid-in-bag.png",
    kind: "image",
    bg: "#0f0f0f",
  },
  {
    slug: "carousel-square",
    title: "Carousel",
    client: "Social Motion",
    year: "2024",
    category: "Motion",
    tags: ["Motion", "Social"],
    blurb:
      "Square-format motion loop designed for feeds — a single idea, clean cut, built to stop a scroll.",
    video: "/work/imported/motion/carousel-square.mp4",
    kind: "video",
    bg: "#0a0a0a",
  },
];

// Only record labels / imprints go here — artists live inside individual project cards.
// Logos are vector traces (Potrace) so they scale crisply at any size.
export const CLIENTS_WITH_LOGOS = [
  { name: "Mahogany", logo: "/work/imported/logos/mahogany.svg" },
  { name: "Marathon Artists", logo: "/work/imported/logos/marathon.svg" },
  { name: "Moves Recordings", logo: "/work/imported/logos/moves.svg" },
  { name: "New Soil", logo: "/work/imported/logos/new-soil.svg" },
  { name: "Instrumental", logo: "/work/imported/logos/instrumental.svg" },
  { name: "Women in Jazz", logo: "/work/imported/logos/women-in-jazz.svg" },
  { name: "Made by Analogue", logo: null },
];

export const CLIENTS = CLIENTS_WITH_LOGOS.map((c) => c.name);

export const SERVICES = [
  {
    num: "01",
    title: "Graphic Design",
    blurb:
      "Identity systems, editorial, packaging, merch, and posters. Built to last longer than a trend cycle.",
    items: [
      "Visual identity",
      "Editorial + print",
      "Merch + packaging",
      "Posters + gig artwork",
    ],
  },
  {
    num: "02",
    title: "Motion Graphics",
    blurb:
      "Title sequences, lyric videos, and social content. Motion that serves the idea, never decorates it.",
    items: [
      "Title sequences",
      "Lyric videos",
      "Social / short-form",
      "Broadcast graphics",
    ],
  },
  {
    num: "03",
    title: "3D Design",
    blurb:
      "Texture, depth, dimension. Product visualisation, campaign imagery, and concept work rendered with intent.",
    items: [
      "Product renders",
      "Type / scene design",
      "Campaign visuals",
      "Concept / R&D",
    ],
  },
];
