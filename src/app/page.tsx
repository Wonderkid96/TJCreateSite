import Hero from "@/components/Hero";
import WorkGallery from "@/components/WorkGallery";
import VideoSection from "@/components/VideoSection";
import Services from "@/components/Services";
import About from "@/components/About";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";
import SectionPanel from "@/components/SectionPanel";

/**
 * Page narrative — the deliberate order the site reads in:
 *   1. Hero          — hook
 *   2. Selected Work — proof (three-column grid)
 *   3. Showreel      — motion reel
 *   4. Services      — what I do            ┐
 *   5. About         — who I am             │ stacked full-bleed
 *   6. Clients       — who I've worked with │ sections
 *   7. Contact       — get in touch         ┘
 *   8. Footer
 */
export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <WorkGallery />
      <VideoSection />
      {/* Stacked full-bleed sections (Services → About → Clients → Contact).
          Scroll pinning was removed, so these just stack and scroll normally.
          The wrapper stays black to match the panels' own backgrounds. */}
      <div className="relative bg-ink">
        <SectionPanel className="bg-ink">
          <Services />
        </SectionPanel>
        <SectionPanel className="bg-ink">
          <About />
        </SectionPanel>
        <SectionPanel className="bg-accent">
          <Clients />
        </SectionPanel>
        <SectionPanel className="bg-ink" last>
          <Contact />
        </SectionPanel>
      </div>
      <SiteFooter />
    </main>
  );
}
