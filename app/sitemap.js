// Static sitemap for the three public routes. Next emits this to /sitemap.xml at build.
// force-static is required to render a metadata route under `output: export`.
export const dynamic = 'force-static';

export default function sitemap() {
  const base = 'https://www.beautywithinbyj.com';
  const lastModified = new Date();
  return [
    { url: `${base}/`, lastModified },
    { url: `${base}/treatments/`, lastModified },
    { url: `${base}/training/`, lastModified },
  ];
}
