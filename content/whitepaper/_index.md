# Vibestarter Whitepaper

> Authored by Vibestarter Labs. An expansion of the original thesis at
> [vibestarter.xyz/thesis](https://www.vibestarter.xyz/thesis) into a full
> treatment of the funding primitive, its mechanism design, and the contract
> system that implements it.

**Audience:** mixed. Layered structure — executive summary for skimmers, mechanism and economics sections for technical readers, appendices for spec-level detail.

**Scope:** the funding primitive itself, treated as protocol design. Vibestarter is the reference implementation, but the design choices are presented as portable. Details of the protocol's own raise live in `docs/raise-manifesto.md` and `docs/tokenomics.md` — not here.

**Language:** US-cautious throughout. "Backer," "contribution," "tranche release," "secondary liquidity" — not "investor," "yield," or "returns."

---

## Sections

| # | File | Section | Status |
|---|------|---------|--------|
| 1 | `01-executive-summary.md` | Executive summary | **Draft v1** |
| 2 | `02-funding-mismatch.md` | The funding mismatch | **Draft v1** |
| 3 | `03-vibecoins-as-primitive.md` | Vibecoins as a funding primitive | **Draft v1** |
| 4 | `04-design-goals.md` | Design goals & failure modes we're avoiding | **Draft v1** |
| 5 | `05-time-released-funding.md` | Time-released funding | **Draft v1** |
| 6 | `06-challenge-windows.md` | Challenge windows | **Draft v1** |
| 7 | `07-liquidity-lp-lock.md` | Liquidity and the indefinite LP lock | **Draft v1** |
| 8 | `08-reputation.md` | Reputation: Ethos and on-chain signals | **Draft v1** |
| 9 | `09-economics-examples.md` | Economics: worked examples | **Draft v1** |
| 10 | `10-contract-architecture.md` | Contract architecture overview | **Draft v1** |
| 11 | `11-trust-safety.md` | Trust and safety | **Draft v1** |
| 12 | `12-governance.md` | Governance and decentralization roadmap | **Draft v1** |
| 13 | `13-risks-disclosures.md` | Risks and disclosures | **Draft v1** |
| 14 | `14-appendix.md` | Appendix: glossary, parameters, references | **Draft v1** |

---

## Reading order

The paper is structured for both linear reading and section-by-section reference.

- **Linear read:** §1 → §14 in order. Roughly 15 pages of prose.
- **Skim read:** §1 only, then dip into specific sections of interest via the table in §1's "How to read the rest of this paper."
- **Mechanism only:** §4 through §9.
- **System / trust review:** §10 through §13.

---

## Source-of-truth wiring

- **Content lives here**, in `docs/whitepaper/`. One file per section.
- **Landing render**: a `/whitepaper` route in the `vibestarter-landing` repo imports these markdown files at build time. Wiring happens after content stabilizes.
- **PDF export**: Pandoc build script (planned for v2).
- **Versioning**: this index is the canonical version pointer. Bump on each material revision.

**Current version:** v1.0 draft (all 14 sections drafted)
**Last updated:** 2026-05-24
