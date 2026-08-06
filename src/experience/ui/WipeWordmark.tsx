"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface WipeWordmarkProps {
  text: string;
  className?: string;
  /** "load" plays on mount; "scroll" waits for the wordmark to enter view */
  trigger?: "load" | "scroll";
  delay?: number;
}

/** each letter arrives from its own axis — below, left, above, right */
const FROM = [{ yPercent: 105 }, { xPercent: -105 }, { yPercent: -105 }, { xPercent: 105 }];

/**
 * Wordmark whose letters wipe in from mixed axes inside overflow-hidden
 * cells. The cells keep their intrinsic width from first paint, so the
 * lockup never reflows — transforms only move the glyph inside its clip.
 * Markup rests in the final state (SSR/no-JS/reduced-motion safe); the
 * cells carry the same descender-padding trick as the hero line wrappers.
 */
export function WipeWordmark({ text, className, trigger = "load", delay = 0 }: WipeWordmarkProps) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = root.querySelectorAll<HTMLElement>("[data-ww]");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: trigger === "load" ? delay : 0,
        scrollTrigger:
          trigger === "scroll"
            ? { trigger: root, start: "top 88%", toggleActions: "play none none reverse" }
            : undefined,
      });
      letters.forEach((el, i) => {
        tl.fromTo(
          el,
          FROM[i % FROM.length],
          { xPercent: 0, yPercent: 0, duration: 0.7, ease: "power4.out" },
          i * 0.035
        );
      });
    }, root);

    return () => ctx.revert();
  }, [text, trigger, delay]);

  return (
    <span ref={rootRef} className={`inline-flex ${className ?? ""}`} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.06em] -mb-[0.06em]">
          <span data-ww className="inline-block will-change-transform">
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}
