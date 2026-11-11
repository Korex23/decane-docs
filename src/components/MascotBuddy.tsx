"use client";

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

// The same mascot as decane.app's. The Decane mascot rides down the right edge as you scroll: its height marks
// how far down the page you are, it leans and squashes with the speed of the
// scroll, its eyes follow the cursor, and it blinks now and then. A click
// takes you back to the top. With reduced motion it sits still in the corner.

const MAX_LOOK = 2.2; // how far the pupils travel, in SVG units

export default function MascotBuddy() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const [blink, setBlink] = useState(false);
  const [shown, setShown] = useState(false);

  // Height on the rail follows scroll progress, with a little lag.
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.6 });
  const top = useTransform(progress, (p) => `calc(16vh + ${p} * (70vh - 64px))`);

  // Lean into the scroll, squash a touch on fast flicks, settle when it stops.
  const velocity = useVelocity(scrollY);
  const lean = useSpring(useTransform(velocity, [-2500, 0, 2500], [14, 0, -14], { clamp: true }), { stiffness: 160, damping: 14 });
  const squash = useSpring(useTransform(velocity, [-3000, 0, 3000], [0.88, 1, 0.88], { clamp: true }), { stiffness: 200, damping: 12 });
  const stretch = useTransform(squash, (s) => 2 - s);

  // Eyes follow the pointer.
  const lookX = useMotionValue(0);
  const lookY = useMotionValue(0);
  const eyeX = useSpring(lookX, { stiffness: 220, damping: 20 });
  const eyeY = useSpring(lookY, { stiffness: 220, damping: 20 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 260);
      lookX.set((dx / d) * MAX_LOOK * k);
      lookY.set((dy / d) * MAX_LOOK * 0.8 * k);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce, lookX, lookY]);

  // A blink every few seconds, never on a fixed beat.
  useEffect(() => {
    if (reduce) return;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        loop();
      }, 2600 + Math.random() * 3200);
    };
    loop();
    return () => clearTimeout(t);
  }, [reduce]);

  // Arrives once the hero is behind you.
  useEffect(() => scrollY.on('change', (y) => setShown(y > 240)), [scrollY]);

  const toTop = () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });

  const face = (
    <svg viewBox="9 6 50 52" className="dn-buddy-svg" aria-hidden="true">
      <ellipse cx="34.5" cy="56" rx="15" ry="2.4" fill="black" opacity="0.12" />
      <path d="M32.8 10.3c.4-.6 1.3-.6 1.7 0l1.2 1.9c.4.7 0 1.5-.8 1.5h-2.5c-.8 0-1.3-.9-.8-1.5z" fill="#FFD700" />
      <path
        d="M16.6 20.9c8.9-12.6 30.5-8.7 34.9-.3 3.5 3.5 3.7 10.2 3.7 10.2s3.6 7.1 2.2 10.6C55.8 56.8 13.9 57 11.3 41.4c-1.4-4.3 2.1-10 2.1-10s-.4-4.1 3.2-10.5z"
        fill="#FFD700"
      />
      <ellipse cx="49" cy="39.3" rx="2.4" ry="1.9" transform="rotate(-22 49 39.3)" fill="#FFB800" opacity="0.45" />
      <ellipse cx="19" cy="39.3" rx="2.4" ry="1.9" transform="rotate(16 19 39.3)" fill="#FFB800" opacity="0.35" />
      <motion.g
        style={{ x: eyeX, y: eyeY, transformOrigin: '34px 33.6px', transformBox: 'view-box' }}
        animate={{ scaleY: blink ? 0.12 : 1 }}
        transition={{ duration: 0.08 }}
      >
        <ellipse cx="25.15" cy="33.64" rx="2.6" ry="3.6" fill="#1A1A1A" />
        <ellipse cx="43.6" cy="33.64" rx="2.6" ry="3.6" fill="#1A1A1A" />
        <circle cx="26" cy="32.2" r="0.85" fill="#fff" />
        <circle cx="44.45" cy="32.2" r="0.85" fill="#fff" />
      </motion.g>
      <path d="M26 41.7s2.1 4.7 8.8 4.7c6.2 0 8.5-4.7 8.5-4.7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );

  if (reduce) {
    return (
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        className="dn-buddy dn-buddy-still"
        style={{ opacity: shown ? 1 : 0, pointerEvents: shown ? 'auto' : 'none' }}
      >
        {face}
      </button>
    );
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      className="dn-buddy"
      style={{ top, rotate: lean, scaleY: squash, scaleX: stretch, transformOrigin: '50% 90%', pointerEvents: shown ? 'auto' : 'none' }}
      initial={false}
      animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : 40 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
    >
      {face}
      <span className="dn-buddy-tip">Back to top</span>
    </motion.button>
  );
}
