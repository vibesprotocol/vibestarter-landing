"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { TextScramble } from "./TextScramble";
import { CornerBrackets } from "@/components/ui/corner-brackets";
import { SegmentedProgress } from "@/components/ui/segmented-progress";

gsap.registerPlugin(ScrollTrigger);

const tranches = [
  { month: "Kickstart", percent: 10, color: "accent" },
  { month: "M1", percent: 15, color: "accent-bright" },
  { month: "M2", percent: 15, color: "accent-bright" },
  { month: "M3", percent: 15, color: "accent-bright" },
  { month: "M4", percent: 15, color: "accent-bright" },
  { month: "M5", percent: 15, color: "accent-bright" },
  { month: "M6", percent: 15, color: "accent-bright" },
];

export function RunwayProtection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeTrancheIndex, setActiveTrancheIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const animationRef = useRef<number | null>(null);

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

      // Trigger animation when timeline comes into view — replays on re-enter
      if (timelineRef.current) {
        ScrollTrigger.create({
          trigger: timelineRef.current,
          start: "top 80%",
          onEnter: () => {
            setHasAnimated(false);
            setIsInView(true);
          },
          onLeaveBack: () => {
            setIsInView(false);
            setActiveTrancheIndex(-1);
            setProgress(0);
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-animate the timeline when in view (runs once)
  useEffect(() => {
    if (!isInView || hasAnimated) {
      return;
    }

    let startTime: number | null = null;
    const duration = 7000; // 7 seconds for full animation (slower)

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const currentProgress = Math.min(elapsed / duration, 1);

      setProgress(currentProgress);

      // Calculate tranche index based on progress (7 tranches, 0-6)
      // Each tranche activates at its proportional point
      const trancheIndex = Math.min(Math.floor(currentProgress * 7), 6);
      setActiveTrancheIndex(currentProgress > 0.02 ? trancheIndex : -1);

      if (currentProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setHasAnimated(true);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInView, hasAnimated]);

  return (
    <section ref={sectionRef} id="runway-protection" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="section-label">// Protection</span>
            <span className="px-3 py-1 text-[11px] font-mono text-accent-bright bg-accent-bright/10 border border-accent-bright/20">
              Backer Protection
            </span>
          </div>
          <TextScramble
            text="How Backers Stay Protected"
            className="section-heading"
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-white/60 max-w-2xl mx-auto mb-10 font-sans font-light"
        >
          Built-in accountability for sustainable building. Funds release automatically over 6 months—no milestones to verify, just time-locked tranches with 72-hour challenge windows.
        </motion.p>

        {/* Animated Timeline Visualization */}
        <div ref={timelineRef} className="mb-10 max-w-4xl mx-auto">
          {/* Desktop Timeline */}
          <div className="hidden md:block">
            <CornerBrackets><div className="relative bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-8 pb-12">
              {/* Progress track */}
              <div className="relative h-16 mb-6 overflow-visible">
                {/* Background track */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 bg-white/[0.05]" />

                {/* Animated fill - synced to active tranche dot position */}
                {/* Dots are at 0%, 16.67%, 33.33%, 50%, 66.67%, 83.33%, 100% with justify-between */}
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-3 bg-gradient-to-r from-accent via-accent-bright to-accent-bright"
                  animate={{
                    width: activeTrancheIndex >= 0
                      ? `calc(${(activeTrancheIndex / 6) * 100}% + 8px)`
                      : '0%'
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />

                {/* Tranche markers */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2">
                  {tranches.map((tranche, index) => {
                    const isActive = index <= activeTrancheIndex;
                    const isCurrent = index === activeTrancheIndex;
                    const isKickstart = index === 0;

                    return (
                      <motion.div
                        key={tranche.month}
                        className="relative flex flex-col items-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        {/* Marker dot */}
                        <motion.div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? isKickstart
                                ? "bg-accent border-accent"
                                : "bg-accent-bright border-accent-bright"
                              : "bg-background border-white/20"
                          }`}
                          animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ repeat: isCurrent ? Infinity : 0, duration: 1 }}
                        >
                          {isActive && (
                            <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          )}
                        </motion.div>

                        {/* Label above/below alternating */}
                        <div className={`absolute ${index % 2 === 0 ? "-top-10" : "top-10"} text-center whitespace-nowrap`}>
                          <p className={`text-[11px] font-mono transition-colors ${isActive ? "text-white" : "text-white/40"}`}>
                            {tranche.month}
                          </p>
                          <p className={`text-xs font-bold transition-colors ${
                            isActive
                              ? isKickstart ? "text-accent" : "text-accent-bright"
                              : "text-white/30"
                          }`}>
                            {tranche.percent}%
                          </p>
                        </div>

                        {/* 72h challenge indicator - alternates position opposite to label */}
                        {isCurrent && !isKickstart && (
                          <motion.div
                            className={`absolute left-1/2 -translate-x-1/2 ${
                              index % 2 === 0 ? "top-12" : "-top-12"
                            }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="flex items-center gap-1 px-2 py-1 bg-persimmon-500/20 border border-persimmon-500/30 whitespace-nowrap">
                              <motion.div
                                className="w-1.5 h-1.5 rounded-full bg-persimmon-400"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                              />
                              <span className="text-[9px] font-mono text-persimmon-400">72h window</span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Current release info */}
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {activeTrancheIndex >= 0 && (
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/10">
                    <div className={`w-3 h-3 rounded-full ${activeTrancheIndex === 0 ? "bg-accent" : "bg-accent-bright"}`} />
                    <span className="text-sm text-white/70 font-sans">
                      <span className="font-bold text-white">
                        {tranches.slice(0, activeTrancheIndex + 1).reduce((sum, t) => sum + t.percent, 0)}%
                      </span>
                      {" "}released
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-sm text-white/70 font-sans">
                      <span className="font-bold text-white">
                        {tranches.slice(activeTrancheIndex + 1).reduce((sum, t) => sum + t.percent, 0)}%
                      </span>
                      {" "}remaining
                    </span>
                  </div>
                )}
              </motion.div>
            </div></CornerBrackets>
          </div>

          {/* Mobile Timeline - Server Status Readout (no container) */}
          <div className="md:hidden">
            {/* Running total header */}
            {activeTrancheIndex >= 0 && (
              <div className="flex items-baseline justify-between mb-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Total Released</span>
                <span className="text-2xl font-mono font-bold text-white">
                  {tranches.slice(0, activeTrancheIndex + 1).reduce((sum, t) => sum + t.percent, 0)}%
                </span>
              </div>
            )}

            <div className="space-y-0">
              {tranches.map((tranche, index) => {
                const isActive = index <= activeTrancheIndex;
                const isCurrent = index === activeTrancheIndex;
                const isKickstart = index === 0;

                return (
                  <motion.div
                    key={tranche.month}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.04 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-between py-3">
                      {/* Left: percentage as primary data */}
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-[44px] font-mono font-bold text-right transition-colors duration-300 ${
                            isActive
                              ? isKickstart
                                ? "text-accent text-xl"
                                : "text-accent-bright text-xl"
                              : "text-white/20 text-lg"
                          }`}
                        >
                          {tranche.percent}%
                        </span>
                        <span className={`font-mono text-sm uppercase transition-colors duration-300 ${
                          isActive ? "text-white" : "text-white/30"
                        }`}>
                          {tranche.month}
                        </span>
                      </div>

                      {/* Right: status */}
                      {isKickstart && isActive && (
                        <span className="text-[10px] font-mono text-accent uppercase tracking-wider">Paid</span>
                      )}
                      {isCurrent && !isKickstart && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-1.5"
                        >
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-persimmon-400"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          />
                          <span className="text-[10px] font-mono text-persimmon-400 uppercase tracking-wider">72h window</span>
                        </motion.div>
                      )}
                      {isActive && !isCurrent && !isKickstart && (
                        <span className="text-[10px] font-mono text-accent-bright/60 uppercase tracking-wider">Released</span>
                      )}
                      {!isActive && (
                        <span className="text-[10px] font-mono text-white/15 uppercase tracking-wider">Locked</span>
                      )}
                    </div>
                    {/* Horizontal divider */}
                    {index < tranches.length - 1 && (
                      <div className={`h-px transition-colors duration-300 ${
                        isActive ? "bg-white/[0.08]" : "bg-white/[0.04]"
                      }`} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0 }}
            viewport={{ once: true }}
          >
            <CornerBrackets><div className="relative p-5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors overflow-hidden group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-accent/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base text-white">Kickstart</h3>
                  <p className="text-[11px] font-mono text-accent">10% instant</p>
                </div>
              </div>
              <p className="text-sm text-white/60 font-sans font-light">
                Immediate funding at finalization to build momentum.
              </p>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-accent/10 rounded-full blur-2xl" />
            </div></CornerBrackets>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <CornerBrackets><div className="relative p-5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors overflow-hidden group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-accent-bright/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent-bright" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base text-white">Monthly Vesting</h3>
                  <p className="text-[11px] font-mono text-accent-bright">15% × 6 months</p>
                </div>
              </div>
              <p className="text-sm text-white/60 font-sans font-light">
                Remaining funds release in equal monthly tranches.
              </p>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-accent-bright/10 rounded-full blur-2xl" />
            </div></CornerBrackets>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <CornerBrackets><div className="relative p-5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors overflow-hidden group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-persimmon-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-persimmon-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-sans font-bold text-base text-white">Challenge Window</h3>
                  <p className="text-[11px] font-mono text-persimmon-400">72 hours</p>
                </div>
              </div>
              <p className="text-sm text-white/60 font-sans font-light">
                Backers can challenge suspicious releases before payout.
              </p>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-persimmon-500/10 rounded-full blur-2xl" />
            </div></CornerBrackets>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
