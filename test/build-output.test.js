// Checks the static export in out/. Requires a build first:
//   NEXT_PUBLIC_BASE_PATH="" npm run build
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MARKDOWN_PAGES, SITE_ORIGIN } from '../lib/negotiate.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
const read = (rel) => readFileSync(path.join(OUT, rel), 'utf8');

before(() => {
  if (!existsSync(path.join(OUT, 'index.html')) || !existsSync(path.join(OUT, 'index.md'))) {
    throw new Error(
      'out/ is missing or incomplete. Build first: NEXT_PUBLIC_BASE_PATH="" npm run build',
    );
  }
});

const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

for (const page of MARKDOWN_PAGES) {
  test(`markdown sibling for ${page}`, () => {
    const rel = path.join(page, 'index.md');
    assert.ok(existsSync(path.join(OUT, rel)), `missing out${page}index.md`);
    const md = read(rel);
    assert.ok(md.length >= 300, `${rel} only ${md.length} chars`);
    assert.ok(
      md.startsWith(
        `Markdown version of ${SITE_ORIGIN}${page} (HTML: same url). Site guide: ${SITE_ORIGIN}/llms.txt\n`,
      ),
      'preamble line',
    );
    assert.match(md, /^# \S/m, 'needs a level-1 heading');
    assert.match(md, /\n---\n\nBeauty Within by Jasmine · 58 Duke's Ride, Crowthorne, Berkshire, RG45 6NY · 07501 838484 · jasmine\.crean@mail\.com · Enquire: https:\/\/www\.beautywithinbyj\.com\/#contact\n$/);
    assert.doesNotMatch(md, /<script|<svg|!\[/, 'no scripts, svg or images');
  });
}

test('llms.txt follows the llmstxt.org format', () => {
  const txt = read('llms.txt');
  assert.ok(txt.startsWith('# Beauty Within by Jasmine\n'), 'H1 first');
  const blocks = txt.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  assert.ok(blocks[1].startsWith('> '), 'second block is the blockquote summary');
  assert.ok(txt.includes('When to use this site'));
  const firstH2 = txt.indexOf('\n## ');
  assert.ok(firstH2 > 0, 'has H2 file lists');
  const between = txt.slice(txt.indexOf('\n> '), firstH2);
  assert.doesNotMatch(between, /^#{1,6} /m, 'no headings between summary and first H2');
  const mdLinks = [...txt.matchAll(/https:\/\/www\.beautywithinbyj\.com(\/[^\s)]*index\.md)/g)].map((m) => m[1]);
  assert.ok(mdLinks.length >= 4, 'lists the markdown pages');
  for (const link of mdLinks) assert.ok(existsSync(path.join(OUT, link)), `llms.txt links missing file ${link}`);
});

test('llms.txt carries the live Google rating and count from data/reviews.json', () => {
  const txt = read('llms.txt');
  const reviews = JSON.parse(readFileSync(path.join(ROOT, 'data', 'reviews.json'), 'utf8'));
  assert.ok(
    txt.includes(`Reviews: ${reviews.rating} average from ${reviews.count} Google reviews.`),
    'rating/count sentence matches data/reviews.json',
  );
  assert.doesNotMatch(txt, /\{\{\w+\}\}/, 'no unfilled placeholders');
});

test('portfolio captions are stripped from the homepage Markdown', () => {
  assert.doesNotMatch(read('index.md'), /· Beauty Within$/m);
});

test('privacy page', () => {
  const text = visibleText(read('privacy/index.html'));
  assert.ok(text.length >= 500, `privacy text only ${text.length} chars`);
  assert.ok(text.includes('Privacy notice'));
  assert.ok(text.includes('ico.org.uk'));
});

test('branded 404', () => {
  const html = read('404.html');
  assert.ok(html.includes('Page not found'));
  assert.match(html, /href="\/training\/"/);
  assert.match(html, /href="\/treatments\/"/);
});

for (const page of MARKDOWN_PAGES) {
  test(`link relations in ${page}index.html`, () => {
    const html = read(path.join(page, 'index.html'));
    const alt = html.match(/<link[^>]*rel="alternate"[^>]*>/g) || [];
    assert.ok(
      alt.some((l) => l.includes('type="text/markdown"') && l.includes(`${page}index.md"`)),
      'rel=alternate type=text/markdown',
    );
    assert.match(html, /<link rel="describedby" href="\/llms\.txt"\/?>/);
  });
}

test('homepage JSON-LD founder is a full Person', () => {
  const html = read('index.html');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1]),
  );
  const business = blocks.find((b) => b['@type'] === 'BeautySalon');
  assert.ok(business, 'BeautySalon JSON-LD present');
  const f = business.founder;
  assert.equal(f['@type'], 'Person');
  for (const key of ['name', 'description', 'url', 'jobTitle', 'worksFor', 'sameAs']) {
    assert.ok(f[key], `founder.${key}`);
  }
});

test('sitemap lists /privacy/', () => {
  assert.ok(read('sitemap.xml').includes(`${SITE_ORIGIN}/privacy/`));
});
