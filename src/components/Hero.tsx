"use client";

import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

function HeroVisual() {
  const [stage, setStage] = useState(0);
  const [typedCommand1, setTypedCommand1] = useState("");
  const [typedCommand2, setTypedCommand2] = useState("");

  const command1 = "attest --founder @yourhandle";
  const command2 = "launch --raise 10 ETH";

  useEffect(() => {
    // Stage 0: Start typing first command
    // Stage 1: First command complete, show response
    // Stage 2: Start typing second command
    // Stage 3: Second command complete, show response
    // Stage 4: Show final cursor

    const delays = {
      startTyping1: 500,
      showResponse1: 2000,
      startTyping2: 3500,
      showResponse2: 5500,
      showFinal: 7000,
    };

    // Type first command
    const typeCommand1 = setTimeout(() => {
      let i = 0;
      const typing = setInterval(() => {
        if (i <= command1.length) {
          setTypedCommand1(command1.slice(0, i));
          i++;
        } else {
          clearInterval(typing);
        }
      }, 40);
    }, delays.startTyping1);

    // Show first response
    const showResponse1 = setTimeout(() => {
      setStage(1);
    }, delays.showResponse1);

    // Start typing second command
    const startTyping2 = setTimeout(() => {
      setStage(2);
      let i = 0;
      const typing = setInterval(() => {
        if (i <= command2.length) {
          setTypedCommand2(command2.slice(0, i));
          i++;
        } else {
          clearInterval(typing);
        }
      }, 40);
    }, delays.startTyping2);

    // Show second response
    const showResponse2 = setTimeout(() => {
      setStage(3);
    }, delays.showResponse2);

    // Show final cursor
    const showFinal = setTimeout(() => {
      setStage(4);
    }, delays.showFinal);

    return () => {
      clearTimeout(typeCommand1);
      clearTimeout(showResponse1);
      clearTimeout(startTyping2);
      clearTimeout(showResponse2);
      clearTimeout(showFinal);
    };
  }, []);

  return (
    <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
      {/* Terminal window */}
      <div className="relative bg-[#0a0a0a] border border-white/[0.08] rounded-xl overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[11px] font-mono text-white/40">claude — vibestarter</span>
          </div>
        </div>

        {/* Terminal content */}
        <div className="p-4 font-mono text-[13px] leading-relaxed space-y-3 min-h-[320px]">
          {/* First prompt line */}
          <div className="flex items-start gap-2">
            <span className="text-accent-bright shrink-0">claude $</span>
            <span className="text-white/80">
              {typedCommand1}
              {stage === 0 && typedCommand1.length < command1.length && (
                <span className="inline-block w-2 h-4 bg-white/60 animate-pulse ml-0.5 align-middle" />
              )}
            </span>
          </div>

          {/* First agent response */}
          {stage >= 1 && (
            <div className="pl-0 space-y-2 text-white/70 animate-fadeIn">
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
          )}

          {/* Second prompt */}
          {stage >= 2 && (
            <div className="flex items-start gap-2 animate-fadeIn">
              <span className="text-accent-bright shrink-0">claude $</span>
              <span className="text-white/80">
                {typedCommand2}
                {stage === 2 && typedCommand2.length < command2.length && (
                  <span className="inline-block w-2 h-4 bg-white/60 animate-pulse ml-0.5 align-middle" />
                )}
              </span>
            </div>
          )}

          {/* Second response */}
          {stage >= 3 && (
            <div className="space-y-1 animate-fadeIn">
              <div className="text-white/50 text-[12px]">
                → Creating Vibetoken...
              </div>
              <div className="text-white/50 text-[12px]">
                → Setting milestones...
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-accent">✓</span>
                <span className="text-accent">Live on Base</span>
                <span className="text-white/30">|</span>
                <span className="text-white/40">Ready for backers</span>
              </div>
            </div>
          )}

          {/* Final blinking cursor */}
          {stage >= 4 && (
            <div className="flex items-center gap-2 animate-fadeIn">
              <span className="text-accent-bright">claude $</span>
              <span className="w-2 h-4 bg-white/60 animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Subtle decorative element */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent-bright/[0.03] rounded-full blur-3xl" />
    </div>
  );
}

export function Hero() {
  return (
    <section className="min-h-[85vh] pt-20 flex flex-col">
      <div className="flex-1 flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column - Text */}
            <div>
              {/* Headline */}
              <h1 className="text-[clamp(36px,6vw,64px)] font-semibold leading-[1.1] tracking-tight mb-6">
                Fund your
                <br />
                <span className="text-accent-gradient">vibecoded app.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-muted text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
                Launch a Vibetoken. Raise from the community. Ship with milestone-gated funding and on-chain provenance.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                <Link
                  href="https://app.vibestarter.xyz"
                  className="btn-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-medium text-[15px] text-center"
                >
                  Launch a Vibetoken
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
                Idea to funding in minutes. Escrow-backed, milestone-gated.
              </p>
            </div>

            {/* Right column - Visual */}
            <div className="hidden lg:flex justify-center lg:justify-end">
              <HeroVisual />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pb-8 sm:pb-12 text-center">
        <div className="animate-bounce-slow inline-flex flex-col items-center gap-2 text-muted text-[12px]">
          <span>Scroll to explore</span>
          <ArrowDown size={16} />
        </div>
      </div>
    </section>
  );
}
