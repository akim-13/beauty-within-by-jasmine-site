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
  title: 'Beauty Within by Jasmine | Luxury Semi-Permanent Makeup & Microblading, Crowthorne',
  description:
    'Luxury semi-permanent makeup tailored to you. Microblading, lip blush, combination brows and lash treatments by Jasmine Crean, with over 15 years of experience. Accredited 1:1 PMU training in Crowthorne, Berkshire.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Beauty Within by Jasmine',
    description: 'Luxury semi-permanent makeup tailored to you. Crowthorne, Berkshire.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1C1611',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.va = window.va || function () {
                (window.vaq = window.vaq || []).push(arguments);
              };
              if (new URLSearchParams(window.location.search).has("analytics-off")) {
                localStorage.setItem("va-disable", "1");
              }
              window.va("beforeSend", function (event) {
                if (localStorage.getItem("va-disable")) {
                  return null;
                }
                return event;
              });
            `,
          }}
        />
        <script defer src="/_vercel/insights/script.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
