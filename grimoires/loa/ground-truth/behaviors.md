# Behaviors — Ground Truth

The codex's runtime behaviors are its scripts — auditing, generation, and data maintenance pipelines. All scripts are stdlib-only Python or Bash, run from repo root. [`_codex/scripts/README.md`]

## Audit Scripts

Three validation scripts that verify codex integrity [`_codex/scripts/README.md:Auditing`]:

| Script | Purpose | Output |
|--------|---------|--------|
| `audit-links.sh` | Validate all relative markdown links across 11,500+ files | `reports/audit-links.json` [`_codex/scripts/README.md:line 15`] |
| `audit-structure.sh` | Validate structural integrity against schemas | `reports/audit-structure.json` [`_codex/scripts/README.md:line 16`] |
| `audit-semantic.py` | Check semantic consistency (naming, cross-refs, data alignment) | `reports/audit-semantic.json` [`_codex/scripts/README.md:line 17`] |

All three produce JSON reports in `_codex/scripts/reports/`.

## Generation Pipeline

Eight generation scripts that build derived content [`_codex/scripts/README.md:Generation`]:

| Script | Input | Output |
|--------|-------|--------|
| `generate-browse.sh` | Mibera frontmatter | `browse/by-drug.md`, `browse/by-era.md`, `browse/by-tarot.md` [`_codex/scripts/README.md:line 23`] |
| `generate-clusters.py` | Mibera frontmatter | `browse/by-ancestor.md`, `browse/by-archetype.md`, `browse/by-element.md` with cross-dimensional breakdown tables [`_codex/scripts/README.md:line 25`] |
| `generate-backlinks.py` | All content files | Backlink sections between `<!-- @generated:backlinks-start -->` and `<!-- @generated:backlinks-end -->` markers [`_codex/scripts/README.md:line 24`] |
| `generate-exports.py` | Entity frontmatter | `_codex/data/miberas.jsonl` and other JSONL exports [`_codex/scripts/README.md:line 26`] |
| `generate-grails.py` | `grails/*.md` frontmatter | `browse/grails.md` and `_codex/data/grails.jsonl` [`_codex/scripts/README.md:line 27`] |
| `generate-graph.py` | All entity files | `_codex/data/graph.json` (10,279 nodes, 70,344 edges) [`_codex/scripts/README.md:line 28`] |
| `generate-llms-full.py` | Core lore + ancestors + drugs | `llms-full.txt` (~547 KB) [`_codex/scripts/README.md:line 29`] |
| `generate-stats.py` | All entity files | `_codex/data/stats.md` (codex-wide statistics) [`_codex/scripts/README.md:line 30`] |

## Data Maintenance Scripts

Two maintenance scripts [`_codex/scripts/README.md:Data Maintenance`]:

| Script | Purpose |
|--------|---------|
| `add-frontmatter.py` | Add or update YAML frontmatter on content files [`_codex/scripts/README.md:line 37`] |
| `normalize-data.py` | Normalize inconsistencies in data fields across content files [`_codex/scripts/README.md:line 38`] |

## Backlink System

The backlink generator (`generate-backlinks.py`) scans all markdown files for relative links and auto-inserts reverse references. [`_codex/scripts/README.md:line 24`]

**Marker format**:
```html
<!-- @generated:backlinks-start -->
...auto-generated links...
<!-- @generated:backlinks-end -->
```

These markers are present in entity files (traits, drugs, ancestors, tarot cards). Content between markers is overwritten on each generation run. Manual edits inside markers will be lost.

## Script Constraints

- **No PyYAML**: all YAML parsing uses Python stdlib regex [`CLAUDE.md:Script Conventions`]
- **Python 3 required**: all `.py` scripts [`_codex/scripts/README.md:line 3`]
- **Bash required**: all `.sh` scripts [`_codex/scripts/README.md:line 3`]
- **Run from repo root**: scripts expect `./` as working directory [`_codex/scripts/README.md:lines 7-9`]
- **macOS BSD tools**: shell scripts target BSD awk/grep/sed (not GNU) [`grimoires/loa/NOTES.md:Learnings`]
