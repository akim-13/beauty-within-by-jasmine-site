'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Phone, ArrowRight, Menu, X } from './icons';

// Animatable next/link so internal hrefs respect basePath while still
// playing the staggered mobile-menu reveal.
const MotionLink = motion.create(Link);

const LINKS = [
  ['Training', '/training/'],
  ['Treatments', '/treatments/'],
  ['Portfolio', '/#portfolio'],
  ['About', '/#about'],
  ['Reviews', '/#reviews'],
];

const EASE = [0.22, 1, 0.36, 1];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Container drives the staggered reveal of its children both in and out.
  const overlay = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: reduce
        ? { duration: 0.2 }
        : { duration: 0.45, ease: EASE, when: 'beforeChildren', delayChildren: 0.12, staggerChildren: 0.07 },
    },
    exit: {
      opacity: 0,
      transition: reduce
        ? { duration: 0.15 }
        : { duration: 0.3, ease: EASE, when: 'afterChildren', staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const item = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
        exit: { opacity: 0, y: 14, transition: { duration: 0.25, ease: EASE } },
      };

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <Link href="/" className="brand" aria-label="Beauty Within by Jasmine — home">
            <Image src="/images/logo.png" alt="Beauty Within by Jasmine" width={1168} height={520} className="brand-logo" priority />
          </Link>
          <nav className="nav-links" aria-label="Primary">
            {LINKS.map(([label, href]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </nav>
          <div className="nav-cta">
            <a className="nav-phone" href="tel:07501838484"><Phone /> 07501 838484</a>
            <Link className="btn btn-dark" href="/#contact" style={{ padding: '13px 22px' }}>
              Enquire <ArrowRight />
            </Link>
            <button
              className="nav-toggle"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? 'x' : 'menu'}
                  initial={{ opacity: 0, rotate: reduce ? 0 : -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: reduce ? 0 : 90 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  style={{ display: 'inline-flex' }}
                >
                  {open ? <X style={{ width: 26, height: 26 }} /> : <Menu style={{ width: 26, height: 26 }} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            onClick={() => setOpen(false)}
            variants={overlay}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {LINKS.map(([label, href]) => (
              <MotionLink key={href} href={href} variants={item} onClick={() => setOpen(false)}>
                {label}
              </MotionLink>
            ))}
            <MotionLink className="btn btn-dark" href="/#contact" variants={item} onClick={() => setOpen(false)}>
              Enquire <ArrowRight />
            </MotionLink>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
