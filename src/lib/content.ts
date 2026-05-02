export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  category: "Graphic" | "Motion" | "3D" | "Identity" | "Print";
  tags: string[];
  blurb: string;
  image?: string;
  /** Descriptive alt text for the project image. Falls back to title if omitted. */
  alt?: string;
  imageHover?: string; // used for "day-night" hover swap
  video?: string;
  videoPoster?: string;
  kind?: "image" | "video" | "falling" | "day-night" | "hover-video"; // "falling" = falling video composited over sky; "hover-video" = plays on hover, snaps back on leave
  /** If set, the modal shows this YouTube video (muted autoplay) instead of the tile media. */
  previewYouTubeId?: string;
  bg?: string;
  /** If set, clicking the tile opens this URL (new tab) instead of the modal. */
  externalUrl?: string;
  /** Video plays forward → reverse → forward (no loop reset jump). */
  pingPong?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "together-we-stand",
    title: "Together We Stand",
    client: "Brighton Dome",
    year: "2026",
    category: "Print",
    tags: ["Poster", "Event"],
    blurb:
      "Poster campaign for Brighton Dome's record-label showcase, featuring Balimaya Project, Corto.Alto and Rebecca Vasmant Ensemble. Screen-printed, limited run.",
    video: "/work/imported/videos/together-we-stand-poster.mp4",
    videoPoster: "/work/imported/posters/together-we-stand-mockup.avif",
    alt: "Screen-printed concert poster for Brighton Dome record-label showcase — print design by Toby Johnson",
    kind: "hover-video",
    bg: "#1c1a16",
  },
  {
    slug: "grumble",
    title: "Grumble / The Pylons",
    client: "The Pylons",
    year: "2026",
    category: "Identity",
    tags: ["Identity", "Photography"],
    blurb:
      "Visual identity and campaign artwork for The Pylons, Grumble's debut release. Shot on location with a typographic treatment built across print and digital.",
    image: "/work/imported/banners/grumble-pylons.avif",
    alt: "Campaign artwork and visual identity for Grumble's The Pylons — music industry graphic design by Toby Johnson",
    kind: "image",
    bg: "#0f0f0f",
  },
  {
    slug: "jgrrey",
    title: "Jgrrey",
    client: "Jgrrey",
    year: "2025",
    category: "Graphic",
    tags: ["Poster", "Music"],
    blurb:
      "Tour poster for Jgrrey. 'Playing gigs just so I can see you'. Blueprint indigo, heavy stock.",
    image: "/work/imported/posters/jgrrey-mu.avif",
    alt: "Jgrrey tour poster printed in blueprint indigo — music industry graphic design by Toby Johnson",
    kind: "image",
    bg: "#1a1a1a",
  },
  {
    slug: "falling-on-sky",
    title: "Your Cries",
    client: "Toby Johnson",
    year: "2025",
    category: "Motion",
    tags: ["Motion", "Release"],
    blurb:
      "Release animation for Toby Johnson's single Your Cries. A figure falling through a slow-drifting sky, animated frame by frame and used as the website hero.",
    kind: "falling",
    bg: "#0a0a0a",
  },
  {
    slug: "filtered-gig",
    title: "Filtered",
    client: "Filtered",
    year: "2025",
    category: "Graphic",
    tags: ["Poster", "Music"],
    blurb:
      "Gig poster for Filtered, with Toby Johnson on the bill. Teal ink, heavy type, built for A3.",
    image: "/work/imported/posters/filtered-gig-mockup2.avif",
    alt: "Gig poster for Filtered in teal ink with heavy type — music poster design by Toby Johnson",
    kind: "image",
    bg: "#0a3b45",
  },
  {
    slug: "offcut",
    title: "Offcut",
    client: "Offcut",
    year: "2025",
    category: "Print",
    tags: ["Packaging", "3D"],
    blurb:
      "Packaging system for the Offcut product line. Black on black, every surface considered.",
    image: "/work/imported/projects/box-grid.avif",
    alt: "Black-on-black product packaging system for Offcut — packaging design by Toby Johnson",
    kind: "image",
    bg: "#0a0a0a",
  },
  {
    slug: "liar-liar",
    title: "Liar Liar",
    client: "Common Request",
    year: "2025",
    category: "Motion",
    tags: ["Motion", "Music Video"],
    blurb:
      "Looping visualiser for Common Request's Liar Liar. Built in After Effects, designed to hold up across repeat plays on streaming platforms.",
    video: "/work/imported/motion/liar-liar-apple-motion.mp4",
    videoPoster: "/work/imported/posters-video/liar-liar-apple-motion.avif",
    kind: "video",
    previewYouTubeId: "AGPuWAEkXtk",
    bg: "#0a0a0a",
  },
  {
    slug: "fashion-tiles",
    title: "Fashion Tiles",
    client: "Editorial Motion",
    year: "2025",
    category: "Motion",
    tags: ["Motion", "Editorial"],
    blurb:
      "Editorial motion piece. A tile-driven system built in After Effects, designed to adapt across formats and aspect ratios.",
    video: "/work/imported/motion/fashion-tiles.mp4",
    videoPoster: "/work/imported/posters-video/fashion-tiles.avif",
    kind: "video",
    bg: "#0a0a0a",
  },
  {
    slug: "headphone-animation",
    title: "Headphone Animation",
    client: "TJCreate",
    year: "2026",
    category: "Motion",
    tags: ["Motion", "3D", "Product"],
    blurb:
      "Product animation study for a pair of over-ear headphones. Smooth movement, considered lighting and a clean cycle, built in Cinema 4D.",
    video: "/work/imported/motion/headphone-animation.mp4",
    videoPoster: "/work/imported/posters-video/headphone-animation.avif",
    kind: "video",
    bg: "#0a0a0a",
  },
  {
    slug: "heart-motion",
    title: "Heart",
    client: "Visualiser",
    year: "2025",
    category: "Motion",
    tags: ["Motion", "Loop"],
    blurb:
      "A short motion loop made for the sake of it. One object, kept simple, no brief.",
    video: "/work/imported/motion/heart.mp4",
    videoPoster: "/work/imported/posters-video/heart.avif",
    kind: "video",
    bg: "#0a0a0a",
  },
  {
    slug: "phone-booth",
    title: "Phone Booth",
    client: "TJCreate",
    year: "2024",
    category: "3D",
    tags: ["3D", "Scene"],
    blurb:
      "3D scene study in two lighting states. Same phone booth, day and night. Hover to switch.",
    image: "/work/imported/day-night/phone-booth-day.avif",
    alt: "Phone booth 3D scene rendered in day and night lighting — 3D design by Toby Johnson",
    imageHover: "/work/imported/day-night/phone-booth-night.avif",
    kind: "day-night",
    bg: "#101418",
  },
  {
    slug: "baraka-loop",
    title: "Joshua Baraka",
    client: "Joshua Baraka",
    year: "2026",
    category: "Motion",
    tags: ["Motion", "Release"],
    blurb:
      "Motion loop for Joshua Baraka's release campaign. One continuous movement, no hard cuts.",
    video: "/work/imported/motion/baraka-loop.mp4",
    videoPoster: "/work/imported/posters-video/baraka-loop.avif",
    kind: "video",
    pingPong: true,
    bg: "#0a0a0a",
  },
  {
    slug: "wonderkid",
    title: "Wonderkid",
    client: "Wonderkid Records",
    year: "2025",
    category: "Graphic",
    tags: ["Packaging", "Mockup"],
    blurb:
      "Limited edition packaging for Wonderkid Records. Rendered in-bag with a typographic label system.",
    image: "/work/imported/posters/wonderkid-in-bag.avif",
    alt: "Wonderkid limited edition packaging rendered in-bag — product graphic design by Toby Johnson",
    kind: "image",
    bg: "#0f0f0f",
  },
  {
    slug: "carousel-square",
    title: "Carousel",
    client: "Visualiser",
    year: "2025",
    category: "Motion",
    tags: ["Motion", "Social"],
    blurb:
      "Square-format motion loop for social. One idea, no padding.",
    video: "/work/imported/motion/carousel-square.mp4",
    videoPoster: "/work/imported/posters-video/carousel-square.avif",
    kind: "video",
    bg: "#0a0a0a",
  },
  {
    slug: "jb-wrong-places",
    title: "Wrong Places",
    client: "Joshua Baraka",
    year: "2025",
    category: "Motion",
    tags: ["Lyric Video", "Motion"],
    blurb:
      "Lyric video for Joshua Baraka's Wrong Places. The tile previews a lyric-free passage from the full cut. Click through for the full video on YouTube.",
    video: "/work/imported/motion/jb-wrong-places-loop.mp4",
    videoPoster: "/work/imported/posters-video/jb-wrong-places-loop.avif",
    kind: "video",
    bg: "#0a0a0a",
    externalUrl: "https://www.youtube.com/watch?v=jeKPLNFDoHA",
  },
];

// Labels, agencies, and artists with their own vector logos. Potrace-traced from
// source PNGs so they scale crisp at any size. URLs open in a new tab.
export const CLIENTS_WITH_LOGOS = [
  // Labels / agencies
  {
    name: "Gigantic",
    logo: "/work/imported/logos/gigantic.svg",
    url: "https://www.gigantic.com",
  },
  {
    name: "Brighton Dome",
    logo: "/work/imported/logos/brighton-dome.svg",
    url: "https://brightondome.org",
  },
  {
    name: "Jazz Re:freshed",
    logo: "/work/imported/logos/jazz-refreshed.svg",
    url: "https://jazzrefreshed.com",
  },
  {
    name: "Bridge the Gap",
    logo: "/work/imported/logos/bridge-the-gap.svg",
    url: "https://www.bridgethegapmanagement.com",
  },
  {
    name: "Mahogany",
    logo: "/work/imported/logos/mahogany.svg",
    url: "https://www.youtube.com/@MahoganySessions",
  },
  {
    name: "Marathon Artists",
    logo: "/work/imported/logos/marathon.svg",
    url: "https://marathonartists.com",
  },
  {
    name: "Moves Recordings",
    logo: "/work/imported/logos/moves.svg",
    url: "https://moves.ltd",
  },
  {
    name: "New Soil",
    logo: "/work/imported/logos/new-soil.svg",
    url: "https://newsoil.co",
  },
  {
    name: "Instrumental",
    logo: "/work/imported/logos/instrumental.svg",
    url: "https://instrumental.info",
  },
  {
    name: "Women in Jazz",
    logo: "/work/imported/logos/women-in-jazz.svg",
    url: "https://www.womeninjazz.co.uk",
  },
  {
    name: "Made by Analogue",
    logo: "/work/imported/logos/analogue-leeds.svg",
    url: "https://madebyanalogue.co.uk/",
  },
  {
    name: "Pace Artists",
    logo: "/work/imported/logos/pace.svg",
    url: "https://www.paceartists.com",
  },
  {
    name: "Mojang Studios",
    logo: "/work/imported/logos/mojang-studios.svg",
    url: "https://www.minecraft.net/en-us/mojang-studios",
  },
  // Artists with officially-supplied logos
  {
    name: "Jgrrey",
    logo: "/work/imported/logos/jgrrey.svg",
    url: "https://open.spotify.com/artist/6fxYr0gMxV8F68t1ecFCKv",
  },
  {
    name: "Hot Wax",
    logo: "/work/imported/logos/hot-wax.svg",
    url: "https://www.hotwaxband.com",
  },
  {
    name: "Corto.Alto",
    logo: "/work/imported/logos/corto-alto.svg",
    url: "https://cortoalto.com",
  },
  {
    name: "Courtney Barnett",
    logo: "/work/imported/logos/courtney-barnett.svg",
    url: "https://courtneybarnett.com.au",
  },
  {
    name: "Richard Walters",
    logo: "/work/imported/logos/richard-walters.svg",
    url: "https://richardwalters.bandcamp.com",
  },
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
