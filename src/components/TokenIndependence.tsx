"use client";

import { EthIcon, VibetokenIcon, AerodromeSymbol } from "./icons";
import { SectionHeader } from "./SectionHeader";

const stages = [
  {
    num: "01",
    label: "Contribute",
    desc: "Back a raise with ETH. Same flat price for every backer — no bonding curve.",
    icon: <EthIcon className="w-6 h-6 text-accent" />,
  },
  {
    num: "02",
    label: "Mint",
    desc: "Your Vibetoken arrives instantly in your wallet. A standard ERC-20.",
    icon: <VibetokenIcon className="w-6 h-6 text-accent-bright" />,
  },
  {
    num: "03",
    label: "Pool",
    desc: "An ETH pair launches on Aerodrome. LP locked forever, protecting all holders.",
    icon: <AerodromeSymbol className="w-6 h-6 text-[#0052FF]" />,
  },
  {
    num: "04",
    label: "Trade",
    desc: "Freely tradeable on any DEX from day one. No platform token, no lock-in.",
    icon: (
      <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 4v13M7 4L3.5 7.5M7 4l3.5 3.5M17 20V7m0 13l3.5-3.5M17 20l-3.5-3.5" />
      </svg>
    ),
  },
];

export function TokenIndependence() {
  return (
    <section id="vibetokens" className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          num="03"
          label="Vibetokens"
          title="Freely tradeable from day 1"
          description="Every Vibetoken is a standard ERC-20 paired with ETH on Aerodrome. Trade instantly from day one — no platform token required."
        />

        {/* Token lifecycle + spec sheet */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-px bg-white/[0.06] border border-white/[0.06]">
          {/* Lifecycle: four static stages */}
          <div className="grid sm:grid-cols-2 gap-px bg-white/[0.06]">
            {stages.map((stage) => (
              <div
                key={stage.num}
                className="bg-background p-6 sm:p-8 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-mono text-sm text-accent">{stage.num}</span>
                  {stage.icon}
                </div>
                <h3 className="font-display font-bold uppercase tracking-tight text-lg text-white mb-2">
                  {stage.label}
                </h3>
                <p className="text-white/60 text-sm font-sans font-light leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Spec sheet */}
          <div className="bg-background p-6 sm:p-8 font-mono">
            <div className="text-accent text-[10px] uppercase tracking-[0.3em] mb-8">
              {"// Token_Specs"}
            </div>
            <dl className="grid grid-cols-[90px_1fr] gap-y-5 text-sm">
              <dt className="text-white/40">TYPE</dt>
              <dd className="text-white">ERC-20 Standard</dd>
              <dt className="text-white/40">PRICING</dt>
              <dd className="text-white">
                Flat <span className="text-white/40">{"// no curve"}</span>
              </dd>
              <dt className="text-white/40">PAIR</dt>
              <dd className="text-white">$TOKEN / ETH</dd>
              <dt className="text-white/40">POOL</dt>
              <dd className="text-accent">Aerodrome LP</dd>
              <dt className="text-white/40">LOCK</dt>
              <dd className="text-accent">
                Permanent <span className="text-white/40">{"// ∞"}</span>
              </dd>
              <dt className="text-white/40">CHAIN</dt>
              <dd className="text-white">Base (8453)</dd>
            </dl>
          </div>
        </div>

        {/* Fair-launch guarantee line */}
        <p className="mt-6 font-mono text-[13px] text-white/60">
          <span className="text-accent">$</span> No snipers. No insiders. No bonding curve
          games. Every backer pays the same price — first or last.
        </p>
      </div>
    </section>
  );
}
