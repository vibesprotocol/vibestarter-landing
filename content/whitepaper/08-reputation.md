# 8. Reputation: Ethos and On-Chain Signals

> Anyone can back a raise, and reputation never decides who can: Vibestarter does not gate participation on reputation scores. (Launch admission is curated in the current phase against the published application rubric — Section 12.1 — not by Ethos or Starter scores.) What the platform does with reputation is surface it, so backers and founders can judge who they are dealing with for themselves.

This section describes the reputation layer that sits beside the on-chain protocol. It is part of how Vibestarter delivers design goal G3 (*permissionless on both sides — end-state; launch side currently curated*) honestly: backing is permissionless, launch admission in the current phase is decided by the published application rubric (Section 12.1) rather than by reputation, and the answer to the trust and Sybil problems that openness brings is *transparency*, not a reputation gate. The reputation layer surfaces credibility signals on every participant; it does not grant or deny access.

---

## 8.1 Reputation is a signal, not a gate

In an open market the relevant question is rarely "is this person allowed to participate" — it is "who is this person." The reputation layer answers the second question only (launch admission in the current phase is the application rubric's job — Section 12.1; backing has no admission step at all):

- **Reputation does not decide launch admission.** In the current curated phase, launches are admitted by the published application rubric (Section 12.1), not by Ethos or Starter scores; an admitted launch's success is determined by its own funding outcome, not by the founder's standing.
- **Anyone can back any raise**, regardless of reputation. There is no minimum score, no tier, and no allowlist requirement to contribute.
- **Anyone can hold tokens, raise challenges, claim refunds, and call any contract function.** The contract layer does not read reputation at all.

Reputation informs judgment; it never grants or denies access. A founder deciding whether to trust a backer, or a backer deciding whether to support a founder, gets the signals to make that call — and makes it themselves.

*(Founder-configurable requirements — a founder choosing, for example, to limit their own raise to backers above some reputation threshold — are a possible future option. They are not implemented today: at present no raise gates participation on reputation.)*

## 8.2 What Vibestarter surfaces

Two families of signal, both chosen because they are expensive to fabricate at scale and independently verifiable.

**Ethos.** Ethos (ethos.network) is a cross-platform reputation network in which participants vouch for, review, and — where warranted — slash one another. A wallet's Ethos score aggregates that activity into a single credibility figure. Because Ethos reputation is built across platforms and over time, it is costly to manufacture for a throwaway identity. Vibestarter displays a founder's and a backer's Ethos score and standing wherever they appear.

**On-chain history.** Everything a wallet has done on Base is public, and Vibestarter surfaces the parts relevant to credibility:

- **Wallet age and transaction history** — how long the wallet has existed and how active it has been.
- **Vibestarter track record** — raises a founder has previously launched, raises a backer has supported, and how those played out.
- **Identity and activity signals** — ENS, Farcaster, and similar public web3 identity that ties a wallet to a persistent presence.

None of this requires the platform's permission to verify. Anyone can check a wallet's Ethos score or its on-chain history directly; Vibestarter's role is to collect and present it in context — on profiles and on each raise page.

## 8.3 What reputation does not do

The honest framing of the reputation layer:

- **It does not verify a founder is honest.** A wallet with a high Ethos score and a long history can still fail to deliver or act in bad faith. The on-chain challenge system (Section 6) is the enforcement mechanism; reputation is a first-glance signal, not a guarantee.
- **It does not gate the protocol.** Reputation is presentational. Every contract function is callable regardless of a participant's standing.
- **It can be cultivated.** Expensive-to-fake is not impossible-to-fake. A determined actor can build a credible-looking profile over time, so reputation should be one input among several — read alongside the project itself and the founder's specific track record.
- **It depends on third parties.** Ethos and similar sources are external services that can change methodology or become unavailable. The underlying data stays verifiable on-chain and at the source; the *display* depends on those integrations.

Which signals are surfaced, and how they are presented, is a product decision Vibestarter makes off-chain. The decentralization path for that surface is covered in Section 12.
