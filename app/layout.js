import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  // Keyword map (seo/keyword-map.md): brand-first umbrella — training leads (the
  // commercial priority) ahead of treatments + geo. Per-page titles carry the
  // transactional terms.
  title: 'Beauty Within by Jasmine | PMU Training Academy & Luxury Semi-Permanent Makeup | Crowthorne, Berkshire',
  description:
    "ABT-accredited 1:1 microblading and PMU training in Crowthorne, Berkshire, from Jasmine Crean — 15+ years' experience. Plus luxury semi-permanent makeup treatments.",
  metadataBase: new URL('https://www.beautywithinbyj.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Beauty Within by Jasmine',
    description: '1:1 PMU training & luxury semi-permanent makeup. Crowthorne, Berkshire.',
    type: 'website',
    url: '/',
    siteName: 'Beauty Within by Jasmine',
    locale: 'en_GB',
    images: ['/images/featured-5495.webp'],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1C1611',
};

// GA4 is gated on NEXT_PUBLIC_GA_ID. Static export inlines env vars at build time,
// so when the id is set the tags are baked into the HTML, and when it is unset
// nothing renders at all (no empty tags shipped to production).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}');
                  document.addEventListener('click', function (e) {
                    var a = e.target.closest && e.target.closest('a[href]');
                    if (!a) return;
                    var h = a.getAttribute('href');
                    if (!h) return;
                    if (h.indexOf('tel:') === 0) {
                      gtag('event', 'phone_call_click', { link_url: h });
                    } else if (h.indexOf('cal.com') !== -1) {
                      gtag('event', 'booking_click', { link_url: h });
                    }
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
