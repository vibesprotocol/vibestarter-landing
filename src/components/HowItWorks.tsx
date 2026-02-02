"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: 1, title: "Verify", desc: "Wallet + socials" },
  { num: 2, title: "Prove Build", desc: "Vibecode attestation" },
  { num: 3, title: "Set Terms", desc: "Roadmap + tokens" },
  { num: 4, title: "Go Live", desc: "Start raise" },
  { num: 5, title: "In Escrow", desc: "Funds secured" },
  { num: 6, title: "Vibestart", desc: "10% instant funding" },
  { num: 7, title: "Ship", desc: "Build & deliver" },
  { num: 8, title: "Tranches", desc: "Monthly funding claim" },
];

const iconPaths: Record<number, React.ReactNode> = {
  1: <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  2: <path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />,
  3: (
    <>
      <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </>
  ),
  4: <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />,
  5: <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />,
  6: <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />,
  7: (
    <>
      <path d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </>
  ),
  8: <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
};

// Calculate y position on wave given x (0-100+)
// Wave spans from x=5 (step 1) to x=92 (step 8), with 12.4 units between each step
// Peaks at odd steps (y=35), valleys at even steps (y=65)
function getWaveY(x: number): number {
  // Period is 24.8 (two steps = one full wave cycle)
  const frequency = (2 * Math.PI) / 24.8;
  // Phase shift so x=5 is a peak (y=35)
  const phase = -frequency * 5;
  // Wave oscillates between 35 and 65 (amplitude 15, centered at 50)
  return 50 + 15 * Math.cos(frequency * x + phase);
}

// Generate SVG path that matches the getWaveY function
// Extends from -5 to 105 to show wave continuing beyond nodes
function generateWavePath(): string {
  const points: { x: number; y: number }[] = [];
  for (let x = -5; x <= 105; x += 0.5) {
    points.push({ x, y: getWaveY(x) });
  }

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  return path;
}

interface AnimatedDotProps {
  delay: number;
  color: string;
}

function AnimatedDot({ delay, color }: AnimatedDotProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef({ value: 0 });

  useEffect(() => {
    if (!dotRef.current) return;

    // Dot travels from x=-5 to x=105 (beyond visible nodes at 5-92)
    const startX = -5;
    const endX = 105;
    const range = endX - startX;

    // Initialize position based on delay
    const initialProgress = (delay / 12) % 1;
    progressRef.current.value = initialProgress;

    // Create GSAP animation for smooth looping
    const tl = gsap.timeline({ repeat: -1 });

    tl.to(progressRef.current, {
      value: 1,
      duration: 12 - (delay % 12),
      ease: "none",
      onUpdate: () => {
        if (!dotRef.current) return;
        const x = startX + progressRef.current.value * range;
        const y = getWaveY(x);
        dotRef.current.style.left = `${x}%`;
        dotRef.current.style.top = `${y}%`;
      },
    });

    // After first cycle, loop from 0 to 1
    tl.to(progressRef.current, {
      value: 1,
      duration: 12,
      ease: "none",
      startAt: { value: 0 },
      onUpdate: () => {
        if (!dotRef.current) return;
        const x = startX + progressRef.current.value * range;
        const y = getWaveY(x);
        dotRef.current.style.left = `${x}%`;
        dotRef.current.style.top = `${y}%`;
      },
      repeat: -1,
    });

    return () => {
      tl.kill();
    };
  }, [delay]);

  return (
    <div
      ref={dotRef}
      className="absolute w-2.5 h-2.5 rounded-full pointer-events-none"
      style={{
        left: "-2%",
        top: "65%",
        transform: "translate(-50%, -50%)",
        background: color,
        boxShadow: `0 0 8px ${color}`,
      }}
    />
  );
}

export function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const waveContainerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const tabletGridRef = useRef<HTMLDivElement>(null);
  const mobileListRef = useRef<HTMLDivElement>(null);

  // Node positions matching the wave peaks/valleys (x%, y%)
  // Scaled to 5-92% to leave room for wave to extend on both ends
  const nodePositions = [
    { x: 5, y: 35 },      // peak - step 1
    { x: 17.4, y: 65 },   // valley - step 2
    { x: 29.9, y: 35 },   // peak - step 3
    { x: 42.3, y: 65 },   // valley - step 4
    { x: 54.7, y: 35 },   // peak - step 5
    { x: 67.1, y: 65 },   // valley - step 6
    { x: 79.6, y: 35 },   // peak - step 7
    { x: 92, y: 65 },     // valley - step 8
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header slide in from left
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Desktop wave nodes stagger in
      const visibleNodes = nodesRef.current.filter(Boolean);
      if (visibleNodes.length > 0) {
        gsap.set(visibleNodes, { scale: 0, opacity: 0 });
        gsap.to(visibleNodes, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: waveContainerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Tablet grid cards stagger in
      if (tabletGridRef.current) {
        const tabletCards = tabletGridRef.current.querySelectorAll(":scope > div");
        if (tabletCards.length > 0) {
          gsap.set(tabletCards, { y: 40, opacity: 0 });
          gsap.to(tabletCards, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: tabletGridRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        }
      }

      // Mobile list items stagger in
      if (mobileListRef.current) {
        const mobileItems = mobileListRef.current.querySelectorAll(":scope > div");
        if (mobileItems.length > 0) {
          gsap.set(mobileItems, { x: -30, opacity: 0 });
          gsap.to(mobileItems, {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: mobileListRef.current,
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
    <section
      ref={sectionRef}
      id="how-vibestarter-works"
      className="relative w-full overflow-hidden py-12 sm:py-16 lg:py-20"
    >
      {/* Ambient glow with parallax */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]"
        style={{ y: 0 }}
        initial={{ y: 0 }}
        whileInView={{ y: -20 }}
        transition={{ duration: 1 }}
        viewport={{ once: false }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-bright/5 rounded-full blur-[120px]"
        initial={{ y: 0 }}
        whileInView={{ y: 20 }}
        transition={{ duration: 1 }}
        viewport={{ once: false }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-wrap items-center justify-center gap-3 mb-16 md:mb-24"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-accent"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-white">
              How Vibestarter Works
            </h2>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border border-accent/40 text-accent rounded">
            Time-Released
          </span>
        </div>

        {/* Desktop: Main wave visualization */}
        <div ref={waveContainerRef} className="hidden lg:block relative h-[380px]">
          {/* SVG Wave - extends past visible area for smooth continuation */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="none"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient
                id="waveGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#91D982" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#0D8BCA" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#91D982" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* The wave path */}
            <path
              d={generateWavePath()}
              stroke="url(#waveGradient)"
              strokeWidth="0.4"
              strokeLinecap="round"
            />
          </svg>

          {/* Animated dots traveling along the wave */}
          <AnimatedDot delay={0} color="#91D982" />
          <AnimatedDot delay={4} color="#0D8BCA" />
          <AnimatedDot delay={8} color="#91D982" />

          {/* Step nodes */}
          {steps.map((step, index) => {
            const pos = nodePositions[index];
            const isTop = index % 2 === 0;
            const isHovered = hoveredStep === step.num;
            const isAccent = index % 2 === 0;
            const accentColor = isAccent ? "#91D982" : "#0D8BCA";

            return (
              <div
                key={step.num}
                ref={(el) => { nodesRef.current[index] = el; }}
                className="absolute"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={() => setHoveredStep(step.num)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Icon circle on the path */}
                <div
                  className={`relative w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isHovered ? "scale-110" : "bg-background border-2"
                  }`}
                  style={{
                    backgroundColor: isHovered ? accentColor : "#0A0A0A",
                    borderColor: isHovered ? accentColor : `${accentColor}99`,
                    color: isHovered ? "#0A0A0A" : accentColor,
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    {iconPaths[step.num]}
                  </svg>

                  {/* Pulse on hover */}
                  {isHovered && (
                    <span
                      className="absolute inset-0 rounded-full border-2 animate-ping opacity-40"
                      style={{ borderColor: accentColor }}
                    />
                  )}
                </div>

                {/* Text label */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 text-center whitespace-nowrap transition-all duration-300 ${
                    isTop ? "bottom-full mb-6" : "top-full mt-6"
                  }`}
                >
                  <p
                    className="text-[10px] font-mono uppercase tracking-widest transition-colors duration-300"
                    style={{
                      color: isHovered ? accentColor : "rgba(255,255,255,0.5)",
                    }}
                  >
                    Step {step.num}
                  </p>
                  <p
                    className={`text-sm md:text-base font-medium mt-1 transition-colors duration-300 ${
                      isHovered ? "text-white" : "text-white/80"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`text-xs mt-0.5 transition-all duration-300 ${
                      isHovered
                        ? "text-white/60 opacity-100"
                        : "text-white/40 opacity-80"
                    }`}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tablet: 2x4 grid */}
        <div
          ref={tabletGridRef}
          className="hidden md:grid lg:hidden grid-cols-2 gap-4 max-w-2xl mx-auto"
        >
          {steps.map((item, index) => {
            const isAccent = index % 2 === 0;
            return (
              <div
                key={item.num}
                className={`relative p-5 rounded-xl border bg-white/[0.02] ${
                  isAccent ? "border-accent/30" : "border-accent-bright/30"
                }`}
              >
                <div
                  className={`absolute -top-3 left-5 px-3 py-1 rounded-full text-[11px] font-bold text-black ${
                    isAccent ? "bg-accent" : "bg-accent-bright"
                  }`}
                >
                  Step {item.num}
                </div>
                <h3 className="font-semibold text-base mt-3 mb-2 text-white">
                  {item.title}
                </h3>
                <p className="text-[13px] text-white/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile vertical layout */}
        <div ref={mobileListRef} className="md:hidden space-y-3">
          {steps.map((item, index) => {
            const isAccent = index % 2 === 0;
            return (
              <div key={item.num} className="flex gap-4">
                {/* Step number column with line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isAccent
                        ? "border-accent bg-accent/20"
                        : "border-accent-bright bg-accent-bright/20"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        isAccent ? "text-accent" : "text-accent-bright"
                      }`}
                    >
                      {item.num}
                    </span>
                  </div>
                  {/* Connector line (not on last item) */}
                  {index < steps.length - 1 && (
                    <div className="w-px flex-1 min-h-[16px] bg-white/[0.08]" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 p-4 rounded-xl border bg-white/[0.02] ${
                    isAccent ? "border-accent/20" : "border-accent-bright/20"
                  }`}
                >
                  <h3 className="font-semibold text-base mb-1 text-white">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-white/60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20 flex items-center justify-center gap-6 text-xs text-white/50"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Trustless
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-bright" />
            Time-based
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            On-chain
          </span>
        </motion.div>
      </div>
    </section>
  );
}
