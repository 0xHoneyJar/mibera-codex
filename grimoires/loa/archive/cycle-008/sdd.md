# SDD: GitHub-First Navigation Restructure

**Cycle**: 008
**Created**: 2026-02-17
**PRD**: `grimoires/loa/prd.md`

---

## 1. Executive Summary

A mechanical restructure of the Mibera Codex to optimize for GitHub as the primary navigation interface. Two changes:

1. **Rename `index.md` → `README.md`** in 26 content directories so GitHub auto-renders landing pages
2. **Consolidate 4 infrastructure directories into `_codex/`** to reduce root-level noise

All changes are path/filename substitutions — no content or logic modifications.

---

## 2. System Architecture

This is a file-system restructure, not a software system. The "architecture" is the migration plan.

### 2.1 Before State

```
repo/
├── _data/              ← sorts first (4 files)
├── _schema/            ← sorts first (10 files)
├── _scripts/           ← sorts first (15+ files)
├── _templates/         ← sorts first (6 files)
├── browse/
│   └── index.md        ← invisible on GitHub
├── grails/
│   └── index.md        ← invisible on GitHub
├── miberas/
│   └── index.md        ← invisible on GitHub
├── ... (6 more content dirs with index.md)
├── traits/
│   └── (18 subdirs, each with index.md)
```

### 2.2 After State

```
repo/
├── _codex/
│   ├── data/           ← was _data/
│   ├── schema/         ← was _schema/
│   ├── scripts/        ← was _scripts/
│   └── templates/      ← was _templates/
├── browse/
│   └── README.md       ← auto-renders on GitHub
├── grails/
│   └── README.md       ← auto-renders on GitHub
├── miberas/
│   └── README.md       ← auto-renders on GitHub
├── ... (6 more content dirs with README.md)
├── traits/
│   └── (18 subdirs, each with README.md)
```

---

## 3. Migration Design

### 3.1 Execution Order

The order matters because scripts reference paths that are being moved.

```
Phase 1: Infrastructure consolidation (_codex/)
  1a. Create _codex/ directory structure
  1b. git mv all files from _data/, _schema/, _scripts/, _templates/ into _codex/
  1c. Update REPO_ROOT resolution in all scripts (parent depth +1)
  1d. Update hardcoded path strings in all scripts
  1e. Update manifest.json, llms.txt, SUMMARY.md
  1f. Update _codex/schema/ontology.yaml internal references
  1g. Update _codex/schema/README.md script references
  1h. Update audit-links.sh EXCLUDE set

Phase 2: Index rename (README.md)
  2a. git mv all 26 index.md → README.md
  2b. Bulk-replace (index.md) → (README.md) in all 10,000 mibera files
  2c. Update remaining (index.md) references in non-mibera files
  2d. Update scripts that generate index.md links or skip index.md

Phase 3: Regenerate & validate
  3a. Run all generators from new locations
  3b. Run audit-links.sh — expect 0 new breaks
  3c. Run audit-structure.sh — expect 0 errors
  3d. Spot-check GitHub rendering (README.md auto-display)
```

### 3.2 Why this order

Phase 1 first because scripts need to work from their new location before we can use them to validate Phase 2. Phase 2 is the large blast radius (10,000 files) and we want working audit scripts to validate it.

---

## 4. Component Design

### 4.1 Script REPO_ROOT Resolution

Three patterns exist and each needs different treatment:

**Pattern A: `__file__`-based (9 scripts)**

```python
# BEFORE (from _scripts/)
REPO_ROOT = Path(__file__).resolve().parent.parent

# AFTER (from _codex/scripts/)
REPO_ROOT = Path(__file__).resolve().parent.parent.parent
```

Scripts: `generate-clusters.py`, `generate-grails.py`, `generate-exports.py`, `generate-backlinks.py`, `generate-llms-full.py`, `audit-semantic.py`, `normalize-data.py`, `add-frontmatter.py`

**Pattern B: `dirname`-based (2 bash scripts)**

```bash
# BEFORE (from _scripts/)
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# AFTER (from _codex/scripts/)
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
```

Scripts: `generate-browse.sh`, `audit-links.sh`, `audit-structure.sh`

**Pattern C: Hardcoded cwd-relative (2 scripts)**

```python
# BEFORE and AFTER — no change needed (run from repo root)
MIBERA_DIR = "miberas"
OUTPUT_FILE = "_data/stats.md"
```

These DO need the output path updated:

```python
# BEFORE
OUTPUT_FILE = "_data/stats.md"
OUTPUT_FILE = "_data/graph.json"

# AFTER
OUTPUT_FILE = "_codex/data/stats.md"
OUTPUT_FILE = "_codex/data/graph.json"
```

Scripts: `generate-graph.py`, `generate-stats.py`

### 4.2 Hardcoded Path Updates Per Script

| Script | Path Changes |
|--------|-------------|
| `generate-browse.sh` | REPO_ROOT depth. Header: `_scripts/` → `_codex/scripts/` |
| `generate-clusters.py` | REPO_ROOT depth. `_data` → `_codex/data`. Header: `_scripts/` → `_codex/scripts/` |
| `generate-grails.py` | REPO_ROOT depth. `_data` → `_codex/data`. Header: `_scripts/` → `_codex/scripts/`. Skip `README.md` instead of `index.md` |
| `generate-exports.py` | REPO_ROOT depth. `_data` → `_codex/data` |
| `generate-graph.py` | `_data/graph.json` → `_codex/data/graph.json`. Metadata `_scripts/` → `_codex/scripts/` |
| `generate-stats.py` | `_data/stats.md` → `_codex/data/stats.md`. Header: `_scripts/` → `_codex/scripts/` |
| `generate-backlinks.py` | REPO_ROOT depth only (content paths unchanged) |
| `generate-llms-full.py` | REPO_ROOT depth only (content paths unchanged) |
| `audit-links.sh` | REPO_ROOT depth. `_scripts/reports` → `_codex/scripts/reports`. EXCLUDE set: `_scripts` → `_codex` |
| `audit-structure.sh` | REPO_ROOT depth. `_scripts/reports` → `_codex/scripts/reports` |
| `audit-semantic.py` | REPO_ROOT depth. `_scripts/reports` → `_codex/scripts/reports` |
| `normalize-data.py` | REPO_ROOT depth only. Skip `README.md` instead of `index.md` |
| `add-frontmatter.py` | REPO_ROOT depth only |

### 4.3 Navigation File Updates

**manifest.json** — 15+ path changes:

```json
// schemas section
"mibera": "_codex/schema/mibera.schema.json"     // was "_schema/..."
"drug": "_codex/schema/drug.schema.json"
// ... all 8 schemas

// data exports
"miberas_jsonl": "_codex/data/miberas.jsonl"      // was "_data/..."
"graph": "_codex/data/graph.json"
"stats": "_codex/data/stats.md"
"grails_jsonl": "_codex/data/grails.jsonl"

// key files
"schema": "_codex/schema/README.md"               // was "_schema/..."
"ontology": "_codex/schema/ontology.yaml"

// generator
"generator": "_codex/scripts/generate-clusters.py"
```

**llms.txt** — 3 path changes:

```
_schema/README.md        → _codex/schema/README.md
_schema/*.schema.json    → _codex/schema/*.schema.json
_data/miberas.jsonl      → _codex/data/miberas.jsonl
```

**SUMMARY.md** — 1 schema path change + 29 index link changes:

```markdown
* [Content Type Schemas](_codex/schema/README.md)  // was _schema/README.md
* [Ancestors](core-lore/ancestors/README.md)        // was index.md (×29 similar)
```

**Root README.md** — 9 index link changes:

```markdown
- [Ancestors](core-lore/ancestors/README.md)        // was index.md (×9 similar)
```

### 4.4 Schema Cross-References

**`_codex/schema/ontology.yaml`** — 7 path changes:

All `schema: "_schema/..."` → `schema: "_codex/schema/..."` references.

**`_codex/schema/README.md`** — 2 script path changes + 2 index.md link changes:

```
_scripts/audit-structure.sh → _codex/scripts/audit-structure.sh
_scripts/audit-links.sh     → _codex/scripts/audit-links.sh
(index.md) references       → (README.md)
```

### 4.5 Index Rename — Bulk Link Update

**10,000 Mibera files** — single mechanical replacement:

```
[← Back to Index](index.md)  →  [← Back to Index](README.md)
```

This is a Python one-liner over `miberas/*.md`.

**Root README.md** — 9 references:
- Links to `core-lore/ancestors/index.md`, `traits/overlays/astrology/index.md`, `miberas/index.md`, `browse/index.md`, etc.

**SUMMARY.md** — 29 references:
- Navigation tree links to every content directory's `index.md`

**6 browse pages** — `(index.md)` → `(README.md)`:
- `browse/by-ancestor.md`, `by-archetype.md`, `by-element.md`, `by-drug.md`, `by-era.md`, `by-tarot.md`

**Other files**:
- `birthdays/timeline.md`: 1 reference
- `_codex/schema/README.md`: 2 references (already handled in 4.4)

### 4.6 Scripts That Generate Index Links or Skip Index Files

These scripts need logic updates:

| Script | Current behavior | Change needed |
|--------|-----------------|---------------|
| `generate-browse.sh` | May generate `(index.md)` links | Update to `(README.md)` |
| `generate-clusters.py` | Generates `(index.md)` links in browse pages | Update to `(README.md)` |
| `generate-grails.py` | Skips `index.md` when reading `grails/` | Skip `README.md` instead |
| `normalize-data.py` | Skips `index.md` and `overview.md` | Skip `README.md` instead of `index.md` |
| `audit-links.sh` | Validates links to `index.md` | No change (validates whatever exists) |

---

## 5. Migration Script Design

Rather than making 10,088 edits by hand, the migration should be a single Python script: `migrate-github-nav.py`.

### 5.1 Script Structure

```python
#!/usr/bin/env python3
"""Migrate codex to GitHub-first navigation.

Phase 1: Move infrastructure dirs to _codex/
Phase 2: Rename index.md → README.md in content dirs
Phase 3: Update all path references

Run from repo root. Requires git (uses git mv for clean history).
"""

def phase1_move_infrastructure():
    """git mv _data/ → _codex/data/, etc."""

def phase2_rename_indexes():
    """git mv index.md → README.md in 26 content dirs."""

def phase3_update_script_paths():
    """Fix REPO_ROOT, hardcoded paths, headers in all scripts."""

def phase4_update_nav_files():
    """Fix manifest.json, llms.txt, SUMMARY.md."""

def phase5_update_schema_refs():
    """Fix ontology.yaml and schema/README.md."""

def phase6_bulk_link_update():
    """Replace (index.md) → (README.md) in 10,000+ files."""

def phase7_update_script_logic():
    """Fix index.md skips → README.md skips in scripts."""
```

### 5.2 Why a Migration Script

- **Atomic**: Either everything moves or nothing does
- **Repeatable**: Can be re-run after fixing issues
- **Auditable**: Script is the single source of truth for what changed
- **Git-clean**: Uses `git mv` for rename tracking

### 5.3 Alternative: Manual Phase-by-Phase

Given the Loa sprint workflow, implementing as manual tasks (not a migration script) is also viable. Each phase is independently testable. The script approach is cleaner but either works.

**Decision**: Implement as sprint tasks (manual phases), not a standalone migration script. This aligns with the Loa workflow and allows review between phases. The bulk operations (10,000 mibera files, script path updates) use inline Python one-liners within the implementation.

---

## 6. Validation Checklist

After all changes:

| Check | Command | Expected |
|-------|---------|----------|
| No broken links | `_codex/scripts/audit-links.sh` | 0 new breaks |
| Structure valid | `_codex/scripts/audit-structure.sh` | 0 errors |
| Generators work | Run each generator | Identical content output |
| manifest.json valid | `python3 -c "import json; json.load(open('manifest.json'))"` | No errors |
| No stale index.md | `find . -name index.md -not -path './grimoires/*' -not -path './.git/*'` | 0 results |
| No stale _data/ | `ls _data/ _schema/ _scripts/ _templates/ 2>&1` | "No such file" for all 4 |
| README.md in all content dirs | Check each of 26 dirs | All present |
| grep for old paths | `grep -r '_scripts/' --include='*.md' --include='*.json' --include='*.yaml' --include='*.txt'` | Only in `_codex/` internal refs |

---

## 7. Risk Mitigation

| Risk | Strategy |
|------|----------|
| `generate-graph.py` and `generate-stats.py` use cwd-relative paths | Update their `_data/` string literals; they still run from repo root |
| `__file__`-based scripts break with wrong parent depth | Single consistent change: `.parent.parent` → `.parent.parent.parent` |
| `audit-links.sh` EXCLUDE set still says `_scripts` | Update to `_codex` |
| Generated file headers show old paths | Re-run generators after migration to auto-fix |
| `generate-grails.py` skips `index.md` in grails/ | Update skip logic to `README.md` |
| `normalize-data.py` skips `index.md` | Update skip logic to `README.md` |

---

## 8. Files Modified Summary

| Category | Count | Nature |
|----------|-------|--------|
| Scripts (path updates) | 13 | REPO_ROOT depth, path strings, headers |
| Navigation files | 3 | manifest.json, llms.txt, SUMMARY.md |
| Schema cross-refs | 2 | ontology.yaml, schema/README.md |
| Content index renames | 26 | git mv index.md → README.md |
| Mibera link updates | 10,000 | `(index.md)` → `(README.md)` |
| Root README.md | 1 | 9 `index.md` → `README.md` link updates |
| SUMMARY.md | 1 | 29 `index.md` → `README.md` + 1 schema path |
| Browse page links | 6 | `(index.md)` → `(README.md)` |
| Other link updates | 2 | birthdays/timeline.md, scripts/README.md |
| **Total** | **~10,054** | All mechanical |
