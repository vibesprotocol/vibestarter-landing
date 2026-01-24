const steps = [
  {
    step: 1,
    title: "Verify",
    description: "Connect wallet + Socials",
  },
  {
    step: 2,
    title: "Prove Your Build",
    description: "Showcase your vibecoded app → store proof on-chain",
  },
  {
    step: 3,
    title: "Define Roadmap",
    description: "Share milestones and funding goals",
  },
  {
    step: 4,
    title: "Set Funding Goals",
    description: "Define tokenomics & funding mechanism",
  },
  {
    step: 5,
    title: "Secure Backing",
    description: "Backers fund your raise, escrow stores funds on-chain",
  },
  {
    step: 6,
    title: "Ship & Unlock",
    description: "Hit milestones, deliver vibetoken goals, unlock all funding",
    highlight: true,
  },
];

// Icons for each step - using accent colors
const StepIcon = ({ step }: { step: number }) => {
  const icons: Record<number, JSX.Element> = {
    1: ( // Wallet/verify icon
      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4M4 6v12a2 2 0 0 0 2 2h14v-4M18 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    ),
    2: ( // Code/build icon
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    ),
    3: ( // Roadmap/milestone icon
      <path d="M3 6h18M3 12h18M3 18h18M8 6v12" />
    ),
    4: ( // Token/funding icon
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    ),
    5: ( // Shield/escrow icon
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    ),
    6: ( // Rocket/ship icon
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-8 h-8 lg:w-10 lg:h-10"
    >
      {icons[step]}
    </svg>
  );
};

export function HowItWorks() {
  return (
    <section id="how-vibestarter-works" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 sm:mb-12">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <h2 className="text-xl sm:text-2xl font-semibold">How Vibestarter Works</h2>
          </div>
          <span className="px-3 py-1 text-[11px] font-mono text-accent bg-accent/10 rounded-full border border-accent/20">
            Milestone-Based
          </span>
        </div>

        {/* Desktop: Sine wave flow diagram - icons only, broken line */}
        <div className="hidden lg:block">
          <svg
            viewBox="0 0 900 420"
            className="w-full max-w-[900px] mx-auto"
            fill="none"
          >
            {/* Sine wave segments - broken at each node */}
            {/* Segment 1 to 2 */}
            <path
              d="M 100 160 C 140 160, 160 280, 200 280"
              stroke="#91D982"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Segment 2 to 3 */}
            <path
              d="M 250 280 C 290 280, 310 160, 350 160"
              stroke="#0D8BCA"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Segment 3 to 4 */}
            <path
              d="M 400 160 C 440 160, 460 280, 500 280"
              stroke="#91D982"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Segment 4 to 5 */}
            <path
              d="M 550 280 C 590 280, 610 160, 650 160"
              stroke="#0D8BCA"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Segment 5 to 6 */}
            <path
              d="M 700 160 C 740 160, 760 280, 800 280"
              stroke="#91D982"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />

            {/* Step 1 - larger icon */}
            <g transform="translate(51, 136) scale(2)" stroke="#91D982" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4M4 6v12a2 2 0 0 0 2 2h14v-4M18 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </g>
            {/* Step 1 label - larger text */}
            <text x="75" y="85" textAnchor="middle" fill="#91D982" fontSize="12" fontWeight="bold" letterSpacing="0.05em">STEP 1</text>
            <text x="75" y="104" textAnchor="middle" fill="white" fontSize="15" fontWeight="600">Verify</text>
            <text x="75" y="120" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">Connect wallet + Socials</text>

            {/* Step 2 - larger icon */}
            <g transform="translate(201, 256) scale(2)" stroke="#0D8BCA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
            </g>
            {/* Step 2 label - larger text */}
            <text x="225" y="340" textAnchor="middle" fill="#0D8BCA" fontSize="12" fontWeight="bold" letterSpacing="0.05em">STEP 2</text>
            <text x="225" y="359" textAnchor="middle" fill="white" fontSize="15" fontWeight="600">Prove Your Build</text>
            <text x="225" y="375" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">Showcase app → proof on-chain</text>

            {/* Step 3 - larger icon */}
            <g transform="translate(351, 136) scale(2)" stroke="#91D982" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18M8 6v12" />
            </g>
            {/* Step 3 label - larger text */}
            <text x="375" y="85" textAnchor="middle" fill="#91D982" fontSize="12" fontWeight="bold" letterSpacing="0.05em">STEP 3</text>
            <text x="375" y="104" textAnchor="middle" fill="white" fontSize="15" fontWeight="600">Define Roadmap</text>
            <text x="375" y="120" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">Share milestones & goals</text>

            {/* Step 4 - larger icon */}
            <g transform="translate(501, 256) scale(2)" stroke="#0D8BCA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </g>
            {/* Step 4 label - larger text */}
            <text x="525" y="340" textAnchor="middle" fill="#0D8BCA" fontSize="12" fontWeight="bold" letterSpacing="0.05em">STEP 4</text>
            <text x="525" y="359" textAnchor="middle" fill="white" fontSize="15" fontWeight="600">Set Funding Goals</text>
            <text x="525" y="375" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">Define tokenomics & mechanism</text>

            {/* Step 5 - larger icon */}
            <g transform="translate(651, 136) scale(2)" stroke="#91D982" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </g>
            {/* Step 5 label - larger text */}
            <text x="675" y="85" textAnchor="middle" fill="#91D982" fontSize="12" fontWeight="bold" letterSpacing="0.05em">STEP 5</text>
            <text x="675" y="104" textAnchor="middle" fill="white" fontSize="15" fontWeight="600">Secure Backing</text>
            <text x="675" y="120" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">Backers fund, escrow on-chain</text>

            {/* Step 6 - larger icon */}
            <g transform="translate(801, 256) scale(2)" stroke="#0D8BCA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            </g>
            {/* Step 6 label - larger text */}
            <text x="825" y="340" textAnchor="middle" fill="#0D8BCA" fontSize="12" fontWeight="bold" letterSpacing="0.05em">STEP 6</text>
            <text x="825" y="359" textAnchor="middle" fill="white" fontSize="15" fontWeight="600">Ship & Unlock</text>
            <text x="825" y="375" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">Hit milestones, unlock funding</text>
          </svg>
        </div>

        {/* Tablet: 2x3 grid */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 max-w-2xl mx-auto">
          {steps.map((item, index) => {
            const isAccent = index % 2 === 0;
            return (
              <div
                key={item.step}
                className={`relative p-5 rounded-xl border bg-white/[0.02] ${isAccent ? 'border-accent/30' : 'border-accent-bright/30'}`}
              >
                <div
                  className={`absolute -top-3 left-5 px-3 py-1 rounded-full text-[11px] font-bold text-black ${isAccent ? 'bg-accent' : 'bg-accent-bright'}`}
                >
                  Step {item.step}
                </div>
                <h3 className="font-semibold text-base mt-3 mb-2 text-white">
                  {item.title}
                </h3>
                <p className="text-[13px] text-white/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mobile vertical layout */}
        <div className="md:hidden space-y-3">
          {steps.map((item, index) => {
            const isAccent = index % 2 === 0;
            return (
              <div key={item.step} className="flex gap-4">
                {/* Step number column with line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${isAccent ? 'border-accent bg-accent/20' : 'border-accent-bright bg-accent-bright/20'}`}
                  >
                    <span className={`text-sm font-semibold ${isAccent ? 'text-accent' : 'text-accent-bright'}`}>{item.step}</span>
                  </div>
                  {/* Connector line (not on last item) */}
                  {index < steps.length - 1 && (
                    <div className="w-px flex-1 min-h-[16px] bg-white/[0.08]" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 p-4 rounded-xl border bg-white/[0.02] ${isAccent ? 'border-accent/20' : 'border-accent-bright/20'}`}
                >
                  <h3 className="font-semibold text-base mb-1 text-white">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-white/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
