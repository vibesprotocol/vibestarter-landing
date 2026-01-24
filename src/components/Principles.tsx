export function Features() {
  return (
    <section id="the-problem" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Single card layout */}
        <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-0">
            {/* Left side - Text content */}
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
              <div className="text-[11px] font-mono text-accent tracking-widest uppercase mb-4">
                The Problem
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight mb-4">
                Ideas die without early capital
              </h2>
              <p className="text-muted text-base sm:text-lg leading-relaxed mb-8">
                Agents have removed the technical barrier — anyone can build an MVP now. But even great ideas with working products need funding for marketing, infrastructure, and growth to gain traction.
              </p>

              {/* The gap */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white/60">VCs want traction before they invest</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white/60">Traction requires capital to acquire users</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-white/60">Bootstrapping alone takes years</span>
                  </div>
                </div>
              </div>

              {/* Arrow to solution */}
              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-white font-medium">
                    Vibestarter bridges this gap with community-backed funding
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Visual */}
            <div className="relative bg-white/[0.01] p-8 sm:p-10 lg:p-12 flex items-center justify-center min-h-[340px] lg:min-h-0">
              {/* Funding flow diagram */}
              <div className="relative w-full max-w-xs flex flex-col items-center">
                {/* Top: Idea + MVP */}
                <div className="flex items-center justify-center gap-3">
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className="text-sm text-white/80">Idea</span>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <div className="px-4 py-3 rounded-xl bg-accent-bright/20 border border-accent-bright/30">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-accent-bright" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-accent-bright">MVP</span>
                    </div>
                  </div>
                </div>

                {/* Connector line down */}
                <div className="w-px h-6 bg-gradient-to-b from-white/20 to-red-500/30" />

                {/* Middle: The Gap */}
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-[11px] font-mono text-red-400">
                      FUNDING GAP
                    </span>
                  </div>
                </div>

                {/* Connector line down */}
                <div className="w-px h-6 bg-gradient-to-b from-red-500/30 to-accent/50" />

                {/* Bottom: Vibestarter solution */}
                <div className="w-full p-4 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/30 flex items-center justify-center">
                      <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    </div>
                    <span className="font-medium text-white">Vibestarter</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="px-2 py-1.5 rounded bg-white/5 text-[10px] text-white/60">Marketing</div>
                    <div className="px-2 py-1.5 rounded bg-white/5 text-[10px] text-white/60">Infra</div>
                    <div className="px-2 py-1.5 rounded bg-white/5 text-[10px] text-white/60">Growth</div>
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-accent/[0.1] rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
