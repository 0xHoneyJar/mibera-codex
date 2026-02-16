# Scripts

Maintenance and generation scripts for the Mibera Codex. All scripts require **Python 3** and **Bash**.

Run from the repo root:

```bash
./_scripts/<script-name>
```

## Auditing

| Script | Description |
|--------|-------------|
| `audit-links.sh` | Validate all relative Markdown links. Reports broken links to `reports/audit-links.json` |
| `audit-structure.sh` | Validate structural integrity of content files against schemas. Reports to `reports/audit-structure.json` |
| `audit-semantic.py` | Check semantic consistency (naming, cross-references, data alignment) |

## Generation

| Script | Description |
|--------|-------------|
| `generate-browse.sh` | Generate faceted browse pages (`by-drug.md`, `by-era.md`, `by-element.md`, `by-tarot.md`) |
| `generate-backlinks.py` | Generate backlink sections for content files |
| `generate-clusters.py` | Generate trait cluster analysis |
| `generate-exports.py` | Export codex data in structured formats |
| `generate-graph.py` | Generate relationship graph data |
| `generate-llms-full.py` | Generate `llms-full.txt` — complete codex content for LLM ingestion |
| `generate-stats.py` | Generate codex statistics |

## Data Maintenance

| Script | Description |
|--------|-------------|
| `add-frontmatter.py` | Add or update YAML frontmatter on content files |
| `normalize-data.py` | Normalize inconsistencies in data fields across content files |
