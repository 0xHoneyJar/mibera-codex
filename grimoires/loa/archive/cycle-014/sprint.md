# Sprint Plan: Agent Surface — BUTTERFREEZONE, CLAUDE.md & Ground Truth

**Cycle**: 014
**Sprint**: 1 of 2, Global: 21
**Label**: CLAUDE.md & Ground Truth Population

---

## Overview

Sprint 1 focuses on the two foundational layers that all other agent surfaces depend on: project-specific CLAUDE.md instructions and citation-grounded truth files. Sprint 2 will build BUTTERFREEZONE.md on top of these.

---

### Task 1: Customize CLAUDE.md with codex-specific instructions

**Priority**: P0

Write project-specific content in `CLAUDE.md` below the existing `@.claude/loa/CLAUDE.loa.md` import. This is the primary orientation document for any agent working in the repo.

**Acceptance Criteria**:
- `CLAUDE.md` contains the `@` import line (preserve existing)
- Project-specific section includes:
  - "Start here" pointers to `IDENTITY.md`, `manifest.json`, `llms.txt`
  - Signal hierarchy (Load-bearing > Textural > Modifiers) with specific trait names
  - Lookup patterns: Mibera by ID (`miberas/{NNNN}.md`), trait by slug, browse by dimension
  - Entity conventions: YAML frontmatter, markdown tables, backlink markers
  - Scope boundaries: reference `_codex/data/scope.json`, list what codex does NOT track
  - Safety rules: never hallucinate trait values, never invent entities, always read source
  - Script conventions: stdlib-only Python, regex YAML parsing, no PyYAML
  - Link conventions: relative markdown links, validated by `audit-links.sh`
  - Backlink markers: `<!-- @generated:backlinks-start/end -->`
  - `_` prefix convention for GitHub directory sorting
  - Data exports: `_codex/data/miberas.jsonl`, `graph.json`, schema files
- No framework instructions duplicated (those come from the `@` import)

### Task 2: Populate ground truth — index.md

**Priority**: P0

Create the hub file that links to the other 4 ground truth files with quick stats.

**Acceptance Criteria**:
- `grimoires/loa/ground-truth/index.md` populated (non-empty)
- Contains quick stats: file counts, entity counts, directory count
- Links to `architecture.md`, `api-surface.md`, `behaviors.md`, `contracts.md`
- All factual claims cite source as `file:section` or `file:line`
- Token budget: ~500 tokens

### Task 3: Populate ground truth — architecture.md

**Priority**: P0

Document the codex's structural architecture: directory layout, signal hierarchy, entity relationships.

**Acceptance Criteria**:
- `grimoires/loa/ground-truth/architecture.md` populated
- Covers: directory structure, signal hierarchy (from `IDENTITY.md`), entity relationship model (from `_codex/schema/ontology.yaml`)
- Content directories listed with file counts (from `manifest.json`)
- All factual claims cite source (`IDENTITY.md:section`, `manifest.json:field`, etc.)
- Token budget: ~2000 tokens

### Task 4: Populate ground truth — api-surface.md

**Priority**: P0

Document the codex's "API" — lookup patterns, data exports, schema files.

**Acceptance Criteria**:
- `grimoires/loa/ground-truth/api-surface.md` populated
- Covers: file lookup patterns (from `llms.txt`), data export files (`_codex/data/`), schema files (`_codex/schema/`), browse dimensions (`browse/`)
- All data files listed with sizes and formats
- All factual claims cite source
- Token budget: ~2000 tokens

### Task 5: Populate ground truth — behaviors.md

**Priority**: P0

Document the codex's runtime behaviors: validation scripts, generation pipeline, backlink system.

**Acceptance Criteria**:
- `grimoires/loa/ground-truth/behaviors.md` populated
- Covers: audit scripts (`audit-links.sh`, `audit-structure.sh`, `audit-semantic.py`), generation scripts (`generate-*.py/sh`), backlink generation, export pipeline
- Script descriptions include what each produces and its dependencies
- All factual claims cite source (`_codex/scripts/README.md`, script files)
- Token budget: ~2000 tokens

### Task 6: Populate ground truth — contracts.md

**Priority**: P0

Document the codex's entity contracts: frontmatter schemas, cross-entity references, naming conventions.

**Acceptance Criteria**:
- `grimoires/loa/ground-truth/contracts.md` populated
- Covers: YAML frontmatter contracts per entity type (from `_codex/schema/*.schema.json`), required vs optional fields, cross-entity reference patterns, naming conventions
- Schema file references with field counts
- All factual claims cite source
- Token budget: ~2000 tokens

### Task 7: Regenerate ground truth checksums

**Priority**: P1

Update `grimoires/loa/ground-truth/checksums.json` with SHA-256 hashes of all populated files.

**Acceptance Criteria**:
- `checksums.json` updated with current `generated_at` timestamp
- `git_sha` set to current HEAD
- All 5 ground truth files have non-empty-string SHA-256 hashes
- Hashes match actual file contents

---

# Sprint 2

**Sprint**: 2 of 2, Global: 22
**Label**: BUTTERFREEZONE.md & Config

---

### Task 1: Add butterfreezone config to .loa.config.yaml

**Priority**: P0

Add the `butterfreezone` section with ecosystem links, culture block, and capability declarations.

**Acceptance Criteria**:
- `.loa.config.yaml` has `butterfreezone:` section
- Ecosystem entries for `0xHoneyJar/loa` (framework) and `0xHoneyJar/midi-interface` (consumer)
- Culture block with naming etymology, methodology, and principles
- Capability requirements declared (filesystem: read)
- No existing config sections modified

### Task 2: Author BUTTERFREEZONE.md

**Priority**: P0

Hand-author the mesh-compatible agent context file adapted for `type: codex`.

**Acceptance Criteria**:
- `BUTTERFREEZONE.md` exists at repo root
- Valid AGENT-CONTEXT block with: `name: mibera-codex`, `type: codex`, `purpose`, `version: 1.0.0`, `key_files`, `interfaces`, `ecosystem` entries, `trust_level: L1-self-declared`
- All `## Section` headers have `<!-- provenance: ... -->` tags
- Sections present: Key Capabilities, Architecture, Interfaces, Module Map, Verification, Agents, Culture, Quick Start
- Key Capabilities lists entity types with counts (from `manifest.json`)
- Architecture describes signal hierarchy and directory layout
- Interfaces lists lookup patterns and data exports
- Module Map is a markdown table with directories, file counts, purposes
- Verification references audit scripts and schema validation
- Agents describes embodiment persona from `IDENTITY.md`
- Culture describes ravepill philosophy and archetype system
- Quick Start adapted from `llms.txt` intro
- `<!-- ground-truth-meta -->` block with `head_sha`, `generated_at`, section checksums
- Total content ≥ 500 words
- Total content ≤ 3400 words
- No stub text ("No description available")

### Task 3: Validate BUTTERFREEZONE.md

**Priority**: P1

Run validation and fix any issues.

**Acceptance Criteria**:
- `butterfreezone-validate.sh` runs without errors (warnings OK for `type: codex`)
- All file references in backticks resolve to existing files
- Word count within budget
- ground-truth-meta checksums match actual section content
