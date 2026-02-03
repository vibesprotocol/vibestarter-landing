"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

// Aerodrome brand color
const AERO_BLUE = "#0052FF";

// Aerodrome symbol logo - using official PNG
// Source: https://aerodrome.finance/brand-kit/AERO/symbol.png
function AerodromeSymbol({ className }: { className?: string }) {
  return (
    <img
      src="/aero-symbol.png"
      alt="Aerodrome"
      className={className}
    />
  );
}

// Aerodrome logo with text (for Trade section)
function AerodromeLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className || ''}`}>
      <AerodromeSymbol className="w-4 h-5" />
      <span className="text-[10px] font-mono text-white/50">Aerodrome</span>
    </div>
  );
}

// ETH icon component
function EthIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L6 16L16 22L26 16L16 2Z" fill="currentColor" fillOpacity="0.6" />
      <path d="M16 22L6 16L16 30L26 16L16 22Z" fill="currentColor" />
    </svg>
  );
}

// Vibetoken icon (V in circle)
function VibetokenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
      <path d="M10 10L16 22L22 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Simulation stages
const stages = [
  { id: 0, label: "Contribute", sublabel: "Back with ETH" },
  { id: 1, label: "Mint", sublabel: "Get Vibetoken" },
  { id: 2, label: "Pool", sublabel: "LP Created" },
  { id: 3, label: "Trade", sublabel: "Freely Tradeable" },
];

export function TokenIndependence() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [isInView, setIsInView] = useState(false);

  // Auto-cycle through stages
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 4000); // 4 seconds per stage

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
    <section ref={sectionRef} id="vibetokens" className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="section-label">04 / Vibetokens</span>
          </div>

          <h2 className="section-heading mb-4">
            Freely Tradeable from Day 1
          </h2>

          <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto font-sans">
            Every Vibetoken is a standard ERC-20 paired with ETH on Aerodrome.
            Back projects directly. Trade instantly. No platform token required.
          </p>
        </div>

        {/* Live Simulation */}
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[200px_1fr] gap-6 lg:gap-8">
            {/* Stage Selector (Tabs) */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {stages.map((stage, index) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(index)}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    activeStage === index
                      ? "bg-white/[0.06] border border-accent-bright/30"
                      : "bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono font-bold transition-colors ${
                      activeStage === index
                        ? "bg-accent-bright text-black"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold transition-colors ${activeStage === index ? "text-white" : "text-white/70"}`}>
                      {stage.label}
                    </p>
                    <p className="text-[11px] text-white/40 font-mono">{stage.sublabel}</p>
                  </div>
                  {activeStage === index && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 border-2 border-accent-bright/50 rounded-xl pointer-events-none"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Simulation Display */}
            <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 min-h-[320px] overflow-hidden">

              <AnimatePresence mode="wait">
                {/* Stage 0: Contribute ETH */}
                {activeStage === 0 && (
                  <motion.div
                    key="stage0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full flex flex-col items-center justify-center"
                  >
                    {/* Wallet UI mockup */}
                    <div className="bg-background/80 border border-white/10 rounded-xl p-5 w-full max-w-xs">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono text-white/50">Your Wallet</span>
                        <span className="text-[10px] font-mono text-accent bg-accent/10 px-2 py-0.5 rounded">Connected</span>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <EthIcon className="w-10 h-10 text-accent" />
                        <div>
                          <p className="text-2xl font-bold text-white">2.5 ETH</p>
                          <p className="text-xs text-white/40 font-mono">≈ $7,500</p>
                        </div>
                      </div>
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 0.98, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-full py-3 bg-accent text-black font-bold text-center rounded-lg text-sm"
                      >
                        Back Project →
                      </motion.div>
                    </div>
                    <p className="mt-4 text-xs text-white/40 font-mono">Direct ETH contribution • No intermediaries</p>
                  </motion.div>
                )}

                {/* Stage 1: Mint Vibetoken */}
                {activeStage === 1 && (
                  <motion.div
                    key="stage1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full flex flex-col items-center justify-center"
                  >
                    {/* Token minting animation */}
                    <div className="relative w-28 h-28">
                      {/* Pulse rings - using CSS animation for stability */}
                      <div
                        className="absolute inset-0 rounded-full border-2 border-accent-bright/30 pointer-events-none animate-[pulse-ring_1.5s_ease-out_infinite]"
                        style={{
                          animation: 'pulse-ring 1.5s ease-out infinite',
                        }}
                      />
                      <div
                        className="absolute inset-0 rounded-full border-2 border-accent-bright/20 pointer-events-none"
                        style={{
                          animation: 'pulse-ring-delayed 1.5s ease-out infinite',
                          animationDelay: '0.5s',
                        }}
                      />
                      {/* Main token circle */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: "backOut" }}
                        className="absolute inset-0 rounded-full bg-accent-bright/20 border-2 border-accent-bright/50 flex items-center justify-center"
                      >
                        <VibetokenIcon className="w-14 h-14 text-accent-bright" />
                      </motion.div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-6 text-center"
                    >
                      <p className="text-lg font-bold text-white">$VIBE Minted</p>
                      <p className="text-sm text-accent-bright font-mono">Standard ERC-20 Token</p>
                    </motion.div>
                    <p className="mt-4 text-xs text-white/40 font-mono">Your tokens arrive instantly in your wallet</p>
                  </motion.div>
                )}

                {/* Stage 2: LP Created on Aerodrome */}
                {activeStage === 2 && (
                  <motion.div
                    key="stage2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full flex flex-col items-center justify-center"
                  >
                    {/* LP Pool visualization */}
                    <div className="flex items-center gap-4">
                      <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-16 h-16 rounded-full bg-accent-bright/20 border border-accent-bright/30 flex items-center justify-center"
                      >
                        <VibetokenIcon className="w-8 h-8 text-accent-bright" />
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                        className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
                      >
                        <span className="text-lg font-bold text-white">+</span>
                      </motion.div>
                      <motion.div
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-16 h-16 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center"
                      >
                        <EthIcon className="w-8 h-8 text-accent" />
                      </motion.div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-6 flex items-center gap-3 px-4 py-3 bg-background/80 border border-white/10 rounded-xl"
                    >
                      <AerodromeSymbol className="w-8 h-8 text-[#0052FF]" />
                      <div>
                        <p className="text-sm font-bold text-white">Aerodrome LP</p>
                        <p className="text-[11px] text-white/50 font-mono">$VIBE / ETH</p>
                      </div>
                      <div className="ml-4 px-2 py-1 bg-accent/10 rounded text-[10px] font-mono text-accent">
                        LOCKED ∞
                      </div>
                    </motion.div>
                    <p className="mt-4 text-xs text-white/40 font-mono">Liquidity paired with ETH • LP locked forever</p>
                  </motion.div>
                )}

                {/* Stage 3: Trade Anywhere */}
                {activeStage === 3 && (
                  <motion.div
                    key="stage3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full flex flex-col items-center justify-center"
                  >
                    {/* Trading interface mockup */}
                    <div className="bg-background/80 border border-white/10 rounded-xl p-4 w-full max-w-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-white/50">Trade</span>
                        <AerodromeLogo />
                      </div>
                      {/* From */}
                      <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3 mb-2">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value="10,000"
                            readOnly
                            className="bg-transparent text-xl font-bold text-white w-28 outline-none"
                          />
                          <div className="flex items-center gap-2 px-2 py-1 bg-accent-bright/10 rounded-lg">
                            <VibetokenIcon className="w-5 h-5 text-accent-bright" />
                            <span className="text-sm font-mono text-accent-bright">$VIBE</span>
                          </div>
                        </div>
                      </div>
                      {/* Swap arrow */}
                      <div className="flex justify-center -my-1 relative z-10">
                        <motion.div
                          animate={{ y: [0, 2, 0] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12l7 7 7-7" />
                          </svg>
                        </motion.div>
                      </div>
                      {/* To */}
                      <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3 mt-2">
                        <div className="flex items-center justify-between">
                          <motion.span
                            key={activeStage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xl font-bold text-white"
                          >
                            0.42
                          </motion.span>
                          <div className="flex items-center gap-2 px-2 py-1 bg-accent/10 rounded-lg">
                            <EthIcon className="w-5 h-5 text-accent" />
                            <span className="text-sm font-mono text-accent">ETH</span>
                          </div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 0.98, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="mt-3 w-full py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-center rounded-full text-sm"
                      >
                        Swap
                      </motion.div>
                    </div>
                    <p className="mt-4 text-xs text-white/40 font-mono">Trade on any DEX • No platform lock-in</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Subtle background glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-bright/[0.05] rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>

          {/* Key stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6"
          >
            <div className="text-center p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="h-8 sm:h-10 flex items-center justify-center mb-1">
                <span className="text-lg sm:text-xl font-sans font-bold text-accent">ERC-20</span>
              </div>
              <div className="text-[10px] sm:text-xs font-mono text-white/50">Standard Token</div>
            </div>
            <div className="text-center p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="h-8 sm:h-10 flex items-center justify-center mb-1">
                <span className="text-lg sm:text-xl font-sans font-bold text-accent-bright">ETH</span>
              </div>
              <div className="text-[10px] sm:text-xs font-mono text-white/50">Direct Backing</div>
            </div>
            <div className="text-center p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="h-8 sm:h-10 flex items-center justify-center gap-1.5 mb-1">
                <AerodromeSymbol className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-lg sm:text-xl font-sans font-bold text-white/50">LP</span>
              </div>
              <div className="text-[10px] sm:text-xs font-mono text-white/50">Aerodrome LP</div>
            </div>
            <div className="text-center p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="h-8 sm:h-10 flex items-center justify-center mb-1">
                <span className="text-3xl sm:text-4xl font-sans font-bold text-accent leading-none">∞</span>
              </div>
              <div className="text-[10px] sm:text-xs font-mono text-white/50">LP Locked Forever</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
