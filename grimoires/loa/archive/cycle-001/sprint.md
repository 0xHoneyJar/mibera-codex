# Sprint Plan: Cycle 001 — Codex Foundation

**Version**: 1.0.0
**Date**: 2026-02-15
**Cycle**: 001
**PRD**: `grimoires/loa/prd.md`
**SDD**: `grimoires/loa/sdd.md`
**Sprints**: 3

---

## Sprint 1: Structural Audit & Validation Scripts

**Goal**: Build validation tooling and run the first comprehensive audit of all 11,526 files.

### Tasks

#### S1-T1: Create `_scripts/` directory and audit-structure.sh

**Description**: Write a Bash script that validates every content file against its expected schema. Must handle all 7 content types (Mibera, Trait, Drug, Ancestor, Tarot Card, Special Collection, Birthday Era).

**Acceptance Criteria**:
- [ ] Script runs on all 11,526 files in <60 seconds
- [ ] Validates Mibera files have all 25 table fields with non-empty values
- [ ] Validates YAML frontmatter files have required fields per type
- [ ] Outputs JSON report to `_scripts/reports/audit-structure.json`
- [ ] Report includes per-type counts: total, passed, warnings, errors
- [ ] Individual issues listed with file path and description

#### S1-T2: Create audit-links.sh

**Description**: Write a Bash script that validates every relative Markdown link across the entire codex resolves to an existing file.

**Acceptance Criteria**:
- [ ] Finds all `[text](path)` links in all .md files
- [ ] Verifies target files exist at the resolved relative path
- [ ] Reports broken links with source file, line number, and target path
- [ ] Outputs JSON report to `_scripts/reports/audit-links.json`
- [ ] Runs in <120 seconds

#### S1-T3: Run audits and fix critical issues

**Description**: Execute both audit scripts. Triage results. Fix all errors (P0). Document warnings for future cycles.

**Acceptance Criteria**:
- [ ] Both audit scripts run successfully
- [ ] All errors (broken links, missing required fields) are fixed
- [ ] Warnings documented in `grimoires/loa/NOTES.md`
- [ ] Final audit reports show 0 errors

**Dependencies**: S1-T1, S1-T2

---

## Sprint 2: Agent Navigation Layer & Schema Documentation

**Goal**: Create the agent-facing entry points and schema reference so AI agents can navigate the codex programmatically.

### Tasks

#### S2-T1: Create `llms.txt`

**Description**: Write the agent entry point file at repo root following llms.txt conventions. Describes codex structure, content types, key files, and lookup patterns.

**Acceptance Criteria**:
- [ ] `llms.txt` exists at repo root
- [ ] Contains content type descriptions with file patterns
- [ ] References IDENTITY.md, manifest.json, and schema docs
- [ ] Concise — under 50 lines
- [ ] Accurate — all paths verified against actual repo structure

#### S2-T2: Create `manifest.json`

**Description**: Write the directory-level JSON index at repo root. Maps entity types to directories, counts, formats, and navigation files.

**Acceptance Criteria**:
- [ ] `manifest.json` exists at repo root
- [ ] All 7 entity types indexed with correct directory paths
- [ ] File counts match actual counts from audit
- [ ] Navigation section references all key files
- [ ] Valid JSON (passes `jq .` validation)

#### S2-T3: Create `_schema/README.md`

**Description**: Write comprehensive schema documentation covering all content type formats, required fields, value formats, and examples.

**Acceptance Criteria**:
- [ ] Documents all 7 content type schemas
- [ ] Each schema lists fields, types, required/optional, and examples
- [ ] Includes formatting conventions (date format, link syntax, coordinates)
- [ ] Includes a "common mistakes" section
- [ ] Renders correctly in GitHub, Gitbook, and Obsidian

**Dependencies**: Sprint 1 (audit results inform exact field inventory)

---

## Sprint 3: Browse Page Generation & Navigation Updates

**Goal**: Fill navigation gaps by generating missing browse pages and updating top-level navigation files.

### Tasks

#### S3-T1: Create `generate-browse.sh`

**Description**: Write a Bash script that reads all 10,000 Mibera files and generates browse pages grouped by drug, era, element, and tarot card. Output format must match existing browse pages.

**Acceptance Criteria**:
- [ ] Generates `browse/by-drug.md`, `browse/by-era.md`, `browse/by-element.md`, `browse/by-tarot.md`
- [ ] Format matches existing `browse/by-archetype.md` style
- [ ] Each group includes count and Mibera links
- [ ] Generated files include `<!-- generated: {timestamp} -->` header
- [ ] Script is idempotent (safe to re-run)
- [ ] Runs in <120 seconds

#### S3-T2: Run generation and validate output

**Description**: Execute generate-browse.sh. Validate generated pages with audit-links.sh. Update `browse/index.md` to link all dimensions.

**Acceptance Criteria**:
- [ ] All 4 new browse pages generated
- [ ] Zero broken links in generated pages (verified by audit-links.sh)
- [ ] `browse/index.md` updated to link all 7 browse dimensions
- [ ] All browse pages have back-navigation to index

#### S3-T3: Update SUMMARY.md and final validation

**Description**: Update SUMMARY.md to include new browse pages, _schema, and agent files. Run full audit suite as final validation.

**Acceptance Criteria**:
- [ ] SUMMARY.md includes browse/by-drug, browse/by-era, browse/by-element, browse/by-tarot
- [ ] SUMMARY.md includes _schema/README.md
- [ ] Final audit-structure.sh: 0 errors
- [ ] Final audit-links.sh: 0 broken links
- [ ] All files render correctly in GitHub markdown preview

**Dependencies**: S3-T1, Sprint 1 (audit-links.sh)

---

## Sprint Summary

| Sprint | Tasks | Focus | Depends On |
|--------|-------|-------|------------|
| 1 | 3 | Audit tooling + fix issues | — |
| 2 | 3 | Agent layer + schema docs | Sprint 1 |
| 3 | 3 | Browse generation + nav updates | Sprint 1, 2 |

**Total tasks**: 9

---

*Sprint plan generated by /simstim Phase 5 — Cycle 001*
*No commits made. All changes local.*
