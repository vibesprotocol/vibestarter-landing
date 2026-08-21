"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  { v: "LP LOCKED ∞", d: "15% of every raise seeds a permanent Aerodrome pool with no withdraw function." },
  { v: "ONE FLAT PRICE", d: "No bonding curve. First and last backer pay exactly the same." },
  { v: "STANDARD ERC-20", d: "No wrappers, no transfer restrictions. Tradeable anywhere from day one." },
  { v: "REFUND IF UNFUNDED", d: "Misses its goal? Every contribution is fully refundable in ETH." },
] as const;

/**
 * The quiet strip — table stakes built into every raise. Deliberately not
 * a headline section.
 */
export function EdBuiltIn() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-bi]",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 88%", toggleActions: "play none none reverse" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative border-t border-white/[0.08] px-5 sm:px-10 py-12">
      <div className="max-w-[1500px] mx-auto">
        <p data-bi className="font-mono text-[10px] tracking-[0.26em] uppercase text-white/50 mb-7">
          Also built into every raise
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-7">
          {ITEMS.map((item) => (
            <div key={item.v} data-bi>
              <p className="font-mono text-[12px] tracking-[0.18em] text-white/90">{item.v}</p>
              <p className="mt-2 text-white/60 font-sans font-light text-[13px] leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
