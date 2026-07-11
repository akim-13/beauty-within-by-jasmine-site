import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Reveal from '@/components/Reveal';
import { ArrowRight, Check } from '@/components/icons';
// Google rating + review count — single source of truth.
// Auto-updated by scripts/refresh-reviews.py (do not hand-edit if automation is on).
import reviews from '@/data/reviews.json';

/*
  ===========================================================================
  TREATMENTS  —  secondary offer, local-intent SEO
  ("microblading Crowthorne", "lip blush Berkshire", "semi-permanent makeup
  near me"). Booking stays inquiry-based via the homepage contact form.
  Copy drawn from Jasmine's existing site; TODO(jasmine) marks open items.
  ===========================================================================
*/

export const metadata = {
  title: 'Microblading, Lip Blush & Brow Treatments in Crowthorne, Berkshire | Beauty Within by Jasmine',
  description:
    'Natural, confidence-enhancing semi-permanent makeup in Crowthorne, Berkshire. Microblading, combination brows, lip blush and lash treatments by Jasmine Crean, tailored to you. Book a consultation.',
  alternates: { canonical: '/treatments/' },
  openGraph: {
    title: 'Semi-Permanent Makeup Treatments | Crowthorne, Berkshire',
    description: 'Microblading, lip blush, combination brows and lash treatments, tailored to you.',
    type: 'website',
    url: '/treatments/',
    images: ['/images/featured-5495.webp'],
  },
};

const SERVICES = [
  {
    n: '01', title: 'Microblading',
    img: '/images/treatment-microblading.webp', alt: 'Microblading brow result',
    desc: 'Delicate, natural-looking hair strokes that enhance brow shape, definition and fullness — ideal for soft, realistic brows with long-lasting results and less daily makeup.',
  },
  {
    n: '02', title: 'Combination Brows',
    img: '/images/combination-brows.webp', alt: 'Combination brows result',
    desc: 'Microblading blended with soft shading for fuller, more defined brows while keeping a natural, flattering finish — perfect for added density and beautifully balanced definition.',
  },
  {
    n: '03', title: 'Lip Blush',
    img: '/images/lip-blush-new.webp', alt: 'Lip blush semi-permanent makeup result',
    desc: 'Soft semi-permanent pigment that enhances the natural colour and shape of the lips, creating improved definition, balance and a fresh, healthy appearance with a subtle, natural finish.',
  },
  {
    n: '04', title: 'Lash Treatments',
    img: '/images/lash-new.webp', alt: 'Lash lift and tint result',
    desc: 'Professionally applied lash treatments that add lift, definition and confidence — from subtle and natural to a more glamorous finish, always protecting the health of your natural lashes.',
  },
];

const GALLERY = [
  { img: '/images/portfolio-use4.webp', cat: 'Microblading · Before', cls: 'tall' },
  { img: '/images/portfolio-micro2.webp', cat: 'Microblading · After', cls: 'tall' },
  { img: '/images/lip-blush-new.webp', cat: 'Lip Blush', cls: '' },
  { img: '/images/lash-new.webp', cat: 'Lash Lift', cls: '' },
  { img: '/images/treatment-tati.webp', cat: 'Client Result', cls: '' },
  { img: '/images/portfolio-use.webp', cat: 'Brows', cls: '' },
];

const WHY = [
  'A genuinely personal 1-1 service',
  'Over 15 years of experience',
  'Natural, tailored results',
  'A calm, relaxing studio setting',
];

const FAQ = [
  { q: 'Do I need a consultation first?', a: 'Yes — every treatment begins with a personalised consultation, so the result is designed around your features, colouring and the way you want to feel.' },
  { q: 'Will it look natural?', a: 'Absolutely. The focus is always on soft, balanced, natural-looking enhancement, tailored to you — never overdone.' },
  { q: 'How long do results last?', a: 'Semi-permanent makeup softens gradually over time and is designed to be refreshed periodically. Longevity varies with skin type and lifestyle, and Jasmine will advise you at your consultation.' },
  { q: 'How much do treatments cost and how do I book?', a: 'Treatment pricing is available on enquiry. Get in touch via the contact form, phone or Instagram and Jasmine will help you book.' },
];

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  '@id': 'https://www.beautywithinbyj.com/#business',
  url: 'https://www.beautywithinbyj.com/treatments/',
  name: 'Beauty Within by Jasmine',
  description: 'Semi-permanent makeup and microblading in Crowthorne, Berkshire.',
  telephone: '+447501838484',
  areaServed: 'Crowthorne, Berkshire',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "58 Duke's Ride",
    addressLocality: 'Crowthorne',
    addressRegion: 'Berkshire',
    postalCode: 'RG45 6NY',
    addressCountry: 'GB',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 51.3704133, longitude: -0.7997879 },
  aggregateRating: { '@type': 'AggregateRating', ratingValue: reviews.rating, reviewCount: String(reviews.count) },
  makesOffer: SERVICES.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title } })),
};

export default function Treatments() {
  return (
    <main id="top" className="page-sub">
      <Nav />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      {/* ---------------- HERO ---------------- */}
      <section className="section" style={{ paddingTop: 'clamp(130px, 16vw, 190px)' }}>
        <div className="container">
          <div className="page-hero">
            <div className="section-head">
              <Reveal as="div"><span className="eyebrow">Crowthorne · Berkshire</span></Reveal>
              <Reveal as="h1" className="section-title" delay={0.06}>
                Semi-permanent makeup, <em>tailored to you</em>
              </Reveal>
              <Reveal as="p" className="lead" delay={0.12}>
                Natural, confidence-enhancing microblading, lip blush, brows and lash treatments. Every
                treatment begins with a personalised consultation for the most flattering result.
              </Reveal>
              <Reveal delay={0.18} style={{ marginTop: 28 }}>
                <Link className="btn btn-dark" href="/#contact">Book a Consultation <ArrowRight /></Link>
              </Reveal>
            </div>
            <Reveal className="page-hero-media" delay={0.12}>
              <Image src="/images/featured-5495.webp" alt="A natural, confidence-enhancing semi-permanent makeup result by Jasmine Crean"
                fill sizes="(max-width: 1024px) 100vw, 45vw" style={{ objectFit: 'cover' }} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section className="section" id="treatments">
        <div className="container">
          {/* Visually-hidden section heading so the outline reads h1 -> h2 -> h3
              (the service cards below are h3). No visible change. */}
          <h2 className="sr-only">Our semi-permanent makeup treatments</h2>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <Reveal className="service-card" key={s.title} delay={(i % 2) * 0.08}>
                <div className="service-media">
                  <Image src={s.img} alt={s.alt} fill sizes="(max-width: 680px) 100vw, 400px" />
                </div>
                <div className="service-body">
                  <span className="service-num">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <Link className="service-link" href="/#contact">Book Now <ArrowRight /></Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WHY BEAUTY WITHIN ---------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <Reveal as="div"><span className="eyebrow center">Why Beauty Within</span></Reveal>
            <Reveal as="h2" className="section-title" delay={0.06}>Natural results, beautifully personal</Reveal>
          </div>
          <Reveal as="ul" className="why-list">
            {WHY.map((w) => (
              <li key={w}><Check /> {w}</li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------- RESULTS ---------------- */}
      <section className="section" id="portfolio">
        <div className="container">
          <div className="section-head">
            <Reveal as="div"><span className="eyebrow">Portfolio</span></Reveal>
            <Reveal as="h2" className="section-title" delay={0.06}>Real client <em>transformations</em></Reveal>
          </div>
          <div className="portfolio-grid">
            {GALLERY.map((g, i) => (
              <Reveal className={`pf ${g.cls}`} key={g.img} delay={(i % 4) * 0.06}>
                <Image src={g.img} alt={`${g.cat} — client result`} fill sizes="(max-width: 680px) 50vw, 25vw" />
                <span className="cap"><b>{g.cat}</b><span>Beauty Within</span></span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-head">
            <Reveal as="div"><span className="eyebrow">FAQ</span></Reveal>
            <Reveal as="h2" className="section-title" delay={0.06}>Good to know</Reveal>
          </div>
          <div className="faq-list">
            {FAQ.map((f, i) => (
              <Reveal as="details" className="faq-item" key={f.q} delay={(i % 3) * 0.05}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="section" id="enquire">
        <div className="container">
          <div className="section-head center">
            <Reveal as="h2" className="section-title">Ready to book?</Reveal>
            <Reveal as="p" className="lead" delay={0.06}>
              Get in touch to arrange your consultation. Thinking about training instead?{' '}
              <Link href="/training/" style={{ textDecoration: 'underline' }}>See the Training Academy</Link>.
            </Reveal>
            <Reveal delay={0.12} style={{ marginTop: 24 }}>
              <Link className="btn btn-dark" href="/#contact">Book a Consultation <ArrowRight /></Link>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
