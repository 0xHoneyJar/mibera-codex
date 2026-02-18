# Sprint Plan: Navigation Surface Completeness

**Cycle**: 010
**PRD**: `grimoires/loa/prd.md`
**SDD**: `grimoires/loa/sdd.md`

---

## Overview

Single sprint. Update human-facing navigation files to surface all on-chain ecosystem docs and data exports added in cycle-009. Verify gaps.json accuracy.

---

## Sprint 1: Navigation Update

**Goal**: Make all cycle-009 content discoverable from README.md and SUMMARY.md. Create data directory index. Verify metadata accuracy.

### Task 1.1: Update README.md (FR-1, FR-2)

**Description**: Expand the On-Chain section from 1 bullet to 8 items covering all ecosystem contract documentation. Add a new "Data & Research" section listing data exports. Add ecosystem contract count to Quick Stats.

**Changes**:
- Replace "IX. On-Chain" single bullet with full listing (contracts, fractured-mibera, shadow-traits, candies, mibera-sets, tarot-quiz, 42-motif, ABIs)
- Add "X. Data & Research" section (data README, graph.json, miberas.jsonl, grails.jsonl, scope, gaps, timeline)
- Add `| Ecosystem Contracts | 11 |` to Quick Stats table

**Acceptance criteria**:
- [x] README.md "IX. On-Chain" has 8 linked items
- [x] README.md "X. Data & Research" section exists with 7 linked items
- [x] Quick Stats table includes ecosystem contracts count
- [x] All links resolve to existing files

**Dependencies**: None

### Task 1.2: Update SUMMARY.md (FR-3)

**Description**: Add On-Chain and Data sections to the table of contents, matching SUMMARY.md's existing indentation style.

**Changes**:
- Add "## IX. On-Chain" section after "VIII. Behind the Scenes"
- Add "## X. Data & Research" section after IX

**Acceptance criteria**:
- [x] SUMMARY.md has "IX. On-Chain" section with ecosystem contract docs
- [x] SUMMARY.md has "X. Data & Research" section with data export links
- [x] All links resolve to existing files
- [x] Indentation matches existing SUMMARY.md style (` * ` for items, `  * ` for sub-items)

**Dependencies**: None (parallel with 1.1)

### Task 1.3: Create `_codex/data/README.md` (FR-4)

**Description**: Create an index file for the data directory listing all 15+ files with their format, purpose, and entry counts.

**Sections**:
- Core Data: miberas.jsonl, grails.jsonl, graph.json, stats.md
- On-Chain Documentation: fractured-mibera.md, shadow-traits.md, candies-mechanics.md, mibera-sets.md, tarot-quiz.md, 42-motif.md
- Metadata: scope.json, gaps.json, contracts.json, timeline.json
- ABIs: abis/ directory (link to abis/README.md)

**Acceptance criteria**:
- [x] `_codex/data/README.md` exists
- [x] Lists all files in `_codex/data/` (excluding README.md itself)
- [x] Each entry has format and description
- [x] Grouped by category

**Dependencies**: None (parallel with 1.1, 1.2)

### Task 1.4: Verify gaps.json + scope.json (FR-5)

**Description**: Verify all gap statuses and scope entries match current reality.

**Checks**:
- GAP-001: Custom commissions — verify status is still `open` (Mijedi exists but full list unknown)
- GAP-002 through GAP-007: Verify all `resolved_by` paths exist
- scope.json: Verify all tracked entity types and counts are current

**Acceptance criteria**:
- [x] All `resolved_by` paths in gaps.json point to existing files
- [x] GAP-001 status is correct given Mijedi addition
- [x] scope.json entity types and counts match manifest.json
- [x] All JSON files pass `json.load()` validation

**Dependencies**: None (parallel with 1.1-1.3)

### Task 1.5: Validate

**Description**: Run validation checks on all modified files.

**Acceptance criteria**:
- [x] All links in README.md resolve to existing files
- [x] All links in SUMMARY.md resolve to existing files
- [x] All links in `_codex/data/README.md` resolve to existing files
- [x] `gaps.json` passes `json.load()` validation
- [x] `scope.json` passes `json.load()` validation

**Dependencies**: Tasks 1.1-1.4
