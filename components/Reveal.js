'use client';
import { motion } from 'framer-motion';

export default function Reveal({ children, as = 'div', delay = 0, y = 26, className = '', ...rest }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export function Stars({ n = 5, className = '' }) {
  return (
    <span className={`stars ${className}`} aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="m12 2 2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.02 6.09 20.16l1.13-6.57L2.45 8.94l6.6-.96L12 2Z" />
        </svg>
      ))}
    </span>
  );
}
