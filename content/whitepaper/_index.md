# Vibestarter Whitepaper

> Authored by Vibestarter Labs. An expansion of the original thesis at
> [vibestarter.xyz/thesis](https://www.vibestarter.xyz/thesis) into a full
> treatment of the funding primitive, its mechanism design, and the contract
> system that implements it.

**Audience:** mixed. Layered structure: executive summary for skimmers, mechanism and economics sections for technical readers, appendices for spec-level detail.

**Scope:** the funding primitive itself, treated as protocol design. Vibestarter is the reference implementation, but the design choices are presented as portable. Per-raise parameters (token supply, targets, and allocation) are set by each individual raise and are out of scope here.

**Language:** US-cautious throughout. "Backer," "contribution," "tranche release," "secondary liquidity" (not "investor," "yield," or "returns").

---

## Sections

| # | File | Section |
|---|------|---------|
| 1 | `01-executive-summary.md` | Executive summary |
| 2 | `02-funding-mismatch.md` | The funding mismatch |
| 3 | `03-vibecoins-as-primitive.md` | Vibecoins as a funding primitive |
| 4 | `04-design-goals.md` | Design goals & failure modes we're avoiding |
| 5 | `05-time-released-funding.md` | Time-released funding |
| 6 | `06-challenge-windows.md` | Challenge windows |
| 7 | `07-liquidity-lp-lock.md` | Liquidity and the indefinite LP lock |
| 8 | `08-reputation.md` | Reputation: Ethos and on-chain signals |
| 9 | `09-economics-examples.md` | Economics: worked examples |
| 10 | `10-contract-architecture.md` | Contract architecture overview |
| 11 | `11-trust-safety.md` | Trust and safety |
| 12 | `12-governance.md` | Governance and decentralization roadmap |
| 13 | `13-risks-disclosures.md` | Risks and disclosures |
| 14 | `14-appendix.md` | Appendix: glossary, parameters, references |

---

## Reading order

The paper is structured for both linear reading and section-by-section reference.

- **Linear read:** §1 → §14 in order. Roughly 15 pages of prose.
- **Skim read:** §1 only, then dip into specific sections of interest via the table in §1's "How to read the rest of this paper."
- **Mechanism only:** §4 through §9.
- **System / trust review:** §10 through §13.

---

**Current version:** v1.0 (live)
**Last updated:** 2026-08-21
