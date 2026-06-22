import Hero from "@/components/Hero";
import WorkGallery from "@/components/WorkGallery";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";
import SectionPanel from "@/components/SectionPanel";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <WorkGallery />
      {/* Stacked full-bleed deck: each panel pins to the top and the next
          slides up over it as you scroll (Services → About → Say hello).
          Disciplines marquee and the client logo slider were removed so the
          page reads as a sequence of full-bleed panels. */}
      <div className="relative">
        <SectionPanel className="bg-ink">
          <Services />
        </SectionPanel>
        <SectionPanel className="bg-ink">
          <About />
        </SectionPanel>
        <SectionPanel className="bg-ink" last>
          <Contact />
        </SectionPanel>
      </div>
      <SiteFooter />
    </main>
  );
}
