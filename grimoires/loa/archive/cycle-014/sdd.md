# SDD: Schema Meta Blocks — Field-Level Confidence

**Cycle**: 012
**Date**: 2026-02-18
**PRD**: `grimoires/loa/prd.md`

---

## 1. Approach

Use JSON Schema's `x-` extension convention to add two types of annotations:

1. **Per-field**: `x-codex-confidence` and `x-codex-source` on each property
2. **Per-schema**: `x-codex-meta` top-level block with summary and verification date

This is a pure additive change — JSON Schema validators ignore unknown `x-` prefixed keys.

## 2. Confidence Vocabulary

| Value | Definition |
|-------|-----------|
| `canonical` | From on-chain contract state, generative algorithm, or official project metadata |
| `derived` | Deterministically computed from canonical data (e.g., rank from score) |
| `community` | Editorial content, historical research, artist descriptions, or user contributions |

## 3. Source Vocabulary

| Value | Definition |
|-------|-----------|
| `contract-metadata` | ERC-721 token metadata / generative mint output |
| `project-lore` | Official project lore definitions (archetypes, ancestors, elements) |
| `project-asset` | Official image/media assets |
| `editorial` | Codex editorial content (dates added, descriptions) |
| `research` | Historical, chemical, or cultural research |
| `artist` | Artist-provided descriptions or attributions |
| `classification` | Codex-defined categorization system |

## 4. Field-Level Confidence Map

### mibera.schema.json (26 properties)

| Field | Confidence | Source |
|-------|-----------|--------|
| id | canonical | contract-metadata |
| type | canonical | contract-metadata |
| archetype | canonical | contract-metadata |
| ancestor | canonical | contract-metadata |
| time_period | canonical | contract-metadata |
| birthday | canonical | contract-metadata |
| birth_coordinates | canonical | contract-metadata |
| sun_sign | canonical | contract-metadata |
| moon_sign | canonical | contract-metadata |
| ascending_sign | canonical | contract-metadata |
| element | canonical | contract-metadata |
| swag_rank | derived | contract-metadata |
| swag_score | canonical | contract-metadata |
| background | canonical | contract-metadata |
| body | canonical | contract-metadata |
| hair | canonical | contract-metadata |
| eyes | canonical | contract-metadata |
| eyebrows | canonical | contract-metadata |
| mouth | canonical | contract-metadata |
| shirt | canonical | contract-metadata |
| hat | canonical | contract-metadata |
| glasses | canonical | contract-metadata |
| mask | canonical | contract-metadata |
| earrings | canonical | contract-metadata |
| face_accessory | canonical | contract-metadata |
| tattoo | canonical | contract-metadata |
| item | canonical | contract-metadata |
| drug | canonical | contract-metadata |

### drug.schema.json (9 properties)

| Field | Confidence | Source |
|-------|-----------|--------|
| name | canonical | project-lore |
| molecule | community | research |
| era | canonical | project-lore |
| origin | community | research |
| archetype | canonical | project-lore |
| ancestor | canonical | project-lore |
| swag_score | canonical | project-lore |
| image | canonical | project-asset |
| date_added | community | editorial |

### ancestor.schema.json (4 properties)

| Field | Confidence | Source |
|-------|-----------|--------|
| name | canonical | project-lore |
| period_ancient | community | research |
| period_modern | community | research |
| locations | community | research |

### tarot-card.schema.json (7 properties)

| Field | Confidence | Source |
|-------|-----------|--------|
| name | canonical | project-lore |
| suit | canonical | project-lore |
| element | canonical | project-lore |
| meaning | community | research |
| drug | canonical | project-lore |
| drug_type | canonical | project-lore |
| molecule | community | research |

### trait-full.schema.json (5 properties)

| Field | Confidence | Source |
|-------|-----------|--------|
| name | canonical | contract-metadata |
| image | canonical | project-asset |
| archetype | canonical | contract-metadata |
| swag_score | canonical | contract-metadata |
| date_added | community | editorial |

### trait-minimal.schema.json (3 properties)

| Field | Confidence | Source |
|-------|-----------|--------|
| name | canonical | contract-metadata |
| image | canonical | project-asset |
| date_added | community | editorial |

### special-collection.schema.json (2 properties)

| Field | Confidence | Source |
|-------|-----------|--------|
| name | canonical | project-lore |
| type | community | classification |

### grail.schema.json (7 properties)

| Field | Confidence | Source |
|-------|-----------|--------|
| id | canonical | contract-metadata |
| name | canonical | artist |
| type | canonical | classification |
| category | community | classification |
| description | community | artist |
| commissioned_for | community | artist |
| status | canonical | contract-metadata |

## 5. Schema-Level Meta Block Format

```json
{
  "x-codex-meta": {
    "entity_type": "mibera",
    "confidence_profile": "25/26 canonical, 1 derived (swag_rank)",
    "primary_source": "contract-metadata",
    "last_verified": "2026-02-18"
  }
}
```

## 6. Validation

- All 8 files must remain valid JSON after modification
- No existing keys may be changed or removed
- `x-codex-confidence` must be one of: `canonical`, `derived`, `community`
- `x-codex-source` must be one of the 7 source vocabulary values
