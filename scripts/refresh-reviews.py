#!/usr/bin/env python3
"""
refresh-reviews.py — refresh the Google review rating + count for ONE known business.

Reuses the same stealth stack as the agency's bulk Google Maps scraper
(Scrapling's StealthySession — a stealthy headless browser that clears Google's
UK/EU consent wall), but hits a single business instead of searching a whole town.
Writes data/reviews.json — the single source of truth the site reads at build time.

Design contract (matches the user's "scrape, fall back to last-known" preference):
  * NEVER writes a bad number. If the scrape is blocked, the DOM changed, or the
    parsed value fails a sanity check, the existing data/reviews.json is left
    UNTOUCHED and the script exits 0 (a blocked run is expected, not a failure —
    exiting 0 keeps the scheduler/CI green and keeps the last-good number live).
  * Only rewrites the file when rating/count actually change, so a git-connected
    host only rebuilds when the number really moves (no daily no-op deploys).

Setup (once, same as the bulk scraper):
    python3 -m pip install -r scripts/requirements.txt
    python3 -m camoufox fetch

Usage:
    python3 scripts/refresh-reviews.py
    python3 scripts/refresh-reviews.py --out data/reviews.json \
        --query "Beauty Within by Jasmine, Crowthorne, Berkshire"
    python3 scripts/refresh-reviews.py --url "https://www.google.com/maps/place/..."
"""

import argparse
import datetime
import json
import os
import re
import sys

try:
    from scrapling.fetchers import StealthySession
except ImportError:
    sys.exit("Scrapling is not installed. Run:\n"
             "  python3 -m pip install -r scripts/requirements.txt\n"
             "  python3 -m camoufox fetch")

DEFAULT_QUERY = "Beauty Within by Jasmine, Crowthorne, Berkshire"

# "5.0 stars 26 Reviews" (feed card) OR a lone "5.0 stars" / "26 reviews" (place header).
RATING_AND_COUNT = re.compile(r"([0-5][.,]\d)\s*stars?\s*([\d,]+)\s*review", re.I)
RATING_ONLY = re.compile(r"([0-5][.,]\d)\s*stars?", re.I)
COUNT_ONLY = re.compile(r"([\d,]+)\s*reviews?", re.I)


def log(msg):
    sys.stderr.write(f"[reviews] {msg}\n")


def search_url(query):
    q = query.replace(" ", "+")
    # hl/gl pin language+country to the UK so the rating format is consistent.
    return f"https://www.google.com/maps/search/{q}?hl=en&gl=uk"


def dismiss_consent(page):
    """Google (UK/EU) shows a cookie-consent wall that must be cleared before Maps
    loads. 'Reject all' keeps it tracking-free; fall back to 'Accept all'."""
    try:
        if "consent.google" not in (page.url or ""):
            return
        for sel in ['button[aria-label="Reject all"]', 'button[aria-label="Accept all"]']:
            btn = page.query_selector(sel)
            if btn:
                btn.click()
                page.wait_for_timeout(4000)  # let the save->redirect complete
                break
    except Exception:
        pass


def settle(page):
    """page_action: clear consent, then wait for either the results feed or a
    place header to render so the rating/review aria-labels are present."""
    dismiss_consent(page)
    try:
        page.wait_for_selector('[role="feed"], [role="main"] [role="img"]', timeout=20000)
    except Exception:
        pass
    page.wait_for_timeout(1500)  # let the rating widget hydrate
    return page


def looks_blocked(page):
    u = getattr(page, "url", "") or ""
    return "/sorry/" in u or "consent.google" in u


def aria_labels(page):
    """Every aria-label on the page (that's where Maps renders 'X stars Y reviews')."""
    out = []
    try:
        for el in page.css("[aria-label]"):
            v = el.attrib.get("aria-label")
            if v:
                out.append(v)
    except Exception:
        pass
    return out


def raw_html(page):
    for attr in ("html_content", "body"):
        try:
            v = getattr(page, attr)
            if isinstance(v, str) and v:
                return v
        except Exception:
            pass
    try:
        return str(page)
    except Exception:
        return ""


def parse_rating_count(page):
    """Return (rating_str, count_int) or (None, None). Tries, in order:
    a combined 'X stars Y reviews' label, then separate star/review labels, then
    a regex over the raw HTML as a last resort."""
    labels = aria_labels(page)

    # 1) combined label — most reliable (feed cards use this).
    for lbl in labels:
        m = RATING_AND_COUNT.search(lbl)
        if m:
            return m.group(1).replace(",", "."), int(m.group(2).replace(",", ""))

    # 2) separate labels — place-header layout ("5.0 stars" + "26 reviews").
    rating = count = None
    for lbl in labels:
        if rating is None:
            r = RATING_ONLY.search(lbl)
            if r:
                rating = r.group(1).replace(",", ".")
        if count is None:
            c = COUNT_ONLY.search(lbl)
            if c:
                count = int(c.group(1).replace(",", ""))
    if rating and count:
        return rating, count

    # 3) last resort: scan the serialized HTML.
    html = raw_html(page)
    m = RATING_AND_COUNT.search(html)
    if m:
        return m.group(1).replace(",", "."), int(m.group(2).replace(",", ""))

    return None, None


def sane(rating, count, prev):
    """Reject obviously-wrong reads so we never publish a bad number."""
    try:
        rv = float(rating)
    except (TypeError, ValueError):
        return False
    if not (0.0 < rv <= 5.0):
        return False
    if not (isinstance(count, int) and count > 0):
        return False
    # Guard against grabbing a different business: a real count rarely drops much.
    prev_count = (prev or {}).get("count")
    if isinstance(prev_count, int) and prev_count > 0 and count < prev_count * 0.5:
        log(f"rejecting count={count}: less than half of last-good {prev_count} "
            f"(likely a mis-parse / wrong listing)")
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
    ap.add_argument("--query", default=DEFAULT_QUERY, help="Maps search query")
    ap.add_argument("--url", default=None,
                    help="exact Maps place URL (overrides --query when set)")
    args = ap.parse_args()

    prev = load_prev(args.out)
    url = args.url or search_url(args.query)
    log(f"fetching: {url}")

    rating = count = None
    try:
        with StealthySession(headless=True) as session:
            page = session.fetch(url, network_idle=True, timeout=60000, page_action=settle)
            if looks_blocked(page):
                log("Google served a consent/CAPTCHA wall — keeping last-good number.")
            else:
                rating, count = parse_rating_count(page)
    except Exception as e:
        log(f"scrape error ({e!r}) — keeping last-good number.")

    if rating is None or count is None:
        log("could not parse rating/count — data/reviews.json left unchanged.")
        return 0

    if not sane(rating, count, prev):
        log("parsed value failed the sanity check — data/reviews.json left unchanged.")
        return 0

    # Normalise rating to one decimal string (matches how the site renders it).
    rating = f"{float(rating):.1f}"
    log(f"scraped rating={rating}, count={count}")

    if prev and prev.get("rating") == rating and prev.get("count") == count:
        log("unchanged — data/reviews.json left as-is (no rebuild needed).")
        return 0

    payload = {
        "rating": rating,
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
    log(f"UPDATED {args.out}: {old} -> {rating}/{count}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
