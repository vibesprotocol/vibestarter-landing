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
| `CHALLENGE_WINDOW` (filing + payout delay) | 72 hours | `VibesTranchEscrow` | No |
| `ADJUDICATION_WINDOW` (filed challenge → auto-expiry; PC-09, post-cut-over raises — $VIBES remains 72h) | 7 days | `VibesTranchEscrow` | No |
| `ADJUDICATION_WINDOW` — treasury (filed treasury-proposal challenge → auto-expiry; PC-10, treasuries created by a post-PC-10 router — $VIBES treasury remains 72h) | 7 days | `VibesTreasuryEscrow` | No |
| `CHALLENGE_SLASH_BPS` | 2000 (20%) | `VibesTranchEscrow` | No |
| `CHALLENGE_COOLDOWN` | 7 days | `VibesTranchEscrow` | No |
| `CHALLENGE_THRESHOLD` (T0–T2) | 0.25% of supply | `VibesTranchEscrow.getChallengeThreshold()` | No |
| `CHALLENGE_THRESHOLD` (T3–T4) | 0.50% of supply | `VibesTranchEscrow.getChallengeThreshold()` | No |
| `CHALLENGE_THRESHOLD` (T5–T6) | 1.00% of supply | `VibesTranchEscrow.getChallengeThreshold()` | No |
| `platformFeeBps` | 0 (no fee) on Base and Robinhood Chain, hard cap 1000 (10%); the $VIBES escrow predates the factory setting and carries a fixed 250 (2.5%, `PLATFORM_FEE_BPS`) | `VibesTranchEscrow`, stamped at launch from the factory setting | **No** — fixed for the life of each raise, no setter; the factory setting for *future* raises is adjustable by the master admin (`setPlatformFeeBps`) |
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
| `Founder deposit` | 0.01 ETH (configurable; refunded on successful finalization) | Router | Master admin (via `setFounderDepositWei`) |
| `Launch fee (flat ETH, optional)` | 0 (off) | Router | Master admin (via `setFeeConfig`) |

Parameters marked *No* are protocol-level constants and not adjustable per-raise or by any admin action without a contract upgrade. `setFeeConfig` controls only the router-level flat launch fee; the escrow's `platformFeeBps` is fixed per raise at creation, with `setPlatformFeeBps` adjusting the factory setting for future raises only.

---

## 14.3 Contract inventory

The deployed contract set on Base mainnet (chain ID 8453) at v1.0 of this paper:

| Contract | Address | Role |
|----------|---------|------|
| VibesLaunchRouterV2 | `0x783a7DB4113DC35A87dA43319af3cA7E6428f4BC` | Main entry point |
| VibesRouterExtension | `0x2bF527A8e8EE070D7b68d92728e171338AA95602` | Router delegate logic |
| VibesTranchEscrowFactory | `0x36C7e2d87F4E2d33b70304EbaA81eE88CB04Bf86` | Escrow factory (PC-11 generation, active since the 2026-08-27 cut-over) |
| VibesTranchEscrow (implementation) | `0xcBe7e9E13576838eb4B55d0793Fd1CFFC1Dea43d` | Escrow clone target (PC-11 generation, active since the 2026-08-27 cut-over) |
| VibesTokenFactory | `0x3671DBD5CFaF1D0D5c15a18b65F2CC7AcC7faE29` | Token factory |
| VibesLPLockerV2 | `0x728D954fC216396B2b5a272D12562E8A557E35b2` | LP creation and lock (discount-aware V2, active since the 2026-06-14 cut-over) |
| VibesLPFeeClaimer (implementation) | `0x3697f4eBa88bF657569553Ec6EC3178c74D10109` | Per-campaign fee-claimer clone target |
| VibesRegistry | `0x66b74176F53d3081a87F75e10aD6cF554174Aef9` | Origin Capsule registry |
| VibesCommunityRewardsFactory | `0x2f176b0bcAA34f153BDA9C70C34736A427eAa0a7` | Deploys per-raise community-rewards distributors |
| VibesGenesisNFT | `0xC7eF2436e5AEc99bB55cC31B73bE2680634118e0` | Soulbound backer commemorative NFT |
| VibesToken ($VIBES) | `0xefFC8815487084a97edfdfF968b56Ea123421Acb` | Protocol token |
| VibesStaking | `0xF3c0113d79FF68c3b3A7A533f8C4F2a240517292` | $VIBES staking (deployed 2026-08-27 in its own ceremony) |
| VibesStakerAllocations | `0x8a6d46cB0f56DFCd0CfBBfb985e27fC3398F898a` | Staker allocation distribution (formerly VibesStakerRewards); allocations active since 2026-08-27 |
| VibesIdentityRegistry | Not yet deployed | ERC-8004 agent identity |

Per-raise contracts (`VibesTranchEscrow` clones, `VibesVesting` clones, `VibesTreasuryEscrow` instances, `VibesTokenDistributorV2` instances, `VibesLPFeeClaimer` clones, and `VibesCommunityRewards` instances for raises that carry a community allocation) have one deployment per raise. The full list is queryable from `VibesRegistry` events.

Canonical addresses are queryable on-chain from `VibesRegistry` events and are recorded at each deployment.

---

## 14.4 Audit reports

The contracts have had one external audit (ZXVC LLC, May 2026) plus internal review cycles (April and June 2026). All High findings were remediated and re-tested; certain centralization findings (no admin timelocks on the treasury burn / infrastructure setters) are accepted or deferred and disclosed as residual risk. A remediation summary is published at app.vibestarter.xyz/audit.

---

## 14.5 Source and verification

The deployed contracts are verifiable on-chain on Base and Robinhood Chain. Contract addresses are queryable from `VibesRegistry` events; the protocol token and per-raise contracts can be inspected on either chain's block explorer.

The whitepaper synthesizes; the referenced documents are authoritative for specific details.

---

## 14.7 Version history

| Version | Date | Notes |
|---------|------|-------|
| v0.1 | 2026-05-24 | Initial draft. Mechanism sections (4–9), system sections (10–13), and this appendix complete. Part 1 (sections 1–3) compressed from the original thesis. |
| v1.0 | 2026-08-21 | Live release. Copy-editing pass across all sections (phrasing and punctuation only); no mechanism or parameter changes. |
| v1.1 | 2026-10-06 | Platform fee stated as configured on Base and Robinhood Chain: no fee on tranche releases, with the $VIBES escrow's fixed 2.5% as the one exception (5, 9, 10, 11, 14.2). Worked examples (9) use a 5% founder and 12.5% treasury allocation. |
| v1.1.1 | 2026-10-06 | Safe thresholds as read on-chain (1, 11): M-1 2-of-3 on Base and Robinhood Chain, M-4 2-of-2. The 9.1 example pairs the LP at the backer entry price −5% (about 102.6M $LOOM), and the 9.1–9.2 holder figures follow from it. Contract overview (10) states no file count. No mechanism or parameter changes. |

Future revisions will be tracked here. Material changes that affect the mechanism (parameter changes, decentralization-path stage transitions, new failure modes identified) will be reflected in version bumps.
