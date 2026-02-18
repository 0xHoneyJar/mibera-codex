# Sprint Plan: Cycle 003 — Data Architecture & Machine Readability

**Version**: 1.0.0
**Date**: 2026-02-15
**Cycle**: 003
**PRD**: `grimoires/loa/prd.md`
**SDD**: `grimoires/loa/sdd.md`
**Sprints**: 3

---

## Sprint 1: YAML Frontmatter Migration & Schemas

**Goal**: Add YAML frontmatter to all 10,000 Mibera files. Create formal JSON Schema files. Create community infrastructure files. Verify existing tools still work after migration.

### Tasks

#### S1-T1: Create `_scripts/add-frontmatter.py` and migrate all 10,000 Mibera files

**Description**: Write the frontmatter extraction script per SDD 3.1. Parse each Mibera's markdown table, extract field values (link text, None→null, integers), and insert YAML frontmatter block above existing content. Run on all 10,000 files.

**Acceptance Criteria**:
- [ ] `_scripts/add-frontmatter.py` exists and is executable
- [ ] All 10,000 Mibera files have valid YAML frontmatter
- [ ] Frontmatter contains all 27 fields per SDD 3.1.3
- [ ] `id` is integer (not zero-padded), `type` is `"mibera"` on every file
- [ ] Link display text correctly extracted (e.g., `[Freetekno](...)` → `Freetekno`)
- [ ] `None` values stored as YAML `null`
- [ ] `swag_score` stored as integer
- [ ] `birthday` stored as original link text (e.g., `"07/21/1352 Ce 19:47"`)
- [ ] Existing markdown table and content below unchanged
- [ ] Script is idempotent (re-running produces no changes)

#### S1-T2: Verify existing tools after frontmatter migration

**Description**: Run `audit-structure.sh`, `audit-links.sh`, and `generate-browse.sh` to ensure frontmatter insertion didn't break existing parsing. Fix any regressions.

**Acceptance Criteria**:
- [ ] `audit-structure.sh`: 0 errors, 0 warnings (same as pre-migration)
- [ ] `audit-links.sh`: ≤10 broken links (same as pre-migration baseline)
- [ ] `generate-browse.sh`: runs without warnings, output unchanged
- [ ] Any tool regressions identified and fixed

#### S1-T3: Create JSON Schema files

**Description**: Create 7 JSON Schema files in `_schema/` per SDD 3.4. Each schema defines required fields, types, and enum constraints.

**Acceptance Criteria**:
- [ ] `_schema/mibera.schema.json` exists with all 27 properties, enum constraints for archetype/element/swag_rank
- [ ] `_schema/drug.schema.json` exists
- [ ] `_schema/ancestor.schema.json` exists
- [ ] `_schema/tarot-card.schema.json` exists
- [ ] `_schema/trait-full.schema.json` exists
- [ ] `_schema/trait-minimal.schema.json` exists
- [ ] `_schema/special-collection.schema.json` exists
- [ ] All schemas use JSON Schema Draft 2020-12
- [ ] All schemas are syntactically valid JSON

#### S1-T4: Create community infrastructure files

**Description**: Create `CONTRIBUTING.md` and `CODEOWNERS` per SDD 3.8. Content guidelines, PR template, review process, protection zones.

**Acceptance Criteria**:
- [ ] `CONTRIBUTING.md` exists with all 7 sections from SDD 3.8.1
- [ ] `CODEOWNERS` exists with protection zones per SDD 3.8.2
- [ ] CODEOWNERS syntax is valid (slash-prefixed paths, team references)

---

## Sprint 2: Data Normalization & Export Pipeline

**Goal**: Normalize data inconsistencies across drug and trait files. Generate JSONL bulk export. Create semantic validation script.

### Tasks

#### S2-T1: Create `_scripts/normalize-data.py` and normalize all dates and swag_scores

**Description**: Write normalization script per SDD 3.2. Process drug files (~78) and trait files (~1,300) to standardize `date_added` to ISO format and `swag_score` to integer. Handle all edge cases from the data format survey.

**Acceptance Criteria**:
- [ ] `_scripts/normalize-data.py` exists and is executable
- [ ] All drug `date_added` values are ISO format (`YYYY-MM-DD`)
- [ ] All trait `date_added` values are ISO format, `YYYY-MM`, or `null` (for malformed)
- [ ] All drug `swag_score` values are integers (not quoted strings)
- [ ] Multi-value swag_scores (`"2,3,4"`) resolved to first value as integer
- [ ] `---` and empty swag_scores normalized to `null`
- [ ] 56 trait files with `**Introduced By:**` as date_added → set to `null`
- [ ] Malformed entries logged to stdout as warnings
- [ ] Script is idempotent
- [ ] No changes to markdown body content

#### S2-T2: Create `_scripts/generate-exports.py` and generate `_data/miberas.jsonl`

**Description**: Write JSONL export script per SDD 3.3. Read all Mibera YAML frontmatter, output one JSON object per line sorted by ID.

**Acceptance Criteria**:
- [ ] `_scripts/generate-exports.py` exists and is executable
- [ ] `_data/miberas.jsonl` exists with exactly 10,000 lines
- [ ] Each line is valid JSON
- [ ] All required fields present (27 fields per Mibera)
- [ ] `null` for None values (not `"None"`)
- [ ] `swag_score` as integer
- [ ] `id` values 1–10000, no gaps, sorted ascending
- [ ] Self-validation passes (count, JSON validity, field presence)

#### S2-T3: Create `_scripts/audit-semantic.py`

**Description**: Write semantic validation script per SDD 3.5. Cross-reference data across entity types for logical consistency.

**Acceptance Criteria**:
- [ ] `_scripts/audit-semantic.py` exists and is executable
- [ ] Checks all 8 validations from SDD 3.5.1
- [ ] Output is JSON report at `_scripts/reports/audit-semantic.json`
- [ ] Runs in <30 seconds
- [ ] Report documents any violations found (these may be pre-existing data issues)

---

## Sprint 3: Content Enrichment & Final Validation

**Goal**: Generate backlink sections on entity files. Create llms-full.txt. Run full validation suite.

### Tasks

#### S3-T1: Create `_scripts/generate-backlinks.py` and generate backlinks on all entity files

**Description**: Write backlink generation script per SDD 3.6. Parse Mibera frontmatter to build drug/ancestor lookup maps. Insert `@generated:backlinks` sections on all drug, ancestor, and tarot card files.

**Acceptance Criteria**:
- [ ] `_scripts/generate-backlinks.py` exists and is executable
- [ ] All 78 drug files have `<!-- @generated:backlinks-start/end -->` markers
- [ ] All 33 ancestor files have backlink sections
- [ ] All 78 tarot card files have backlink sections
- [ ] Inline links use format `[#NNNN](../miberas/NNNN.md)` with `•` separator
- [ ] Max 50 inline links with "... and N more" for larger groups
- [ ] Total count shown in italics
- [ ] Script is idempotent (re-running produces same output)
- [ ] `audit-links.sh` shows no new broken links from backlinks

#### S3-T2: Create `_scripts/generate-llms-full.py` and generate `llms-full.txt`

**Description**: Write concatenation script per SDD 3.7. Combine core lore files into a single plain-text file for LLM context loading.

**Acceptance Criteria**:
- [ ] `_scripts/generate-llms-full.py` exists and is executable
- [ ] `llms-full.txt` exists in repo root
- [ ] Contains all 7 section groups from SDD 3.7.1 (IDENTITY, philosophy, archetypes, drug-tarot-system, glossary, 33 ancestors, 78 drugs)
- [ ] Section markers present (`═══...` separator with SECTION name and Source)
- [ ] YAML frontmatter stripped from ancestor and drug files
- [ ] File size <300KB
- [ ] Readable as plain text

#### S3-T3: Final validation, manifest update, and cleanup

**Description**: Run full validation suite (structure, links, semantic). Update `manifest.json` with new artifacts. Update `SUMMARY.md` if needed. Update `NOTES.md` with observations.

**Acceptance Criteria**:
- [ ] `audit-structure.sh`: 0 errors, 0 warnings
- [ ] `audit-links.sh`: ≤10 broken links (no regressions from baseline)
- [ ] `audit-semantic.py`: report generated, violations documented
- [ ] `manifest.json` updated with new paths (`_data/`, `_schema/` schemas, `llms-full.txt`)
- [ ] `llms.txt` updated to reference new artifacts (JSONL, schemas, llms-full.txt)
- [ ] `grimoires/loa/NOTES.md` updated with Cycle 003 observations
- [ ] All new scripts listed in `_schema/README.md` or equivalent documentation

---

*Sprint plan generated by /simstim Phase 5 — Cycle 003*
*No commits made. All changes local.*
