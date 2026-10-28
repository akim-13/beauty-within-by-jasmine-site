import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseAccept,
  preferredType,
  appendVaryAccept,
  markdownPath,
  isMarkdownPage,
  MARKDOWN_PAGES,
  notFoundMarkdown,
} from '../lib/negotiate.mjs';

const BOTH = ['text/html', 'text/markdown'];
const MD_ONLY = ['text/markdown'];

// Test vectors from https://acceptmarkdown.com/guides/accept-parsing
// (null Accept = header absent; expected null = 406).
const VECTORS = [
  ['text/markdown', BOTH, 'text/markdown'],
  ['text/markdown, text/html;q=0.8', BOTH, 'text/markdown'],
  ['text/html', BOTH, 'text/html'],
  ['text/markdown;q=0, text/html', BOTH, 'text/html'],
  ['text/markdown;q=0', MD_ONLY, null],
  [null, BOTH, 'text/html'],
  ['*/*', BOTH, 'text/html'],
  // Exclusion-only headers follow the guide's gotcha (not 406):
  ['text/markdown;q=0', BOTH, 'text/html'],
  ['text/html;q=0', BOTH, 'text/markdown'],
  ['application/pdf', BOTH, null],
];

for (const [accept, produces, expected] of VECTORS) {
  test(`guide vector: Accept ${JSON.stringify(accept)} / produces [${produces}] -> ${expected ?? '406'}`, () => {
    assert.equal(preferredType(accept, produces), expected);
  });
}

test('real Chrome Accept header selects HTML', () => {
  const chrome =
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';
  assert.equal(preferredType(chrome, BOTH), 'text/html');
});

test('markdown preferred over html at q=0.8', () => {
  assert.equal(preferredType('text/markdown, text/html;q=0.8', BOTH), 'text/markdown');
});

test('most-specific match: text/html;q=0 is not rescued by */*;q=1', () => {
  const chosen = preferredType('text/html;q=0, */*;q=1', BOTH);
  assert.notEqual(chosen, 'text/html');
  assert.equal(chosen, 'text/markdown');
  assert.equal(preferredType('text/html;q=0, */*;q=1', ['text/html']), null);
  // Not exclusion-only (*/*;q=1 is positive), so no gotcha fallback for html.
});

test('unsupported type only -> null (406)', () => {
  assert.equal(preferredType('application/pdf', BOTH), null);
});

test('client order breaks q ties', () => {
  assert.equal(preferredType('text/markdown, text/html, */*', BOTH), 'text/markdown');
  assert.equal(preferredType('text/html, text/markdown', BOTH), 'text/html');
});

test('text/* wildcard and case-insensitive types', () => {
  assert.equal(preferredType('TEXT/Markdown', BOTH), 'text/markdown');
  assert.equal(preferredType('text/*', BOTH), 'text/html');
});

test('parseAccept: q clamping, specificity, empty entries', () => {
  assert.deepEqual(parseAccept('text/html;q=2, text/*;q=-1, */*, '), [
    { type: 'text/html', q: 1, specificity: 2 },
    { type: 'text/*', q: 0, specificity: 1 },
    { type: '*/*', q: 1, specificity: 0 },
  ]);
});

test('markdownPath', () => {
  assert.equal(markdownPath('/'), '/index.md');
  assert.equal(markdownPath('/training/'), '/training/index.md');
  assert.equal(markdownPath('/training'), '/training/index.md');
});

test('isMarkdownPage covers MARKDOWN_PAGES with and without trailing slash', () => {
  for (const p of MARKDOWN_PAGES) assert.ok(isMarkdownPage(p), p);
  assert.ok(isMarkdownPage('/privacy'));
  assert.ok(!isMarkdownPage('/nope/'));
});

test('appendVaryAccept: empty, existing other token, already present', () => {
  const h1 = new Headers();
  appendVaryAccept(h1);
  assert.equal(h1.get('vary'), 'Accept');

  const h2 = new Headers({ Vary: 'Accept-Encoding' });
  appendVaryAccept(h2);
  assert.equal(h2.get('vary'), 'Accept-Encoding, Accept');

  const h3 = new Headers({ Vary: 'accept, Origin' });
  appendVaryAccept(h3);
  assert.equal(h3.get('vary'), 'accept, Origin');
});

test('notFoundMarkdown echoes the requested path without a trailing index.htm(l)', () => {
  assert.match(notFoundMarkdown('/missing/index.htm'), /no page at `\/missing`/);
  assert.match(notFoundMarkdown('/missing'), /no page at `\/missing`/);
});
