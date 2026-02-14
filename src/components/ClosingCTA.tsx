"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TextScramble } from "./TextScramble";

export function ClosingCTA() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="section-label mb-4 block">Launch</span>
          <TextScramble
            text="Ready to raise?"
            className="section-heading mb-4"
          />
          <p className="text-muted text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 font-sans font-light">
            Launch your Vibetoken and start raising in minutes — escrow-backed, time-released, on-chain.
          </p>
          <motion.div
            initial={{ opacity: 0, filter: "brightness(1)" }}
            whileInView={{ opacity: 1, filter: "brightness(1)" }}
            transition={{ duration: 0.15, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Link
              href="https://app.vibestarter.xyz"
              className="btn-mechanical px-6 sm:px-8 py-3.5 sm:py-4 text-[15px] text-center"
            >
              Launch Your Raise
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
