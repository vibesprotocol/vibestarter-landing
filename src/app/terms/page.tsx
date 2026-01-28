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
          <p className="text-muted mb-6">Last updated: January 2026</p>

          <div className="prose prose-invert prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
              <p className="text-muted leading-relaxed">
                By accessing or using Vibestarter (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
                Vibestarter is a crowdfunding platform for vibecoded applications on the Base blockchain. The Service
                enables founders to raise funds for AI-collaborative software projects, and enables backers to contribute
                to projects they believe in while receiving project-specific tokens.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">2. Description of Service</h2>
              <p className="text-muted leading-relaxed mb-4">
                Vibestarter provides a crowdfunding platform with the following features:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li>Launch fundraising campaigns (&quot;raises&quot;) for vibecoded projects</li>
                <li>Create project-specific tokens (&quot;Vibetokens&quot;) distributed to backers</li>
                <li>Record on-chain provenance through Origin Capsules proving AI-human collaboration</li>
                <li>Hold contributed funds in smart contract escrow</li>
                <li>Release funds to founders through time-based tranches over 6 months</li>
                <li>Enable community oversight through challenge mechanisms</li>
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
                keys and cannot recover them if lost. All transactions require your wallet signature and approval.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">5. For Founders</h2>

              <h3 className="text-lg font-medium mb-3 text-white/90">5.1 Launching a Raise</h3>
              <p className="text-muted leading-relaxed mb-4">
                Founders may launch raises by providing accurate project information, uploading AI transcript
                proof for Origin Capsule creation, defining a roadmap, and setting funding parameters. By launching
                a raise, you represent that all information provided is truthful and that you intend to deliver
                on your stated roadmap.
              </p>

              <h3 className="text-lg font-medium mb-3 text-white/90">5.2 Raise Types</h3>
              <p className="text-muted leading-relaxed mb-4">
                Vibestarter offers three raise types: Fixed Goal (all-or-nothing with full refunds if goal not met),
                Open-Ended (flexible funding with optional soft cap), and Pro-Rata (hard cap with proportional
                allocation if oversubscribed). Each type has different refund conditions as described in our documentation.
              </p>

              <h3 className="text-lg font-medium mb-3 text-white/90">5.3 Fund Release Schedule</h3>
              <p className="text-muted leading-relaxed mb-4">
                Upon successful raise completion, funds are released as follows: 10% immediately (&quot;Kickstart Tranche&quot;),
                followed by 15% monthly for 6 months. Each monthly tranche is subject to a 72-hour challenge window
                before release. Funds are released based on time, not milestone completion.
              </p>

              <h3 className="text-lg font-medium mb-3 text-white/90">5.4 Token Allocation</h3>
              <p className="text-muted leading-relaxed">
                Token distribution is fixed at: 70% to backers (proportional to contribution), 20% to liquidity pool
                (locked indefinitely), and up to 10% to the founder. Founders define token name, symbol, and total supply
                at raise creation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">6. For Backers</h2>

              <h3 className="text-lg font-medium mb-3 text-white/90">6.1 Contributing to Raises</h3>
              <p className="text-muted leading-relaxed mb-4">
                Backers contribute ETH to raises and receive Vibetoken allocations proportional to their contribution.
                All contributions go directly to smart contract escrow, not to founder wallets. Tokens can be claimed
                after a raise successfully completes.
              </p>

              <h3 className="text-lg font-medium mb-3 text-white/90">6.2 Refund Conditions</h3>
              <p className="text-muted leading-relaxed mb-4">
                Refunds are available when: a Fixed Goal raise does not reach its target by deadline, an Open-Ended
                raise does not meet its soft cap (if set), a raise is cancelled by Vibestarter during the funding
                period, or a project is terminated after funding (proportional refund based on Vibetoken holdings
                at time of cancellation). Refunds are available immediately after on-chain cancellation and remain
                available indefinitely.
              </p>

              <h3 className="text-lg font-medium mb-3 text-white/90">6.3 Challenge System</h3>
              <p className="text-muted leading-relaxed">
                Token holders with at least 0.5% of a project&apos;s token supply may challenge tranche releases during
                the 72-hour challenge window by staking tokens. Challenges are reviewed by the Vibestarter team.
                If a challenge is upheld, the tranche may be frozen and the project may be terminated with proportional
                refunds to backers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">7. Escrow and Smart Contracts</h2>
              <p className="text-muted leading-relaxed mb-4">
                All funds raised are held in dedicated smart contract escrow. Each raise deploys its own escrow
                contract from factory templates. Contracts use battle-tested OpenZeppelin libraries for core
                security patterns. Contract code is verified on Basescan.
              </p>
              <p className="text-muted leading-relaxed">
                Liquidity pool tokens are locked indefinitely at raise finalization to prevent founders from
                pulling liquidity. Neither Vibestarter nor founders can bypass the programmatic release conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">8. Platform Fees</h2>
              <p className="text-muted leading-relaxed">
                Vibestarter charges a 2.5% fee on successfully funded raises, deducted at each tranche release.
                This consists of 2.0% platform revenue and 0.5% operations reserve (for infrastructure, dispute
                resolution, and platform protection). No fees are charged on failed or refunded raises.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">9. Origin Capsules</h2>
              <p className="text-muted leading-relaxed">
                Origin Capsules are on-chain attestations proving AI-human collaboration in project development.
                They contain: AI transcript hash, agent tool used, model provider, founder identity, token metadata,
                and creation timestamp. Origin Capsule data is immutable once recorded on the blockchain.
                Vibestarter records provenance claims but does not independently verify the underlying accuracy
                of submitted transcripts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">10. Platform Rights</h2>
              <p className="text-muted leading-relaxed mb-4">
                Vibestarter reserves the right to:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li>Cancel raises during the funding period if Terms are violated or fraud is suspected</li>
                <li>Terminate projects after funding if challenges are upheld or serious violations occur</li>
                <li>Suspend or terminate user access for Terms violations</li>
                <li>Modify platform features and documentation</li>
              </ul>
              <p className="text-muted leading-relaxed mt-4">
                In any cancellation or termination, backers will receive refunds as described in Section 6.2.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">11. Risks and Disclaimers</h2>

              <h3 className="text-lg font-medium mb-3 text-white/90">11.1 Token Risks</h3>
              <p className="text-muted leading-relaxed mb-4">
                Vibetokens are project-specific tokens created on the Base blockchain. Token purchases involve
                significant risk. The regulatory status of tokens may vary by jurisdiction. Nothing on this
                platform constitutes investment advice. Consult qualified legal and financial advisors before
                participating.
              </p>

              <h3 className="text-lg font-medium mb-3 text-white/90">11.2 Project Risks</h3>
              <p className="text-muted leading-relaxed mb-4">
                Backing a project does not guarantee that the founder will deliver on their roadmap. While
                the challenge system provides oversight, projects may still fail to deliver despite receiving
                funding. Vibestarter does not guarantee project success or token value.
              </p>

              <h3 className="text-lg font-medium mb-3 text-white/90">11.3 Blockchain Risks</h3>
              <p className="text-muted leading-relaxed">
                All transactions occur on the Base blockchain. Blockchain transactions are irreversible.
                You are responsible for all gas fees. Smart contracts, while designed for security, may
                contain undiscovered vulnerabilities. Network congestion or outages may affect transaction timing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">12. Disclaimer of Warranties</h2>
              <p className="text-muted leading-relaxed">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
                WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY INFORMATION
                PROVIDED BY FOUNDERS OR RECORDED THROUGH THE SERVICE. WE DO NOT GUARANTEE THAT ANY
                PROJECT WILL DELIVER ON ITS STATED ROADMAP OR THAT ANY TOKEN WILL HAVE OR RETAIN VALUE.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">13. Limitation of Liability</h2>
              <p className="text-muted leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, VIBESTARTER SHALL NOT BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT
                LIMITED TO LOSS OF PROFITS, DATA, TOKENS, OR OTHER INTANGIBLE LOSSES, RESULTING FROM
                YOUR USE OF THE SERVICE, CONTRIBUTIONS TO RAISES, OR PROJECT FAILURES.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">14. User Responsibilities</h2>
              <p className="text-muted leading-relaxed mb-4">
                You agree to:
              </p>
              <ul className="list-disc list-inside text-muted space-y-2">
                <li>Provide accurate information in all submissions</li>
                <li>Conduct your own research before contributing to any raise</li>
                <li>Not use the Service for fraudulent or misleading purposes</li>
                <li>Not attempt to manipulate or exploit platform mechanisms</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not infringe on the intellectual property rights of others</li>
                <li>Maintain the security of your wallet and private keys</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">15. Modifications</h2>
              <p className="text-muted leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately
                upon posting with an updated revision date. Your continued use of the Service after changes
                constitutes acceptance of the modified Terms. Material changes will be announced through
                our official channels.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">16. Contact</h2>
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
