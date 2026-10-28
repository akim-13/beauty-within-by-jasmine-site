// Markdown content negotiation at the edge (acceptmarkdown.com protocol).
// Declared in netlify.toml ([[edge_functions]] path "/*", static assets excluded).
//
//   Accept prefers text/markdown + page has a sibling -> serve <path>index.md (200)
//   Accept prefers text/markdown + unknown path       -> Markdown 404
//   Accept matches neither html nor markdown          -> 406 text/plain
//   otherwise (browsers, */*, no Accept)              -> HTML + Vary: Accept + Link
//
// Never throws: any unexpected error falls back to the normal static response.
import {
  preferredType,
  appendVaryAccept,
  markdownPath,
  isMarkdownPage,
  notFoundMarkdown,
  notAcceptableText,
} from '../../lib/negotiate.mjs';

const MD_TYPE = 'text/markdown; charset=utf-8';
const DESCRIBEDBY = '</llms.txt>; rel="describedby"';

function notAcceptable(accept, reason) {
  return new Response(notAcceptableText(accept, reason), {
    status: 406,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      Vary: 'Accept',
      'Cache-Control': 'no-store',
    },
  });
}

function withVary(res) {
  const out = new Response(res.body, res);
  appendVaryAccept(out.headers);
  return out;
}

function appendLink(headers, value) {
  const existing = headers.get('link');
  headers.set('Link', existing ? `${existing}, ${value}` : value);
}

async function handle(request, context) {
  const url = new URL(request.url);
  const accept = request.headers.get('accept');
  const chosen = preferredType(accept, ['text/html', 'text/markdown']);

  // Client rejected everything we produce.
  if (chosen === null && accept) return notAcceptable(accept);

  if (chosen === 'text/markdown') {
    if (isMarkdownPage(url.pathname)) {
      // Serve the static sibling through the request chain (same site, no
      // extra network hop). The sibling path is excluded from this function.
      const mdUrl = new URL(markdownPath(url.pathname), url);
      const mdRes = await context.next(new Request(mdUrl, request));
      if (mdRes.status === 200) {
        const res = new Response(mdRes.body, mdRes);
        res.headers.set('Content-Type', MD_TYPE);
        res.headers.set('Link', DESCRIBEDBY);
        appendVaryAccept(res.headers);
        return res;
      }
      // Sibling missing: fall through to HTML only if HTML is acceptable.
      if (!preferredType(accept, ['text/html'])) {
        return notAcceptable(accept, 'Markdown sibling missing and HTML is not acceptable.');
      }
      return withVary(await context.next());
    }

    const res = await context.next();
    if (res.status === 404) {
      return new Response(notFoundMarkdown(url.pathname), {
        status: 404,
        headers: { 'Content-Type': MD_TYPE, Vary: 'Accept', Link: DESCRIBEDBY },
      });
    }
    if (!preferredType(accept, ['text/html'])) {
      return notAcceptable(accept, 'No Markdown version of this resource and HTML is not acceptable.');
    }
    return withVary(res);
  }

  // HTML (default): browsers, */*, missing Accept.
  const res = withVary(await context.next());
  if (res.status !== 404 && isMarkdownPage(url.pathname)) {
    appendLink(
      res.headers,
      `<${markdownPath(url.pathname)}>; rel="alternate"; type="text/markdown", ${DESCRIBEDBY}`,
    );
  }
  return res;
}

export default async function negotiate(request, context) {
  try {
    return await handle(request, context);
  } catch {
    return context.next();
  }
}
