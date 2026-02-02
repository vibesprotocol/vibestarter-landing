"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export function RunwayProtection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header slide in from left
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { x: -50, opacity: 0 },
          {
            x: 0,
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

      // Timeline animate in
      if (timelineRef.current) {
        gsap.fromTo(
          timelineRef.current,
          { scale: 0.95, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Feature cards stagger in
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(":scope > div");
        if (cards.length > 0) {
          gsap.set(cards, { y: 40, opacity: 0 });
          gsap.to(cards, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
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
    <section ref={sectionRef} id="runway-protection" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-10 sm:mb-12">
          <p className="section-label mb-4">03 / Protection</p>
          <h2 className="heading-display text-white mb-4">
            6-MONTH RUNWAY
          </h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-white/60 max-w-2xl mx-auto mb-10"
        >
          Built-in accountability for sustainable building. Funds release automatically over 6 months—no milestones to verify, just time-locked tranches with 72-hour challenge windows.
        </motion.p>

        {/* Visual Timeline */}
        <div ref={timelineRef} className="mb-10 p-6 bg-white/[0.02] border border-white/[0.06] rounded-xl">
          <h3 className="font-medium mb-6 text-center text-sm text-white/50">Fund Release Timeline</h3>

          {/* Desktop timeline */}
          <div className="hidden md:block max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline bar */}
              <div className="h-6 bg-white/[0.05] rounded-full overflow-hidden flex">
                <div className="w-[10%] bg-accent flex items-center justify-center text-[10px] font-bold text-black" title="Kickstart: 10%">10%</div>
                <div className="w-[15%] bg-accent-bright border-l border-background flex items-center justify-center text-[10px] font-medium text-black" title="Month 1: 15%">15%</div>
                <div className="w-[15%] bg-accent-bright border-l border-background flex items-center justify-center text-[10px] font-medium text-black" title="Month 2: 15%">15%</div>
                <div className="w-[15%] bg-accent-bright border-l border-background flex items-center justify-center text-[10px] font-medium text-black" title="Month 3: 15%">15%</div>
                <div className="w-[15%] bg-accent-bright border-l border-background flex items-center justify-center text-[10px] font-medium text-black" title="Month 4: 15%">15%</div>
                <div className="w-[15%] bg-accent-bright border-l border-background flex items-center justify-center text-[10px] font-medium text-black" title="Month 5: 15%">15%</div>
                <div className="w-[15%] bg-accent-bright border-l border-background flex items-center justify-center text-[10px] font-medium text-black" title="Month 6: 15%">15%</div>
              </div>

              {/* Labels */}
              <div className="flex justify-between mt-3 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  Kickstart
                </span>
                <span>M1</span>
                <span>M2</span>
                <span>M3</span>
                <span>M4</span>
                <span>M5</span>
                <span>M6</span>
              </div>
            </div>
          </div>

          {/* Mobile timeline - simplified */}
          <div className="md:hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-3 bg-accent rounded-l-full" style={{ flex: '10' }}></div>
              <div className="flex-1 h-3 bg-accent-bright" style={{ flex: '90' }}></div>
              <div className="h-3 w-3 bg-accent-bright rounded-r-full"></div>
            </div>
            <div className="flex justify-between text-xs text-white/40">
              <span className="text-accent">10% Kickstart</span>
              <span className="text-accent-bright">90% over 6 months</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white/[0.02] border border-accent/20 rounded-xl hover:border-accent/40 transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2 text-white">Kickstart Tranche</h3>
            <p className="text-sm text-white/60">
              10% released immediately at finalization. Get momentum while the rest vests monthly.
            </p>
          </div>

          <div className="p-5 bg-white/[0.02] border border-accent-bright/20 rounded-xl hover:border-accent-bright/40 transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-accent-bright/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-accent-bright" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2 text-white">72h Challenge Window</h3>
            <p className="text-sm text-white/60">
              Each payout opens a 72-hour window. Backers can challenge suspicious requests.
            </p>
          </div>

          <div className="p-5 bg-white/[0.02] border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2 text-white">LP Auto-Locked</h3>
            <p className="text-sm text-white/60">
              Liquidity pool tokens locked at raise finalization. No rug pulls.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
