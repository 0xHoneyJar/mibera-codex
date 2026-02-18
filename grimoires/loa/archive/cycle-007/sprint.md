# Sprint Plan: Mibera Grails — 1/1 Collection Integration

**Cycle**: 007
**Sprints**: 2 (global IDs: 11–12)
**Date**: 2026-02-17
**PRD**: `grimoires/loa/prd.md`
**SDD**: `grimoires/loa/sdd.md`

---

## Sprint 1: Foundation & Content (Global Sprint 11)

**Goal**: Create the Grails infrastructure (schema, template, script) and all 42 content pages.

### Task 1.1: Create Grail Schema & Template

**Description**: Create `_schema/grail.schema.json` (JSON Schema Draft 2020-12) and `_templates/grail.md` per SDD §3.2 and §4.5.

**Acceptance Criteria**:
- `_schema/grail.schema.json` exists with required fields: `id`, `name`, `type` (const "grail"), `category` (enum of 8 values)
- `_templates/grail.md` exists with frontmatter skeleton and placeholder body
- Schema uses `additionalProperties: false`

### Task 1.2: Create Generator Script

**Description**: Create `_scripts/generate-grails.py` per SDD §5.1. Single Python 3 script (stdlib only) that reads `grails/*.md` frontmatter and generates `browse/grails.md` + `_data/grails.jsonl`.

**Acceptance Criteria**:
- Script parses YAML frontmatter via regex (no PyYAML)
- Generates `browse/grails.md` with categories in order: element, luminary, concept, zodiac, planet, ancestor, primordial, special
- Generates `_data/grails.jsonl` sorted by token ID
- Includes generation timestamp in browse page HTML comment
- Idempotent — safe to re-run
- Exits with error if any file missing required fields
- Update `_scripts/README.md` with new script entry

### Task 1.3: Create 42 Grail Content Pages

**Description**: Create `grails/{slug}.md` for each of the 42 Grails per SDD §4.1. Each file has YAML frontmatter (id, name, type, category, description) and the artist's description as body content.

**Source data**:
- Token IDs: PRD §9
- Artist descriptions: Provided in stakeholder interview (cycle-007 context)
- Slug convention: kebab-case of name (SDD §3.4)

**Acceptance Criteria**:
- 42 markdown files in `grails/` matching the slug convention
- Each has frontmatter with all 5 fields (id, name, type, category, description)
- Each has H1 heading, blockquote header with token ID / category / browse link, and artist description body
- Uranus and Gaia each include the combined-piece callout (SDD §4.6)
- "Satoshi as Hermes" is the canonical name (not just "Satoshi")

### Task 1.4: Create Grails Index

**Description**: Create `grails/index.md` — hand-authored categorized directory per SDD §4.2.

**Acceptance Criteria**:
- Lists all 42 Grails organized by category (8 sections)
- Each entry shows name link + token ID
- Category counts in section headings match actual counts

---

## Sprint 2: Integration & Validation (Global Sprint 12)

**Goal**: Cross-link Grails into existing codex pages, update navigation, run generation, and validate.

### Task 2.1: Cross-Link Ancestor Pages

**Description**: Add Grail callout to 11 ancestor lore pages per SDD §4.4. Insert blockquote after H1 heading: `> **1/1 Grail**: [Name Grail (#ID)](../../grails/{slug}.md)`

**Target files** (11):
- `core-lore/ancestors/buddhist.md` → #9503
- `core-lore/ancestors/chinese.md` → #392
- `core-lore/ancestors/ethiopian.md` → #7702
- `core-lore/ancestors/greek.md` → #1630
- `core-lore/ancestors/hindu.md` → #8277
- `core-lore/ancestors/japanese.md` → #4363
- `core-lore/ancestors/mayan.md` → #3970
- `core-lore/ancestors/mongolian.md` → #507
- `core-lore/ancestors/native-american.md` → #3282
- `core-lore/ancestors/rastafarian.md` → #1134
- `core-lore/ancestors/satanist.md` → #8557

**Acceptance Criteria**:
- All 11 ancestor pages have the Grail callout
- Callout is positioned after H1, before first H2
- Relative paths resolve correctly from `core-lore/ancestors/` to `grails/`

### Task 2.2: Cross-Link Element & Astrology Pages

**Description**: Add Grail reference line to 4 element pages and 12 astrology pages per SDD §4.4.

**Element targets** (4): fire.md (#6458), water.md (#6761), earth.md (#3244), air.md (#2769) in `traits/overlays/elements/`

**Astrology targets** (12): All zodiac files in `traits/overlays/astrology/`

**Acceptance Criteria**:
- 4 element pages have `**1/1 Grail:**` line before closing `---`
- 12 astrology pages have `**1/1 Grail:**` line after final Rising Sign section
- Relative paths resolve correctly from `traits/overlays/*/` to `grails/`

### Task 2.3: Update Navigation & Manifest

**Description**: Update SUMMARY.md, browse/index.md, and manifest.json per SDD §6.

**Acceptance Criteria**:
- `SUMMARY.md`: Grails section added under "V. The Collection" with links to `grails/index.md` and `browse/grails.md`
- `browse/index.md`: Grails dimension added with description
- `manifest.json`: `grail` in entity_types, browse dimensions, schemas, data_exports

### Task 2.4: Generate & Validate

**Description**: Run `generate-grails.py` to produce browse page and data export. Run audit scripts to verify all links and structural integrity.

**Acceptance Criteria**:
- `browse/grails.md` exists with all 42 Grails across 8 categories
- `_data/grails.jsonl` exists with 42 records
- `audit-links.sh` passes with no new broken links
- `audit-structure.sh` passes (if it supports the new schema)
- Manual spot-check: 3+ Grail pages render correctly in preview

---

## Dependencies

```
Task 1.1 (schema/template)
   └──→ Task 1.3 (content pages) ──→ Task 1.4 (index)
Task 1.2 (script)
   └──→ Task 2.4 (generate & validate)
Task 1.3 (content pages)
   └──→ Task 2.1 (ancestor cross-links)
   └──→ Task 2.2 (element/astrology cross-links)
   └──→ Task 2.4 (generate & validate)
Task 2.3 (navigation) has no blockers
```

## Risk Notes

- **Ancestor page format variation**: Each of the 11 pages should be read before inserting the callout to ensure consistent placement after H1
- **Artist description source**: Descriptions come from the stakeholder interview transcript; preserve original voice

---

*Generated by `/sprint-plan` — Cycle 007*
