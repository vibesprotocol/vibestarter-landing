"use client";

export function MarketThesis() {
  return (
    <section id="the-shift" className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Subtle wave/timeline motif background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute top-1/2 left-0 w-full h-64 -translate-y-1/2 opacity-[0.03]"
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C200,150 400,50 600,100 C800,150 1000,50 1200,100"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0,120 C200,170 400,70 600,120 C800,170 1000,70 1200,120"
            stroke="white"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-[11px] font-mono text-muted tracking-widest uppercase">
              Market Thesis
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono text-accent/80 bg-accent/10 rounded-full border border-accent/20">
              Post-Opus 4.5 era
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-4">
            The shift is already here
          </h2>
          <p className="text-muted text-base sm:text-lg max-w-xl mx-auto">
            Software is being written by agents. The rules for building and funding are changing.
          </p>
        </div>

        {/* Thesis cards */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 01 - Vibecoding is here */}
          <div className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.1] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(145,217,130,0.06)]">
            <div className="text-[11px] font-mono text-muted mb-4">/01</div>

            {/* Agent chain visual */}
            <div className="flex items-center gap-2 mb-6 py-3 px-4 bg-white/[0.02] rounded-lg border border-white/[0.04]">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded bg-accent-bright/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-accent-bright" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-[11px] font-mono text-white/60">Claude</span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-accent/40" />
                  <div className="w-6 h-px bg-gradient-to-r from-accent/40 to-white/20" />
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <div className="w-6 h-px bg-gradient-to-r from-white/20 to-accent/40" />
                  <div className="w-1 h-1 rounded-full bg-accent/40" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono text-white/60">Ship</span>
                <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-lg sm:text-xl mb-2 text-white">
              Vibecoding is here
            </h3>
            <p className="text-muted text-[14px] leading-relaxed">
              Prompt to production in hours. Agents write code, founders direct vision.
            </p>

            {/* Signal chip */}
            <div className="mt-4 inline-flex items-center gap-1.5 px-2 py-1 bg-white/[0.03] rounded text-[10px] font-mono text-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
              Agent-native builders
            </div>
          </div>

          {/* Card 02 - Non-technical founders */}
          <div className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.1] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(145,217,130,0.06)]">
            <div className="text-[11px] font-mono text-muted mb-4">/02</div>

            {/* Role split visual */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 py-3 px-3 bg-white/[0.02] rounded-lg border border-white/[0.04] text-center">
                <div className="w-8 h-8 rounded-full bg-accent-light/20 mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-white/50">Founder</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-4 bg-white/10" />
                <div className="w-6 h-6 rounded-full border border-accent/30 bg-accent/10 flex items-center justify-center">
                  <svg className="w-3 h-3 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <div className="w-px h-4 bg-white/10" />
              </div>
              <div className="flex-1 py-3 px-3 bg-white/[0.02] rounded-lg border border-white/[0.04] text-center">
                <div className="w-8 h-8 rounded-full bg-accent-bright/20 mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent-bright" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-mono text-white/50">Agent</span>
              </div>
            </div>

            <h3 className="font-semibold text-lg sm:text-xl mb-2 text-white">
              Technical co-founder optional
            </h3>
            <p className="text-muted text-[14px] leading-relaxed">
              MVPs no longer require a technical founder. Agents fill the role.
            </p>

            {/* Signal chip */}
            <div className="mt-4 inline-flex items-center gap-1.5 px-2 py-1 bg-white/[0.03] rounded text-[10px] font-mono text-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
              MVP cost collapse
            </div>
          </div>

          {/* Card 03 - Vibecoins funding */}
          <div className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.1] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(145,217,130,0.06)]">
            <div className="text-[11px] font-mono text-muted mb-4">/03</div>

            {/* Mini raise card visual */}
            <div className="mb-6 p-4 bg-white/[0.02] rounded-lg border border-white/[0.04]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <span className="text-[11px] font-mono text-white/70">Raise</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-accent/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <span className="text-[9px] font-mono text-muted">Escrow</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden mb-2">
                <div className="h-full w-3/4 bg-gradient-to-r from-accent to-accent-bright rounded-full" />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/50">47 backers</span>
                <span className="text-accent">75%</span>
              </div>
            </div>

            <h3 className="font-semibold text-lg sm:text-xl mb-2 text-white">
              Vibecoins unlock funding
            </h3>
            <p className="text-muted text-[14px] leading-relaxed">
              Ideas can raise before building. Milestone-gated, escrow-backed.
            </p>

            {/* Signal chip */}
            <div className="mt-4 inline-flex items-center gap-1.5 px-2 py-1 bg-white/[0.03] rounded text-[10px] font-mono text-muted">
              <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
              Idea-stage capital
            </div>
          </div>
        </div>

        {/* Expandable deep read */}
        <details className="mt-8 sm:mt-12 group">
          <summary className="flex items-center justify-center gap-2 cursor-pointer text-muted hover:text-white transition-colors">
            <span className="text-[13px]">Read the full thesis</span>
            <svg className="w-4 h-4 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <div className="mt-6 max-w-2xl mx-auto text-muted text-[14px] leading-relaxed space-y-4 px-4">
            <p>
              The release of Claude Opus 4.5 marked an inflection point. For the first time, agents could reliably ship production-quality software from natural language prompts. This unlocked a new class of builder: the non-technical founder who directs AI to execute their vision.
            </p>
            <p>
              But funding infrastructure hasn&apos;t caught up. Traditional investors want teams, traction, and technical co-founders. Vibestarter bridges this gap with milestone-based crowdfunding, letting ideas raise at the concept stage with verifiable provenance.
            </p>
            <p>
              Every launch records who built it, which agent powered it, and proof of the build process. This creates accountability and discoverability in a market flooded with agent-generated projects.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}
