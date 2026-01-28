# Vibestarter - Product & Architecture Context

## Overview

Vibestarter is a crowdfunding platform for **vibecoded apps** - applications built collaboratively between humans and AI coding agents (like Claude). It provides time-released funding with on-chain provenance on Base (Ethereum L2).

**Live URLs:**
- Landing page: https://vibestarter.xyz (vibestarter-landing repo)
- App: https://app.vibestarter.xyz (vibestarter-app repo)
- Staging: https://staging.vibestarter.xyz

---

## Core Concepts

### Vibecoding
The practice of building software collaboratively with AI agents. The human provides vision/direction, the AI writes code. Vibestarter provides cryptographic proof of this collaboration.

### Vibetoken
A project-specific token created when a founder launches a raise. Backers receive Vibetokens in exchange for ETH contributions.

### Origin Capsule
On-chain attestation proving the AI-human collaboration. Contains:
- Agent signature (e.g., Claude Opus 4.5)
- Founder wallet address
- Build transcript hash
- Timestamp

---

## Funding Mechanics (CRITICAL - Get This Right)

### Time-Released Funding (NOT Milestone-Gated)
Funds are released automatically based on **time**, not milestones:

1. **Vibestart (10%)**: Founder receives 10% immediately when raise finalizes
2. **Monthly Tranches (15% each)**: Remaining 90% released in 6 monthly tranches
   - Each tranche = 15% of total raised
   - Releases automatically every 30 days
   - No milestone verification required

### Challenge Windows
- Each tranche has a **72-hour challenge window** before release
- Backers can challenge if founder abandons project
- Challenge requires community vote (details TBD)
- This is backer protection, not milestone verification

### Escrow
- All funds held in smart contract escrow
- Founder never has direct access to full amount
- Prevents rug pulls

### LP Locking
- Liquidity pool tokens locked at raise finalization
- Prevents founder from pulling liquidity

---

## The 8-Step Process

1. **Verify** - Connect wallet + link social accounts (Twitter, GitHub)
2. **Prove Build** - Upload AI transcript for vibecode attestation
3. **Set Terms** - Define roadmap, token allocation, funding goal
4. **Go Live** - Start raise, backers can contribute
5. **In Escrow** - All contributions secured in smart contract
6. **Vibestart** - 10% instant funding on raise finalization
7. **Ship** - Build & deliver the product
8. **Tranches** - Claim 15% monthly over 6 months

---

## Technical Architecture

### Repositories

```
C:\Users\Ross\Documents\Vibestarter\
├── vibestarter-landing/     # Marketing site (vibestarter.xyz)
│   ├── Next.js 14.2.5
│   ├── Tailwind CSS
│   └── Deployed on Vercel
│
└── vibestarter-app/         # Main application (app.vibestarter.xyz)
    ├── apps/
    │   └── web/             # Next.js frontend
    ├── contracts/           # Solidity smart contracts
    ├── packages/
    │   ├── db/              # Prisma database
    │   └── shared/          # Shared types/contracts
    └── Turborepo monorepo
```

### Smart Contracts (Base Mainnet)

Located in `vibestarter-app/contracts/src/`:

- **VibesLaunchRouterV2.sol** - Main entry point for launches
- **VibesTranchEscrow.sol** - Individual escrow for each raise
- **VibesTranchEscrowFactory.sol** - Creates escrow instances
- **VibesTokenDistributorV2.sol** - Handles token distribution
- **VibesLPLocker.sol** - Locks liquidity pool tokens

### Key Contract Interfaces

```solidity
// Tranche release schedule
uint256 constant VIBESTART_PERCENT = 10;  // 10% immediate
uint256 constant TRANCHE_PERCENT = 15;     // 15% per month
uint256 constant TRANCHE_INTERVAL = 30 days;
uint256 constant CHALLENGE_WINDOW = 72 hours;
```

### Database Schema

Uses Prisma with PostgreSQL. Key models:
- `Campaign` - Raise details, funding goal, status
- `Founder` - Wallet, social links, Ethos score
- `Contribution` - Backer contributions
- `Tranche` - Release schedule tracking

### External Integrations

- **Ethos Network** - Founder reputation/credibility scores
- **Privy** - Wallet authentication
- **RainbowKit** - Wallet connection UI
- **Base/Aerodrome** - DEX for token liquidity

---

## Design System

### Colors
```css
--accent: #91D982;        /* Green - primary accent */
--accent-bright: #0D8BCA; /* Blue - secondary accent */
--background: #0A0A0A;    /* Near black */
--muted: rgba(255,255,255,0.6);
```

### Typography
- Sans: Inter
- Mono: JetBrains Mono

### Component Patterns
- Cards with `bg-white/[0.02]` and `border-white/[0.06]`
- Buttons: `btn-primary` (green), `btn-secondary` (outline)
- Gradients: `text-accent-gradient` for hero text

---

## Terminology Guide

| Use This | NOT This |
|----------|----------|
| Time-released | Milestone-gated |
| Vibecoding | AI-native |
| Vibecode attestation | AI transcript |
| Launch Your Raise | Start Campaign |
| Tranches | Milestones |
| Monthly funding claim | Milestone completion |
| 72-hour challenge window | Dispute period |

---

## Deployment

### Landing Page (vibestarter-landing)
```bash
cd vibestarter-landing
npm run build
vercel --prod
```
Deploys to: vibestarter.xyz

### App (vibestarter-app)
```bash
cd vibestarter-app
pnpm build
vercel --prod
```
Deploys to: app.vibestarter.xyz (staging: staging.vibestarter.xyz)

### Git Tags
- v3: Current production (time-released copy, 8-step flow)

---

## Common Mistakes to Avoid

1. **Never say "milestone-gated"** - Funds release by TIME, not milestones
2. **Funding is 10% + 6x15%** - Not 10% + 5x18% or any other split
3. **Challenge windows are 72 hours** - Not 24, not 48
4. **Tranche interval is 30 days** - Monthly, automatic
5. **Both sites exist** - Landing (vibestarter.xyz) vs App (app.vibestarter.xyz)
6. **Base network** - Not Ethereum mainnet, not other L2s

---

## File Locations Quick Reference

### Landing Page Components
- Hero: `vibestarter-landing/src/components/Hero.tsx`
- How It Works: `vibestarter-landing/src/components/HowItWorks.tsx`
- Runway Protection: `vibestarter-landing/src/components/RunwayProtection.tsx`
- Navigation: `vibestarter-landing/src/components/Navigation.tsx`

### App Components
- Nav: `vibestarter-app/apps/web/src/components/nav.tsx`
- Campaign Card: `vibestarter-app/apps/web/src/components/campaign-card.tsx`
- Launch Page: `vibestarter-app/apps/web/src/app/launch/page.tsx`

### Contracts
- Escrow: `vibestarter-app/contracts/src/VibesTranchEscrow.sol`
- Router: `vibestarter-app/contracts/src/VibesLaunchRouterV2.sol`

---

*Last updated: v3 - January 2026*
