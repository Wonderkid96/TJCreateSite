import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import RevealObserver from "@/components/RevealObserver";
import BackToTop from "@/components/BackToTop";
import Nav from "@/components/Nav";
import Splash from "@/components/Splash";
import { ThemeProvider, NO_FLASH_SNIPPET } from "@/components/ThemeProvider";

const display = Instrument_Serif({
  variable: "--font-display",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const SITE_URL = "https://www.tjcreate.co.uk";
const SITE_NAME = "TJCreate · Toby Johnson";
const SITE_DESC =
  "Graphic and motion designer working with record labels, artists, and brands on campaign artwork, visual identity, and motion graphics. Based in Lincoln, UK.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Toby Johnson · Graphic & Motion Designer · TJCreate",
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
    title: "Toby Johnson · Graphic & Motion Designer",
    description: SITE_DESC,
    locale: "en_GB",
    // Images are auto-attached from src/app/opengraph-image.tsx —
    // Next generates /opengraph-image and wires the og:image tag for
    // us, so no static /og-image.jpg dependency to maintain.
  },
  twitter: {
    card: "summary_large_image",
    title: "Toby Johnson · Graphic & Motion Designer",
    description: SITE_DESC,
    // Twitter image is auto-attached from src/app/twitter-image.tsx.
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
  themeColor: "#f4f1e9",
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
      image: `${SITE_URL}/opengraph-image`,
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
        "Design studio run by Toby Johnson — graphic and motion design for record labels, artists, agencies and brands.",
      image: `${SITE_URL}/opengraph-image`,
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
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload the 3D @ typeface so it's ready before the user reaches Contact. */}
        <link rel="preload" href="/fonts/optimer_bold.typeface.json" as="fetch" crossOrigin="anonymous" />
        {/* Apply saved theme before paint to avoid a flash of the wrong colours. */}
        <Script id="theme-no-flash" strategy="beforeInteractive">
          {NO_FLASH_SNIPPET}
        </Script>
        {/* Structured data — lives in <head> per schema.org best
            practice so crawlers pick it up on the first pass without
            waiting on hydration. */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify(structuredData)}
        </Script>
      </head>
      <body className="bg-paper text-ink">
        <ThemeProvider>
          <Splash />
          <SmoothScroll />
          <RevealObserver />
          <Cursor />
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
