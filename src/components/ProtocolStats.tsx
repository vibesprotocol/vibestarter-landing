// TODO: Replace with live data from app.vibestarter.xyz API
// Example: const { data } = useSWR('/api/stats', fetcher)
// Then use: data?.projectsFunded, data?.fundsRaised, data?.projectBackers

const stats = [
  { value: null, label: "Projects Funded" },
  { value: null, label: "Funds Raised" },
  { value: null, label: "Project Backers" },
];

export function ProtocolStats() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-white mb-2">
                {stat.value ?? "—"}
              </div>
              <div className="text-[13px] sm:text-sm text-white/50 font-mono">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
