"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Gap3D } from "./Gap3D";

gsap.registerPlugin(ScrollTrigger);

/**
 * 01 — THE GAP, as a 3D scatter (a Magic Quadrant grown a third axis).
 *
 * TIME × TRUST × TERMS, plotted in a real wireframe cube (see Gap3D). The section
 * is a thin shell: it reveals the copy, fades the plot in, and feeds the cube its
 * scroll progress so the view turns ~36° as you pass — resolving the depth axis
 * without a mouse or an auto-spin. VIBESTARTER is the lone point that wins on all
 * three axes: the gap. Reduced motion shows the static, readable frame.
 */
export function EdGap() {
  const sectionRef = useRef<HTMLElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const plot = plotRef.current;
    if (!section || !plot) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set("[data-gap-in]", { opacity: 1, y: 0 });
      gsap.set("[data-gap-bridge]", { opacity: 1, y: 0 });
      gsap.set(plot, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-gap-in]",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 72%", toggleActions: "play none none reverse" },
        }
      );
      gsap.fromTo(
        plot,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 66%", toggleActions: "play none none reverse" },
        }
      );

      // feed the cube its scroll progress → it turns to resolve the depth axis
      const g3 = plot.querySelector("[data-g3-host]") as (HTMLElement & { __scroll?: (p: number) => void }) | null;
      if (g3?.__scroll) {
        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => g3.__scroll?.(self.progress),
        });
      }

      gsap.fromTo(
        "[data-gap-bridge]",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-gap-bridge]", start: "top 88%", toggleActions: "play none none reverse" },
        }
      );
    }, section);

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 px-5 sm:px-10 border-t border-white/[0.08]">
      <div className="max-w-[1500px] mx-auto">
        {/* focal */}
        <p data-gap-in className="font-mono text-[11px] tracking-[0.32em] uppercase mb-6">
          <span className="text-accent">01</span>
          <span className="text-white/40"> — The gap</span>
        </p>
        <h2
          data-gap-in
          data-skew
          className="font-display font-bold tracking-[-0.04em] leading-[0.98] text-[clamp(40px,6.4vw,96px)] text-white will-change-transform"
        >
          THIS IS THE <span className="text-accent">gap.</span>
        </h2>
        <p data-gap-in className="mt-6 max-w-[600px] text-muted font-sans font-light text-[15px] sm:text-base leading-relaxed">
          Every way to fund a solo builder forces a trade across three axes — how
          fast the money comes, how much the founder stays accountable, and how
          good the terms are. Win two and you lose the third. One corner is empty.
        </p>

        {/* THE 3D SCATTER — time × trust × terms in a wireframe cube */}
        <div ref={plotRef} className="relative mt-12 sm:mt-14 w-full select-none" style={{ aspectRatio: "1000 / 700" }}>
          <Gap3D className="absolute inset-0" />
        </div>

        {/* the pivot */}
        <div data-gap-bridge className="mt-12 sm:mt-16 text-center">
          <p className="font-display font-bold tracking-[-0.035em] leading-[1.12] text-[clamp(26px,3.8vw,54px)] text-white max-w-4xl mx-auto">
            LAUNCHPAD SPEED<span className="text-white/35">.</span>{" "}
            <span className="text-accent">CONTRACT-ENFORCED ACCOUNTABILITY</span>
            <span className="text-white/35">.</span>
          </p>
          <p className="mt-5 font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-white/40">
            That&apos;s the third rail — built for vibecoding founders
          </p>
        </div>
      </div>
    </section>
  );
}
