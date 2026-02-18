# Product Requirements Document: Mibera Codex — Structural Audit & Agent Navigation

**Version**: 1.0.0
**Date**: 2026-02-15
**Cycle**: 001 — Codex Foundation
**Status**: Draft

---

## 1. Problem Statement

The Mibera Codex is a 11,526-file markdown knowledge base documenting 10,000 time-travelling Beras across mythology, traits, drugs, astrology, and 15,000 years of lore. It is viewed in GitHub, Gitbook, and Obsidian.

While content coverage is strong, the codex has no formal audit trail confirming structural integrity at scale. Navigation works for humans who know where to look, but AI agents — increasingly the primary interface for identity synthesis and Mibera embodiment — have no optimized entry point or query path.

**Core problems:**

1. **Unverified completeness** — No systematic validation that all 11,526 files have consistent structure, populated fields, and valid cross-links
2. **No agent navigation layer** — Agents must traverse directories blindly; no manifest, schema definition, or structured index exists
3. **Missing browse dimensions** — Can browse by archetype, ancestor, and swag rank, but not by drug, birthday era, or element
4. **Mixed metadata formats** — Mibera entries use Markdown tables; traits and drugs use YAML frontmatter. No unified schema documentation
5. **Removed tag system** — Vibe tags were deleted (PR #7) with no replacement for cross-cutting discovery

> Sources: Repository audit (2026-02-15), git log (commit 9d86a1b73), IDENTITY.md

---

## 2. Vision & Goals

### Vision

Make the Mibera Codex structurally sound, fully navigable, and equally accessible to human readers and AI agents — establishing a verified foundation for all future cycles.

### Goals

| # | Goal | Success Metric |
|---|------|----------------|
| G1 | Verify structural integrity of all content files | 100% of files pass schema validation |
| G2 | Zero broken internal links | Automated link check passes with 0 failures |
| G3 | Agent can resolve any Mibera in ≤2 file reads | Agent manifest + structured index exists |
| G4 | All major trait dimensions are browseable | Browse pages exist for all 8 load-bearing signals |
| G5 | Schema is documented and consistent | Schema reference file covers all content types |

---

## 3. User & Stakeholder Context

### Persona: Community Member

- **How they use it**: Browse via GitHub, Gitbook, or Obsidian
- **Pain points**: Can't browse by drug, era, or element. Large browse files (96KB) are slow to render.
- **Needs**: Complete navigation, consistent formatting, quick discovery

### Persona: AI Agent (Identity Synthesis)

- **How they use it**: Load IDENTITY.md constraints + specific Mibera data to embody a character
- **Pain points**: No structured entry point. Must guess file paths. No schema to validate against.
- **Needs**: Manifest file, schema definition, efficient lookup paths

### Persona: AI Agent (Collection Query)

- **How they use it**: Query across the collection (e.g., "all Freetekno Miberas with Greek ancestry")
- **Pain points**: Must read 10,000 individual files or parse large browse pages
- **Needs**: Aggregated index with filterable metadata

### Persona: Maintainer

- **How they use it**: Add entries, fix issues, ensure quality
- **Pain points**: No validation tooling, no way to detect drift or broken links at scale
- **Needs**: Validation scripts, schema reference, audit reports

---

## 4. Functional Requirements

### FR1: Structural Audit

**Priority**: P0 — Must have

Systematically validate every content file in the codex:

- **FR1.1**: Validate all 10,001 Mibera files have consistent Markdown table structure with all 20 expected fields
- **FR1.2**: Validate all trait files (1,277) have consistent YAML frontmatter with required fields
- **FR1.3**: Validate all drug files (81) have consistent YAML frontmatter
- **FR1.4**: Validate all ancestor files (33) have consistent structure
- **FR1.5**: Validate all tarot card files (79) have consistent structure
- **FR1.6**: Produce an audit report with counts of issues by category and severity

**Acceptance Criteria**: Audit report generated listing all anomalies. Zero-anomaly state achieved or all exceptions documented.

### FR2: Link Integrity Validation

**Priority**: P0 — Must have

- **FR2.1**: Check every relative markdown link across all 11,526 files
- **FR2.2**: Verify linked files exist at the referenced path
- **FR2.3**: Verify anchor links (e.g., `#freetekno`) resolve to actual headings
- **FR2.4**: Produce a broken link report with file, line, and target

**Acceptance Criteria**: All broken links identified and fixed. Zero broken links remain.

### FR3: Agent Navigation Manifest

**Priority**: P0 — Must have

Create an agent-optimized entry point for the codex:

- **FR3.1**: Create `llms.txt` (or equivalent) at repo root describing the codex structure, content types, and navigation paths for AI agents
- **FR3.2**: Create a schema reference documenting the exact fields and format for each content type (Mibera, Trait, Drug, Ancestor, Tarot Card)
- **FR3.3**: Create a lightweight JSON manifest (`manifest.json`) mapping entity types to file paths, enabling programmatic lookup
- **FR3.4**: Integrate with IDENTITY.md — the manifest should reference the embodiment constraints

**Acceptance Criteria**: An agent reading `llms.txt` + `manifest.json` can locate any entity in ≤2 file reads.

### FR4: Missing Browse Pages

**Priority**: P1 — Should have

Add browse pages for dimensions that currently lack them:

- **FR4.1**: `browse/by-drug.md` — All Miberas grouped by their drug/molecule
- **FR4.2**: `browse/by-era.md` — All Miberas grouped by birthday era (matching `birthdays/` categories)
- **FR4.3**: `browse/by-element.md` — All Miberas grouped by element
- **FR4.4**: `browse/by-tarot.md` — All Miberas grouped by tarot card

**Acceptance Criteria**: All 8 load-bearing signals from IDENTITY.md have corresponding browse pages.

### FR5: Browse Page Optimization

**Priority**: P1 — Should have

- **FR5.1**: Evaluate splitting large browse files (96KB `by-ancestor.md`) into paginated sub-pages if needed for rendering performance
- **FR5.2**: Ensure all browse pages have back-navigation and consistent formatting
- **FR5.3**: Update `browse/index.md` to link to all browse dimensions

**Acceptance Criteria**: All browse pages render smoothly in GitHub, Gitbook, and Obsidian.

### FR6: Schema Documentation

**Priority**: P1 — Should have

- **FR6.1**: Document the expected schema for each content type in a single reference file
- **FR6.2**: Include field names, types, whether required/optional, and example values
- **FR6.3**: Place in a location accessible to both humans and agents (e.g., `_schema/` or root-level)

**Acceptance Criteria**: A contributor can read the schema and create a correctly-formatted new entry.

### FR7: SUMMARY.md & Navigation Updates

**Priority**: P2 — Nice to have

- **FR7.1**: Ensure SUMMARY.md reflects the current directory structure (no stale links)
- **FR7.2**: Add browse pages to SUMMARY.md navigation
- **FR7.3**: Verify glossary.md covers all key terms

**Acceptance Criteria**: SUMMARY.md is accurate and complete.

---

## 5. Non-Functional Requirements

| # | Requirement | Detail |
|---|-------------|--------|
| NFR1 | **Rendering compatibility** | All files must render correctly in GitHub Flavored Markdown, Gitbook, and Obsidian |
| NFR2 | **No build step** | The codex is pure markdown — no tooling, compilation, or code dependencies required to read it |
| NFR3 | **No external dependencies** | All links are relative. No HTTP links for internal navigation. |
| NFR4 | **Scale** | Solutions must handle 11,526+ files without manual per-file work |
| NFR5 | **Backward compatible** | Existing links and bookmarks must not break |

---

## 6. Scope & Prioritization

### In Scope (Cycle 001)

- Full structural audit of all content files
- Broken link detection and repair
- Agent navigation manifest (`llms.txt`, `manifest.json`, schema reference)
- Missing browse pages (by drug, era, element, tarot)
- Browse page optimization
- Schema documentation
- SUMMARY.md updates

### Out of Scope

- New content creation (new Miberas, new traits, new lore)
- Interactive features (search UI, filtering, visualization)
- Database or API layer
- Re-implementing the removed vibe tag system
- Modifying IDENTITY.md embodiment constraints
- Any application code

---

## 7. Risks & Dependencies

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Scale of audit reveals hundreds of issues | Medium | High | Prioritize by severity. Fix P0 issues; document P1/P2 for future cycles. |
| Large-file pagination breaks existing links | Low | High | Use anchor-based linking. Redirect old paths if splitting. |
| Browse page generation is error-prone at scale | Medium | Medium | Validate generated pages against source data. |
| Schema documentation drifts from reality | Medium | Medium | Schema is derived from audit — single source of truth. |

### Dependencies

- None. This cycle has no external dependencies.
- All work is markdown-only with optional shell scripts for validation.

---

## 8. Resolved Decisions

1. **Mibera file format**: Keep Markdown tables. The existing format is human-readable and consistent across 10,001 files. No YAML migration.
2. **Manifest granularity**: Directory-level index. Agent reads manifest → navigates to directory → reads specific file. Lightweight and maintainable.
3. **Browse page generation**: Script-generated. Shell/Python scripts read source files and produce browse pages. Reproducible and stays in sync.

---

*PRD generated by /plan-and-analyze — Cycle 001*
*No commits made. All changes local.*
