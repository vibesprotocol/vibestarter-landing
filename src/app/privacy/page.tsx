import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-blur bg-[#0A0A0A]/90 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="white" />
              <path
                d="M10 16l4 4 8-8"
                stroke="black"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
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
          <p className="text-muted mb-6">Last updated: January 2025</p>

          <div className="prose prose-invert prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">1. Introduction</h2>
              <p className="text-muted leading-relaxed">
                Vibestarter (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, and safeguard information when you use
                our provenance layer for AI-born token launches on the Base blockchain.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">2. Information We Collect</h2>

              <h3 className="text-lg font-medium mb-3 text-white/90">Wallet Information</h3>
              <p className="text-muted leading-relaxed mb-4">
                When you connect your wallet, we collect your public wallet address. We do not have access
                to your private keys or seed phrases.
              </p>

              <h3 className="text-lg font-medium mb-3 text-white/90">On-Chain Data</h3>
              <p className="text-muted leading-relaxed mb-4">
                Information you submit for origin capsules is recorded on the Base blockchain and is publicly
                visible. This may include founder identifiers, AI agent information, and other provenance data
                you choose to certify.
              </p>

              <h3 className="text-lg font-medium mb-3 text-white/90">Usage Information</h3>
              <p className="text-muted leading-relaxed">
                We may collect basic usage analytics to improve the Service, including pages visited,
                features used, and general interaction patterns. This data is anonymized and aggregated.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">3. How We Use Information</h2>
              <p className="text-muted leading-relaxed">
                We use collected information to:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2 mt-3">
                <li>Provide and maintain the Service</li>
                <li>Process and record origin capsules on-chain</li>
                <li>Display certified launches and provenance information</li>
                <li>Improve and optimize the user experience</li>
                <li>Respond to user inquiries and support requests</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">4. Blockchain Data</h2>
              <p className="text-muted leading-relaxed">
                <strong className="text-white">Important:</strong> Data recorded on the Base blockchain is permanent,
                public, and immutable. Once an origin capsule is created, the associated information cannot be
                deleted, modified, or made private. Please consider this carefully before submitting any information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">5. Information Sharing</h2>
              <p className="text-muted leading-relaxed">
                We do not sell your personal information. We may share information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2 mt-3">
                <li>On-chain data is inherently public and visible to anyone</li>
                <li>With service providers who assist in operating the Service</li>
                <li>When required by law or to protect our legal rights</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">6. Data Security</h2>
              <p className="text-muted leading-relaxed">
                We implement reasonable security measures to protect information under our control.
                However, no method of transmission over the Internet or electronic storage is 100% secure.
                Your wallet security is your responsibility.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">7. Third-Party Services</h2>
              <p className="text-muted leading-relaxed">
                The Service may integrate with third-party services such as wallet providers (e.g., MetaMask,
                Coinbase Wallet) and blockchain networks. These services have their own privacy policies,
                and we encourage you to review them.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">8. Cookies</h2>
              <p className="text-muted leading-relaxed">
                We may use essential cookies to maintain session state and wallet connections.
                We do not use cookies for advertising or tracking purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">9. Your Rights</h2>
              <p className="text-muted leading-relaxed">
                Depending on your jurisdiction, you may have rights regarding your personal data, including
                the right to access, correct, or delete certain information. Note that on-chain data cannot
                be modified or deleted due to the immutable nature of blockchain technology.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">10. Children&apos;s Privacy</h2>
              <p className="text-muted leading-relaxed">
                The Service is not intended for users under 18 years of age. We do not knowingly collect
                information from children.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">11. Changes to This Policy</h2>
              <p className="text-muted leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will be posted on this page
                with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">12. Contact</h2>
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
