# 8. Reputation: Starter Cards, Levels, and Referrals

> A permissionless system has to answer one question before any of its other guarantees matter: who is the user? Vibestarter's answer is Starter Cards — a transparent scoring layer that gates features without gating access.

This section describes the reputation system that sits beside the on-chain protocol. It is the implementation of design goal G3 (*permissionless on both sides*) under the realistic constraint that *fully* permissionless access invites Sybil attacks that destroy every other guarantee in the system. The compromise is: anyone can back a raise, anyone can launch one, but features that are exploitable by Sybils (priority allocation in oversubscribed raises, referral payouts, certain quest rewards) are gated by a reputation score that is expensive to manufacture at scale.

---

## 8.1 The problem reputation solves

In a fully permissionless system, the same actor can present as any number of users. This breaks specific mechanisms in unfortunate ways:

- **Pro-rata allocation in oversubscribed raises.** If a raise has limited slots and the platform offers priority to specific users (early backers, repeat backers, allowlist members), an actor who can spin up 100 wallets captures 100 priority slots.
- **Referral rewards.** A referrer paid per referee can self-refer infinitely by creating new wallets.
- **Challenge threshold gaming.** The graduated challenge thresholds (Section 6.2) assume that "0.25% of supply" is a meaningful commitment. If a single actor can present as multiple holders, the threshold collapses.
- **Onchain quest rewards.** Tasks like "back a raise" or "support a challenge" become farmable.

None of these are protocol-level vulnerabilities — they are *application-level* vulnerabilities that emerge when permissionless protocols are made user-facing. The protocol guarantees still hold (tranches still release on time, challenges still work, LP is still locked). What breaks is the *fair distribution* of features that the platform layers on top of the protocol.

Reputation does not try to eliminate Sybils. That problem is unsolved at the level of cryptography, identity, and law. Reputation tries to make Sybils *expensive enough that the marginal Sybil farm is not worth setting up*.

## 8.2 The composite score

Each user has a **composite score** computed from four sources:

```
compositeScore = baseScore + questScore + referralScore + bugBountyScore
```

### Base score (max ~135)

Built from signals that are expensive to fake at scale because they require either historical activity or third-party attestation. The specific signals (weights are not exposed to users):

| Signal | Max points | What it measures |
|--------|-----------|------------------|
| Ethos score | 50 | Cross-platform reputation aggregator |
| Wallet age | 25 | First on-chain transaction date |
| Base transaction count | 20 | On-chain activity history on Base |
| DeFi depth | 8 | Distinct protocols interacted with |
| Web3 identity | 7 | ENS, Lens, Farcaster, etc. |
| Talent builder | 10 | Talent Protocol builder score |
| EAS attestations | 5 | Coinbase-verified status, attestations |
| Snapshot DAOs | 4 | Governance participation history |
| Farcaster | 3 | Farcaster followers + activity |
| Passport score | +3 / -20 | Gitcoin Passport (bonus or penalty) |

The signals are not equally weighted by design. Ethos and wallet age are the largest contributors because they are the most expensive to fake at scale — Ethos requires cross-platform identity establishment, and wallet age cannot be backdated. The smaller signals are tiebreakers and credibility multipliers.

A **credibility gate** prevents promotion above Level 1 on wallet-age and TX-count alone. At least one third-party credibility signal (Ethos, DeFi, ENS, EAS, Farcaster, Talent, or similar) is required to reach Level 2. This is the load-bearing anti-Sybil constraint at the base-score layer: a farm of aged wallets with transaction history but no third-party signals tops out at Level 1.

### Quest score

Points earned by completing onchain or social actions. Capped at ~155 points total. Designed so that any individual user can meaningfully participate without farming, but a Sybil farm cannot push composite scores into the top levels purely through quest completion.

### Referral score

Uncapped, but with steeply diminishing returns:

| Referral count | Points per referral |
|----------------|--------------------|
| 1–10 | 3.0 |
| 11–25 | 1.5 |
| 26–50 | 0.75 |
| 51+ | 0.3 |

A user who refers their first ten friends earns 30 points. The same user referring their hundredth requires fifty more referrals to earn the same 30 points. This shape rewards genuine network effects (a normal user has tens of friends, not thousands) while making farm-style referral campaigns economically uninteresting.

Referrals also have a **48-hour crediting delay** to allow Sybil detection (Section 8.4) to catch obvious self-referral patterns before points are awarded, and a **clawback** path if the referred user is later flagged.

### Bug bounty score

20 points per verified bug. Admin-credited. Designed to be high-signal — a small number of bounty points can move a user up a level, but the bounty is gated by Vibestarter's verification of the bug as real.

## 8.3 Levels and what they gate

The composite score maps to a **level** from 1 to 5:

| Level | Threshold | Internal key | Clearance label |
|-------|-----------|--------------|----------------|
| 5 | 300+ | STARTER_5 | Founding Operator |
| 4 | 200+ | STARTER_4 | Priority Architect |
| 3 | 130+ | STARTER_3 | Verified Operator |
| 2 | 60+ | STARTER_2 | Registered Builder |
| 1 | 0+ | STARTER_1 | Access Pending |

Levels move in one direction only: up. A user whose composite score later drops (because referrals were clawed back, for example) does not lose their level. The single exception is **Sybil override**, which can forcibly downgrade a user whose account is flagged as part of a Sybil cluster.

### What levels gate

Levels are **feature gates**, not **access gates**.

- **Anyone, regardless of level, can back any open raise.** There is no Starter Card requirement for contribution.
- **Anyone, regardless of level, can launch a raise.** A launch's success is determined by the raise's own funding outcome, not by the launcher's level.
- **Anyone, regardless of level, can hold tokens, raise challenges, claim refunds, and call any contract function.**

What levels gate:

- **Priority allocation in oversubscribed raises.** When a raise is over-committed, allocation can be configured to favor higher-level Starter Cards.
- **Allowlist windows.** A raise launching with a time-bounded allowlist may restrict the first N hours of contribution to specific levels.
- **Referral payouts.** Only users above Level 1 receive referral credit, preventing a Sybil farm of Level 1 accounts from referring each other for points.
- **Some quest rewards.** Quests that pay out non-trivial amounts require a minimum level to participate.

This is the architecture: the **protocol layer** is permissionless. The **application layer** uses reputation to allocate scarce or game-able resources fairly. Disentangling these matters — a critique of "the platform's reputation system" is not a critique of "the protocol's correctness."

## 8.4 Sybil detection

Several background processes run continuously to identify Sybil patterns:

- **Funding source clustering.** Wallets that share funding sources are clustered. A cluster with thousands of wallets funded from the same source is suspect.
- **Referral velocity checks.** A user generating referrals far above plausible human social network density is flagged.
- **X account similarity.** Accounts linked via X (Twitter) are checked for creation date proximity, follower-graph similarity, and posting pattern similarity.
- **Batch Sybil scans.** Periodic re-scans of the full user graph as new signals become available.

Flagged users can have their levels forcibly downgraded (the *Sybil override* that breaks the one-way-up rule). They can also have their referral payouts revoked.

The detection is not perfect. A sophisticated Sybil farm with diverse funding sources, distinct X accounts, and varied posting patterns can evade short of obvious heuristics. The goal is not perfect detection — it is to raise the cost of building the farm above the value of what it captures. The economic argument:

- A Sybil farm with N wallets needs to reach at least Level 3 (130 points) on each to capture meaningful priority allocation.
- Each wallet needs a third-party credibility signal to clear the credibility gate.
- Ethos accounts, ENS names, Farcaster accounts with non-zero followers — each has a marginal cost in time or money.
- Setting up 100 credible Level 3 accounts is a substantial investment. The value captured (priority allocation in a single raise) has to exceed that investment.

The system pushes the equilibrium point — past which farming is uneconomic — high enough that the marginal Sybil does not pay off for typical raise sizes.

## 8.5 Starter Cards as identity, not credential

The Starter Card is a 1200×630 OG image associated with the user's wallet, rendered at `/card/starter/[wallet]`. It displays:

- The user's level number and clearance label
- Their composite score components (wallet age, TX count, DeFi depth)
- A username and avatar
- Visual design that varies by level (accent colors, layout, badges)

The card is *informational and shareable*, not a credential. It is not used by the contract layer to make access decisions. It is the visible artifact of the scoring system, which exists primarily for the user's own understanding of where they stand and as a social object they can share.

A higher-level card is not a guarantee of trustworthiness. It indicates that the user has cleared multiple Sybil filters and accumulated meaningful third-party signals. A backer evaluating whether to support a raise should look at the founder's specific track record, the project itself, and the on-chain history of the founder's wallet — not solely at the founder's card level.

## 8.6 What reputation cannot do

The honest framing of the reputation system:

- **It cannot prevent a sophisticated Sybil attack.** A determined adversary with time, capital, and patience can construct credible high-level identities. The system raises the cost; it does not eliminate the possibility.
- **It cannot verify a founder is honest.** A high-level founder can still be dishonest. The challenge system (Section 6) is the on-chain recall mechanism; the reputation system is the off-chain *first filter*.
- **It cannot replace founder due diligence.** Backers retain responsibility for evaluating projects. The reputation system narrows the population of plausible accounts; it does not tell you which projects will succeed.
- **It is operator-defined.** The scoring weights, the level thresholds, the signal set, and the Sybil detection logic are all decisions Vibestarter Labs makes. They are published in this paper and in the source documentation, but they are not on-chain. Changing them is an operator decision, not a governance vote.

Section 12 covers the path on which scoring becomes more transparent, more auditable, and eventually less operator-dependent.
