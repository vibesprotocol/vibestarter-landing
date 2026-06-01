# 6. Challenge Windows

> A 72-hour window opens whenever a founder requests a tranche. Token holders can pause the schedule. The cost of being wrong is high enough to deter griefing; the cost of being right is low enough to make it worth doing.

The challenge mechanism is the implementation of design goal G2 (*continued accountability*) and G6 (*adversarial pressure is part of the design*). It is the counterweight to Section 5's time-based release: without it, time-only release degenerates into a long-form ICO. With it, the schedule becomes contestable in a structured way.

---

## 6.1 The window

Each tranche request opens a **72-hour challenge window** before the tranche becomes claimable. The window is encoded as `CHALLENGE_WINDOW = 72 hours` in `VibesTranchEscrow`.

72 hours is a deliberate choice. Shorter windows (24 hours) systematically advantage the founder: holders in different timezones, with day jobs, or simply not watching their notifications may miss the window. Longer windows (one week) systematically advantage griefers and stall projects by accumulating a stale-data risk during slow review. Three days covers a full weekend and a working day on either side, which empirically captures the long tail of holder attention without indefinitely deferring the schedule.

The kickstart tranche (T0) does not have a challenge window. It releases immediately on finalization. This is a concession to the *kickstart* design constraint described in Section 5.2 — a founder cannot start work if their first capital is gated by a 72-hour delay. The trade-off is that T0 is 10% of escrow, the smallest tranche.

Every subsequent tranche (T1 through T6) is gated by a fresh challenge window.

## 6.2 Who can challenge

Any address holding at least a threshold amount of the project token can raise a challenge. The threshold is **graduated** by tranche number:

| Tranches | Required holdings (% of supply) |
|----------|-------------------------------|
| T0–T2 (early) | 0.25% |
| T3–T4 (mid) | 0.50% |
| T5–T6 (late) | 1.00% |

The graduation reflects information asymmetry. Early in a project's life, holders have very little data on whether the founder is actually building. A low threshold lets more holders raise concerns before too much capital has been released. Later in the schedule, the founder has accumulated a track record (delivered features, missed deadlines, public communication), and the threshold rises to prevent a small fraction of holders from blocking tranches against a clear pattern of execution.

The threshold is checked at challenge time against the challenger's current balance. The full stake is locked in the escrow contract for the duration of the challenge.

A single challenger cannot serially challenge every tranche. Each address is subject to a **7-day cooldown** after raising a challenge (`CHALLENGE_COOLDOWN = 7 days`). Different addresses can independently challenge different tranches, but a single actor cannot grief a project by burning through their token balance one challenge at a time.

## 6.3 The slash

When a challenge is rejected, the challenger loses **20% of their staked tokens** (`CHALLENGE_SLASH_BPS = 2000`), burned to `0xdead`. The remaining 80% is returned.

The slash exists to make challenges costly. Without it, an actor with a small balance could raise repeated challenges (across many wallets) to grief a founder at zero cost. With it, raising a frivolous challenge has a real, calculable token cost. The 20% number is the result of two constraints:

- It must be large enough to make griefing uneconomic. At 20%, a griefer with 0.25% of supply burns 0.05% of supply on each rejected challenge. Five rejected challenges costs 0.25% of total supply — a meaningful position. This is enough to deter sustained griefing campaigns.
- It must be small enough that a *good-faith but ultimately wrong* challenge is recoverable. A 100% slash would prevent honest holders from ever raising a concern unless they were sure they would be upheld, which defeats the purpose of having a recall mechanism for ambiguous cases.

20% threads this: griefers can't afford to be systematically wrong, but honest concerns aren't punished out of existence.

A *successful* challenge — one that is upheld by the admin review described in Section 6.4 — returns the challenger's full stake. No slash, no reward. Vibestarter does not pay challengers for being correct. Paying for successful challenges would create a meta-game in which prolific challengers (correctly identifying issues, but also farming the bounty) drive up the rate of challenge requests. Returning stake at par keeps the incentive purely defensive: you challenge to protect the value of your remaining position, not to earn a fee.

## 6.4 Outcomes

A challenge resolves in one of three ways.

### Uphold

The admin reviews the challenge and finds it warranted. The contract action is `upholdChallenge()`, which:

- Freezes the campaign. All remaining tranches are permanently blocked.
- Returns the challenger's full stake.
- Captures `frozenEthBalance` (the ETH remaining in escrow at freeze time) and `frozenTotalSupply` (the total token supply at freeze time, optionally excluding admin-specified addresses such as the founder's own holdings).
- Opens the **holder refund** path.

Holder refund works on a merkle-proof basis. The admin publishes a refund merkle root after a 24-hour commit-reveal delay (`MERKLE_ROOT_DELAY`). Token holders then burn tokens to `0xdead` and claim a proportional ETH refund: `(frozenEthBalance × burnedTokens) / frozenTotalSupply`.

The commit-reveal delay exists to give holders a chance to verify the published root before claims start. A 24-hour window after the root commitment allows the holder community to check that no addresses were unfairly excluded from the denominator and no addresses were unfairly included. After 24 hours, claims open.

### Reject

The admin reviews the challenge and finds it unwarranted. The contract action is `rejectChallenge()`, which:

- Slashes 20% of the challenger's stake to `0xdead`.
- Returns 80% to the challenger.
- Releases the tranche to the founder via the normal claim path.

### Expire

The admin takes no action within 72 hours. Anyone can then call `expireChallengeIfNeeded()`. The challenger's full stake is returned (no slash). The tranche releases to the founder.

This is the *quiet failure* path: a challenge that the admin neither upholds nor explicitly rejects is treated as not warranting a slash, but also not warranting a freeze. In practice this should be rare — the admin is expected to respond to every challenge within the window — but the path exists so that a delinquent admin cannot indefinitely hold tranches hostage by simply not responding.

## 6.5 Challenge support

Other token holders can call `supportChallenge()` to add their voice to a pending challenge. This is **event-only** — no state change, no stake required beyond holding some non-zero balance of the token. It exists so that the admin reviewing a challenge has signal beyond the one challenger's claim. If twenty holders representing a meaningful fraction of supply support a challenge, that is informationally distinct from a single 0.25% holder acting alone.

Support events are surfaced in the admin's review tooling and are part of the public record of the challenge.

## 6.6 The honest reality of admin review

The 72-hour review is performed by the **operations admin**, an account separate from the platform's master multi-sig (described in detail in Section 11). The operations admin can uphold or reject a challenge, but cannot move user funds to arbitrary destinations and cannot release escrow ahead of schedule.

The set of decisions the admin is empowered to make is small and adversarially constrained:

- Uphold: triggers contract-defined freeze and refund path. The admin cannot redirect the refund.
- Reject: triggers contract-defined slash. The admin cannot adjust the slash percentage.
- Take no action: tranche releases automatically after window expiry.

What the admin cannot do: extract escrow, alter the schedule, change a tranche size, exclude themselves from a refund denominator without that exclusion being publicly visible. The `_excludeAddresses` parameter on `upholdChallenge` is the highest-trust surface — it controls which addresses are excluded from the refund denominator, and a malicious admin could in principle manipulate it to over-pay specific holders. The challenge standards (Section 6.6) define how this parameter is used, and Section 11 covers the cosigner separation that constrains it on the production multi-sig.

This is the centralized surface that *we will not pretend is not centralized*. It exists because contract code cannot read the world: a contract cannot determine whether a founder has actually disappeared, whether claimed progress is real, whether a "missed milestone" is a missed deadline or a strategic pivot. A human (or a multi-sig) has to make that call, in the same way that arbitration exists in every other contractual system humans have built. Section 12 covers the path on which this surface decentralizes — challenge standards documents, multi-sig adjudication panels, and eventually community-elected reviewers.

The contract guarantees the *consequences* of the admin's decision (slash percentages, freeze mechanics, refund proportionality). It does not guarantee the decision itself. That is the boundary, and we mark it clearly rather than hiding it.
