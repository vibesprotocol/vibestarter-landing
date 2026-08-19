"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface JournalPost {
  href: string;
  title: string;
  description: string;
  date: string; // "2026.08.17"
}

/**
 * The dispatch ledger — the blog's latest posts as hairline-ruled index rows,
 * not cards. Server parent (EdJournal) fetches; this renders and reveals.
 * Deliberately unnumbered, like EdBuiltIn: a quiet strip, not a chapter.
 */
export function JournalIndex({ posts, blogUrl }: { posts: JournalPost[]; blogUrl: string }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-jr]",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 85%", toggleActions: "play none none reverse" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative border-t border-white/[0.08] px-5 sm:px-10 py-14 sm:py-24">
      <div className="max-w-[1500px] mx-auto">
        <div data-jr className="flex items-baseline justify-between gap-6">
          <p className="font-mono text-[11px] tracking-[0.32em] uppercase">
            <span className="text-accent">Dispatches</span>
            <span className="text-white/40"> — live from the blog</span>
          </p>
          <a
            href={blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            data-scramble
            className="ed-link font-mono text-[11px] tracking-[0.22em] uppercase text-white/50 hover:text-white transition-colors whitespace-nowrap"
          >
            All posts ↗
          </a>
        </div>

        <ul className="mt-6 sm:mt-8 border-t border-white/[0.08]">
          {posts.map((post) => (
            <li key={post.href} data-jr className="border-b border-white/[0.08]">
              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="group grid grid-cols-1 sm:grid-cols-[150px_1fr_auto] items-baseline gap-x-8 gap-y-1.5 py-5 sm:py-7"
              >
                <span className="font-mono text-[11px] tracking-[0.2em] text-white/35 group-hover:text-white/60 transition-colors">
                  {post.date}
                </span>
                <span className="min-w-0">
                  <span className="block font-display font-bold tracking-[-0.02em] leading-[1.1] text-[19px] sm:text-[clamp(20px,2.2vw,30px)] text-white group-hover:text-accent transition-colors duration-300">
                    {post.title}
                  </span>
                  {post.description && (
                    <span className="hidden md:block mt-2 max-w-[720px] text-white/45 font-sans font-light text-[13px] leading-relaxed line-clamp-2">
                      {post.description}
                    </span>
                  )}
                </span>
                <span
                  aria-hidden
                  className="hidden sm:block font-mono text-[15px] text-white/25 group-hover:text-accent transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
