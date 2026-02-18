# Sprint Plan: Schema Meta Blocks

**Cycle**: 012
**PRD**: `grimoires/loa/prd.md`
**SDD**: `grimoires/loa/sdd.md`

---

## Overview

Single sprint. Add `x-codex-confidence`, `x-codex-source`, and `x-codex-meta` to 8 schema files.

---

## Sprint 1: Schema Meta Annotations

**Goal**: Add field-level confidence annotations and schema-level meta blocks to all 8 JSON Schema files.

### Task 1.1: Annotate all 8 schema files

**Description**: For each property in each schema file, add `x-codex-confidence` and `x-codex-source` inline. Add `x-codex-meta` top-level block. Values per SDD Section 4.

**Files**:
1. `_codex/schema/mibera.schema.json` — 26 properties
2. `_codex/schema/drug.schema.json` — 9 properties
3. `_codex/schema/ancestor.schema.json` — 4 properties
4. `_codex/schema/tarot-card.schema.json` — 7 properties
5. `_codex/schema/trait-full.schema.json` — 5 properties
6. `_codex/schema/trait-minimal.schema.json` — 3 properties
7. `_codex/schema/special-collection.schema.json` — 2 properties
8. `_codex/schema/grail.schema.json` — 7 properties

**Acceptance criteria**:
- [x] All 8 schema files have `x-codex-meta` top-level block
- [x] Every property in every schema has `x-codex-confidence` and `x-codex-source`
- [x] Confidence values are only `canonical`, `derived`, or `community`
- [x] Source values are from the 7-value vocabulary in SDD Section 3
- [x] All files are valid JSON

### Task 1.2: Validate

**Description**: Verify all annotations are correct and schemas remain valid.

**Acceptance criteria**:
- [x] All 8 files parse as valid JSON
- [x] No existing schema properties were modified or removed
- [x] Confidence/source values match SDD Section 4 mapping
- [x] `x-codex-meta.last_verified` is `2026-02-18` on all files

**Dependencies**: Task 1.1
