"use client";

import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React from 'react';

const variants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export function SectionTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <motion.section ref={ref as unknown as React.RefObject<HTMLElement>} variants={variants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.section>
  );
}
