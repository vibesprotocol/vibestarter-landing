"use client";

import { useState, useEffect } from "react";
import { Box, Check, ExternalLink } from "lucide-react";

// Simulated capsule data that cycles through
const sampleCapsules = [
  {
    projectName: "TaskFlow AI",
    founder: "@sarahbuilds",
    founderAddress: "0x7f3a...e4b2",
    agentName: "Claude Code",
    agentId: "1",
    modelVersion: "Claude Sonnet 4",
    transcriptHash: "0x8a4f2e...c91d",
    capsuleHash: "0x3b7c9f...a2e8",
    timestamp: "2025-01-28T14:32:00Z",
  },
  {
    projectName: "DeFi Dashboard",
    founder: "@cryptodev",
    founderAddress: "0x2d8e...f1a3",
    agentName: "Cursor",
    agentId: "2",
    modelVersion: "GPT-4o",
    transcriptHash: "0x1c9d7b...e4f2",
    capsuleHash: "0x9e2a1f...b7c4",
    timestamp: "2025-01-29T09:15:00Z",
  },
  {
    projectName: "NFT Generator",
    founder: "@artmaker",
    founderAddress: "0x5c1d...8e9f",
    agentName: "Windsurf",
    agentId: "3",
    modelVersion: "Claude Opus 4",
    transcriptHash: "0x4e8f3a...d2c1",
    capsuleHash: "0x6d4b2e...f8a9",
    timestamp: "2025-01-30T16:48:00Z",
  },
];

function CapsuleVisual() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const capsule = sampleCapsules[currentIndex];

  // Cycle through capsules
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sampleCapsules.length);
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Capsule container with glow effect */}
      <div className="relative">
        {/* Animated glow ring */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-accent/50 via-accent-bright/50 to-accent/50 rounded-2xl blur-sm opacity-60 animate-pulse" />

        {/* Main capsule card */}
        <div
          className={`relative bg-[#0a0a0a] border border-accent/30 rounded-2xl overflow-hidden transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-accent/10 to-transparent border-b border-accent/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                <Box className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-xs text-accent font-mono uppercase tracking-wider">Origin Capsule</div>
                <div className="text-white font-medium">{capsule.projectName}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent/20 rounded-full border border-accent/30">
              <Check className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] text-accent font-medium">Sealed</span>
            </div>
          </div>

          {/* Capsule content */}
          <div className="p-5 space-y-4">
            {/* Founder row */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50 uppercase tracking-wider">Founder</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{capsule.founder}</span>
                <span className="text-white/40 font-mono text-xs">{capsule.founderAddress}</span>
              </div>
            </div>

            {/* ERC-8004 Agent - PROMINENT */}
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-accent font-mono uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  ERC-8004 Agent Identity
                </span>
                <a
                  href="https://eips.ethereum.org/EIPS/eip-8004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-accent/60 hover:text-accent flex items-center gap-1 transition-colors"
                >
                  Spec <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] text-white/40 mb-1">Agent</div>
                  <div className="text-white font-medium">{capsule.agentName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 mb-1">Registry ID</div>
                  <div className="text-accent font-mono text-sm">#{capsule.agentId}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[10px] text-white/40 mb-1">Model</div>
                  <div className="text-white/80 text-sm">{capsule.modelVersion}</div>
                </div>
              </div>
            </div>

            {/* Proof hashes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-xs text-white/50">Transcript Hash</span>
                <span className="text-white/70 font-mono text-xs">{capsule.transcriptHash}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-xs text-white/50">Capsule Hash</span>
                <span className="text-accent font-mono text-xs">{capsule.capsuleHash}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-white/50">Sealed On</span>
                <span className="text-white/70 text-xs">{formatDate(capsule.timestamp)}</span>
              </div>
            </div>

            {/* Chain badge */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-[10px] text-blue-400 font-bold">B</span>
                </div>
                <span className="text-xs text-white/60">Base Mainnet</span>
              </div>
              <span className="text-[10px] text-white/40 font-mono">eip155:8453</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-4">
        {sampleCapsules.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 300);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-accent w-6"
                : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function OriginCapsuleSection() {
  return (
    <section id="capsule" className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-medium mb-6">
              <Box className="w-3.5 h-3.5" />
              On-Chain Provenance
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-6">
              Every launch sealed in an
              <br />
              <span className="text-accent-gradient">Origin Capsule</span>
            </h2>

            <p className="text-muted text-base sm:text-lg mb-8 leading-relaxed max-w-lg">
              Cryptographic proof of human-AI collaboration. Each capsule records the founder,
              the agent, and the build artifact — sealed immutably on Base.
            </p>

            {/* Key features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-accent" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">ERC-8004 Agent Registry</div>
                  <div className="text-white/50 text-sm">34+ AI coding agents with on-chain identity. Portable reputation across platforms.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-accent" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">Transcript Verification</div>
                  <div className="text-white/50 text-sm">Backers can verify the AI conversation that built the project.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-accent" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">Immutable Record</div>
                  <div className="text-white/50 text-sm">Once sealed, the capsule can never be modified. Trust through transparency.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Capsule Visual */}
          <div className="flex justify-center lg:justify-end">
            <CapsuleVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
