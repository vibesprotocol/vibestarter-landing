import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-blur bg-[#0A0A0A]/90 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-0.5 sm:gap-1">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 32 32" fill="none">
              {/* Terminal prompt ">" */}
              <path
                d="M4 8L14 16L4 24"
                stroke="#91D982"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Cursor "_" */}
              <path
                d="M16 24H28"
                stroke="#91D982"
                strokeWidth="3"
                strokeLinecap="round"
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
          <h1 className="text-3xl sm:text-4xl font-semibold mb-8">Terms of Service</h1>
          <p className="text-muted mb-6">Last updated: January 2025</p>

          <div className="prose prose-invert prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
              <p className="text-muted leading-relaxed">
                By accessing or using Vibestarter (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
                Vibestarter provides a provenance layer for AI-born token launches on the Base blockchain,
                enabling users to create immutable origin capsules that link founders, AI agents, and on-chain proof.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">2. Description of Service</h2>
              <p className="text-muted leading-relaxed">
                Vibestarter allows users to:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2 mt-3">
                <li>Create and certify token launches with on-chain origin capsules</li>
                <li>Record provenance information including founder identity and AI agent attribution</li>
                <li>Generate verifiable proof of launch origins on the Base blockchain</li>
                <li>View and explore certified launches from other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">3. Eligibility</h2>
              <p className="text-muted leading-relaxed">
                You must be at least 18 years old and capable of forming a binding contract to use this Service.
                By using Vibestarter, you represent that you meet these requirements and that your use complies
                with all applicable laws in your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">4. Wallet Connection</h2>
              <p className="text-muted leading-relaxed">
                To use Vibestarter, you must connect a compatible cryptocurrency wallet. You are solely responsible
                for maintaining the security of your wallet and private keys. We do not have access to your private
                keys and cannot recover them if lost.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">5. On-Chain Transactions</h2>
              <p className="text-muted leading-relaxed">
                All origin capsules and certifications are recorded on the Base blockchain. Once submitted,
                blockchain transactions are immutable and cannot be reversed, modified, or deleted. You are
                responsible for all gas fees associated with your transactions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">6. No Financial Advice</h2>
              <p className="text-muted leading-relaxed">
                Vibestarter is a provenance and certification tool only. We do not provide investment, financial,
                legal, or tax advice. The certification of a token launch does not constitute an endorsement,
                guarantee of safety, performance, or legitimacy. You should conduct your own research before
                making any decisions related to tokens or cryptocurrencies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">7. User Responsibilities</h2>
              <p className="text-muted leading-relaxed">
                You agree to:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2 mt-3">
                <li>Provide accurate information when creating origin capsules</li>
                <li>Not use the Service for fraudulent or misleading purposes</li>
                <li>Not attempt to manipulate or exploit the certification system</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not infringe on the intellectual property rights of others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">8. Disclaimer of Warranties</h2>
              <p className="text-muted leading-relaxed">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
                WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY INFORMATION
                RECORDED THROUGH THE SERVICE. VIBESTARTER RECORDS PROVENANCE CLAIMS BUT DOES NOT
                VERIFY THE UNDERLYING TRUTH OF THOSE CLAIMS.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">9. Limitation of Liability</h2>
              <p className="text-muted leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, VIBESTARTER SHALL NOT BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT
                LIMITED TO LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR
                USE OF THE SERVICE.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">10. Modifications</h2>
              <p className="text-muted leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately
                upon posting. Your continued use of the Service after changes constitutes acceptance of the
                modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">11. Contact</h2>
              <p className="text-muted leading-relaxed">
                For questions about these Terms, please reach out via{" "}
                <a
                  href="https://x.com/vibestarterxyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  X (Twitter)
                </a>.
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
