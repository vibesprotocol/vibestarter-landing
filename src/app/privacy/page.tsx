import Link from "next/link";

export default function PrivacyPage() {
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
          <h1 className="text-3xl sm:text-4xl font-semibold mb-8">Privacy Policy</h1>
          <p className="text-muted mb-6">Last updated: January 2026</p>

          <div className="prose prose-invert prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">1. Introduction</h2>
              <p className="text-muted leading-relaxed">
                Vibestarter (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, and safeguard information when you use
                our crowdfunding platform for vibecoded applications on the Base blockchain. This includes
                launching raises, contributing to projects, creating Origin Capsules, and using related features.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">2. Information We Collect</h2>

              <h3 className="text-lg font-medium mb-3 text-white/90">2.1 Wallet Information</h3>
              <p className="text-muted leading-relaxed mb-4">
                When you connect your wallet, we collect your public wallet address. This is necessary to
                process transactions, track contributions, manage token allocations, and release funds.
                We do not have access to your private keys or seed phrases.
              </p>

              <h3 className="text-lg font-medium mb-3 text-white/90">2.2 Social Account Information</h3>
              <p className="text-muted leading-relaxed mb-4">
                Founders may link social accounts (such as X/Twitter or GitHub) for identity verification
                and reputation display. We collect the public information associated with these linked accounts,
                including usernames and profile information.
              </p>

              <h3 className="text-lg font-medium mb-3 text-white/90">2.3 On-Chain Data</h3>
              <p className="text-muted leading-relaxed mb-4">
                Information recorded on the Base blockchain is publicly visible and permanent. This includes:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2 mb-4">
                <li>Contribution amounts and wallet addresses</li>
                <li>Token allocations and claims</li>
                <li>Origin Capsule data (AI transcript hash, agent tool, model provider, founder identity, timestamps)</li>
                <li>Raise parameters and tranche releases</li>
                <li>Challenge submissions and resolutions</li>
              </ul>

              <h3 className="text-lg font-medium mb-3 text-white/90">2.4 Project Information</h3>
              <p className="text-muted leading-relaxed mb-4">
                Founders provide project details including: project name and description, roadmap and milestones,
                token configuration, funding goals, and AI transcripts for Origin Capsule creation.
              </p>

              <h3 className="text-lg font-medium mb-3 text-white/90">2.5 Usage Information</h3>
              <p className="text-muted leading-relaxed">
                We may collect basic usage analytics to improve the Service, including pages visited,
                features used, and general interaction patterns. This data is anonymized and aggregated.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">3. How We Use Information</h2>
              <p className="text-muted leading-relaxed mb-4">
                We use collected information to:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li>Provide and maintain the crowdfunding platform</li>
                <li>Process contributions and manage escrow funds</li>
                <li>Calculate and distribute token allocations</li>
                <li>Release tranches according to the time-based schedule</li>
                <li>Record and display Origin Capsules on-chain</li>
                <li>Process challenge submissions and resolutions</li>
                <li>Display founder reputation scores (via Ethos Network integration)</li>
                <li>Process refunds when applicable</li>
                <li>Improve and optimize the user experience</li>
                <li>Respond to user inquiries and support requests</li>
                <li>Enforce our Terms of Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">4. Blockchain Data</h2>
              <p className="text-muted leading-relaxed">
                <strong className="text-white">Important:</strong> Data recorded on the Base blockchain is permanent,
                public, and immutable. This includes contributions, token distributions, Origin Capsules, and all
                transaction history. Once recorded, this information cannot be deleted, modified, or made private.
                Please consider this carefully before submitting any information or making any transactions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">5. Information Sharing</h2>
              <p className="text-muted leading-relaxed mb-4">
                We do not sell your personal information. We may share information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li>On-chain data is inherently public and visible to anyone on the blockchain</li>
                <li>Project information (name, description, roadmap) is displayed publicly on the platform</li>
                <li>Founder social links and reputation scores are displayed on project pages</li>
                <li>With service providers who assist in operating the Service (e.g., hosting, analytics)</li>
                <li>With Ethos Network for reputation score integration</li>
                <li>When required by law or to protect our legal rights</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">6. Third-Party Services</h2>
              <p className="text-muted leading-relaxed mb-4">
                The Service integrates with third-party services that have their own privacy policies:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li>Wallet providers (MetaMask, Coinbase Wallet, Rainbow, etc.)</li>
                <li>Base blockchain network</li>
                <li>Aerodrome (decentralized exchange for liquidity pools)</li>
                <li>Ethos Network (reputation scoring)</li>
                <li>Social platforms for account linking (X/Twitter, GitHub)</li>
              </ul>
              <p className="text-muted leading-relaxed mt-4">
                We encourage you to review the privacy policies of these services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">7. Data Security</h2>
              <p className="text-muted leading-relaxed">
                We implement reasonable security measures to protect information under our control.
                However, no method of transmission over the Internet or electronic storage is 100% secure.
                Your wallet security is your responsibility. We strongly recommend using hardware wallets
                and following security best practices for cryptocurrency management.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">8. Cookies</h2>
              <p className="text-muted leading-relaxed">
                We may use essential cookies to maintain session state and wallet connections.
                We do not use cookies for advertising or cross-site tracking purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">9. Your Rights</h2>
              <p className="text-muted leading-relaxed mb-4">
                Depending on your jurisdiction, you may have rights regarding your personal data, including
                the right to access, correct, or delete certain information.
              </p>
              <p className="text-muted leading-relaxed">
                <strong className="text-white">Important limitation:</strong> On-chain data cannot be modified
                or deleted due to the immutable nature of blockchain technology. This includes all transactions,
                contributions, token distributions, and Origin Capsule data. Off-chain data (such as project
                descriptions stored in our database) may be subject to modification or deletion requests
                where technically feasible and legally required.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">10. Data Retention</h2>
              <p className="text-muted leading-relaxed">
                On-chain data is retained permanently on the Base blockchain. Off-chain data (such as
                analytics and server logs) is retained for as long as necessary to provide the Service
                and comply with legal obligations. Project information remains available as long as the
                project exists on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">11. Children&apos;s Privacy</h2>
              <p className="text-muted leading-relaxed">
                The Service is not intended for users under 18 years of age. We do not knowingly collect
                information from children. If we learn that we have collected information from a child
                under 18, we will take steps to delete that information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">12. International Users</h2>
              <p className="text-muted leading-relaxed">
                The Service operates on the Base blockchain and may be accessed globally. By using the
                Service, you consent to the transfer and processing of your information as described
                in this Privacy Policy. On-chain data is distributed across the blockchain network
                and is not stored in any single jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">13. Changes to This Policy</h2>
              <p className="text-muted leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will be posted on this page
                with an updated revision date. Material changes will be announced through our official
                channels. Your continued use of the Service after changes constitutes acceptance of the
                updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">14. Contact</h2>
              <p className="text-muted leading-relaxed">
                For questions about this Privacy Policy, please reach out via{" "}
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
