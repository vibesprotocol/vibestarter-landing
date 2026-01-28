const steps = [
  {
    step: 1,
    title: "Verify",
    description: "Connect wallet + link social accounts",
  },
  {
    step: 2,
    title: "Prove Your Build",
    description: "Upload AI transcript → cryptographic proof stored on-chain",
  },
  {
    step: 3,
    title: "Set Your Terms",
    description: "Define your 6-month roadmap, token allocation, and funding goal",
  },
  {
    step: 4,
    title: "Go Live",
    description: "Your raise goes live → backers start funding",
  },
  {
    step: 5,
    title: "Funds in Escrow",
    description: "All contributions held in smart contract escrow, not your wallet",
  },
  {
    step: 6,
    title: "Vibestart",
    description: "10% instant funding when your raise finalizes",
  },
  {
    step: 7,
    title: "Ship",
    description: "Build your product and hit your milestones",
  },
  {
    step: 8,
    title: "Tranches",
    description: "Claim 15% funding monthly over 6 months",
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
    3: ( // Settings/terms icon
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
    ),
    4: ( // Play/go live icon
      <path d="M5 3l14 9-14 9V3z" />
    ),
    5: ( // Lock/escrow icon
      <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>
    ),
    6: ( // Lightning/vibestart icon
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    ),
    7: ( // Rocket/ship icon
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    ),
    8: ( // Clock/tranches icon
      <><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></>
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
  // Positions for 8 steps on a sine wave
  // Top row: steps 1, 3, 5, 7 at y=140
  // Bottom row: steps 2, 4, 6, 8 at y=280
  const stepPositions = [
    { x: 70, y: 140, labelY: 70 },    // Step 1 - top
    { x: 195, y: 280, labelY: 350 },  // Step 2 - bottom
    { x: 320, y: 140, labelY: 70 },   // Step 3 - top
    { x: 445, y: 280, labelY: 350 },  // Step 4 - bottom
    { x: 570, y: 140, labelY: 70 },   // Step 5 - top
    { x: 695, y: 280, labelY: 350 },  // Step 6 - bottom
    { x: 820, y: 140, labelY: 70 },   // Step 7 - top
    { x: 945, y: 280, labelY: 350 },  // Step 8 - bottom
  ];

  const stepData = [
    { title: "Verify", desc: "Wallet + socials" },
    { title: "Prove Build", desc: "Upload transcript" },
    { title: "Set Terms", desc: "Roadmap + tokens" },
    { title: "Go Live", desc: "Start funding" },
    { title: "In Escrow", desc: "Funds secured" },
    { title: "Vibestart", desc: "10% instant" },
    { title: "Ship", desc: "Build & deliver" },
    { title: "Tranches", desc: "15%/month" },
  ];

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
            Time-Released
          </span>
        </div>

        {/* Desktop: Sine wave flow diagram for 8 steps */}
        <div className="hidden lg:block overflow-x-auto">
          <svg
            viewBox="0 0 1020 420"
            className="w-full min-w-[900px] max-w-[1020px] mx-auto"
            fill="none"
          >
            {/*
              Icon positions (centers):
              - Top row (y=160): x = 70, 320, 570, 820
              - Bottom row (y=280): x = 195, 445, 695, 945

              Icon size is 48x48, so translate by (x-24, y-24) to center
              Wave segments start/end 30px away from icon centers
            */}

            {/* Wave segment 1→2: from (70+30=100, 160) curving down to (195-30=165, 280) */}
            <path d="M 100 160 Q 132 160, 132 220 Q 132 280, 165 280" stroke="#91D982" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Wave segment 2→3: from (195+30=225, 280) curving up to (320-30=290, 160) */}
            <path d="M 225 280 Q 257 280, 257 220 Q 257 160, 290 160" stroke="#0D8BCA" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Wave segment 3→4: from (320+30=350, 160) curving down to (445-30=415, 280) */}
            <path d="M 350 160 Q 382 160, 382 220 Q 382 280, 415 280" stroke="#91D982" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Wave segment 4→5: from (445+30=475, 280) curving up to (570-30=540, 160) */}
            <path d="M 475 280 Q 507 280, 507 220 Q 507 160, 540 160" stroke="#0D8BCA" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Wave segment 5→6: from (570+30=600, 160) curving down to (695-30=665, 280) */}
            <path d="M 600 160 Q 632 160, 632 220 Q 632 280, 665 280" stroke="#91D982" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Wave segment 6→7: from (695+30=725, 280) curving up to (820-30=790, 160) */}
            <path d="M 725 280 Q 757 280, 757 220 Q 757 160, 790 160" stroke="#0D8BCA" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Wave segment 7→8: from (820+30=850, 160) curving down to (945-30=915, 280) */}
            <path d="M 850 160 Q 882 160, 882 220 Q 882 280, 915 280" stroke="#91D982" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Step 1 - Verify (top, center at 70,160) */}
            <g transform="translate(46, 136)">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#91D982" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4M4 6v12a2 2 0 0 0 2 2h14v-4M18 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
              </svg>
            </g>
            <text x="70" y="80" textAnchor="middle" fill="#91D982" fontSize="10" fontWeight="bold" letterSpacing="0.05em">STEP 1</text>
            <text x="70" y="96" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Verify</text>
            <text x="70" y="110" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Wallet + socials</text>

            {/* Step 2 - Prove Build (bottom, center at 195,280) */}
            <g transform="translate(171, 256)">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#0D8BCA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
              </svg>
            </g>
            <text x="195" y="330" textAnchor="middle" fill="#0D8BCA" fontSize="10" fontWeight="bold" letterSpacing="0.05em">STEP 2</text>
            <text x="195" y="346" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Prove Build</text>
            <text x="195" y="360" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Upload transcript</text>

            {/* Step 3 - Set Terms (top, center at 320,160) */}
            <g transform="translate(296, 136)">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#91D982" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
              </svg>
            </g>
            <text x="320" y="80" textAnchor="middle" fill="#91D982" fontSize="10" fontWeight="bold" letterSpacing="0.05em">STEP 3</text>
            <text x="320" y="96" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Set Terms</text>
            <text x="320" y="110" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Roadmap + tokens</text>

            {/* Step 4 - Go Live (bottom, center at 445,280) */}
            <g transform="translate(421, 256)">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#0D8BCA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </g>
            <text x="445" y="330" textAnchor="middle" fill="#0D8BCA" fontSize="10" fontWeight="bold" letterSpacing="0.05em">STEP 4</text>
            <text x="445" y="346" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Go Live</text>
            <text x="445" y="360" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Start funding</text>

            {/* Step 5 - In Escrow (top, center at 570,160) */}
            <g transform="translate(546, 136)">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#91D982" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </g>
            <text x="570" y="80" textAnchor="middle" fill="#91D982" fontSize="10" fontWeight="bold" letterSpacing="0.05em">STEP 5</text>
            <text x="570" y="96" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">In Escrow</text>
            <text x="570" y="110" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Funds secured</text>

            {/* Step 6 - Vibestart (bottom, center at 695,280) */}
            <g transform="translate(671, 256)">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#0D8BCA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </g>
            <text x="695" y="330" textAnchor="middle" fill="#0D8BCA" fontSize="10" fontWeight="bold" letterSpacing="0.05em">STEP 6</text>
            <text x="695" y="346" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Vibestart</text>
            <text x="695" y="360" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">10% instant</text>

            {/* Step 7 - Ship (top, center at 820,160) */}
            <g transform="translate(796, 136)">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#91D982" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              </svg>
            </g>
            <text x="820" y="80" textAnchor="middle" fill="#91D982" fontSize="10" fontWeight="bold" letterSpacing="0.05em">STEP 7</text>
            <text x="820" y="96" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Ship</text>
            <text x="820" y="110" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">Build & deliver</text>

            {/* Step 8 - Tranches (bottom, center at 945,280) */}
            <g transform="translate(921, 256)">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#0D8BCA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
            </g>
            <text x="945" y="330" textAnchor="middle" fill="#0D8BCA" fontSize="10" fontWeight="bold" letterSpacing="0.05em">STEP 8</text>
            <text x="945" y="346" textAnchor="middle" fill="white" fontSize="13" fontWeight="600">Tranches</text>
            <text x="945" y="360" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10">15%/month</text>
          </svg>
        </div>

        {/* Tablet: 2x4 grid */}
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
