"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const sitemapLinks = [
  { label: "Home", href: "/" },
  { label: "Thesis", href: "/thesis" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

const socialLinks = [
  { label: "X / Twitter", href: "https://x.com/vibestarterxyz" },
  { label: "GitHub", href: "https://github.com/vibesprotocol/vibestarter-contracts" },
];

const platformLinks = [
  { label: "Launch App", href: "https://app.vibestarter.xyz" },
  { label: "Documentation", href: "https://app.vibestarter.xyz/docs" },
  { label: "Contracts", href: "https://github.com/vibesprotocol/vibestarter-contracts" },
];

export function Footer() {
  const { ref: logoRef, isVisible: logoVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <footer className="bg-background text-white border-t border-accent/40">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* Large logo with scroll animation */}
        <div ref={logoRef} className="mb-12 sm:mb-16">
          <div
            className={`${
              logoVisible
                ? "opacity-100"
                : "opacity-0"
            }`}
            style={logoVisible ? { animation: "hard-cut-in 0.3s ease-out forwards" } : undefined}
          >
            <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              <svg className="h-[0.7em]" viewBox="2 6 28 20" fill="none">
                <path
                  d="M4 8L14 16L4 24"
                  stroke="#91D982"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 24H28"
                  stroke="#91D982"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="font-display"
                style={{
                  WebkitTextStroke: "1px #91D982",
                  color: "transparent",
                }}
              >
                Vibestarter
              </span>
            </Link>
            <p className="mt-4 text-white/50 text-base sm:text-lg font-sans font-light max-w-md">
              Time-released crowdfunding for vibecoded apps. Built on Base.
            </p>
          </div>
        </div>

        {/* Multi-column layout with bracket-style labels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Sitemap */}
          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase mb-4 text-white/30">
              // SITEMAP
            </h4>
            <ul className="space-y-2">
              {sitemapLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-accent transition-colors text-sm font-sans"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase mb-4 text-white/30">
              // SOCIAL
            </h4>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-accent transition-colors text-sm font-sans"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-mono text-xs tracking-widest uppercase mb-4 text-white/30">
              // PLATFORM
            </h4>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-accent transition-colors text-sm font-sans"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar: risk disclosure + copyright */}
        <div className="pt-6 border-t border-white/[0.06]">
          <p className="text-white/25 text-[11px] sm:text-xs font-mono leading-relaxed mb-4">
            Risk Disclosure: Contributions are speculative and carry significant risk of total loss. Vibetokens are not securities. Not financial advice. Only participate with funds you can afford to lose.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-white/30 text-[11px] sm:text-xs font-mono">
            <span>&copy; 2026 Vibestarter. All rights reserved.</span>
            <span>Built on Base &mdash; the on-chain home of AI agents.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
