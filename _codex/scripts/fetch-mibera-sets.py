#!/usr/bin/env python3
"""Fetch ERC-1155 metadata for Mibera Sets tokens on Optimism.

Makes eth_call to uri(uint256) for token IDs 1-12, fetches Arweave metadata,
and generates individual markdown files in mibera-sets/.

Per SDD — Cycle 015.
"""

import json
import re
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
OUTPUT_DIR = REPO_ROOT / "mibera-sets"
CACHE_FILE = REPO_ROOT / "_codex" / "data" / "mibera-sets-meta.json"

RPC_URL = "https://mainnet.optimism.io"
CONTRACT = "0x886D2176D899796cD1AfFA07Eff07B9b2B80f1be"
URI_SELECTOR = "0x0e89341c"  # uri(uint256)

ARWEAVE_GATEWAY = "https://arweave.net"

TOKEN_IDS = range(1, 13)

# Supply/holder data from _codex/data/mibera-sets.md (cycle-009 research)
# Approximate for IDs 2, 3, 4, 12 due to Blockscout pagination
TOKEN_DATA = {
    1:  {"supply": 65,  "holders": 62, "category": "numbered"},
    2:  {"supply": 57,  "holders": 50, "category": "numbered"},
    3:  {"supply": 54,  "holders": 50, "category": "numbered"},
    4:  {"supply": 58,  "holders": 50, "category": "numbered"},
    5:  {"supply": 48,  "holders": 43, "category": "numbered"},
    6:  {"supply": 3,   "holders": 3,  "category": "numbered"},
    7:  {"supply": 1,   "holders": 1,  "category": "numbered"},
    8:  {"supply": 18,  "holders": 16, "category": "media"},
    9:  {"supply": 19,  "holders": 18, "category": "media"},
    10: {"supply": 19,  "holders": 19, "category": "media"},
    11: {"supply": 20,  "holders": 20, "category": "media"},
    12: {"supply": 54,  "holders": 50, "category": "completionist"},
}

CATEGORY_LABELS = {
    "numbered": "Numbered Set",
    "media": "Media",
    "completionist": "Completionist",
}


def decode_abi_string(hex_result):
    """Decode ABI-encoded string from eth_call result."""
    if not hex_result or hex_result == "0x":
        return ""
    raw = bytes.fromhex(hex_result[2:])  # strip 0x
    if len(raw) < 64:
        return ""
    offset = int.from_bytes(raw[0:32], "big")
    length = int.from_bytes(raw[offset:offset + 32], "big")
    return raw[offset + 32:offset + 32 + length].decode("utf-8")


def eth_call_uri(token_id, retries=3):
    """Call uri(uint256) on the contract via JSON-RPC."""
    token_hex = hex(token_id)[2:].zfill(64)
    data = URI_SELECTOR + token_hex

    payload = json.dumps({
        "jsonrpc": "2.0",
        "method": "eth_call",
        "params": [{"to": CONTRACT, "data": data}, "latest"],
        "id": 1,
    }).encode()

    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                RPC_URL, payload, {"Content-Type": "application/json"}
            )
            resp = json.loads(urllib.request.urlopen(req, timeout=10).read())
            if "error" in resp:
                print(f"  RPC error for token {token_id}: {resp['error']}", file=sys.stderr)
                return None
            return decode_abi_string(resp["result"])
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt < retries - 1:
                wait = 2 ** (attempt + 1)
                print(f"  Retry {attempt + 1}/{retries} for token {token_id} (wait {wait}s)...", file=sys.stderr)
                time.sleep(wait)
            else:
                print(f"  FAILED: token {token_id} after {retries} attempts: {e}", file=sys.stderr)
                return None


def resolve_uri(raw_uri, token_id):
    """Resolve ERC-1155 URI to fetchable HTTPS URL."""
    if not raw_uri:
        return None

    # ERC-1155 template substitution (hex, no padding)
    uri = raw_uri.replace("{id}", format(token_id, "x"))

    if uri.startswith("ar://"):
        return ARWEAVE_GATEWAY + "/" + uri[5:]
    if uri.startswith("ipfs://"):
        return "https://ipfs.io/ipfs/" + uri[7:]
    return uri


def resolve_image_uri(image_uri):
    """Resolve an image URI from metadata to an HTTPS URL."""
    if not image_uri:
        return None
    if image_uri.startswith("ar://"):
        return ARWEAVE_GATEWAY + "/" + image_uri[5:]
    if image_uri.startswith("ipfs://"):
        return "https://ipfs.io/ipfs/" + image_uri[7:]
    return image_uri


def fetch_metadata(url, token_id, retries=3):
    """Fetch JSON metadata from Arweave/HTTPS URL."""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url)
            resp = urllib.request.urlopen(req, timeout=15)
            return json.loads(resp.read())
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
            if attempt < retries - 1:
                wait = 2 ** (attempt + 1)
                print(f"  Retry metadata {attempt + 1}/{retries} for token {token_id} (wait {wait}s)...", file=sys.stderr)
                time.sleep(wait)
            else:
                print(f"  FAILED: metadata for token {token_id}: {e}", file=sys.stderr)
                return None


def slugify(name):
    """Convert name to slug: lowercase, hyphens, no special chars."""
    slug = name.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s]+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    return slug.strip("-")


def generate_token_file(token_id, metadata, uri_raw, uri_resolved):
    """Generate markdown file for a single token."""
    data = TOKEN_DATA[token_id]
    category = data["category"]
    supply = data["supply"]
    cat_label = CATEGORY_LABELS[category]

    name = metadata.get("name", f"Mibera Set Token #{token_id}")
    description = metadata.get("description", "")
    image_raw = metadata.get("image", "")
    image_url = resolve_image_uri(image_raw) or ""
    attributes = metadata.get("attributes", [])

    slug = slugify(name)

    # Build YAML frontmatter
    lines = [
        "---",
        f"token_id: {token_id}",
        f'name: "{name}"',
        f"type: mibera-set",
        f"category: {category}",
        f"supply: {supply}",
    ]
    if image_url:
        lines.append(f'image: "{image_url}"')
    if uri_resolved:
        lines.append(f'metadata_uri: "{uri_resolved}"')
    lines.append("---")
    lines.append("")

    # Build body
    approx = "~" if token_id in (2, 3, 4, 12) else ""
    lines.append(f"# {name}")
    lines.append("")
    lines.append(f"> **Token #{token_id}** · {cat_label} · Supply: {approx}{supply} · [All Mibera Sets →](README.md)")
    lines.append("")

    if description:
        lines.append(description)
        lines.append("")

    # Info table
    lines.append("| Field | Value |")
    lines.append("|-------|-------|")
    lines.append(f"| Token ID | {token_id} |")
    lines.append(f"| Category | {cat_label} |")
    lines.append(f"| Supply | {approx}{supply} |")
    if image_url:
        lines.append(f"| Image | [View on Arweave]({image_url}) |")
    if uri_resolved:
        lines.append(f"| Metadata | [View JSON]({uri_resolved}) |")

    # Attributes from metadata
    for attr in attributes:
        trait_type = attr.get("trait_type", "")
        value = attr.get("value", "")
        if trait_type and value:
            lines.append(f"| {trait_type} | {value} |")

    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("<!-- @generated:backlinks-start -->")
    lines.append("<!-- @generated:backlinks-end -->")
    lines.append("")

    return slug, "\n".join(lines)


def generate_readme(tokens_info):
    """Generate mibera-sets/README.md index."""
    from datetime import date
    today = date.today().isoformat()

    numbered = [(tid, info) for tid, info in tokens_info if TOKEN_DATA[tid]["category"] == "numbered"]
    media = [(tid, info) for tid, info in tokens_info if TOKEN_DATA[tid]["category"] == "media"]
    completionist = [(tid, info) for tid, info in tokens_info if TOKEN_DATA[tid]["category"] == "completionist"]

    lines = [
        f"<!-- codex-status: COMPLETE | entities: 12 | last-verified: {today} -->",
        "# Mibera Sets — Honey Road Artifacts",
        "",
        "*12 ERC-1155 tokens on Optimism representing artifacts from the Honey Road.*",
        "",
        f"> **Contract**: `{CONTRACT}` · Optimism",
        "> **Standard**: ERC-1155 · **Total Supply**: 481",
        "> [Collection-level reference →](../_codex/data/mibera-sets.md)",
        "",
        "---",
        "",
    ]

    def format_entry(tid, info):
        slug = info["slug"]
        name = info["name"]
        supply = TOKEN_DATA[tid]["supply"]
        approx = "~" if tid in (2, 3, 4, 12) else ""
        return f"- [{name}]({slug}.md) · Token #{tid} · Supply: {approx}{supply}"

    lines.append(f"## Numbered Sets ({len(numbered)})")
    lines.append("")
    for tid, info in numbered:
        lines.append(format_entry(tid, info))
    lines.append("")

    lines.append(f"## Media ({len(media)})")
    lines.append("")
    for tid, info in media:
        lines.append(format_entry(tid, info))
    lines.append("")

    lines.append(f"## Completionist ({len(completionist)})")
    lines.append("")
    for tid, info in completionist:
        lines.append(format_entry(tid, info))
    lines.append("")

    return "\n".join(lines)


def main():
    OUTPUT_DIR.mkdir(exist_ok=True)

    print(f"Fetching metadata for {len(list(TOKEN_IDS))} Mibera Set tokens...")
    print(f"Contract: {CONTRACT}")
    print(f"RPC: {RPC_URL}")
    print()

    cache = {
        "fetched": None,
        "contract": CONTRACT,
        "chain": "optimism",
        "rpc": RPC_URL,
        "tokens": {},
    }

    tokens_info = []  # (token_id, {"slug": ..., "name": ...})

    for token_id in TOKEN_IDS:
        print(f"Token {token_id}/12:")

        # Step 1: RPC call
        print(f"  Fetching URI via eth_call...")
        raw_uri = eth_call_uri(token_id)
        time.sleep(0.5)  # rate limit

        if not raw_uri:
            print(f"  WARNING: No URI returned for token {token_id}")
            # Create stub
            name = f"Mibera Set Token #{token_id}"
            slug = slugify(name)
            content = generate_stub(token_id)
            (OUTPUT_DIR / f"{slug}.md").write_text(content, encoding="utf-8")
            tokens_info.append((token_id, {"slug": slug, "name": name}))
            cache["tokens"][str(token_id)] = {"uri_raw": None, "uri_resolved": None, "metadata": None, "error": "No URI returned"}
            continue

        resolved_url = resolve_uri(raw_uri, token_id)
        print(f"  URI: {raw_uri}")
        print(f"  Resolved: {resolved_url}")

        # Step 2: Fetch metadata
        metadata = None
        if resolved_url:
            print(f"  Fetching metadata...")
            metadata = fetch_metadata(resolved_url, token_id)
            time.sleep(1.0)  # rate limit

        if metadata:
            print(f"  Name: {metadata.get('name', '?')}")
            slug, content = generate_token_file(token_id, metadata, raw_uri, resolved_url)
        else:
            print(f"  WARNING: No metadata for token {token_id}, creating stub")
            name = f"Mibera Set Token #{token_id}"
            slug = slugify(name)
            content = generate_stub(token_id)

        # Write file
        filepath = OUTPUT_DIR / f"{slug}.md"
        filepath.write_text(content, encoding="utf-8")
        print(f"  Wrote: {filepath.relative_to(REPO_ROOT)}")

        name = metadata.get("name", f"Mibera Set Token #{token_id}") if metadata else f"Mibera Set Token #{token_id}"
        tokens_info.append((token_id, {"slug": slug, "name": name}))

        cache["tokens"][str(token_id)] = {
            "uri_raw": raw_uri,
            "uri_resolved": resolved_url,
            "metadata": metadata,
        }

        print()

    # Generate README
    print("Generating README index...")
    readme_content = generate_readme(tokens_info)
    (OUTPUT_DIR / "README.md").write_text(readme_content, encoding="utf-8")
    print(f"  Wrote: mibera-sets/README.md")

    # Save cache
    from datetime import date
    cache["fetched"] = date.today().isoformat()
    CACHE_FILE.write_text(json.dumps(cache, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"  Wrote: {CACHE_FILE.relative_to(REPO_ROOT)}")

    print()
    print(f"Done! {len(tokens_info)} token files generated in mibera-sets/")


def generate_stub(token_id):
    """Generate stub file when metadata is unavailable."""
    data = TOKEN_DATA[token_id]
    category = data["category"]
    supply = data["supply"]
    cat_label = CATEGORY_LABELS[category]
    approx = "~" if token_id in (2, 3, 4, 12) else ""

    return f"""---
token_id: {token_id}
name: "Mibera Set Token #{token_id}"
type: mibera-set
category: {category}
supply: {supply}
---

# Mibera Set Token #{token_id}

> **Token #{token_id}** · {cat_label} · Supply: {approx}{supply} · [All Mibera Sets →](README.md)

<!-- GAP: Metadata unavailable — uri() call or Arweave fetch failed. -->

| Field | Value |
|-------|-------|
| Token ID | {token_id} |
| Category | {cat_label} |
| Supply | {approx}{supply} |

---

<!-- @generated:backlinks-start -->
<!-- @generated:backlinks-end -->
"""


if __name__ == "__main__":
    main()
