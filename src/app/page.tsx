import {
  Navigation,
  Hero,
  MarketThesis,
  Features,
  TokenIndependence,
  HowItWorks,
  RunwayProtection,
  OriginCapsuleSection,
  ProtocolStats,
  ClosingCTA,
  Footer,
  Divider,
  ScrollFadeUp,
} from "@/components";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
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
        <ProtocolStats />
      </ScrollFadeUp>
      <ScrollFadeUp>
        <ClosingCTA />
      </ScrollFadeUp>
      <Footer />
    </main>
  );
}
