"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VibesTelemetry } from "./VibesTelemetry";
import { ChapterHead } from "../ui/ChapterHead";

gsap.registerPlugin(ScrollTrigger);

/**
 * 06 — launch. The closing statement and both doors.
 */
export function EdLaunch() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 70%", toggleActions: "play none none reverse" },
      });
      tl.fromTo(
        "[data-launch-line]",
        { yPercent: 112 },
        { yPercent: 0, duration: 0.9, stagger: 0.1, ease: "power4.out" },
        0
      );
      tl.fromTo(
        "[data-launch-fade]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power2.out" },
        0.5
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} data-chapter="06" data-chapter-name="Launch" className="relative py-20 sm:py-40 px-5 sm:px-10 border-t border-white/[0.08] text-center">
      <div className="max-w-[1500px] mx-auto">
        <ChapterHead index="06" name="Launch" center className="mb-8" />
        <h2 className="font-serif font-normal leading-[1.0] text-white">
          <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <span data-launch-line data-skew className="block text-[clamp(42px,7.2vw,112px)] tracking-[-0.015em] will-change-transform">
              Launch in minutes.
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.16em] -mb-[0.12em]">
            <span data-launch-line data-skew className="block italic text-white text-[clamp(42px,7.2vw,112px)] tracking-[-0.015em] will-change-transform">
              Funded over six months.
            </span>
          </span>
        </h2>

        <div data-launch-fade className="mt-8 sm:mt-12 flex flex-row flex-wrap sm:flex-nowrap gap-3 sm:gap-4 justify-center">
          <Link href="https://app.vibestarter.xyz/launch" data-cursor="link" className="btn-mechanical px-5 sm:px-8 py-4 text-[12px] sm:text-[13px] whitespace-nowrap">
            Apply to Raise
          </Link>
          <a
            href="https://aerodrome.finance/swap?from=ETH&to=0xefFC8815487084a97edfdfF968b56Ea123421Acb"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="btn-mechanical-outline px-5 sm:px-8 py-4 text-[12px] sm:text-[13px] whitespace-nowrap"
          >
            Get $VIBES ↗
          </a>
        </div>

        <VibesTelemetry />

        <p data-launch-fade className="mt-10 font-mono text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-white/50">
          Live on Base · chain 8453 · two audit cycles complete
        </p>
      </div>
    </section>
  );
}
