# 2. The Funding Mismatch

> Execution collapsed. Funding did not. The whitepaper begins where the thesis ended: with the observation that the two halves of the early-stage stack are now operating at different speeds.

The full case for vibecoins as a category lives in the original thesis at [vibestarter.xyz/thesis](https://www.vibestarter.xyz/thesis). This section compresses that argument to the load-bearing claims, in service of setting up the mechanism design problem that the rest of this paper solves. A reader who wants the full rhetorical case should read the thesis directly.

---

## 2.1 What changed in execution

The capability of AI coding agents crossed a quality threshold during 2025–2026 that materially altered the economics of starting a software project. Models with long-horizon reasoning and context windows that can hold entire codebases in memory can now act as a project's first technical lead. A founder with a clear product vision can ship a real, functional MVP in days rather than months.

This is not a claim that AI eliminates the need for technical excellence. It is the narrower claim that **the gating role of the technical co-founder at day zero has been removed.** Deep engineering expertise still matters at scale, when optimizing, when building moats. It is no longer required to prove an idea works.

The consequence: the population of people who can ship an MVP without first finding (and convincing) a technical co-founder has expanded by orders of magnitude. Surface area for software experimentation increases. Some of the ideas that previously died in the graveyard now ship.

## 2.2 What did not change in funding

The funding rails available to early-stage software did not move at the same speed.

**Venture capital** still operates on multi-month timelines, requires accredited capital, and uses equity structures that exclude non-investors. Cap table management, term sheets, and partner judgment are necessary functions when investing $5M in a single bet; they are structural overhead when funding a $50k experiment that took a weekend to build.

**Grant programs** route capital to builders without the all-or-nothing dynamic of equity rounds, but they are discretionary by design. Decisions take months. Recipients hold no liquid claim on what they helped create.

**ICOs and their successors** demonstrated that you can route significant capital to anonymous teams in days, but they also demonstrated what happens when capital arrives without continued accountability. The pattern was not a fluke of one cycle; it is what happens when funding mechanism and execution mechanism are misaligned in a specific direction.

**Memecoin launchpads** proved that coordinating speculative capital is now trivially cheap. They also demonstrated that speculation disconnected from any project being built becomes its own end. Builders trying to use these rails are drowned out by tokens optimized purely for liquidity events.

**Reward-based crowdfunding** (Kickstarter and its descendants) solved permissionless access but left backers with no claim on success, no governance, and no recourse if the project quietly dies after the funding window.

None of these are adequate for a population of builders who can ship in days, on budgets in the tens of thousands, with potential audiences in the millions. The shape of capital that fits is faster, smaller, more numerous, and more permissioning-free than any of the above.

## 2.3 The mismatch as a design problem

The thesis argues that this mismatch is *the* relevant design problem for funding infrastructure in this period. The whitepaper takes that argument as setup.

What follows from accepting it: a new funding primitive must be **fast** (days, not quarters), **permissionless** (anyone can launch, anyone can back), **denominated in liquid units** (a transferable claim, not an illiquid equity stake), **accountable** (continued performance is required, not assumed), and **honest about its operator surfaces** (which, as Section 12 makes clear, every protocol has).

The rest of this paper is the specification of one such primitive. Section 3 introduces the term we use for it (the *vibecoin*) and the broader category. Sections 4 through 11 specify the mechanism. Sections 12 and 13 cover the operator surfaces and the residual risks. None of this is the only possible specification, but the design constraints are sharp enough that most reasonable specifications would converge on similar choices, and we make those choices explicit in Section 4.

The thesis ended with a question: *how quickly do new funding norms form?* This paper is one attempt to answer it by building one.
