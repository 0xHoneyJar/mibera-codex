# PRD: Mibera Grails — 1/1 Collection Integration

**Cycle**: 007
**Status**: Draft
**Date**: 2026-02-17
**Author**: Claude (from stakeholder interview)

---

## 1. Problem Statement

The Mibera Codex documents 10,000 generative Miberas across 7 browse dimensions, schemas, lore pages, and data exports. However, the collection also includes **42 hand-drawn 1/1 art pieces ("Grails")** that exist on-chain in the same contract but have zero representation in the codex. There is no schema, no content pages, no browse index, and no cross-linking to the existing dimension pages they naturally connect to (elements, ancestors, zodiac, planets).

These Grails are thematically rich — referencing mythology (Dumuzi, Kali, Aphrodite, Odin), art history (Dali, Goya, Alex Grey), planetary frequencies (141.27 Hz Mercury, 221.23 Hz Venus), and cultural traditions. This content has no home yet.

Additionally, more 1/1s are planned but not yet created. The system must be template-driven to accommodate future additions without structural changes.

> Source: Stakeholder interview, 2026-02-17

## 2. Goals & Success Metrics

| Goal | Success Metric |
|------|---------------|
| G1: Grails have dedicated content pages | 42 markdown files in `grails/` with frontmatter + descriptions |
| G2: Grails are discoverable via browse | `browse/grails.md` index page exists with category groupings |
| G3: Cross-dimensional linking | 11 ancestor lore pages link prominently to their Grail counterpart |
| G4: Element page cross-linking | 4 element pages (by-element.md or element trait pages) reference their Grail |
| G5: Schema exists for Grails | `_schema/grail.schema.json` validates all Grail files |
| G6: Template for future 1/1s | Reusable template at `_templates/grail.md` (or equivalent) |
| G7: Data export includes Grails | `_data/grails.jsonl` exists with structured records |
| G8: Codex entry points updated | SUMMARY.md, browse/index.md, manifest.json reference Grails |

## 3. User & Stakeholder Context

**Primary user**: Codex maintainer (project owner) who needs to document the 1/1 collection and make it discoverable alongside the generative collection.

**Secondary users**: Community members browsing the codex in Obsidian or via exported formats who want to understand the relationship between the 1/1 art pieces and the generative Miberas they complement.

**Key constraint**: More 1/1s will be added over time. The system must not require structural changes to accommodate new entries — only new content files following the established template.

## 4. Functional Requirements

### F1: Grail Content Pages

Create individual markdown pages for each of the 42 known Grails in a `grails/` directory.

**Schema** (minimal, distinct from base Mibera schema):
- `id` (integer): Token ID within the Mibera Maker contract (randomly assigned)
- `name` (string): Display name (e.g., "Fire", "Aries", "Buddhist")
- `type` (string, constant): `"grail"`
- `category` (string): One of: `element`, `luminary`, `concept`, `zodiac`, `planet`, `ancestor`, `primordial`, `special`
- `description` (string): Short artist description of the piece

**Content body**: The detailed description provided by the artist, covering symbolism, references, frequencies, and artistic choices.

**Known Grails** (42 pieces):

| Category | Pieces |
|----------|--------|
| Element (4) | Fire, Water, Earth, Air |
| Luminary (2) | Sun, Moon |
| Concept (3) | Black Hole, Past, Future |
| Zodiac (12) | Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces |
| Planet (7) | Mercury, Venus, Mars, Jupiter, Saturn, Neptune, Pluto |
| Ancestor (11) | Buddhist, Native American, Rastafarian, Mayan, Mongolian, Ethiopian, Chinese, Japanese, Satanist, Hindu, Greek |
| Primordial (2) | Uranus, Gaia |
| Special (1) | Satoshi as Hermes |

**Display instruction**: Uranus placed on top of Gaia completes a combined piece. This should be noted on both pages but they remain separate entries.

**Acceptance criteria**:
- Each Grail has a markdown file at `grails/{slug}.md`
- Each file has YAML frontmatter matching the schema
- Each file has the artist's description as body content
- `grails/index.md` provides a categorized directory

### F2: Browse Index Page

Create `browse/grails.md` — a browse page organized by category showing all Grails with links.

**Format**: Consistent with existing browse pages (section per category, links to individual Grail pages).

### F3: Cross-Dimensional Linking

**Ancestor pages** (11 of 33): Each ancestor that has a corresponding Grail should prominently link to it. Add a callout or dedicated line near the top of the ancestor's lore page (e.g., `core-lore/ancestors/buddhist.md`).

**Element pages**: The enriched `browse/by-element.md` and/or `traits/overlays/elements/*.md` pages should reference their corresponding Grail.

**Zodiac/Planet**: If sun sign pages exist, link. Otherwise, note for future integration.

### F4: Schema & Template

- `_schema/grail.schema.json`: JSON Schema for Grail frontmatter validation
- `_templates/grail.md`: Template file for creating new Grails (frontmatter skeleton + placeholder body)

### F5: Data Export

- `_data/grails.jsonl`: One JSON record per Grail, structured for machine consumption
- Update `manifest.json` to reference Grails directory, schema, and data export

### F6: Navigation Updates

- `SUMMARY.md`: Add Grails section
- `browse/index.md`: Add Grails as a browse dimension

## 5. Technical Requirements

- **No breaking changes**: All existing links (260K+) must remain valid
- **Idempotent generation**: If a generation script is used for the browse page or data export, it must be safe to re-run
- **Template-driven**: New Grails are added by creating a file from the template; no script or schema changes needed
- **Obsidian-compatible**: All pages must render correctly in Obsidian reading mode

## 6. Scope & Prioritization

### In scope (this cycle)
- F1-F6 as described above
- 42 Grail content pages with artist descriptions
- Browse index, cross-links, schema, template, data export

### Out of scope
- Image hosting or embedding (no image files in the codex)
- On-chain metadata sync or API integration
- Grail-specific graph visualization tuning
- Trait enrichment beyond the artist descriptions provided
- Token ID lookup (IDs will be added when known; template allows TBD)

## 7. Risks & Dependencies

| Risk | Impact | Mitigation |
|------|--------|------------|
| ~~Token IDs unknown~~ | ~~Resolved~~ | All 42 token IDs found via on-chain metadata scan |
| More 1/1s added before cycle completes | Scope creep | Template handles this — new pieces are just new files |
| Ancestor lore pages have varied formats | Cross-linking may need per-page adaptation | Inspect each of the 11 pages during implementation |
| Artist descriptions may need editorial cleanup | Minor inconsistencies in the source text | Preserve original voice; only fix obvious typos |

## 8. Resolved Questions

1. **Token IDs**: ✅ All 42 on-chain token IDs found via metadata scan of the Irys gateway. Grails are randomly interspersed among the generative Miberas in the 1–10,000 ID range.
2. **Naming**: ✅ Directory will be `grails/`.
3. **Virgo description**: ✅ Complete as given.
4. **Special naming**: The "Satoshi" piece is named "Satoshi as Hermes" on-chain.

## 9. Token ID Reference

| Token ID | Grail | Category |
|----------|-------|----------|
| 235 | Scorpio | zodiac |
| 309 | Moon | luminary |
| 392 | Chinese | ancestor |
| 507 | Mongolian | ancestor |
| 876 | Black Hole | concept |
| 895 | Libra | zodiac |
| 1134 | Rastafarian | ancestor |
| 1606 | Pluto | planet |
| 1630 | Greek | ancestor |
| 2113 | Taurus | zodiac |
| 2256 | Neptune | planet |
| 2566 | Mars | planet |
| 2769 | Air | element |
| 3116 | Sun | luminary |
| 3201 | Jupiter | planet |
| 3222 | Gaia | primordial |
| 3244 | Earth | element |
| 3282 | Native American | ancestor |
| 3970 | Mayan | ancestor |
| 4221 | Past | concept |
| 4363 | Japanese | ancestor |
| 4488 | Satoshi as Hermes | special |
| 4617 | Venus | planet |
| 4734 | Future | concept |
| 4803 | Aries | zodiac |
| 6409 | Pisces | zodiac |
| 6458 | Fire | element |
| 6761 | Water | element |
| 6805 | Aquarius | zodiac |
| 7218 | Gemini | zodiac |
| 7321 | Sagittarius | zodiac |
| 7388 | Saturn | planet |
| 7702 | Ethiopian | ancestor |
| 7916 | Uranus | primordial |
| 8277 | Hindu | ancestor |
| 8557 | Satanist | ancestor |
| 8620 | Cancer | zodiac |
| 8834 | Virgo | zodiac |
| 8971 | Capricorn | zodiac |
| 9112 | Mercury | planet |
| 9503 | Buddhist | ancestor |
| 9639 | Leo | zodiac |

---

*Generated by `/plan-and-analyze` — Cycle 007*
