import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Subpath the site is served under. Defaults to the preview-aggregator slug for
// the Vercel pipeline (mironovwebdesign.com/beauty-within-by-j/); the standalone
// Netlify build sets NEXT_PUBLIC_BASE_PATH="" so the site serves at the root.
// Must stay in sync with image-loader.js, which reads the same var.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '/beauty-within-by-j';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  // Static HTML export so the site drops into the unified preview pipeline
  // (served as static files under mironovwebdesign.com/<slug>/). basePath makes
  // _next and next/image asset URLs resolve under that slug subpath.
  output: 'export',
  trailingSlash: true,
  basePath: BASE_PATH || undefined,
  images: {
    loader: 'custom',
    loaderFile: './image-loader.js',
  },
};

export default nextConfig;
