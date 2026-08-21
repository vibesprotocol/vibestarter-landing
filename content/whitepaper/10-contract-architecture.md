# 10. Contract Architecture

> A short tour of the contract topology that implements the mechanism described in Sections 5 through 8. This is an overview, not a specification; the deployed contracts are the authoritative technical reference.

The implementation comprises fourteen Solidity contracts deployed on Base (chain ID 8453), of which twelve are core protocol and infrastructure and two are testnet-only variants. All contracts target Solidity ^0.8.20 and use OpenZeppelin v5 primitives (ReentrancyGuard, SafeERC20, two-step Ownable patterns).

---

## 10.1 The topology

```
VibesLaunchRouterV2  ──  main entry point
│
├── VibesTokenFactory          (deploys per-raise ERC20 tokens)
├── VibesRegistry              (immutable provenance registry — Origin Capsules)
├── VibesTranchEscrowFactory   (EIP-1167 minimal-proxy factory)
│   └── VibesTranchEscrow      (per-raise escrow clone)
│       ├── Contributions      (ETH in from backers)
│       ├── Tranches           (ETH out to founder, time-gated)
│       ├── Challenges         (backer disputes per Section 6)
│       └── Refunds            (ETH back to holders if frozen)
├── VibesLPLocker              (creates and permanently locks Aerodrome LP per Section 7)
├── VibesVesting               (per-raise founder vesting clone)
├── VibesTreasuryEscrow        (per-raise treasury with challengeable proposals)
├── VibesTokenDistributorV2    (merkle-based backer claim + ETH refund)
└── VibesStakerRewards         (merkle-based staker reward distribution)

VibesStaking                   (independent — $VIBES staking with 7-day cooldown)
VibesIdentityRegistry          (independent — ERC-8004 agent identity registry)
```

The **router** is the single point of contact for a launch. A founder calling `launchWithCampaign()` triggers, in one transaction, the deployment of a fresh token, the cloning of a fresh escrow, the cloning of a fresh vesting contract, the LP creation and lock, the treasury setup, and the registration of the project's Origin Capsule. After the launch transaction completes, the per-raise contracts operate autonomously according to their encoded rules; the router is not consulted again except for the final tranche-completion gate.

This shape (*single entry, per-raise clones*) is the result of two constraints. First, the per-raise state (escrow balance, tranche schedule, challenge history) is the kind of thing that must not be commingled across projects, so each raise needs its own contract instance. Second, deploying a full new contract per raise would be gas-prohibitive, so the per-raise contracts are EIP-1167 minimal proxies pointing to a shared implementation. The implementation logic is shared; the storage is isolated.

## 10.2 The core protocol contracts

### VibesLaunchRouterV2 (1,092 lines)

The entry point. Implements `launchWithCampaign()` (atomic launch + raise creation), administers the platform-level fee configuration, holds the master admin role (`owner`) and the operations admin role (`operationsAdmin`), and gates the final LP completion check that allows tranche claims to proceed.

The router is the only contract with `pause`/`unpause` capability. A paused router halts new launches, new contributions, and new tranche claims across the entire platform. This is the protocol's emergency-stop primitive and is restricted to the master admin (a multi-sig).

### VibesTranchEscrow (1,220 lines)

Per-raise. Holds the 85% of raised ETH that is not paired against the LP. Implements the tranche schedule (`requestTranche`, `claimTranche`, `expireChallengeIfNeeded`), the challenge mechanism (`raiseChallenge`, `upholdChallenge`, `rejectChallenge`, `supportChallenge`), the refund paths (contributor refund for failed raises, holder refund for frozen raises, excess refund for pro-rata oversubscription), and the operator escape hatches (`pauseCampaign`, `forceRefundDuringRaise`, `emergencyRefundFunded`).

The escrow is the contract that most directly implements the design goals from Section 4. Its constants (`KICKSTART_BPS = 1000`, `MONTHLY_BPS = 1500`, `PLATFORM_FEE_BPS = 250`, `CHALLENGE_WINDOW = 72 hours`, `CHALLENGE_SLASH_BPS = 2000`, `CHALLENGE_COOLDOWN = 7 days`, `MAX_TIME_DRIFT = 1 hours`, `MERKLE_ROOT_DELAY = 24 hours`) are protocol-level and not adjustable per-raise.

### VibesLPLocker (256 lines)

Creates the Aerodrome volatile-pair pool at finalization, transfers the resulting LP receipt to a per-campaign `VibesLPFeeClaimer` (soulbound: it captures Aerodrome trading fees while the principal liquidity stays locked), and records the lock on-chain. Includes the `resolveRescuedFunds` / `recordManualLPLock` path (Section 7.4) for handling LP creation failures.

### VibesVesting (256 lines)

Per-raise. Implements the founder's 18-month vesting schedule: 180-day cliff (0% vested), then 365 days of linear vesting (0% → 100%). The freezer role can burn all unvested founder tokens to `0xdead`, used when a treasury challenge is upheld as malicious (Section 11).

### VibesTreasuryEscrow (459 lines)

Per-raise. Holds the treasury portion of the token allocation. Operates a proposal-based withdrawal model: the treasury admin proposes a withdrawal, the proposal is challengeable on the same general pattern as tranche challenges, and upheld challenges can either block the proposal (rework) or burn the entire treasury (malicious: the nuclear option that also freezes founder vesting).

### VibesTokenDistributorV2 (401 lines)

Per-raise. Handles the merkle-based distribution of backer tokens after finalization, plus any ETH refunds from failed or frozen raises. Backers claim with a merkle proof of their allocation. Unclaimed allocations can be swept by the admin after a six-month window, with `totalPendingEthRefunds` protected from the sweep.

## 10.3 The infrastructure contracts

### VibesTranchEscrowFactory (252 lines)

Deploys escrow clones using EIP-1167. Holds the maximum-raise-duration constant (`MAX_RAISE_DURATION = 30 days`) and the maximum scheduling window. The authorized router and the LP locker address are set here and used by every escrow clone.

### VibesTokenFactory (50 lines)

Deploys fixed-supply ERC20 tokens. No access controls: anyone can call it. The minimalism is intentional: the factory has no authority, makes no claims about the deployed tokens, and is interchangeable with any other token factory.

### VibesRegistry (213 lines)

The provenance layer. When a raise launches through the authorized router, the registry emits a `VibesCertified` event committing the project's Origin Capsule on-chain. The capsule includes the launch metadata, the founder's wallet, the project description hash, and other provenance fields. The registry is append-only.

### VibesIdentityRegistry (205 lines)

ERC-8004 identity registry for AI agents associated with the platform. Independent of the launch path; allows agents acting on behalf of users (autonomous backers, automated challenge monitoring) to maintain on-chain identity.

## 10.4 The staking contracts

### VibesStaking (301 lines)

Independent of the launch path. Allows $VIBES holders to stake their tokens with a 7-day unstaking cooldown. Implements lazy per-user balance snapshots (audit fix F4) so that the reward-distribution contract can compute accurate stake-weighted allocations without requiring a global snapshot.

### VibesStakerRewards (500 lines)

Distributes Vibetokens (the per-raise tokens) to $VIBES stakers on a snapshot-and-accumulator pattern. Each new raise allocates 2.5% of its token supply to the rewards contract, distributed pro-rata against staked $VIBES at the time of the raise.

## 10.5 Security patterns

The contracts use a small, opinionated set of security primitives. The list is not exhaustive; it is the set that recurs across multiple contracts:

- **OpenZeppelin ReentrancyGuard** on every ETH-handling contract (eight contracts).
- **OpenZeppelin SafeERC20** for all token transfers (seven contracts).
- **Checks-Effects-Interactions** for all ETH transfers. State updates precede `.call{value:}`.
- **Two-step ownership/admin transfer** for all privileged-role contracts. A transfer is initiated by the current holder and must be accepted by the new holder before taking effect. Prevents accidental transfer to an inaccessible address.
- **Two-tier admin separation.** A master admin (multi-sig) controls infrastructure and rescue. An operations admin (EOA or smaller multi-sig) controls day-to-day operations and cannot extract user funds.
- **Commit-reveal timelock** on refund merkle root publication (`MERKLE_ROOT_DELAY = 24 hours`). Holders can verify the committed root before claims open.
- **Oracle time-drift guard.** Time oracle reads are bounded by `MAX_TIME_DRIFT = 1 hours` to prevent manipulated time from shortening challenge windows or accelerating tranche releases.
- **Proof-based LP lock recording.** The LP locker's manual-resolution path requires on-chain proof that the campaign's fee claimer (or `0xdead`, for a legacy burn) holds at least `lpAmount` of the pool token before the rescued state is marked verified-locked.
- **Cross-contract finalization guards.** Token claims hard-require `finalizationPhase == FullyComplete`. Emergency refunds query the router's finalization state via try/catch. Prevents the token-plus-ETH double-dip that state drift could otherwise enable.
- **EIP-1167 minimal proxies** for per-raise contracts to keep gas costs reasonable across many launches.
- **Custom errors** instead of revert strings for gas-efficient reverts.
- **Dead-address locking** for irrecoverable burns (slashed challenge stakes, malicious-treasury burns, holder-refund token burns). The primary LP lock instead uses a soulbound fee claimer (Section 7).

This list has been shaped by the two audit cycles described in Section 11. Each of the named guards (commit-reveal delay, time-drift guard, proof-based recording, cross-contract finalization checks) corresponds to a specific finding from the audit history.

## 10.6 What this section deliberately omits

This is a tour, not a specification. Specific details intentionally outside the scope of this section:

- **Function signatures and parameter types.** Verifiable on the deployed contracts via a Base block explorer.
- **Storage layout.** Contracts that use upgradeable patterns or shared storage have specific layouts documented in their respective sources.
- **Gas budgets and cost analysis.** See the deployment notes for gas profiles of representative operations.
- **Test coverage.** The contracts ship with a comprehensive test suite covering the mechanism paths described above.
- **Audit findings in detail.** See the remediation summary at app.vibestarter.xyz/audit.

The intent of this section is to give a reader enough to understand *which contract enforces which design goal* and to provide the entry points for deeper investigation. The protocol's correctness claims live in the source and the audits, not in this paper.
