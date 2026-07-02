import Link from "next/link";

const LINK_GROUPS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "PROTOCOL",
    links: [
      { label: "Whitepaper", href: "/whitepaper" },
      { label: "Thesis", href: "/thesis" },
      { label: "Contracts", href: "https://github.com/vibesprotocol/vibestarter-contracts", external: true },
    ],
  },
  {
    title: "PLATFORM",
    links: [
      { label: "Launch App", href: "https://app.vibestarter.xyz", external: true },
      { label: "Explore Raises", href: "https://app.vibestarter.xyz/raises", external: true },
      { label: "Docs", href: "https://app.vibestarter.xyz/docs", external: true },
    ],
  },
  {
    title: "SOCIALS",
    links: [
      { label: "X / Twitter", href: "https://x.com/vibestarterxyz", external: true },
      { label: "Discord", href: "https://discord.gg/Kfpj89bu82", external: true },
      { label: "Telegram", href: "https://t.me/Vibestarter_xyz", external: true },
      { label: "GitHub", href: "https://github.com/vibesprotocol/vibestarter-contracts", external: true },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Risk Disclosure", href: "/risk-disclosure" },
    ],
  },
];

/**
 * The green block. Brand inversion kept; everything else rebuilt — a single
 * oversized wordmark row, a flat link grid, the load-bearing disclosure.
 */
export function FooterNew() {
  return (
    <footer className="relative z-10 bg-accent text-black">
      <div className="px-5 sm:px-8 py-14 sm:py-20">
        <div className="max-w-[1400px] mx-auto">
          {/* wordmark row */}
          <div className="flex items-end justify-between gap-6 border-b-2 border-black/15 pb-10 sm:pb-14">
            <Link href="/" className="inline-flex items-center gap-[0.14em]">
              <svg
                className="h-[0.7em] w-auto"
                style={{ fontSize: "clamp(40px, 9vw, 120px)" }}
                viewBox="2 6 28 20"
                fill="none"
                aria-hidden
              >
                <path d="M4 8L14 16L4 24" stroke="black" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
                <path d="M16 24H28" stroke="black" strokeWidth="3" strokeLinecap="square" />
              </svg>
              <span className="font-display font-bold tracking-[-0.04em] text-[clamp(40px,9vw,120px)] leading-none">
                Vibestarter
              </span>
            </Link>
            <p className="hidden md:block font-mono text-[11px] tracking-[0.24em] uppercase text-black/55 text-right leading-relaxed">
              Capital releases over time.
              <br />
              Backers can pause it.
              <br />
              Liquidity is permanent.
            </p>
          </div>

          {/* links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 py-10 sm:py-14">
            {LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <h4 className="font-mono text-[10px] tracking-[0.3em] uppercase text-black/45 mb-4">
                  {group.title}
                </h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="font-sans text-[15px] text-black/75 hover:text-black transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* disclosure */}
          <div className="border-t border-black/15 pt-6">
            <p className="font-mono text-[10px] sm:text-[11px] leading-relaxed text-black/45 max-w-4xl">
              Vibestarter is a crowdfunding platform. Tokens obtained through Vibestarter are
              utility tokens intended for use within their respective project ecosystems.
              Contributing to a raise is not an investment and does not constitute purchasing a
              security. Past performance of projects on this platform does not guarantee future
              results. Contributors should only contribute amounts they can afford to lose
              entirely.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[10px] sm:text-[11px] text-black/50">
              <span>© 2026 Vibestarter. All rights reserved.</span>
              <span>Built on Base — the on-chain home of AI agents.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
