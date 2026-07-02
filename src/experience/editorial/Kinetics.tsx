"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

/**
 * Page-wide kinetic layer: scroll-velocity skew on display type, character
 * scramble on hover labels, fine static grain, dev hook.
 */
export function Kinetics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>).__vibex = { gsap, ScrollTrigger };
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // display type leans with scroll velocity
    const skewEls = gsap.utils.toArray<HTMLElement>("[data-skew]");
    const proxy = { skew: 0 };
    const setSkew = gsap.quickSetter(skewEls, "skewX", "deg");
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-4, 4, self.getVelocity() / -400);
        if (Math.abs(v) > Math.abs(proxy.skew)) {
          proxy.skew = v;
          gsap.to(proxy, {
            skew: 0,
            duration: 0.75,
            ease: "power3.out",
            overwrite: true,
            onUpdate: () => setSkew(proxy.skew),
          });
        }
      },
    });

    // mono labels scramble on hover
    const scrambles: Array<() => void> = [];
    gsap.utils.toArray<HTMLElement>("[data-scramble]").forEach((el) => {
      const original = el.textContent ?? "";
      const onEnter = () => {
        gsap.to(el, {
          duration: 0.55,
          scrambleText: { text: original, chars: "01<>$#%", speed: 1.2 },
        });
      };
      el.addEventListener("mouseenter", onEnter);
      scrambles.push(() => el.removeEventListener("mouseenter", onEnter));
    });

    return () => {
      st.kill();
      scrambles.forEach((fn) => fn());
    };
  }, []);

  return <div aria-hidden className="ed-grain" />;
}
