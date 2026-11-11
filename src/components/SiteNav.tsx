"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DecaneLogo } from "./DecaneLogo";
import { DASHBOARD_URL, type Theme } from "@/lib/theme";
import { MAIN_SITE, DISCORD_URL } from "@/lib/site";
import "./chrome.css";

function SunIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ) : (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}


export const PRODUCTS = [
  {
    name: "Decane Wallet",
    line: "A self-custody wallet that feels like your bank app.",
    href: `${MAIN_SITE}/#wallet`,
    icon: "M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 12h.01",
  },
  {
    name: "Connect Kit",
    line: "Wallets for your users, behind the sign-in they already use.",
    href: "/",
    icon: "M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5zM12 15v2",
  },
  {
    name: "Gas sponsorship",
    line: "Your users send without ever holding gas.",
    href: "/gas-sponsorship",
    soon: true,
    icon: "M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z",
  },
  {
    name: "Decane RPC",
    line: "Node access from one URL, next to your wallets.",
    href: "/rpc",
    soon: true,
    icon: "M4 5h16v5H4zM4 14h16v5H4zM8 7.5h.01M8 16.5h.01",
  },
] as const;

const LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: DISCORD_URL, label: "Community" },
];

function Glyph({ d, size = 17 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onToggle}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

// The site nav, the same as decane.app's: the Decane wordmark (to the main
// site) with "Kit" beside it (to the kit home), a products menu and three
// links in the middle, theme, sign-in and get-started on the right. Clear
// over the hero until the page scrolls. The docs reader has its own topbar.
export function SiteNav({
  theme,
  onToggleTheme,
}: {
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLLIElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(scrollY > 8);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [menu]);

  const external = (href: string) => href.startsWith("http");

  return (
    <nav className={`dn-nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`} aria-label="Main">
      <div className="dn-wrap dn-nav-inner">
        <span className="dn-brand">
          <a href={MAIN_SITE} className="brand" aria-label="Decane home">
            <DecaneLogo size={24} />
            Decane
          </a>
          <Link href="/" className="dn-brand-section" onClick={() => setOpen(false)}>
            Kit
          </Link>
        </span>

        <ul className="dn-links">
          <li ref={menuRef} className="dn-menu-wrap" onMouseEnter={() => setMenu(true)} onMouseLeave={() => setMenu(false)}>
            <button type="button" className="dn-link" aria-expanded={menu} aria-haspopup="true" onClick={() => setMenu((m) => !m)}>
              Products
              <svg className="dn-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div className={`dn-menu${menu ? " open" : ""}`}>
              <div className="dn-menu-grid">
                {PRODUCTS.map((p) => {
                  const inner = (
                    <>
                      <span className="dn-menu-icon">
                        <Glyph d={p.icon} />
                      </span>
                      <span>
                        <b>
                          {p.name}
                          {"soon" in p && p.soon && <em>Soon</em>}
                        </b>
                        <small>{p.line}</small>
                      </span>
                    </>
                  );
                  return external(p.href) ? (
                    <a key={p.name} href={p.href} className="dn-menu-item">
                      {inner}
                    </a>
                  ) : (
                    <Link key={p.name} href={p.href} className="dn-menu-item" onClick={() => setMenu(false)}>
                      {inner}
                    </Link>
                  );
                })}
              </div>
            </div>
          </li>
          {LINKS.map((l) => (
            <li key={l.label}>
              {external(l.href) ? (
                <a href={l.href} className="dn-link" target="_blank" rel="noreferrer">
                  {l.label}
                </a>
              ) : (
                <Link href={l.href} className="dn-link" aria-current={pathname === l.href ? "page" : undefined}>
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="dn-end">
          <button type="button" className="dn-icon" onClick={onToggleTheme} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href={DASHBOARD_URL} className="dn-text-link">
            Sign in
          </a>
          <a href={`${DASHBOARD_URL}/auth/register`} className="dn-pill">
            Get started
          </a>
          <button
            type="button"
            className="dn-icon dn-burger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      <div className={`dn-sheet${open ? " open" : ""}`}>
        <ul className="dn-wrap">
          {PRODUCTS.map((p) => (
            <li key={p.name}>
              <a href={p.href} onClick={() => setOpen(false)}>
                <Glyph d={p.icon} size={18} />
                {p.name}
              </a>
            </li>
          ))}
          <li>
            <hr />
          </li>
          {[...LINKS, { href: DASHBOARD_URL, label: "Sign in" }, { href: `${DASHBOARD_URL}/auth/register`, label: "Get started" }].map((l) => (
            <li key={l.label}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
