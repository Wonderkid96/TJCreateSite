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
    year: "2025",
    category: "Print",
    tags: ["Poster", "Event"],
    blurb:
      "Lead campaign artwork for Brighton Dome's Together We Stand, a four-label collaboration (New Soil, Bridge The Gap, Jazz Re:freshed, Women in Jazz) featuring Balimaya Project, corto.alto and Rebecca Vasmant Live Ensemble. The brief: one visual strong enough to carry four label identities and three headline acts without leaning on any of them. Built as a 3D block system in modern colour, with a motion variant cut for social. Used across announce, web, print distro and Brighton Dome's wider poster runs.",
    video: "/work/imported/videos/together-we-stand-poster.mp4",
    videoPoster: "/work/imported/posters/together-we-stand-mockup.avif",
    alt: "Screen-printed concert poster for Brighton Dome record-label showcase, print design by Toby Johnson",
    kind: "hover-video",
    bg: "#1c1a16",
  },
  {
    slug: "grumble",
    title: "Grumble",
    client: "The Pylons",
    year: "2021",
    category: "Graphic",
    tags: ["Campaign", "Photography"],
    blurb:
      "Campaign artwork for The Pylons' Grumble, built from a film shoot on location in Lincolnshire. Composited in Photoshop with a 3D-sculpted sign rig holding a broken title above a desolate backdrop. Designed to feel half-abandoned, half-forgotten. Used across release banners and artist profile imagery.",
    image: "/work/imported/banners/grumble-pylons.avif",
    alt: "Campaign artwork for The Pylons' Grumble, music industry graphic design by Toby Johnson",
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
      "Tour poster for Jgrrey's \"Playing gigs just so I can see you\" run, advertising her Radio 1 Big Weekend slot, Bristol's Dot to Dot and Last Time Out, Leeds. Floating moons built as 3D spheres in Blender, run through Photoshop threshold and gradients to sit flat against the blueprint indigo. Heavy stock print.",
    image: "/work/imported/posters/jgrrey-mu.avif",
    alt: "Jgrrey tour poster printed in blueprint indigo, music industry graphic design by Toby Johnson",
    kind: "image",
    bg: "#1a1a1a",
  },
  {
    slug: "falling-on-sky",
    title: "Your Cries",
    client: "Toby Johnson",
    year: "2022",
    category: "Motion",
    tags: ["Motion", "Release"],
    blurb:
      "Release animation for my single Your Cries, self-released in 2022. The plan was a music video of a body falling gracefully through the sky. With no budget for that, I leaned a chair back in the studio, filmed myself falling off it, and rotoscoped the footage in After Effects. That single take carried the whole release: the still became the artwork, the rotoscoped loop became the Spotify Canvas and Apple Motion artwork, and it now runs as the hero of this site. Built for nothing, and still doing the work.",
    alt: "Rotoscoped figure falling through a cloudy blue sky, release animation for Your Cries by Toby Johnson",
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
      "Gig poster for a Filtered night at Angel Coffee House in Lincoln. I named the event, branded it, and played it. The type is built around the spiral of a stirred coffee, tying the music to the room it ran in. Teal ink, heavy type, A3.",
    image: "/work/imported/posters/filtered-gig-mockup2.avif",
    alt: "Gig poster for Filtered in teal ink with heavy type, music poster design by Toby Johnson",
    kind: "image",
    bg: "#0a3b45",
  },
  {
    slug: "offcut",
    title: "Offcut",
    client: "Offcut",
    year: "2021",
    category: "Identity",
    tags: ["Identity", "Packaging"],
    blurb:
      "Identity and packaging for Offcut, a small Herefordshire workshop building clocks from the floorboards of a decommissioned chapel in Leintwardine. The brand had to carry the provenance of the wood without leaning sentimental. Marks, packaging and printed collateral were built around that single material story. Offcut now ships timepieces across the UK from the same workshop.",
    image: "/work/imported/projects/box-grid.avif",
    alt: "Black-on-black product packaging system for Offcut, packaging design by Toby Johnson",
    kind: "image",
    bg: "#0a0a0a",
  },
  {
    slug: "liar-liar",
    title: "Liar Liar",
    client: "Common Request",
    year: "2024",
    category: "Motion",
    tags: ["Motion", "Lyric Video"],
    blurb:
      "Lyric video for Common Request's Liar Liar. Built around the look of a terminal print-out, with the lyrics threaded through continuous scrolling code. The code isn't filler. It echoes the words and themes of the track, so phrases keep surfacing as the video plays. Heavy motion: glitch, overlays, displacements. After Effects.",
    video: "/work/imported/motion/liar-liar-apple-motion.mp4",
    videoPoster: "/work/imported/posters-video/liar-liar-apple-motion.avif",
    alt: "Liar Liar lyric video for Common Request with terminal print-out aesthetic, motion graphics by Toby Johnson",
    kind: "video",
    previewYouTubeId: "AGPuWAEkXtk",
    bg: "#0a0a0a",
  },
  {
    slug: "fashion-tiles",
    title: "Fashion Tiles",
    client: "TJCreate",
    year: "2026",
    category: "Motion",
    tags: ["Motion", "Study"],
    blurb:
      "Self-initiated motion study built around carousel tiles rotating through 3D space, with fashion imagery cycling through a layered sequence. A testbed for the newer After Effects 3D and layer tools, the kind of R&D that pays off in client work.",
    video: "/work/imported/motion/fashion-tiles.mp4",
    videoPoster: "/work/imported/posters-video/fashion-tiles.avif",
    alt: "Fashion Tiles 3D motion study with rotating carousel tiles, motion design by Toby Johnson",
    kind: "video",
    bg: "#0a0a0a",
  },
  {
    slug: "headphone-animation",
    title: "Headphone Animation",
    client: "Pulse Audio",
    year: "2026",
    category: "Motion",
    tags: ["Motion", "3D", "Product"],
    blurb:
      "Product animation for Pulse Audio's over-ear headphones. Sculpted, textured, lit and animated in Blender, graded in Premiere. A slow rotating cycle that lets the form and materials carry the piece. Clean lighting, no tricks.",
    video: "/work/imported/motion/headphone-animation.mp4",
    videoPoster: "/work/imported/posters-video/headphone-animation.avif",
    alt: "Pulse Audio over-ear headphones product animation rendered in Blender, 3D motion design by Toby Johnson",
    kind: "video",
    bg: "#0a0a0a",
  },
  {
    slug: "heart-motion",
    title: "Heart",
    client: "TJCreate",
    year: "2025",
    category: "Motion",
    tags: ["Motion", "Illustration"],
    blurb:
      "Short motion piece built from a single anatomical drawing of a heart. Animated in After Effects with a slow pulse and blood flowing through the vessels, holding the etched, illustrative feel of the source image.",
    video: "/work/imported/motion/heart.mp4",
    videoPoster: "/work/imported/posters-video/heart.avif",
    alt: "Anatomical heart motion piece with pulsing blood flow, motion graphics by Toby Johnson",
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
      "Phone booth sculpted and modelled in Blender for an environmental 3D scene challenge. Two lighting passes: one daylit, one at night. The tile flips between them on hover, so the same geometry carries both moods of the same place.",
    image: "/work/imported/day-night/phone-booth-day.avif",
    alt: "Phone booth 3D scene rendered in day and night lighting, 3D design by Toby Johnson",
    imageHover: "/work/imported/day-night/phone-booth-night.avif",
    kind: "day-night",
    bg: "#101418",
  },
  {
    slug: "baraka-loop",
    title: "Joshua Baraka",
    client: "Joshua Baraka",
    year: "2024",
    category: "Motion",
    tags: ["Motion", "Release"],
    blurb:
      "Release animation for Joshua Baraka's Recess, a seven-track mixtape featuring collaborations with KiDi and Bensoul. Torn paper assembles in 3D space to build the original artwork, animated in After Effects. Rustic and handmade in feel, despite being entirely digital. Used as the Spotify and Apple Music Canvas and rolled out across the release campaign.",
    video: "/work/imported/motion/baraka-loop.mp4",
    videoPoster: "/work/imported/posters-video/baraka-loop.avif",
    alt: "Release animation for Joshua Baraka's Recess mixtape, torn paper assembling in 3D, motion design by Toby Johnson",
    kind: "video",
    pingPong: true,
    bg: "#0a0a0a",
  },
  {
    slug: "wonderkid",
    title: "Wonderkid",
    client: "Wonderkid",
    year: "2022",
    category: "Graphic",
    tags: ["Packaging", "Mockup"],
    blurb:
      "Packaging for Wonderkid, my own producer alias. A typographic label system rendered in-bag, giving a personal release the same finish as a client one.",
    image: "/work/imported/posters/wonderkid-in-bag.avif",
    alt: "Wonderkid limited edition packaging rendered in-bag, product graphic design by Toby Johnson",
    kind: "image",
    bg: "#0f0f0f",
  },
  {
    slug: "carousel-square",
    title: "Carousel",
    client: "Lilly Era",
    year: "2025",
    category: "Motion",
    tags: ["Motion", "Template"],
    blurb:
      "Square-format motion template built for Lilly Era, a label promoting house music. Designed as a recurring system: assets swap in and out cleanly, type and timing adjust without rebuilding the file. Sold as a productised service rather than a one-off.",
    video: "/work/imported/motion/carousel-square.mp4",
    videoPoster: "/work/imported/posters-video/carousel-square.avif",
    alt: "Carousel motion template for Lilly Era house music label, motion graphics by Toby Johnson",
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
      "Lyric video for Joshua Baraka's Wrong Places. A lighter rotates slowly through the frame with lyrics fading over it, sculpted and animated in Blender with finishing in After Effects. The looping cut ran as the Spotify and Apple Music Canvas and as the campaign's main social asset. Full video on YouTube.",
    video: "/work/imported/motion/jb-wrong-places-loop.mp4",
    videoPoster: "/work/imported/posters-video/jb-wrong-places-loop.avif",
    alt: "Lyric video for Joshua Baraka's Wrong Places with a rotating lighter, motion design by Toby Johnson",
    kind: "video",
    bg: "#0a0a0a",
    externalUrl: "https://www.youtube.com/watch?v=jeKPLNFDoHA",
  },
];

// Labels, agencies, and artists with their own vector logos. Potrace-traced from
// source PNGs so they scale crisp at any size. URLs open in a new tab.
// Ordered most recognisable first — array order is the display order in the
// Clients grid (rows of 4 on desktop), so the biggest names lead.
export const CLIENTS_WITH_LOGOS = [
  {
    name: "Mojang Studios",
    logo: "/work/imported/logos/mojang-studios.svg",
    url: "https://www.minecraft.net/en-us/mojang-studios",
  },
  {
    name: "Courtney Barnett",
    logo: "/work/imported/logos/courtney-barnett.svg",
    url: "https://courtneybarnett.com.au",
  },
  {
    name: "Marathon Artists",
    logo: "/work/imported/logos/marathon.svg",
    url: "https://marathonartists.com",
  },
  {
    name: "Brighton Dome",
    logo: "/work/imported/logos/brighton-dome.svg",
    url: "https://brightondome.org",
  },
  {
    name: "Mahogany",
    logo: "/work/imported/logos/mahogany.svg",
    url: "https://www.youtube.com/@MahoganySessions",
  },
  {
    name: "Jazz Re:freshed",
    logo: "/work/imported/logos/jazz-refreshed.svg",
    url: "https://jazzrefreshed.com",
  },
  {
    name: "Gigantic",
    logo: "/work/imported/logos/gigantic.svg",
    url: "https://www.gigantic.com",
  },
  {
    name: "Corto.Alto",
    logo: "/work/imported/logos/corto-alto.svg",
    url: "https://cortoalto.com",
  },
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
    name: "Women in Jazz",
    logo: "/work/imported/logos/women-in-jazz.svg",
    url: "https://www.womeninjazz.co.uk",
  },
  {
    name: "New Soil",
    logo: "/work/imported/logos/new-soil.svg",
    url: "https://newsoil.co",
  },
  {
    name: "Bridge the Gap",
    logo: "/work/imported/logos/bridge-the-gap.svg",
    url: "https://www.bridgethegapmanagement.com",
  },
  {
    name: "Pace Artists",
    logo: "/work/imported/logos/pace.svg",
    url: "https://www.paceartists.com",
  },
  {
    name: "Moves Recordings",
    logo: "/work/imported/logos/moves.svg",
    url: "https://moves.ltd",
  },
  {
    name: "Instrumental",
    logo: "/work/imported/logos/instrumental.svg",
    url: "https://instrumental.info",
  },
  {
    name: "Made by Analogue",
    logo: "/work/imported/logos/analogue-leeds.svg",
    url: "https://madebyanalogue.co.uk/",
  },
  {
    name: "Richard Walters",
    logo: "/work/imported/logos/richard-walters.svg",
    url: "https://richardwalters.bandcamp.com",
  },
  {
    name: "Optima Design",
    logo: "/work/imported/logos/optima.svg",
    url: "https://www.optimadesign.co.uk",
  },
];

export const CLIENTS = CLIENTS_WITH_LOGOS.map((c) => c.name);

export const SERVICES = [
  {
    num: "01",
    title: "Graphic Design",
    blurb:
      "I've worked alongside labels, studios and agencies across music, gaming and product, delivering bold design for campaigns, branding and print.",
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
      "I've made lyric videos, visualisers and Spotify Canvases for artists and labels, animating release campaigns from announce to drop.",
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
      "I've modelled product renders, 3D type and full scenes in Blender, for the campaigns and product shots flat artwork can't carry.",
    items: [
      "Product renders",
      "Type / scene design",
      "Campaign visuals",
      "Concept / R&D",
    ],
  },
];
