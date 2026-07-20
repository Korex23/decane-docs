"use client";

import { useState } from "react";
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

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
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
  const [mobileOpen, setMobileOpen] = useState(false);

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
        padding: "0 20px 0 24px",
        background: "color-mix(in oklab, var(--doc-bg) 75%, transparent)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--doc-border)",
        fontFamily: FONT,
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }} onClick={() => setMobileOpen(false)}>
        <DecaneLogo size={30} />
        <span style={{ fontWeight: 700, letterSpacing: "-0.02em", color: "var(--doc-text)" }}>
          decane
        </span>
        <span className="site-nav-brand-sub" style={{ color: "var(--doc-text-muted)", fontFamily: MONO, fontSize: 12 }}>
          connect-kit
        </span>
      </Link>

      <div className={`site-nav-links${mobileOpen ? " open" : ""}`}>
        <Link href="/pricing" style={navLinkStyle} onClick={() => setMobileOpen(false)}>
          Pricing
        </Link>
        <Link href="/docs" style={navLinkStyle} onClick={() => setMobileOpen(false)}>
          Docs
        </Link>
        <a
          href="https://www.npmjs.com/package/decane-connect-kit"
          target="_blank"
          rel="noreferrer"
          style={{
            height: 34,
            padding: "0 16px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            background: "var(--doc-accent)",
            color: "var(--doc-accent-text)",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: FONT,
          }}
        >
          npm
        </a>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
            transition: "background 0.15s, color 0.15s, border-color 0.15s",
          }}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <button
          className="site-nav-menu-btn"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <MenuIcon open={mobileOpen} />
        </button>
      </div>
    </nav>
  );
}
