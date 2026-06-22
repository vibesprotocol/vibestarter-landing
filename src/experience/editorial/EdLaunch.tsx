"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    <section ref={sectionRef} className="relative py-28 sm:py-40 px-5 sm:px-10 border-t border-white/[0.08] text-center">
      <div className="max-w-[1500px] mx-auto">
        <p data-launch-fade className="font-mono text-[11px] tracking-[0.32em] uppercase text-white/40 mb-8">
          <span className="text-accent">06</span> — Launch
        </p>
        <h2 className="font-display font-bold leading-[0.95] text-white">
          <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
            <span data-launch-line data-skew className="block text-[clamp(44px,8.4vw,130px)] tracking-[-0.045em] will-change-transform">
              LAUNCH IN MINUTES<span className="text-accent">.</span>
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.16em] -mb-[0.1em]">
            <span data-launch-line data-skew className="block text-accent text-[clamp(34px,5.8vw,90px)] will-change-transform">
              funded over six months.
            </span>
          </span>
        </h2>

        <div data-launch-fade className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="https://app.vibestarter.xyz" data-cursor="link" className="btn-mechanical px-8 py-4 text-[13px]">
            Launch a Raise
          </Link>
          <Link href="https://app.vibestarter.xyz/raises/vibes" data-cursor="link" className="btn-mechanical-outline px-8 py-4 text-[13px]">
            Back the $VIBES Raise
          </Link>
        </div>

        <p data-launch-fade className="mt-12 font-mono text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-white/35">
          Live on Base · chain 8453 · two audits complete
        </p>
      </div>
    </section>
  );
}
