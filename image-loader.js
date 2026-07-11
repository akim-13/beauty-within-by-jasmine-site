// Static-export image loader. next/image does not apply `basePath` to image
// `src` values, so we prepend it here. Keeps every <Image> resolving under the
// site's slug subpath (mironovwebdesign.com/beauty-within-by-j/...). The subpath
// is env-driven (NEXT_PUBLIC_BASE_PATH, inlined at build) and must match
// next.config.mjs — empty for the standalone Netlify build (served at root).
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/beauty-within-by-j';

// On Netlify, route local images through the Image CDN so `width`/`quality`
// actually do something. Static export + a custom loader means next/image can't
// resize on its own, so previously every srcSet descriptor returned the SAME
// full-res URL (the responsive srcSet was a no-op — see the technical audit).
// `/.netlify/images` does on-the-fly resizing/format negotiation on static sites.
// Only active when NEXT_PUBLIC_IMAGE_CDN=netlify (set in netlify.toml); local dev
// and Vercel previews leave it unset and fall back to the plain basePath behaviour.
const USE_NETLIFY_CDN = process.env.NEXT_PUBLIC_IMAGE_CDN === 'netlify';

export default function imageLoader({ src, width, quality }) {
  // Absolute URLs pass through unchanged in every mode (as before).
  if (/^https?:\/\//.test(src)) return src;
  const path = `${BASE_PATH}${src.startsWith('/') ? '' : '/'}${src}`;
  if (USE_NETLIFY_CDN) {
    return `/.netlify/images?url=${encodeURIComponent(path)}&w=${width}&q=${quality ?? 75}`;
  }
  return path;
}
