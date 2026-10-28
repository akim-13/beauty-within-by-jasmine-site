import Link from 'next/link';
import Nav from '@/components/Nav';
import { ArrowRight } from '@/components/icons';

// Branded 404. Exported to out/404.html, which Netlify serves (status 404) for
// unknown paths. Requests with `Accept: text/markdown` get a Markdown 404 from
// the negotiate edge function instead.
export const metadata = {
  title: 'Page not found | Beauty Within by Jasmine',
  robots: { index: false },
  // Drop the layout's canonical ('/'): a 404 should not declare one.
  alternates: {},
};

export default function NotFound() {
  return (
    <main id="top" className="page-sub">
      <Nav />
      <section className="section" style={{ paddingTop: 'clamp(130px, 16vw, 190px)' }}>
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow center">404</span>
            <h1 className="section-title">Page not found</h1>
            <p className="lead">The page you were looking for does not exist or has moved.</p>
            <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 32 }}>
              <Link className="btn btn-gold" href="/">Back to the homepage <ArrowRight /></Link>
              <Link className="btn btn-ghost" href="/training/">Training Academy</Link>
              <Link className="btn btn-ghost" href="/treatments/">Treatments</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
