# PRD: Navigation Surface Completeness

**Cycle**: 010
**Date**: 2026-02-18

## Problem

Cycles 009 (sprints 14-16) added significant on-chain ecosystem documentation and data exports, but the human-facing navigation files (README.md, SUMMARY.md) were not updated to surface this content. Machine-readable navigation (manifest.json, llms.txt) is complete, but humans browsing the repo on GitHub cannot discover:

1. **On-chain ecosystem** — 11 contracts, Fractured Mibera, Candies mechanics, Shadow Traits, MiberaSets, Archetype Quiz
2. **Data exports** — scope.json, gaps.json, timeline.json, contracts.json, ABIs directory, graph.json
3. **Data directory index** — `_codex/data/` has 15+ files with no README

Additionally, `gaps.json` needs verification that all gap statuses reflect current reality.

## Requirements

### FR-1: Update README.md On-Chain section
The current "IX. On-Chain" section has a single bullet pointing to contracts.json. Expand to surface the ecosystem contracts and their documentation files.

### FR-2: Add Data & Research section to README.md
Add a section exposing the data exports and analytical datasets that exist in `_codex/data/`.

### FR-3: Update SUMMARY.md with On-Chain and Data sections
SUMMARY.md serves as the table of contents. Add sections for ecosystem contracts and data exports, matching the structure already present in README.md and llms.txt.

### FR-4: Create `_codex/data/README.md`
Index file for the data directory explaining what each export is, its format, and when it was last updated.

### FR-5: Verify gaps.json accuracy
Confirm all gap statuses match reality. Verify GAP-001 (custom commissions) is still accurate given the Mijedi community grail addition. Check scope.json entity types match current state.

## Non-Requirements

- No changes to browse pages (browse dimensions are for the collection, not ecosystem docs)
- No changes to llms.txt (already complete)
- No changes to manifest.json (already complete)
- No new data files

## Success Criteria

- All on-chain documentation files are discoverable from README.md within 2 clicks
- SUMMARY.md has complete table of contents including ecosystem and data
- `_codex/data/README.md` exists and indexes all 15+ files
- gaps.json and scope.json accurately reflect current state
