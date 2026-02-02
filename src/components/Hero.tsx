"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type Scenario = "founder" | "backer" | "agent";

interface ScenarioConfig {
  label: string;
  command1: string;
  command2: string;
  response1: React.ReactNode;
  response2: React.ReactNode;
}

const scenarios: Record<Scenario, ScenarioConfig> = {
  founder: {
    label: "Founder",
    command1: "attest --founder @yourhandle",
    command2: "launch --raise 10 ETH",
    response1: (
      <div className="pl-0 space-y-2 text-white/70">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-accent">Attestation generated</span>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5 space-y-2">
          <p className="text-white/60 text-[12px]">
            <span className="text-accent-bright">// Agent attestation</span>
          </p>
          <p className="text-white/90">
            &quot;I built this MVP with <span className="text-white">@yourhandle</span>.
          </p>
          <p className="text-white/90">
            They provided the vision, I wrote the code.
          </p>
          <p className="text-white/90">
            Now we need <span className="text-accent">funding to ship</span>.&quot;
          </p>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <span className="text-[11px] text-white/40">— Claude Opus 4.5</span>
            <span className="text-[10px] text-white/30 font-mono">0x7f3a...e4b2</span>
          </div>
        </div>
      </div>
    ),
    response2: (
      <div className="space-y-1">
        <div className="text-white/50 text-[12px]">→ Creating Vibetoken...</div>
        <div className="text-white/50 text-[12px]">→ Setting up tranches...</div>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="text-accent">✓</span>
          <span className="text-accent">Live on Base</span>
          <span className="text-white/30">|</span>
          <span className="text-white/40">Ready for backers</span>
        </div>
      </div>
    ),
  },
  backer: {
    label: "Backer",
    command1: "discover --trending",
    command2: "back @vibeapp 2 ETH",
    response1: (
      <div className="pl-0 space-y-2 text-white/70">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-accent">3 trending launches</span>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5 space-y-2 text-[12px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-accent-bright">1.</span>
              <span className="text-white">@vibeapp</span>
              <span className="text-white/40">AI task manager</span>
            </div>
            <span className="text-accent">4.2 ETH raised</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-accent-bright">2.</span>
              <span className="text-white">@defibot</span>
              <span className="text-white/40">Portfolio tracker</span>
            </div>
            <span className="text-white/50">2.8 ETH raised</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-accent-bright">3.</span>
              <span className="text-white">@nftgen</span>
              <span className="text-white/40">Generative art</span>
            </div>
            <span className="text-white/50">1.5 ETH raised</span>
          </div>
        </div>
      </div>
    ),
    response2: (
      <div className="space-y-1">
        <div className="text-white/50 text-[12px]">→ Verifying attestation...</div>
        <div className="text-white/50 text-[12px]">→ Locking in escrow...</div>
        <div className="flex items-center gap-2 text-[12px]">
          <span className="text-accent">✓</span>
          <span className="text-accent">Backed @vibeapp</span>
          <span className="text-white/30">|</span>
          <span className="text-white/40">2 ETH in escrow</span>
        </div>
      </div>
    ),
  },
  agent: {
    label: "Agent",
    command1: "verify --attestation 0x7f3a...e4b2",
    command2: "history --builder @yourhandle",
    response1: (
      <div className="pl-0 space-y-2 text-white/70">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400">Attestation valid</span>
        </div>
        <div className="bg-white/[0.03] rounded-lg p-3 border border-white/5 space-y-2 text-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-white/50">Signer</span>
            <span className="text-white font-mono">Claude Opus 4.5</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">Founder</span>
            <span className="text-white">@yourhandle</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">Created</span>
            <span className="text-white/70">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">On-chain</span>
            <span className="text-accent font-mono">Base Mainnet</span>
          </div>
        </div>
      </div>
    ),
    response2: (
      <div className="space-y-1">
        <div className="text-white/50 text-[12px]">→ Fetching build history...</div>
        <div className="bg-white/[0.03] rounded-lg p-2 border border-white/5 space-y-1 text-[11px] mt-2">
          <div className="flex items-center gap-2">
            <span className="text-accent">●</span>
            <span className="text-white/70">3 projects built together</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent">●</span>
            <span className="text-white/70">12.4 ETH total raised</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent">●</span>
            <span className="text-white/70">100% tranches released</span>
          </div>
        </div>
      </div>
    ),
  },
};

function HeroVisual() {
  const [activeScenario, setActiveScenario] = useState<Scenario>("founder");
  const [stage, setStage] = useState(0);
  const [typedCommand1, setTypedCommand1] = useState("");
  const [typedCommand2, setTypedCommand2] = useState("");
  const [animationKey, setAnimationKey] = useState(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const config = scenarios[activeScenario];

  const resetAnimation = useCallback(() => {
    setStage(0);
    setTypedCommand1("");
    setTypedCommand2("");
    setAnimationKey((k) => k + 1);
  }, []);

  const handleTabChange = useCallback((scenario: Scenario) => {
    if (scenario === activeScenario) return;
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    setActiveScenario(scenario);
    resetAnimation();
  }, [activeScenario, resetAnimation]);

  useEffect(() => {
    const command1 = config.command1;
    const command2 = config.command2;

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Create GSAP timeline for typing animation
    const tl = gsap.timeline();
    timelineRef.current = tl;

    // Type first command character by character
    const typeCommand1 = { index: 0 };
    tl.to(typeCommand1, {
      index: command1.length,
      duration: command1.length * 0.04,
      ease: "none",
      onUpdate: () => {
        setTypedCommand1(command1.slice(0, Math.floor(typeCommand1.index)));
      },
      delay: 0.5,
    });

    // Show first response
    tl.call(() => setStage(1), [], "+=0.3");

    // Start typing second command
    tl.call(() => setStage(2), [], "+=1.2");

    const typeCommand2 = { index: 0 };
    tl.to(typeCommand2, {
      index: command2.length,
      duration: command2.length * 0.04,
      ease: "none",
      onUpdate: () => {
        setTypedCommand2(command2.slice(0, Math.floor(typeCommand2.index)));
      },
    });

    // Show second response
    tl.call(() => setStage(3), [], "+=0.3");

    // Show final cursor
    tl.call(() => setStage(4), [], "+=1.5");

    return () => {
      tl.kill();
    };
  }, [animationKey, config.command1, config.command2]);

  return (
    <div className="relative w-full max-w-[320px] sm:max-w-md lg:max-w-lg xl:max-w-xl">
      {/* Terminal window */}
      <div className="relative bg-[#0a0a0a] border border-white/[0.08] rounded-xl overflow-hidden">
        {/* Terminal header with tabs */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white/[0.02] border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
          </div>

          {/* Scenario tabs */}
          <div className="flex-1 flex justify-center gap-1">
            {(Object.keys(scenarios) as Scenario[]).map((scenario) => (
              <button
                key={scenario}
                onClick={() => handleTabChange(scenario)}
                className={`px-3 py-1 text-[10px] sm:text-[11px] font-mono rounded-md transition-all duration-200 ${
                  activeScenario === scenario
                    ? "bg-accent/20 text-accent border border-accent/30"
                    : "text-white/40 hover:text-white/60 hover:bg-white/5"
                }`}
              >
                {scenarios[scenario].label}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal content - fixed height to prevent layout shift */}
        <div className="p-3 sm:p-4 font-mono text-[11px] sm:text-[13px] leading-relaxed space-y-2 sm:space-y-3 h-[340px] sm:h-[400px] overflow-hidden">
          {/* First prompt line */}
          <div className="flex items-start gap-2">
            <span className="text-accent-bright shrink-0">claude $</span>
            <span className="text-white/80">
              {typedCommand1}
              {stage === 0 && typedCommand1.length < config.command1.length && (
                <span className="inline-block w-2 h-4 bg-white/60 animate-pulse ml-0.5 align-middle" />
              )}
            </span>
          </div>

          {/* First agent response with Framer Motion */}
          <AnimatePresence mode="wait">
            {stage >= 1 && (
              <motion.div
                key={`response1-${animationKey}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {config.response1}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Second prompt with Framer Motion */}
          <AnimatePresence mode="wait">
            {stage >= 2 && (
              <motion.div
                key={`prompt2-${animationKey}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-start gap-2"
              >
                <span className="text-accent-bright shrink-0">claude $</span>
                <span className="text-white/80">
                  {typedCommand2}
                  {stage === 2 && typedCommand2.length < config.command2.length && (
                    <span className="inline-block w-2 h-4 bg-white/60 animate-pulse ml-0.5 align-middle" />
                  )}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Second response with Framer Motion */}
          <AnimatePresence mode="wait">
            {stage >= 3 && (
              <motion.div
                key={`response2-${animationKey}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {config.response2}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Final blinking cursor with Framer Motion */}
          <AnimatePresence mode="wait">
            {stage >= 4 && (
              <motion.div
                key={`final-${animationKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                <span className="text-accent-bright">claude $</span>
                <span className="w-2 h-4 bg-white/60 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Subtle decorative element */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent-bright/[0.03] rounded-full blur-3xl" />
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax fade effect as user scrolls past hero
      gsap.to(contentRef.current, {
        y: -80,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-[85vh] pt-20 flex flex-col relative">
      <div ref={contentRef} className="flex-1 flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column - Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Headline */}
              <h1 className="text-[clamp(36px,6vw,64px)] font-semibold leading-[1.1] tracking-tight mb-6">
                Fund your
                <br />
                <span className="text-accent-gradient">vibecoded app.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-muted text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
                Launch a Vibetoken. Raise from the community. Ship with escrow-backed, time-released funding and on-chain provenance.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                <Link
                  href="https://app.vibestarter.xyz"
                  className="btn-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-medium text-[15px] text-center"
                >
                  Launch Your Raise
                </Link>
                <Link
                  href="https://app.vibestarter.xyz"
                  className="btn-secondary px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-medium text-[15px] text-center"
                >
                  Explore launches
                </Link>
              </div>

              {/* Micro-copy */}
              <p className="text-muted/60 text-[13px]">
                Idea to funding in minutes. Escrow-backed, time-released over 6 months.
              </p>
            </motion.div>

            {/* Right column - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="flex justify-center lg:justify-end mt-8 lg:mt-0"
            >
              <HeroVisual />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="pb-8 sm:pb-12 text-center"
      >
        <div className="animate-bounce-slow inline-flex flex-col items-center gap-2 text-muted text-[12px]">
          <span>Scroll to explore</span>
          <ArrowDown size={16} />
        </div>
      </motion.div>
    </section>
  );
}
