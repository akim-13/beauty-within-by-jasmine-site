import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { ArrowRight, GradCap, Heart } from '@/components/icons';

/*
  STRUCTURE STUB — the "two doors" fork.
  Sits high on the homepage so visitors self-select before the content blends:
    - Train  -> /training/  (the priority offer, listed first / visually led)
    - Treat  -> /treatments/
  Copy here is placeholder/draft — finalise during the content pass.
*/

const PATHS = [
  {
    href: '/training/',
    icon: GradCap,
    eyebrow: 'Train with me',
    title: 'Become a microblading artist',
    blurb:
      'Accredited 1:1 PMU training with a full professional kit, live model and ongoing support. No experience required.',
    cta: 'Explore the Academy',
    lead: true,
  },
  {
    href: '/treatments/',
    icon: Heart,
    eyebrow: 'Visit the studio',
    title: 'Book a treatment',
    blurb:
      'Natural, confidence-enhancing microblading, lip blush, brows and lash treatments, tailored to you in Crowthorne.',
    cta: 'View Treatments',
    lead: false,
  },
];

export default function PathFork() {
  return (
    <section className="section" id="paths">
      <div className="container">
        {/* Visually-hidden section heading so the outline reads h1 -> h2 -> h3
            (the path cards below are h3). No visible change. */}
        <h2 className="sr-only">Training and treatments — choose your path</h2>
        <div className="path-fork">
          {PATHS.map((p, i) => (
            <Reveal key={p.href} delay={i * 0.08}>
              <Link href={p.href} className={`path-card ${p.lead ? 'path-feature' : ''}`}>
                <span className="path-icon"><p.icon /></span>
                <span className="path-eyebrow">{p.eyebrow}</span>
                <h3 className="path-title">{p.title}</h3>
                <p className="path-blurb">{p.blurb}</p>
                <span className="path-cta">{p.cta} <ArrowRight /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
