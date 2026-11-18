#!/usr/bin/env python3
"""
refresh-reviews.py — refresh the Google rating + review count for ONE business by reading
its public Google Maps listing in a headless browser, and write it to data/reviews.json (the
single source of truth the site reads at build time).

History: 2026-07 → 2026-09 this used the Google Places API with a borrowed key; the key's
owner revoked access on ~2026-10-01 (HTTP 403 on every run) and the old fail-silent design hid
it for 7 weeks. Replaced 2026-11 by this scraper, which needs no key or billing account.

How it works / gotchas (verified 2026-11-18, local + GitHub Actions 5/5):
  * A browser whose user-agent says "HeadlessChrome" gets Google's "limited view" of Maps with
    the review COUNT STRIPPED. We present a normal Chrome UA for the same Chromium version; with
    that, GitHub Actions' datacenter IPs get the count. (The "limited view" banner can still
    appear with the count present, so the banner alone is not treated as a failure.)
  * The read is ANCHORED to the business's own header (the <h1> must equal NAME), so a
    neighbouring listing can never be picked up (that happened once, in 2026-07).
  * Rating + count come from the role=img aria-labels in the header after the <h1>
    ("5.0 stars ", "34 reviews") — not from Google's obfuscated class names.

Contract:
  * NEVER writes a bad number: on any failure or failed sanity check data/reviews.json is
    left UNTOUCHED (last-good stays live).
  * But a failure EXITS 1, so the GitHub Actions run goes red and GitHub emails the owner.
    (The old exit-0-on-error design is what hid the 2026-10 outage.)
  * Only rewrites the file when rating/count actually change, so the host only rebuilds when
    the number really moves.

Usage:
    python3 scripts/refresh-reviews.py --out data/reviews.json
    python3 scripts/refresh-reviews.py --dry-run          # print the read, write nothing
Requires: pip install playwright && python -m playwright install --with-deps chromium
"""

import argparse
import datetime
import json
import os
import re
import sys

PLACE_ID = "ChIJzQ5cP-mBdkgR8UL0Gp-ALpg"  # Beauty Within by Jasmine, Crowthorne
NAME = "Beauty Within by Jasmine"
URL = f"https://www.google.com/maps/place/?q=place_id:{PLACE_ID}&hl=en"


def log(msg):
    sys.stderr.write(f"[reviews] {msg}\n")


def read_maps(debug_prefix):
    """Return (rating: float, count: int). Raises on any failure (after saving debug files)."""
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        try:
            major = browser.version.split(".")[0]
            ua = (f"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                  f"(KHTML, like Gecko) Chrome/{major}.0.0.0 Safari/537.36")
            ctx = browser.new_context(locale="en-GB", timezone_id="Europe/London",
                                      user_agent=ua, viewport={"width": 1366, "height": 900})
            page = ctx.new_page()
            try:
                page.goto(URL, wait_until="domcontentloaded", timeout=60000)
                if "consent." in page.url:  # EU cookie wall
                    for label in ("Reject all", "Accept all"):
                        btn = page.get_by_role("button", name=label)
                        if btn.count():
                            btn.first.click()
                            break
                h1 = page.locator("h1", has_text=NAME).first
                h1.wait_for(timeout=30000)
                if h1.inner_text().strip() != NAME:
                    raise RuntimeError(f"h1 is {h1.inner_text().strip()!r}, expected {NAME!r}")
                # wait for the header's review-count label to render
                page.locator("[role=img][aria-label$=' reviews'], [role=img][aria-label$=' review']") \
                    .first.wait_for(state="attached", timeout=15000)
                body = page.inner_text("body")
                if "limited view" in body.lower():
                    # Not fatal by itself: on 2026-11-18 the banner appeared WITH the count intact.
                    # If the count really is stripped, parse_header() fails below.
                    log("note: Google shows the 'limited view' banner")
                return parse_header(page.content())
            except Exception:
                try:
                    page.screenshot(path=f"{debug_prefix}.png", full_page=True)
                    with open(f"{debug_prefix}.html", "w", encoding="utf-8") as f:
                        f.write(page.content())
                    log(f"debug saved: {debug_prefix}.png / .html (final url: {page.url})")
                except Exception as e:
                    log(f"could not save debug files: {e!r}")
                raise
        finally:
            browser.close()


def parse_header(html):
    """Rating + count from the header that immediately follows the business's <h1>."""
    i = html.find(f">{NAME}<")
    if i < 0:
        raise RuntimeError("business name not found in page HTML")
    head = html[i:i + 6000]  # the stars/count row sits within a few KB after the h1
    m_r = re.search(r'aria-label="(\d(?:[.,]\d)?) stars?\s*"', head)
    m_c = re.search(r'aria-label="([\d,]+) reviews?"', head)
    if not (m_r and m_c):
        raise RuntimeError(f"rating/count not found after h1 (rating={bool(m_r)}, count={bool(m_c)})")
    return float(m_r.group(1).replace(",", ".")), int(m_c.group(1).replace(",", ""))


def sane(rating, count, prev):
    """Reject obviously-wrong reads so we never publish a bad number."""
    if not (0.0 < rating <= 5.0) or count <= 0:
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
    ap.add_argument("--dry-run", action="store_true", help="print the read, write nothing")
    ap.add_argument("--debug-prefix", default="reviews-debug")
    args = ap.parse_args()

    prev = load_prev(args.out)
    try:
        rating, count = read_maps(args.debug_prefix)
    except Exception as e:
        log(f"FAILED to read Google Maps: {e!r} — data/reviews.json left unchanged.")
        return 1
    log(f"Google Maps shows: rating={rating} count={count}")

    if not sane(rating, count, prev):
        log("value failed the sanity check — data/reviews.json left unchanged.")
        return 1

    rating_str = f"{rating:.1f}"  # match how the site renders it, e.g. "5.0"
    if args.dry_run:
        print(json.dumps({"rating": rating_str, "count": count}))
        return 0
    if prev and prev.get("rating") == rating_str and prev.get("count") == count:
        log("unchanged — data/reviews.json left as-is (no rebuild needed).")
        return 0

    payload = {"rating": rating_str, "count": count,
               "updated": datetime.date.today().isoformat()}
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
