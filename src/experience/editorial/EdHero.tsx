"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { TopoField } from "./TopoField";
import { WipeWordmark } from "../ui/WipeWordmark";

/**
 * Hero — one focal element: the claim. The topographic field carries the
 * atmosphere; everything else lives further down the page.
 */
export function EdHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: "power4.out" } });
      tl.fromTo(
        "[data-line]",
        { yPercent: 112, letterSpacing: "0.02em" },
        { yPercent: 0, letterSpacing: "-0.045em", duration: 1.0, stagger: 0.1 },
        0
      );
      tl.fromTo(
        "[data-accent-line]",
        { yPercent: 120, rotate: 2 },
        { yPercent: 0, rotate: 0, duration: 1.0, ease: "power3.out" },
        0.32
      );
      tl.fromTo(
        "[data-fade]",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" },
        0.55
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ed-survey-cursor relative min-h-[88svh] sm:min-h-screen flex flex-col overflow-hidden">
      {/* topographic field — the terrain follows the cursor; the section carries
          the survey crosshair (the topo host is pointer-events-none, so the
          cursor must live on the hit-tested ancestor — links keep their own) */}
      <TopoField className="absolute inset-0" />
      {/* readability veil over the contours — much lighter on phones so the
          terrain actually shows; it only needs to clear the claim's zone */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_120%_50%_at_50%_28%,rgba(0,0,0,0.45),rgba(0,0,0,0.1)_60%,transparent_82%)] sm:bg-[radial-gradient(ellipse_70%_60%_at_28%_45%,rgba(0,0,0,0.82),rgba(0,0,0,0.3)_55%,transparent_80%)]"
      />

      {/* nav */}
      <header className="relative z-10 flex items-center justify-between px-5 sm:px-10 h-[76px]">
        <Link href="/" className="flex items-center gap-[0.15em]" data-cursor="link">
          <svg className="h-[14px] w-auto text-accent" viewBox="2 6 28 20" fill="none" aria-hidden>
            <path d="M4 8L14 16L4 24" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
            <path d="M16 24H28" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
          </svg>
          <WipeWordmark text="Vibestarter" trigger="load" delay={0.3} className="font-display font-bold text-[17px] tracking-tight text-white" />
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/whitepaper" data-cursor="link" data-scramble className="ed-link hidden md:inline font-mono text-[11px] tracking-[0.22em] uppercase text-white/50 hover:text-white transition-colors">
            Whitepaper
          </Link>
          <Link href="/thesis" data-cursor="link" data-scramble className="ed-link hidden md:inline font-mono text-[11px] tracking-[0.22em] uppercase text-white/50 hover:text-white transition-colors">
            Thesis
          </Link>
          <Link href="https://app.vibestarter.xyz" data-cursor="link" className="btn-mechanical px-5 py-2.5 text-[12px]">
            Launch App
          </Link>
        </div>
      </header>

      {/* the claim — top-set on mobile so the chevron landform owns the open
          ground below it; vertically centred from sm up */}
      <div className="relative z-10 flex-1 flex items-start pt-4 sm:items-center sm:pt-0 px-5 sm:px-10">
        <div className="w-full max-w-[1500px] mx-auto">
          <p data-fade className="font-mono text-[11px] tracking-[0.32em] uppercase text-accent mb-5 sm:mb-7">
            {"//"} Time-released crowdfunding — live on Base
          </p>

          <h1 className="font-display font-bold leading-[0.95] text-white select-none">
            <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
              <span data-line data-skew className="block text-[clamp(52px,9.6vw,150px)] tracking-[-0.045em] will-change-transform">
                EXECUTION
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
              <span data-line data-skew className="block text-[clamp(52px,9.6vw,150px)] tracking-[-0.045em] will-change-transform">
                COLLAPSED.
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.18em] -mb-[0.1em] mt-[0.04em]">
              <span data-accent-line data-skew className="block text-[clamp(36px,6.6vw,102px)] font-extralight text-white will-change-transform">
                funding did not.
              </span>
            </span>
          </h1>

          <p data-fade className="mt-6 sm:mt-8 max-w-[520px] text-muted font-sans font-light text-[15px] sm:text-lg leading-relaxed">
            Agents ship MVPs in days — but shipping and scaling still takes capital.
            Vibestarter funds vibecoded apps with accountability built in: released over
            time, pausable by backers, proven on-chain.
          </p>
          <div data-fade className="mt-7 sm:mt-9 flex flex-row gap-3 sm:gap-4">
            <Link href="https://app.vibestarter.xyz/launch" data-cursor="link" className="btn-mechanical px-4 sm:px-7 py-3.5 text-[12px] sm:text-[13px] text-center whitespace-nowrap">
              Apply to Raise
            </Link>
            <Link href="#schedule" data-cursor="link" className="btn-mechanical-outline px-4 sm:px-7 py-3.5 text-[12px] sm:text-[13px] text-center whitespace-nowrap">
              How it works ↓
            </Link>
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <div data-fade className="relative z-10 px-5 sm:px-10 pb-7">
        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30">
          Scroll — how the machine holds everyone accountable
        </p>
      </div>
    </section>
  );
}
