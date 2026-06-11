"use client";

import { SectionHeader } from "./SectionHeader";

const thesisPoints = [
  {
    id: "vibecoding",
    num: "01",
    title: "Vibecoding is here",
    tagline: "Agent-native builders",
    description: "Prompt to production in hours. Agents write code, founders direct vision.",
  },
  {
    id: "cofounder",
    num: "02",
    title: "Technical co-founder optional",
    tagline: "MVP cost collapse",
    description: "MVPs no longer require a technical founder. Agents fill the role.",
  },
  {
    id: "funding",
    num: "03",
    title: "Vibecoins unlock funding",
    tagline: "Idea-stage capital",
    description: "Ideas can raise before building. Time-released, escrow-backed.",
  },
];

export function MarketThesis() {
  return (
    <section id="the-shift" className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          num="02"
          label="Market Thesis"
          badge="The Agent Era"
          title="The shift is already here"
          description="Software is being written by agents. The rules for building and funding are changing."
        />

        {/* Three-panel thesis grid — everything readable at once, no rotation */}
        <div className="grid md:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06]">
          {thesisPoints.map((point) => (
            <div
              key={point.id}
              className="bg-background p-6 sm:p-8 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-baseline justify-between gap-4 mb-10">
                <span className="font-mono text-sm text-accent">{point.num}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/50 text-right">
                  {point.tagline}
                </span>
              </div>
              <h3 className="font-display font-bold uppercase tracking-tight text-lg sm:text-xl text-white mb-3 leading-tight">
                {point.title}
              </h3>
              <p className="text-white/60 text-sm font-sans font-light leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-muted text-sm font-sans font-light">
            Agents write code. Founders direct vision. Funding infrastructure needs to catch up.
          </p>
          <a
            href="/thesis"
            className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors text-[13px] font-mono"
          >
            Read the full thesis →
          </a>
        </div>
      </div>
    </section>
  );
}
