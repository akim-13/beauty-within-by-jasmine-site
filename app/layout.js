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
  // Keyword map (seo/keyword-map.md): brand-first umbrella — offering incl. the
  // flagship training + geo. Per-page titles carry the transactional terms.
  title: 'Beauty Within by Jasmine | Luxury Semi-Permanent Makeup & PMU Training | Crowthorne, Berkshire',
  description:
    'Luxury semi-permanent makeup tailored to you. Microblading, lip blush, combination brows and lash treatments by Jasmine Crean, with over 15 years of experience. Accredited 1:1 PMU training in Crowthorne, Berkshire.',
  metadataBase: new URL('https://www.beautywithinbyj.com'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Beauty Within by Jasmine',
    description: 'Luxury semi-permanent makeup tailored to you. Crowthorne, Berkshire.',
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
