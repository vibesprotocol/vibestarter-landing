import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Vibestarter",
  description: "Privacy Policy for the Vibestarter platform",
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4">Privacy Policy</h1>
          <p className="text-muted mb-8">Version 1 · Last updated: April 2026</p>

          <div className="prose prose-invert prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">1. Data Controller</h2>
              <p className="text-muted leading-relaxed">
                At the time of this Policy, Vibestarter does not yet have an incorporated operating entity. The data controller
                is an individual founder resident in Luxembourg, acting as promoter for a Luxembourg operating entity to be
                formed. Upon formation, the controller role will pass to that entity; you will be notified of any material
                change to the identity of the controller.
              </p>
              <p className="text-muted leading-relaxed mt-4">
                For all data-subject-rights requests and privacy questions, contact:{" "}
                <a
                  href="mailto:privacy@vibestarter.xyz"
                  className="text-accent hover:underline"
                >
                  privacy@vibestarter.xyz
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">2. What Data We Process</h2>
              <p className="text-muted leading-relaxed mb-4">
                We process the following categories of personal data:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li><strong className="text-white">Wallet addresses</strong> (primary identifier) and the on-chain activity associated with them on the Base network.</li>
                <li><strong className="text-white">X (Twitter) handle, numeric ID, and signature-proof of ownership</strong> where you link an X account.</li>
                <li><strong className="text-white">GitHub username, commit count, organisation memberships, and repository URL</strong> for founder applications.</li>
                <li><strong className="text-white">Ethos reputation score</strong> cached from the public Ethos API.</li>
                <li><strong className="text-white">Farcaster FID</strong> where you link a Farcaster account.</li>
                <li><strong className="text-white">Contribution amounts, transaction hashes, and tokens allocated</strong> for raises you participate in.</li>
                <li><strong className="text-white">Founder application content:</strong> project name, tagline, description, website URL, repository URL, funding range, AI tool used.</li>
                <li><strong className="text-white">Legal acceptance records:</strong> wallet, agreement ID + version + hash, wallet signature, hashed IP, user-agent string.</li>
                <li><strong className="text-white">Sanctions screening audit log:</strong> wallet, screening outcome (clear / sanctioned / skipped / error), source, oracle address, chain ID.</li>
                <li><strong className="text-white">Starter Card data:</strong> composite score, level (1&ndash;5), referral code, quest completion state.</li>
                <li><strong className="text-white">Session and authentication data</strong> via Privy (our authentication provider).</li>
                <li><strong className="text-white">Request metadata</strong> captured by Vercel edge infrastructure (including IP address, user agent) for security and abuse prevention. IPs are not linked to user profiles in our database; where we store them for legal-acceptance audit purposes, they are hashed.</li>
              </ul>
              <p className="text-muted leading-relaxed mt-4">
                <strong className="text-white">We do not collect:</strong> email addresses (except for the privacy contact above, which receives mail but does not feed into platform accounts), legal names, dates of birth, government ID documents, home addresses, or phone numbers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">3. Lawful Bases</h2>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li><strong className="text-white">Performance of a contract (GDPR Art. 6(1)(b)):</strong> wallet-level platform operations, legal-acceptance signatures, founder application processing.</li>
                <li><strong className="text-white">Legitimate interests (Art. 6(1)(f)):</strong> security, abuse and Sybil prevention, sanctions screening, audit logging, reputation enrichment via Ethos.</li>
                <li><strong className="text-white">Legal obligation (Art. 6(1)(c)):</strong> sanctions screening where required by applicable law; record-keeping for legal-acceptance events.</li>
                <li><strong className="text-white">Consent (Art. 6(1)(a)):</strong> where we rely on your OAuth consent to fetch X or GitHub data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">4. Sub-processors</h2>
              <p className="text-muted leading-relaxed mb-4">
                We use the following sub-processors to deliver the platform:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li><strong className="text-white">Vercel, Inc.</strong> &mdash; hosting, edge runtime, CDN (United States).</li>
                <li><strong className="text-white">Supabase, Inc.</strong> &mdash; managed PostgreSQL database (region may vary).</li>
                <li><strong className="text-white">Privy</strong> &mdash; wallet authentication and session management.</li>
                <li><strong className="text-white">Ethos</strong> &mdash; reputation scoring API (public data).</li>
                <li><strong className="text-white">X (Twitter)</strong> &mdash; OAuth identity provider.</li>
                <li><strong className="text-white">GitHub, Inc.</strong> &mdash; OAuth identity provider (founder applications).</li>
                <li><strong className="text-white">Chainalysis</strong> &mdash; on-chain sanctions oracle (read-only contract call; no personal data transmitted off-chain).</li>
                <li><strong className="text-white">DexScreener</strong> &mdash; on-chain price and liquidity data (no personal data transmitted).</li>
                <li><strong className="text-white">RPC providers</strong> &mdash; PublicNode, Tenderly, or equivalent for Base RPC calls.</li>
                <li><strong className="text-white">Base network</strong> &mdash; all on-chain activity is public and processed by the Base L2 and its node operators.</li>
              </ul>
              <p className="text-muted leading-relaxed mt-4">
                Where sub-processors are located outside the EU, transfers rely on the applicable vendor&apos;s Standard
                Contractual Clauses, adequacy decisions, or other appropriate safeguards under GDPR Chapter V.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">5. On-chain Data and the Right to Erasure</h2>
              <p className="text-muted leading-relaxed">
                Data written to the Base blockchain &mdash; wallet addresses, transaction hashes, token balances, contribution amounts
                &mdash; is <strong className="text-white">immutable and cannot be erased</strong> by the operator or any other
                party. This is a property of public blockchains. Where you exercise your right to erasure, we will erase
                identifiable off-chain data (such as X / GitHub handles linked to your wallet in our database) to the extent we
                can do so without breaking audit or legal obligations. The on-chain record will remain.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">6. Retention</h2>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li>Legal acceptance records, sanctions screening logs, and moderation audit logs: 5 years (AML / audit baseline).</li>
                <li>Founder application content: retained while the applicant&apos;s status is active; 1 year after rejection or withdrawal, unless required longer for audit purposes.</li>
                <li>Enrichment caches (Ethos, GitHub, X): refreshed periodically; older snapshots retained up to 12 months.</li>
                <li>Session data: durations set by Privy; see their policy.</li>
                <li>On-chain data: not applicable (immutable).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">7. Your Rights (GDPR)</h2>
              <p className="text-muted leading-relaxed mb-4">
                Where GDPR applies to processing of your personal data, you have the right to:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li>Request access to your data (Art. 15).</li>
                <li>Request rectification of inaccurate data (Art. 16).</li>
                <li>Request erasure (Art. 17) &mdash; subject to the blockchain-immutability limitation described in &sect;5.</li>
                <li>Restrict processing (Art. 18).</li>
                <li>Data portability (Art. 20).</li>
                <li>Object to processing based on legitimate interests (Art. 21).</li>
                <li>Withdraw consent, where processing is based on consent, at any time.</li>
                <li>Lodge a complaint with the Luxembourg data-protection authority{" "}
                  <a href="https://cnpd.public.lu" target="_blank" rel="noopener noreferrer"
                     className="text-accent hover:underline">
                    (CNPD)
                  </a>{" "}
                  or the supervisory authority in your member state.
                </li>
              </ul>
              <p className="text-muted leading-relaxed mt-4">
                To exercise these rights, email{" "}
                <a href="mailto:privacy@vibestarter.xyz" className="text-accent hover:underline">
                  privacy@vibestarter.xyz
                </a>
                . We respond within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">8. Cookies and Tracking</h2>
              <p className="text-muted leading-relaxed">
                The platform uses only strictly-necessary storage (session cookies for authentication, CSRF tokens, UI
                preferences). We do not set marketing or analytics cookies, and we do not deploy third-party trackers (no
                Google Analytics, no Meta Pixel, no advertising-network trackers). No cookie-consent banner is required because
                no non-essential cookies are set.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">9. Security</h2>
              <p className="text-muted leading-relaxed">
                We take commercially reasonable measures to protect personal data, including transport-layer encryption (TLS),
                access controls on the database, minimisation of the data we collect, hashing of IPs, signed legal acceptances
                as evidence of authenticity, and separation of platform / operator / protocol-admin wallet roles. No system is
                perfectly secure; we cannot guarantee absolute security of data in transit or at rest.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">10. Children</h2>
              <p className="text-muted leading-relaxed">
                The platform is not directed at children under 18. We do not knowingly process personal data of children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">11. Automated Decision-making</h2>
              <p className="text-muted leading-relaxed">
                Sanctions screening returns a binary match result from the Chainalysis oracle and a positive match automatically
                blocks platform actions. This is the only automated decision that produces legal effects on you. You have the
                right to challenge such a decision and obtain human review by contacting{" "}
                <a href="mailto:privacy@vibestarter.xyz" className="text-accent hover:underline">
                  privacy@vibestarter.xyz
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">12. Changes</h2>
              <p className="text-muted leading-relaxed">
                We may update this Policy. Material changes will be versioned. Your continued use after a published update
                constitutes acceptance, subject to your right to object or withdraw consent.
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
