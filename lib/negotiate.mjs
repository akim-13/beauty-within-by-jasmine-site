// Content negotiation core (acceptmarkdown.com protocol), shared by:
//   - netlify/edge-functions/negotiate.js (Deno, at the edge)
//   - scripts/build-markdown.mjs (Node, at build time)
//   - test/*.test.js (Node's built-in test runner)
// Keep this file pure: no Deno-, Node- or Netlify-specific imports. Web-standard
// globals only (Headers is used by callers, never constructed here).
//
// parseAccept / preferredType / appendVaryAccept / markdownPath are a faithful
// port of the acceptmarkdown.com Cloudflare Workers recipe
// (https://acceptmarkdown.com/recipes/cloudflare-workers), including the
// RFC 9110 §12.5.1 most-specific-match rule.

export const SITE_ORIGIN = 'https://www.beautywithinbyj.com';

// Pages that have a Markdown sibling at <path>index.md. The build script
// generates exactly these; the edge function negotiates exactly these.
export const MARKDOWN_PAGES = ['/', '/training/', '/treatments/', '/privacy/'];

export function parseAccept(header) {
  return String(header)
    .split(',')
    .map((raw) => {
      const parts = raw.trim().split(';').map((s) => s.trim());
      const type = parts[0].toLowerCase();
      if (!type) return null;
      let q = 1;
      for (const param of parts.slice(1)) {
        const [name, value] = param.split('=').map((s) => s.trim());
        if (name && name.toLowerCase() === 'q') {
          const parsed = Number(value);
          if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
        }
      }
      const specificity = type === '*/*' ? 0 : type.endsWith('/*') ? 1 : 2;
      return { type, q, specificity };
    })
    .filter((e) => e !== null);
  // Client order preserved: position is the tie-break in preferredType.
}

function matches(entry, candidate) {
  if (entry.type === '*/*') return true;
  if (entry.type.endsWith('/*')) return candidate.startsWith(entry.type.slice(0, -1));
  return entry.type === candidate;
}

// Returns the produced type to serve, or null (=> 406 when an Accept header was sent).
export function preferredType(header, produces) {
  if (!header) return produces[0] ?? null;
  const entries = parseAccept(header);
  if (entries.length === 0) return produces[0] ?? null;

  let bestType = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of produces) {
    // Most specific matching range wins regardless of q (RFC 9110 §12.5.1),
    // so `text/html;q=0, */*;q=1` does NOT allow text/html via the wildcard.
    let matched = null;
    let matchedPosition = Infinity;
    for (let idx = 0; idx < entries.length; idx++) {
      const e = entries[idx];
      if (!matches(e, candidate)) continue;
      if (
        matched === null ||
        e.specificity > matched.specificity ||
        (e.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = e;
        matchedPosition = idx;
      }
    }
    if (matched === null) continue;
    if (matched.q <= 0) continue; // explicit rejection

    // Highest q wins; ties broken by client order.
    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestQ = matched.q;
      bestPosition = matchedPosition;
      bestType = candidate;
    }
  }

  return bestType;
}

// Adds Accept to Vary without duplicating it or clobbering existing tokens.
export function appendVaryAccept(headers) {
  const existing = headers.get('vary');
  if (!existing) {
    headers.set('Vary', 'Accept');
    return;
  }
  const tokens = existing.split(',').map((s) => s.trim().toLowerCase());
  if (!tokens.includes('accept')) {
    headers.set('Vary', `${existing}, Accept`);
  }
}

// /            -> /index.md
// /training    -> /training/index.md
// /training/   -> /training/index.md
export function markdownPath(pathname) {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (clean === '/') return '/index.md';
  return `${clean}/index.md`;
}

function normalisePagePath(pathname) {
  if (!pathname) return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function isMarkdownPage(pathname) {
  return MARKDOWN_PAGES.includes(normalisePagePath(pathname));
}

// Body for a Markdown 404 (requested with Accept: text/markdown, path unknown).
// The request path is echoed without a trailing /index.htm(l): local
// `netlify serve` hands the edge function e.g. /missing/index.htm for /missing.
export function notFoundMarkdown(pathname) {
  const shown = pathname.replace(/\/index\.html?$/, '') || '/';
  const pages = MARKDOWN_PAGES.map((p) => `- ${SITE_ORIGIN}${p}`).join('\n');
  return [
    '# Page not found',
    '',
    `There is no page at \`${shown}\` on ${SITE_ORIGIN}.`,
    '',
    'Pages on this site:',
    '',
    pages,
    '',
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    '',
    `Site guide for agents: ${SITE_ORIGIN}/llms.txt`,
    '',
  ].join('\n');
}

// Plain-text 406 body listing what is available (RFC 9110 §15.5.7).
export function notAcceptableText(accept, reason) {
  return [
    'Not Acceptable',
    '',
    ...(reason ? [reason, ''] : []),
    'This resource is available in:',
    '- text/html',
    '- text/markdown',
    '',
    `You requested: ${accept}`,
    '',
  ].join('\n');
}
