#!/usr/bin/env python3
"""Fetch image URLs for all 10,000 Miberas and embed in entry files.

Fetches metadata from Irys gateway, extracts image URLs, saves mapping,
then updates mibera files with image embeds.

Usage:
    python3 _codex/scripts/fetch-mibera-images.py           # Full run
    python3 _codex/scripts/fetch-mibera-images.py --fetch    # Fetch only (no file updates)
    python3 _codex/scripts/fetch-mibera-images.py --embed    # Embed only (uses cached mapping)

Per SDD — Cycle 015.
"""

import json
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
MIBERAS_DIR = REPO_ROOT / "miberas"
CACHE_FILE = REPO_ROOT / "_codex" / "data" / "mibera-image-urls.json"

METADATA_BASE = "https://gateway.irys.xyz/6MqM65yemqQpjVe4rCGxEJfsVA4dJszFhL3suzPGzH56"
TOTAL_TOKENS = 10000
WORKERS = 10
BATCH_SAVE_EVERY = 200  # Save progress every N tokens


def fetch_image_url(token_id):
    """Fetch metadata for a single token and return its image URL."""
    url = f"{METADATA_BASE}/{token_id}"
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            resp = urllib.request.urlopen(req, timeout=15)
            meta = json.loads(resp.read())
            return token_id, meta.get("image", ""), None
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
            if attempt < 2:
                time.sleep(2 ** (attempt + 1))
            else:
                return token_id, "", str(e)


def fetch_all_images():
    """Fetch image URLs for all tokens, with caching and progress."""
    # Load existing cache
    cache = {}
    if CACHE_FILE.exists():
        cache = json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        print(f"Loaded cache with {len(cache)} entries")

    # Find which tokens still need fetching
    needed = [i for i in range(1, TOTAL_TOKENS + 1) if str(i) not in cache]

    if not needed:
        print("All 10,000 image URLs already cached.")
        return cache

    print(f"Fetching {len(needed)} remaining image URLs ({WORKERS} workers)...")

    errors = []
    completed = 0
    start_time = time.time()

    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        futures = {executor.submit(fetch_image_url, tid): tid for tid in needed}

        for future in as_completed(futures):
            token_id, image_url, error = future.result()
            if error:
                errors.append((token_id, error))
            if image_url:
                cache[str(token_id)] = image_url

            completed += 1

            # Progress report
            if completed % 100 == 0 or completed == len(needed):
                elapsed = time.time() - start_time
                rate = completed / elapsed if elapsed > 0 else 0
                remaining = (len(needed) - completed) / rate if rate > 0 else 0
                print(f"  {completed}/{len(needed)} fetched "
                      f"({rate:.1f}/s, ~{remaining:.0f}s remaining, "
                      f"{len(errors)} errors)")

            # Checkpoint save
            if completed % BATCH_SAVE_EVERY == 0:
                CACHE_FILE.write_text(
                    json.dumps(cache, sort_keys=True),
                    encoding="utf-8"
                )

    # Final save
    CACHE_FILE.write_text(
        json.dumps(cache, sort_keys=True),
        encoding="utf-8"
    )

    elapsed = time.time() - start_time
    print(f"\nFetch complete in {elapsed:.0f}s")
    print(f"  Cached: {len(cache)}")
    print(f"  Errors: {len(errors)}")
    if errors:
        print(f"  Failed tokens: {[e[0] for e in errors[:20]]}")
        if len(errors) > 20:
            print(f"  ... and {len(errors) - 20} more")

    return cache


def embed_images(cache):
    """Add image embeds to all mibera files."""
    print(f"\nEmbedding images in mibera files...")

    updated = 0
    skipped = 0
    no_url = 0

    for token_id in range(1, TOTAL_TOKENS + 1):
        image_url = cache.get(str(token_id), "")
        if not image_url:
            no_url += 1
            continue

        filepath = MIBERAS_DIR / f"{token_id:04d}.md"
        if not filepath.exists():
            continue

        content = filepath.read_text(encoding="utf-8")

        # Check if image is already embedded
        if "![Mibera #" in content:
            skipped += 1
            continue

        # Insert image after "# Mibera #N" heading, before "## Traits"
        marker = f"# Mibera #{token_id}\n"
        if marker not in content:
            # Try with different spacing
            marker = f"# Mibera #{token_id}\r\n"
            if marker not in content:
                skipped += 1
                continue

        image_md = f"\n![Mibera #{token_id}]({image_url})\n"
        content = content.replace(marker, marker + image_md, 1)

        filepath.write_text(content, encoding="utf-8")
        updated += 1

        if updated % 1000 == 0:
            print(f"  {updated} files updated...")

    print(f"\nEmbed complete:")
    print(f"  Updated: {updated}")
    print(f"  Skipped (already has image): {skipped}")
    print(f"  No URL in cache: {no_url}")


def main():
    args = sys.argv[1:]

    fetch_only = "--fetch" in args
    embed_only = "--embed" in args

    if embed_only:
        if not CACHE_FILE.exists():
            print("ERROR: No cache file found. Run without --embed first.")
            sys.exit(1)
        cache = json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        print(f"Loaded {len(cache)} cached image URLs")
        embed_images(cache)
    elif fetch_only:
        fetch_all_images()
    else:
        cache = fetch_all_images()
        embed_images(cache)


if __name__ == "__main__":
    main()
