import Link from "next/link";

export function ClosingCTA() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Ready to raise?
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">
            Launch your Vibetoken and start raising in minutes — escrow-backed, time-released, on-chain.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="https://app.vibestarter.xyz"
              className="btn-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-medium text-[15px] text-center"
            >
              Launch Your Raise
            </Link>
            <Link
              href="https://app.vibestarter.xyz"
              className="btn-secondary px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-medium text-[15px] text-center"
            >
              View Raises
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
