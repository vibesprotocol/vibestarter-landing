"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

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
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isInView, setIsInView] = useState(false);

  // Auto-cycle tabs when in view
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 6000); // 6 seconds per tab

    return () => clearInterval(interval);
  }, [isInView]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
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

      // Detect when section is in view
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => setIsInView(true),
        onLeave: () => setIsInView(false),
        onEnterBack: () => setIsInView(true),
        onLeaveBack: () => setIsInView(false),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="the-shift" className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Subtle wave/timeline motif background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute top-1/2 left-0 w-full h-64 -translate-y-1/2 opacity-[0.03]"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C200,150 400,50 600,100 C800,150 1000,50 1200,100"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0,120 C200,170 400,70 600,120 C800,170 1000,70 1200,120"
            stroke="white"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="section-label">02 / Market Thesis</span>
            <span className="px-2 py-0.5 text-[10px] font-mono text-accent/80 bg-accent/10 rounded-full border border-accent/20">
              Post-Opus 4.5 era
            </span>
          </div>
          <h2 className="section-heading mb-4">
            The shift is already here
          </h2>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto font-sans">
            Software is being written by agents. The rules for building and funding are changing.
          </p>
        </div>

        {/* Interactive Tabbed Section */}
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
            {/* Tab List - stacks vertically on mobile for better readability */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 pb-2 lg:pb-0">
              {thesisPoints.map((point, index) => (
                <button
                  key={point.id}
                  onClick={() => setActiveTab(index)}
                  className={`relative flex items-start gap-3 px-4 py-3 sm:py-4 rounded-xl text-left transition-all duration-300 flex-1 sm:flex-initial ${
                    activeTab === index
                      ? "bg-white/[0.06] border border-accent/30"
                      : "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]"
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-colors flex-shrink-0 ${
                      activeTab === index
                        ? "bg-accent text-black"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {point.num}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold transition-colors ${activeTab === index ? "text-white" : "text-white/70"}`}>
                      {point.title}
                    </p>
                    <p className="text-[11px] text-white/40 font-mono flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                      {point.tagline}
                    </p>
                  </div>
                  {activeTab === index && (
                    <motion.div
                      layoutId="activeThesisTab"
                      className="absolute inset-0 border-2 border-accent/50 rounded-xl pointer-events-none"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content Display */}
            <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 min-h-[320px] overflow-hidden">
              <AnimatePresence mode="wait">
                {/* Vibecoding illustration */}
                {activeTab === 0 && (
                  <motion.div
                    key="vibecoding"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full flex flex-col"
                  >
                    {/* Animated agent chain */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex items-center gap-4 sm:gap-6">
                        {/* Claude/Agent */}
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="flex flex-col items-center"
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-accent-bright/20 border border-accent-bright/30 flex items-center justify-center">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-accent-bright" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-[11px] font-mono text-white/50 mt-2">Claude</span>
                        </motion.div>

                        {/* Animated connection line */}
                        <div className="flex items-center gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full bg-accent"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 1, 0.3],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>

                        {/* Code output */}
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="w-32 sm:w-40 bg-background/80 border border-white/10 rounded-lg p-3 font-mono text-[10px] sm:text-xs"
                        >
                          <div className="flex items-center gap-1 mb-2">
                            <div className="w-2 h-2 rounded-full bg-red-500/60" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                            <div className="w-2 h-2 rounded-full bg-green-500/60" />
                          </div>
                          <div className="text-accent/80">const</div>
                          <div className="text-white/60">app = <span className="text-accent-bright">ship</span>()</div>
                        </motion.div>

                        {/* Animated connection line */}
                        <div className="flex items-center gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full bg-accent"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 1, 0.3],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                delay: i * 0.2 + 0.5,
                              }}
                            />
                          ))}
                        </div>

                        {/* Ship/Deploy */}
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex flex-col items-center"
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          </div>
                          <span className="text-[11px] font-mono text-white/50 mt-2">Shipped</span>
                        </motion.div>
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-white/60 text-sm font-sans">{thesisPoints[0].description}</p>
                    </div>
                  </motion.div>
                )}

                {/* Non-tech founder illustration */}
                {activeTab === 1 && (
                  <motion.div
                    key="cofounder"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full flex flex-col"
                  >
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex items-center gap-6 sm:gap-10">
                        {/* Founder */}
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="flex flex-col items-center"
                        >
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-light/20 border-2 border-accent-light/30 flex items-center justify-center">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-accent-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          </div>
                          <span className="text-xs font-mono text-white/50 mt-3">Founder</span>
                          <span className="text-[10px] text-white/30">Vision & Direction</span>
                        </motion.div>

                        {/* Plus sign */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          className="w-10 h-10 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </motion.div>

                        {/* Agent */}
                        <motion.div
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="flex flex-col items-center"
                        >
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-bright/20 border-2 border-accent-bright/30 flex items-center justify-center">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-accent-bright" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-xs font-mono text-white/50 mt-3">Agent</span>
                          <span className="text-[10px] text-white/30">Code & Execution</span>
                        </motion.div>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-6 text-center"
                    >
                      <p className="text-white/60 text-sm font-sans">{thesisPoints[1].description}</p>
                    </motion.div>
                  </motion.div>
                )}

                {/* Funding illustration */}
                {activeTab === 2 && (
                  <motion.div
                    key="funding"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full flex flex-col"
                  >
                    <div className="flex-1 flex items-center justify-center">
                      {/* Mini raise card UI */}
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-full max-w-sm bg-background/80 border border-white/10 rounded-xl p-5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 6v6l4 2" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-sm font-bold text-white">$VIBE Raise</span>
                              <p className="text-[10px] text-white/40 font-mono">Time-released</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 rounded text-[10px] font-mono text-accent">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="11" width="18" height="11" rx="2" />
                              <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                            Escrow
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-3">
                          <div className="h-3 bg-white/[0.05] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-accent to-accent-bright rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ width: "75%" }}
                              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs mb-4">
                          <span className="text-white/50 font-mono">47 backers</span>
                          <span className="text-accent font-bold">75% funded</span>
                        </div>

                        {/* Backer avatars */}
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <motion.div
                                key={i}
                                initial={{ scale: 0, x: -10 }}
                                animate={{ scale: 1, x: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                className="w-7 h-7 rounded-full bg-white/10 border-2 border-background flex items-center justify-center"
                              >
                                <svg className="w-3 h-3 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                              </motion.div>
                            ))}
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 1 }}
                              className="w-7 h-7 rounded-full bg-accent/20 border-2 border-background flex items-center justify-center text-[9px] font-mono text-accent"
                            >
                              +42
                            </motion.div>
                          </div>
                          <motion.div
                            animate={{ scale: [1, 0.95, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="px-3 py-1.5 bg-accent text-black text-xs font-bold rounded-lg"
                          >
                            Back Now
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-6 text-center"
                    >
                      <p className="text-white/60 text-sm font-sans">{thesisPoints[2].description}</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Subtle background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/[0.05] rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Expandable deep read */}
        <details className="mt-8 sm:mt-12 group max-w-3xl mx-auto">
          <summary className="flex items-center justify-center gap-2 cursor-pointer text-muted hover:text-white transition-colors">
            <span className="text-[13px] font-mono">Read the full thesis</span>
            <svg className="w-4 h-4 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <div className="mt-6 text-muted text-[14px] leading-relaxed space-y-4 px-4 font-sans">
            <p>
              The release of Claude Opus 4.5 marked an inflection point. For the first time, agents could reliably ship production-quality software from natural language prompts. This unlocked a new class of builder: the non-technical founder who directs AI to execute their vision.
            </p>
            <p>
              But funding infrastructure hasn&apos;t caught up. Traditional investors want teams, traction, and technical co-founders. Vibestarter bridges this gap with time-released crowdfunding, letting ideas raise at the concept stage with verifiable provenance.
            </p>
            <p>
              Every launch records who built it, which agent powered it, and proof of the build process. This creates accountability and discoverability in a market flooded with agent-generated projects.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}
