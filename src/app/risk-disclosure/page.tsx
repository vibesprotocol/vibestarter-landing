import Link from "next/link";

export const metadata = {
  title: "Risk Disclosure | Vibestarter",
  description: "Risks of using the Vibestarter platform and contributing to raises",
};

export default function RiskDisclosurePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-blur bg-[#0A0A0A]/90 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-[0.14em]">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 32 32" fill="none">
              <path
                d="M4 8L14 16L4 24"
                stroke="#91D982"
                strokeWidth="3"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
              <path
                d="M16 24H28"
                stroke="#91D982"
                strokeWidth="3"
                strokeLinecap="square"
              />
            </svg>
            <span className="font-semibold text-sm sm:text-[15px] tracking-tight">
              Vibestarter
            </span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4">Risk Disclosure</h1>
          <p className="text-muted mb-8">Version 1 · Last updated: April 2026</p>

          <div className="prose prose-invert prose-gray max-w-none space-y-8">
            <section>
              <p className="text-muted leading-relaxed">
                This document describes the principal risks of using the Vibestarter platform and contributing to raises on it.
                It is not exhaustive. Read it in full before you contribute. If any of these risks would be intolerable to you,
                do not use the platform.
              </p>
              <p className="text-muted leading-relaxed mt-4">
                Contributing to a raise is <strong className="text-white">not an investment</strong>. It is a
                contribution in exchange for project tokens of speculative and potentially zero value. No deposit protection
                scheme applies. No investor-compensation scheme applies. The operator is not authorised or supervised by any
                financial regulator.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">1. Total Loss Risk</h2>
              <p className="text-muted leading-relaxed">
                You may lose all funds you contribute. Early-stage projects fail at high rates. Tokens you receive may decline
                to zero value. Contribute only amounts you can afford to lose entirely.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">2. No Guaranteed Value or Utility</h2>
              <p className="text-muted leading-relaxed">
                Tokens issued through raises on the platform have no guaranteed market price, liquidity, utility, or future
                functionality. Founders may describe intended utility at launch but are not obligated to deliver specific
                outcomes beyond what the smart contracts enforce. Market conditions, founder execution, and external factors
                may render tokens worthless.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">3. Illiquidity</h2>
              <p className="text-muted leading-relaxed">
                Tokens may be difficult or impossible to sell. The liquidity pool created at raise finalisation is
                <strong className="text-white"> permanently locked</strong> in a contract with no withdraw function; it
                cannot be withdrawn or migrated by any party. Trading volume may be nil. Depth may be insufficient to exit
                without significant slippage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">4. Smart Contract Risk</h2>
              <p className="text-muted leading-relaxed">
                The platform depends on smart contracts deployed on the Base network. Despite audits and testing, contracts may
                contain bugs, vulnerabilities, or unintended behaviours that could result in loss of funds, stuck funds, or
                incorrect distribution. The operator does not guarantee the absence of defects. Audits reduce but do not
                eliminate risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">5. Wallet and Key Management Risk</h2>
              <p className="text-muted leading-relaxed">
                You are solely responsible for the security of your wallet, private keys, and seed phrases. The operator
                cannot recover lost keys, reverse phishing attacks, or refund funds stolen by malware. Use hardware wallets
                where possible; never share your seed phrase.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">6. Founder Execution Risk</h2>
              <p className="text-muted leading-relaxed">
                Raises release funds to founders in time-based tranches, not milestone-based. Founders are not obliged to
                deliver any specific product, reach any roadmap milestone, or maintain activity during the 6-month tranche
                release window. The challenge system allows backers to raise concerns during 72-hour windows before each
                tranche, but challenges are adjudicated by the operations admin with operational discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">7. Challenge System Limitations</h2>
              <p className="text-muted leading-relaxed mb-4">
                The challenge system has constraints you should understand:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li>Only backers holding a minimum supply threshold (0.25&ndash;1.00%, graduated) can file a challenge.</li>
                <li>A challenge requires a slashable stake; if rejected, a portion (20%) of the challenger&apos;s stake is burned.</li>
                <li>Outcomes are adjudicated by the operations admin, a platform-controlled key, using operational judgement, not automated rules.</li>
                <li>An upheld-malicious challenge freezes remaining tranches but does not retroactively recover previously released tranches.</li>
                <li>There is no appeals process.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">8. Operator Conflict of Interest</h2>
              <p className="text-muted leading-relaxed">
                The operator moderates campaigns, adjudicates challenges, and receives platform fees from all raises.
                These roles create inherent conflicts of interest.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">9. No Entity, No Licence</h2>
              <p className="text-muted leading-relaxed">
                At the time of this disclosure, no incorporated operating entity exists for Vibestarter. The platform is
                operated by an individual promoter personally, with the intent to form a Luxembourg entity as soon as financial
                conditions permit. The operator holds no licence or authorisation as a crypto-asset service provider,
                investment firm, credit institution, or payment institution. You contract with the individual promoter,
                subject to migration to the successor entity on formation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">10. Regulatory Uncertainty</h2>
              <p className="text-muted leading-relaxed">
                The legal and tax treatment of crypto-assets, token offerings, and crowdfunding varies by jurisdiction and is
                evolving. Laws or interpretations applicable to the platform, the tokens, or your contribution may change at
                any time. Such changes could reduce or eliminate token value, prevent platform access, or create tax or
                reporting obligations for you. You are responsible for understanding and complying with the rules applicable
                in your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">11. Restricted Jurisdictions</h2>
              <p className="text-muted leading-relaxed">
                The platform geoblocks certain jurisdictions (see{" "}
                <Link href="/terms" className="text-accent hover:underline">Terms &sect;3</Link>). Circumventing the
                block is a breach of the Terms and may expose you to personal legal risk in your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">12. Network and Infrastructure Risk</h2>
              <p className="text-muted leading-relaxed">
                The platform depends on the Base network, RPC providers, Aerodrome DEX, Chainalysis oracle, and other external
                infrastructure. Outages, reorgs, bridge failures, or hacks at any of these layers could disrupt platform
                operation, delay tranche releases, prevent claims, or affect token trading.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">13. Market Manipulation Risk</h2>
              <p className="text-muted leading-relaxed">
                Secondary trading of tokens issued via raises occurs on permissionless DEXes. Pump-and-dump patterns, wash
                trading, coordinated manipulation, and large-holder actions can cause rapid price movements. The platform does
                not surveil or police secondary-market behaviour.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">14. Tax</h2>
              <p className="text-muted leading-relaxed">
                Contributions, token receipts, tranche payouts, airdrops, and sales may create tax reporting or liability
                obligations in your jurisdiction. The platform does not provide tax advice. Consult a qualified adviser.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">15. No Advice</h2>
              <p className="text-muted leading-relaxed">
                Nothing on the platform is investment, legal, tax, or financial advice. Information is provided for general
                informational purposes. Conduct your own due diligence or consult qualified professionals.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">16. Changes</h2>
              <p className="text-muted leading-relaxed">
                This Risk Disclosure may be updated. Material changes will be versioned and require re-acceptance.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <Link href="/" className="text-muted hover:text-white transition-colors text-sm">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
