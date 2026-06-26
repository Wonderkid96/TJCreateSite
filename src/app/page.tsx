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
 *   2. Selected Work — proof (pinned horizontal pan)
 *   3. Showreel      — motion reel (pinned, frames centrally)
 *   4. Services      — what I do            ┐
 *   5. About         — who I am             │ stacked full-bleed deck
 *   6. Clients       — who I've worked with │ (panels pin + slide over)
 *   7. Contact       — get in touch         ┘
 *   8. Footer
 */
export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <WorkGallery />
      <VideoSection />
      {/* Stacked full-bleed deck: each panel pins to the top and the next
          slides up over it as you scroll (Services → About → Say hello).
          Disciplines marquee and the client logo slider were removed so the
          page reads as a sequence of full-bleed panels. The wrapper is black
          so when a panel scales back during a transition it reveals black
          behind it, not the page's off-white. */}
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
