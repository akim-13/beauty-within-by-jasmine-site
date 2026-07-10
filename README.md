# Beauty Within by Jasmine — website

Production website for **Beauty Within by Jasmine** (Jasmine Crean) — accredited 1:1 microblading
training + semi-permanent makeup treatments in Crowthorne, Berkshire.

- **Stack:** Next.js (App Router), static export (`output: 'export'`).
- **Host:** Netlify (Mironov Web Design team). Deploys to `beauty-within-jasmine.netlify.app`;
  will point to the client's domain (`beautywithinbyj.com`) at launch.
- **Engagement brain / client state:** lives in the separate `beauty-within-by-jasmine` repo
  (`brain/`), not here. This repo is **the website only**.

## Develop

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # static export -> ./out
```

## Deploy

Netlify builds from this repo. `netlify.toml` sets `NEXT_PUBLIC_BASE_PATH=""` so the site is
served at the domain root. (The same source is also mirrored in the agency preview-aggregator,
where that var is left unset and the site is served under the `/beauty-within-by-j/` subpath —
hence the env-gating in `next.config.mjs` and `image-loader.js`.)

## Notes

- **Image originals:** only the optimized `.webp` (and the small logos) are committed here. The
  large source `.png`/`.jpg` originals are kept in the agency monorepo, not in this repo.
- **No public pricing:** the course price is intentionally never shown (enquiry-first). Any
  earnings figures on `/training/` are illustrative and carry a "not a guarantee" disclaimer.
