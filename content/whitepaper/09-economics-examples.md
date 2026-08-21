# 9. Economics: Worked Examples

> Three scenarios, real numbers. The mechanism is easier to evaluate against concrete cases than against parameter tables.

The examples below trace capital flow through three representative outcomes: a successful raise that completes its full schedule, a raise that is challenged mid-schedule and frozen, and a frivolous challenge that is rejected and slashed. All numbers use the protocol's actual constants and would be reproducible on-chain.

---

## 9.1 Example A: A successful raise

**Setup:**

- Project: "Loomwright" — a vibecoded design tool.
- Token: `$LOOM`, total supply 1,000,000,000.
- Raise target: 100 ETH, fixed-goal.
- Backers: 240, contributing amounts from 0.01 to 5 ETH.
- Raise duration: 14 days. Funded on day 11.
- Backer token allocation (per the standard split): 65% of supply = 650,000,000 $LOOM.

### Flow at finalization

The 100 ETH raised splits immediately:

| Slice | ETH | Notes |
|-------|-----|-------|
| LP (paired into Aerodrome, receipt locked in fee claimer) | 15 | Paired against $LOOM to open the pool at the backer entry price −5%. Up to 150,000,000 $LOOM (15% of supply) is reserved; the locker pairs only what's needed at that price and returns the remainder to backers. |
| Escrow (`VibesTranchEscrow`) | 85 | Released across seven tranches |

The 1,000,000,000 $LOOM also distributes (assuming standard configuration with 5% founder, 15% treasury, 0% community rewards, 2.5% staker rewards):

| Slice | Tokens | Destination |
|-------|--------|-------------|
| Backers | 625,000,000 (+ any unused LP reserve) | Token Distributor — claimed by backers pro-rata |
| LP | up to 150,000,000 reserved | Paired with 15 ETH to open the pool at the backer entry price −5%; only the amount needed at that price is deposited (LP receipt locked in the fee claimer), and the remainder is returned to backers |
| Treasury | 150,000,000 | `VibesTreasuryEscrow` — quarterly releases via challengeable proposals |
| Founder | 50,000,000 | `VibesVesting` — 6-month cliff + 12-month linear |
| Staker rewards | 25,000,000 | `VibesStakerRewards` — distributed to $VIBES stakers |

These five slices are the complete allocation — they sum to the full 1,000,000,000 supply, and the platform takes no share of token supply. The platform's only per-raise fee is the 2.5% ETH tranche fee shown in the schedule below.

### Tranche schedule (escrowed 85 ETH)

| Tranche | Day | Tranche size (ETH) | Platform fee (2.5%) | To founder (97.5%) |
|---------|-----|--------------------|--------------------|--------------------|
| T0 (kickstart) | 0 | 8.5 | 0.2125 | 8.2875 |
| T1 | 30 | 12.75 | 0.31875 | 12.43125 |
| T2 | 60 | 12.75 | 0.31875 | 12.43125 |
| T3 | 90 | 12.75 | 0.31875 | 12.43125 |
| T4 | 120 | 12.75 | 0.31875 | 12.43125 |
| T5 | 150 | 12.75 | 0.31875 | 12.43125 |
| T6 | 180 | 12.75 | 0.31875 | 12.43125 |
| **Total** | | **85** | **2.125** | **82.875** |

The founder receives **82.875 ETH** across six months, in increments. The platform receives **2.125 ETH** in tranche fees. The remaining 15 ETH is permanently in the LP, where it backs secondary market trading for the lifetime of the project.

No challenges are raised during the six months. Each tranche requests through the standard path: `requestTranche()` → 72-hour window expires → `claimTranche()`.

### What backers hold at the end

Each backer holds their pro-rata share of 650,000,000 $LOOM. The LP at month six contains whatever the trading activity has accumulated to — the initial 15 ETH paired with 150M $LOOM, plus or minus the net of all trades. Backers can sell into this pool at any time. The pool will exist as long as Aerodrome does.

---

## 9.2 Example B: A challenged tranche, upheld, holder refund

**Setup:** Same Loomwright raise. Tranches T0, T1, and T2 release normally. The founder posts decreasing public activity from month two onward. By the day-90 mark, the public release schedule promised on the raise page has not materialized; the founder has stopped responding to community questions.

### Day 90: T3 request and challenge

On day 90, the founder calls `requestTranche(3)`. The 72-hour challenge window opens. The cumulative position at this moment:

- Tranches paid: T0 + T1 + T2 = 8.5 + 12.75 + 12.75 = **34 ETH** out of escrow.
- Escrow remaining: 85 − 34 = **51 ETH**.

A backer holding 0.6% of supply (6,000,000 $LOOM — they cleared the T3–T4 threshold of 0.50%) raises a challenge, staking their 6,000,000 $LOOM in the escrow contract. Other holders representing 8% of supply call `supportChallenge()` to add their voice.

### Admin review and uphold

Within the 72-hour window, the operations admin reviews the challenge. The evidence: public communication has stopped; the GitHub repo has had no commits in 40 days; the public release schedule from the raise page has missed two stated dates by 30+ days each. The admin calls `upholdChallenge(_excludeAddresses)`.

The action:

- Campaign is frozen. All future tranches (T3, T4, T5, T6) are permanently blocked.
- The challenger's 6,000,000 $LOOM stake is returned in full.
- `frozenEthBalance` is set to **51 ETH** (the remaining escrow).
- `frozenTotalSupply` is set to the current circulating supply, optionally excluding the founder's own vested holdings.

### Holder refund

The admin publishes a refund merkle root after the 24-hour `MERKLE_ROOT_DELAY` commit-reveal window. The root commits to the snapshot of holder balances at the freeze time.

Holders then burn tokens for refunds. The formula: `refund = (frozenEthBalance × burnedTokens) / frozenTotalSupply`.

For a holder with 1,000,000 $LOOM (0.1% of supply, having contributed roughly 0.1 ETH originally):

- If `frozenTotalSupply` is 800,000,000 (assuming founder + treasury exclusions): refund = (51 × 1,000,000) / 800,000,000 = **0.0637 ETH**.
- They burn their 1,000,000 $LOOM. They receive 0.0637 ETH.

The holder's contributed 0.1 ETH split into three legs: ~0.015 ETH to the permanent LP (still in the pool; not refunded), ~0.034 ETH already paid to the founder across T0–T2 (not recoverable), and ~0.051 ETH that was in escrow at freeze (now refunded pro-rata).

### What this scenario does *not* recover

- The 34 ETH already paid to the founder across T0, T1, and T2 is gone. The protocol does not claw back tranches that have been claimed.
- The 15 ETH in the permanent LP is still there but is not refunded — it remains as trading liquidity against whatever the token now trades for.
- Holders who do not burn for refund retain their tokens and their share of the LP-backed market, which post-freeze will reflect the residual value of the project.

The honest summary: a successful challenge protects future capital. It does not undo past capital. This is the mathematical reality of any time-based release with a halt mechanism, and it is the reason the early-tranche challenge threshold (0.25%) is deliberately lower than the late-tranche threshold (1.00%) — the cost of being slow to catch a bad founder is highest at the start of the schedule when the most capital is still in escrow.

---

## 9.3 Example C: A rejected challenge, slash

**Setup:** Same Loomwright raise, alternate timeline. The founder is executing on schedule. Public commits are regular; community communication is active; the project has shipped its claimed features.

On day 60, an actor holding 0.30% of supply (3,000,000 $LOOM — just over the T0–T2 threshold of 0.25%) raises a challenge against T2. The actor has a history of speculative short positions in related tokens and stands to profit from a freeze.

### The challenge stake

The actor stakes their full 3,000,000 $LOOM in the escrow contract. The 72-hour review window opens.

### Admin review and reject

The operations admin reviews. The evidence is overwhelmingly positive: continuous shipping, active community, on-track public roadmap. No reasonable evidence of fraud or abandonment exists. The admin calls `rejectChallenge()`.

The action:

- 20% of the challenger's stake — **600,000 $LOOM** — is burned to `0xdead`.
- The remaining 80% — **2,400,000 $LOOM** — is returned to the challenger.
- Tranche T2 releases as normal: 12.75 ETH out of escrow, 12.43125 ETH to founder, 0.31875 ETH to platform.

### The challenger's loss

The actor loses 600,000 $LOOM permanently. At the prevailing market price, this is a real cost. The actor is also now subject to a 7-day `CHALLENGE_COOLDOWN`, so they cannot immediately re-challenge T3.

For the actor's strategy to have been worthwhile, the expected value of the challenge — the probability of being upheld times the gain from a freeze, minus the probability of being rejected times the slash — would have needed to be positive. With the actor's evidence base, that calculation is negative. The slash mechanism is the contract-level enforcement of that disincentive.

---

## 9.4 What these examples illustrate together

The three scenarios trace the protocol's core asymmetry:

- **Honest path:** the founder receives 82.875 ETH across six months, plus a vesting allocation of 50M $LOOM after the 18-month cliff/linear schedule. Backers hold tokens against an executing project and a permanent LP.
- **Caught dishonesty:** the founder captures at most 34 ETH before a successful challenge halts the schedule and opens holder refunds. The cost to backers is bounded by *when* the dishonesty is caught.
- **Failed griefing:** the challenger pays a 20% token cost for being wrong. The founder is not delayed beyond the 72-hour window.

The numbers are real. The constants (10%, 15%, 72 hours, 20% slash, 0.25/0.50/1.00% thresholds) are protocol-level and not configurable per-raise. The same calculations apply to any raise on the platform; the only variables are the total amount raised and the token supply allocations chosen by the founder.

A backer evaluating whether to participate in a raise can compute their own version of these scenarios for any specific raise size and any specific assumption about when (or whether) the founder might fail. The protocol's transparency is that the math is the same for everyone, the parameters are the same for every raise, and the admin's actions are bounded by contract code.
