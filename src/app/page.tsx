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
} from "@/components";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <Divider />
      <Features />
      <Divider />
      <MarketThesis />
      <Divider />
      <TokenIndependence />
      <Divider />
      <HowItWorks />
      <Divider />
      <RunwayProtection />
      <Divider />
      <OriginCapsuleSection />
      <Divider />
      <ProtocolStats />
      <ClosingCTA />
      <Footer />
    </main>
  );
}
