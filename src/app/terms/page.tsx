import Link from "next/link";

export const metadata = {
  title: "Terms of Use | Vibestarter",
  description: "Terms of use for the Vibestarter platform",
};

export default function TermsPage() {
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
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4">Terms of Use</h1>
          <p className="text-muted text-sm mb-2">Version 2 &mdash; Last updated: April 2026</p>
          <p className="text-muted mb-8 leading-relaxed">
            These Terms of Use (&ldquo;Terms&rdquo;) govern your use of the Vibestarter platform. By connecting a wallet or
            otherwise using the platform you accept these Terms. Read them in conjunction with the{" "}
            <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>,{" "}
            <Link href="/risk-disclosure" className="text-accent hover:underline">Risk Disclosure</Link>,
            and (where applicable) the{" "}
            <a href="https://app.vibestarter.xyz/founder-terms" className="text-accent hover:underline">Founder Raise Terms</a>.
          </p>

          <div className="prose prose-invert prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">1. Operator and Contracting Party</h2>
              <p className="text-muted leading-relaxed mb-4">
                At the time of these Terms, Vibestarter does not yet have an incorporated operating entity. The platform is
                operated by an individual founder resident in Luxembourg, acting as promoter for a Luxembourg operating entity
                to be formed as soon as first positive cash flow permits. The promoter&apos;s identity and intent are recorded
                in a timestamped on-chain declaration.
              </p>
              <p className="text-muted leading-relaxed">
                By using the platform, you consent to the assignment of these Terms and any contractual rights or obligations
                arising under them to the successor Luxembourg entity upon its formation. You will not be required to re-accept
                these Terms solely by reason of that assignment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">2. What Vibestarter Is</h2>
              <p className="text-muted leading-relaxed">
                Vibestarter is a permissionless crowdfunding platform on the Base network. It provides infrastructure &mdash; smart
                contracts and an interface &mdash; for founders to launch time-released funding campaigns and for backers to
                contribute ETH in exchange for project tokens. Vibestarter is non-custodial: smart contracts hold contributions
                in escrow, and no operator holds a withdrawal key over your funds. All value-moving transactions are signed by
                your own wallet.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">3. Eligibility and Restricted Persons</h2>
              <p className="text-muted leading-relaxed mb-4">
                By using the platform, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li>You are at least 18 years old and legally able to enter into binding agreements in your jurisdiction.</li>
                <li>You are <strong className="text-white">not a United States person</strong> (as defined under Regulation S of the U.S. Securities Act of 1933, as amended) and are not acting for the account or benefit of any U.S. person.</li>
                <li>You are not resident in, a citizen of, or accessing the platform from any jurisdiction on the Vibestarter restricted-jurisdictions list, which presently includes: the United States, Cuba, Iran, North Korea (DPRK), Syria, the Crimea, Donetsk, and Luhansk regions of Ukraine, Russia, and China.</li>
                <li>You and any wallet you use are not subject to, or designated on, any applicable sanctions list (including OFAC SDN, EU Consolidated, UK OFSI, or equivalent).</li>
                <li>You accessed the platform on your own initiative and were not targeted by paid advertising or active solicitation by the operator in your jurisdiction.</li>
              </ul>
              <p className="text-muted leading-relaxed mt-4">
                The platform enforces these restrictions via IP-based geoblocking and on-chain wallet sanctions screening.
                Circumventing these controls (for example, by using a VPN) is a breach of these Terms; the operator bears no
                liability for consequences of such circumvention.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">4. Reverse Solicitation</h2>
              <p className="text-muted leading-relaxed">
                The platform is <strong className="text-white">not directed at</strong> residents of the European Union,
                the United States, or any other jurisdiction where access would require authorisation, registration, or
                disclosure that the operator has not obtained. If you access the platform from such a jurisdiction, you confirm
                that you are doing so on your own initiative and that the operator has not marketed the platform to you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">5. Nature of Activity &mdash; Not Financial Services</h2>
              <p className="text-muted leading-relaxed mb-4">
                The platform does not:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li>Custody client funds, fiat, or crypto-assets.</li>
                <li>Operate a trading platform, matching engine, or order book.</li>
                <li>Provide exchange, brokerage, clearing, or settlement services.</li>
                <li>Offer investment advice, portfolio management, or personalised recommendations.</li>
                <li>Hold any licence or authorisation as a credit institution, investment firm, crypto-asset service provider, payment institution, electronic-money institution, or collective-investment-scheme operator.</li>
              </ul>
              <p className="text-muted leading-relaxed mt-4">
                Contributions to raises on the platform are <strong className="text-white">not investments</strong>.
                Tokens received are not securities, not shares, and not deposits. No party guarantees their value, liquidity,
                or future utility. See the{" "}
                <Link href="/risk-disclosure" className="text-accent hover:underline">Risk Disclosure</Link>{" "}
                for detailed risk information.
              </p>
              <p className="text-muted leading-relaxed mt-4">
                Under EU Regulation 2023/1114 (MiCA), Article 4(2)(d), public offerings of crypto-assets whose total consideration
                in the Union is below &euro;1,000,000 over 12 months are exempt from the whitepaper publication requirement. Raises
                on the platform are conducted in reliance on that exemption (and other applicable exemptions).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">6. Data Screening</h2>
              <p className="text-muted leading-relaxed">
                By using the platform, you acknowledge and consent to on-chain sanctions screening of your wallet against the
                Chainalysis Sanctions Oracle. Wallets returning a positive match are blocked from all gated actions. Screening
                results, including blocks, are logged for audit purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">7. Funding Mechanics (Backers)</h2>
              <p className="text-muted leading-relaxed mb-4">
                When you contribute to a raise, you acknowledge:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li>Your contribution is held in a smart-contract escrow on Base. No operator holds a withdrawal key.</li>
                <li>If the raise succeeds, 15% of raised ETH and 15% of the token supply are added to an Aerodrome liquidity pool, and the LP tokens are permanently burned (sent to <code className="text-xs">0x000&hellip;dEaD</code>) &mdash; irrecoverable by any party.</li>
                <li>The remaining 85% of raised ETH is released to the founder over 6 months: 10% immediately, then 15% monthly, each tranche subject to a 72-hour challenge window during which backers holding sufficient supply may file a challenge.</li>
                <li>Project tokens allocated to backers are claimable immediately after raise finalisation via merkle proof.</li>
                <li>If the raise fails (does not reach its goal), you may claim a refund of your ETH contribution.</li>
                <li>If a challenge is upheld as malicious, the campaign may be frozen and backers may claim pro-rata refunds of unreleased ETH via merkle proof.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">8. Founder Responsibilities</h2>
              <p className="text-muted leading-relaxed">
                Founders launching raises on the platform are bound by the separate{" "}
                <a href="https://app.vibestarter.xyz/founder-terms" className="text-accent hover:underline">Founder Raise Terms</a>.
                Founders are solely responsible for their projects, their disclosures, and their compliance with applicable law.
                The operator does not verify, endorse, or guarantee any founder, project, or outcome beyond the technical and
                moderation checks described on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">9. Platform Fees</h2>
              <p className="text-muted leading-relaxed">
                The platform deducts a 2.5% fee from each ETH tranche payout to a founder (so the founder receives 97.5% of
                each tranche). There is no token-side fee on token supply. An optional flat launch fee (denominated in ETH)
                exists in the protocol and is currently disabled. These fees accrue to a platform multisig wallet on Base and
                are used solely for platform operations until the successor Luxembourg entity is formed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">10. Content Moderation</h2>
              <p className="text-muted leading-relaxed">
                The operator reserves the right to review, approve, moderate, hide, or remove raise listings on the platform
                for any reason consistent with platform rules, including but not limited to fraud, impersonation, illegal
                content, or sanctions risk. Moderation actions do not cure any underlying legal obligations the founder or
                their backers may have.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">11. No Investment Advice</h2>
              <p className="text-muted leading-relaxed">
                Nothing on the platform constitutes investment, financial, legal, or tax advice, or a recommendation to
                contribute to any raise. Information is provided for informational purposes only. You should consult qualified
                professionals before making any financial decisions. You are solely responsible for your own due diligence.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">12. Limitation of Liability</h2>
              <p className="text-muted leading-relaxed">
                To the maximum extent permitted by law, the operator and any successor entity shall not be liable for any
                direct, indirect, incidental, consequential, or punitive damages arising from your use of the platform,
                including without limitation loss of funds, loss of profits, smart-contract failures, or loss of data. The
                platform is provided &ldquo;as is&rdquo; without warranties of any kind. Nothing in this clause limits or
                excludes liability that cannot be limited or excluded under mandatory applicable law, including for gross
                negligence, fraud, or consumer-protection rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">13. Indemnity</h2>
              <p className="text-muted leading-relaxed">
                You agree to indemnify and hold harmless the operator and its successors from and against any claim, loss,
                liability, or expense (including reasonable legal fees) arising from your breach of these Terms, your breach
                of applicable law, your misuse of the platform, or your misrepresentation of your eligibility under &sect;3.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">14. Governing Law and Jurisdiction</h2>
              <p className="text-muted leading-relaxed">
                These Terms are governed by the laws of Luxembourg. Any dispute arising out of or in connection with these
                Terms shall be submitted to the competent courts of the District of Luxembourg, subject to any mandatory
                consumer-protection provisions applicable to your residence.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">15. Modifications</h2>
              <p className="text-muted leading-relaxed">
                The operator may modify these Terms. Material changes will be versioned and will require re-acceptance at the
                next platform action requiring a signature. Your prior signed acceptances remain on record.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">16. Contact</h2>
              <p className="text-muted leading-relaxed">
                For questions about these Terms, contact the operator on X (Twitter) at{" "}
                <a
                  href="https://x.com/vibestarterxyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  @vibestarterxyz
                </a>. For privacy / data-subject-rights requests see the{" "}
                <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
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
