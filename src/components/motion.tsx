"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

// Motion primitives for the site. One vocabulary: things enter by rising a
// little and fading in, siblings stagger, and nothing moves for people who
// asked for reduced motion.

const EASE = [0.22, 1, 0.36, 1] as const;

export const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const stagger = (delay = 0.08, start = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren: start } },
});

/** Fades and rises its children when they scroll into view, once. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "header";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/** A parent whose direct children (wrapped in <Item>) enter one after another. */
export function Stagger({
  children,
  className,
  delay = 0.08,
  start = 0,
  inView = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  start?: number;
  inView?: boolean;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={stagger(delay, start)}
      initial="hidden"
      {...(inView
        ? {
            whileInView: "show",
            viewport: { once: true, margin: "0px 0px -10% 0px" },
          }
        : { animate: "show" })}
    >
      {children}
    </motion.div>
  );
}

export function Item({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={rise}>
      {children}
    </motion.div>
  );
}
