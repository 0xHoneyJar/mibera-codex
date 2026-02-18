# Sprint Plan: GitHub-First Navigation Restructure

**Cycle**: 008
**PRD**: `grimoires/loa/prd.md`
**SDD**: `grimoires/loa/sdd.md`

---

## Overview

Single sprint. All tasks are mechanical path/filename substitutions with zero logic changes. The SDD defines a strict phase order: infrastructure consolidation first (so scripts work from new location), then index rename (validated by working scripts), then regenerate and validate.

---

## Sprint 1: Full Migration

**Goal**: Complete the GitHub-first restructure — consolidate infrastructure into `_codex/`, rename all `index.md` → `README.md`, update all references, validate.

### Task 1.1: Consolidate infrastructure directories into `_codex/`

**Description**: Create `_codex/` with `data/`, `schema/`, `scripts/`, `templates/` subdirectories. Move all files from `_data/`, `_schema/`, `_scripts/`, `_templates/` via `git mv`. Update all script REPO_ROOT resolution (Pattern A: `.parent.parent` → `.parent.parent.parent`; Pattern B: `..` → `../..`). Update all hardcoded path strings in scripts (`_data/` → `_codex/data/`, `_scripts/` → `_codex/scripts/`, etc.). Update generated file header strings. Update audit script EXCLUDE sets and report paths.

**Acceptance criteria**:
- [ ] All files moved to `_codex/{data,schema,scripts,templates}/`
- [ ] Old `_data/`, `_schema/`, `_scripts/`, `_templates/` directories no longer exist
- [ ] Every script's REPO_ROOT resolves to repo root from new location
- [ ] All hardcoded `_data/`, `_scripts/`, `_schema/` strings updated in scripts
- [ ] `audit-links.sh` EXCLUDE set updated from `_scripts` to `_codex`
- [ ] Report paths updated to `_codex/scripts/reports/`

**Dependencies**: None (first task)

### Task 1.2: Update navigation and machine-readable files

**Description**: Update `manifest.json` (all 15+ schema, data, ontology, generator path references). Update `llms.txt` (3 path references). Update `SUMMARY.md` (1 `_schema/` → `_codex/schema/` path). Update `_codex/schema/ontology.yaml` (7 internal schema path references). Update `_codex/schema/README.md` (2 script path references). Update `_codex/scripts/README.md` (invocation path from `./_scripts/` to `./_codex/scripts/`).

**Acceptance criteria**:
- [ ] `manifest.json` — all paths resolve to `_codex/` locations
- [ ] `llms.txt` — all 3 path references updated
- [ ] `SUMMARY.md` — schema link points to `_codex/schema/README.md`
- [ ] `ontology.yaml` — all 7 schema references updated
- [ ] `_codex/schema/README.md` — script references updated
- [ ] `_codex/scripts/README.md` — invocation path updated
- [ ] `python3 -c "import json; json.load(open('manifest.json'))"` passes

**Dependencies**: Task 1.1

### Task 1.3: Rename `index.md` → `README.md` and update all links

**Description**: `git mv` all 26 content `index.md` files to `README.md`. Bulk-replace `(index.md)` → `(README.md)` in 10,000 mibera files (Python one-liner). Update root `README.md` (9 references). Update `SUMMARY.md` (29 references). Update 6 browse pages. Update `birthdays/timeline.md` (1 reference). Update `_codex/schema/README.md` (2 references). Update scripts that generate `index.md` links (`generate-browse.sh`, `generate-clusters.py`) or skip `index.md` when reading directories (`generate-grails.py`, `normalize-data.py`).

**Acceptance criteria**:
- [ ] 26 content `index.md` files renamed to `README.md`
- [ ] `find . -name index.md -not -path './grimoires/*' -not -path './.git/*'` returns 0 results
- [ ] All 10,000 mibera files link to `(README.md)` not `(index.md)`
- [ ] Root `README.md` — all 9 content links updated
- [ ] `SUMMARY.md` — all 29 content links updated
- [ ] 6 browse pages — back-links updated
- [ ] Scripts generate `README.md` references (not `index.md`)
- [ ] Scripts skip `README.md` (not `index.md`) when reading directories

**Dependencies**: Task 1.2 (navigation files settled before mass rename)

### Task 1.4: Regenerate, validate, and verify

**Description**: Run every generator script from new `_codex/scripts/` location to update generated file headers and verify output. Run `audit-links.sh` and `audit-structure.sh`. Verify no stale references to old paths remain. Spot-check that generated content is identical (minus path strings in headers).

**Acceptance criteria**:
- [ ] All generators run successfully: `generate-browse.sh`, `generate-clusters.py`, `generate-grails.py`, `generate-exports.py`, `generate-graph.py`, `generate-stats.py`, `generate-backlinks.py`, `generate-llms-full.py`
- [ ] `audit-links.sh` — 0 new broken links
- [ ] `audit-structure.sh` — 0 errors
- [ ] `grep -r '_scripts/' --include='*.md' --include='*.json' --include='*.yaml' --include='*.txt' .` — no results outside `_codex/`
- [ ] `grep -r '_data/' --include='*.md' --include='*.json' --include='*.yaml' --include='*.txt' .` — no results outside `_codex/`
- [ ] `grep -r '_schema/' --include='*.md' --include='*.json' --include='*.yaml' --include='*.txt' .` — no results outside `_codex/`
- [ ] `grep -r '(index.md)' --include='*.md' .` — no results outside `grimoires/`
