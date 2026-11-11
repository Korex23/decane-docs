"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

// The same mascot as decane.app's. The Decane mascot zig-zags down the page: it perches on the right edge for
// one section and the left edge for the next. Scroll into a new section and it
// crouches, leaps across the page in an arc with a somersault (mouth open),
// lands with a squash and a bounce, and settles. Perched, it breathes, blinks
// and watches the cursor. A click goes back to the top. On narrow screens,
// where the margins are too thin to perch in, and with reduced motion, it sits
// still in the corner.

const MAX_LOOK = 2.2; // how far the pupils travel, in SVG units
const SIZE = 56;

/** The page's top-level sections: big blocks that are not inside another one. */
function findSections(): HTMLElement[] {
  const all = Array.from(document.querySelectorAll<HTMLElement>('header, section, footer')).filter((el) => el.offsetHeight > 280);
  return all.filter((el) => !all.some((other) => other !== el && other.contains(el)));
}

/** The perch for section i of n: alternating sides, stepping down the screen. */
function perch(i: number, n: number) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const top = h * 0.2;
  const bottom = h * 0.78 - SIZE;
  const y = n <= 1 ? top : top + ((bottom - top) * i) / (n - 1);
  const x = i % 2 === 0 ? w - SIZE - 20 : 20;
  return { x, y };
}

export default function MascotBuddy() {
  const reduceMotion = useReducedMotion();
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1099px)');
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const still = !!reduceMotion || narrow;
  const reduce = reduceMotion;
  const ref = useRef<HTMLButtonElement>(null);
  const [blink, setBlink] = useState(false);
  const [air, setAir] = useState(false);
  const [onLeft, setOnLeft] = useState(false);

  // Body: position and the squash-and-stretch of each hop.
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const sx = useMotionValue(1);
  const sy = useMotionValue(1);
  const rot = useMotionValue(0);

  const hop = useRef({ index: -1, n: 0, run: 0 });

  // Eyes follow the pointer.
  const lookX = useMotionValue(0);
  const lookY = useMotionValue(0);
  const eyeX = useSpring(lookX, { stiffness: 220, damping: 20 });
  const eyeY = useSpring(lookY, { stiffness: 220, damping: 20 });

  const jumpTo = useCallback(
    async (index: number, n: number) => {
      const fromX = x.get();
      const fromY = y.get();
      const { x: toX, y: toY } = perch(index, n);
      const run = ++hop.current.run;
      const alive = () => hop.current.run === run;
      const across = Math.abs(toX - fromX);
      const dir = toX >= fromX ? 1 : -1;
      // The top of the arc stays below the nav bar.
      const apex = Math.max(76, Math.min(fromY, toY) - Math.min(160, 70 + across * 0.08));
      const flight = Math.min(0.95, 0.42 + across / 2600);

      // crouch
      await Promise.all([
        animate(sy, 0.76, { duration: 0.1, ease: 'easeOut' }),
        animate(sx, 1.2, { duration: 0.1, ease: 'easeOut' }),
      ]);
      if (!alive()) return;
      setAir(true);
      // across the page in one arc: x steadily, y up then down, a somersault on the way
      animate(sy, 1.14, { duration: flight * 0.25 });
      animate(sx, 0.9, { duration: flight * 0.25 });
      const flip = across > 200 ? dir * 360 : dir * 14;
      const goX = animate(x, toX, { duration: flight, ease: [0.45, 0.05, 0.55, 0.95] });
      const spin = animate(rot, flip, { duration: flight, ease: [0.4, 0, 0.6, 1] });
      await animate(y, apex, { duration: flight / 2, ease: [0.2, 0.7, 0.4, 1] });
      if (!alive()) return;
      animate(sy, 1.05, { duration: flight * 0.3 });
      animate(sx, 0.96, { duration: flight * 0.3 });
      await animate(y, toY, { duration: flight / 2, ease: [0.6, 0, 0.8, 0.4] });
      await Promise.all([goX, spin]);
      if (!alive()) return;
      rot.set(0);
      setAir(false);
      setOnLeft(index % 2 === 1);
      // land: squash, then wobble back to shape
      await Promise.all([
        animate(sy, 0.7, { duration: 0.07, ease: 'easeOut' }),
        animate(sx, 1.26, { duration: 0.07, ease: 'easeOut' }),
      ]);
      if (!alive()) return;
      animate(sy, 1, { type: 'spring', stiffness: 520, damping: 9 });
      animate(sx, 1, { type: 'spring', stiffness: 520, damping: 9 });
    },
    [x, y, sx, sy, rot],
  );

  // Watch which section you are in; hop when it changes.
  useEffect(() => {
    if (still) return;
    let sections = findSections();
    let frame = 0;
    const check = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      let i = 0;
      sections.forEach((s, k) => {
        if (s.getBoundingClientRect().top <= line) i = k;
      });
      const n = sections.length;
      if (hop.current.index === -1) {
        hop.current = { ...hop.current, index: i, n };
        const p = perch(i, n);
        x.set(p.x);
        y.set(p.y);
        setOnLeft(i % 2 === 1);
      } else if (i !== hop.current.index || n !== hop.current.n) {
        hop.current.index = i;
        hop.current.n = n;
        jumpTo(i, n);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const onResize = () => {
      sections = findSections();
      const p = perch(hop.current.index < 0 ? 0 : hop.current.index, sections.length);
      x.set(p.x);
      y.set(p.y);
      onScroll();
    };
    // Sections can mount late (client pieces), so look again shortly.
    const late = setTimeout(onResize, 800);
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(late);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [still, jumpTo, x, y]);

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

  const toTop = () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });

  const face = (
    <svg viewBox="9 6 50 52" className="dn-buddy-svg" aria-hidden="true">
      <path d="M32.8 10.3c.4-.6 1.3-.6 1.7 0l1.2 1.9c.4.7 0 1.5-.8 1.5h-2.5c-.8 0-1.3-.9-.8-1.5z" fill="#FFD700" />
      <path
        d="M16.6 20.9c8.9-12.6 30.5-8.7 34.9-.3 3.5 3.5 3.7 10.2 3.7 10.2s3.6 7.1 2.2 10.6C55.8 56.8 13.9 57 11.3 41.4c-1.4-4.3 2.1-10 2.1-10s-.4-4.1 3.2-10.5z"
        fill="#FFD700"
      />
      <ellipse cx="49" cy="39.3" rx="2.4" ry="1.9" transform="rotate(-22 49 39.3)" fill="#FFB800" opacity={air ? 0.8 : 0.45} />
      <ellipse cx="19" cy="39.3" rx="2.4" ry="1.9" transform="rotate(16 19 39.3)" fill="#FFB800" opacity={air ? 0.7 : 0.35} />
      <motion.g
        style={{ x: eyeX, y: eyeY, transformOrigin: '34px 33.6px', transformBox: 'view-box' }}
        animate={{ scaleY: blink && !air ? 0.12 : 1, scale: air ? 1.15 : 1 }}
        transition={{ duration: 0.08 }}
      >
        <ellipse cx="25.15" cy="33.64" rx="2.6" ry="3.6" fill="#1A1A1A" />
        <ellipse cx="43.6" cy="33.64" rx="2.6" ry="3.6" fill="#1A1A1A" />
        <circle cx="26" cy="32.2" r="0.85" fill="#fff" />
        <circle cx="44.45" cy="32.2" r="0.85" fill="#fff" />
      </motion.g>
      {air ? (
        <ellipse cx="34.6" cy="44" rx="3.2" ry="3.4" fill="#1A1A1A" />
      ) : (
        <path d="M26 41.7s2.1 4.7 8.8 4.7c6.2 0 8.5-4.7 8.5-4.7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );

  if (still) {
    return (
      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        className="dn-buddy dn-buddy-still"
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
      className="dn-buddy dn-buddy-hop"
      style={{ y, x }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.6 }}
    >
      {/* shadow on the perch: shrinks while it is in the air */}
      <motion.span
        aria-hidden="true"
        className="dn-buddy-shadow"
        animate={{ scaleX: air ? 0.4 : 1, opacity: air ? 0.3 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className="dn-buddy-body"
        style={{ scaleX: sx, scaleY: sy, rotate: rot, transformOrigin: '50% 62%' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* idle breathing while perched */}
        <motion.span
          className="dn-buddy-body"
          style={{ transformOrigin: '50% 100%' }}
          animate={air ? { scaleY: 1, y: 0 } : { scaleY: [1, 1.04, 1], y: [0, -1.5, 0] }}
          transition={air ? { duration: 0.1 } : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {face}
        </motion.span>
      </motion.span>
      <span className={`dn-buddy-tip${onLeft ? " right" : ""}`}>Back to top</span>
    </motion.button>
  );
}
