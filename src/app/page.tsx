import {
  Navigation,
  Hero,
  MarketThesis,
  Features,
  TokenIndependence,
  HowItWorks,
  RunwayProtection,
  OriginCapsuleSection,
  ClosingCTA,
  Footer,
  ScrollFadeUp,
} from "@/components";

const sections = [
  Features,
  MarketThesis,
  TokenIndependence,
  HowItWorks,
  RunwayProtection,
  OriginCapsuleSection,
];

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-accent focus:text-black focus:px-4 focus:py-2 focus:font-mono focus:text-sm"
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main-content" className="min-h-screen bg-background">
        {/* Document frame: hairline rails, sections divided by rules */}
        <div className="mx-auto max-w-[1400px] border-x border-white/[0.06]">
          <Hero />
          {sections.map((Section, i) => (
            <div key={i} className="border-t border-white/[0.06]">
              <ScrollFadeUp>
                <Section />
              </ScrollFadeUp>
            </div>
          ))}
        </div>
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
