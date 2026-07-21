import Hero from "@/components/Hero";
import WorkGallery from "@/components/WorkGallery";
import VideoSection from "@/components/VideoSection";
import ServicesWipe from "@/components/ServicesWipe";
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
 *   4. Services      — what I do (full-screen wipe sequence)
 *   5. About         — who I am             ┐ stacked full-bleed
 *   6. Clients       — who I've worked with │ sections
 *   7. Contact       — get in touch         ┘
 *   8. Footer
 */
export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <WorkGallery />
      {/* Everything from the Showreel down to the footer shares one black
          wrapper, and must stay that way. The page background is paper, so two
          ink siblings stacked directly on it meet at a fractional pixel, their
          edges anti-alias, and the cream behind bleeds through as a hairline
          between them. Inside a single ink container there is nothing to show
          through. Do not lift a black section back out to sit on <main>.
          Scroll pinning was removed, so these just stack and scroll normally. */}
      <div className="relative bg-ink">
        <VideoSection />
        {/* Services is a full-screen wipe sequence, not a stacked panel: it
            renders its own brand-colour boards over a pinned stage. It sits in
            the ink wrapper so the black either side of it never shows a cream
            seam. */}
        <ServicesWipe />
        <SectionPanel className="bg-ink">
          <About />
        </SectionPanel>
        <SectionPanel className="bg-ink">
          <Clients />
        </SectionPanel>
        <SectionPanel className="bg-ink" last>
          <Contact />
        </SectionPanel>
        <SiteFooter />
      </div>
    </main>
  );
}
