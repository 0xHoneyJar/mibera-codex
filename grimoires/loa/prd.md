# PRD: Agent Surface — BUTTERFREEZONE, CLAUDE.md & Ground Truth

**Cycle**: 014
**Date**: 2026-02-18
**Issues**: [#18](https://github.com/0xHoneyJar/mibera-codex/issues/18), [#19](https://github.com/0xHoneyJar/mibera-codex/issues/19)

---

## 1. Problem Statement

The mibera-codex has a fully mounted Loa framework (v1.39.1, 31 skills, `.claude/` System Zone, `.beads/`, 13 completed cycles) but three critical agent-facing surfaces remain empty or template-only:

1. **CLAUDE.md** contains no project-specific instructions — agents arrive with framework knowledge but zero codex context (no signal hierarchy, no lookup patterns, no conventions)
2. **BUTTERFREEZONE.md** doesn't exist — the Loa mesh system (`butterfreezone-mesh.sh`) can't discover the codex's capabilities, and cross-repo graphs show it as an `unknown` type node
3. **Ground truth files** are all 0 bytes — 5 empty files in `grimoires/loa/ground-truth/` that should contain verified, citation-grounded codebase facts

This means any agent working in or with this repo — whether via `/ride`, mesh queries, or direct development — gets no project-specific orientation and can't verify claims against ground truth.

## 2. Goals

1. **CLAUDE.md**: Encode codex-specific agent instructions — signal hierarchy, lookup patterns, entity conventions, scope boundaries, embodiment rules
2. **BUTTERFREEZONE.md**: Create a mesh-compatible agent context file using `type: codex` (non-standard, to be upstreamed later) with provenance-tagged sections adapted for a knowledge-base repo
3. **Ground truth**: Populate all 5 files (`index.md`, `architecture.md`, `behaviors.md`, `api-surface.md`, `contracts.md`) with citation-grounded content adapted for a markdown knowledge base rather than a code repo
4. **Config**: Add `butterfreezone` section to `.loa.config.yaml` with ecosystem links, culture block, and capability declarations

## 3. Background & Context

### What exists today

| Surface | File | Status |
|---------|------|--------|
| LLM summary | `llms.txt` (3.3 KB) | Complete |
| Full LLM context | `llms-full.txt` (547 KB) | Complete |
| Programmatic manifest | `manifest.json` (6.2 KB) | Complete |
| AI embodiment rules | `IDENTITY.md` (6.8 KB) | Complete |
| Table of contents | `SUMMARY.md` (5.0 KB) | Complete |
| Machine-readable scope | `_codex/data/scope.json` (2.8 KB) | Complete |
| Knowledge graph | `_codex/data/graph.json` (5.9 MB) | Complete |
| Schemas | `_codex/schema/*.schema.json` (8 files) | Complete |
| CLAUDE.md instructions | `CLAUDE.md` | **Template only** |
| BUTTERFREEZONE.md | — | **Missing** |
| Ground truth (5 files) | `grimoires/loa/ground-truth/` | **All empty** |
| Butterfreezone config | `.loa.config.yaml` | **Missing section** |

### Schema mismatch: codex vs. code repos

The `butterfreezone-gen.sh` is designed for code repos — it auto-detects `type` from `package.json`/`Cargo.toml`, extracts interfaces from `.claude/skills/`, and scans for code entry points. A markdown knowledge base requires adapted sections:

| BUTTERFREEZONE Section | Code Repo | Codex Adaptation |
|------------------------|-----------|------------------|
| Key Capabilities | Functions, exports | Entity types with counts (10K miberas, 78 drugs, etc.) |
| Architecture | Code topology, data flow | Signal hierarchy, entity relationship model, directory layout |
| Interfaces | API routes, CLI commands | Navigation patterns: browse dimensions, lookup by ID, JSONL export |
| Module Map | `src/`, `lib/` dirs | Content directories with counts and completeness |
| Verification | Test suites, CI | Schema validation, `manifest.json` completeness markers, audit scripts |
| Agents | Persona files | Embodiment rules from `IDENTITY.md` |
| Culture | Methodology | Ravepill philosophy, archetype system, temporal paradox |

### Ground truth adaptation

Ground truth files expect `file:line` citations to code. For a knowledge base:
- `architecture.md` → directory structure, signal hierarchy, entity relationships
- `api-surface.md` → lookup patterns, data exports, schema files
- `behaviors.md` → validation scripts, generation pipeline, backlink system
- `contracts.md` → entity schemas, frontmatter contracts, cross-entity references
- `index.md` → hub linking to the other 4 files with quick stats

## 4. Success Criteria

- [ ] `CLAUDE.md` contains codex-specific instructions (signal hierarchy, lookup patterns, scope, conventions)
- [ ] `BUTTERFREEZONE.md` passes `butterfreezone-validate.sh` (may warn on non-standard `type: codex`)
- [ ] `BUTTERFREEZONE.md` has valid AGENT-CONTEXT block with `type: codex`
- [ ] `BUTTERFREEZONE.md` has provenance tags on all sections
- [ ] `BUTTERFREEZONE.md` has ground-truth-meta block with `head_sha` and checksums
- [ ] `BUTTERFREEZONE.md` is 500+ words total
- [ ] All 5 ground truth files populated with citation-grounded content
- [ ] Grounding ratio ≥ 0.95 (95% of claims cite source `file:line`)
- [ ] `.loa.config.yaml` has `butterfreezone` section with ecosystem entries
- [ ] `butterfreezone-mesh.sh --live` no longer warns about missing BUTTERFREEZONE.md

## 5. Scope

### In Scope

1. **CLAUDE.md customization** — project-specific agent instructions below the `@` import
2. **BUTTERFREEZONE.md authoring** — hand-authored, adapted for `type: codex`
3. **Ground truth population** — all 5 files with codex-appropriate content
4. **`.loa.config.yaml` butterfreezone config** — ecosystem, culture, capabilities
5. **Checksums update** — regenerate `ground-truth/checksums.json` after population

### Out of Scope

- Upstream PR to Loa for `type: codex` support in `butterfreezone-gen.sh` / `butterfreezone-validate.sh`
- Construct packaging (depends on upstream codex type support)
- `/ride` execution (ground truth will be manually authored with proper grounding)
- Changes to existing codex content, schemas, or scripts
- SDD (no code architecture decisions needed — this is content authoring)

## 6. Deliverables

| # | Deliverable | File(s) |
|---|-------------|---------|
| 1 | Project-specific CLAUDE.md | `CLAUDE.md` |
| 2 | BUTTERFREEZONE.md | `BUTTERFREEZONE.md` |
| 3 | Ground truth index | `grimoires/loa/ground-truth/index.md` |
| 4 | Ground truth architecture | `grimoires/loa/ground-truth/architecture.md` |
| 5 | Ground truth API surface | `grimoires/loa/ground-truth/api-surface.md` |
| 6 | Ground truth behaviors | `grimoires/loa/ground-truth/behaviors.md` |
| 7 | Ground truth contracts | `grimoires/loa/ground-truth/contracts.md` |
| 8 | Ground truth checksums | `grimoires/loa/ground-truth/checksums.json` |
| 9 | Config update | `.loa.config.yaml` (butterfreezone section) |

## 7. CLAUDE.md Content Specification

The project-specific section should encode:

- **Start here**: Point agents to `IDENTITY.md`, `manifest.json`, `llms.txt`
- **Signal hierarchy**: Load-bearing > Textural > Modifiers (from `IDENTITY.md`)
- **Lookup patterns**: ID→file mapping, trait slugification, browse dimensions
- **Entity conventions**: YAML frontmatter, markdown tables, backlink markers
- **Scope boundaries**: Reference `_codex/data/scope.json` for what the codex tracks vs. doesn't
- **Safety rules**: NEVER hallucinate trait values, NEVER invent entities, always read source file
- **Scripts**: stdlib-only Python with regex YAML parsing, no PyYAML
- **Links**: relative markdown links, validated by `audit-links.sh`
- **Backlinks**: auto-generated between `<!-- @generated:backlinks-start/end -->` markers

## 8. BUTTERFREEZONE.md Content Specification

### AGENT-CONTEXT block

```yaml
name: mibera-codex
type: codex
purpose: Comprehensive lore documentation and machine-readable knowledge base for 10,000 time-travelling Beras — mythology, traits, drugs, astrology, spanning 15,000 years.
version: 1.0.0
key_files: [IDENTITY.md, manifest.json, llms.txt, _codex/schema/README.md, SUMMARY.md]
interfaces: [browse/README.md, _codex/data/miberas.jsonl, _codex/data/graph.json, llms-full.txt]
dependencies: []
ecosystem:
  - repo: 0xHoneyJar/loa
    role: framework
    interface: butterfreezone-mesh
  - repo: 0xHoneyJar/midi-interface
    role: consumer
    interface: badge-validation
trust_level: L1-self-declared
```

### Section mapping with provenance

| Section | Provenance | Content Source |
|---------|-----------|----------------|
| Key Capabilities | DERIVED | Entity type registry from `manifest.json` |
| Architecture | DERIVED | Signal hierarchy from `IDENTITY.md`, directory layout |
| Interfaces | CODE-FACTUAL | Lookup patterns from `llms.txt`, data exports |
| Module Map | CODE-FACTUAL | Content directories with file counts |
| Verification | CODE-FACTUAL | Audit scripts, schema validation, completeness markers |
| Agents | DERIVED | Embodiment persona from `IDENTITY.md` |
| Culture | OPERATIONAL | Ravepill philosophy, archetype system |
| Quick Start | OPERATIONAL | From `llms.txt` intro |

## 9. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| `butterfreezone-validate.sh` rejects `type: codex` | Medium | Low | Non-standard type produces warning, not error. Document for upstream. |
| Ground truth grounding ratio < 0.95 for non-code repo | Low | Medium | Adapt citation format: use `file:section` for markdown rather than `file:line` |
| BUTTERFREEZONE word budget (3400) too tight for codex entity descriptions | Low | Low | Prioritize entity counts over descriptions; link to `manifest.json` for details |

## 10. Dependencies

- None — all source data exists in the repo
- No external APIs or services needed
- No new dependencies or tools required
