"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { EthIcon, PersonIcon, EscrowIcon } from "./icons";

gsap.registerPlugin(ScrollTrigger);

// Animated particle flowing along the path
function FlowingParticle({ delay, color, pathId }: { delay: number; color: string; pathId: string }) {
  const particleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!particleRef.current) return;

    const tl = gsap.timeline({ repeat: -1, delay });

    tl.to(particleRef.current, {
      motionPath: {
        path: `#${pathId}`,
        align: `#${pathId}`,
        alignOrigin: [0.5, 0.5],
        autoRotate: false,
      },
      duration: 3,
      ease: "none",
    });

    return () => { tl.kill(); };
  }, [delay, pathId]);

  return (
    <div
      ref={particleRef}
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{
        background: color,
        boxShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
        opacity: 0.9,
      }}
    />
  );
}

// Backer avatar component
function BackerAvatar({ index, total }: { index: number; total: number }) {
  const colors = ["#91D982", "#0D8BCA", "#A78BFA", "#91D982", "#0D8BCA"];
  const color = colors[index % colors.length];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5 + index * 0.1, duration: 0.3, ease: "backOut" }}
      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-[10px] font-mono"
      style={{
        borderColor: color,
        backgroundColor: `${color}20`,
        marginLeft: index > 0 ? "-8px" : "0",
        zIndex: total - index,
      }}
    >
      <PersonIcon className="w-4 h-4" />
    </motion.div>
  );
}

export function FundingShift() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

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

      // Flow container fade in
      if (flowRef.current) {
        gsap.fromTo(
          flowRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: flowRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animate flowing dots along the paths
      if (particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll(".flow-particle");
        particles.forEach((particle, i) => {
          gsap.to(particle, {
            motionPath: {
              path: i < 3 ? "#flow-path-1" : "#flow-path-2",
              align: i < 3 ? "#flow-path-1" : "#flow-path-2",
              alignOrigin: [0.5, 0.5],
            },
            duration: 2.5,
            repeat: -1,
            ease: "none",
            delay: (i % 3) * 0.8,
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="funding-changed" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-10 sm:mb-12">
          <span className="section-label mb-4 block">03 / The Shift</span>
          <h2 className="section-heading mb-4">
            Funding changed
          </h2>
          <p className="text-muted text-base sm:text-lg max-w-lg mx-auto font-sans">
            Ideas that couldn&apos;t raise before can now ship and fund in days.
          </p>
        </div>

        {/* Animated Flow Visualization */}
        <div ref={flowRef} className="relative max-w-5xl mx-auto">
          <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 lg:p-10 overflow-hidden">

            {/* Desktop Flow */}
            <div className="hidden lg:block">
              {/* SVG Paths for animation */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#91D982" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#0D8BCA" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="flowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0D8BCA" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#91D982" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                {/* Path from Backers to Escrow */}
                <path
                  id="flow-path-1"
                  d="M 130 150 Q 250 150 320 150"
                  stroke="url(#flowGrad1)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="6 4"
                  opacity="0.5"
                />
                {/* Path from Escrow to Founder */}
                <path
                  id="flow-path-2"
                  d="M 480 150 Q 580 150 670 150"
                  stroke="url(#flowGrad2)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="6 4"
                  opacity="0.5"
                />
              </svg>

              {/* Animated particles container */}
              <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
                {/* Particles for path 1 (Backers → Escrow) */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={`p1-${i}`}
                    className="flow-particle absolute w-2 h-2 rounded-full"
                    style={{
                      background: "#91D982",
                      boxShadow: "0 0 8px #91D982",
                      left: "16%",
                      top: "50%",
                    }}
                  />
                ))}
                {/* Particles for path 2 (Escrow → Founder) */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={`p2-${i}`}
                    className="flow-particle absolute w-2 h-2 rounded-full"
                    style={{
                      background: "#0D8BCA",
                      boxShadow: "0 0 8px #0D8BCA",
                      left: "60%",
                      top: "50%",
                    }}
                  />
                ))}
              </div>

              {/* Three columns: Backers | Escrow | Founder */}
              <div className="relative grid grid-cols-3 gap-8 items-center min-h-[280px]">
                {/* Backers Column */}
                <div className="text-center">
                  <div className="mb-4">
                    <div className="flex justify-center">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <BackerAvatar key={i} index={i} total={5} />
                      ))}
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="font-sans font-bold text-lg text-white mb-1">Backers</h3>
                    <p className="text-xs text-white/50 font-mono mb-3">Contribute ETH</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg">
                      <EthIcon className="w-4 h-4 text-accent" />
                      <span className="text-sm font-mono text-accent">ETH</span>
                    </div>
                  </motion.div>
                </div>

                {/* Escrow Column */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "backOut" }}
                    viewport={{ once: true }}
                    className="relative mx-auto w-32 h-32 rounded-2xl bg-gradient-to-br from-accent/20 to-accent-bright/20 border border-white/10 flex items-center justify-center"
                  >
                    {/* Animated ring */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-accent/30 animate-pulse" />
                    <div className="text-center">
                      <EscrowIcon className="w-10 h-10 mx-auto text-accent-bright mb-1" />
                      <span className="text-[10px] font-mono text-white/60">ESCROW</span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-4"
                  >
                    <p className="text-xs text-white/50 font-mono">Funds secured on-chain</p>
                  </motion.div>
                </div>

                {/* Founder Column */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="w-16 h-16 mx-auto rounded-full bg-accent-bright/20 border-2 border-accent-bright/40 flex items-center justify-center mb-4"
                  >
                    <PersonIcon className="w-8 h-8 text-accent-bright" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="font-sans font-bold text-lg text-white mb-1">Founder</h3>
                    <p className="text-xs text-white/50 font-mono mb-3">Receives tranches</p>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-bright/10 border border-accent-bright/20 rounded-lg">
                      <span className="text-xs font-mono text-accent-bright">10%</span>
                      <span className="text-[10px] text-white/40">+</span>
                      <span className="text-xs font-mono text-accent-bright">15%</span>
                      <span className="text-[10px] text-white/40">×6</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Mobile/Tablet - Vertical Flow */}
            <div className="lg:hidden">
              <div className="flex flex-col items-center gap-6">
                {/* Backers */}
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    {[0, 1, 2].map((i) => (
                      <BackerAvatar key={i} index={i} total={3} />
                    ))}
                  </div>
                  <h3 className="font-sans font-bold text-base text-white">Backers contribute ETH</h3>
                </div>

                {/* Arrow down */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-px h-6 bg-gradient-to-b from-accent to-accent-bright" />
                  <div className="w-2 h-2 rounded-full bg-accent-bright animate-pulse" />
                  <div className="w-px h-6 bg-gradient-to-b from-accent-bright to-accent" />
                </div>

                {/* Escrow */}
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-accent/20 to-accent-bright/20 border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <EscrowIcon className="w-8 h-8 mx-auto text-accent-bright" />
                    <span className="text-[9px] font-mono text-white/60">ESCROW</span>
                  </div>
                </div>

                {/* Arrow down */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-px h-6 bg-gradient-to-b from-accent-bright to-accent" />
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <div className="w-px h-6 bg-gradient-to-b from-accent to-accent-bright" />
                </div>

                {/* Founder */}
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-accent-bright/20 border-2 border-accent-bright/40 flex items-center justify-center mb-3">
                    <PersonIcon className="w-7 h-7 text-accent-bright" />
                  </div>
                  <h3 className="font-sans font-bold text-base text-white">Founder receives tranches</h3>
                  <p className="text-xs text-white/50 font-mono mt-1">10% kickstart + 15% × 6 months</p>
                </div>
              </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-bright/[0.05] rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Bottom labels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-6 grid grid-cols-2 gap-4 max-w-md mx-auto"
          >
            <div className="text-center p-3 rounded-xl border border-accent/20 bg-accent/[0.05]">
              <p className="text-xs font-mono text-accent mb-0.5">For Founders</p>
              <p className="text-[11px] text-white/50">Launch & get funded in days</p>
            </div>
            <div className="text-center p-3 rounded-xl border border-accent-bright/20 bg-accent-bright/[0.05]">
              <p className="text-xs font-mono text-accent-bright mb-0.5">For Backers</p>
              <p className="text-[11px] text-white/50">Discover & support early</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-10 text-center"
        >
          <p className="text-muted text-[13px] sm:text-[14px] font-mono">
            <span className="text-accent">Days, not months.</span> Provenance-verified, time-released.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
