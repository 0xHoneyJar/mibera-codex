# PRD: Schema Meta Blocks — Field-Level Confidence

**Cycle**: 012
**Date**: 2026-02-18
**Issue**: #15 P2 item — schema meta blocks with confidence levels

---

## 1. Problem Statement

The codex has 8 JSON Schema files defining entity structures, but they contain no provenance or confidence metadata. A consumer (agent, app, researcher) cannot programmatically determine whether a field's value comes from on-chain contract metadata (canonical), was derived from pattern analysis, or was community-contributed.

> Sources: Issue #15 P2 item, NOTES.md decision log

## 2. Goals

1. Add machine-readable confidence annotations to all 8 schema files
2. Use JSON Schema's `x-` extension mechanism (non-breaking)
3. Enable consumers to filter or weight data by confidence level

## 3. Success Criteria

- All 8 schema files have `x-codex-meta` blocks
- Every field in every schema has a confidence annotation
- Annotations use a controlled vocabulary: `canonical`, `derived`, `community`
- Source authority is documented per field
- Existing schema validation is unaffected (no breaking changes)

## 4. Scope

### In Scope

- Add `x-codex-meta` extension to all 8 `_codex/schema/*.schema.json` files
- Document confidence vocabulary in a schema README or inline
- Validate that schemas still parse correctly after modification

### Out of Scope

- Modifying actual entity data files
- Adding per-record confidence (this is schema-level, not instance-level)
- Changing manifest.json (already has aggregate completeness)

## 5. Confidence Vocabulary

| Level | Meaning | Example |
|-------|---------|---------|
| `canonical` | From on-chain metadata or contract state | Mibera archetype, element, swag_score |
| `derived` | Computed from canonical data via deterministic rules | Swag rank (derived from score thresholds) |
| `community` | Community-contributed, editorial, or artist-sourced | Grail descriptions, drug origins, ancestor locations |

## 6. Format

Each schema property gains an `x-codex-confidence` annotation:

```json
{
  "archetype": {
    "type": "string",
    "enum": ["Freetekno", "Milady", "Acidhouse", "Chicago/Detroit"],
    "description": "One of 4 archetypes",
    "x-codex-confidence": "canonical",
    "x-codex-source": "contract-metadata"
  }
}
```

Each schema file also gets a top-level `x-codex-meta` block:

```json
{
  "x-codex-meta": {
    "entity_type": "mibera",
    "confidence_summary": "All fields canonical except swag_rank (derived)",
    "last_verified": "2026-02-18"
  }
}
```

## 7. Entity Confidence Assessment

| Schema | Fields | Confidence Profile |
|--------|--------|--------------------|
| `mibera.schema.json` | 26 | Nearly all canonical (contract metadata). `swag_rank` is derived. |
| `drug.schema.json` | 9 | Mixed: `name`, `archetype`, `ancestor` canonical; `molecule`, `era`, `origin` community-sourced |
| `ancestor.schema.json` | 4 | All community (historical research) |
| `tarot-card.schema.json` | TBD | Check source |
| `trait-full.schema.json` | TBD | Check source |
| `trait-minimal.schema.json` | TBD | Check source |
| `special-collection.schema.json` | TBD | Check source |
| `grail.schema.json` | 7 | `id`, `name`, `type` canonical; `category`, `description` community; `commissioned_for`, `status` mixed |

## 8. Risks

- **Low**: JSON Schema parsers ignore `x-` extensions by default — no breakage risk
- **Low**: Confidence assessment is subjective for some fields — document rationale
