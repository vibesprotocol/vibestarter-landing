# 4. Design Goals and Failure Modes We Are Not Willing to Inherit

> Every existing path from "early idea" to "funded product" has failure modes
> that get worse as the path gets more accessible. This section names them, then
> derives the constraints that the rest of the paper satisfies.

The mechanism described in Sections 5 through 11 is not a feature list. It is the
narrowest design that survives once each of the failure modes below is ruled out.
We are deliberately explicit about which prior model produced which lesson, so
that the design choices that follow read as forced moves rather than preferences.

---

## 4.1 Failure modes

### The ICO collapse: capital arrives before accountability

The 2017–2018 token sale wave proved that you can route billions of dollars to
anonymous teams in days. It also proved that founders who receive the full
proceeds at launch have no remaining economic reason to ship. The failure rate
of that cycle was not a fluke. It was the mechanism working exactly as designed.
Once capital has been delivered, the contract between founder and backer is over.

**Lesson:** capital cannot arrive in a single lump. The founder must remain
economically dependent on continued execution for the duration of the build.

### Milestone gates: gameable, slow, centralizing

The reaction to ICO failure was to gate capital behind milestones. This works
inside venture rounds, where partners apply judgment, but it fails as a
permissionless primitive. Milestones become performances: a founder ships a
"v2 mobile launch" because the contract pays for it, not because users wanted
it. Whoever judges the milestone — a multisig, a DAO, a foundation — becomes a
single point of capture, dispute, and delay. Disputes are slow. Delays compound.
Every milestone-gated system we have studied either centralizes the judgment or
collapses under the weight of arbitration.

**Lesson:** the schedule must be objective and adversarially un-gameable. Time
is the only variable a founder cannot perform their way around.

### Memecoin launchpads: speculation decoupled from building

Platforms in the pump.fun lineage proved that coordinating speculative capital
is now trivially cheap. The token is rarely tied to anything being built. Most
launches are speculation vehicles whose entire lifecycle is exit-driven, and
builders trying to use these rails get drowned out by tokens optimized purely
for liquidity events. Speculation is not the problem — speculation
*disconnected from any project being built* is.

**Lesson:** the funding contract must enforce that capital is allocated to a
project, not just a ticker, and that the founder remains the on-chain
counterparty over a multi-month period.

### Venture capital: gatekept, all-or-nothing, slow

Traditional venture funding requires accredited capital, multi-month timelines,
equity structures that exclude non-investors, and centralized judgment about
which ideas deserve to exist. When vibecoded MVPs ship in days, six-month rounds
are not a feature; they are a structural mismatch. The cost of being wrong about
which ideas to fund used to justify the gatekeeping. With execution costs near
zero, the gatekeeping outlives its justification.

**Lesson:** funding must be permissionless to access, denominated in a unit
anyone can hold, and clear in days — not quarters.

### Kickstarter and the no-upside backer

Reward-based crowdfunding solved permissionless access but left backers with no
claim on success, no governance, and no recourse when a project goes dark
after the funding window. The most a backer can do is post a comment. This is
fine for board games. It is not adequate for software intended to compound.

**Lesson:** backers must hold a transferable claim on the project's outcome
that retains its meaning whether the project ships, fails, or stalls. They
must also have a credible action — not just a comment thread — when something
goes wrong.

### Grant programs: discretionary and illiquid

Ecosystem grants and retroactive funding programs route capital to builders
without the all-or-nothing dynamic of an equity round. But they are
discretionary by design. A small committee decides; decisions take months;
recipients hold no liquid claim on what they helped create, and supporters
hold no claim at all. Grants are an important complement to other funding
rails. They are not a substitute for one.

**Lesson:** funding decisions should be aggregated from many small bets,
settled in a transferable instrument, and closed in days.

---

## 4.2 Design goals

The failure modes above do not leave much design space. The goals below are
what survives once each one is ruled out. They are the contract this paper has
with the reader: every mechanism described in Sections 5 through 11 satisfies
one or more of them. If a mechanism does not map to a goal, it should not exist.

### G1 — Time, not milestones

The capital release schedule is determined by elapsed time alone. No
discretionary approval exists on the success path. No party can speed up or
slow down the schedule by performing a milestone. The schedule in Vibestarter
is **10% at finalization, then 15% every thirty days for six months.** It is
encoded in the escrow contract and is not adjustable per-raise. *(Section 5.)*

### G2 — Continued accountability

No tranche after the kickstart release pays out without a window during which
token holders can pause the schedule. A founder who has abandoned a project
does not collect the back half by waiting. The window is **72 hours** and
opens when the founder requests a tranche. *(Section 6.)*

### G3 — Permissionless on both sides (end-state; launch side currently curated)

Anyone can back a raise; there is no accredited-backer gate and no minimum
reputation. Launching is the stated end-state of this goal but is **curated in
the current phase**: mainnet raise launches require a founder application
reviewed against the published rubric (Section 12.1 / the Launch Admission &
Moderation Policy). Reputation systems gate features — they do not gate
backing access.
*(Sections 8, 12.)*

### G4 — Backer upside is a transferable claim

Backers receive a token that represents their share of the project, transferable
on secondary markets. The claim retains meaning in each of three outcomes:

- **Ship:** the token is the holder's link to the project's secondary market
  and to any community rights the founder defines.
- **Stall:** the holder can join a successful challenge to pause the schedule;
  remaining escrow becomes claimable pro-rata against burned tokens.
- **Fail to fund:** contributions are fully refundable in the original asset.

*(Mechanics in Sections 5, 6, and 9.)*

### G5 — Liquidity is permanent, not promotional

The liquidity pool created at finalization holds **15% of the raised capital
paired against tokens** and is locked **indefinitely**. The LP receipt is held
in a soulbound per-campaign fee claimer with no withdraw function. It is not a
marketing tool that can be pulled. This is a
load-bearing choice for secondary-market integrity and is described in
Section 7.

### G6 — Adversarial pressure is part of the design

A token holder who believes a project is dead or fraudulent has a contract-level
action: the **challenge**. The action is costly enough to discourage griefing
— a rejected challenger forfeits **20% of staked tokens** to the burn address
— and decisive enough to matter: an upheld challenge **freezes the campaign**
and opens a holder-refund path. The challenge stake threshold scales with
tranche number (0.25% / 0.50% / 1.00% of supply) and challengers are subject to
a **7-day cooldown** after raising one. *(Section 6.)*

### G7 — The protocol does not depend on its operator

Every load-bearing decision — release schedule, challenge window length,
refund path, LP lock — is encoded in the contract. The operator can be
replaced, captured, or disappear without the schedule changing for an in-flight
raise. Centralized surfaces remain (challenge arbitration, refund-merkle
publication, parameter governance) and are described honestly in Section 12,
along with the path on which each one decentralizes.

---

## 4.3 What is intentionally not a goal

It is as useful to name what we are not optimizing for.

- **We are not optimizing for the largest possible raises.** A primitive that
  works for $50k-pre-MVP ideas is more valuable than one that works for $50M
  Series-B-replacements. The former is structurally underserved.
- **We are not optimizing for backer "yield."** A token whose value is the
  project's success is not a yield instrument. Holders accept the same
  outcome distribution as the project itself.
- **We are not optimizing for full decentralization on day one.** Some
  surfaces — challenge arbitration, in particular — start with operator
  involvement and decentralize on a schedule we make public. Pretending
  otherwise would be the same dishonesty we are reacting against in 4.1.
- **We are not building a memecoin launchpad.** A founder who is not building
  anything has nothing to claim tranches against and no defense against a
  challenge. The mechanism is hostile to that use case by construction.

The rest of this paper describes how each goal is implemented and what is
still imperfect about each implementation.
