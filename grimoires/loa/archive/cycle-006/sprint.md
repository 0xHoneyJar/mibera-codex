# Sprint Plan: Obsidian Performance & Graph Visualization

**Cycle**: 006
**Date**: 2026-02-15
**PRD**: `grimoires/loa/prd.md`
**SDD**: `grimoires/loa/sdd.md`

---

## Sprint Overview

**Single sprint** — all work fits in one sprint. The SDD provides exact final-state JSON for each file; implementation is direct file writes.

**No commits** — all changes are local only (`.obsidian/` is gitignored anyway).

---

## Sprint 1: Obsidian Config & Sharding Assessment

**Goal**: Configure Obsidian graph view with color-coded content types, tune forces for 10K+ nodes, exclude non-content directories, enable random note, and assess sharding feasibility.

### Task 1: Write graph.json with color groups and tuned forces

**Description**: Replace `.obsidian/graph.json` with the complete final-state JSON from SDD §4.1. This includes 8 color groups (ordered by specificity) and tuned force/display settings.

**Acceptance criteria**:
- 8 color groups in correct priority order (tarot → ancestors → core-lore → drugs → traits → browse → birthdays → miberas)
- Color values use packed RGB integer format (`{"a": 1, "rgb": <int>}`)
- Force settings: repelStrength=6, centerStrength=0.6, linkDistance=100
- Display settings: lineSizeMultiplier=0.5, nodeSizeMultiplier=1.2, textFadeMultiplier=-0.5
- Existing user preferences preserved (search filter, showTags, showOrphans, etc.)

**Effort**: Small — single file write from SDD spec
**Dependencies**: None
**File**: `.obsidian/graph.json`

---

### Task 2: Write app.json with excluded directories

**Description**: Replace `.obsidian/app.json` with the final-state JSON from SDD §4.2. Configures `userIgnoreFilters` to exclude 9 non-content directories from Obsidian's indexer, file explorer, search, and graph view.

**Acceptance criteria**:
- `userIgnoreFilters` array contains all 9 directories: `.claude/`, `.beads/`, `.run/`, `.ck/`, `grimoires/`, `_scripts/`, `_schema/`, `_data/`, `node_modules/`
- All content directories (miberas, drugs, tarot, ancestors, traits, browse, birthdays, core-lore) remain unaffected
- JSON is valid and parseable

**Effort**: Small — single file write from SDD spec
**Dependencies**: None
**File**: `.obsidian/app.json`

---

### Task 3: Enable random-note in core-plugins.json

**Description**: Replace `.obsidian/core-plugins.json` with the final-state JSON from SDD §4.3. The only change from current state is `"random-note": true` (was `false`).

**Acceptance criteria**:
- `"random-note": true` in output
- All other plugin states preserved exactly as-is
- JSON is valid and parseable

**Effort**: Trivial — single field change
**Dependencies**: None
**File**: `.obsidian/core-plugins.json`

---

### Task 4: Produce sharding feasibility assessment

**Description**: Analyze the mibera directory sharding question using codebase data. Count files with inbound links to `miberas/`, quantify the link-rewriting scope, document what a migration script would need, and make a go/no-go recommendation.

**Acceptance criteria**:
- Quantified count of files containing inbound links to `miberas/`
- Documented link format change (outbound: `../` → `../../`, inbound: path restructure)
- Script requirements described
- Risk assessment with probability and impact
- Clear go/no-go recommendation for a future cycle
- Written in sprint reviewer notes

**Effort**: Medium — requires codebase analysis (grep for link patterns, count affected files)
**Dependencies**: None (research task, no file changes)
**Output**: `grimoires/loa/a2a/sprint-10/reviewer.md`

---

### Task 5: Verify all changes in Obsidian

**Description**: After writing all config files, prompt user to restart Obsidian and verify:
1. Graph view shows 8 distinct colors for different content types
2. Force settings produce a usable, non-frozen graph layout
3. Excluded directories are hidden from file explorer and search
4. Random Note command works (Cmd+P → "Open random note")

**Acceptance criteria**:
- User confirms visual verification of color groups
- User confirms graph renders without freezing
- User confirms excluded dirs are hidden
- User confirms random note works

**Effort**: Trivial — user verification
**Dependencies**: Tasks 1-3 complete

---

## Summary

| Task | Description | Effort | File |
|------|-------------|--------|------|
| T1 | Graph color groups + force tuning | Small | `.obsidian/graph.json` |
| T2 | Exclude non-content directories | Small | `.obsidian/app.json` |
| T3 | Enable random-note plugin | Trivial | `.obsidian/core-plugins.json` |
| T4 | Sharding feasibility assessment | Medium | Reviewer notes |
| T5 | User verification in Obsidian | Trivial | — |
