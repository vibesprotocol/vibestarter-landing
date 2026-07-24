# 1. Executive Summary

> A funding primitive for vibecoded projects. Capital releases over time. Backers can pause it. Liquidity is permanent. The protocol is honest about what is and is not on-chain.

---

## The thesis, in five claims

1. **The cost of building software has collapsed.** AI coding agents have crossed a threshold where a non-technical founder with clear product vision can ship a working MVP in days. The original thesis at [vibestarter.xyz/thesis](https://www.vibestarter.xyz/thesis) makes the full argument.
2. **The cost of funding software has not collapsed.** Venture capital, ICOs, grant programs, and reward-based crowdfunding all fail for distinct reasons — gatekeeping, lack of accountability, illiquidity, or absence of upside for backers. None are adequate for the population of builders who can now ship.
3. **Vibecoins — tokens issued at the moment a vibecoded project launches — are the funding primitive that matches the new execution speed.** The token launch and the project launch are the same event.
4. **A vibecoin is only useful if the funding mechanism enforces continued accountability.** A token issued at launch with no recall mechanism degenerates into an ICO. The mechanism this paper describes is the minimum structure required to prevent that degeneration.
5. **Vibestarter is one implementation of that mechanism.** The design principles are intended to be portable. The implementation runs on Base.

## The mechanism, in five primitives

Each primitive maps to a design goal introduced in Section 4 and is specified in detail in the section indicated.

| Primitive | Parameter | Section |
|-----------|-----------|---------|
| **Time-released funding.** Capital releases on a fixed schedule. No milestones, no approvals on the success path. | 10% at finalization + 15% every 30 days × 6 tranches = 6 months total | §5 |
| **Challenge windows.** Each tranche request opens a 72-hour window during which token holders can pause the schedule. | 72-hour window; graduated holder thresholds (0.25 / 0.50 / 1.00% of supply); 20% slash on rejected challenges; 7-day cooldown | §6 |
| **Indefinite LP lock.** 15% of every raise creates an Aerodrome liquidity pool; the LP receipt is locked forever in a per-campaign fee claimer with no withdraw function. | Permanent. No unlock event. Trading fees are captured, not burned. | §7 |
| **Reputation as a signal, not a gate.** Anyone can back any raise — no reputation minimum. Launch admission is curated in the current phase against a published rubric (§12.1), not by reputation scores. Vibestarter surfaces each founder's and backer's reputation so participants can judge for themselves. | Ethos scores + on-chain history | §8 |
| **Two-tier admin separation.** Master admin (Gnosis Safe multi-sig, M-1) controls infrastructure, fees, rescue, and treasury powers. Operations/escrow admin adjudicates challenges + freezes and cannot extract user funds. | Master = M-1 Safe (2-of-2 today, moving to 2-of-3). Operations = M-3, a revocable single-key hot EOA. | §11 |

## What the contract guarantees, and what it does not

The protocol's contract guarantees are:

- The tranche schedule is encoded in `VibesTranchEscrow`. No party can accelerate, delay, or alter it.
- The challenge slash percentage, window length, and cooldown are encoded. The operator cannot adjust them per-raise.
- The LP receipt is locked in a soulbound per-campaign fee claimer at finalization. No party, including the operator, can recover it.
- Refund paths (contributor refund, holder refund, excess refund) are encoded. The operator cannot redirect them.
- The master admin's rescue capability is bounded by deposit reserves and active-claim checks. The operator cannot drain user escrow.

The protocol's centralized surfaces — surfaces that require continued operator involvement — are:

- **Challenge adjudication.** The operations admin decides whether to uphold, reject, or let expire each challenge. The published challenge standards constrain how. (§6.6, §11, §12.2)
- **Refund merkle root publication.** After a campaign is frozen, the admin publishes the snapshot root. The 24-hour commit-reveal delay lets holders verify the root before claims open. (§6.4, §11.3)
- **Reputation display.** Which reputation signals (Ethos, on-chain history) are surfaced for founders and backers is curated off-chain by the platform; the underlying scores are externally sourced and independently verifiable. (§8)
- **Parameter and infrastructure changes.** Platform fee adjustments, escrow factory upgrades, and operations admin appointment require master admin action. (§11.1, §12.2)

Section 12 covers the path on which the centralized surfaces decentralize.

## What this paper does not claim

The protocol does not claim:

- That backers will profit. Tokens are exposed to standard market risk. (§13.3)
- That fraud is impossible. A dishonest founder can claim early tranches before a challenge is upheld. The protocol minimizes this loss; it does not eliminate it. (§13.4)
- That displayed reputation guarantees a founder is trustworthy. Ethos and on-chain signals inform judgment; they do not guarantee a founder will deliver. (§13.7)
- That the audits guarantee bug-free contracts. One external audit (ZXVC LLC) plus internal review cycles have been completed; all High findings were remediated, while specific centralization findings (no admin timelocks on the treasury burn / infra setters) are accepted/deferred and disclosed as residual risk. Unknown bugs may still exist. (§13.1)
- That the LP lock guarantees value. The pool exists permanently. Whether anyone trades against it depends on what the founder builds. (§7.5)

## Status

- **Live on Base mainnet** (chain ID 8453). Contract addresses are queryable on-chain from `VibesRegistry` events.
- **Two audit cycles complete.** April 2026 and May 2026. Remediation summary at app.vibestarter.xyz/audit.
- **Reference frontend** at app.vibestarter.xyz. Any client conforming to the on-chain interfaces can interact with the protocol.

## How to read the rest of this paper

| If you want... | Read |
|----------------|------|
| The thesis it is built on | §2, §3 (or the original at vibestarter.xyz/thesis) |
| Why the mechanism is shaped the way it is | §4 |
| How the mechanism works in detail | §5, §6, §7, §8 |
| Worked examples with real numbers | §9 |
| The contract architecture | §10 |
| The operator surfaces and the audit history | §11 |
| The decentralization roadmap | §12 |
| What can go wrong | §13 |
| Glossary, parameters, references | §14 |

The whitepaper synthesizes the protocol's behavior; the deployed contracts are authoritative for specific implementation details.
