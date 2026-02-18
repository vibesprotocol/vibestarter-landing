"use client";

import Link from "next/link";

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
  return (
    <footer className="bg-accent text-black">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Compact row: logo + 3 columns inline */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-10 mb-6">
          {/* Logo + tagline */}
          <div className="flex-shrink-0">
            <Link href="/" className="inline-flex items-center gap-1.5 font-display text-xl tracking-tight">
              <svg className="h-[0.7em]" viewBox="2 6 28 20" fill="none">
                <path
                  d="M4 8L14 16L4 24"
                  stroke="black"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 24H28"
                  stroke="black"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <span>Vibestarter</span>
            </Link>
            <p className="mt-1.5 text-black/50 text-[11px] font-mono max-w-[220px]">
              Time-released crowdfunding for vibecoded apps. Built on Base.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-3 gap-6 sm:gap-10 flex-1">
            <div>
              <h4 className="font-mono text-[10px] tracking-widest uppercase mb-2 text-black/40">
                [ SITEMAP ]
              </h4>
              <ul className="space-y-1">
                {sitemapLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-black/70 hover:text-black transition-colors text-xs font-sans"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[10px] tracking-widest uppercase mb-2 text-black/40">
                [ SOCIAL ]
              </h4>
              <ul className="space-y-1">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-black/70 hover:text-black transition-colors text-xs font-sans"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-mono text-[10px] tracking-widest uppercase mb-2 text-black/40">
                [ PLATFORM ]
              </h4>
              <ul className="space-y-1">
                {platformLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-black/70 hover:text-black transition-colors text-xs font-sans"
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
        </div>

        {/* Bottom bar — risk + copyright */}
        <div className="pt-4 border-t border-black/10">
          <p className="text-black/30 text-[10px] font-mono leading-relaxed mb-2">
            Risk Disclosure: Contributions are speculative and carry significant risk of total loss. Vibetokens are not securities. Not financial advice.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-black/40 text-[10px] font-mono">
            <span>&copy; 2026 Vibestarter. All rights reserved.</span>
            <span>Built on Base &mdash; the on-chain home of AI agents.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
