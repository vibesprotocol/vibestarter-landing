"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface JournalPost {
  href: string;
  title: string;
  date: string; // "2026.08.17"
  cover?: string;
}

/**
 * The dispatch ledger — the blog's latest posts as an editorial index:
 * cover plate, serif title, mono date, hairline rules, and one boxed
 * mono call to the full archive. Server parent (EdJournal) fetches;
 * this renders and reveals. Deliberately unnumbered, like EdBuiltIn:
 * a quiet strip after the closer, not a chapter.
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
        <h2 data-jr className="font-serif font-normal tracking-[-0.01em] leading-[1.1] text-[clamp(26px,2.8vw,40px)] text-white">
          The latest from Vibestarter.
        </h2>

        <ul className="mt-7 sm:mt-9 border-t border-white/[0.1]">
          {posts.map((post) => (
            <li key={post.href} data-jr className="border-b border-white/[0.1]">
              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="group grid grid-cols-[96px_1fr] sm:grid-cols-[168px_1fr_auto] items-center gap-x-5 sm:gap-x-8 py-5 sm:py-6"
              >
                {post.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover}
                    alt=""
                    loading="lazy"
                    className="w-full aspect-[16/9] object-cover border border-white/[0.1] opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  />
                ) : (
                  <span aria-hidden className="w-full aspect-[16/9] border border-white/[0.08] bg-white/[0.02]" />
                )}
                <span className="min-w-0">
                  <span className="block font-serif font-normal tracking-[-0.01em] leading-[1.12] text-[clamp(20px,2.4vw,32px)] text-white group-hover:text-white group-hover:underline decoration-1 underline-offset-[6px] decoration-white/35 transition-colors duration-300">
                    {post.title}
                  </span>
                  <span className="mt-1.5 block sm:hidden font-mono text-[10px] tracking-[0.2em] text-white/50">
                    {post.date}
                  </span>
                </span>
                <span className="hidden sm:block font-mono text-[11px] tracking-[0.2em] text-white/50 group-hover:text-white/70 transition-colors whitespace-nowrap">
                  {post.date}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <a
          data-jr
          href={blogUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          data-scramble
          className="mt-6 sm:mt-8 flex items-center justify-center border border-white/[0.16] py-4 sm:py-5 font-mono text-[11px] sm:text-[12px] tracking-[0.28em] uppercase text-white/75 hover:text-white hover:bg-white/[0.04] transition-colors duration-300"
        >
          {">"} All dispatches
        </a>
      </div>
    </section>
  );
}
