"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Crosshair() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
      <path d="M4 0V8" stroke="currentColor" />
      <path d="M8 4H0" stroke="currentColor" />
    </svg>
  );
}

/**
 * Fixed instrument chrome the page scrolls through — chevron top-left,
 * chain tag top-right, live chapter readout bottom-left, scroll-progress
 * hairline bottom-right. Pure overlay: pointer-events-none, aria-hidden,
 * transforms/opacity only. Appears once the hero is passed, stands down
 * over the green footer (white chrome would fight the inverted surface).
 * Desktop only — phones keep their corners.
 */
export function HudFrame() {
  const rootRef = useRef<HTMLDivElement>(null);
  const readoutIndexRef = useRef<HTMLSpanElement>(null);
  const readoutNameRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const fill = fillRef.current;
    if (!root || !fill) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // -- visibility: past the hero AND not over the footer
    let heroPassed = false;
    let footerInView = false;
    let shown = false;
    const applyVisibility = () => {
      const next = heroPassed && !footerInView;
      if (next === shown) return;
      shown = next;
      if (reduced) {
        root.style.opacity = next ? "1" : "0";
      } else {
        gsap.to(root, { opacity: next ? 1 : 0, duration: 0.4, ease: "power2.out", overwrite: true });
      }
    };

    // -- chapter readout follows whichever [data-chapter] section holds the
    //    middle of the viewport
    let current = "";
    const setReadout = (index: string, name: string) => {
      if (index === current) return;
      current = index;
      const iEl = readoutIndexRef.current;
      const nEl = readoutNameRef.current;
      if (!iEl || !nEl) return;
      iEl.textContent = index;
      nEl.textContent = ` — ${name}`;
      if (!reduced) {
        gsap.fromTo(
          [iEl, nEl],
          { yPercent: 110 },
          { yPercent: 0, duration: 0.45, ease: "power3.out", overwrite: true }
        );
      }
    };

    const ctx = gsap.context(() => {
      const setFill = gsap.quickSetter(fill, "scaleX");
      ScrollTrigger.create({
        start: () => window.innerHeight * 0.75,
        end: "max",
        onToggle: (self) => {
          heroPassed = self.isActive;
          applyVisibility();
        },
        onUpdate: (self) => setFill(self.progress),
      });

      const footer = document.querySelector("footer");
      if (footer) {
        ScrollTrigger.create({
          trigger: footer,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            footerInView = self.isActive;
            applyVisibility();
          },
        });
      }

      document.querySelectorAll<HTMLElement>("[data-chapter]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) setReadout(el.dataset.chapter ?? "", el.dataset.chapterName ?? "");
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 hidden md:block"
      style={{ opacity: 0 }}
    >
      {/* top-left — the mark, docked to the frame */}
      <div className="absolute top-6 left-5 sm:left-10">
        <svg className="h-[11px] w-auto text-accent" viewBox="2 6 28 20" fill="none">
          <path d="M4 8L14 16L4 24" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
          <path d="M16 24H28" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
        </svg>
      </div>

      {/* top-right — chain tag + registration mark */}
      <div className="absolute top-6 right-5 sm:right-10 flex items-center gap-3 text-white/40">
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/45">Base · 8453</span>
        <Crosshair />
      </div>

      {/* bottom-left — live chapter readout */}
      <div className="absolute bottom-6 left-5 sm:left-10 overflow-hidden">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase leading-none">
          <span ref={readoutIndexRef} className="inline-block text-accent will-change-transform" />
          <span ref={readoutNameRef} className="inline-block text-white/60 will-change-transform" />
        </p>
      </div>

      {/* bottom-right — registration mark + document progress */}
      <div className="absolute bottom-6 right-5 sm:right-10 flex items-center gap-3 text-white/40">
        <Crosshair />
        <span className="relative block h-px w-7 bg-white/15">
          <span
            ref={fillRef}
            className="absolute inset-y-0 left-0 w-full bg-accent origin-left will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </span>
      </div>
    </div>
  );
}
