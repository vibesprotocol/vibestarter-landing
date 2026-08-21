# 5. Time-Released Funding

> Capital releases on a fixed time schedule. No milestone reviews. No approvals on the success path. Time is the only variable a founder cannot perform around.

This section describes how capital flows from a successful raise to the founder over the six months after funding closes. It is the implementation of design goal G1 (*time, not milestones*) and the structural counterweight to G2 (*continued accountability*) which is implemented by the challenge window described in Section 6.

---

## 5.1 The schedule

At the moment a raise finalizes, the raised capital splits:

| Slice | Destination | Released when |
|------|------------|---------------|
| **15%** | Liquidity pool: paired against tokens, LP receipt locked in a per-campaign fee claimer | At finalization, permanent (Section 7) |
| **85%** | Escrow: `VibesTranchEscrow` clone for this raise | In seven tranches over six months |

The escrowed 85% releases on the following schedule:

| Tranche | Trigger time | Tranche size | Cumulative |
|---------|-------------|--------------|------------|
| Kickstart (T0) | Immediately on finalization | 10% of escrow | 10% |
| T1 | +30 days | 15% of escrow | 25% |
| T2 | +60 days | 15% of escrow | 40% |
| T3 | +90 days | 15% of escrow | 55% |
| T4 | +120 days | 15% of escrow | 70% |
| T5 | +150 days | 15% of escrow | 85% |
| T6 | +180 days | 15% of escrow | 100% |

Each tranche is subject to a **2.5% platform fee**, deducted from the tranche at claim time. The founder receives 97.5% of each tranche; the platform receives 2.5%.

The schedule constants are encoded in `VibesTranchEscrow`:

- `KICKSTART_BPS = 1000` (10%)
- `MONTHLY_BPS = 1500` (15%)
- `NUM_MONTHLY_TRANCHES = 6`
- `TRANCHE_DURATION = 30 days`
- `PLATFORM_FEE_BPS = 250` (2.5%)

These are protocol-level constants. They are not configurable per-raise. A founder who wants different terms cannot get them on Vibestarter; they would have to build on a different platform.

## 5.2 Why these specific numbers

The 10/15/6 schedule is the answer to three constraints solved simultaneously.

**The kickstart has to be enough to start.** A founder receiving zero capital at finalization cannot pay for servers, contractors, or their own time during the first month while waiting for tranche one. Ten percent of escrow is enough to fund the first thirty days of a vibecoded project's burn for the vast majority of raises we have modeled. It is also small enough that a founder who absconds with only the kickstart has not done meaningful damage to the backer pool.

**Tranche size has to be uniform after the kickstart.** Front-loading subsequent tranches (e.g., 30% then declining) creates the same incentive problem as the ICO collapse on a slightly longer timeline. Back-loading (e.g., 5% then increasing) creates a perverse pressure to ship something dramatic right before the largest release, which is the milestone problem with extra steps. Equal tranches keep the founder's marginal incentive to continue building constant across the six months.

**Six months is the longest schedule that does not become its own problem.** Long schedules create stale-token problems (backers forget the project exists, secondary market liquidity dries up before final release), founder cash-flow problems (paying contractors who expect payment in fiat from a tranche schedule denominated in ETH), and operator-attention problems (challenge windows that span a year are harder to monitor than ones that span six months). Six months is empirically the point at which all three of these begin to bite.

The platform fee at 2.5% per tranche compounds to a total platform take of 2.5% of the escrowed amount, equivalent to **2.125% of the total raise** after the LP split. This is deliberately lower than ICO-era platform fees (commonly 5–10%) and lower than centralized crowdfunding (Kickstarter is ~5% + payment processing). The fee is taken at each tranche, not upfront, which keeps the platform's incentives aligned with the founder's continued performance.

## 5.3 The tranche request lifecycle

A tranche does not release automatically when its time arrives. The founder must explicitly request it. The full lifecycle of a single tranche:

1. **Time gate elapses.** Block timestamp ≥ tranche release time.
2. **Founder calls `requestTranche(trancheIndex)`.** This opens a **72-hour challenge window** during which token holders may raise a challenge. The challenge window is described in detail in Section 6.
3. **Window resolves.** One of three outcomes:
   - *No challenge raised:* after 72 hours, anyone can advance the state and the founder can claim.
   - *Challenge raised and rejected:* challenger is slashed, founder can claim.
   - *Challenge raised and upheld:* campaign is frozen, this tranche and all subsequent tranches are blocked, refund path opens (Section 6.4).
4. **Founder calls `claimTranche(trancheIndex)`.** The contract transfers `trancheAmount × 97.5%` to the founder's address and `trancheAmount × 2.5%` to the platform wallet.

The founder cannot batch tranches. Each tranche is requested, challenged-or-not, and claimed individually. This is deliberate: each tranche is a fresh opportunity for backers to act on new information.

## 5.4 What this does *not* do

It is worth being explicit about what time-based release does not solve.

**It does not protect against founders who are dishonest from the start.** A founder who launches a raise with no intention of building can still receive the kickstart and the first tranche or two before challenges accumulate. The protocol minimizes the size of this loss; it does not eliminate it. The reputation system (Section 8) and the founder deposit (refunded only on successful finalization) are the complementary defenses.

**It does not enforce that the founder is actually building.** No contract can. The challenge window is a *recall mechanism*, not a *progress oracle*. If holders are inattentive, a non-building founder will collect their full schedule. This is the price of refusing to gate capital behind centralized milestone judgment.

**It does not adjust for project-type variance.** A research project that needs 70% of capital in month one for compute reservations is poorly served by 10% kickstart + monthly tranches. The protocol's answer is that those projects should raise differently: through grants, through traditional venture, through pre-commit campaigns. Vibestarter is built for a specific shape of project (early-stage software, sustained burn, six-month build horizon to first meaningful milestone). The schedule is opinionated on that basis.

## 5.5 Pausing, force-refund, and the limits of automation

Two operator-controlled escape hatches exist, both restricted to the operations admin role described in Section 11.

**`pauseCampaign()` / `resumeCampaign()`** halt tranche releases during the active raise window. This is intended for cases where a known issue (a contract advisory, a suspected exploit) needs to be triaged before further capital flow.

**`forceRefundDuringRaise()`** kills an active raise before finalization and returns all contributed ETH to backers. This is the escape hatch for raises that need to be terminated before they finalize: a discovered fraud pattern, a smart contract issue requiring redeployment, or a fundamental compliance problem.

Both functions affect contributors only during the active raise window. After finalization, neither is available; at that point the only path that returns capital to holders is a successful challenge followed by a holder refund (Section 6.4). This boundary is intentional: once capital has been routed to escrow and the LP has been created, the protocol treats the raise as committed, and any unwinding requires the adversarial challenge path rather than an operator action.

The honest framing: these are operator powers, not contract-level guarantees. They exist because no realistic launch protocol can ship without them, and because pretending otherwise would be the kind of dishonesty Section 4 rules out. Section 12 covers how each of them decentralizes over time.
