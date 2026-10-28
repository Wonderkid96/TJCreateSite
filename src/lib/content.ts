export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  category: "Graphic" | "Motion" | "3D" | "Identity" | "Print" | "Music";
  tags: string[];
  blurb: string;
  /**
   * One or two sentences, third person, under 160 characters: the project
   * page's meta description and the schema description. The blurb is too long
   * for a search snippet, so this is what the result shows.
   */
  summary?: string;
  /** Title tag for the project page, without the site suffix. Falls back to title. */
  pageTitle?: string;
  /** Software the blurb names. Shown on the project page and sent to llms.txt. */
  tools?: string[];
  /** ISO date the project went live on this site: VideoObject uploadDate / datePublished. */
  published?: string;
  /** Length of `video` in seconds, measured with ffprobe, for VideoObject duration. */
  videoDuration?: number;
  image?: string;
  /** Descriptive alt text for the project image. Falls back to title if omitted. */
  alt?: string;
  imageHover?: string; // used for "day-night" hover swap
  video?: string;
  videoPoster?: string;
  /**
   * For an "image" tile that still has a motion piece behind it: the tile
   * shows the still, but opening the modal plays this video. Lets a clean
   * hero still front the grid without losing the animation on click.
   */
  modalVideo?: string;
  kind?: "image" | "video" | "falling" | "day-night" | "hover-video"; // "falling" = falling video composited over sky; "hover-video" = plays on hover, snaps back on leave
  /** If set, the modal shows this YouTube video (muted autoplay) instead of the tile media. */
  previewYouTubeId?: string;
  bg?: string;
  /** If set, clicking the tile opens this URL (new tab) instead of the modal. */
  externalUrl?: string;
  /**
   * How the image fits the modal media pane. "contain" shows the full frame
   * (letterboxed on `bg`) — used for wide renders that the tile crops.
   * Defaults to cover.
   */
  modalFit?: "contain";
  /** Preserve this width/height ratio in the quick view and project page. Grid tiles stay square like the rest. */
  mediaAspectRatio?: number;
  /**
   * CSS object-position for the square grid tile crop, e.g. "60% 50%".
   * Steers which part of a non-square image survives the centre crop.
   * Defaults to centre ("50% 50%") when omitted.
   */
  focal?: string;
  /** Video plays forward → reverse → forward (no loop reset jump). */
  pingPong?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: "twelfth-man",
    title: "Twelfth Man",
    client: "Angel & Anchor × Cult",
    year: "2026",
    category: "3D",
    tags: ["3D", "Motion", "Coffee"],
    blurb:
      "3D coin animation commissioned by Angel & Anchor for Twelfth Man, its collaboration coffee with Cult celebrating the studio's 12th birthday. The concept borrows from football's twelfth man: the supporters behind the team, reflecting the studio's support for its clients. I modelled, textured, lit and animated a silver referee's coin in Blender using Angel & Anchor's supplied artwork, then composited and graded the flip in After Effects for social and carousel content.",
    pageTitle: "Twelfth Man 3D coin animation for Angel & Anchor",
    summary:
      "3D coin animation for Angel & Anchor's Twelfth Man coffee with Cult: a silver referee's coin modelled and animated in Blender, finished in After Effects.",
    tools: ["Blender", "After Effects"],
    published: "2026-09-23",
    videoDuration: 7.46,
    video: "/work/imported/motion/twelfth-man-coin.mp4",
    videoPoster: "/work/imported/posters-video/twelfth-man-coin.webp",
    alt: "Silver referee's coin engraved with Twelfth Man and A&A x Cult lettering, mid-flip against a blue sky",
    kind: "hover-video",
    modalFit: "contain",
    mediaAspectRatio: 3 / 4,
    bg: "#476b88",
  },
  {
    slug: "together-we-stand",
    title: "Together We Stand",
    client: "Brighton Dome",
    year: "2025",
    category: "Print",
    tags: ["Poster", "Event"],
    blurb:
      "Lead campaign artwork for Brighton Dome's Together We Stand, a four-label collaboration (New Soil, Bridge The Gap, Jazz Re:freshed, Women in Jazz) featuring Balimaya Project, corto.alto and Rebecca Vasmant Live Ensemble. The brief: one visual strong enough to carry four label identities and three headline acts without leaning on any of them. Built as a 3D block system in modern colour, with a motion variant cut for social. Used across announce, web, print distro and Brighton Dome's wider poster runs.",
    pageTitle: "Together We Stand poster for Brighton Dome",
    summary:
      "Campaign artwork for Brighton Dome's Together We Stand, a four-label jazz showcase: a 3D block system in modern colour, with a motion cut for social.",
    published: "2026-04-20",
    videoDuration: 2.75,
    video: "/work/imported/videos/together-we-stand-poster.mp4",
    videoPoster: "/work/imported/posters/together-we-stand-mockup.webp",
    alt: "Together We Stand poster mocked up as a screen print, built from a 3D block system in bright colour",
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
    pageTitle: "Grumble campaign artwork for The Pylons",
    summary:
      "Campaign artwork for The Pylons' Grumble: a Lincolnshire film shoot composited in Photoshop with a 3D-sculpted sign rig, for release banners and profiles.",
    tools: ["Photoshop"],
    published: "2026-04-20",
    image: "/work/imported/banners/grumble-pylons.webp",
    alt: "Campaign banner for The Pylons' Grumble: a broken sign rig holding the title above a desolate Lincolnshire landscape",
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
    pageTitle: "Jgrrey tour poster, blueprint indigo print",
    summary:
      "Tour poster for Jgrrey's Playing gigs just so I can see you run: 3D moons from Blender, flattened in Photoshop on blueprint indigo. Heavy stock print.",
    tools: ["Blender", "Photoshop"],
    published: "2026-04-20",
    image: "/work/imported/posters/jgrrey-mu.webp",
    alt: "Jgrrey tour poster in blueprint indigo with floating moons and the Playing gigs just so I can see you dates",
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
      "Release animation for my single Your Cries, self-released in 2022. The plan was a music video of a body falling gracefully through the sky. With no budget for that, I leaned a chair back in the studio, filmed myself falling off it, and rotoscoped the footage in After Effects. That single take carried the whole release: the still became the artwork, the rotoscoped loop became the Spotify Canvas and the Apple Music animated cover art.",
    pageTitle: "Your Cries release animation and Spotify Canvas",
    summary:
      "Release animation for Toby Johnson's single Your Cries: a rotoscoped fall through the sky that became the artwork, Spotify Canvas and Apple Music cover.",
    tools: ["After Effects"],
    published: "2026-04-20",
    alt: "Rotoscoped figure falling through a cloudy blue sky, the release animation for Your Cries",
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
    pageTitle: "Filtered gig poster, Lincoln",
    summary:
      "A3 gig poster for a Filtered night at Angel Coffee House in Lincoln: heavy type built around the spiral of a stirred coffee, printed in teal ink.",
    published: "2026-04-20",
    image: "/work/imported/posters/filtered-gig-mockup2.webp",
    alt: "Filtered gig poster in teal ink with heavy type set around the spiral of a stirred coffee",
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
    pageTitle: "Offcut identity and packaging design",
    summary:
      "Identity and packaging for Offcut, a Herefordshire workshop building clocks from reclaimed chapel floorboards, built around one material story.",
    published: "2026-04-20",
    image: "/work/imported/projects/box-grid.webp",
    alt: "Black-on-black Offcut packaging boxes laid out in a grid",
    kind: "image",
    bg: "#0a0a0a",
  },
  {
    slug: "health-plus",
    title: "Health Plus",
    client: "TJCreate",
    year: "2024",
    category: "3D",
    tags: ["3D", "Product"],
    blurb:
      "Self-initiated 3D product render for Health Plus, a concept supplement brand. Modelled, textured and lit in Blender.",
    pageTitle: "Health Plus 3D product render in Blender",
    summary:
      "Self-initiated 3D product render for Health Plus, a concept supplement brand: bottle and capsules modelled, textured and lit in Blender by Toby Johnson.",
    tools: ["Blender"],
    published: "2026-07-06",
    image: "/work/imported/projects/health-plus-render.webp",
    alt: "Blue Health Plus supplement bottle with capsules suspended around it, a 3D render",
    kind: "image",
    modalFit: "contain",
    bg: "#dfe1ea",
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
    pageTitle: "Liar Liar lyric video for Common Request",
    summary:
      "Lyric video for Common Request's Liar Liar: a terminal print-out look with lyrics threaded through scrolling code, glitch and displacement, in After Effects.",
    tools: ["After Effects"],
    published: "2026-04-20",
    videoDuration: 11.3,
    video: "/work/imported/motion/liar-liar-out-now.mp4",
    videoPoster: "/work/imported/posters-video/liar-liar-out-now.webp",
    alt: "Liar Liar lyric video frame styled as a terminal print-out, lyrics threaded through scrolling code",
    kind: "hover-video",
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
      "Self-initiated motion study built around carousel tiles rotating through 3D space, with fashion imagery cycling through a layered sequence. A testbed for the newer After Effects 3D and layer tools.",
    pageTitle: "Fashion Tiles 3D motion study",
    summary:
      "Self-initiated motion study: carousel tiles rotating through 3D space with fashion imagery cycling through them, built with the newer After Effects 3D tools.",
    tools: ["After Effects"],
    published: "2026-04-20",
    videoDuration: 4.27,
    video: "/work/imported/motion/fashion-tiles.mp4",
    videoPoster: "/work/imported/posters-video/fashion-tiles.webp",
    alt: "Carousel tiles of fashion imagery rotating through 3D space",
    kind: "hover-video",
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
      "Product animation for Pulse Audio's in-ear headphones. Sculpted, textured, lit and animated in Blender, composited in After Effects. A slow rotating cycle that lets the form and materials carry the piece.",
    pageTitle: "Headphone 3D product animation for Pulse Audio",
    summary:
      "Product animation of Pulse Audio's in-ear headphones: sculpted, textured, lit and animated in Blender, composited in After Effects as a slow rotating cycle.",
    tools: ["Blender", "After Effects"],
    published: "2026-04-21",
    videoDuration: 10.57,
    video: "/work/imported/motion/headphone-animation.mp4",
    videoPoster: "/work/imported/projects/headphone-render.webp",
    alt: "Wireless earbuds falling beside their charging case, a frame from the 3D product animation",
    kind: "hover-video",
    modalFit: "contain",
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
    pageTitle: "Heart anatomical motion piece",
    summary:
      "Short motion piece built from a single anatomical drawing of a heart, animated in After Effects with a slow pulse and blood moving through the vessels.",
    tools: ["After Effects"],
    published: "2026-04-20",
    videoDuration: 6.1,
    video: "/work/imported/motion/heart.mp4",
    videoPoster: "/work/imported/posters-video/heart.webp",
    alt: "Etched anatomical drawing of a heart, animated with blood flowing through the vessels",
    kind: "hover-video",
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
    pageTitle: "Phone Booth 3D scene, day and night",
    summary:
      "Phone booth modelled in Blender for an environmental 3D scene challenge, rendered in two lighting passes, daylight and night, that flip on hover.",
    tools: ["Blender"],
    published: "2026-04-20",
    image: "/work/imported/day-night/phone-booth-day.webp",
    alt: "Phone booth in a 3D street scene",
    imageHover: "/work/imported/day-night/phone-booth-night.webp",
    kind: "day-night",
    bg: "#101418",
  },
  {
    slug: "huel-render",
    title: "Huel",
    client: "TJCreate",
    year: "2024",
    category: "3D",
    tags: ["3D", "Product"],
    blurb:
      "Self-initiated 3D study of Huel's ready-to-drink bottle. Not a client commission. Modelled and rendered in Blender.",
    pageTitle: "Huel bottle 3D product study in Blender",
    summary:
      "Self-initiated 3D study of Huel's ready-to-drink bottle, modelled and rendered in Blender by Toby Johnson. Not a client commission.",
    tools: ["Blender"],
    published: "2026-07-06",
    image: "/work/imported/projects/huel-render.webp",
    alt: "Huel ready-to-drink bottle tumbling out of a shipping box, a 3D render",
    kind: "image",
    modalFit: "contain",
    bg: "#d9d9d9",
  },
  {
    slug: "baraka-loop",
    title: "Joshua Baraka",
    client: "Joshua Baraka",
    year: "2024",
    category: "Motion",
    tags: ["Motion", "Release"],
    blurb:
      "Release animation for Joshua Baraka's Recess, a seven-track mixtape featuring collaborations with KiDi and Bensoul. Torn paper assembles in 3D space to build the original artwork, animated in After Effects. Rustic and handmade in feel, despite being entirely digital. Used as the Spotify Canvas and the Apple Music animated cover art, and rolled out across the release campaign.",
    pageTitle: "Joshua Baraka Recess release animation",
    summary:
      "Release animation for Joshua Baraka's Recess mixtape: torn paper assembling in 3D to build the artwork, run as the Spotify Canvas and animated cover art.",
    tools: ["After Effects"],
    published: "2026-04-20",
    videoDuration: 6.57,
    video: "/work/imported/motion/baraka-loop.mp4",
    videoPoster: "/work/imported/posters-video/baraka-loop.webp",
    alt: "Torn paper pieces assembling into the artwork for Joshua Baraka's Recess mixtape",
    kind: "hover-video",
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
    pageTitle: "Wonderkid packaging design",
    summary:
      "Packaging for Wonderkid, Toby Johnson's producer alias: a typographic label system rendered in-bag, giving a personal release the finish of a client one.",
    published: "2026-04-20",
    image: "/work/imported/posters/wonderkid-in-bag.webp",
    alt: "Wonderkid typographic label rendered on a sealed bag",
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
    pageTitle: "Carousel motion template for Lilly Era",
    summary:
      "Square-format motion template for Lilly Era, a house music label: a reusable system where assets, type and timing swap without rebuilding the file.",
    published: "2026-04-20",
    videoDuration: 17.97,
    video: "/work/imported/motion/carousel-square.mp4",
    videoPoster: "/work/imported/posters-video/carousel-square.webp",
    alt: "Frame from the square-format Carousel motion template for Lilly Era",
    kind: "hover-video",
    bg: "#0a0a0a",
  },
  {
    slug: "gameboy-render",
    title: "Game Boy",
    client: "TJCreate",
    year: "2024",
    category: "3D",
    tags: ["3D", "Product"],
    blurb:
      "Self-initiated 3D study of the original Game Boy. Not a client commission. Modelled and rendered in Blender.",
    pageTitle: "Game Boy 3D product render in Blender",
    summary:
      "Self-initiated 3D study of the original Game Boy, modelled and rendered in Blender by Toby Johnson, floating over colourful retro shapes.",
    tools: ["Blender"],
    published: "2026-07-06",
    image: "/work/imported/projects/gameboy-render.webp",
    alt: "Original Nintendo Game Boy floating over colourful retro shapes, a 3D render",
    kind: "image",
    modalFit: "contain",
    // Console sits right of centre in the 16:9 render — pull the square
    // grid crop right so it lands centred in the tile.
    focal: "60% 50%",
    bg: "#12181f",
  },
  {
    slug: "jb-wrong-places",
    title: "Wrong Places",
    client: "Joshua Baraka",
    year: "2025",
    category: "Motion",
    tags: ["Lyric Video", "Motion"],
    blurb:
      "Lyric video for Joshua Baraka's Wrong Places. A lighter rotates slowly through the frame with lyrics fading over it, sculpted and animated in Blender with finishing in After Effects. The looping cut ran as the Spotify Canvas and the Apple Music animated cover art, and as the campaign's main social asset. Full video on YouTube.",
    pageTitle: "Wrong Places lyric video for Joshua Baraka",
    summary:
      "Lyric video for Joshua Baraka's Wrong Places: a lighter turning slowly with lyrics fading over it, built in Blender and finished in After Effects.",
    tools: ["Blender", "After Effects"],
    published: "2026-04-21",
    videoDuration: 7.0,
    video: "/work/imported/motion/jb-wrong-places-loop.mp4",
    videoPoster: "/work/imported/posters-video/jb-wrong-places-vinyl.webp",
    alt: "Wrong Places by Joshua Baraka: a lighter turning slowly through the frame with lyrics fading over it",
    kind: "hover-video",
    bg: "#0a0a0a",
    previewYouTubeId: "jeKPLNFDoHA",
  },
];

// Labels, agencies, and artists with their own vector logos. Potrace-traced from
// source PNGs so they scale crisp at any size. URLs open in a new tab.
// Ordered most recognisable first — array order is the display order in the
// Clients grid (rows of 4 on desktop), so the biggest names lead.
// Ordered by profile: recognisable companies first, then music-industry
// organisations, labels, agencies and studios, then individual artists and
// bands at the end.
export const CLIENTS_WITH_LOGOS = [
  // Companies / brands
  {
    name: "Mojang Studios",
    logo: "/work/imported/logos/mojang-studios.svg",
    url: "https://www.minecraft.net/en-us",
  },
  {
    name: "RevenueCat",
    logo: "/work/imported/logos/revenuecat.svg",
    url: "https://www.revenuecat.com",
  },
  {
    name: "Replit",
    logo: "/work/imported/logos/replit.svg",
    url: "https://replit.com",
  },
  {
    name: "JetBrains",
    logo: "/work/imported/logos/jetbrains.svg",
    url: "https://www.jetbrains.com",
  },
  {
    name: "Gigantic",
    logo: "/work/imported/logos/gigantic.svg",
    url: "https://www.gigantic.com",
  },
  {
    name: "Instrumental",
    logo: "/work/imported/logos/instrumental.svg",
    url: "https://instrumental.info",
  },
  // LyriSync is a TJCreate product, not a commission. Placed here on Toby's
  // explicit instruction (2026-08-24) after the alternative — the "Also built"
  // strip below, which is where its description and schema live — was flagged.
  // Kept last in this group so the recognisable client names lead the wall.
  // PNG rather than SVG because the lockup's wordmark is set in Unbounded and
  // was only ever exported as raster; the panel masks it to flat white like
  // every other mark, so the source's colour never shows.
  {
    name: "LyriSync",
    logo: "/work/products/lyrisync-lockup.png",
    url: "https://lyrisync.com",
  },
  // Music organisations, labels, agencies, venues, studios
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
    name: "Women in Jazz",
    logo: "/work/imported/logos/women-in-jazz.svg",
    url: "https://www.womeninjazz.co.uk",
  },
  {
    name: "New Soil",
    logo: "/work/imported/logos/new-soil.svg",
    url: "https://www.newsoilmusic.com/",
  },
  {
    name: "Moves Recordings",
    logo: "/work/imported/logos/moves.svg",
    url: "https://moves.life/",
  },
  {
    name: "Bridge the Gap",
    logo: "/work/imported/logos/bridge-the-gap.svg",
    url: "https://www.bridgethegapmgt.com/",
  },
  {
    name: "Pace Artists",
    logo: "/work/imported/logos/pace.svg",
    url: "https://www.paceartists.com",
  },
  {
    name: "Made by Analogue",
    logo: "/work/imported/logos/analogue-leeds.svg",
    url: "https://madebyanalogue.co.uk/",
  },
  {
    name: "Optima Design",
    logo: "/work/imported/logos/optima.svg",
    url: "https://www.optimadesign.co.uk",
  },
  // Artists / musicians
  {
    name: "Courtney Barnett",
    logo: "/work/imported/logos/courtney-barnett.svg",
    url: "https://courtneybarnett.com.au",
  },
  {
    name: "Corto.Alto",
    logo: "/work/imported/logos/corto-alto.svg",
    url: "https://cortoalto.com",
  },
  {
    name: "Jgrrey",
    logo: "/work/imported/logos/jgrrey.svg",
    url: "https://open.spotify.com/artist/66rDbD3tWR3M1uNuIaDAGx",
  },
  {
    name: "Hot Wax",
    logo: "/work/imported/logos/hot-wax.svg",
    url: "https://www.hotwaxband.com",
  },
  {
    name: "Richard Walters",
    logo: "/work/imported/logos/richard-walters.svg",
    url: "https://richardwalters.bandcamp.com",
  },
];

export const CLIENTS = CLIENTS_WITH_LOGOS.map((c) => c.name);

/**
 * Products built under TJCreate rather than for a client. Kept out of
 * CLIENTS_WITH_LOGOS on purpose: the logo wall is commissioned work, and
 * sliding an own-brand product in among Mojang and JetBrains would quietly
 * overstate it. These render in their own quieter strip (BuiltBy.tsx).
 *
 * `url` points at the apex domain, not www: www.lyrisync.com 308-redirects to
 * lyrisync.com, which is also its declared canonical, so linking to www would
 * spend the link on a redirect hop.
 *
 * Copy note: LyriSync's own site is barred from publishing accuracy figures
 * (licence-restricted benchmark corpus), so this describes what the tool does
 * and never how well it does it.
 */
export const OWN_PRODUCTS = [
  {
    name: "LyriSync",
    // Deliberately NOT under work/imported/logos/: .gitignore excludes
    // *.png there (that folder is a local drop-in for design exports), so a
    // lockup left in it would never be committed and would 404 in production.
    logo: "/work/products/lyrisync-lockup.png",
    logoWidth: 405,
    logoHeight: 73,
    url: "https://lyrisync.com",
    /* Anchor text, not a label. It read "lyrisync.com" until 2026-08-24: a
       bare domain describes the destination to nobody and carries none of
       the terms that page is trying to rank for. This is the one outbound
       link to LyriSync from an established domain, so it is worth spending
       on words rather than on a URL. Fits the 672px (max-w-2xl) column at
       10px mono with 0.2em tracking, so it stays on one line. */
    linkLabel: "Sync lyrics for After Effects",
    /* Deep links, added 2026-09-04, and the reason is measured rather than
       general SEO hygiene. Until now every link here pointed at the apex
       domain, and Search Console showed exactly one LyriSync page indexed --
       the homepage, the one page with an external link. The other 14 sat at
       "Discovered - currently not indexed" with Last crawled: N/A, meaning
       Google had queued them and never spent the budget to fetch one. The
       three format pages were worse than that: "URL is unknown to Google",
       no referring sitemap, no referring page.

       This site is a single URL with 5 inbound links, all from platforms
       that nofollow (LinkedIn, Behance, Reddit), so it has almost no equity
       to pass and these will not manufacture any. What they do is turn four
       URLs from "seen in a sitemap" into "linked from an indexed page",
       which is a different crawl queue.

       Anchor text is the page's own subject, not a bare path, for the same
       reason linkLabel stopped being "lyrisync.com" on 2026-08-24. Keep
       these pointing at apex lyrisync.com: www 308-redirects, so a www link
       spends the hop for nothing. Four is the ceiling -- this is the
       smallest section on the page by design and a link list that outgrows
       the blurb above it is the tail wagging the dog. */
    deepLinks: [
      {
        label: "After Effects",
        url: "https://lyrisync.com/after-effects",
      },
      {
        label: "SRT lyrics generator",
        url: "https://lyrisync.com/srt-lyrics-generator",
      },
      {
        label: "LRC generator",
        url: "https://lyrisync.com/lrc-generator",
      },
      {
        label: "Karaoke lyrics",
        url: "https://lyrisync.com/karaoke-lyrics-generator",
      },
    ],
    blurb:
      "LyriSync times your own lyrics against your own track, then sends them into After Effects as real text layers. It also exports SRT, WebVTT, LRC and ASS karaoke. Built out of my own lyric video work, because timing lyrics by hand is the slowest part of the job.",
    /**
     * Longer description, collapsed behind a native <details>. It renders in
     * the served HTML and is only hidden with CSS, which is the distinction
     * that matters: Google indexes expand/collapse content it can see in the
     * markup, but not text a click has to fetch. So this must stay a server
     * component with no JS-gated content.
     */
    detailsLabel: "What it does",
    details: [
      "I spent years making lyric videos, and the slow part was always getting each word to land on the right frame. LyriSync does that bit: upload the track, paste in your own lyrics, and it returns word-level and line-level timings.",
      "It exports an After Effects importer that builds real, editable text layers rather than a flattened graphic, plus SRT, WebVTT, LRC, ASS karaoke, TTML, JSON and CSV. Built for lyric video editors, motion designers, and anyone doing subtitle or karaoke work.",
    ],
  },
];

export type Service = {
  title: string;
  blurb: string;
  items: string[];
};

export const SERVICES: Service[] = [
  {
    title: "Graphic Design",
    blurb:
      "Campaign artwork, print and packaging for brands, products and events. For artists and labels that means release artwork, tour and gig posters and social assets, built to stay consistent wherever they land, from a shop shelf to a feed.",
    items: [
      "Campaign artwork",
      "Release artwork",
      "Posters & print",
      "Packaging",
      "Social & digital",
      "Editorial",
      "Brand identity",
      "Campaign rollouts",
    ],
  },
  {
    title: "Motion Graphics",
    blurb:
      "Motion built to carry an idea beyond the static. Lyric videos, Spotify Canvas and Apple Music animated cover art, logo animations, promos, social cuts and LED screen loops for live shows, with animation, typography, compositing and 3D brought together where the job needs it.",
    items: [
      "Lyric videos",
      "Spotify Canvas loops",
      "Animated cover art",
      "Logo animation",
      "Animated typography",
      "Promos & trailers",
      "Social content",
      "LED screen loops",
      "Broadcast graphics",
    ],
  },
  {
    title: "3D Design",
    blurb:
      "Product visualisation, modelling, materials, lighting and animation in Blender for campaigns that need more than supplied photography. From standalone product renders and packshots to fully built scenes, packaging visuals and product animation.",
    items: [
      "3D product renders",
      "Packshots",
      "Product animation",
      "3D modelling",
      "Materials & texturing",
      "Lighting",
      "Scene design",
      "Packaging visualisation",
      "Sculpting",
    ],
  },
];

export type Faq = { question: string; answer: string };

/**
 * Questions people put to search engines and AI assistants when they are
 * looking for this kind of designer. Answers are facts from the work on this
 * site and the profile, in the first person, with no prices. Rendered as
 * native <details> in Faq.tsx with FAQPage JSON-LD, so the answers ship in
 * the served HTML.
 */
export const FAQS: Faq[] = [
  {
    question: "What do you do?",
    answer:
      "Graphic design, motion graphics and 3D, freelance under TJCreate. Campaign artwork, posters and packaging on the graphic side; lyric videos, release animations, logo animations and social cuts in motion; product renders, packshots and product animation in 3D.",
  },
  {
    question: "Where are you based, and do you work remotely?",
    answer:
      "Lincoln, UK. I work remotely with clients and agency teams across the UK, and the two years I spent in-house at Marathon Music Group were remote with a London team.",
  },
  {
    question: "Do you make lyric videos, Spotify Canvas loops and animated cover art?",
    answer:
      "Yes. Lyric videos are a big part of the motion work (Liar Liar for Common Request, Wrong Places for Joshua Baraka), and release animations get cut down into Spotify Canvas loops and Apple Music animated cover art, as with Joshua Baraka's Recess. I built LyriSync to time lyrics for exactly this kind of job.",
  },
  {
    question: "Can you do 3D product renders and packshots?",
    answer:
      "Yes, in Blender. Product renders, packshots, product animation and built scenes, modelled, textured and lit from scratch or from supplied artwork, then composited in After Effects where the piece needs it. The Twelfth Man coin for Angel & Anchor is a recent example.",
  },
  {
    question: "Do you work with agencies and studios?",
    answer:
      "Yes. I take on white-label and overflow work for agencies and studios, working from their creative direction or joining the team for a project. Some of the brand work on this site (RevenueCat, Replit, JetBrains) was delivered through Klutch Studio.",
  },
  {
    question: "Can you animate an existing logo or brand?",
    answer:
      "Yes. Logo animations, idents and animated typography built from existing brand assets, keeping to the brand's own guidelines and motion rules where it has them.",
  },
  {
    question: "Do you make visuals for live shows and LED screens?",
    answer:
      "Yes. Looping LED screen content and show visuals built to the venue's screen specs, alongside the social and release assets around a show.",
  },
  {
    question: "What software do you use?",
    answer:
      "After Effects, Photoshop, Illustrator and Premiere Pro, with Blender for 3D and Figma for layout. Deliverables come as print-ready artwork or video exports in the formats each platform wants.",
  },
  {
    question: "How long have you been designing?",
    answer:
      "Over eight years. I started in 2018 art directing my own releases as a signed artist, moved to client work under TJCreate in 2021, and spent November 2023 to January 2026 full-time in-house at Marathon Music Group.",
  },
  {
    question: "How does a project start?",
    answer:
      "Email hello@tjcreate.co.uk with what you're making, where it will run, any references and the deadline. I'll come back with questions, then scope, timeline and fees are agreed in writing before work starts.",
  },
];
