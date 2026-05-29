# 7. Liquidity and the Indefinite LP Lock

> 15% of every raise creates a liquidity pool that is locked forever. The LP receipt is held by a per-campaign fee claimer with no withdraw function — no party can ever pull it. There is no unlock event. There is no governance vote that releases it. It is permanent.

This section describes the liquidity primitive that pairs every Vibestarter raise. It is the implementation of design goal G5 (*liquidity is permanent, not promotional*) and is also a load-bearing piece of G4 (*backer upside is a transferable claim*) — a claim is only meaningfully transferable if there is somewhere to transfer it.

---

## 7.1 What gets created

At finalization, the protocol creates an **Aerodrome volatile-pair liquidity pool** on Base, pairing:

- **15% of the raised ETH** (taken from the contributor pool before escrow)
- **15% of the token supply** (taken from the project's token allocation)

The LP receipt token — the on-chain claim on that pool's liquidity — is transferred to a **per-campaign `VibesLPFeeClaimer`** clone. The claimer is *soulbound*: it has no transfer, withdraw, rescue, pause, or admin function, so the LP receipt can never leave it. No party, including Vibestarter, can move the position or reclaim the liquidity. The lock is irreversible and recorded on-chain.

This is implemented in `VibesLPLocker.createAndLockLP()`. It is invoked exactly once per raise, at the moment of finalization.

The pool itself remains active. Trades against it continue to happen. Unlike a burned LP — where the trading fees the position earns would be stranded forever — the claimer **captures those fees**: the ETH-side fees route to the platform, and the project-token-side fees to the project's treasury (or are burned if the raise has no treasury). Settlement is permissionless, so anyone can trigger it, and the principal liquidity never moves. The pool is a permanent secondary market that nobody controls.

## 7.2 Why indefinite, not time-locked

Most token launch platforms time-lock LP for a period (six months, one year, two years). Vibestarter does not. The LP is locked in a claimer from which it cannot be recovered, at any time, by any party.

Three reasons.

**A time-locked LP is a future event that backers must price in.** A holder of project tokens who can see "LP unlocks in 73 days" knows there is a future moment at which the founder may withdraw all paired liquidity and convert it to ETH. This creates a predictable cliff in secondary market depth, which rational holders price into the token before the cliff. The closer the unlock approaches, the worse the depth. The "lock" provides a window of confidence that systematically narrows.

A permanently locked LP has no such future event. Depth at month one looks identical to depth at month thirty-six. There is no countdown.

**Time locks are a marketing tool. Permanence is a property.** A founder who can describe their LP as "locked for two years" is doing the launchpad equivalent of describing a vesting schedule as a commitment. It is a commitment with a known expiry. The interesting question is what happens after the expiry, and the honest answer for most platforms is *whatever the founder wants*. Permanence forecloses the question.

**It changes founder selection.** Founders unwilling to permanently abandon their paired LP self-select away from the platform. This is the desired effect. A founder who needs the option to pull liquidity at month thirteen is signaling a relationship to the project's secondary market that is incompatible with what backers are buying when they receive a transferable token.

The cost of this choice is that some legitimate use cases do not fit. A founder running a treasury-management strategy that involves rebalancing paired liquidity has no path on Vibestarter. They should use a different launchpad. The opinionation is the point.

## 7.3 What the holder actually gets

A backer who contributes ETH to a Vibestarter raise receives tokens denominated against three sources of value:

1. **Pro-rata claim on the project's success.** If the token gains value in the open market, the holder's position appreciates. Standard secondary-market exposure.
2. **Pro-rata claim on remaining escrow in the event of a successful challenge.** Described in Section 6.4. The holder can burn tokens for ETH at the freeze price.
3. **Pro-rata exit liquidity against the permanent pool.** At any time, the holder can sell into the Aerodrome pair created at finalization. The depth is whatever the trading activity since launch has accumulated to.

The third leg is what the indefinite lock guarantees. A holder selling at month nine of a raise faces the same on-chain depth profile as a holder selling at month two. The protocol does not promise that depth will be high — that depends on trading interest, founder execution, and broader market conditions. The protocol promises only that the depth will not be artificially yanked by the founder reclaiming the paired position.

## 7.4 LP creation failure modes

Locking an LP is not always trivially successful. The Aerodrome router can fail for reasons unrelated to the protocol (gas pricing, ordering, slippage at the moment of finalization). The contract handles this by routing failed LP creations to a **rescue mapping**, from which the operations admin can manually resolve and re-create the LP.

When a rescue happens, the ETH and tokens intended for LP creation are held by the LP locker contract until the admin completes the manual resolution. The admin calls `resolveRescuedFunds(campaign, to)` to forward the rescued ETH and tokens to a chosen recipient, who then manually creates the LP on Aerodrome and locks the receipt in a `VibesLPFeeClaimer` (or, as a legacy fallback, burns it to `0xdead`). The admin then proves the lock by calling `recordManualLPLock(...)`, which requires on-chain evidence that the claimer — or the dead address, for a legacy burn — holds at least the locked LP amount before the rescued state transitions to verified-locked. The May 2026 audit (finding VIB-09) hardened this path further: the supplied claimer must be a genuine `VibesLPFeeClaimer` clone for the campaign, so a non-canonical or withdrawable holder cannot be passed off as a permanent lock.

Without the `recordManualLPLock` step, the rescued campaign cannot complete its LP gate on the router, and the founder's tranche claims are permanently blocked. This is the audit fix originally described as H-4 (2026-04-15). It closes the trust gap where a manual rescue might be claimed to have happened without on-chain proof.

This is a clear example of where the protocol's centralized surface intersects with the contract's enforced guarantees. The admin can choose where to send the rescued funds. The admin cannot bypass the on-chain proof requirement. The trust boundary is the multi-sig that holds the LP locker owner role, and the published cosigner separation (Section 11) constrains what that multi-sig can do unilaterally.

## 7.5 What the indefinite lock does not solve

**Impermanent loss continues to exist.** The fee claimer holds an LP position; that position is subject to the same impermanent loss as any other LP position when the token price moves against the paired ETH. Holders selling against the pool effectively receive less than they would in an idealized setting where price had not diverged. This is a property of the AMM, not of the lock mechanism, and no protocol-level intervention can change it.

**Depth is not guaranteed to be useful.** A raise of 0.5 ETH produces an LP with 0.075 ETH on one side. The pool exists, but the depth is too thin for meaningful secondary trading. The protocol does not solve this — small raises produce shallow pools. The mitigation is that small raises are also low-stakes for backers, so a thin pool is appropriate.

**The pool is not a price oracle.** Trades against a low-volume permanent pool can move the price substantially with small orders. Holders should not treat the AMM mid-price as a fair-value indicator, particularly for raises with small total liquidity.

**Permanent does not mean *valuable forever*.** A pool with no trading activity is not a useful exit. If a project fails completely and trading dries up, the holder's exit liquidity is the same on-chain mechanism but functionally worthless. The lock guarantees the depth was not artificially removed. It does not guarantee anyone wants to trade.

The honest summary: the indefinite LP lock is one of the strongest commitments the protocol makes, but the commitment is *about the founder's future actions* (they cannot pull the LP), not *about the project's future value* (which depends on what the founder builds and how the market receives it).
