"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export function FundingShift() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header fade up
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Cards stagger in
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(":scope > div");
        if (cards.length > 0) {
          gsap.set(cards, { y: 50, opacity: 0 });
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="funding-changed" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-10 sm:mb-12">
          <p className="section-label mb-4">02 / Opportunity</p>
          <h2 className="heading-display text-white mb-4">
            FUNDING CHANGED
          </h2>
          <p className="text-muted text-base sm:text-lg max-w-lg mx-auto">
            Ideas that couldn&apos;t raise before can now ship and fund in days.
          </p>
        </div>

        {/* Two-sided value proposition */}
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Founders Card */}
          <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 group hover:border-accent-bright/30 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-accent-bright/20 border border-accent-bright/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-bright" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">For Founders</h3>
                <p className="text-[12px] text-white/50">Launch &amp; grow your idea</p>
              </div>
            </div>

            <p className="text-white/70 text-[15px] leading-relaxed mb-6">
              Gain early funding to support your initial growth phase and go-to-market strategy.
            </p>

            {/* What you get */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[13px]">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <span className="text-white/80">Launch a Vibetoken for your project</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <span className="text-white/80">Raise funds for marketing &amp; infra</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <span className="text-white/80">Unlock capital as monthly tranches release</span>
              </div>
            </div>

            {/* Glow */}
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-accent-bright/[0.08] rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Backers Card */}
          <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 group hover:border-accent/30 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">For Backers</h3>
                <p className="text-[12px] text-white/50">Support &amp; participate</p>
              </div>
            </div>

            <p className="text-white/70 text-[15px] leading-relaxed mb-6">
              Gain early access and exposure to vibecoded apps through Vibetokens.
            </p>

            {/* What you get */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[13px]">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <span className="text-white/80">Discover promising ideas early</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <span className="text-white/80">Hold Vibetokens in your wallet</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <span className="text-white/80">Share in the project&apos;s upside</span>
              </div>
            </div>

            {/* Glow */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-accent/[0.08] rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-12 text-center"
        >
          <p className="text-muted text-[13px] sm:text-[14px]">
            <span className="text-accent">Days, not months.</span> Provenance-verified, time-released.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
