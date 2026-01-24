import { Check } from "lucide-react";

const standardItems = [
  "X-linked founder",
  "AI agent + model metadata",
  "Proof artifact hash (transcript / PRD / commit)",
  "Immutable origin capsule hash on Base",
];

export function Standard() {
  return (
    <section id="standard" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-4">
            The VibesCertified Standard
          </h2>
          <p className="text-muted text-base sm:text-lg mb-10 sm:mb-12">
            A spec-level definition of what certified means.
          </p>

          <div className="bg-white/[0.02] border border-border rounded-xl p-6 sm:p-8 mb-8">
            <p className="text-muted text-sm uppercase tracking-wider mb-6 font-mono">
              VibesCertified launches include:
            </p>
            <div className="space-y-4">
              {standardItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-accent" />
                  </div>
                  <span className="text-white/90 text-[15px] sm:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/80 text-base sm:text-lg font-medium">
            That&apos;s the difference between an AI-themed token and an AI-born token.
          </p>
        </div>
      </div>
    </section>
  );
}
