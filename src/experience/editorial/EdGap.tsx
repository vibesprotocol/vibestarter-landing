"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GapChasm, CHASM } from "./GapChasm";

gsap.registerPlugin(ScrollTrigger);

/**
 * 01 — THE GAP: the section IS the chasm (see GapChasm).
 *
 * The copy stands on the left plateau, the payoff statement on the right,
 * and the ground tears open between the two text columns. Vibecoded apps
 * march out from under the words and fall; scroll draws the VIBESTARTER
 * bridge across, and the funded ones park beneath the payoff line. This
 * shell positions the type on the terrain, reveals it, and feeds the chasm
 * its scroll progress. Reduced motion shows the resolved state.
 */
export function EdGap() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set("[data-gap-in]", { opacity: 1, y: 0 });
      // the mobile payoff shares the problem copy's slot — at rest the
      // problem stays; only the desktop plateau payoff paints in
      gsap.set("[data-gap-solution]:not([data-gap-m])", { opacity: 1 });
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

      // problem first, then the solution: the section is TALL and the stage
      // is sticky — the scrub runs across the pinned distance so the story
      // has time to play out. The payoff copy only exists once the bridge
      // is materialising. Both breakpoint stages exist in the DOM; the
      // hidden one has zero size and ignores the feed.
      const chasms = Array.from(
        section.querySelectorAll<HTMLElement & { __scroll?: (p: number) => void }>("[data-gap-chasm]")
      );
      const solutions = Array.from(section.querySelectorAll<HTMLElement>("[data-gap-solution]"));
      const problem = section.querySelector<HTMLElement>("[data-gap-problem]");
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          chasms.forEach((c) => c.__scroll?.(self.progress));
          const fill = Math.min(1, Math.max(0, self.progress / 0.92));
          const o = Math.min(1, Math.max(0, (fill - 0.48) / 0.22));
          for (const solution of solutions) {
            solution.style.opacity = String(o);
            solution.style.transform = `translateY(${(1 - o) * 14}px)`;
          }
          // on mobile the payoff takes the problem copy's slot — crossfade
          if (problem) problem.style.opacity = String(1 - o);
        },
      });
    }, section);

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, []);

  return (
    // tall section + sticky stage: the visual holds while ~1.6 viewports of
    // scroll play the story — problem, materialise, the one that crosses.
    // Mobile runs the SAME pinned story: copy up top, the chasm below it,
    // and the payoff takes the copy's slot once the bridge is materialising.
    <section ref={sectionRef} className="relative border-t border-white/[0.08] h-[220vh] sm:h-[260vh]">
      {/* mobile stage */}
      <div className="sm:hidden sticky top-0 h-[100svh] overflow-hidden">
        <GapChasm className="absolute inset-x-0 top-[270px] bottom-0" />

        {/* the problem — fades out as the bridge takes over the story */}
        <div data-gap-problem className="absolute inset-x-5 top-10">
          <p className="font-mono text-[11px] tracking-[0.32em] uppercase">
            <span className="text-accent">01</span>
            <span className="text-white/40"> — The gap</span>
          </p>
          <h2 className="mt-5 font-display font-bold tracking-[-0.04em] leading-[0.98] text-[34px] text-white">
            THIS IS THE <span className="text-accent">gap.</span>
          </h2>
          <p className="mt-4 text-muted font-sans font-light text-[14px] leading-relaxed">
            Anyone can ship an MVP in a weekend now. But between a working
            product and a funded company there is a chasm — and most solo
            builders fall into it. Not for lack of execution. For lack of a
            route across.
          </p>
        </div>

        {/* the payoff — arrives WITH the bridge, in the same slot */}
        <div data-gap-solution data-gap-m className="absolute inset-x-5 top-10" style={{ opacity: 0 }}>
          <p className="font-mono text-[11px] tracking-[0.32em] uppercase">
            <span className="text-accent">01</span>
            <span className="text-white/40"> — The route across</span>
          </p>
          <p className="mt-5 font-display font-bold tracking-[-0.03em] leading-[1.12] text-[26px] text-white">
            LAUNCHPAD SPEED<span className="text-white/35">.</span>{" "}
            <span className="text-accent">CONTRACT-ENFORCED ACCOUNTABILITY</span>
            <span className="text-white/35">.</span>
          </p>
          <p className="mt-4 font-mono text-[10px] tracking-[0.24em] uppercase text-white/40">
            The third rail — for the builders no one else funds
          </p>
        </div>
      </div>

      <div className="hidden sm:block sticky top-0">
        {/* the stage: terrain + type share one coordinate system */}
        <div ref={stageRef} className="relative mx-auto max-w-[1500px] w-full h-[max(700px,92vh)]">
        <GapChasm className="absolute inset-0" />

        {/* kicker */}
        <p data-gap-in className="absolute left-0 top-10 font-mono text-[11px] tracking-[0.32em] uppercase">
          <span className="text-accent">01</span>
          <span className="text-white/40"> — The gap</span>
        </p>

        {/* the copy stands on the LEFT PLATEAU */}
        <div
          data-gap-in
          className="absolute left-0 px-1"
          style={{ bottom: `calc(${(1 - CHASM.platformY) * 100}% + 74px)`, width: `${CHASM.leftEdge * 100 - 4}%` }}
        >
          <h2
            data-skew
            className="font-display font-bold tracking-[-0.04em] leading-[0.98] text-[clamp(30px,3.4vw,58px)] text-white will-change-transform"
          >
            THIS IS THE <span className="text-accent">gap.</span>
          </h2>
          <p className="mt-5 max-w-[480px] text-muted font-sans font-light text-[14px] sm:text-[15px] leading-relaxed">
            Anyone can ship an MVP in a weekend now. But between a working
            product and a funded company there is a chasm — and most solo
            builders fall into it. Not for lack of execution. For lack of a
            route across.
          </p>
        </div>

        {/* the payoff stands on the RIGHT PLATEAU — it arrives WITH the bridge */}
        <div
          data-gap-solution
          className="absolute right-0 text-right hidden sm:block"
          style={{ bottom: `calc(${(1 - CHASM.platformY) * 100}% + 48px)`, width: `${(1 - CHASM.rightEdge) * 100 - 3}%`, opacity: 0 }}
        >
          <p className="font-display font-bold tracking-[-0.03em] leading-[1.1] text-[clamp(18px,1.9vw,30px)] text-white">
            LAUNCHPAD SPEED<span className="text-white/35">.</span>
            <br />
            <span className="text-accent">CONTRACT-ENFORCED ACCOUNTABILITY</span>
            <span className="text-white/35">.</span>
          </p>
          <p className="mt-4 font-mono text-[9px] lg:text-[10px] tracking-[0.24em] uppercase text-white/40">
            The third rail — for the builders no one else funds
          </p>
        </div>

        </div>
      </div>
    </section>
  );
}
