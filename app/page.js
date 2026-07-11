import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/Nav';
import ContactForm from '@/components/ContactForm';
import PathFork from '@/components/PathFork';
import Reveal, { Stars } from '@/components/Reveal';
import {
  ArrowRight, Phone, Mail, MapPin, Star, Check, Sparkle, Award, GradCap, Instagram,
} from '@/components/icons';
// Google rating + review count — single source of truth.
// Auto-updated by scripts/refresh-reviews.py (do not hand-edit if automation is on).
import reviews from '@/data/reviews.json';

const INSTAGRAM_URL = 'https://www.instagram.com/beautywithinbyjasmine/';

const GMAPS_EMBED =
  'https://www.google.com/maps?q=Beauty+Within+by+Jasmine,+Crowthorne,+Berkshire&output=embed';
const GMAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=Beauty+Within+by+Jasmine+Crowthorne+Berkshire';

// Condensed for the homepage teaser — full descriptions live on /treatments/.
const SERVICES = [
  { n: '01', title: 'Microblading', img: '/images/treatment-microblading.webp', alt: 'Microblading brow result', short: 'Natural, hair-stroke brows with soft, realistic definition.' },
  { n: '02', title: 'Combination Brows', img: '/images/combination-brows.webp', alt: 'Combination brows result', short: 'Microblading plus soft shading for added density.' },
  { n: '03', title: 'Lip Blush', img: '/images/lip-blush-new.webp', alt: 'Lip blush semi-permanent makeup result', short: 'Soft pigment for naturally fuller, defined lips.' },
  { n: '04', title: 'Lash Treatments', img: '/images/lash-new.webp', alt: 'Lash lift and tint result', short: 'Lift, tint and definition for your natural lashes.' },
];

// Top six for the homepage teaser — the full twelve are on /training/.
const HOME_INCLUDES = [
  '1:1 Intensive Training', 'Fully ABT Accredited', 'No Experience Required',
  'Full Professional Kit Included', 'Insurable Certificate', 'Flexible Finance Available',
];

const GALLERY = [
  { img: '/images/portfolio-use4.webp', cat: 'Microblading · Before', cls: 'tall' },
  { img: '/images/portfolio-micro2.webp', cat: 'Microblading · After', cls: 'tall' },
  { img: '/images/lip-blush-new.webp', cat: 'Lip Blush', cls: '' },
  { img: '/images/lash-new.webp', cat: 'Lash Lift', cls: '' },
  { img: '/images/treatment-tati.webp', cat: 'Client Result', cls: '' },
  { img: '/images/portfolio-use.webp', cat: 'Brows', cls: '' },
];

const REVIEWS = [
  {
    text: 'I have been a client of Jasmine’s for around 8 years now and am always so impressed. I would not go to anyone else for microblading or lip blush — she always listens to exactly what I want and the results are always perfect. Lashes are always brilliant too. Highly recommend.',
  },
  {
    text: 'I can’t recommend Jasmine enough. I’ve been having my eyebrows microbladed by her for years and I’m absolutely delighted with them. She is so professional, warm and friendly, making you feel very comfortable. Her attention to detail is amazing.',
  },
  {
    text: 'Highly recommend Jasmine for microblading. So professional and made me feel totally at ease throughout. I love my new brows!',
  },
];

const STATS = [
  { n: '15+', l: 'Years of experience' },
  { n: reviews.rating, l: 'Average Google rating', em: true },
  { n: String(reviews.count), l: 'Google reviews' },
  { n: '1:1', l: 'Personal service' },
];

// Primary BeautySalon entity — shared @id with /treatments/ so Google merges them.
const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  '@id': 'https://www.beautywithinbyj.com/#business',
  url: 'https://www.beautywithinbyj.com/',
  name: 'Beauty Within by Jasmine',
  description:
    'Luxury semi-permanent makeup tailored to you. Microblading, lip blush, combination brows and lash treatments by Jasmine Crean, with over 15 years of experience. Accredited 1:1 PMU training in Crowthorne, Berkshire.',
  image: 'https://www.beautywithinbyj.com/images/featured-5495.webp',
  telephone: '+447501838484',
  email: 'jasmine.crean@mail.com',
  founder: { '@type': 'Person', name: 'Jasmine Crean' },
  address: { '@type': 'PostalAddress', addressLocality: 'Crowthorne', addressRegion: 'Berkshire', addressCountry: 'GB' },
  areaServed: ['Crowthorne', 'Sandhurst', 'Bracknell', 'Wokingham', 'Camberley', 'Berkshire'],
  sameAs: [INSTAGRAM_URL, 'https://www.facebook.com/beautywithinbyjasmine'],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: reviews.rating, reviewCount: String(reviews.count) },
};

export default function Home() {
  return (
    <main id="top">
      <Nav />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }} />

      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <div className="hero-copy">
          <Reveal as="div"><span className="eyebrow">Crowthorne · Berkshire</span></Reveal>
          <Reveal as="h1" delay={0.08}>
            Semi-permanent makeup,<br />and the <em>training to master it.</em>
          </Reveal>
          <Reveal as="p" className="hero-sub" delay={0.16}>
            Natural, confidence-enhancing microblading, lip blush, brows and lashes by Jasmine Crean —
            and an accredited 1:1 academy training the next generation of microblading artists, in
            Crowthorne, Berkshire.
          </Reveal>
          <Reveal className="hero-actions" delay={0.24}>
            <Link className="btn btn-gold" href="/training/">Explore the Academy <ArrowRight /></Link>
            <Link className="btn btn-ghost" href="/treatments/">Book a Treatment</Link>
          </Reveal>
          <Reveal className="hero-rating" delay={0.32}>
            <Stars />
            <span className="rt"><b>{reviews.rating}</b> rating · <b>{reviews.count}</b> Google reviews</span>
          </Reveal>
        </div>
        <div className="hero-media">
          <Image
            src="/images/jasmine-working.webp"
            alt="Jasmine performing a semi-permanent makeup treatment"
            fill priority sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="hero-badge">
            <span className="n">{reviews.count}</span>
            <span className="l">Five-star<br />Google reviews</span>
          </div>
        </div>
        <span className="scroll-cue">Scroll to explore</span>
      </section>

      {/* ---------------- TWO-DOOR FORK ---------------- */}
      <PathFork />

      {/* ---------------- MARQUEE ---------------- */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <span key={k} style={{ display: 'inline-flex' }}>
              <span>Microblading</span><span className="dot">·</span>
              <span>Lip Blush</span><span className="dot">·</span>
              <span>Combination Brows</span><span className="dot">·</span>
              <span>Lash Treatments</span><span className="dot">·</span>
              <span>Accredited Training</span><span className="dot">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ---------------- INTRO + STATS ---------------- */}
      <section className="section">
        <div className="container">
          <div className="intro-grid">
            <Reveal className="intro-figure">
              <div className="img-frame">
                <Image src="/images/featured-5495.webp" alt="Natural microbladed brows — a Beauty Within client result"
                  width={1290} height={1133} sizes="(max-width: 1024px) 90vw, 45vw"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="img-frame small">
                <Image src="/images/portfolio-before.webp" alt="Soft, natural brow enhancement result"
                  width={1200} height={1180} sizes="22vw"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
            <div className="intro-body">
              <Reveal as="div"><span className="eyebrow">The Beauty Within ethos</span></Reveal>
              <Reveal as="h2" className="section-title" delay={0.06}>
                Natural results that feel <em>effortlessly</em> like you.
              </Reveal>
              <Reveal as="p" delay={0.12}>
                Whether you are in the chair or learning the craft yourself, everything starts with a
                personalised, 1-1 approach — soft, balanced and beautifully natural, designed around the
                person in front of her.
              </Reveal>
              <Reveal as="p" delay={0.18}>
                It is a calm, welcoming space built on care, attention and the trust of clients and
                students alike — many of whom return year after year.
              </Reveal>
              <Reveal as="div" className="intro-sign" delay={0.24}>
                Jasmine Crean
                <small>Founder · PMU Artist & Educator</small>
              </Reveal>
            </div>
          </div>

          <Reveal className="stats">
            {STATS.map((s) => (
              <div className="stat" key={s.l}>
                <div className="n">{s.em ? <em>{s.n}</em> : s.n}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------- TRAINING TEASER (priority) ---------------- */}
      <section className="section" id="training">
        <div className="container">
          <div className="section-head">
            <Reveal as="div"><span className="eyebrow">Training Academy</span></Reveal>
            <Reveal as="h2" className="section-title" delay={0.06}>
              Begin your microblading <em>career</em>
            </Reveal>
            <Reveal as="p" className="lead" delay={0.12}>
              An accredited, 1:1 microblading course for complete beginners — designed to build real
              skill, confidence and strong foundations, with continued support every step of the way.
            </Reveal>
          </div>

          <div className="training-grid">
            <Reveal className="course-card">
              <span className="badge"><Award style={{ width: 14, height: 14 }} /> ABT Accredited</span>
              <h3>3-Day Beginner Microblading Course</h3>
              <p>
                One-to-one, beginner-friendly training in Jasmine&rsquo;s signature technique — with a
                full professional kit, live model experience and an insurable certificate on completion.
              </p>
              <ul className="includes">
                {HOME_INCLUDES.map((item) => (
                  <li key={item}><Check /> {item}</li>
                ))}
              </ul>
              <div className="hero-actions" style={{ marginTop: 4 }}>
                <Link className="btn btn-gold" href="/training/">Explore the Academy <ArrowRight /></Link>
                <a className="btn btn-ghost" href="#contact">Enquire</a>
              </div>
            </Reveal>
            <Reveal className="training-media" delay={0.1}>
              <div className="img-frame">
                <Image src="/images/training-paty.webp" alt="One-to-one microblading training session"
                  width={700} height={933} sizes="30vw"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="img-frame">
                <Image src="/images/training-manuals.webp" alt="Accredited microblading course materials"
                  width={700} height={933} sizes="30vw"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- TREATMENTS TEASER ---------------- */}
      <section className="section" id="treatments">
        <div className="container">
          <div className="section-head center">
            <Reveal as="div"><span className="eyebrow center">Signature Treatments</span></Reveal>
            <Reveal as="h2" className="section-title" delay={0.06}>
              Prefer to be in the chair?
            </Reveal>
            <Reveal as="p" className="lead" delay={0.12}>
              Professional semi-permanent makeup, tailored to you — every treatment begins with a
              personalised consultation for the most flattering result.
            </Reveal>
          </div>
          <div className="services-grid">
            {SERVICES.map((s, i) => (
              <Reveal className="service-card" key={s.title} delay={(i % 2) * 0.08}>
                <div className="service-media">
                  <Image src={s.img} alt={s.alt} fill sizes="(max-width: 680px) 100vw, 400px" />
                </div>
                <div className="service-body">
                  <span className="service-num">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.short}</p>
                  <Link className="service-link" href="/treatments/">Learn more <ArrowRight /></Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ textAlign: 'center', marginTop: 40 }}>
            <Link className="btn btn-dark" href="/treatments/">View All Treatments <ArrowRight /></Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------- PORTFOLIO ---------------- */}
      <section className="section" id="portfolio">
        <div className="container">
          <div className="section-head">
            <Reveal as="div"><span className="eyebrow">Portfolio</span></Reveal>
            <Reveal as="h2" className="section-title" delay={0.06}>
              Real client <em>transformations</em>
            </Reveal>
            <Reveal as="p" className="lead" delay={0.12}>
              Beautifully tailored results — natural, confidence-enhancing and designed around every
              individual client.
            </Reveal>
          </div>
          <div className="portfolio-grid">
            {GALLERY.map((g, i) => (
              <Reveal className={`pf ${g.cls}`} key={g.img} delay={(i % 4) * 0.06}>
                <Image src={g.img} alt={`${g.cat} — client result`} fill
                  sizes="(max-width: 680px) 50vw, 25vw" />
                <span className="cap"><b>{g.cat}</b><span>Beauty Within</span></span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- ABOUT ---------------- */}
      <section className="section" id="about">
        <div className="container">
          <div className="about-grid">
            <Reveal className="about-portrait">
              <div className="img-frame">
                <Image src="/images/jasmine-portrait.webp" alt="Jasmine Crean, founder of Beauty Within"
                  width={800} height={1066} sizes="(max-width: 1024px) 80vw, 40vw"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="tag">
                <b>Jasmine Crean</b>
                <span>Founder & Educator</span>
              </div>
            </Reveal>
            <div className="about-body">
              <Reveal as="div"><span className="eyebrow">Meet Jasmine</span></Reveal>
              <Reveal as="h2" className="section-title" delay={0.06}>
                Simple. <em>Luxury.</em> Personal.
              </Reveal>
              <Reveal as="p" delay={0.12}>
                With over 15 years in the beauty industry, Jasmine is passionate about enhancing
                natural beauty through luxury treatments, semi-permanent makeup and accredited training.
                After five years in salons, she launched Beauty Within by Jasmine at the age of 21 and
                has spent the last decade specialising in brows, lashes and semi-permanent makeup.
              </Reveal>
              <div className="creds">
                <Reveal className="cred" delay={0.06}>
                  <Award />
                  <div><b>15 Years Industry Experience</b><p>A strong, professional foundation as a PMU specialist and educator.</p></div>
                </Reveal>
                <Reveal className="cred" delay={0.12}>
                  <Sparkle />
                  <div><b>Advanced PMU Education</b><p>Multiple specialist courses with continual investment in professional development.</p></div>
                </Reveal>
                <Reveal className="cred" delay={0.18}>
                  <GradCap />
                  <div><b>Accredited Training & Mentorship</b><p>Teaching thoroughly, building confidence and supporting students every step of the way.</p></div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- REVIEWS ---------------- */}
      <section className="section" id="reviews">
        <div className="container">
          <div className="reviews-top">
            <div className="section-head" style={{ maxWidth: 460 }}>
              <span className="eyebrow">What clients say</span>
              <h2 className="section-title" style={{ marginTop: 18 }}>Loved by clients <em>year after year</em></h2>
            </div>
            <div className="rating-block">
              <div className="rating-score font-display">{reviews.rating}</div>
              <div className="rating-meta">
                <Stars />
                <p>Rated {reviews.rating} from {reviews.count} Google reviews</p>
                <a className="gmaps" href={GMAPS_LINK} target="_blank" rel="noopener noreferrer">
                  <MapPin /> Read all reviews on Google
                </a>
              </div>
            </div>
          </div>
          <div className="reviews-grid">
            {REVIEWS.map((r, i) => (
              <Reveal className="review-card" key={i} delay={i * 0.08}>
                <Stars />
                <p className="quote">&ldquo;{r.text}&rdquo;</p>
                <div className="who"><Star style={{ width: 14, height: 14, color: 'var(--gold)' }} /> Verified Google review</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CONTACT + MAP ---------------- */}
      <section className="section" id="contact">
        <div className="container">
          <div className="section-head center">
            <Reveal as="div"><span className="eyebrow center">Get in touch</span></Reveal>
            <Reveal as="h2" className="section-title" delay={0.06}>Enquire today</Reveal>
            <Reveal as="p" className="lead" delay={0.12}>
              Whether you are booking a treatment, enquiring about training or simply have a question,
              Jasmine would love to hear from you.
            </Reveal>
          </div>
          <div className="contact-grid">
            <Reveal className="contact-info">
              <div className="contact-detail">
                <Phone />
                <div><div className="k">Call or text</div><a className="v" href="tel:07501838484">07501 838484</a></div>
              </div>
              <div className="contact-detail">
                <Mail />
                <div><div className="k">Email</div><a className="v" href="mailto:jasmine.crean@mail.com">jasmine.crean@mail.com</a></div>
              </div>
              <div className="contact-detail">
                <MapPin />
                <div><div className="k">Studio location</div><div className="v">Crowthorne, Berkshire</div></div>
              </div>
              <div className="contact-detail">
                <Instagram />
                <div><div className="k">Instagram</div><a className="v" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">@beautywithinbyjasmine</a></div>
              </div>
              <div className="map-frame">
                <iframe
                  title="Beauty Within by Jasmine location in Crowthorne, Berkshire"
                  src={GMAPS_EMBED}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <div className="brand">
                <Image src="/images/logo-footer.png" alt="Beauty Within by Jasmine" width={1168} height={520} className="brand-logo brand-logo-footer" />
              </div>
              <p className="footer-blurb">
                Luxury semi-permanent makeup tailored to you — microblading, lip blush, brows and lash
                treatments, plus accredited 1:1 training in Crowthorne, Berkshire.
              </p>
              <div style={{ display: 'flex', gap: 14, marginTop: 24 }}>
                <a className="btn btn-light" href={GMAPS_LINK} target="_blank" rel="noopener noreferrer" style={{ padding: '12px 18px' }}>
                  <Star style={{ width: 14, height: 14 }} /> {reviews.rating} on Google
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Explore</h4>
              <Link href="/training/">Training Academy</Link>
              <Link href="/treatments/">Treatments</Link>
              <Link href="/#portfolio">Portfolio</Link>
              <Link href="/#about">About Jasmine</Link>
              <Link href="/#reviews">Reviews</Link>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href="tel:07501838484">07501 838484</a>
              <a href="mailto:jasmine.crean@mail.com">jasmine.crean@mail.com</a>
              <p>Crowthorne, Berkshire</p>
              <a href={GMAPS_LINK} target="_blank" rel="noopener noreferrer">View on Google Maps</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram @beautywithinbyjasmine</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {2026} Beauty Within by Jasmine. All rights reserved.</span>
            <span>Training &amp; treatment details available on enquiry.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
