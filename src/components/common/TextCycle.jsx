import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

const MotionSpan = motion.span;

// Rolls through phrases like a reel: the outgoing line rides up as the next rides in.
export default function TextCycle({ items, holdMs = 2600, className = '' }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => setIndex(value => (value + 1) % items.length), holdMs);
    return () => window.clearInterval(id);
  }, [items.length, holdMs]);

  // An invisible copy of the longest phrase holds the width so nothing shifts mid-roll.
  const widest = items.reduce((longest, text) => text.length > longest.length ? text : longest, '');

  return <span className={className} aria-live="off">
    <span className="sr-only">{items.join(' · ')}</span>
    <span aria-hidden className="relative inline-block h-6 overflow-hidden align-bottom md:h-7">
      <span className="invisible block whitespace-nowrap">{widest}</span>
      <AnimatePresence initial={false}>
        <MotionSpan
          key={items[index]}
          className="absolute inset-0 flex items-center whitespace-nowrap"
          initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
          animate={reduceMotion ? { opacity: 1 } : { y: '0%' }}
          exit={reduceMotion ? { opacity: 0 } : { y: '-100%' }}
          transition={reduceMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 220, damping: 30, mass: 0.9 }}
        >
          {items[index]}
        </MotionSpan>
      </AnimatePresence>
    </span>
  </span>;
}
