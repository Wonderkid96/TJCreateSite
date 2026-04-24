import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import LogoMarquee from "@/components/LogoMarquee";
import WorkGrid from "@/components/WorkGrid";
import Services from "@/components/Services";
import About from "@/components/About";
import ContactCTA from "@/components/ContactCTA";
import { CLIENTS_WITH_LOGOS } from "@/lib/content";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Marquee
        items={["Graphic", "Motion", "3D", "Identity", "Editorial", "Print"]}
        italic
        speed="fast"
      />
      <WorkGrid />
      <Services />
      <LogoMarquee items={CLIENTS_WITH_LOGOS} />
      <About />
      <ContactCTA />
    </main>
  );
}
