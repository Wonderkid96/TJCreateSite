import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import RevealObserver from "@/components/RevealObserver";
import BackToTop from "@/components/BackToTop";
import Nav from "@/components/Nav";
import { ThemeProvider, NO_FLASH_SNIPPET } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";

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
  "Toby Johnson (TJCreate) is a graphic and motion designer with a strong background in music. I design campaign artwork, motion graphics and full visual rollouts for record labels, artists, agencies and brands.";

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
    "music industry designer",
    "campaign artwork",
    "lyric videos",
    "visualisers",
    "record label design",
    "album artwork",
    "motion graphics",
    "Lincoln UK",
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
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Toby Johnson · Graphic & Motion Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toby Johnson · Graphic & Motion Designer",
    description: SITE_DESC,
    images: ["/og-image.jpg"],
    creator: "@tj.create",
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

// JSON-LD structured data so Google can index the person + business properly.
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Toby Johnson",
  alternateName: "TJCreate",
  url: SITE_URL,
  jobTitle: "Graphic & Motion Designer",
  worksFor: { "@type": "Organization", name: "TJCreate" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lincoln",
    addressCountry: "GB",
  },
  sameAs: [
    "https://www.linkedin.com/in/tobyjohnsoncreate/",
    "https://www.instagram.com/tj.create",
  ],
  email: "hello@tjcreate.co.uk",
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
    >
      <head>
        {/* Apply saved theme before paint to avoid a flash of the wrong colours. */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SNIPPET }} />
      </head>
      <body className="bg-paper text-ink">
        <ThemeProvider>
          <SmoothScroll />
          <RevealObserver />
          <Cursor />
          <div className="grain" aria-hidden />
          <Nav />
          {children}
          <BackToTop />
        </ThemeProvider>
        <Script
          id="ld-person"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
