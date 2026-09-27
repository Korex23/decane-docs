"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DecaneLogo } from "./DecaneLogo";
import { DASHBOARD_URL, type Theme } from "@/lib/theme";

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

const LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/node-docs", label: "Server SDKs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/recovery", label: "Recovery" },
];

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

// Shared top nav for "/", "/pricing" and "/recovery": brand left, pill tabs
// centred, actions right. The docs pages have their own topbar with search.
export function SiteNav({
  theme,
  onToggleTheme,
}: {
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="site-nav">
      <div className="container site-nav-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <DecaneLogo size={26} />
          Decane
        </Link>

        <div className={`pills nav-pills${open ? " open" : ""}`}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="pill"
              aria-current={pathname === l.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="site-nav-end">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <a
            href={DASHBOARD_URL}
            className="btn btn-ghost btn-sm site-nav-signin"
          >
            Sign in
          </a>
          <a
            href={`${DASHBOARD_URL}/auth/register`}
            className="btn btn-primary btn-sm site-nav-cta"
          >
            Get an API key
          </a>
          <button
            type="button"
            className="icon-btn site-nav-menu"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>
    </nav>
  );
}
