"use client";

import { FundingGapAnimation } from "./FundingGapAnimation";

export function Features() {
  return (
    <section id="the-problem" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single card layout */}
        <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-0">
            {/* Left side - Text content */}
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
              <span className="section-label mb-4">The Problem</span>
              <h2 className="section-heading mb-4">
                You shipped an app last weekend. Now what?
              </h2>
              <p className="text-muted text-base sm:text-lg leading-relaxed mb-8 font-sans">
                Agents removed the technical barrier. You can go from idea to working product in a weekend. But a working product isn&apos;t a business. You still need users, infrastructure, and marketing budget.
              </p>

              {/* The gap */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white/60 font-sans">VCs won&apos;t touch you without traction</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white/60 font-sans">Traction requires capital you don&apos;t have</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white/60 font-sans">The memecoin casino will eat your project alive</span>
                  </div>
                </div>
              </div>

              {/* Arrow to solution */}
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-white font-sans font-medium">
                    Vibestarter gives vibecoding founders a real funding path: community-backed, escrow-protected, and designed for builders, not degens.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Animated Visual */}
            <div className="relative min-h-[400px]">
              <FundingGapAnimation />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
