# 12. Governance and the Decentralization Path

> The protocol does not pretend to be fully decentralized today. This section names every centralized surface, explains why it is centralized at launch, and describes the path on which it decentralizes.

A protocol that ships honest decentralization claims must distinguish between three categories: surfaces that are already permissionless, surfaces that are centralized and will remain so, and surfaces that are centralized today and decentralize on a published path. Mislabeling any of these is the standard pattern of dishonesty in this space. The position here is to name each one.

---

## 12.1 What is already permissionless

The protocol layer is permissionless today. Without any operator action:

- **Anyone can create a token** through the router's simple `launch()` path: no signature,
  no approval, no whitelist at the contract level.
- **Raise launches are gated during the current curated phase.**
  `VibesLaunchRouterV2.launchWithCampaign()` requires a platform-issued EIP-712 launch
  signature (`trustedLaunchSigner`), and the platform issues it only to wallets meeting the
  published criteria, which in the current phase include an approved founder application
  reviewed against a published rubric (see the Launch Admission & Moderation Policy).
  Permissionless raise admission remains the stated end-state of this document; until the
  curated phase ends, describing the launch path as sign-off-free would be false, so we
  don't. Backing, challenging, claiming, and refunds below are permissionless today.
- **Anyone can back a raise** by sending ETH to the escrow's `contribute()` function during the active window (subject to the platform terms signature that enforces ToS acceptance and sanctions screening). No accreditation, no minimum reputation.
- **Anyone can hold and transfer tokens** issued by raises. The tokens are standard fixed-supply ERC20s with no transfer restrictions.
- **Anyone holding a tranche-challenge threshold can raise a challenge** during a challenge window. The threshold is graduated (Section 6.2) but the action is permissionless.
- **Anyone can support a challenge** by calling `supportChallenge()` while holding any non-zero token balance.
- **Anyone can claim a tranche on behalf of the founder** after the challenge window expires uneventfully. The function is permissionless; the funds flow to the founder's pre-set address regardless of caller.
- **Anyone can claim a refund** they are entitled to (contributor refund for failed raises, holder refund for frozen raises via merkle proof, excess refund for pro-rata oversubscription).
- **Anyone can stake $VIBES** by calling `VibesStaking.stake()`. No allowlist.

These are the on-chain interactions a backer or founder will typically have with the system. Apart from the launch-signature gate named above (and the terms signature on gated actions), none require Vibestarter Labs' permission.

## 12.2 What is centralized today

The centralized surfaces. Each is named with the reason it currently requires operator involvement.

### Launch admission (curated phase)

The backend launch signature is the enforcement point for sanctions screening, terms
acceptance, and, in the current phase, the curated founder-application review. The review
operates against the published rubric in the Launch Admission & Moderation Policy; every
decision is logged with its reason.

**Why centralized:** the platform launched invite-only as a trust-model control; the
application review is the per-launcher screen against fraud and impersonation while
reputation infrastructure matures.

**Path:** the stated end-state is permissionless admission: the signature remains as a
mechanical screen (sanctions, geo, terms) with no per-founder discretion. The curated phase
ends on a published decision, not silently.

### Challenge adjudication

The challenge review (Section 6) is performed by the operations admin (M-3, a single-key hot EOA). The admin decides whether to uphold, reject, or let expire each challenge. Backers have 72 hours to file after a tranche request; once filed, the admin has a 7-day adjudication window before the challenge auto-expires in the founder's favor (raises launched before the PC-09 cut-over, including $VIBES, run both clocks at 72 hours; the constants are immutable per escrow).

**Why centralized:** A contract cannot read the world. Determining whether a founder has actually abandoned a project, whether claimed progress is real, or whether a missed deadline reflects fraud or strategic pivot requires off-chain judgment. Until a decentralized adjudication mechanism (jury panels, prediction markets, community vote) has been built and stress-tested, the operations-admin key is the practical answer.

**Constraints today:** The admin can only choose between contract-defined outcomes (uphold, reject, expire). The admin cannot move funds to arbitrary destinations, cannot adjust slash percentages, and cannot skip the commit-reveal delay on refund roots. The challenge standards (Section 6.6) define the criteria the admin uses, and deviations are publicly auditable.

### Refund merkle root publication

After a campaign is frozen, the admin publishes a refund merkle root that snapshots holder balances. Holders then claim against the root.

**Why centralized:** The snapshot must be taken at a specific block, must correctly capture all holder balances, and must apply the `_excludeAddresses` policy described in Section 11.3. This is bookkeeping that requires off-chain computation against on-chain state.

**Constraints today:** The 24-hour commit-reveal delay (`MERKLE_ROOT_DELAY`) gives holders time to verify the published root before claims open. The root is publicly inspectable. Holders who believe the root is incorrect can surface complaints during the delay window.

### `_excludeAddresses` policy

The exclusion array passed to `upholdChallenge()` and `freezeCampaign()` is an admin decision.

**Why centralized:** The set of legitimately non-redeemable addresses (vesting contracts, treasuries, the burn address itself) varies per raise and is not derivable on-chain without additional infrastructure.

**Constraints today:** Governed by the challenge standards (Section 6.6). Visible on-chain in the transaction. Subject to operations-admin review (M-3, a single key) and the published challenge standards.

### Reputation display

The reputation surfaced for founders and backers (Section 8), meaning Ethos scores and on-chain history, is fetched and presented off-chain by the platform.

**Why centralized:** The signals are sourced from third parties (Ethos) and from on-chain data that must be queried and rendered. Which signals are surfaced, and how they are presented in the interface, is a product decision.

**Constraints today:** The underlying data is externally sourced and independently verifiable: anyone can check a wallet's Ethos score or its on-chain history directly, without the platform's involvement. Vibestarter curates the presentation; it does not control or custody the data.

### Infrastructure parameter changes

Adjustments to platform fee configuration, founder deposit amounts, the escrow factory address, the LP locker address, and similar infrastructure changes are master admin actions.

**Why centralized:** Some of these require coordinated upgrades (a new escrow factory must be deployed and authorized in a specific sequence). Others reflect operating-cost considerations that change over time (fee structures, deposit amounts).

**Constraints today:** All such changes require master admin (the M-1 Safe) action. Each emits public events. A timelock layer is recommended for infrastructure changes and is on the roadmap (see 12.4).

### Operations admin appointment

The master admin appoints and can revoke the operations admin via `setOperationsAdmin()`.

**Why centralized:** Until the operations admin is held by a sufficiently large multi-sig with a community-elected composition, the master admin's appointment of the operations admin is the practical mechanism.

**Constraints today:** The operations admin cannot extract user funds. A compromised or malicious operations admin can be revoked in a single transaction.

## 12.3 What will remain centralized

A short list of surfaces that are not on a decentralization path, with reasons.

- **Emergency pause.** The router's pause capability is intentionally fast and unilateral (within the multi-sig). A pause is a defensive action that must be available in seconds during an incident; routing it through a community vote would defeat its purpose.
- **Fund rescue (`rescueETH` / `rescueERC20`).** Bounded by deposit reserves and active-claim checks, but the master admin's ability to recover stuck funds is essential to operating the platform. Decentralizing this fully would mean accepting that legitimately-stuck funds (failed transactions, mis-sent tokens) become unrecoverable.
- **The protocol's own raise (`$VIBES`) parameters.** The Vibestarter Labs raise itself uses admin overrides (the `disableStakerAllocation` flag, the community-rewards authorization) that are not available to other launches. This is permanent: these overrides exist specifically because the protocol cannot stake against itself at launch and because the community rewards path requires special atomic deployment.
- **The platform fee.** Fees are configurable by the master admin within bounds. The expectation is that fees move down over time, not up, but the protocol does not commit to a maximum.

These are not failures of decentralization; they are the load-bearing operator functions that any honest platform requires.

## 12.4 The decentralization path

For the surfaces in 12.2 that are on a decentralization path, the staged plan:

### Stage 1: Multi-sig consolidation (current)

The escrow/challenge admin role is held by M-3, a single-key hot EOA (kept hot for minute-level freeze response; **not a multisig**). The master + treasury admin is the M-1 Safe. For the protocol's own raise, the founder's adjudication conflict is mitigated by off-chain transparency (the published challenge standards), not by an on-chain cosigner; an on-chain guardian module to move M-3's non-freeze setters behind a multisig is planned, not yet deployed.

**Status:** in place.

### Stage 2: Challenge standards transparency

The criteria the operations admin uses to adjudicate challenges are published in this paper (Section 6.6). Deviations from published standards are publicly visible and grounds for community complaint.

**Status:** in place.

### Stage 3: Adjudicator diversification

M-3 (currently a single-key hot EOA) is migrated to a multi-sig that includes community members beyond Vibestarter Labs. The cosigner set is rotated periodically. The criteria for cosigner inclusion are published.

**Status:** roadmapped post-mainnet.

### Stage 4: Specialized adjudication panels

Challenges of different types (suspected fraud, missed deliverables, treasury proposal disputes) are routed to specialized panels with relevant expertise. Each panel is a sub-multisig with its own cosigners.

**Status:** roadmapped.

### Stage 5: Community-elected adjudicators

Adjudicators are elected by $VIBES stakers or a similar credibly-decentralized constituency. Elections are time-bounded and the elected adjudicators have term limits.

**Status:** longer-term, contingent on a stable staking economy and meaningful participation.

### Stage 6: On-chain dispute resolution

Where possible, individual elements of adjudication are moved on-chain (e.g., automated verification of specific milestone-style claims, prediction-market-based resolution for ambiguous cases, jury panels with stake-weighted voting). The operations admin retains final authority for cases that cannot be resolved on-chain.

**Status:** research-stage, contingent on the maturity of decentralized dispute resolution primitives.

### Timeline

The protocol does **not** publish a specific calendar for these stages. Committing to specific dates for decentralization is the kind of promise that gets broken loudly in this space, and we would rather make the path visible and the criteria explicit than commit to dates we may have to revise.

What we will commit to: each stage transition will be publicly announced, including the change to the on-chain configuration, the cosigner set (if relevant), and the new published criteria.

## 12.5 The honest reality

Decentralization is a property of *what the protocol enforces in code*, not of *what the operator promises in marketing*. The contract-enforced commitments described in Sections 5 through 10 are decentralized: they are guaranteed by deployed code, not by Vibestarter Labs' continued cooperation. A Vibestarter Labs that disappears tomorrow cannot retroactively shorten a challenge window, accelerate a tranche, or unlock the permanent LP.

What requires continued operator involvement: adjudicating challenges, publishing refund merkle roots, maintaining the reputation system. A Vibestarter Labs that disappears tomorrow without first transferring these roles to a successor would leave the protocol in a *degraded mode*: tranches continue to release on time, but no one can act on challenges and no one can publish refund roots for frozen campaigns.

This is the honest framing. The contract guarantees are robust to operator failure. The operational layer is not. The decentralization path in 12.4 is the work of making the operational layer also robust to operator failure, by distributing the operator role across an increasingly diverse and credibly committed set of parties.
