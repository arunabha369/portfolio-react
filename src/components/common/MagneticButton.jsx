import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

export const solidButtonClass = 'focus-visible:ring-ring/50 bg-foreground text-background inline-flex items-center justify-center gap-[5px] overflow-hidden rounded-md border border-transparent px-2.5 py-1.5 text-xs leading-4 font-medium whitespace-nowrap outline-none transition-opacity hover:opacity-90 focus-visible:ring-[3px]';

const PULL = 0.28;
const REACH = 42;
const STIFFNESS = 105;
const DAMPING = 13.5;
const INSET = 2;

// Only the label leans toward the pointer; the button's hit area never moves. Mouse only, off under reduced motion.
export default function MagneticButton({ href, label, icon, external = true, className }) {
  const buttonRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    const content = contentRef.current;
    if (!button || !content) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let last = performance.now();
    let x = 0, y = 0, vx = 0, vy = 0, targetX = 0, targetY = 0;

    const step = now => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;
      const damp = Math.exp(-DAMPING * dt);
      vx = (vx + (targetX - x) * STIFFNESS * dt) * damp;
      vy = (vy + (targetY - y) * STIFFNESS * dt) * damp;
      x += vx * dt;
      y += vy * dt;
      content.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      const settled = Math.abs(targetX - x) < 0.02 && Math.abs(targetY - y) < 0.02 && Math.abs(vx) < 0.02 && Math.abs(vy) < 0.02;
      frame = settled ? 0 : requestAnimationFrame(step);
    };

    const start = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(step);
    };

    const home = () => {
      targetX = 0;
      targetY = 0;
      start();
    };

    const onMove = event => {
      if (event.pointerType !== 'mouse' || reduced.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        x = y = vx = vy = targetX = targetY = 0;
        content.style.transform = 'translate3d(0, 0, 0)';
        return;
      }
      const box = button.getBoundingClientRect();
      const inner = content.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      const distance = Math.hypot(dx, dy);
      const range = Math.max(box.width, box.height) + REACH;
      if (distance >= range) {
        home();
        return;
      }
      const limitX = Math.max(0, (box.width - inner.width) / 2 - INSET);
      const limitY = Math.max(0, (box.height - inner.height) / 2 - INSET);
      const strength = PULL * (1 - distance / range);
      targetX = Math.max(-limitX, Math.min(limitX, dx * strength));
      targetY = Math.max(-limitY, Math.min(limitY, dy * strength));
      start();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('blur', home);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', home);
    };
  }, []);

  return <a ref={buttonRef} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={cn(solidButtonClass, className)}>
    <span ref={contentRef} className="pointer-events-none inline-flex items-center gap-[5px]">
      {icon}
      {label}
    </span>
  </a>;
}
