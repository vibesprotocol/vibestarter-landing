"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CapsuleField } from "./CapsuleField";
import { ChapterHead } from "../ui/ChapterHead";

gsap.registerPlugin(ScrollTrigger);

const CALLOUTS = [
  { k: "Founder", v: "0x7f3a…e4b2", pos: "left-0 top-0 text-left" },
  { k: "ERC-8004 agent", v: "Claude Code · #1", pos: "right-0 top-0 text-right" },
  { k: "Build artifact", v: "transcript · SHA-256", pos: "left-0 bottom-0 text-left" },
  { k: "Chain", v: "Base · 8453", pos: "right-0 bottom-0 text-right" },
] as const;

type CapsuleHost = HTMLDivElement & {
  __seal?: (v: number) => void;
  __pulse?: (v: number) => void;
};

/**
 * 04 — provenance. The Origin Capsule as a constantly-scrambling ASCII field
 * (CapsuleField): the app's capsule technique — a pill of monospace cells
 * cycling charsets — given depth (cylindrical light, parallax layers, and
 * periodic resolution of real record fragments inside the pill). On enter a
 * bright seal wave sweeps left->right through the pill (__seal 0->1), then the
 * signature scrambles in and the callout connectors draw to the corners. The
 * record now lives inside the scramble itself, so there are no DOM rows.
 */
export function EdProvenance() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const visual = visualRef.current;
    if (!section || !visual) return;
    // Reduced motion: CapsuleField renders one static frame with the seal
    // locked and the record fragments shown resolved on its own; signature,
    // callouts, and connectors are visible in the markup default. Nothing to
    // animate.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // --- initial states ---
      gsap.set("[data-prov-callout]", { opacity: 0 });

      // --- copy reveals ---
      gsap.fromTo(
        "[data-prov-in]",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 72%", toggleActions: "play none none reverse" },
        }
      );

      // --- the seal: plays once. A bright wave sweeps left->right through the
      // pill (CapsuleField.__seal), resolving the outline to a solid ring and
      // flashing a green seam, then settling. Driven through the host setter
      // with a plain object + onUpdate — no setState in the update path.
      const capsule = visual.querySelector<CapsuleHost>("[data-capsule]");
      const drive = { seal: 0, pulse: 0 };
      const applyDrive = () => {
        capsule?.__seal?.(drive.seal);
        capsule?.__pulse?.(drive.pulse);
      };

      const seal = gsap.timeline({
        scrollTrigger: { trigger: visual, start: "top 65%", once: true },
      });
      // 1) the two halves slide shut + the shell hardens while the survey rings lock in
      seal.to(drive, { seal: 1, duration: 1.1, ease: "power3.inOut", onUpdate: applyDrive }, 0);
      // 2) a bright contour ring pulses outward from the sealed silhouette (one-shot)
      seal.fromTo(drive, { pulse: 0 }, { pulse: 1, duration: 1.0, ease: "power1.out", onUpdate: applyDrive }, 0.85);
      // 3) callouts fade in — their connectors are drawn through the mesh by CapsuleField
      seal.to("[data-prov-callout]", { opacity: 1, duration: 0.45, stagger: 0.12 }, 1.5);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} data-chapter="04" data-chapter-name="Provenance" className="relative py-16 sm:py-32 px-5 sm:px-10 border-t border-white/[0.08]">
      <div className="max-w-[1500px] mx-auto">
        {/* focal */}
        <ChapterHead index="04" name="Provenance" className="mb-6" />
        <h2
          data-prov-in
          data-skew
          className="font-serif font-normal tracking-[-0.015em] leading-[1.04] text-[clamp(36px,5vw,78px)] text-white"
        >
          Proof an agent built it.
        </h2>
        <p data-prov-in className="mt-6 max-w-[560px] text-muted font-sans font-light text-[15px] sm:text-base leading-relaxed">
          Every raise seals an Origin Capsule on Base at launch — the founder, the ERC-8004
          agent that wrote the code, and the build artifact, committed to an append-only
          registry. Not a claim. A cryptographic record.
        </p>

        {/* the capsule — a constantly-scrambling ASCII pill; record fragments
            resolve inside the scramble itself, so there are no DOM rows */}
        <div
          ref={visualRef}
          className="relative mt-8 sm:mt-12 mb-4 h-[420px] sm:h-[600px]"
          role="img"
          aria-label="The Origin Capsule: a glass cylinder with its cryptographic record — founder, ERC-8004 agent, transcript hash, chain — engraved around the surface, its hash stamped beneath it. It sits at the centre of a living blockchain node network: nodes linked into a mesh with blocks pulsing along the edges toward the capsule, and the four record components wired in through the network. On entry the two halves slide shut, the shell hardens, and a pulse converges as it seals."
        >
          <CapsuleField />

          {/* corner callouts — the connectors to them are drawn THROUGH the mesh
              by CapsuleField, so there are no straight leader lines here */}
          {CALLOUTS.map((c) => (
            <div key={c.k} data-prov-callout className={`absolute ${c.pos} hidden sm:block`}>
              <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-white/55">{c.k}</p>
              <p className="mt-1 font-mono text-[13px] text-white">{c.v}</p>
            </div>
          ))}
        </div>

        {/* supporting row */}
        <div className="mt-2 text-center">
          <p data-prov-in className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/50">
            ERC-8004 agent registry · 34+ registered agents · append-only · independently verifiable
          </p>
          <p data-prov-in className="mt-3 font-mono text-[10px] tracking-[0.18em] uppercase text-accent">
            No other launchpad can prove how the thing was built.
          </p>
        </div>
      </div>
    </section>
  );
}
