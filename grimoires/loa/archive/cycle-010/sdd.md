# SDD: Navigation Surface Completeness

**Cycle**: 010
**PRD**: `grimoires/loa/prd.md`

## Overview

Pure documentation update — no code, no data transformations. All changes are to Markdown navigation files and JSON metadata files.

## 1. README.md Changes

### 1.1 Expand "IX. On-Chain" section (FR-1)

Replace the single-bullet On-Chain section with a comprehensive listing of ecosystem contract documentation:

```markdown
### IX. On-Chain
Contract addresses and ecosystem mechanics.
- [Contract Registry](_codex/data/contracts.json) — All ecosystem contract addresses
- [Fractured Mibera](_codex/data/fractured-mibera.md) — 10 soulbound companion collections
- [Shadow Traits](_codex/data/shadow-traits.md) — On-chain trait uniqueness system
- [Candies Marketplace](_codex/data/candies-mechanics.md) — Seizure mechanics and holder discounts
- [Mibera Sets](_codex/data/mibera-sets.md) — 12-tier ERC-1155 on Optimism
- [Archetype Quiz](_codex/data/tarot-quiz.md) — Soulbound archetype alignment
- [The 42 Motif](_codex/data/42-motif.md) — Numerological easter eggs across contracts
- [Contract ABIs](_codex/data/abis/README.md) — Machine-readable contract interfaces
```

### 1.2 Add "X. Data & Research" section (FR-2)

New section after On-Chain:

```markdown
### X. Data & Research
Machine-readable exports and analytical datasets.
- [Data Directory Index](_codex/data/README.md) — All exports with format descriptions
- [Knowledge Graph](_codex/data/graph.json) — 10,279 nodes, 70,344 edges
- [All Miberas (JSONL)](_codex/data/miberas.jsonl) — 10,000 entries as newline-delimited JSON
- [All Grails (JSONL)](_codex/data/grails.jsonl) — 42 entries
- [Scope & Boundaries](_codex/data/scope.json) — What this codex tracks
- [Known Gaps](_codex/data/gaps.json) — Documented unknowns with resolution paths
- [Timeline](_codex/data/timeline.json) — Key ecosystem events
```

### 1.3 Update Quick Stats

Add ecosystem contract count to the Quick Stats table:

```markdown
| Ecosystem Contracts | 11 |
```

## 2. SUMMARY.md Changes (FR-3)

### 2.1 Add "IX. On-Chain" section after "VIII. Behind the Scenes"

Mirror the README structure with indented sub-items for SUMMARY.md's table-of-contents format.

### 2.2 Add "X. Data & Research" section

List data exports with proper indentation.

## 3. `_codex/data/README.md` (FR-4)

Create a new index file with:

- One-sentence directory purpose
- Table listing all files: name, format, description, line count or entry count
- Grouped by category: Core Data, On-Chain Documentation, Metadata, Schemas (link)

## 4. gaps.json + scope.json Verification (FR-5)

### 4.1 gaps.json

Check each gap:
- GAP-001: "Custom 1/1 commissions" — still `open`. Mijedi exists as a community grail but GAP-001 is specifically about discovering the *full list* of commissions. Status remains correct as `open`.
- GAP-002 through GAP-007: All `closed` with `resolved_by` paths. Verify each path still exists.

### 4.2 scope.json

Check `tracks` array covers all documented entity types. Currently has 9 entries (mibera, grail, trait, drug, tarot_card, ancestor, special_collection, birthday_era, fractured_mibera). Verify no new entity type is missing.

Consider: should `archetype_quiz` (MIRA tokens) be in scope.json tracks? No — it's documentation of a contract, not a tracked entity type. The codex doesn't track individual MIRA tokens.

## Files Modified

| Path | Change Type |
|------|-------------|
| `README.md` | Edit (sections IX, X, Quick Stats) |
| `SUMMARY.md` | Edit (add sections IX, X) |
| `_codex/data/README.md` | Create |
| `_codex/data/gaps.json` | Edit (if needed) |
| `_codex/data/scope.json` | Edit (if needed) |
