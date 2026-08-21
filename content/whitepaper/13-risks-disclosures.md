# 13. Risks and Disclosures

> Everything that can go wrong, named.

A whitepaper that does not name the failure modes of the protocol it describes is, at best, marketing. This section lists the categories of risk that participants (backers, founders, and operators) should understand before interacting with Vibestarter. None of these are theoretical. All of them have analogs in prior systems.

---

## 13.1 Smart contract risk

The contracts have been through one external audit (ZXVC LLC, May 2026) plus internal review cycles (April and June 2026). All High findings were remediated and re-tested; certain centralization findings (no admin timelocks on the treasury burn / infrastructure setters) are accepted or deferred and disclosed as residual risk. The external audit report is public.

The unmitigated residual: **previously-unknown bugs may exist**. No audit guarantees the absence of bugs; it raises the probability that critical issues have been identified. The mitigation paths the protocol has in place:

- **Pause capability.** A discovered exploit can be contained by halting new launches and new claims while a fix is prepared.
- **Bounty program.** The bug bounty provides material incentive for responsible disclosure.
- **Open-source code.** The contracts are public, and the audit reports are public. Third parties can and should review the source independently.

What the mitigation does not address: a bug exploited *before* it is discovered may result in irreversible loss of funds. This is a category of risk that no protocol has eliminated.

## 13.2 Regulatory risk

Tokens issued via Vibestarter are intended to function as **utility tokens** within their respective project ecosystems: they confer no equity, ownership, dividend, profit-share, or revenue-share rights. Whether any specific token is a security is a legal determination that turns on its particular facts and the jurisdiction in question. The legal disclaimers shown on raise pages and at app.vibestarter.xyz/terms set out what the tokens do and do not confer.

The unmitigated residual: **regulatory bodies in specific jurisdictions may reach different conclusions**. Possible outcomes include:

- A specific token being determined by a regulator to be a security in their jurisdiction, with enforcement against the founder, the platform, or backers.
- New regulation in a relevant jurisdiction altering the legal status of platforms in this category.
- Restrictions on platform access from specific jurisdictions, imposed by Vibestarter Labs in response to regulatory guidance.

The protocol itself cannot make legal determinations. Participants are responsible for understanding the legal status of the activity in their own jurisdiction. The disclaimers and language standards reduce the surface area for confusion; they do not eliminate the underlying regulatory exposure.

## 13.3 Market risk

Tokens issued via Vibestarter are exposed to standard secondary market risks:

- **The token may go to zero.** A project that fails to ship, fails to attract users, or fails for any market reason will see its token trade toward zero. The permanent LP guarantees there is *somewhere to sell*, not that the price will be favorable.
- **Impermanent loss in the LP.** The Aerodrome pool is subject to standard AMM dynamics. Holders selling against a pool that has experienced significant price divergence receive less than they would in an idealized setting.
- **Slippage on thin pools.** Small raises produce shallow LPs. Trades against a thin pool can move the price substantially with small orders.
- **Correlated market risk.** A general crypto market downturn affects all tokens, including those on Vibestarter. Project-specific execution does not insulate against macro market movements.

The protocol does not promise that backers will profit. The legal disclaimers explicitly note that contributions should be amounts participants can afford to lose entirely. This is a literal statement of the risk profile.

## 13.4 Founder risk

Even with the mechanisms described in Sections 5 through 8, founder-related failure modes remain:

- **Founder may capture early tranches before being caught.** The kickstart (10%) and one or two monthly tranches (15% each) may be claimed before a successful challenge halts the schedule. In Example B (Section 9.2), a successful challenge at day 90 leaves 40% of escrow already claimed; that capital is not recoverable.
- **Founder may game challenges.** A founder with reputational standing may successfully argue against legitimate concerns, prolonging the schedule despite underperformance.
- **Founder may execute poorly but not fraudulently.** A founder who is genuinely trying to ship but making poor product decisions is not actionable through the challenge mechanism. Holders bear the cost of poor execution as a market outcome.
- **Founder may abandon post-tranche.** A founder who completes the tranche schedule and then stops working on the project has fulfilled their contract obligation. Vesting on the 5% founder allocation provides some incentive to continue (the cliff is at 6 months, full vesting at 18 months), but does not enforce continued shipping.

The protocol minimizes the *unbounded* version of these risks. It does not eliminate them.

## 13.5 Operator risk

The operator surfaces described in Sections 11 and 12 introduce specific risks:

- **Operations admin compromise.** A compromised operations admin can freeze campaigns and burn individual treasuries before the master admin revokes the role. Funds cannot be exfiltrated, but in-flight campaigns can be disrupted.
- **Master admin compromise.** A compromised master admin holding the multi-sig threshold can pause the platform, alter infrastructure, or extract ETH above deposit reserves. The multi-sig configuration is the primary mitigation.
- **Operator disappearance.** If Vibestarter Labs ceases operating without transferring the operations admin role, the protocol enters a degraded mode: tranches continue to release on schedule, but challenges cannot be adjudicated and refund roots cannot be published.
- **Operator capture.** If the operations admin role becomes captured by interests aligned with founders against backers, challenges may be systematically rejected or never adjudicated. The published challenge standards and the master admin's ability to revoke the role in a single transaction are the mitigations.

These risks are the trade-off the protocol makes by having an operator layer at all. Section 12 covers the path on which they decrease over time.

## 13.6 Challenge mechanism risks

The challenge mechanism itself has failure modes:

- **Coordinated challenges to grief honest founders.** Even with the slash and cooldown, a well-funded coordinated attack with multiple distinct addresses can serially challenge a project. Each challenge requires a fresh address with the threshold balance, the slash on each rejected challenge is meaningful but not catastrophic, and the cumulative delay can be material. Mitigation: the slash percentage is calibrated against this risk; the operations admin can recognize coordinated patterns and reject them.
- **Insufficient challenges against dishonest founders.** A small holder base, an inattentive community, or a project whose holders are not technically capable of identifying issues may produce no challenges against a founder who should be challenged. The protocol cannot manufacture challenges.
- **Successful challenge but slow refund.** After a campaign is frozen, the admin must publish a refund merkle root. This requires off-chain computation; the 24-hour `MERKLE_ROOT_DELAY` adds further latency. Holders wait at least a day for their refund path to open.
- **Holder refunds rely on holders acting.** A holder who does not burn their tokens for refund does not receive their pro-rata share of the frozen escrow. The protocol does not push refunds.

## 13.7 Reputation display risks

The reputation surfaced on the platform (Section 8) has its own caveats:

- **Displayed reputation is not a guarantee of honesty.** A founder with a high Ethos score and a long on-chain history can still fail to deliver or act in bad faith. Reputation is a signal to inform judgment, not a substitute for it.
- **Signals can be cultivated.** Ethos standing and on-chain history are expensive to fabricate at scale, but a determined actor can build a credible-looking profile over time. Treat reputation as one input among several.
- **Third-party dependency.** Ethos and other reputation sources are external services that can change methodology, rate-limit, or become unavailable, which would degrade or interrupt the displayed signals.
- **Reputation is not access.** The platform does not gate participation on these signals: anyone can back any raise regardless of reputation, and launch admission (curated in the current phase, Section 12.1) is decided by the published application rubric, not by Ethos or Starter scores. Founder-configurable requirements may be offered in future but are not in place today.

## 13.8 LP-specific risks

The permanent LP introduces specific dynamics:

- **Impermanent loss is permanent.** A normal LP holder can withdraw their position when divergence has reverted. The permanent LP cannot: the position is locked in whatever state divergence has produced.
- **Trading fees go to the protocol, not to holders.** Aerodrome routes a portion of trading fees to the LP position. For the locked LP, the fee claimer captures those fees, routing the ETH side to the platform and the token side to the project treasury (or burning it if there is no treasury), so token holders do not receive them.
- **No rebalancing.** A liquidity pool that becomes too imbalanced (e.g., one side fully drained) cannot be rebalanced. The pool may end up effectively non-functional even though it nominally exists.
- **AMM contract risk.** The pool is on Aerodrome. Risks to the Aerodrome protocol (including its own contract risk, governance changes, or fee structure changes) affect the permanent LP.

## 13.9 Platform-level risks

Risks at the level of the platform rather than individual raises:

- **Chain risk.** The protocol deploys on Base. Risks to Base (sequencer downtime, L2 finality issues, bridge security) affect all activity on the platform.
- **External dependency risk.** Aerodrome (LP creation), Ethos and other reputation signals (reputation display), and third-party services (X for identity linkage) are dependencies that could change behavior or become unavailable.
- **Founder deposit erosion.** The founder deposit (see the parameter table in Section 14.2 for the current baseline) is intended to deter spam launches. As ETH prices change, the real cost of the deposit varies. The deposit amount is operator-adjustable, but adjustments lag.
- **Fee structure changes.** Platform fees are configurable by the master admin. The protocol does not commit to a maximum fee.

## 13.10 What the disclosures do not cover

This list is not exhaustive. New failure modes may emerge that no one has yet identified. Specifically:

- New attack patterns against the challenge mechanism, the reputation system, or the LP lock.
- Emergent market behaviors that the protocol's mechanism produces unintentionally.
- Legal or regulatory developments in jurisdictions not currently being modeled.
- Interactions between the protocol and other on-chain systems that produce unexpected outcomes.

The protocol commits to ongoing review and to public disclosure of material risks as they are identified.

## 13.11 The summary disclosure

> Vibestarter is a crowdfunding platform. Tokens obtained through Vibestarter are utility tokens intended for use within their respective project ecosystems. Contributing to a raise is not an investment and does not constitute purchasing a security. Past performance of projects on this platform does not guarantee future results. Contributors should only contribute amounts they can afford to lose entirely.

This statement appears on all public-facing raise pages and is the load-bearing summary disclosure for participants. The detailed risks in this section expand on it. Participants are responsible for reading and understanding both.
