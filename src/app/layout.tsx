import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import RevealObserver from "@/components/RevealObserver";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import Nav from "@/components/Nav";
import { SERVICES } from "@/lib/content";
import {
  CONTACT_EMAIL,
  MUSIC_PROFILE_URLS,
  ORG_ID,
  PERSON_ID,
  SITE_DESC,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  SOCIAL_URLS,
  WEBSITE_ID,
} from "@/lib/site";

// Header / display face — Peridot PE Variable (Extended Heavy), served from
// the Adobe Fonts web project `bhj7dgq`. Adobe's licence does not permit
// self-hosting the file, so this is loaded from Typekit's CDN rather than
// bundled. The family name and axis values live in globals.css.
const TYPEKIT_CSS = "https://use.typekit.net/bhj7dgq.css";

// Fallback display face — Special Gothic Expanded One, the previous display
// font, kept self-hosted so a Typekit outage degrades to a wide grotesque
// rather than Arial Narrow. preload:false so it is only fetched if the
// browser actually needs it (i.e. when Peridot fails to load).
const displayFallback = localFont({
  src: "./fonts/SpecialGothicExpandedOne-Regular.woff2",
  variable: "--font-display-fallback",
  display: "swap",
  preload: false,
});

// Body / UI face — Schibsted Grotesk. Characterful grotesque, variable
// 400-900. Replaced Space Grotesk (July 2026) to move the site away from
// the default AI-build look while keeping the same warm grotesque tone.
const sans = Schibsted_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Label / metadata face — IBM Plex Mono. Replaced JetBrains Mono (July 2026)
// for the same reason. Non-variable, so weights are declared explicitly.
const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · TJCreate",
  },
  description: SITE_DESC,
  applicationName: "TJCreate",
  authors: [{ name: "Toby Johnson" }],
  creator: "Toby Johnson",
  publisher: "TJCreate",
  category: "Design",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Toby Johnson · Graphic & Motion Designer, Lincoln",
    description: SITE_DESC,
    locale: "en_GB",
    // Images are auto-attached from src/app/opengraph-image.jpg —
    // Next serves it at /opengraph-image.jpg and wires the og:image tag
    // (plus width/height/alt) for us.
  },
  twitter: {
    card: "summary_large_image",
    title: "Toby Johnson · Graphic & Motion Designer, Lincoln",
    description: SITE_DESC,
    // Twitter image is auto-attached from src/app/twitter-image.jpg.
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD structured data — one @graph so Google reads the person, the
// business, the product and the site as one connected entity.
//   Person              → the human, his job title and social identity
//   ProfessionalService → the business, its services and the area it serves
//   SoftwareApplication → LyriSync, owned by the business
//   WebSite             → the site itself + publisher relationship
// Every @id is shared with the project pages (src/lib/site.ts), which hang
// their VideoObject / ImageObject nodes off the same Person and business.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Toby Johnson",
      alternateName: "TJCreate",
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image.jpg`,
      jobTitle: "Graphic & Motion Designer",
      description: SITE_DESC,
      email: CONTACT_EMAIL,
      worksFor: { "@id": ORG_ID },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lincoln",
        addressRegion: "Lincolnshire",
        addressCountry: "GB",
      },
      knowsAbout: [
        "Graphic design",
        "Motion design",
        "Motion graphics",
        "3D design",
        "3D product rendering",
        "Product visualisation",
        "Campaign artwork",
        "Packaging design",
        "Poster design",
        "Album artwork",
        "Lyric videos",
        "Spotify Canvas",
        "Logo animation",
        "Typography",
        "After Effects",
        "Blender",
      ],
      // Music profiles tie the designer to the musician Toby Johnson as one
      // entity for name searches.
      sameAs: [...SOCIAL_URLS, ...MUSIC_PROFILE_URLS],
    },
    {
      "@type": "ProfessionalService",
      "@id": ORG_ID,
      name: "TJCreate",
      alternateName: "Toby Johnson Create",
      url: SITE_URL,
      founder: { "@id": PERSON_ID },
      foundingDate: "2021-03",
      description:
        "Freelance graphic and motion design by Toby Johnson in Lincoln: campaign artwork, motion graphics and 3D for brands, artists and agencies.",
      image: `${SITE_URL}/opengraph-image.jpg`,
      logo: `${SITE_URL}/icon.svg`,
      email: CONTACT_EMAIL,
      areaServed: { "@type": "Country", name: "United Kingdom" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lincoln",
        addressRegion: "Lincolnshire",
        addressCountry: "GB",
      },
      // Client-facing design disciplines; product authorship is described separately.
      serviceType: ["Graphic Design", "Motion Design", "3D Design"],
      // The three services exactly as the Services section describes them.
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Design services",
        itemListElement: SERVICES.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.blurb,
            provider: { "@id": ORG_ID },
          },
        })),
      },
      // Own products, not clients. Declaring ownership here is what ties the
      // tjcreate.co.uk entity to lyrisync.com in the knowledge graph, so the
      // link in the "Also built" strip reads as a first-party relationship
      // rather than an unexplained outbound link.
      owns: [{ "@id": "https://lyrisync.com/#lyrisync" }],
      sameAs: SOCIAL_URLS,
    },
    {
      // LyriSync — a TJCreate product, described here rather than in
      // CLIENTS_WITH_LOGOS because it is not commissioned work. No accuracy
      // or performance claims: LyriSync's benchmark corpus is licence
      // restricted and its figures are not publishable.
      "@type": "SoftwareApplication",
      "@id": "https://lyrisync.com/#lyrisync",
      name: "LyriSync",
      url: "https://lyrisync.com",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      description:
        "Times your own lyrics against your own track and sends them into After Effects as real text layers. Also exports SRT, WebVTT, LRC and ASS karaoke.",
      author: { "@id": PERSON_ID },
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESC,
      inLanguage: "en-GB",
      publisher: { "@id": ORG_ID },
      author: { "@id": PERSON_ID },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${displayFallback.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        {/* Display face from Adobe Fonts. Preconnect first so the stylesheet
            and the woff2 it points at aren't waiting on two cold TLS
            handshakes — this face paints the nav and every heading. */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        {/* Loaded non-blocking: measured 2.75s to fetch on a throttled mobile
            connection, and as a plain <link rel="stylesheet"> that blocks
            first paint until it resolves. The script below creates the link
            itself with media="print" (fetches immediately via the preconnect
            above, but a print-media stylesheet doesn't block screen
            rendering), then flips it to "all" once loaded — the classic
            loadCSS technique. Injected via a script rather than a static
            <link> + a separate onload script: Next's beforeInteractive
            scripts are always hoisted into <head> regardless of source
            order (see next/script docs), so a companion script can't safely
            assume the <link> already exists by the time it runs. The face
            itself can't be self-hosted (Adobe licence), so this is the
            largest safe win available for it. noscript covers the no-JS
            fallback, where the print-media trick has no way to flip. */}
        <Script id="typekit-loadcss" strategy="beforeInteractive">
          {`(function(){
            var l = document.createElement("link");
            l.rel = "stylesheet";
            l.href = "${TYPEKIT_CSS}";
            l.media = "print";
            l.onload = function () { l.media = "all"; };
            document.head.appendChild(l);
          })();`}
        </Script>
        <noscript>
          <link rel="stylesheet" href={TYPEKIT_CSS} />
        </noscript>
        {/* Structured data — a plain <script>, deliberately NOT next/script.
            next/script serialises even beforeInteractive tags into its loader
            queue (self.__next_s.push([...])), so the JSON-LD only becomes a
            real ld+json tag once JavaScript has run. Googlebot might catch it
            on a second render pass, but Bing, LinkedIn, Slack and the rich
            results validators never would. A raw tag ships the schema in the
            served HTML where every crawler reads it on the first pass. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-paper text-ink">
        <a href="#main" className="skip-link">Skip to content</a>
        <SmoothScroll />
        <RevealObserver />
        <ScrollProgress />
        <div className="grain" aria-hidden />
        <Nav />
        {children}
        <BackToTop />
        <SpeedInsights />
      </body>
    </html>
  );
}
