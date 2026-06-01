# 14. Appendix

> Glossary, parameter table, contract inventory, and references.

---

## 14.1 Glossary

**Backer.** A person who contributes ETH to a raise. The protocol uses *backer*, not *investor*, because contributions are not investments in the regulatory sense.

**Challenge.** A formal on-chain action by a token holder, raised against a pending tranche request, that places the holder's staked tokens into escrow pending admin review.

**Challenge window.** The 72-hour period that opens when a founder requests a tranche, during which holders meeting the graduated threshold may raise a challenge.

**Contribution.** ETH sent by a backer to a raise's escrow during the active raise window.

**Escrow (`VibesTranchEscrow`).** The per-raise contract that holds 85% of raised ETH and releases it according to the tranche schedule. One escrow clone per raise, deployed via EIP-1167.

**Finalization.** The moment a raise transitions from active to funded. Triggers LP creation, escrow setup, and token distribution to the appropriate contracts.

**Founder.** The person who launched a raise. The protocol uses *founder*, not *issuer*, because no securities are being issued.

**Frozen.** State of a campaign after a successful challenge or admin freeze. All future tranches are permanently blocked; the holder refund path is open.

**Holder refund.** The path by which a token holder claims a pro-rata share of frozen escrow ETH. Requires burning tokens to `0xdead` and submitting a merkle proof.

**Indefinite LP lock.** The mechanism by which 15% of a raise is paired against tokens, deposited in an Aerodrome pool, and the LP receipt locked in a soulbound per-campaign fee claimer. Permanent and irrecoverable by any party; the claimer captures trading fees while the principal stays locked.

**Kickstart (T0).** The first tranche, 10% of escrow, released immediately on finalization. The only tranche without a challenge window.
**Master admin.** The holder of the router's `owner` role. Expected to be a Gnosis Safe multi-sig. Can extract ETH above deposit reserves and alter infrastructure.

**Operations admin.** A separately-held role appointed by the master admin. Adjudicates challenges, publishes refund roots, and operates per-campaign actions. Cannot extract user funds.

**Origin Capsule.** The on-chain provenance record for a project, emitted via the `VibesCertified` event by `VibesRegistry`.

**Permanent LP.** See *indefinite LP lock*.

**Raise.** A specific crowdfunding campaign on Vibestarter. The protocol uses *raise*, not *ICO* or *token sale*, because the term is descriptive and not a securities term.

**Slash.** The 20% burn of a rejected challenger's staked tokens, sent to `0xdead`.
**Tranche.** A time-based release of capital from escrow to the founder. Seven tranches per raise: T0 (kickstart) plus T1 through T6 (monthly).

**Treasury (`VibesTreasuryEscrow`).** The per-raise contract holding the project's treasury token allocation. Withdrawals are proposal-based and challengeable.

**Vibecoded.** Built primarily with the assistance of AI coding agents. The platform's term for AI-assisted development.

**Vibecoin.** The token associated with a vibecoded project. Per-raise; not a single protocol token.

---

## 14.2 Parameter table

| Parameter | Value | Where set | Adjustable? |
|-----------|-------|-----------|-------------|
| `KICKSTART_BPS` | 1000 (10%) | `VibesTranchEscrow` | No |
| `MONTHLY_BPS` | 1500 (15%) | `VibesTranchEscrow` | No |
| `NUM_MONTHLY_TRANCHES` | 6 | `VibesTranchEscrow` | No |
| `TRANCHE_DURATION` | 30 days | `VibesTranchEscrow` | No |
| `CHALLENGE_WINDOW` | 72 hours | `VibesTranchEscrow` | No |
| `CHALLENGE_SLASH_BPS` | 2000 (20%) | `VibesTranchEscrow` | No |
| `CHALLENGE_COOLDOWN` | 7 days | `VibesTranchEscrow` | No |
| `CHALLENGE_THRESHOLD` (T0–T2) | 0.25% of supply | `VibesTranchEscrow.getChallengeThreshold()` | No |
| `CHALLENGE_THRESHOLD` (T3–T4) | 0.50% of supply | `VibesTranchEscrow.getChallengeThreshold()` | No |
| `CHALLENGE_THRESHOLD` (T5–T6) | 1.00% of supply | `VibesTranchEscrow.getChallengeThreshold()` | No |
| `PLATFORM_FEE_BPS` | 250 (2.5%) | `VibesTranchEscrow` | Master admin (via `setFeeConfig`) |
| `MIN_CONTRIBUTION` | 0.01 ETH | `VibesTranchEscrow` | No |
| `MERKLE_ROOT_DELAY` | 24 hours | `VibesTranchEscrow` | No |
| `MAX_TIME_DRIFT` | 1 hour | `VibesTranchEscrow` | No |
| `LP_BPS` | 1500 (15% of raise → LP) | Protocol | No |
| `ESCROW_BPS` | 8500 (85% of raise → escrow) | Protocol | No |
| `CLIFF` (founder vesting) | 180 days | `VibesVesting` | No |
| `VESTING_DURATION` (founder) | 365 days post-cliff | `VibesVesting` | No |
| `UNSTAKE_COOLDOWN` ($VIBES) | 7 days | `VibesStaking` | No |
| `MAX_RAISE_DURATION` | 30 days | `VibesTranchEscrowFactory` | No |
| `MAX_SCHEDULE_WINDOW` | 30 days | `VibesTranchEscrowFactory` | No |
| `Founder deposit` | 0.05 ETH (configurable) | Router | Master admin (via `setFounderDepositWei`) |
| `Launch token fee` | 0.5% of supply | Router | Master admin (via `setFeeConfig`) |

Parameters marked *No* are protocol-level constants and not adjustable per-raise or by any admin action without a contract upgrade.

---

## 14.3 Contract inventory

The deployed contract set on Base mainnet (chain ID 8453) at v0.1 of this paper:

| Contract | Address | Role |
|----------|---------|------|
| VibesLaunchRouterV2 | [TBD] | Main entry point |
| VibesTranchEscrowFactory | [TBD] | Escrow factory |
| VibesTokenFactory | [TBD] | Token factory |
| VibesLPLocker | [TBD] | LP creation and lock |
| VibesRegistry | [TBD] | Origin Capsule registry |
| VibesIdentityRegistry | [TBD] | ERC-8004 agent identity |
| VibesStaking | [TBD] | $VIBES staking |
| VibesStakerRewards | [TBD] | Staker reward distribution |
| VibesToken ($VIBES) | [TBD — TGE address] | Protocol token |

Per-raise contracts (`VibesTranchEscrow` clones, `VibesVesting` clones, `VibesTreasuryEscrow` instances, `VibesTokenDistributorV2` instances) have one deployment per raise. The full list is queryable from `VibesRegistry` events.

Canonical addresses are queryable on-chain from `VibesRegistry` events and are recorded at each deployment.

---

## 14.4 Audit reports

The contracts have been audited twice (April 2026 and May 2026), with findings remediated and re-tested in both cycles. A remediation summary is published at app.vibestarter.xyz/audit.

---

## 14.5 Source and verification

The deployed contracts are verifiable on-chain on Base. Contract addresses are queryable from `VibesRegistry` events; the protocol token and per-raise contracts can be inspected on a Base block explorer.

The whitepaper synthesizes; the referenced documents are authoritative for specific details.

---

## 14.7 Version history

| Version | Date | Notes |
|---------|------|-------|
| v0.1 | 2026-05-24 | Initial draft. Mechanism sections (4–9), system sections (10–13), and this appendix complete. Part 1 (sections 1–3) compressed from the original thesis. |

Future revisions will be tracked here. Material changes that affect the mechanism (parameter changes, decentralization-path stage transitions, new failure modes identified) will be reflected in version bumps.
