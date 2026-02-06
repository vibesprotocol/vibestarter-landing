import Link from "next/link";

export default function ThesisPage() {
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
          <span className="text-accent text-sm font-mono mb-4 block">The Agent Era</span>
          <h1 className="text-3xl sm:text-4xl font-semibold mb-3">Vibecoding + Vibecoins = The New Funding Stack</h1>
          <p className="text-muted text-lg mb-12">Execution collapsed. Funding is next.</p>

          <div className="prose prose-invert prose-gray max-w-none space-y-12">

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">Building Isn&apos;t the Hard Part Anymore</h2>

              {/* Vibecoding definition callout */}
              <div className="border-l-2 border-accent/40 bg-white/[0.02] rounded-r-lg px-5 py-4 mb-6">
                <p className="text-white/80 text-sm font-mono mb-1">vi·be·cod·ing | noun</p>
                <p className="text-muted text-sm leading-relaxed">
                  The practice of building software by leveraging AI agents using prompts, providing goals, examples and feedback through natural language instructions. You provide the vision. It provides the implementation.
                </p>
              </div>

              <p className="text-muted leading-relaxed mb-4">
                This isn&apos;t theoretical anymore. Models like Claude Opus 4.5 can reason over long horizons. They understand what you&apos;re building, not just what you&apos;re typing. They can architect systems, suggest and maintain entire codebases, debug across multiple files. The quality crossed a threshold where it no longer feels limited.
              </p>

              <p className="text-muted leading-relaxed mb-4">
                So what changed? Two things mainly. Context windows got massive — an agent can now hold your entire app in memory. And logical reasoning improved enough that agents don&apos;t need you to manually stitch everything together. They can maintain architectural consistency on their own.
              </p>

              <p className="text-muted leading-relaxed mb-4">
                Here&apos;s what that means in practice. You can go from idea to working MVP in a matter of days. Not a prototype or clickable mock-up, but an app that runs. It handles edge cases, has actual features — some which you wouldn&apos;t have thought up yourself. The kind of thing that used to take a technical founder three months to build.
              </p>

              <p className="text-muted leading-relaxed">
                The ability to code stopped being the bottleneck. When you can go from an idea to a working MVP in hours instead of months, everything downstream breaks. The whole economic model of startups was built on execution being expensive and slow. That assumption just died.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">The Technical Founder as Gatekeeper</h2>

              <p className="text-muted leading-relaxed mb-4">
                For decades, there was a mandatory checkpoint to starting a software startup: a technical founder. No code? No MVP. No MVP? No funding. No funding? No company.
              </p>

              <p className="text-muted leading-relaxed mb-4">
                Technical founders typically control whether an idea gets off the ground. Shipping software used to be slow, expensive, and technically demanding. Not to mention the fact that talented developers willing to take high-risk career moves with a startup are exceptionally rare.
              </p>

              <p className="text-muted leading-relaxed mb-4">
                Here&apos;s what changed. Agents can now act as your first technical lead. A non-technical founder with a clear product vision can ship real, functional software. Not perfect software. Not production-scale software. But real software that exists, gets tested, generates feedback.
              </p>

              <p className="text-muted leading-relaxed mb-4">
                Does this kill engineering? No. Deep technical expertise still matters enormously. But when you need it has shifted. You don&apos;t need a technical co-founder on day zero to prove your idea works — you need technical excellence when you&apos;re scaling, optimizing, and building moats.
              </p>

              <p className="text-muted leading-relaxed">
                The barrier to entry collapsed. The barrier to excellence didn&apos;t. Technical founders aren&apos;t mandatory at founding anymore. They&apos;re not the gatekeeper to execution.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">The Idea Graveyard</h2>

              <p className="text-muted leading-relaxed mb-4">
                This matters because of a simple, brutal reality. Ideas alone don&apos;t get funded. VCs want traction, but traction requires capital. You can bootstrap, but that means working for free, sometimes for years. Most people don&apos;t have that luxury. It&apos;s exclusionary to anyone without savings or a safety net, and it concentrates all the risk on one person.
              </p>

              <p className="text-muted leading-relaxed mb-4">
                Result? An enormous graveyard of unexplored ideas. Good ideas. Ideas that might have worked, might have found PMF, might have built real value. But the people who had them couldn&apos;t execute, and couldn&apos;t raise capital without traction first.
              </p>

              <p className="text-muted leading-relaxed mb-4">
                This isn&apos;t a capital scarcity problem. Capital exists. Look at memecoins — millions of dollars coalesce around pure vibes and community momentum every single day. Capital flows readily into narratives, speculation, belief.
              </p>

              <p className="text-muted leading-relaxed">
                The problem is where it flows. Not to builders, not to ideas, but rather to speculative narratives or vague roadmaps. The funding mechanisms are completely out of sync with how early-stage building actually works.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">What Are Vibecoins?</h2>

              <p className="text-muted leading-relaxed mb-4">
                Vibecoins (or vibetokens) are tokens associated with a vibecoded app or agent. They&apos;re not AI vapourware tokens shoehorned into existing projects, nor are they memecoins with arbitrary roadmaps. They also differ from what platforms like pump.fun or bags.fm currently enable. These platforms let anyone launch a token, but the tokens aren&apos;t tied to actual building — they&apos;re speculation vehicles first, products maybe later (but usually never).
              </p>

              <p className="text-muted leading-relaxed mb-4">
                Here&apos;s how the landscape looks right now. AI tokens are mostly speculative — their hype has no direct correlation to actual product development. When crypto funding does reach builders, it comes after heavy execution and a working protocol. Projects build first, get funding, and tokenize later — typically to provide an exit for VCs and angel investors.
              </p>

              <p className="text-muted leading-relaxed mb-4">
                Vibecoins invert this. They exist at the intersection of two collapsed costs. Building (through vibecoding) got cheap. Coordinating belief (through tokenization) got cheap. Vibecoins serve as both community coordination and funding mechanism from day zero.
              </p>

              <p className="text-muted leading-relaxed">
                Speculation doesn&apos;t disappear. It gets redirected. Instead of speculating on narratives disconnected from reality, speculation attaches to actual experiments. Actual builders trying actual ideas. The token becomes the funding rail that matches vibecoded development speed.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">The Native Funding Primitive</h2>

              <p className="text-muted leading-relaxed mb-4">
                When MVPs are cheap and fast, funding models should match that velocity. Vibecoins enable belief-based funding before traditional traction metrics exist. They align community around an idea. They provide capital exactly when it&apos;s most useful: when you&apos;re testing, iterating, figuring out if something has legs.
              </p>

              <p className="text-muted leading-relaxed mb-4">
                Traditional funding is binary. You get the grant or you don&apos;t. The VC invests or passes. Even on-chain fundraising platforms still operate with this VC mindset — curated deals, accredited investors, traditional round structures. It&apos;s just VC mechanics on a blockchain.
              </p>

              <p className="text-muted leading-relaxed">
                Here&apos;s the thesis: vibecoins will become the native funding mechanism for a world where ideas can ship in days. Think about the mismatch. You can vibecode an MVP in a weekend. But your funding mechanism requires six months of pitch meetings and cap table negotiations? That makes no sense. Funding should be as fast, permissionless, and experimental as building.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">Who Gets to Build</h2>

              <p className="text-muted leading-relaxed mb-4">
                Lower the barrier to experimentation and you change who participates. More people try? Failure gets cheaper, faster, less career-ending. The person with a day job who has a vision for a new social app can actually build and test it. No need to quit, no need to find a technical co-founder first. The researcher with a novel data visualization idea can ship it and see if anyone cares.
              </p>

              <p className="text-muted leading-relaxed mb-4">
                This isn&apos;t about lowering quality. It&apos;s about increasing surface area. More experiments mean more discoveries. Innovation broadens. The long tail gets thicker.
              </p>

              <p className="text-muted leading-relaxed">
                The economics compound. When funding aligns with speed, and execution aligns with intent, ideas that would&apos;ve died in the graveyard get tested. Most fail fast. Some find traction. A few become important. The gatekeepers lose their structural leverage. Not because they&apos;re no longer valuable — because they&apos;re no longer mandatory.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-white">The Surface Area for Innovation Explodes</h2>

              <p className="text-muted leading-relaxed mb-4">
                The barriers to building software are collapsing. The barriers to funding software are collapsing. This is happening now.
              </p>

              <p className="text-muted leading-relaxed mb-4">
                The only open question is speed. How quickly do new norms form? How quickly do we shift from &ldquo;you need a technical co-founder and VC backing&rdquo; to &ldquo;you need clear vision and a community that believes&rdquo;? How quickly does funding infrastructure catch up to execution velocity?
              </p>

              <p className="text-muted leading-relaxed mb-4">
                Vibestarter is built to test whether this actually works. A platform for launching vibetokens with time-released, escrow-backed funding. The thesis needs real infrastructure to prove itself.
              </p>

              <p className="text-muted leading-relaxed">
                When execution is cheap and funding is native, gatekeepers disappear. The surface area for innovation explodes. The shift is underway. The only question is whether you&apos;re building with it or waiting for permission that&apos;s no longer required.
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
