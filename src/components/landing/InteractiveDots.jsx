import { useEffect, useRef } from 'react';

const SPACING = 9;
const DOT_SIZE = 2;
const CURSOR_RADIUS = 120;
const CURSOR_FORCE = 52;
const RETURN_FORCE = 6.4;
const DAMPING = 0.85;
const RIPPLE_SPEED = 220;
const RIPPLE_WIDTH = 34;
const RIPPLE_LIFE = 1.7;
const RIPPLE_FORCE = 24;
const MAX_RIPPLES = 8;
const SPRITE_STEPS = 20;

// A dot grid the pointer pushes aside; each dot is a spring particle. Click sends a ripple.
// Drawn on canvas with pre-rendered sprites since per-dot arc() calls can't hold a frame budget at this density.
export default function InteractiveDots({ className }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const dots = [];
    const ripples = [];
    const pointer = { x: -9999, y: -9999, inside: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let visible = true;
    let sprites = [];

    const buildSprites = () => {
      const ink = document.documentElement.classList.contains('dark') ? [255, 255, 255] : [115, 115, 115];
      sprites = Array.from({ length: SPRITE_STEPS }, (_, step) => {
        const sprite = document.createElement('canvas');
        sprite.width = 32;
        sprite.height = 32;
        const sctx = sprite.getContext('2d');
        if (sctx) {
          const t = step / (SPRITE_STEPS - 1);
          sctx.beginPath();
          sctx.fillStyle = `rgba(${ink[0]}, ${ink[1]}, ${ink[2]}, ${0.3 + t * 0.7})`;
          sctx.arc(16, 16, 16, 0, Math.PI * 2);
          sctx.fill();
        }
        return sprite;
      });
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      dots.length = 0;
      const cols = Math.floor(width / SPACING);
      const rows = Math.floor(height / SPACING);
      const insetX = (width - (cols - 1) * SPACING) / 2;
      const insetY = (height - (rows - 1) * SPACING) / 2;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const ox = insetX + SPACING * col;
          const oy = insetY + SPACING * row;
          dots.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0, glow: 0 });
        }
      }
      buildSprites();
    };

    const tick = now => {
      frame = requestAnimationFrame(tick);
      if (!previous) previous = now;
      const dt = Math.min(0.05, Math.max(0, (now - previous) / 1000));
      previous = now;
      if (!visible || document.hidden || dt === 0) return;

      elapsed += dt;
      ctx.clearRect(0, 0, width, height);
      const glowLerp = 1 - Math.pow(DAMPING, 60 * dt);
      const damping = Math.pow(DAMPING, 60 * dt);

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        ripples[i].time += dt;
        if (ripples[i].time > RIPPLE_LIFE) ripples.splice(i, 1);
      }

      for (const dot of dots) {
        let fx = 0;
        let fy = 0;
        let glowTarget = 0;

        if (pointer.inside) {
          const dx = dot.ox - pointer.x;
          const dy = dot.oy - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < CURSOR_RADIUS * CURSOR_RADIUS) {
            const dist = Math.sqrt(distSq) || 1;
            const falloff = 1 - dist / CURSOR_RADIUS;
            const push = falloff * falloff * CURSOR_FORCE;
            fx += dx / dist * push;
            fy += dy / dist * push;
            glowTarget = falloff;
          }
        }

        for (const ripple of ripples) {
          const dx = dot.ox - ripple.x;
          const dy = dot.oy - ripple.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const offset = Math.abs(dist - RIPPLE_SPEED * ripple.time);
          if (offset < RIPPLE_WIDTH) {
            const strength = (1 - offset / RIPPLE_WIDTH) * (1 - ripple.time / RIPPLE_LIFE);
            glowTarget = Math.max(glowTarget, strength);
            fx += dx / dist * strength * RIPPLE_FORCE;
            fy += dy / dist * strength * RIPPLE_FORCE;
          }
        }

        fx += (dot.ox - dot.x) * RETURN_FORCE;
        fy += (dot.oy - dot.y) * RETURN_FORCE;
        dot.vx = (dot.vx + fx * dt) * damping;
        dot.vy = (dot.vy + fy * dt) * damping;
        dot.x += dot.vx * dt * 60;
        dot.y += dot.vy * dt * 60;
        dot.glow += (glowTarget - dot.glow) * glowLerp;

        const shimmer = (Math.sin(0.8 * elapsed + 0.015 * dot.ox + 0.02 * dot.oy) + 1) * 0.04;
        const brightness = Math.min(1, dot.glow + shimmer);
        ctx.globalAlpha = Math.min(1, 0.48 + shimmer + 0.5 * dot.glow);
        ctx.drawImage(sprites[Math.floor((SPRITE_STEPS - 1) * brightness)], dot.x - DOT_SIZE / 2, dot.y - DOT_SIZE / 2, DOT_SIZE, DOT_SIZE);
      }
      ctx.globalAlpha = 1;
    };

    const setPointer = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = clientX - rect.left;
      pointer.y = clientY - rect.top;
      pointer.inside = true;
    };
    const onMove = event => setPointer(event.clientX, event.clientY);
    const onDown = event => {
      setPointer(event.clientX, event.clientY);
      ripples.push({ x: pointer.x, y: pointer.y, time: 0 });
      if (ripples.length > MAX_RIPPLES) ripples.splice(0, ripples.length - MAX_RIPPLES);
    };
    const onLeave = () => {
      pointer.inside = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    build();
    const resizeWatcher = new ResizeObserver(build);
    resizeWatcher.observe(host);
    const viewWatcher = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    viewWatcher.observe(host);
    const themeWatcher = new MutationObserver(buildSprites);
    themeWatcher.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerdown', onDown);
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointercancel', onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeWatcher.disconnect();
      viewWatcher.disconnect();
      themeWatcher.disconnect();
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerdown', onDown);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointercancel', onLeave);
    };
  }, []);

  return <div ref={hostRef} className={className}>
    <canvas ref={canvasRef} aria-hidden className="block h-full w-full" />
  </div>;
}
