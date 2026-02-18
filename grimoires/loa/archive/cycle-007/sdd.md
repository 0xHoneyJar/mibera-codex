# SDD: Mibera Grails — 1/1 Collection Integration

**Cycle**: 007
**Status**: Draft
**Date**: 2026-02-17
**PRD**: `grimoires/loa/prd.md`

---

## 1. Executive Summary

Integrate 42 hand-drawn Grail NFTs into the Mibera Codex as a new content type alongside the existing 10,000 generative Miberas. This involves creating a `grails/` content directory, a JSON schema, a browse page, cross-links to existing ancestor/element/astrology pages, a JSONL data export, and navigation updates.

The design follows existing codex conventions exactly: YAML frontmatter + markdown body for content pages, JSON Schema Draft 2020-12 for validation, relative-path linking, and auto-generated browse pages via Python scripts.

## 2. System Architecture

### Content Flow

```
grails/{slug}.md (42 source files)
        │
        ├──→ _schema/grail.schema.json  (validates frontmatter)
        ├──→ browse/grails.md            (generated browse page)
        ├──→ _data/grails.jsonl          (generated data export)
        └──→ cross-links injected into:
             ├── core-lore/ancestors/{11 files}.md
             ├── traits/overlays/elements/{4 files}.md
             └── traits/overlays/astrology/{12 files}.md
```

### New Files Created

| Path | Type | Generated? |
|------|------|-----------|
| `grails/index.md` | Content directory | No (hand-authored) |
| `grails/{slug}.md` × 42 | Content pages | No (hand-authored) |
| `_schema/grail.schema.json` | JSON Schema | No |
| `_templates/grail.md` | Template | No |
| `_data/grails.jsonl` | Data export | Yes (script) |
| `browse/grails.md` | Browse page | Yes (script) |
| `_scripts/generate-grails.py` | Generator script | No |

### Existing Files Modified

| Path | Change |
|------|--------|
| `manifest.json` | Add `grail` entity type, schema, data export, browse dimension |
| `SUMMARY.md` | Add Grails section under "V. The Collection" |
| `browse/index.md` | Add Grails browse dimension |
| `core-lore/ancestors/{11}.md` | Add Grail callout (11 of 33 ancestors) |
| `traits/overlays/elements/{4}.md` | Add Grail reference line |
| `traits/overlays/astrology/{12}.md` | Add Grail reference line |

## 3. Data Architecture

### 3.1 Grail Frontmatter Schema

```yaml
---
id: 6458          # Token ID in the Mibera Maker contract (1–10000)
name: Fire        # Display name
type: grail       # Constant, distinguishes from generative miberas
category: element # One of 8 category values
description: "Short artist summary of the piece"
---
```

**Category enum**: `element`, `luminary`, `concept`, `zodiac`, `planet`, `ancestor`, `primordial`, `special`

### 3.2 JSON Schema (`_schema/grail.schema.json`)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Grail",
  "description": "Schema for Mibera Grail (1/1) content pages",
  "type": "object",
  "required": ["id", "name", "type", "category"],
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10000,
      "description": "Token ID within the Mibera Maker contract"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "description": "Display name of the Grail"
    },
    "type": {
      "type": "string",
      "const": "grail",
      "description": "Content type identifier"
    },
    "category": {
      "type": "string",
      "enum": ["element", "luminary", "concept", "zodiac", "planet", "ancestor", "primordial", "special"],
      "description": "Thematic category"
    },
    "description": {
      "type": "string",
      "description": "Short artist description of the piece"
    }
  },
  "additionalProperties": false
}
```

### 3.3 JSONL Export Format (`_data/grails.jsonl`)

One record per Grail, sorted by token ID:

```json
{"id": 235, "name": "Scorpio", "type": "grail", "category": "zodiac", "slug": "scorpio", "description": "..."}
```

Fields: `id`, `name`, `type`, `category`, `slug`, `description`

### 3.4 Slug Convention

File slugs are kebab-case of the display name:

| Name | Slug → Filename |
|------|----------------|
| Fire | `fire.md` |
| Black Hole | `black-hole.md` |
| Native American | `native-american.md` |
| Satoshi as Hermes | `satoshi-as-hermes.md` |

## 4. Component Design

### 4.1 Grail Content Page (`grails/{slug}.md`)

```markdown
---
id: 6458
name: Fire
type: grail
category: element
description: "A pyromantic sigil..."
---

# Fire

> **Grail #6458** · Element · [Browse all Grails →](../browse/grails.md)

[Artist description body text — one or more paragraphs preserving the original voice]
```

**Structure rules**:
- H1: Grail display name
- Blockquote header: Token ID, category, link to browse page
- Body: Artist description (preserved verbatim, only fix obvious typos)
- No auto-generated backlinks (Grails don't appear in generative mibera data)

### 4.2 Grail Index (`grails/index.md`)

Hand-authored directory page organized by category:

```markdown
# Grails — 1/1 Collection

*42 hand-drawn art pieces in the Mibera Maker contract.*

---

## Elements (4)

- [Fire](fire.md) · #6458
- [Water](water.md) · #6761
- [Earth](earth.md) · #3244
- [Air](air.md) · #2769

## Luminaries (2)

- [Sun](sun.md) · #3116
- [Moon](moon.md) · #309

[... remaining categories ...]
```

### 4.3 Browse Page (`browse/grails.md`)

Generated by `_scripts/generate-grails.py`. Follows existing browse page conventions:

```markdown
<!-- generated: {timestamp} by _scripts/generate-grails.py -->

# Browse: Grails

*42 hand-drawn 1/1 art pieces across 8 categories.*

---

## Element (4)

[Fire](../grails/fire.md) · [Water](../grails/water.md) · [Earth](../grails/earth.md) · [Air](../grails/air.md)

## Luminary (2)

[Sun](../grails/sun.md) · [Moon](../grails/moon.md)

[... remaining categories ...]
```

**Differences from generative browse pages**: No mibera lists or counts (each entry IS the item). Links go directly to the Grail content page. Simple inline links separated by ` · `.

### 4.4 Cross-Dimensional Links

#### Ancestor Pages (11 of 33)

Insert a callout after the H1 heading in each matching ancestor page:

```markdown
# Buddhist

> **1/1 Grail**: [Buddhist Grail (#9503)](../../grails/buddhist.md)

## Cultural Significance
[... existing content unchanged ...]
```

**Target files and their Grails**:

| Ancestor File | Grail ID |
|--------------|----------|
| `core-lore/ancestors/buddhist.md` | #9503 |
| `core-lore/ancestors/chinese.md` | #392 |
| `core-lore/ancestors/ethiopian.md` | #7702 |
| `core-lore/ancestors/greek.md` | #1630 |
| `core-lore/ancestors/hindu.md` | #8277 |
| `core-lore/ancestors/japanese.md` | #4363 |
| `core-lore/ancestors/mayan.md` | #3970 |
| `core-lore/ancestors/mongolian.md` | #507 |
| `core-lore/ancestors/native-american.md` | #3282 |
| `core-lore/ancestors/rastafarian.md` | #1134 |
| `core-lore/ancestors/satanist.md` | #8557 |

#### Element Overlay Pages (4)

Append a Grail reference before the closing `---`:

```markdown
**Qualities:** Energy, passion, transformation, willpower, action

**1/1 Grail:** [Fire Grail (#6458)](../../grails/fire.md)

---
```

**Target files**: `traits/overlays/elements/fire.md` (#6458), `water.md` (#6761), `earth.md` (#3244), `air.md` (#2769)

#### Astrology Pages (12)

Append a Grail reference before the closing `---`:

```markdown
## Rising Sign

[existing content]

---

**1/1 Grail:** [Aries Grail (#4803)](../../grails/aries.md)
```

**Target files**: All 12 zodiac sign files in `traits/overlays/astrology/`

#### Planet/Luminary/Other Pages

No dedicated planet pages exist. No cross-linking for planets, luminaries, concepts, primordial, or special categories. Noted for future integration.

### 4.5 Template (`_templates/grail.md`)

```markdown
---
id: 0
name: "Untitled"
type: grail
category: ""
description: ""
---

# {Name}

> **Grail #{id}** · {Category} · [Browse all Grails →](../browse/grails.md)

{Artist description}
```

### 4.6 Uranus + Gaia Display Note

Both `grails/uranus.md` and `grails/gaia.md` include a callout:

```markdown
> **Combined piece**: When Uranus is placed on top of Gaia, they form a single unified artwork.
> See also: [Gaia (#3222)](gaia.md) / [Uranus (#7916)](uranus.md)
```

## 5. Script Design

### 5.1 `_scripts/generate-grails.py`

Single script that generates both the browse page and the JSONL export.

**Input**: Reads all `grails/*.md` files (excluding `index.md`), parses YAML frontmatter.

**Outputs**:
1. `browse/grails.md` — categorized browse page
2. `_data/grails.jsonl` — data export

**Behavior**:
- Idempotent (safe to re-run)
- Sorts Grails by name within each category
- Categories ordered: element, luminary, concept, zodiac, planet, ancestor, primordial, special
- JSONL sorted by token ID
- Includes generation timestamp in browse page comment
- Validates that all files have required frontmatter fields; exits with error if not

**No dependencies beyond Python 3 stdlib** (yaml parsing via simple regex, matching existing script patterns).

### 5.2 Frontmatter Parsing

Existing codex scripts use a simple regex-based YAML parser (no PyYAML dependency). The Grails script follows the same pattern:

```python
def parse_frontmatter(path):
    text = path.read_text()
    match = re.match(r'^---\n(.*?)\n---', text, re.DOTALL)
    # Parse key: value pairs from YAML block
```

## 6. Navigation Updates

### 6.1 SUMMARY.md

Add under "V. The Collection", after the browse section:

```markdown
* [Grails — 1/1 Collection](grails/index.md)
  * [Browse Grails](browse/grails.md)
```

### 6.2 browse/index.md

Add a new section after the existing browse dimensions:

```markdown
### [Grails →](grails.md)

*42 hand-drawn 1/1 art pieces across 8 thematic categories — elements, luminaries, zodiac signs, planets, ancestors, and more.*
```

### 6.3 manifest.json

Add to `entity_types`:

```json
"grail": {
  "directory": "grails/",
  "index": "grails/index.md",
  "count": 42,
  "format": "yaml_frontmatter",
  "naming": "{slug}.md"
}
```

Add to `browse.dimensions`:

```json
"grails": "browse/grails.md"
```

Add to `schemas`:

```json
"grail": "_schema/grail.schema.json"
```

Add to `data_exports`:

```json
"grails_jsonl": "_data/grails.jsonl"
```

## 7. Validation

### Pre-existing Audit Scripts

- `audit-links.sh`: Will automatically pick up new files; no changes needed
- `audit-structure.sh`: Needs the new schema registered (via manifest.json update) to validate Grail files

### Acceptance Checklist

| Check | Method |
|-------|--------|
| 42 files in `grails/` (excluding index) | `ls grails/*.md \| wc -l` = 43 (42 + index) |
| All frontmatter validates against schema | `audit-structure.sh` passes |
| All internal links resolve | `audit-links.sh` passes |
| `browse/grails.md` lists all 42 Grails | `generate-grails.py` output |
| `_data/grails.jsonl` has 42 records | `wc -l _data/grails.jsonl` = 42 |
| 11 ancestor pages have Grail callout | Grep for "1/1 Grail" in `core-lore/ancestors/` |
| 4 element pages have Grail reference | Grep for "1/1 Grail" in `traits/overlays/elements/` |
| 12 astrology pages have Grail reference | Grep for "1/1 Grail" in `traits/overlays/astrology/` |
| SUMMARY.md references Grails | Manual check |
| browse/index.md references Grails | Manual check |
| manifest.json includes grail entity type | Manual check |
| No existing links broken | `audit-links.sh` passes |

## 8. Technical Risks

| Risk | Mitigation |
|------|------------|
| Ancestor page format varies (some have different H2 structures) | Inspect each of the 11 pages; insert callout after H1 consistently |
| YAML frontmatter parsing without PyYAML | Use simple regex parser matching existing scripts; Grail frontmatter is trivially simple |
| Future Grails added | Template-driven; add file from template, re-run `generate-grails.py` — no schema/script changes |

## 9. Sprint Decomposition Guidance

Suggested task grouping for sprint planning:

1. **Foundation**: Schema, template, `generate-grails.py` script
2. **Content**: 42 Grail content pages + `grails/index.md`
3. **Integration**: Cross-links (ancestors, elements, astrology), navigation updates (SUMMARY.md, browse/index.md, manifest.json)
4. **Generation & Validation**: Run script, run audits, verify all links

---

*Generated by `/architect` — Cycle 007*
