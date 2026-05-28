# 3. Vibecoins as a Funding Primitive

> A vibecoin is a token associated with a vibecoded project, designed to function as both community coordination and funding mechanism from day zero. The category is defined by what it is *not* as much as by what it is.

This section establishes the term, distinguishes it from adjacent categories that share surface features, and frames the design problem that the rest of the paper solves. As with Section 2, this compresses material from the original thesis — readers wanting the full argument should consult [vibestarter.xyz/thesis](https://www.vibestarter.xyz/thesis).

---

## 3.1 The definition

A **vibecoin** is a token issued at the launch of a vibecoded project, where the token serves as both:

1. **A coordination instrument.** Holders are the project's earliest community. They have a transferable claim on the project's success and on its on-chain governance surfaces (where those exist).
2. **The funding instrument.** The capital that the project receives to build comes from backers contributing in exchange for vibecoins.

The two functions are inseparable. A token that does only the first (community without funding) is a community token. A token that does only the second (funding without community) is a security in most jurisdictions. The vibecoin sits between them: a transferable claim, tied to a specific project being built, issued at the moment of the project's founding.

## 3.2 What vibecoins are not

The category is most usefully defined against its neighbors.

**A vibecoin is not an AI vapourware token.** AI tokens issued by projects with no working software, no shipping cadence, and no demonstrable connection between the token's claimed utility and any product the team is building are the failure case. They take the surface features (token, AI branding, white-paper) and discard the load-bearing structure (something is actually being built).

**A vibecoin is not a memecoin.** Memecoins are coordination instruments without product. The launching team has no obligation to build, no schedule against which to be measured, and no accountability mechanism. Memecoins serve a legitimate function (purely speculative coordination is its own primitive) but are not what this paper is describing.

**A vibecoin is not a launchpad token.** Tokens launched on permissionless launchpads (pump.fun, bags.fm, similar) inherit the launchpad's mechanism — usually a bonding curve, often a fixed supply, sometimes a graduation event. They are not tied to a specific project's build timeline and are not gated by any accountability mechanism. Many launchpad tokens are memecoins; some happen to be associated with builders. The launchpad does not enforce the association.

**A vibecoin is not a post-launch token.** When a crypto project ships a working protocol and then tokenizes — typically to provide exit liquidity for early backers — the resulting token is an exit instrument, not a funding instrument. The product was built without the token. The token's launch is a financing event for the team that already built the product. This is the standard model for serious crypto projects today and produces good outcomes for the teams that use it, but it does not address the population of builders who need capital *before* they have built anything.

**A vibecoin is not an equity stake.** Backers are not buying shares in a company. There is no cap table, no preferred / common distinction, no liquidation preference, no voting rights at a board level. The vibecoin is a claim on the project's specific token-denominated success, with the contract-defined refund paths described in Section 6.4 as the closest analog to a downside protection.

## 3.3 What makes vibecoins specifically suited

The defining feature of the vibecoin is that the **token launch and the project launch are the same event**. This is enabled by the collapse in execution cost (Section 2). It is what distinguishes vibecoins from the prior categories.

When execution was expensive, no rational party would issue a token before the product existed — the token would be priced against vapor. With execution costs near zero, the token can be issued at *the same time as the MVP is being shipped*. The first backers are participating in something that is being built in front of them, not something that was pitched in a slide deck six months ago.

This temporal alignment enables three properties that prior categories cannot have:

1. **The funding window matches the building window.** A vibecoded MVP ships in days. The funding window can also close in days. The mismatch between weeks-to-build and quarters-to-fund disappears.
2. **Backers select projects by their actual emerging shape.** A backer in a vibecoin raise can see the project's repo, the current build state, the founder's recent commits. They are not pricing a roadmap; they are pricing what already exists plus the founder's demonstrated velocity.
3. **The token's value is empirically grounded.** The token is tied to a specific project that is observably being worked on. A backer can verify that the founder is building. The token's existence is contingent on the project's existence in a way that detached tokens are not.

These properties are *necessary but not sufficient*. A token issued at MVP launch can still fail in all the ways Section 4 describes — front-loaded capital, no accountability, no holder recourse, no permanent liquidity. The properties above describe what the vibecoin *can be*. The mechanism described in Sections 5 through 8 is what makes a vibecoin *actually work* — what prevents it from degenerating into one of the failure modes the thesis was reacting against.

## 3.4 The design problem

The remaining sections of this paper are the answer to a specific design question:

> Given that the vibecoin category is now economically viable (Section 2), and given that none of the existing funding rails (Section 2.2) or existing token-launch mechanisms (Section 3.2) are adequate, what is the narrowest set of on-chain mechanics that:
>
> 1. Permits anyone to issue a vibecoin without operator approval (G3);
> 2. Routes capital to the founder over time, contingent on continued execution (G1, G2);
> 3. Gives backers a transferable claim that retains meaning in success, stall, and failure paths (G4);
> 4. Provides permanent secondary-market liquidity (G5);
> 5. Includes a credible adversarial action when something is going wrong (G6);
> 6. Does not depend on its operator's continued cooperation for the contract-level guarantees to hold (G7);
> 7. Is honest about the operator surfaces that do remain (Section 12)?

The design goals are introduced formally in Section 4. The mechanism is specified in Sections 5 through 8. The system that ties them together is in Sections 10 through 12. The unsolved residual is in Section 13.

The vibecoin is the *category*. Vibestarter is one specific implementation of the category. The rest of this paper is Vibestarter's specific implementation — but the design principles are intended to be portable to any other implementation that wants to address the same problem.
