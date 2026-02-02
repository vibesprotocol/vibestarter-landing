"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export function ClosingCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="text-center max-w-2xl mx-auto">
          <p className="section-label mb-4">04 / Launch</p>
          <h2 className="heading-display text-white mb-4">
            READY TO RAISE?
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">
            Launch your Vibetoken and start raising in minutes — escrow-backed, time-released, on-chain.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Link
              href="https://app.vibestarter.xyz"
              className="btn-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-medium text-[15px] text-center"
            >
              Launch Your Raise
            </Link>
            <Link
              href="https://app.vibestarter.xyz"
              className="btn-secondary px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-medium text-[15px] text-center"
            >
              View Raises
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
