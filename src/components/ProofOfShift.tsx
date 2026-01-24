export function ProofOfShift() {
  const stats = [
    {
      value: "—",
      label: "Apps shipped with agents",
      note: "Tracking soon",
    },
    {
      value: "—",
      label: "Capsules minted",
      note: "On-chain provenance",
    },
    {
      value: "—",
      label: "Raises created",
      note: "Milestone-gated",
    },
  ];

  return (
    <section className="py-12 sm:py-16 border-y border-white/[0.04]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex-1 text-center ${
                index < stats.length - 1
                  ? "sm:border-r sm:border-white/[0.06]"
                  : ""
              }`}
            >
              <div className="text-3xl sm:text-4xl font-semibold text-white/20 mb-1 font-mono">
                {stat.value}
              </div>
              <div className="text-[13px] text-white/60 mb-0.5">
                {stat.label}
              </div>
              <div className="text-[11px] font-mono text-muted">
                {stat.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
