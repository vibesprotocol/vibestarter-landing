import Link from "next/link";

const footerLinks = {
  founders: [
    { label: "Launch Vibetoken", href: "https://app.vibestarter.xyz" },
  ],
  backers: [
    { label: "Explore Raises", href: "https://app.vibestarter.xyz" },
  ],
  resources: [
    { label: "Documentation", href: "https://www.vibestarter.xyz/docs" },
    { label: "Github", href: "https://github.com/vibesprotocol/vibes-protocol" },
  ],
};

const socialLinks = [
  {
    label: "X (Twitter)",
    href: "https://x.com/vibestarterxyz",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Github",
    href: "https://github.com/vibesprotocol/vibes-protocol",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-12 sm:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Disclaimer */}
        <div className="bg-white/[0.02] border border-border rounded-lg p-4 sm:p-6 mb-12 sm:mb-16">
          <p className="text-muted/80 text-[13px] sm:text-[14px] leading-relaxed">
            <span className="text-white/90 font-medium">Disclaimer:</span> Backing projects on Vibestarter does not guarantee any return on investment. Vibetokens are speculative and may lose value. Early-stage projects carry significant risk — only back what you can afford to lose. Vibestarter does not provide financial advice.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 sm:mb-6">
              <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="white" />
                <path
                  d="M10 16l4 4 8-8"
                  stroke="black"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-semibold text-[15px]">Vibestarter</span>
            </Link>
            <p className="text-muted text-[13px] sm:text-[14px] max-w-xs mb-6">
              Milestone-based fundraising for vibecoded apps. Built on Base.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-muted hover:text-white transition-colors"
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Founders */}
          <div>
            <h4 className="text-[11px] text-muted uppercase tracking-wider mb-4">
              Founders
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-[13px] sm:text-[14px]">
              {footerLinks.founders.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Backers */}
          <div>
            <h4 className="text-[11px] text-muted uppercase tracking-wider mb-4">
              Backers
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-[13px] sm:text-[14px]">
              {footerLinks.backers.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[11px] text-muted uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2 sm:space-y-3 text-[13px] sm:text-[14px]">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-muted">
            <span>Built on</span>
            <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
              <rect width="100" height="100" rx="20" fill="#0052FF"/>
            </svg>
            <span className="text-[#0052FF] font-medium">Base</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-[12px] sm:text-[13px] text-muted">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span>© 2025 Vibestarter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
