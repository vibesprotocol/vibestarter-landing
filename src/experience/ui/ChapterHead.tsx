"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ChapterHeadProps {
  index: string; // "02"
  name: string; // "The schedule"
  total?: number;
  /** centered variant for the closing section — no position readout */
  center?: boolean;
  className?: string;
}

/**
 * Indexed chapter row: the kicker formalised. Label wipes up, the 0N/06
 * position readout wipes down, and a hairline draws in beneath — its accent
 * fill is the chapter's fraction of the document, so the rule reads as the
 * same released-over-time language as the funding schedule. Markup rests in
 * the final state; GSAP animates from, so no-JS and reduced-motion get the
 * resolved row.
 */
export function ChapterHead({ index, name, total = 6, center, className }: ChapterHeadProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fraction = Math.min(1, parseInt(index, 10) / total);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 85%", toggleActions: "play none none reverse" },
      });
      tl.fromTo("[data-ch-label]", { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "power4.out" }, 0);
      tl.fromTo("[data-ch-pos]", { yPercent: -110 }, { yPercent: 0, duration: 0.6, ease: "power4.out" }, 0.08);
      tl.fromTo("[data-ch-rule]", { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "expo.out" }, 0.15);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className={className}>
      <div className={`flex items-baseline ${center ? "justify-center" : "justify-between"} gap-6`}>
        <span className="block overflow-hidden">
          <span data-ch-label className="block font-mono text-[11px] tracking-[0.32em] uppercase will-change-transform">
            <span className="text-accent">{index}</span>
            <span className="text-white/55"> — {name}</span>
          </span>
        </span>
        {!center && (
          <span className="block overflow-hidden">
            <span data-ch-pos className="block font-mono text-[10px] tracking-[0.28em] text-white/40 will-change-transform">
              {index} / {String(total).padStart(2, "0")}
            </span>
          </span>
        )}
      </div>
      <div className="relative mt-3 h-px w-full bg-white/[0.06]">
        <div
          data-ch-rule
          className={`absolute inset-y-0 bg-accent/40 will-change-transform ${center ? "origin-center" : "left-0 origin-left"}`}
          style={
            center
              ? { width: `${fraction * 100}%`, left: `${((1 - fraction) / 2) * 100}%` }
              : { width: `${fraction * 100}%` }
          }
        />
      </div>
    </div>
  );
}
