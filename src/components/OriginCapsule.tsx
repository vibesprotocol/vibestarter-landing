"use client";

import { useState, useEffect, useRef } from "react";
import { Box } from "lucide-react";

interface CapsuleData {
  projectName: string;
  founderHandle: string;
  founderAddress: string;
  agentName: string;
  agentId: string;
  modelVersion: string;
  registryAddress: string;
  chainId: string;
  transcriptHash: string;
  capsuleHash: string;
  timestamp: string;
  proofType: string;
}

const sampleCapsules: CapsuleData[] = [
  {
    projectName: "TaskFlow AI",
    founderHandle: "@sarahbuilds",
    founderAddress: "0x7f3a...e4b2",
    agentName: "Claude Code",
    agentId: "1",
    modelVersion: "Claude Sonnet 4",
    registryAddress: "0x9efE...DbcD",
    chainId: "8453",
    transcriptHash: "0x8a4f2e...c91d",
    capsuleHash: "0x3b7c9f...a2e8",
    timestamp: "2025-01-28T14:32:00Z",
    proofType: "Transcript",
  },
  {
    projectName: "DeFi Dashboard",
    founderHandle: "@cryptodev",
    founderAddress: "0x2d8e...f1a3",
    agentName: "Cursor",
    agentId: "2",
    modelVersion: "GPT-4o",
    registryAddress: "0x9efE...DbcD",
    chainId: "8453",
    transcriptHash: "0x1c9d7b...e4f2",
    capsuleHash: "0x9e2a1f...b7c4",
    timestamp: "2025-01-29T09:15:00Z",
    proofType: "Git Commit",
  },
  {
    projectName: "NFT Minter",
    founderHandle: "@artmaker",
    founderAddress: "0x5c1d...8e9f",
    agentName: "Windsurf",
    agentId: "3",
    modelVersion: "Claude Opus 4",
    registryAddress: "0x9efE...DbcD",
    chainId: "8453",
    transcriptHash: "0x4e8f3a...d2c1",
    capsuleHash: "0x6d4b2e...f8a9",
    timestamp: "2025-01-30T16:48:00Z",
    proofType: "PRD Hash",
  },
];

interface InfoNodeProps {
  label: string;
  value: string;
  position: "left" | "right";
  top: string;
  delay: number;
  highlight?: boolean;
  isVisible?: boolean;
}

function InfoNode({ label, value, position, top, delay, highlight, isVisible = true }: InfoNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = isHovered || highlight;

  return (
    <div
      className={`absolute ${position === "left" ? "right-[calc(50%+140px)] sm:right-[calc(50%+160px)] md:right-[calc(50%+200px)]" : "left-[calc(50%+140px)] sm:left-[calc(50%+160px)] md:left-[calc(50%+200px)]"} flex items-center gap-2 md:gap-3 ${position === "left" ? "flex-row-reverse" : "flex-row"}`}
      style={{
        top,
        animation: `fadeSlideIn 0.6s ease-out ${delay}s both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connection line */}
      <div
        className={`h-px w-6 sm:w-10 md:w-14 transition-all duration-300 ${isActive ? "bg-accent" : "bg-white/10"}`}
      />
      {/* Connection dot */}
      <div
        className={`h-1.5 w-1.5 md:h-2 md:w-2 rounded-full transition-all duration-300 ${isActive ? "bg-accent scale-150" : "bg-white/30"}`}
      />
      {/* Info card */}
      <div
        className={`rounded-lg border bg-surface/80 backdrop-blur-sm px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 transition-all duration-300 ${isActive ? "border-accent/50 shadow-lg shadow-accent/10" : "border-white/10"}`}
      >
        <p className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider text-white/40 mb-0.5">
          {label}
        </p>
        <p
          className={`text-[10px] sm:text-xs md:text-sm font-mono transition-all duration-[600ms] ease-in-out ${isActive ? "text-accent" : "text-white/80"} ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function CapsuleInfographic() {
  const [activeRing, setActiveRing] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const capsule = sampleCapsules[currentIndex];

  // Handle manual pagination clicks - pause auto-cycle longer
  const handlePaginationClick = (index: number) => {
    // Trigger fade out, change, fade in for manual clicks
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsVisible(true);
    }, 600);

    setUserInteracted(true);

    // Clear any existing timeout
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }

    // Resume auto-cycle after extended pause (12 seconds)
    interactionTimeoutRef.current = setTimeout(() => {
      setUserInteracted(false);
    }, 12000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  // Cycle through capsules with slow crossfade (when user hasn't interacted)
  useEffect(() => {
    if (userInteracted) return;

    const interval = setInterval(() => {
      // Start fade out
      setIsVisible(false);

      // After fade out completes, change data and fade back in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sampleCapsules.length);
        setIsVisible(true);
      }, 600); // Match the CSS transition duration
    }, 6000);

    return () => clearInterval(interval);
  }, [userInteracted]);

  return (
    <div className="relative w-full">
      <div className="relative flex flex-col items-center py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-accent mb-2 font-mono">
            ERC-8004 Origin Capsule
          </p>
          <h3
            className={`text-2xl md:text-3xl font-semibold tracking-tight text-white transition-opacity duration-[600ms] ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}
          >
            {capsule.projectName}
          </h3>
          <p
            className={`text-sm text-white/50 mt-2 font-mono transition-opacity duration-[600ms] ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}
          >
            {capsule.founderHandle}
          </p>
        </div>

        {/* Orbital visualization */}
        <div className="relative w-full h-[420px] sm:h-[480px] md:h-[520px]">
          {/* Center core */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {/* Outer ring */}
            <div
              className={`absolute -inset-16 sm:-inset-20 md:-inset-24 rounded-full border transition-all duration-500 ${activeRing === 2 ? "border-accent/60" : "border-white/5"}`}
              style={{ animation: "pulse 4s ease-in-out infinite" }}
              onMouseEnter={() => setActiveRing(2)}
              onMouseLeave={() => setActiveRing(null)}
            />
            {/* Middle ring */}
            <div
              className={`absolute -inset-10 sm:-inset-12 md:-inset-14 rounded-full border transition-all duration-500 ${activeRing === 1 ? "border-accent/80" : "border-white/10"}`}
              style={{ animation: "pulse 3s ease-in-out infinite 0.5s" }}
              onMouseEnter={() => setActiveRing(1)}
              onMouseLeave={() => setActiveRing(null)}
            />
            {/* Core capsule */}
            <div
              className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full border-2 border-accent/60 bg-surface/80 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-500 hover:border-accent shadow-[0_0_30px_rgba(145,217,130,0.3)] hover:shadow-[0_0_50px_rgba(145,217,130,0.5)]"
              onMouseEnter={() => setActiveRing(0)}
              onMouseLeave={() => setActiveRing(null)}
            >
              <div className="text-center p-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mx-auto mb-2 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center">
                  <Box className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-accent" />
                </div>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-white/50 uppercase tracking-wider">
                  Sealed
                </p>
                <p className="text-xs sm:text-sm md:text-base font-mono text-white mt-0.5">
                  On-Chain
                </p>
              </div>
            </div>
          </div>

          {/* Left side info nodes */}
          <InfoNode
            label="Agent"
            value={capsule.agentName}
            position="left"
            top="12%"
            delay={0.1}
            highlight={activeRing === 0}
            isVisible={isVisible}
          />
          <InfoNode
            label="ERC-8004 ID"
            value={`#${capsule.agentId}`}
            position="left"
            top="32%"
            delay={0.2}
            highlight={activeRing === 1}
            isVisible={isVisible}
          />
          <InfoNode
            label="Model"
            value={capsule.modelVersion}
            position="left"
            top="52%"
            delay={0.3}
            isVisible={isVisible}
          />
          <InfoNode
            label="Proof Hash"
            value={capsule.transcriptHash}
            position="left"
            top="72%"
            delay={0.4}
            isVisible={isVisible}
          />

          {/* Right side info nodes */}
          <InfoNode
            label="Founder"
            value={capsule.founderAddress}
            position="right"
            top="12%"
            delay={0.15}
            isVisible={isVisible}
          />
          <InfoNode
            label="Registry"
            value={capsule.registryAddress}
            position="right"
            top="32%"
            delay={0.25}
            highlight={activeRing === 1}
            isVisible={isVisible}
          />
          <InfoNode
            label="Chain"
            value={`Base (${capsule.chainId})`}
            position="right"
            top="52%"
            delay={0.35}
            isVisible={isVisible}
          />
          <InfoNode
            label="Capsule Hash"
            value={capsule.capsuleHash}
            position="right"
            top="72%"
            delay={0.45}
            highlight={activeRing === 2}
            isVisible={isVisible}
          />
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-xs text-white/40 mt-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Immutable Record</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-white/10" />
          <span className={`font-mono transition-opacity duration-[600ms] ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
            {new Date(capsule.timestamp).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <div className="hidden sm:block h-4 w-px bg-white/10" />
          <span className={`transition-opacity duration-[600ms] ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}>Proof: {capsule.proofType}</span>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-6">
          {sampleCapsules.map((_, index) => (
            <button
              key={index}
              onClick={() => handlePaginationClick(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-accent w-6"
                  : "bg-white/20 w-1.5 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}

export function OriginCapsuleSection() {
  return (
    <section id="capsule" className="py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="section-label">Provenance</span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-medium">
              <Box className="w-3.5 h-3.5" />
              On-Chain
            </div>
          </div>

          <h2 className="section-heading mb-4">
            Origin Capsule
          </h2>

          <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto font-sans">
            Cryptographic proof of human-AI collaboration. Each capsule records the founder,
            the ERC-8004 registered agent, and the build artifact — sealed immutably on Base.
          </p>
        </div>

        {/* Infographic */}
        <CapsuleInfographic />

        {/* Bottom features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 md:mt-16 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-3xl md:text-4xl font-sans font-bold text-accent mb-2">34+</div>
            <div className="text-sm text-white/60 font-sans">Registered AI Agents</div>
            <div className="text-xs text-white/40 mt-1 font-mono">ERC-8004 Standard</div>
          </div>
          <div className="text-center p-6 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-3xl md:text-4xl font-sans font-bold text-white mb-2">Base</div>
            <div className="text-sm text-white/60 font-sans">Identity Registry</div>
            <div className="text-xs text-white/40 mt-1 font-mono">Chain ID: 8453</div>
          </div>
          <div className="text-center p-6 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-3xl md:text-4xl font-sans font-bold text-white mb-2">Immutable</div>
            <div className="text-sm text-white/60 font-sans">Once Sealed</div>
            <div className="text-xs text-white/40 mt-1 font-mono">Forever Verifiable</div>
          </div>
        </div>
      </div>
    </section>
  );
}
