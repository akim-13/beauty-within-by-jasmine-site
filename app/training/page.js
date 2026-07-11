import Image from 'next/image';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Reveal from '@/components/Reveal';
import { ArrowRight, Award, Check, GradCap, Clock, Heart } from '@/components/icons';

/*
  ===========================================================================
  TRAINING — flagship page  (PRIORITY: the £2.5k course is the goal)
  ---------------------------------------------------------------------------
  Price is intentionally NOT shown — inquiry-first / soft sell. Copy is
  outcome-led (what the skill gives the student). Earnings figures are
  ILLUSTRATIVE ONLY and carry an explicit "not a guarantee" disclaimer —
  keep it that way (UK ASA/CAP). Course detail is distilled, never a verbatim
  timetable. See ../../../../beauty-within-by-jasmine/brain/decisions.md.
  ===========================================================================
*/

export const metadata = {
  // Keyword map (seo/keyword-map.md): "microblading course Berkshire" is the
  // under-served head term — geo lives in the first title segment; "beginner"
  // and "3-day" match the searcher format-phrases.
  title: 'Microblading Course in Berkshire | 1:1 ABT-Accredited Beginner Training | Beauty Within by Jasmine',
  description:
    'Train to become a microblading artist with Jasmine Crean. A fully ABT-accredited, one-to-one 3-day beginner microblading course in Crowthorne, Berkshire — no experience required, full professional kit, live model, insurable certificate and flexible finance. Enquire today.',
  alternates: { canonical: '/training/' },
  openGraph: {
    title: 'Become a Microblading Artist | 1:1 Accredited Training',
    description: 'Accredited 1:1 microblading training in Berkshire with Jasmine Crean. Enquire for full course details.',
    type: 'website',
    url: '/training/',
    images: ['/images/training-kit.webp'],
  },
};

const INCLUDES = [
  '1:1 Intensive Training', 'No Experience Required', 'Fully ABT Accredited',
  'Signature Microblading Technique', 'Live Model Experience', 'Anatomy & Physiology',
  'Skin, Colour & Pigment Theory', 'Consultation & Aftercare', 'Full Professional Kit Included',
  'Flexible Finance Available', '8–10 Case Studies', 'Insurable Certificate',
];

const WHY = [
  { icon: GradCap, t: 'Learn from a working artist & educator', d: 'Over 15 years in the industry and a decade running her own studio — you learn a technique proven on real, paying clients, not just theory.' },
  { icon: Heart, t: 'Genuinely one-to-one', d: 'Just you and Jasmine. No crowded classroom and no sharing a model — every minute of the three days is yours.' },
  { icon: Award, t: 'Accredited & insurable', d: 'Fully ABT accredited with an insurable certificate on completion, so you can get insured and start working straight away.' },
  { icon: Clock, t: 'Support beyond the course', d: 'Her support does not end when your training days do — she guides you through your case studies and beyond.' },
];

// Outcome-led benefits — what the skill gives them (the reason to train at all).
const BENEFITS = [
  { t: 'Become your own boss', d: 'Build a business that belongs to you, shaped around your own standards and ambitions rather than someone else’s.' },
  { t: 'Set your own hours', d: 'Work around the school run, another job, or simply the life you want — your diary, your decisions.' },
  { t: 'Work from anywhere', d: 'Practise from a home studio, rent a salon chair, or travel to clients — this skill moves with you.' },
  { t: 'A skill in real demand', d: 'Beautiful, natural-looking brows are consistently sought after, and skilled artists can charge accordingly for their time.' },
  { t: 'Change how clients feel', d: 'There is deep satisfaction in watching someone see their new brows for the first time — you become part of their confidence.' },
  { t: 'A modest start-up cost', d: 'With your full professional kit included and little equipment needed beyond it, launching your business does not require a large outlay.' },
];

// Illustrative earnings — ~£275 per treatment; weekly ×4 monthly, ×48 yearly.
// FRAMED AS ILLUSTRATIVE ONLY (see disclaimer in the JSX) — never a guarantee.
const INCOME = [
  { n: 2, w: '£550', m: '£2,200', y: '£26,400' },
  { n: 3, w: '£825', m: '£3,300', y: '£39,600' },
  { n: 4, w: '£1,100', m: '£4,400', y: '£52,800' },
  { n: 5, w: '£1,375', m: '£5,500', y: '£66,000' },
  { n: 6, w: '£1,650', m: '£6,600', y: '£79,200' },
  { n: 7, w: '£1,925', m: '£7,700', y: '£92,400' },
  { n: 8, w: '£2,200', m: '£8,800', y: '£105,600' },
];

// Phases (distilled from the course themes — NOT a fixed timetable).
const STAGES = [
  { n: '01', t: 'Foundations & compliance', d: 'You begin with the essentials of working safely and professionally: health & safety, hygiene, insurance, local council requirements, anatomy & physiology and contraindications.' },
  { n: '02', t: 'Skin & pigment theory', d: 'Understand the canvas you work on — skin theory, colour and pigment theory, and the Fitzpatrick scale — so every choice you make is informed, not guessed.' },
  { n: '03', t: 'Technique & brow mapping', d: 'Learn Jasmine’s signature microblading technique alongside brow mapping, blade selection, workstation set-up and troubleshooting.' },
  { n: '04', t: 'Hands-on practice', d: 'You refine your strokes on latex and practice materials until they feel natural — building genuine confidence before you ever work on skin.' },
  { n: '05', t: 'Supervised live models', d: 'With Jasmine beside you throughout, you perform microblading on real models — one-to-one guidance at the moment it matters most.' },
  { n: '06', t: 'Business building & certification', d: 'You learn how to launch and grow your business, including social media, then complete 8–10 case studies with Jasmine’s ongoing support — earning your ABT-accredited, insurable certificate.' },
];

const FAQ = [
  { q: 'Do I need any experience?', a: 'No. The 3-Day Beginner Microblading Course is designed for complete beginners and takes you from the foundations through to working on a live model.' },
  { q: 'Is the course accredited?', a: 'Yes — it is fully ABT accredited, and you receive an insurable certificate on completion, so you can get insured and start taking clients.' },
  { q: 'How much does the course cost?', a: 'Pricing is discussed during a quick, no-obligation chat so it can be tailored to you, and flexible finance is available. Get in touch and Jasmine will talk you through everything.' },
  { q: 'What could I earn as a microblading artist?', a: 'That is entirely up to you — you set your own prices and choose how much you work. As an illustration, Jasmine charges around £275 per microblading treatment, so even a small number of weekly clients can build into a worthwhile income. These examples are illustrative only and not a guarantee: your earnings depend on your rates, your hours and how you grow your business — which is exactly what the business-building part of the course helps you plan.' },
  { q: 'What can I do once I’m qualified?', a: 'Your certificate is ABT-accredited and insurable, so you can start taking paying clients — from home, in a salon, or mobile — as soon as you are certified and insured. The course includes business-building and social media guidance, your full professional kit is included, flexible finance is available, and Jasmine’s mentorship continues well beyond the training days.' },
  { q: 'Is everything provided?', a: 'Yes. A full professional kit is included along with all of your training materials — you leave ready to work.' },
  { q: 'Will I practise on a real person?', a: 'Yes. The course includes live model experience, performed under Jasmine’s one-to-one guidance.' },
  { q: 'What happens after the three days?', a: 'You complete 8–10 case studies with Jasmine’s ongoing support before certification, and her guidance continues well beyond that.' },
  { q: 'Where is the training held?', a: 'At Jasmine’s studio in Crowthorne, Berkshire.' },
  { q: 'How many people are on each course?', a: 'Just you. All training is genuinely one-to-one.' },
];

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  url: 'https://www.beautywithinbyj.com/training/',
  name: '3-Day Beginner Microblading Course',
  description:
    'A fully ABT-accredited, one-to-one beginner microblading course in Crowthorne, Berkshire. No experience required. Includes a full professional kit, live model experience, 8–10 case studies and an insurable certificate.',
  provider: {
    '@type': 'Organization',
    '@id': 'https://www.beautywithinbyj.com/#business',
    name: 'Beauty Within by Jasmine',
    url: 'https://www.beautywithinbyj.com/',
    areaServed: 'GB',
  },
  educationalCredentialAwarded: 'ABT-accredited, insurable certificate',
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'Onsite',
    location: { '@type': 'Place', name: 'Crowthorne, Berkshire, UK' },
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function Training() {
  return (
    <main id="top" className="page-sub">
      <Nav />

      {/* JSON-LD: Course + FAQ for rich results */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ---------------- HERO ---------------- */}
      <section className="section" style={{ paddingTop: 'clamp(130px, 16vw, 190px)' }}>
        <div className="container">
          <div className="page-hero">
            <div className="section-head">
              <Reveal as="div"><span className="eyebrow">Beauty Within Training Academy</span></Reveal>
              <Reveal as="h1" className="section-title" delay={0.06}>
                Train to become a <em>microblading artist</em>
              </Reveal>
              <Reveal as="p" className="lead" delay={0.12}>
                Imagine working for yourself — setting your own hours, choosing where you work, and
                building a career around a skill clients genuinely value. This fully ABT-accredited
                microblading course is taught entirely one-to-one in Crowthorne, Berkshire, and
                complete beginners are warmly welcome.
              </Reveal>
              <Reveal delay={0.18} className="hero-actions" style={{ marginTop: 28 }}>
                <Link className="btn btn-gold" href="/#contact">Enquire About the Course <ArrowRight /></Link>
                <Link className="btn btn-ghost" href="/treatments/">Looking for a treatment?</Link>
              </Reveal>
            </div>
            <Reveal className="page-hero-media" delay={0.12}>
              <Image src="/images/training-kit.webp" alt="Jasmine teaching a one-to-one microblading training session"
                fill sizes="(max-width: 1024px) 100vw, 45vw" style={{ objectFit: 'cover' }} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- OUTCOMES: WHERE IT CAN TAKE YOU ---------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <Reveal as="div"><span className="eyebrow center">Where it can take you</span></Reveal>
            <Reveal as="h2" className="section-title" delay={0.06}>One skill. A <em>different working life</em>.</Reveal>
            <Reveal as="p" className="lead" delay={0.12}>
              Microblading is more than a technique — it is a foundation for the kind of career many
              people quietly wish they had.
            </Reveal>
          </div>
          <div className="services-grid">
            {BENEFITS.map((b, i) => (
              <Reveal className="service-card" key={b.t} delay={(i % 2) * 0.08} style={{ display: 'block', padding: '28px 26px' }}>
                <h3>{b.t}</h3>
                <p style={{ marginTop: 10, color: 'var(--muted)' }}>{b.d}</p>
              </Reveal>
            ))}
          </div>

          {/* Illustrative earning potential — figures clearly framed as illustrative, never a guarantee. */}
          <div className="income-block">
            <Reveal as="p" className="income-intro">
              As a guide, Jasmine charges around £275 per microblading treatment — so even a handful of
              clients a week can add up to a meaningful income. Once qualified, you set your own rates
              and your own pace, whether that means a few appointments around family life or a full diary.
            </Reveal>
            <Reveal className="income-table-wrap" delay={0.06}>
              <table className="income-table">
                <caption className="income-caption">Illustrative earning potential at ~£275 per treatment</caption>
                <thead>
                  <tr>
                    <th scope="col">Treatments / week</th>
                    <th scope="col">Weekly</th>
                    <th scope="col">Monthly</th>
                    <th scope="col">Yearly</th>
                  </tr>
                </thead>
                <tbody>
                  {INCOME.map((r) => (
                    <tr key={r.n}>
                      <td>{r.n}</td><td>{r.w}</td><td>{r.m}</td><td>{r.y}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
            <Reveal as="p" className="income-note" delay={0.1}>
              These figures are illustrative examples only, not a guarantee of income — what you earn
              will depend on your own rates, hours and circumstances.
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- WHY TRAIN HERE ---------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <Reveal as="div"><span className="eyebrow center">Why train with Jasmine</span></Reveal>
            <Reveal as="h2" className="section-title" delay={0.06}>Simple. Luxury. Personal.</Reveal>
          </div>
          <div className="services-grid">
            {WHY.map((w, i) => (
              <Reveal className="service-card" key={w.t} delay={(i % 2) * 0.08} style={{ display: 'block', padding: '28px 26px' }}>
                <span className="path-icon"><w.icon /></span>
                <h3 style={{ marginTop: 16 }}>{w.t}</h3>
                <p style={{ marginTop: 10, color: 'var(--muted)' }}>{w.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- THE COURSE ---------------- */}
      <section className="section" id="course">
        <div className="container">
          <div className="training-grid">
            <Reveal className="course-card">
              <span className="badge"><Award style={{ width: 14, height: 14 }} /> ABT Accredited</span>
              <h3>3-Day Beginner Microblading Course</h3>
              <p>
                An intensive 1:1 course that gives complete beginners the knowledge, hands-on practice
                and ongoing support to build strong foundations and lasting confidence in Jasmine&rsquo;s
                signature technique.
              </p>
              <ul className="includes">
                {INCLUDES.map((item) => (
                  <li key={item}><Check /> {item}</li>
                ))}
              </ul>
              <Link className="btn btn-gold" href="/#contact">Enquire About the Course <ArrowRight /></Link>
            </Reveal>
            <Reveal className="training-media" delay={0.1}>
              <div className="img-frame">
                <Image src="/images/training-paty.webp" alt="One-to-one microblading training session"
                  width={700} height={933} sizes="30vw"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="img-frame">
                <Image src="/images/training-manuals.webp" alt="Accredited microblading course materials and manuals"
                  width={700} height={933} sizes="30vw"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- WHAT YOU'LL COVER ---------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <Reveal as="div"><span className="eyebrow">What you’ll cover</span></Reveal>
            <Reveal as="h2" className="section-title" delay={0.06}>Three days, then a lifetime of support</Reveal>
            <Reveal as="p" className="lead" delay={0.12}>
              Across the three days you move from theory to practice to performing on a live model —
              then continue with case studies and Jasmine&rsquo;s ongoing mentorship.
            </Reveal>
          </div>
          <div className="services-grid">
            {STAGES.map((s, i) => (
              <Reveal className="service-card" key={s.n} delay={(i % 2) * 0.08} style={{ display: 'block', padding: '26px' }}>
                <span className="service-num">{s.n}</span>
                <h3 style={{ marginTop: 10 }}>{s.t}</h3>
                <p style={{ marginTop: 10, color: 'var(--muted)' }}>{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- ACCREDITATION / WHAT YOU CAN DO AFTER ---------------- */}
      <section className="section">
        <div className="container">
          <div className="intro-grid">
            <Reveal className="intro-figure">
              <div className="img-frame">
                <Image src="/images/training-certificate.webp"
                  alt="The ABT-accredited Beauty Within by Jasmine microblading course certificate"
                  fill sizes="(max-width: 1024px) 100vw, 40vw" style={{ objectFit: 'cover' }} />
              </div>
              <div className="img-frame small">
                <Image src="/images/training-result.webp"
                  alt="A model admiring her finished brows in the mirror after a Beauty Within training session"
                  fill sizes="(max-width: 1024px) 40vw, 18vw" style={{ objectFit: 'cover' }} />
              </div>
            </Reveal>
            <div className="intro-body">
              <Reveal as="div"><span className="eyebrow">Accredited &amp; insurable</span></Reveal>
              <Reveal as="h2" className="section-title" delay={0.06}>
                Finish ready to <em>work</em>
              </Reveal>
              <Reveal as="p" delay={0.12}>
                The course is fully ABT (Association of Beauty Therapists) accredited and leads to an
                insurable certificate — so once your case studies are complete, you can get insured and
                start taking your own paying clients.
              </Reveal>
              <Reveal as="p" delay={0.18}>
                Flexible finance is available to help you spread the cost, and Jasmine&rsquo;s mentorship
                continues long after your training days, so you are never left on your own as you start out.
              </Reveal>
              <Reveal delay={0.24} style={{ marginTop: 24 }}>
                <Link className="btn btn-gold" href="/#contact">Ask About Finance &amp; Dates <ArrowRight /></Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- LASH ADD-ON ---------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head center">
            <Reveal as="div"><span className="eyebrow center">Also available</span></Reveal>
            <Reveal as="h2" className="section-title" delay={0.06}>1:1 Lash Lift &amp; Tint Training</Reveal>
            <Reveal as="p" className="lead" delay={0.12}>
              A separate one-to-one course for those wanting to add lash treatments to their offering.
              Enquire directly for full details.
            </Reveal>
            <Reveal delay={0.18} style={{ marginTop: 24 }}>
              <Link className="btn btn-dark" href="/#contact">Enquire About Lash Training <ArrowRight /></Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="section" id="faq">
        <div className="container">
          <div className="section-head">
            <Reveal as="div"><span className="eyebrow">FAQ</span></Reveal>
            <Reveal as="h2" className="section-title" delay={0.06}>Common questions</Reveal>
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

      {/* ---------------- ENQUIRY CTA ---------------- */}
      <section className="section" id="enquire">
        <div className="container">
          <div className="section-head center">
            <Reveal as="h2" className="section-title">Ready to start your microblading career?</Reveal>
            <Reveal as="p" className="lead" delay={0.06}>
              Places are 1:1, so dates are limited. Enquire to arrange an informal chat, get the full
              course details and talk through finance options — no pressure, no obligation.
            </Reveal>
            <Reveal delay={0.12} style={{ marginTop: 24 }}>
              <Link className="btn btn-gold" href="/#contact">Enquire About the Course <ArrowRight /></Link>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
