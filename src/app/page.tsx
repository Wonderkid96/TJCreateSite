import ShowreelHero from "@/components/ShowreelHero";
import WorkGallery from "@/components/WorkGallery";
import ServicesWipe from "@/components/ServicesWipe";
import About from "@/components/About";
import LiveSection from "@/components/LiveSection";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";
import SectionPanel from "@/components/SectionPanel";

/**
 * Page narrative — the deliberate order the site reads in:
 *   1. Showreel hero — the reel is the hook (id="top")
 *   2. Selected Work — proof (three-column grid)
 *   3. Services      — what I do (full-screen wipe sequence)
 *   4. About         — who I am             ┐ stacked full-bleed
 *   5. Live          — my music (+ Spotify)  │ sections
 *   6. Clients       — who I've worked with  │
 *   7. Contact       — get in touch          ┘
 *   8. Footer
 */
export default function Home() {
  return (
    <main className="relative">
      <ShowreelHero />
      <WorkGallery />
      {/* Everything from Services down to the footer shares one black wrapper,
          and must stay that way. The page background is paper, so two ink
          siblings stacked directly on it meet at a fractional pixel, their edges
          anti-alias, and the cream behind bleeds through as a hairline between
          them. Inside a single ink container there is nothing to show through.
          Do not lift a black section back out to sit on <main>. */}
      <div className="relative bg-ink">
        {/* Services is a full-screen wipe sequence, not a stacked panel: it
            renders its own brand-colour boards over a pinned stage. It sits in
            the ink wrapper so the black either side of it never shows a cream
            seam. */}
        <ServicesWipe />
        <SectionPanel className="bg-ink">
          <About />
        </SectionPanel>
        <SectionPanel className="bg-ink">
          <LiveSection />
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
