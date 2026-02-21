"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { TextScramble } from "./TextScramble";
import { CornerBrackets } from "@/components/ui/corner-brackets";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: 1, title: "VERIFY_ID", desc: "Connect wallet and social accounts to establish builder provenance." },
  { num: 2, title: "PROVE_BUILD", desc: "Submit vibecode attestation linking your agent to the project." },
  { num: 3, title: "SET_TERMS", desc: "Define your roadmap, token supply, and raise parameters." },
  { num: 4, title: "GO_LIVE", desc: "Launch your raise and open contributions to the community." },
  { num: 5, title: "IN_ESCROW", desc: "All funds secured in smart contract escrow on Base." },
  { num: 6, title: "VIBESTART", desc: "10% kickstart funding released instantly at finalization." },
  { num: 7, title: "SHIP_IT", desc: "Build and deliver your product with monthly funding access." },
  { num: 8, title: "TRANCHES", desc: "Remaining funds release monthly over 6 months with challenge windows." },
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
function getWaveY(x: number): number {
  const frequency = (2 * Math.PI) / 24.8;
  const phase = -frequency * 5;
  return 50 + 15 * Math.cos(frequency * x + phase);
}

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
    const startX = -5;
    const endX = 105;
    const range = endX - startX;
    const initialProgress = (delay / 12) % 1;
    progressRef.current.value = initialProgress;

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

    return () => { tl.kill(); };
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
  const [mobileActiveStep, setMobileActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const waveContainerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const tabletGridRef = useRef<HTMLDivElement>(null);

  const step = steps[mobileActiveStep];
  const isAccent = mobileActiveStep % 2 === 0;
  const accentColor = isAccent ? "#91D982" : "#0D8BCA";

  const goNext = useCallback(() => {
    setMobileActiveStep((prev) => (prev + 1) % steps.length);
  }, []);

  const goPrev = useCallback(() => {
    setMobileActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  }, []);

  // Node positions matching the wave peaks/valleys
  const nodePositions = [
    { x: 5, y: 35 },
    { x: 17.4, y: 65 },
    { x: 29.9, y: 35 },
    { x: 42.3, y: 65 },
    { x: 54.7, y: 35 },
    { x: 67.1, y: 65 },
    { x: 79.6, y: 35 },
    { x: 92, y: 65 },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.05,
            ease: "none",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            onStart: () => {
              if (!headerRef.current) return;
              headerRef.current.style.textShadow = "0 0 30px rgba(145,217,130,0.6), 0 0 60px rgba(145,217,130,0.3)";
              gsap.to(headerRef.current, {
                textShadow: "0 0 0px rgba(145,217,130,0)",
                duration: 0.6,
                ease: "power2.out",
              });
            },
          }
        );
      }

      const visibleNodes = nodesRef.current.filter(Boolean);
      if (visibleNodes.length > 0) {
        gsap.set(visibleNodes, { scale: 0.8, opacity: 0 });
        gsap.to(visibleNodes, {
          scale: 1,
          opacity: 1,
          duration: 0.15,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: waveContainerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      if (tabletGridRef.current) {
        const tabletCards = tabletGridRef.current.querySelectorAll(":scope > div");
        if (tabletCards.length > 0) {
          gsap.set(tabletCards, { opacity: 0 });
          gsap.to(tabletCards, {
            opacity: 1,
            duration: 0.15,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: {
              trigger: tabletGridRef.current,
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
      className="relative w-full py-12 sm:py-16 lg:py-20"
    >
      {/* Ambient glow with parallax — isolated overflow to prevent scrollbar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="section-label">// Process</span>
            <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border border-accent/40 text-accent">
              Time-Released
            </span>
          </div>
          <TextScramble
            text="How Vibestarter Works"
            className="section-heading"
          />
        </div>

        {/* Desktop: Main wave visualization */}
        <div ref={waveContainerRef} className="hidden lg:block relative h-[380px]">
          {/* Wave line and animated dots — clipped to prevent horizontal scrollbar */}
          <div className="absolute inset-0 overflow-hidden">
            <svg
              className="absolute inset-0 w-full h-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#91D982" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#0D8BCA" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#91D982" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <path d={generateWavePath()} stroke="url(#waveGradient)" strokeWidth="0.4" strokeLinecap="round" strokeOpacity="0.3" />
              <path d={generateWavePath()} stroke="url(#waveGradient)" strokeWidth="0.6" strokeLinecap="round" strokeDasharray="4 2" style={{ animation: "pipeline-flow 1.5s linear infinite" }} />
            </svg>

            <AnimatedDot delay={0} color="#91D982" />
            <AnimatedDot delay={4} color="#0D8BCA" />
            <AnimatedDot delay={8} color="#91D982" />
          </div>

          {/* Node icons and labels — NOT clipped so descriptions can extend */}
          {steps.map((s, index) => {
            const pos = nodePositions[index];
            const isTop = index % 2 === 0;
            const isHovered = hoveredStep === s.num;
            const isAccentNode = index % 2 === 0;
            const nodeAccentColor = isAccentNode ? "#91D982" : "#0D8BCA";

            return (
              <div
                key={s.num}
                ref={(el) => { nodesRef.current[index] = el; }}
                className="absolute"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={() => setHoveredStep(s.num)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div
                  className={`relative w-11 h-11 md:w-12 md:h-12 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isHovered ? "scale-110" : "bg-background border-2"
                  }`}
                  style={{
                    backgroundColor: isHovered ? nodeAccentColor : "#0A0A0A",
                    borderColor: isHovered ? nodeAccentColor : `${nodeAccentColor}99`,
                    color: isHovered ? "#0A0A0A" : nodeAccentColor,
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    {iconPaths[s.num]}
                  </svg>
                  {isHovered && (
                    <span
                      className="absolute inset-0 border-2 animate-ping opacity-40"
                      style={{ borderColor: nodeAccentColor }}
                    />
                  )}
                </div>

                <div
                  className={`absolute left-1/2 -translate-x-1/2 text-center w-[240px] transition-all duration-300 ${
                    isTop ? "bottom-full mb-6" : "top-full mt-6"
                  }`}
                >
                  <p
                    className="text-[10px] font-mono uppercase tracking-widest whitespace-nowrap transition-colors duration-300"
                    style={{ color: isHovered ? nodeAccentColor : "rgba(255,255,255,0.5)" }}
                  >
                    Step {s.num}
                  </p>
                  <p className={`text-sm md:text-base font-medium mt-1 whitespace-nowrap transition-colors duration-300 ${isHovered ? "text-white" : "text-white/80"}`}>
                    {s.title.replace("_", " ")}
                  </p>
                  <p className={`text-xs mt-0.5 leading-snug transition-all duration-300 ${isHovered ? "text-white/60 opacity-100" : "text-white/40 opacity-80"}`}>
                    {steps[index].desc.split(".")[0]}
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
            const isAccentTab = index % 2 === 0;
            return (
              <CornerBrackets key={item.num}>
                <div className="relative p-5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div
                    className={`absolute -top-3 left-5 px-3 py-1 text-[11px] font-bold text-black ${
                      isAccentTab ? "bg-accent" : "bg-accent-bright"
                    }`}
                  >
                    Step {item.num}
                  </div>
                  <h3 className="font-mono font-bold text-base mt-3 mb-2 text-white uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-white/60 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </CornerBrackets>
            );
          })}
        </div>

        {/* Mobile: Holographic Pipeline — swipeable, centered icon, floating in void */}
        <div
          className="md:hidden relative w-full flex flex-col items-center justify-center select-none touch-pan-y"
          onTouchStart={(e) => {
            const touch = e.touches[0];
            (e.currentTarget as HTMLElement).dataset.touchStartX = String(touch.clientX);
          }}
          onTouchEnd={(e) => {
            const startX = Number((e.currentTarget as HTMLElement).dataset.touchStartX || 0);
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 40) {
              if (diff > 0) goNext();
              else goPrev();
            }
          }}
        >
          {/* Main display — icon area is the reference for crosshairs */}
          <div className="relative z-10 text-center w-full max-w-sm px-6 py-8">
            {/* Step indicator */}
            <div className="font-mono text-[10px] text-white/30 mb-8 tracking-[0.3em] uppercase">
              Step <span style={{ color: accentColor }}>{String(step.num).padStart(2, "0")}</span> / {String(steps.length).padStart(2, "0")}
            </div>

            {/* Hero icon floating in void with crosshairs */}
            <div className="relative h-40 flex items-center justify-center mb-8">
              {/* Crosshairs centered on the icon area */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-0 w-full h-px bg-[#1f1f1f]" />
                <div className="absolute top-0 left-1/2 h-full w-px bg-[#1f1f1f]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-[#333] rounded-full border-dashed" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileActiveStep}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25 }}
                  className="relative flex items-center justify-center"
                >
                  {/* Glow */}
                  <div
                    className="absolute w-24 h-24 blur-[80px] opacity-20"
                    style={{ backgroundColor: accentColor }}
                  />
                  <svg
                    className="w-24 h-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                  >
                    {iconPaths[step.num]}
                  </svg>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Title + description */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileActiveStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                <h3 className="text-3xl font-black font-mono text-white tracking-tighter uppercase">
                  {step.title}
                </h3>
                <div className="w-8 h-1 mx-auto" style={{ backgroundColor: accentColor }} />
                <p className="text-sm text-white/40 font-mono leading-relaxed max-w-[250px] mx-auto">
                  {step.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation — tactical controls */}
          <div className="mt-4 flex items-center gap-8 z-20">
            <button
              onClick={goPrev}
              className="text-white/30 hover:text-accent active:text-accent transition font-mono text-sm p-4"
            >
              [ PREV ]
            </button>

            {/* Progress dots (square) */}
            <div className="flex gap-1.5">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setMobileActiveStep(index)}
                  className="w-1.5 h-1.5 transition-all duration-300"
                  style={{
                    backgroundColor: index === mobileActiveStep
                      ? accentColor
                      : index <= mobileActiveStep
                        ? `${accentColor}66`
                        : "#333",
                  }}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              className="text-white/30 hover:text-accent active:text-accent transition font-mono text-sm p-4"
            >
              [ NEXT ]
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
