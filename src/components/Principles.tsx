"use client";

import { FundingGapAnimation } from "./FundingGapAnimation";
import { SectionHeader } from "./SectionHeader";

const blockers = [
  { code: "ERR_01", text: "VCs won't touch you without traction" },
  { code: "ERR_02", text: "Traction requires capital you don't have" },
  { code: "ERR_03", text: "The memecoin casino will eat your project alive" },
];

export function Features() {
  return (
    <section id="the-problem" className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          num="01"
          label="The Problem"
          title="You shipped an app last weekend. Now what?"
          description="Agents removed the technical barrier. You can go from idea to working product in a weekend. But a working product isn't a business. You still need users, infrastructure, and marketing budget."
        />

        <div className="grid lg:grid-cols-2 gap-px bg-white/[0.06] border border-white/[0.06]">
          {/* Left: the funding gap as an error log */}
          <div className="bg-background p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-4">
              founder@weekend-app % fund --traditional
            </p>
            <div className="space-y-3">
              {blockers.map((b) => (
                <div
                  key={b.code}
                  className="flex items-baseline gap-4 border border-white/[0.06] bg-white/[0.02] px-4 py-3.5"
                >
                  <span className="font-mono text-[13px] text-persimmon-400 shrink-0">{b.code}</span>
                  <span className="text-white/70 font-sans font-light text-[15px]">{b.text}</span>
                </div>
              ))}
            </div>

            {/* The exit from the loop */}
            <div className="mt-6 flex items-start gap-3 border border-accent/25 bg-accent/[0.06] px-4 py-4">
              <span className="font-mono text-accent shrink-0 text-[15px]">$</span>
              <p className="text-white font-sans text-[15px] leading-relaxed">
                Vibestarter gives vibecoding founders a real funding path: community-backed,
                escrow-protected, and designed for builders, not degens.
              </p>
            </div>
          </div>

          {/* Right: animated funding gap visual */}
          <div className="bg-background relative min-h-[400px]">
            <FundingGapAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}
