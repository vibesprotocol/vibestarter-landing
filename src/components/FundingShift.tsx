export function FundingShift() {
  return (
    <section id="funding-changed" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Funding changed
          </h2>
          <p className="text-muted text-base sm:text-lg max-w-lg mx-auto">
            Ideas that couldn&apos;t raise before can now ship and fund in days.
          </p>
        </div>

        {/* Two-sided value proposition */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Founders Card */}
          <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-accent-bright/20 border border-accent-bright/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-bright" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">For Founders</h3>
                <p className="text-[12px] text-white/50">Launch &amp; grow your idea</p>
              </div>
            </div>

            <p className="text-white/70 text-[15px] leading-relaxed mb-6">
              Gain early funding to support your initial growth phase and go-to-market strategy.
            </p>

            {/* What you get */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[13px]">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <span className="text-white/80">Launch a Vibetoken for your project</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <span className="text-white/80">Raise funds for marketing &amp; infra</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <span className="text-white/80">Unlock capital as you hit milestones</span>
              </div>
            </div>

            {/* Glow */}
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-accent-bright/[0.08] rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Backers Card */}
          <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">For Backers</h3>
                <p className="text-[12px] text-white/50">Support &amp; participate</p>
              </div>
            </div>

            <p className="text-white/70 text-[15px] leading-relaxed mb-6">
              Gain early access and exposure to vibecoded apps through Vibetokens.
            </p>

            {/* What you get */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[13px]">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <span className="text-white/80">Discover promising ideas early</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <span className="text-white/80">Hold Vibetokens in your wallet</span>
              </div>
              <div className="flex items-center gap-3 text-[13px]">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <span className="text-white/80">Share in the project&apos;s upside</span>
              </div>
            </div>

            {/* Glow */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-accent/[0.08] rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>

        {/* Bottom callout */}
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-muted text-[13px] sm:text-[14px]">
            <span className="text-accent">Days, not months.</span> Provenance-verified, milestone-gated.
          </p>
        </div>
      </div>
    </section>
  );
}
