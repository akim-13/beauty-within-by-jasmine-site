import { test } from 'node:test';
import assert from 'node:assert/strict';
import negotiate from '../netlify/edge-functions/negotiate.js';

const ORIGIN = 'https://www.beautywithinbyj.com';

// Fake Netlify context: next() serves canned static files by pathname, 404 otherwise.
const FILES = {
  '/': ['text/html; charset=UTF-8', '<html><body>home</body></html>'],
  '/index.md': ['text/markdown; charset=utf-8', '# Home\n\nMarkdown home page body.'],
  '/training/': ['text/html; charset=UTF-8', '<html><body>training</body></html>'],
  '/training/index.md': ['text/markdown; charset=utf-8', '# Training\n\nMarkdown training.'],
};
const NOT_FOUND_HTML = '<html><body>Page not found</body></html>';

function fakeContext(request) {
  return {
    async next(req) {
      const path = new URL((req ?? request).url).pathname;
      const file = FILES[path];
      if (!file) {
        return new Response(NOT_FOUND_HTML, { status: 404, headers: { 'Content-Type': 'text/html; charset=UTF-8' } });
      }
      return new Response(file[1], { status: 200, headers: { 'Content-Type': file[0] } });
    },
  };
}

async function call(path, accept) {
  const headers = accept === undefined ? {} : { Accept: accept };
  const request = new Request(ORIGIN + path, { headers });
  return negotiate(request, fakeContext(request));
}

const varyHasAccept = (res) =>
  (res.headers.get('vary') || '').split(',').map((s) => s.trim().toLowerCase()).includes('accept');

test('markdown page + Accept: text/markdown -> 200 markdown with Vary', async () => {
  const res = await call('/training/', 'text/markdown');
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'text/markdown; charset=utf-8');
  assert.ok(varyHasAccept(res));
  assert.match(res.headers.get('link'), /<\/llms\.txt>; rel="describedby"/);
  assert.match(await res.text(), /^# Training/);
});

test('markdown page + default browser Accept -> HTML with Vary and Link', async () => {
  const res = await call(
    '/training/',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  );
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html/);
  assert.ok(varyHasAccept(res));
  const link = res.headers.get('link');
  assert.match(link, /<\/training\/index\.md>; rel="alternate"; type="text\/markdown"/);
  assert.match(link, /<\/llms\.txt>; rel="describedby"/);
});

test('no Accept header -> HTML', async () => {
  const res = await call('/');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html/);
  assert.ok(varyHasAccept(res));
});

test('unknown path + Accept: text/markdown -> 404 markdown with links', async () => {
  const res = await call('/__probe-does-not-exist', 'text/markdown');
  assert.equal(res.status, 404);
  assert.equal(res.headers.get('content-type'), 'text/markdown; charset=utf-8');
  assert.ok(varyHasAccept(res));
  const body = await res.text();
  assert.ok(body.length >= 20, `body too short: ${body.length}`);
  assert.match(body, /^# Page not found/);
  assert.match(body, /__probe-does-not-exist/);
  for (const p of ['/', '/training/', '/treatments/', '/privacy/', '/sitemap.xml', '/llms.txt']) {
    assert.ok(body.includes(ORIGIN + p), `missing link ${p}`);
  }
});

test('unknown path + default Accept -> 404 HTML passed through with Vary', async () => {
  const res = await call('/__probe-does-not-exist');
  assert.equal(res.status, 404);
  assert.match(res.headers.get('content-type'), /text\/html/);
  assert.ok(varyHasAccept(res));
  assert.equal(res.headers.get('link'), null);
  assert.equal(await res.text(), NOT_FOUND_HTML);
});

test('Accept: application/pdf -> 406 plain text', async () => {
  const res = await call('/', 'application/pdf');
  assert.equal(res.status, 406);
  assert.equal(res.headers.get('content-type'), 'text/plain; charset=utf-8');
  assert.equal(res.headers.get('cache-control'), 'no-store');
  assert.ok(varyHasAccept(res));
  const body = await res.text();
  assert.match(body, /text\/html/);
  assert.match(body, /text\/markdown/);
  assert.match(body, /application\/pdf/);
});

test('Accept: text/markdown;q=0, text/html -> HTML', async () => {
  const res = await call('/', 'text/markdown;q=0, text/html');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/html/);
});

test('handler never throws: a failing next() first call falls back', async () => {
  let calls = 0;
  const request = new Request(ORIGIN + '/', { headers: { Accept: 'text/html' } });
  const res = await negotiate(request, {
    async next() {
      calls += 1;
      if (calls === 1) throw new Error('boom');
      return new Response('ok', { status: 200 });
    },
  });
  assert.equal(res.status, 200);
  assert.equal(await res.text(), 'ok');
});
