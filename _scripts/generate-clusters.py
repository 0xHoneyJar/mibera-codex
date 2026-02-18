#!/usr/bin/env python3
"""Generate enriched dimension browse pages with cross-dimensional breakdowns.

Reads _data/miberas.jsonl and generates three enriched browse pages:
  - browse/by-ancestor.md   (with archetype + element breakdowns per ancestor)
  - browse/by-archetype.md  (with ancestor + element breakdowns per archetype)
  - browse/by-element.md    (with archetype + ancestor breakdowns per element)

This replaces the former browse/clusters/ directory (275 separate files).

Usage: python3 _scripts/generate-clusters.py
"""

import json
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = REPO_ROOT / "_data" / "miberas.jsonl"
OUTPUT_DIR = REPO_ROOT / "browse"

TIMESTAMP = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
HEADER = f"<!-- generated: {TIMESTAMP} by _scripts/generate-clusters.py -->"

# Rank display order and normalization (JSONL uses Sss/Ss, display uses SSS/SS)
RANK_DISPLAY = {"Sss": "SSS", "Ss": "SS", "S": "S", "A": "A", "B": "B", "C": "C", "D": "D", "F": "F"}
RANK_ORDER = ["SSS", "SS", "S", "A", "B", "C", "D", "F"]
TOP_RANKS = {"SSS", "SS", "S"}


def load_data():
    """Load all mibera records from JSONL."""
    records = []
    with open(DATA_FILE) as f:
        for line in f:
            line = line.strip()
            if line:
                rec = json.loads(line)
                # Normalize rank for display
                rec["rank"] = RANK_DISPLAY.get(rec.get("swag_rank", ""), rec.get("swag_rank", ""))
                records.append(rec)
    return records


def slugify(name):
    """Convert display name to URL slug."""
    if not name:
        return ""
    s = name.lower()
    for ch in ["\u2019", "'", "."]:
        s = s.replace(ch, "")
    s = s.replace(" ", "-").replace("/", "-")
    return s


def fmt_links_space(ids, max_n=20):
    """Space-separated Mibera links with (+N more) overflow."""
    sorted_ids = sorted(ids)
    parts = [f"[#{mid:04d}](../miberas/{mid:04d}.md)" for mid in sorted_ids[:max_n]]
    result = " ".join(parts)
    over = len(sorted_ids) - max_n
    if over > 0:
        result += f" (+{over} more)"
    return result


def fmt_links_bullet(ids, max_n=50):
    """Bullet-separated Mibera links with *...and N more* overflow."""
    sorted_ids = sorted(ids)
    parts = [f"[#{mid:04d}](../miberas/{mid:04d}.md)" for mid in sorted_ids[:max_n]]
    result = " \u2022 ".join(parts)
    over = len(sorted_ids) - max_n
    if over > 0:
        result += f" \u2022 *...and {over} more*"
    return result


def rank_lines_compact(records):
    """Rank-grouped member lines in compact format (by-ancestor/by-element style)."""
    by_rank = defaultdict(list)
    for r in records:
        rank = r.get("rank", "")
        if rank:
            by_rank[rank].append(r["id"])
    lines = []
    for rank in RANK_ORDER:
        if rank in by_rank:
            lines.append(f"**{rank}:** {fmt_links_space(by_rank[rank])}")
            lines.append("")
    return lines


def rank_sections_headed(records):
    """Rank-grouped member sections with ### headings (by-archetype style)."""
    by_rank = defaultdict(list)
    for r in records:
        rank = r.get("rank", "")
        if rank:
            by_rank[rank].append(r["id"])
    lines = []
    for rank in RANK_ORDER:
        if rank in by_rank:
            ids = sorted(by_rank[rank])
            lines.append(f"### Rank {rank} ({len(ids)})")
            lines.append("")
            lines.append(fmt_links_bullet(ids))
            lines.append("")
    return lines


def dim_table(records, dim, ordered_values, label):
    """Count breakdown table for a dimension."""
    counts = defaultdict(int)
    for r in records:
        v = r.get(dim, "")
        if v:
            counts[v] += 1
    rows = [(v, counts[v]) for v in ordered_values if counts.get(v)]
    if not rows:
        return []
    lines = [f"| {label} | Count |", "|---|---:|"]
    for v, c in rows:
        lines.append(f"| {v} | {c:,} |")
    return lines


# ---- PAGE GENERATORS ----


def gen_by_ancestor(records, ancestors, archetypes, elements):
    """Generate by-ancestor.md with cross-dimensional breakdowns."""
    by_anc = defaultdict(list)
    for r in records:
        a = r.get("ancestor", "")
        if a:
            by_anc[a].append(r)

    L = [HEADER, "", "# Miberas by Ancestor", "",
         "*Browse the 10,000 Miberas organized by their cultural lineage.*",
         "", "---", ""]

    # Summary table
    L += ["| Ancestor | Count | Top Ranks |", "|----------|-------|-----------|"]
    for anc in ancestors:
        recs = by_anc.get(anc, [])
        top = sum(1 for r in recs if r.get("rank") in TOP_RANKS)
        L.append(f"| [{anc}](#{slugify(anc)}) | {len(recs)} | {top} |")
    L += ["", "---", ""]

    # Per-ancestor sections
    for anc in ancestors:
        recs = by_anc.get(anc, [])
        if not recs:
            continue
        slug = slugify(anc)
        L += [f"## {anc}", "",
              f"**{len(recs):,} Miberas** | [Learn about {anc} \u2192](../core-lore/ancestors/{slug}.md)",
              ""]

        # Cross-dimensional breakdowns
        tbl = dim_table(recs, "archetype", archetypes, "Archetype")
        if tbl:
            L += tbl
            L.append("")
        tbl = dim_table(recs, "element", elements, "Element")
        if tbl:
            L += tbl
            L.append("")

        # Rank-grouped member list
        L += rank_lines_compact(recs)
        L += ["---", ""]

    L += ["[← Back to Browse](index.md)", ""]
    return "\n".join(L)


def gen_by_archetype(records, archetypes, ancestors, elements):
    """Generate by-archetype.md with cross-dimensional breakdowns."""
    by_arch = defaultdict(list)
    for r in records:
        a = r.get("archetype", "")
        if a:
            by_arch[a].append(r)

    L = [HEADER, "", "# Miberas by Archetype", "",
         "*Browse the 10,000 Miberas organized by their rave tribe.*",
         "", "---", ""]

    for arch in archetypes:
        recs = by_arch.get(arch, [])
        if not recs:
            continue
        slug = slugify(arch)
        L += [f"## {arch}", "",
              f"**{len(recs):,} Miberas**", "",
              f"[Learn about {arch} \u2192](../core-lore/archetypes.md#{slug})",
              ""]

        # Cross-dimensional breakdowns
        tbl = dim_table(recs, "ancestor", ancestors, "Ancestor")
        if tbl:
            L += tbl
            L.append("")
        tbl = dim_table(recs, "element", elements, "Element")
        if tbl:
            L += tbl
            L.append("")

        # Rank-grouped member lists with ### headings
        L += rank_sections_headed(recs)
        L += ["---", ""]

    L += ["[\u2190 Back to Browse](index.md)", ""]
    return "\n".join(L)


def gen_by_element(records, elements, archetypes, ancestors):
    """Generate by-element.md with cross-dimensional breakdowns."""
    by_elem = defaultdict(list)
    for r in records:
        e = r.get("element", "")
        if e:
            by_elem[e].append(r)

    L = [HEADER, "", "# Miberas by Element", "",
         "*Browse the 10,000 Miberas organized by their elemental alignment.*",
         "", "---", ""]

    for elem in elements:
        recs = by_elem.get(elem, [])
        if not recs:
            continue
        slug = elem.lower()
        L += [f"## {elem}", "",
              f"**{len(recs):,} Miberas**", "",
              f"[Learn about {elem} \u2192](../traits/overlays/elements/{slug}.md)",
              ""]

        # Cross-dimensional breakdowns
        tbl = dim_table(recs, "archetype", archetypes, "Archetype")
        if tbl:
            L += tbl
            L.append("")
        tbl = dim_table(recs, "ancestor", ancestors, "Ancestor")
        if tbl:
            L += tbl
            L.append("")

        # Rank-grouped member list
        L += rank_lines_compact(recs)
        L += ["---", ""]

    L += ["[\u2190 Back to Browse](index.md)", ""]
    return "\n".join(L)


def main():
    if not DATA_FILE.exists():
        print(f"ERROR: Data file not found: {DATA_FILE}", file=sys.stderr)
        sys.exit(1)

    print("Loading Mibera data...", file=sys.stderr)
    records = load_data()
    print(f"  Loaded {len(records)} records", file=sys.stderr)

    # Extract ordered dimension values
    ancestors = sorted({r["ancestor"] for r in records if r.get("ancestor")})
    archetypes = sorted({r["archetype"] for r in records if r.get("archetype")})
    elements = sorted({r["element"] for r in records if r.get("element")})
    print(f"  Ancestors: {len(ancestors)}, Archetypes: {len(archetypes)}, Elements: {len(elements)}",
          file=sys.stderr)

    OUTPUT_DIR.mkdir(exist_ok=True)

    print("Generating by-ancestor.md...", file=sys.stderr)
    (OUTPUT_DIR / "by-ancestor.md").write_text(gen_by_ancestor(records, ancestors, archetypes, elements))

    print("Generating by-archetype.md...", file=sys.stderr)
    (OUTPUT_DIR / "by-archetype.md").write_text(gen_by_archetype(records, archetypes, ancestors, elements))

    print("Generating by-element.md...", file=sys.stderr)
    (OUTPUT_DIR / "by-element.md").write_text(gen_by_element(records, elements, archetypes, ancestors))

    print("\nDone! Generated 3 enriched browse pages.", file=sys.stderr)


if __name__ == "__main__":
    main()
