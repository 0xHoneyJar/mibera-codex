# PRD: Fractures — Reveal Phase Documentation

**Cycle**: 013
**Date**: 2026-02-18

---

## 1. Problem Statement

FracturedMibera represents the 10 reveal phases of the Mibera collection — soulbound on-chain markers of each holder's participation in the reveal timeline. Currently, the only documentation lives in `_codex/data/fractured-mibera.md` as a technical contract reference. There is no narrative documentation of what each reveal phase actually unveiled, the progression from sealed envelopes to final form, or the cultural significance of the naming convention.

Fractures are as central to the collection's identity as Grails and Birthdays. They deserve a first-class section in "V. The Collection."

## 2. Goals

1. Create a `/fractures/` directory as a peer to `/grails/` and `/birthdays/`
2. Document each of the 10 reveal phases with narrative descriptions
3. Preserve the reveal timeline as a coherent story of Mibera coming into being
4. Link to (not duplicate) the technical contract mechanics in `_codex/data/`
5. Update glossary, README, and SUMMARY to integrate the new section

## 3. The 10 Fractures

| # | Name | Symbol | What It Reveals |
|---|------|--------|-----------------|
| 1 | MiParcels | MIPARCEL | Sealed envelopes with labels, stickers, handwritten lore scrawl |
| 2 | Miladies | MILADIES | Horizontally flipped Milady Maker art with toilet graffiti |
| 3 | MiReveal #1.1 | MIREVEAL1.1 | Colors and scenery hints; rare foregrounds visible |
| 4 | MiReveal #2.2 | MIREVEAL2.2 | Scene clears, molecule placed, silhouette shown |
| 5 | MiReveal #3.3 | MIREVEAL3.3 | Coherent form, astrology revealed, eyes closed |
| 6 | MiReveal #4.20 | MIREVEAL4.20 | Moon appears, hat placed (if applicable) |
| 7 | MiReveal #5.5 | MIREVEAL5.5 | Mibera awake, rising sign visible, face finalized |
| 8 | MiReveal #6.9 | MIREVEAL6.9 | Head takes final form, ancient emblem visible |
| 9 | MiReveal #7.7 | MIREVEAL7.7 | Tattoos added, calm before the final reveal |
| 10 | MiReveal #8.8 | MIREVEAL8.8 | Final reveal — the current Mibera collection |

### Naming Convention

The decimal numbering (1.1, 2.2, 3.3, 4.20, 5.5, 6.9, 7.7, 8.8) is playful and intentional. 4.20 and 6.9 are deliberate cultural references.

### MiParcels & Miladies

These first two phases differ from the numbered MiReveals — they're not progressive unveilings of the Mibera form but rather conceptual predecessors. MiParcels is pure anticipation (a sealed package). Miladies is a nod to the Milady lineage before Mibera emerges as its own identity.

## 4. Success Criteria

- `/fractures/README.md` with overview, timeline, and contract reference table
- 10 individual phase files with narrative descriptions
- `glossary.md` updated with Fracture/FracturedMibera terms
- `README.md` Section V updated to include Fractures
- `SUMMARY.md` updated with Fractures entries
- All files link to `_codex/data/fractured-mibera.md` for technical details

## 5. Scope

### In Scope
- Narrative reveal timeline documentation
- Per-phase markdown files
- Navigation integration (README, SUMMARY, glossary)
- Cross-links to technical reference

### Out of Scope
- Contract mechanics (already documented in `_codex/data/`)
- Mint stats per Fracture (data not available)
- Per-phase visual identity/art samples
- mireveals/ CSV data (gitignored, in-progress)
