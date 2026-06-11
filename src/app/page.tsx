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
  Divider,
  ScrollFadeUp,
} from "@/components";

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
        <Hero />
        <Divider />
        <ScrollFadeUp>
          <Features />
        </ScrollFadeUp>
        <Divider />
        <ScrollFadeUp>
          <MarketThesis />
        </ScrollFadeUp>
        <Divider />
        <ScrollFadeUp>
          <TokenIndependence />
        </ScrollFadeUp>
        <Divider />
        <ScrollFadeUp>
          <HowItWorks />
        </ScrollFadeUp>
        <Divider />
        <ScrollFadeUp>
          <RunwayProtection />
        </ScrollFadeUp>
        <Divider />
        <ScrollFadeUp>
          <OriginCapsuleSection />
        </ScrollFadeUp>
        <Divider />
        <ScrollFadeUp>
          <ClosingCTA />
        </ScrollFadeUp>
      </main>
      <Footer />
    </>
  );
}
