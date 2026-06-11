"use client";

import Link from "next/link";
import { TextScramble } from "./TextScramble";

export function ClosingCTA() {
  return (
    <section className="bg-accent text-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/60 mb-5">
          // Launch — February 2026 · Base
        </p>
        <TextScramble
          text="Ready to raise?"
          className="font-display font-bold uppercase tracking-[-0.04em] leading-[0.95] text-[clamp(40px,8vw,110px)]"
        />
        <p className="text-black/70 text-lg sm:text-xl max-w-xl font-sans font-light leading-relaxed mt-6 mb-10">
          Launch your Vibetoken and start raising in minutes — escrow-backed, time-released, on-chain.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href="https://app.vibestarter.xyz"
            className="bg-black text-white font-mono font-medium text-sm uppercase tracking-wider px-8 py-4 text-center hover:bg-black/80 transition-colors"
          >
            Start Your Raise
          </Link>
          <Link
            href="https://app.vibestarter.xyz/raises/vibes"
            className="border border-black/40 text-black font-mono font-medium text-sm uppercase tracking-wider px-8 py-4 text-center hover:border-black hover:bg-black/5 transition-colors"
          >
            Back the $VIBES Raise
          </Link>
        </div>
      </div>
    </section>
  );
}
