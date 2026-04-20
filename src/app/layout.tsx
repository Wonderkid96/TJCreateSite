import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";

const display = Instrument_Serif({
  variable: "--font-display",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toby Johnson — Graphic & Motion Designer",
  description:
    "Lincoln-based graphic and motion designer working with record labels, artists, and ambitious brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="bg-paper text-ink">
        <SmoothScroll />
        <Cursor />
        <div className="grain" aria-hidden />
        <Nav />
        {children}
      </body>
    </html>
  );
}
