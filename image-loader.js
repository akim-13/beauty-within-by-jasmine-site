// Static-export image loader. next/image does not apply `basePath` to image
// `src` values, so we prepend it here. Keeps every <Image> resolving under the
// site's slug subpath (mironovwebdesign.com/beauty-within-by-j/...). The subpath
// is env-driven (NEXT_PUBLIC_BASE_PATH, inlined at build) and must match
// next.config.mjs — empty for the standalone Netlify build (served at root).
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/beauty-within-by-j';

export default function imageLoader({ src }) {
  if (/^https?:\/\//.test(src)) return src;
  return `${BASE_PATH}${src.startsWith('/') ? '' : '/'}${src}`;
}
