"use client";

import Link from "next/link";
import { DecaneLogo } from "./DecaneLogo";
import type { Theme } from "@/lib/theme";

const FONT = "'Geist', ui-sans-serif, system-ui, -apple-system, sans-serif";
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', monospace";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

const navLinkStyle: React.CSSProperties = {
  height: 34,
  padding: "0 16px",
  display: "inline-flex",
  alignItems: "center",
  background: "var(--doc-surface)",
  border: "1px solid var(--doc-border)",
  borderRadius: 8,
  fontSize: 13,
  color: "var(--doc-text-secondary)",
  transition: "all 0.15s",
  fontFamily: FONT,
};

// Shared top nav for "/" and "/pricing" — same brand mark, links, and the
// single site-wide theme toggle. ".land-nav" is targeted directly by the
// hero's GSAP ScrollTrigger (hide-on-scroll-down) in page.tsx.
export function SiteNav({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  return (
    <nav
      className="land-nav"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        willChange: "transform",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        background: "color-mix(in oklab, var(--doc-bg) 75%, transparent)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--doc-border)",
        fontFamily: FONT,
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <DecaneLogo size={30} />
        <span style={{ fontWeight: 700, letterSpacing: "-0.02em", color: "var(--doc-text)" }}>
          decane
        </span>
        <span style={{ color: "var(--doc-text-muted)", fontFamily: MONO, fontSize: 12 }}>
          connect-kit
        </span>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Link href="/pricing" style={navLinkStyle}>
          Pricing
        </Link>
        <Link href="/docs" style={navLinkStyle}>
          Docs
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          style={{
            height: 34,
            padding: "0 16px",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--doc-accent)",
            color: "var(--doc-accent-text)",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: FONT,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.08 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
          </svg>
          GitHub
        </a>
        <button
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "1px solid var(--doc-border)",
            color: "var(--doc-text-secondary)",
            cursor: "pointer",
            marginLeft: 2,
            transition: "background 0.15s, color 0.15s, border-color 0.15s",
          }}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </nav>
  );
}
