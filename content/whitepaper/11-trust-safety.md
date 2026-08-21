# 11. Trust and Safety

> The contracts cannot reason about the world. Some surfaces must be operated by humans. This section names them and describes the constraints under which they operate.

The honest position: every permissionless protocol that handles user funds has an operator layer of some shape. The question is not *whether* one exists (it always does, somewhere, even if it is implicit). The question is whether the operator layer is named and bounded by the contract, or whether it is hidden behind language like *decentralized* and *trustless* that the protocol cannot actually deliver.

Vibestarter's operator layer is explicit. It is structured around two principles: that no single party can act unilaterally on user funds, and that every operator action has a contract-enforced consequence the operator cannot override.

---

## 11.1 The two-tier admin model

The protocol distinguishes between two privileged roles. The separation is enforced by contract logic, not by convention.

### Master Admin (`VibesLaunchRouterV2.owner`)

The master admin is the holder of the router's `owner` role. It is held by a **Gnosis Safe multi-signature wallet**, the M-1 Safe (2-of-2 today, moving to 2-of-3; 3-of-5 recommended at scale).

Its powers, the ones that can move user funds or alter infrastructure, include:

- `pause()` / `unpause()`: global emergency stop
- `setEscrowFactory()` / `setLPLocker()`: replace infrastructure contracts
- `setFeeConfig()`: adjust platform fee parameters
- `setOperationsAdmin()`: appoint or revoke the operations admin
- `rescueETH()`: withdraw ETH from the router contract above deposit reserves
- `rescueERC20()`: rescue stuck ERC20 tokens, guarded by active-claim/escrow/LP checks
- `forfeitDeposit()`: seize a founder's deposit and send it to the fee recipient
- `transferOwnership()`: initiate two-step ownership transfer

The master admin is the only role that can extract ETH from the router. This is the highest-trust surface in the system. The mitigations:

- **Multi-sig only.** A single-EOA master admin is incompatible with operating the platform. The deployment configuration enforces transfer to a Safe after launch.
- **Two-step transfer.** Ownership changes require acceptance by the new holder, preventing transfers to inaccessible addresses.
- **Bounded rescue scope.** `rescueETH` is bounded by the deposit reserves tracked on the router; founder deposits cannot be drained via rescue.
- **Public on-chain visibility.** Every action by the master admin is visible on-chain. Multi-sig transactions show their signers; rescue events are emitted; pause/unpause events are emitted.

### Operations Admin (`VibesLaunchRouterV2.operationsAdmin`)

The operations/escrow admin is a separately-held role, revocable at any time. In the deployed configuration it is **M-3, a dedicated single-key hot EOA** (not a multisig), kept hot for minute-level freeze response. **NOTE (admin split, 2026-06-07):** the escrow/challenge admin is sourced from `factory.admin` = M-3 (single key) and is passed to every new escrow at creation time as its `admin`; the router `operationsAdmin` (which feeds the **treasury** admin, including the irreversible burn) is the **M-1 Safe**, not M-3.

The escrow/challenge admin's powers (M-3), exercised across all per-raise escrows (the two treasury-challenge functions below are exercised by the **M-1 treasury admin**, not M-3, since the 2026-06-07 split):

- `upholdChallenge()` / `rejectChallenge()`: adjudicate challenges
- `freezeCampaign()`: freeze a funded campaign for holder refunds
- `setRefundMerkleRoot()`: publish refund merkle root (commit-reveal gated)
- `pauseCampaign()` / `resumeCampaign()`: pause specific raises
- `forceRefundDuringRaise()`: terminate an active raise pre-finalization
- `emergencyRefundFunded()`: emergency refund path for funded raises
- `upholdChallengeRework()` / `upholdChallengeMalicious()`: treasury challenge adjudication

What the operations admin **cannot** do:

- Move user funds to arbitrary addresses. Every action above either returns funds to identified holders, slashes to `0xdead`, or freezes funds in place.
- Alter the tranche schedule. The schedule is hard-coded in the escrow.
- Change the LP lock. The LP receipt is permanently held in a soulbound per-campaign fee claimer with no withdraw path.
- Bypass the commit-reveal delay on refund merkle roots.
- Adjust the slash percentage or the challenge window length.
- Call any function on the master admin's surface (rescue, pause, infrastructure changes).

If the operations admin is compromised, the worst-case scenario is bounded: an attacker can freeze campaigns and burn individual treasuries, but cannot exfiltrate ETH. The master admin can revoke a compromised operations admin in a single transaction via `setOperationsAdmin(newAddress)`. The operations admin is, by design, a *fast-revocable* role.

## 11.2 Off-chain key topology (Safes + EOAs)

Beyond the on-chain `owner` and `operationsAdmin` roles, the operational roles sit at the organizational level across **two Gnosis Safes (M-1, M-4) plus two single-key EOAs (M-2 cold, M-3 hot)** on Base. The two Safes use a 2-of-2 threshold today (moving to 2-of-3); **M-2 and M-3 are single keys, not multisigs.**

| Safe | Role | Purpose |
|------|------|---------|
| M-1 | Platform Operations | Receives 2.5% ETH tranche fees (no token-side launch fee exists). Pays platform infrastructure costs. |
| M-2 | $VIBES Raise Founder Wallet | Receives Vibestarter's own raise tranche payouts (pre-entity custody). |
| M-3 | Ops/escrow admin (single-key hot EOA, not a multisig) | Holds the escrow/factory `admin` role (from `factory.admin`): adjudicates raise/tranche challenges, freezes, force-refunds. The router `operationsAdmin` (treasury admin) is M-1, not M-3, since the 2026-06-07 split. |
| M-4 | Community Rewards | Administers the `VibesCommunityRewards` contract (post-cliff distribution batches). |

**Separation of concerns** is enforced by cosigner policy:

- M-2 (founder wallet) and M-3 (escrow/challenge admin) are **distinct single-key EOAs**: separate keys, no shared control.
- The two Safes (M-1, M-4) limit cosigner overlap to at most one shared seat to avoid over-concentration.
- For challenges against the $VIBES raise itself, the founder's adjudication conflict is mitigated by **off-chain transparency** (the published challenge standards), since M-3 is a single key with no on-chain cosigner; M-3 only executes the publicly-reasoned decision.

The cosigner separation prevents the obvious failure modes (the founder adjudicating challenges against themselves; the same parties controlling both the platform fee wallet and the protocol admin) without requiring perfect role isolation, which is impractical at small operating scale.

## 11.3 The `_excludeAddresses` parameter

One specific operator surface deserves explicit discussion because it is the highest-trust function in the system that does not move funds.

When `upholdChallenge()` or `freezeCampaign()` is called, the admin supplies an `_excludeAddresses` array. Addresses in this array are excluded from the `frozenTotalSupply` denominator that determines the proportional refund amount for each holder. The math: a holder burning $X$ tokens receives `(frozenEthBalance × X) / frozenTotalSupply` ETH back. A smaller `frozenTotalSupply` means each remaining token redeems for more ETH.

The reason this parameter exists: at freeze time, some addresses holding the project's token may be legitimately non-redeemable. Examples include the founder's vesting contract (already partially burnable via the malicious-challenge path), the treasury contract (subject to its own challenge mechanism), and the burn address itself. Including these in the refund denominator would over-dilute the refunds to actual backers, which is the opposite of what the freeze is trying to accomplish.

The trust risk: a malicious admin could in principle exclude addresses they should not, increasing the refund for specific holders (or for themselves, if they hold tokens via an address the admin chooses to exclude only conditionally).

The mitigations:

- **Publication and review.** The `_excludeAddresses` array is part of the on-chain transaction. Any holder can verify which addresses were excluded.
- **Challenge standards.** The challenge standards (Section 6.6) define the off-chain policy for which addresses are excluded under what circumstances. Deviations are publicly auditable.
- **On-chain publication (no cosigner consent).** M-3 is a single-key hot EOA, so the `_excludeAddresses` array is **not** gated by cosigner approval; the mitigations are its on-chain visibility, the 24-hour `MERKLE_ROOT_DELAY`, the published challenge standards, and, for the $VIBES raise, off-chain recused adjudication.
- **24-hour `MERKLE_ROOT_DELAY`.** After the freeze, the admin must commit a refund merkle root and then wait 24 hours before claims open. Holders can verify the root during this window and surface complaints before any ETH moves.

This is one of the surfaces where the protocol relies on transparency and review rather than pure on-chain enforcement. It is named here because pretending otherwise would be the kind of dishonesty Section 4.1 ruled out.

## 11.4 Audit history

The contracts have been through one external audit (ZXVC LLC, May 2026) plus internal review cycles (April and June 2026). All High findings were remediated and re-tested; certain centralization findings (no admin timelocks on the treasury burn / infrastructure setters) are accepted or deferred and disclosed as residual risk.

### April 2026 audit

Issued findings across multiple severity levels. The fixes that landed on 2026-04-15 include:

- **H-1: Testnet time-drift parity.** Testnet variant of escrow now enforces the same `MAX_TIME_DRIFT = 1 hours` as mainnet. Enforced in CI by `AuditTestnetParityGuard2026_04.t.sol`.
- **H-2: Testnet merkle-root-delay parity.** Testnet `MERKLE_ROOT_DELAY = 24 hours` identical to mainnet.
- **H-3: Cross-contract finalization guard.** Token claim path hard-requires `finalizationPhase == FullyComplete`. Emergency refund queries router finalization state via try/catch. Prevents token-plus-ETH double-dip.
- **H-4: Proof-based LP lock recording.** `recordManualLPLock` requires on-chain proof that the LP receipt is held by the campaign's fee claimer (or `0xdead`, for a legacy burn) before transitioning rescued state to verified-locked.
- **H-06 (earlier): Oracle time-drift guard.** Time oracle reads bounded by `MAX_TIME_DRIFT = 1 hours`.
- **L-1: Reentrancy guard on `resolveRescuedFunds`.** Added 2026-04-15.

### May 2026 audit

Follow-up audit covering the staking and rewards contracts and the contracts modified post-April. Findings and remediations are summarized at app.vibestarter.xyz/audit.

The audit findings should be treated as the authoritative source for known issues; this paper does not substitute for them. A remediation summary is published at app.vibestarter.xyz/audit.

## 11.5 Incident response

The platform maintains a documented incident response procedure. The key components:

- **Pause as a first action.** The master admin can pause the router globally while an incident is triaged.
- **Per-campaign pause.** The operations admin can pause a specific raise without halting the entire platform.
- **Force refund.** The operations admin can terminate an active raise pre-finalization, returning all ETH to contributors.
- **Public communication.** Incident-class events trigger public communication via the platform's announced channels.

Incidents that have happened on-chain are publicly verifiable through the chain history. The platform commits to publishing post-mortems for material incidents, including the timeline of detection, the parties involved in response, and the contract-level actions taken.

## 11.6 What the safety model does *not* cover

A short list of risks that the trust and safety model explicitly does not address:

- **Founder choices that are within their rights.** A founder who claims all tranches on schedule and then ships nothing valuable is not committing a contract violation. The protocol releases the schedule; the market values the result.
- **Off-chain regulatory action.** A jurisdiction may determine that a token was issued in violation of local law. The protocol cannot prevent that determination. Section 13 covers regulatory risk.
- **Smart contract bugs.** Audits reduce the probability of unknown bugs; they do not eliminate it. A previously-unknown bug could result in loss of funds. The audit history is the relevant disclosure.
- **Bridge or chain-level risk.** The contracts deploy on Base. Risks to Base itself (sequencer downtime, L2 finality issues, or systemic problems in the Ethereum L1 settlement layer) are outside the protocol's control.
- **Wallet compromise.** A backer whose wallet is compromised has lost their tokens via the standard ERC20 transfer path. The protocol has no recovery mechanism for individual user compromise.

These limits are the boundary of what an honest trust-and-safety section can claim. Everything else (the contract guarantees, the operator constraints, the audit findings) is on-chain or in the public audit record.
