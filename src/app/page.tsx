import {
  Navigation,
  Hero,
  MarketThesis,
  Features,
  FundingShift,
  HowItWorks,
  RunwayProtection,
  Standard,
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
      <FundingShift />
      <Divider />
      <HowItWorks />
      <Divider />
      <RunwayProtection />
      <Divider />
      <Standard />
      <Divider />
      <ProtocolStats />
      <ClosingCTA />
      <Footer />
    </main>
  );
}
