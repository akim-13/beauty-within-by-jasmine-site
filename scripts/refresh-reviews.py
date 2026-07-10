#!/usr/bin/env python3
"""
refresh-reviews.py — refresh the Google rating + review count for ONE business
via the Google Places API (New), and write it to data/reviews.json (the single
source of truth the site reads at build time).

Why the API and not scraping: a scraped Google Maps page is served *degraded* to
datacenter IPs (the review count is stripped), so CI scraping can't get the number.
The Places API returns clean `rating` + `userRatingCount` as JSON from any IP.

Design contract ("scrape, fall back to last-known"):
  * NEVER writes a bad number. On any error (network, quota, unexpected payload,
    failed sanity check) the existing data/reviews.json is left UNTOUCHED and the
    script exits 0 — a hiccup is a no-op, the last-good number stays live.
  * Only rewrites the file when rating/count actually change, so a git-connected
    host only rebuilds when the number really moves.

Requires an API key in the GOOGLE_MAPS_API_KEY environment variable (a Places-API
enabled Google Cloud key). No third-party packages — standard library only.

Usage:
    GOOGLE_MAPS_API_KEY=... python3 scripts/refresh-reviews.py
    GOOGLE_MAPS_API_KEY=... python3 scripts/refresh-reviews.py --out data/reviews.json
"""

import argparse
import datetime
import json
import os
import sys
import urllib.error
import urllib.request

# Beauty Within by Jasmine, Crowthorne — stable Places API place id (locked to her
# listing, so the read is unambiguous). Verified via places:searchText.
PLACE_ID = "ChIJzQ5cP-mBdkgR8UL0Gp-ALpg"
ENDPOINT = "https://places.googleapis.com/v1/places/{place_id}"
FIELD_MASK = "id,displayName,rating,userRatingCount"


def log(msg):
    sys.stderr.write(f"[reviews] {msg}\n")


def fetch_place(place_id, api_key):
    """Return the Place Details JSON, or None on any failure."""
    req = urllib.request.Request(
        ENDPOINT.format(place_id=place_id),
        headers={
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": FIELD_MASK,
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = ""
        try:
            body = e.read().decode("utf-8")[:300]
        except Exception:
            pass
        log(f"Places API HTTP {e.code}: {body}")
    except Exception as e:
        log(f"Places API request failed: {e!r}")
    return None


def sane(rating, count, prev):
    """Reject obviously-wrong reads so we never publish a bad number."""
    if not isinstance(rating, (int, float)) or not (0.0 < rating <= 5.0):
        return False
    if not isinstance(count, int) or count <= 0:
        return False
    prev_count = (prev or {}).get("count")
    if isinstance(prev_count, int) and prev_count > 0 and count < prev_count * 0.5:
        log(f"rejecting count={count}: less than half of last-good {prev_count}")
        return False
    return True


def load_prev(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="data/reviews.json", help="output JSON path")
    ap.add_argument("--place-id", default=PLACE_ID, help="Google Places place id")
    args = ap.parse_args()

    api_key = os.environ.get("GOOGLE_MAPS_API_KEY", "").strip()
    if not api_key:
        log("GOOGLE_MAPS_API_KEY is not set — leaving data/reviews.json unchanged.")
        return 0

    prev = load_prev(args.out)
    data = fetch_place(args.place_id, api_key)
    if not data:
        log("no data from Places API — leaving data/reviews.json unchanged.")
        return 0

    rating = data.get("rating")
    count = data.get("userRatingCount")
    name = (data.get("displayName") or {}).get("text", "")
    log(f"Places API returned: {name!r} rating={rating} count={count}")

    if not sane(rating, count, prev):
        log("value failed the sanity check — data/reviews.json left unchanged.")
        return 0

    rating_str = f"{float(rating):.1f}"  # match how the site renders it, e.g. "5.0"

    if prev and prev.get("rating") == rating_str and prev.get("count") == count:
        log("unchanged — data/reviews.json left as-is (no rebuild needed).")
        return 0

    payload = {
        "rating": rating_str,
        "count": count,
        "updated": datetime.date.today().isoformat(),
    }
    tmp = args.out + ".tmp"
    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
        f.write("\n")
    os.replace(tmp, args.out)
    old = f"{(prev or {}).get('rating')}/{(prev or {}).get('count')}" if prev else "(none)"
    log(f"UPDATED {args.out}: {old} -> {rating_str}/{count}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
