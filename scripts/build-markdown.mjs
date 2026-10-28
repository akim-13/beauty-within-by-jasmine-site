// Post-build: emit a Markdown sibling (out/<path>index.md) for every page in
// MARKDOWN_PAGES, converted from the exported HTML <main>. Served directly at
// /<path>index.md and via `Accept: text/markdown` by the negotiate edge function.
// Fails the build loudly if a page is missing or converts to almost nothing.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import TurndownService from 'turndown';
import gfmPlugin from '@joplin/turndown-plugin-gfm';
import { MARKDOWN_PAGES, SITE_ORIGIN } from '../lib/negotiate.mjs';

const { tables } = gfmPlugin;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'out');
const MIN_CHARS = 300;

const REMOVE_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'IFRAME', 'FORM', 'IMG', 'PICTURE']);
const REMOVE_CLASSES = ['mobile-menu', 'marquee', 'scroll-cue', 'hero-badge', 'stars'];

const CONTACT_BLOCK =
  "Beauty Within by Jasmine · 58 Duke's Ride, Crowthorne, Berkshire, RG45 6NY · 07501 838484 · " +
  `jasmine.crean@mail.com · Enquire: ${SITE_ORIGIN}/#contact`;

function shouldRemove(node) {
  const name = node.nodeName.toUpperCase();
  if (REMOVE_TAGS.has(name)) return true;
  const cls = node.classList;
  if (!cls) return false;
  if (name === 'HEADER' && cls.contains('nav')) return true;
  return REMOVE_CLASSES.some((c) => cls.contains(c));
}

// Root-relative links get the origin; in-page anchors resolve against the page.
function absolutise(href, page) {
  if (!href) return href;
  if (href.startsWith('/') && !href.startsWith('//')) return SITE_ORIGIN + href;
  if (href.startsWith('#')) return `${SITE_ORIGIN}${page}${href}`;
  return href;
}

function makeTurndown(page) {
  const td = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
  });
  td.use(tables);
  // A rule (not td.remove): added rules take precedence over turndown's
  // built-in ones, so e.g. <img> is dropped instead of becoming ![](...).
  td.addRule('strip', { filter: shouldRemove, replacement: () => '' });
  // FAQ <details><summary>: question as a bold line, answer below.
  td.addRule('summary', {
    filter: 'summary',
    replacement: (content) => `\n\n**${content.trim()}**\n\n`,
  });
  td.addRule('absoluteLinks', {
    filter: (node) => node.nodeName === 'A' && node.getAttribute('href'),
    replacement: (content, node) => {
      const text = content.trim();
      if (!text) return '';
      const href = absolutise(node.getAttribute('href'), page);
      // Card-style links wrap whole blocks (headings, paragraphs). Markdown
      // links cannot, so keep the block content and link its last line.
      if (text.includes('\n')) {
        const lines = text.split('\n');
        const label = lines.pop().trim();
        return `\n\n${lines.join('\n').trim()}\n\n[${label}](${href})\n\n`;
      }
      const title = node.getAttribute('title');
      return `[${text}](${href}${title ? ` "${title.replace(/"/g, '\\"')}"` : ''})`;
    },
  });
  return td;
}

function extractMain(html, file) {
  const m = html.match(/<main\b[^>]*>[\s\S]*<\/main>/i);
  if (!m) throw new Error(`build-markdown: no <main> element in ${file}`);
  // Adjacent inline elements laid out as separate lines by CSS (name + role,
  // caption + credit, footer links) would otherwise run together as text.
  return m[0]
    .replace(/<\/(span|b|strong|small|a)>(?=<(span|small|a)\b)/gi, '</$1> · ')
    .replace(/([^>\s])<small>/gi, '$1 · <small>');
}

function build() {
  const failures = [];
  for (const page of MARKDOWN_PAGES) {
    const htmlFile = path.join(OUT, page, 'index.html');
    if (!existsSync(htmlFile)) {
      failures.push(`missing HTML for ${page}: ${path.relative(ROOT, htmlFile)}`);
      continue;
    }
    const td = makeTurndown(page);
    const main = extractMain(readFileSync(htmlFile, 'utf8'), htmlFile);
    let body = td
      .turndown(main)
      .replace(/^ *· /gm, '') // separator left by an empty leading element
      .replace(/ · *$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    if (body.length < MIN_CHARS) {
      failures.push(`Markdown for ${page} is only ${body.length} chars (< ${MIN_CHARS})`);
      continue;
    }
    const url = SITE_ORIGIN + page;
    const md =
      `Markdown version of ${url} (HTML: same url). Site guide: ${SITE_ORIGIN}/llms.txt\n\n` +
      `${body}\n\n---\n\n${CONTACT_BLOCK}\n`;
    const mdFile = path.join(OUT, page, 'index.md');
    writeFileSync(mdFile, md.replace(/\n{3,}/g, '\n\n'));
    console.log(`build-markdown: ${path.relative(ROOT, mdFile)} (${md.length} chars)`);
  }
  if (failures.length) {
    console.error(`build-markdown FAILED:\n  - ${failures.join('\n  - ')}`);
    process.exit(1);
  }
}

build();
