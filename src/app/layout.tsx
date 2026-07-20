import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import RevealObserver from "@/components/RevealObserver";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import Nav from "@/components/Nav";
import Splash from "@/components/Splash";
import { ThemeProvider, NO_FLASH_SNIPPET } from "@/components/ThemeProvider";

// Header / display face — Peridot PE Variable (Extended Heavy), served from
// the Adobe Fonts web project `bhj7dgq`. Adobe's licence does not permit
// self-hosting the file, so this is loaded from Typekit's CDN rather than
// bundled. The family name and axis values live in globals.css.
const TYPEKIT_CSS = "https://use.typekit.net/bhj7dgq.css";

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

const SITE_URL = "https://www.tjcreate.co.uk";
const SITE_NAME = "TJCreate · Toby Johnson";
const SITE_DESC =
  "Graphic and motion designer working with brands, agencies and businesses on campaign artwork, visual identity, and motion graphics. Based in Lincoln, UK.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Graphic & Motion Designer · Toby Johnson · TJCreate",
    template: "%s · TJCreate",
  },
  description: SITE_DESC,
  applicationName: "TJCreate",
  authors: [{ name: "Toby Johnson", url: SITE_URL }],
  creator: "Toby Johnson",
  publisher: "TJCreate",
  keywords: [
    "graphic designer",
    "motion designer",
    "freelance graphic designer",
    "freelance motion designer",
    "graphic designer Lincoln",
    "motion designer UK",
    "brand identity designer",
    "brand campaigns",
    "packaging design",
    "product design",
    "advertising design",
    "commercial motion graphics",
    "3D product rendering",
    "music industry designer",
    "record label design",
    "campaign artwork",
    "album artwork",
    "lyric videos",
    "visualisers",
    "motion graphics",
    "3D design",
    "visual identity",
    "Toby Johnson",
    "TJCreate",
  ],
  category: "Design",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Graphic & Motion Designer · Toby Johnson",
    description: SITE_DESC,
    locale: "en_GB",
    // Images are auto-attached from src/app/opengraph-image.jpg —
    // Next serves it at /opengraph-image.jpg and wires the og:image tag
    // (plus width/height/alt) for us.
  },
  twitter: {
    card: "summary_large_image",
    title: "Graphic & Motion Designer · Toby Johnson",
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
  themeColor: "#fffdf8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD structured data — three interlinked schemas in a single @graph
// block so Google can read person, business, and site identity together.
//   Person          → the human, his social identity + job title
//   ProfessionalService → the business offering (discipline + area served)
//   WebSite         → the site itself + publisher relationship
// All three link via @id references so the knowledge graph stays connected.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#toby`,
      name: "Toby Johnson",
      alternateName: "TJCreate",
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image.jpg`,
      jobTitle: "Graphic & Motion Designer",
      description: SITE_DESC,
      email: "hello@tjcreate.co.uk",
      worksFor: { "@id": `${SITE_URL}/#tjcreate` },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lincoln",
        addressRegion: "Lincolnshire",
        postalCode: "LN1",
        addressCountry: "GB",
      },
      knowsAbout: [
        "Graphic design",
        "Motion design",
        "3D design",
        "Brand identity",
        "Packaging design",
        "Campaign design",
        "Product visualisation",
        "Editorial design",
        "Album artwork",
        "Lyric videos",
        "Music visuals",
        "Typography",
      ],
      sameAs: [
        "https://www.linkedin.com/in/tobyjohnsoncreate/",
        "https://www.instagram.com/tj.create",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#tjcreate`,
      name: "TJCreate",
      alternateName: "Toby Johnson Create",
      url: SITE_URL,
      founder: { "@id": `${SITE_URL}/#toby` },
      description:
        "Design studio run by Toby Johnson: graphic and motion design for brands, agencies and businesses across sectors.",
      image: `${SITE_URL}/opengraph-image.jpg`,
      logo: `${SITE_URL}/icon.svg`,
      email: "hello@tjcreate.co.uk",
      priceRange: "££",
      areaServed: [
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Place", name: "Worldwide (remote)" },
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lincoln",
        addressRegion: "Lincolnshire",
        postalCode: "LN1",
        addressCountry: "GB",
      },
      serviceType: ["Graphic Design", "Motion Design", "3D Design"],
      sameAs: [
        "https://www.linkedin.com/in/tobyjohnsoncreate/",
        "https://www.instagram.com/tj.create",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#site`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESC,
      inLanguage: "en-GB",
      publisher: { "@id": `${SITE_URL}/#tjcreate` },
      author: { "@id": `${SITE_URL}/#toby` },
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
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Display face from Adobe Fonts. Preconnect first so the stylesheet
            and the woff2 it points at aren't waiting on two cold TLS
            handshakes — this face paints the nav and every heading. */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href={TYPEKIT_CSS} />
        {/* Apply saved theme before paint to avoid a flash of the wrong colours. */}
        <Script id="theme-no-flash" strategy="beforeInteractive">
          {NO_FLASH_SNIPPET}
        </Script>
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
        <a href="#work" className="skip-link">Skip to work</a>
        <ThemeProvider>
          <Splash />
          <SmoothScroll />
          <RevealObserver />
          <ScrollProgress />
          <div className="grain" aria-hidden />
          <Nav />
          {children}
          <BackToTop />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
