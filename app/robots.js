// Emitted to /robots.txt at build — allow everything, point crawlers at the sitemap.
// force-static is required to render a metadata route under `output: export`.
export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.beautywithinbyj.com/sitemap.xml',
  };
}
