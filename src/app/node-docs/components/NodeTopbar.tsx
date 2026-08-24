"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { DecaneLogo } from "@/components/DecaneLogo";

const SEARCH_INDEX = [
  { id: "overview", title: "Overview", crumb: "Getting started" },
  { id: "install", title: "Install", crumb: "Getting started" },
  { id: "quick-start", title: "Quick start", crumb: "Getting started" },
  { id: "auth", title: "Server-side sign-in", crumb: "Sign-in" },
  { id: "auth-api-key", title: "The API key", crumb: "Sign-in" },
  { id: "auth-email", title: "Email OTP", crumb: "Sign-in" },
  { id: "auth-google-token", title: "connectWithGoogleToken()", crumb: "Sign-in" },
  { id: "auth-kingschat-token", title: "connectWithKingsChatToken()", crumb: "Sign-in" },
  { id: "auth-external", title: "connectWithToken()", crumb: "Sign-in" },
  { id: "auth-revoke", title: "revokeAccessToken()", crumb: "Sign-in" },
  { id: "auth-errors", title: "DecaneApiError", crumb: "Sign-in" },
  { id: "auth-limits", title: "Operational limits", crumb: "Sign-in" },
  { id: "verification-modes", title: "Verification modes", crumb: "Verification" },
  { id: "static-key", title: "Static verification key", crumb: "Verification" },
  { id: "jwks", title: "JWKS", crumb: "Verification" },
  { id: "express", title: "Express middleware", crumb: "Verification" },
  { id: "nextjs-route", title: "Next.js route handler", crumb: "Verification" },
  { id: "decane-client", title: "DecaneClient", crumb: "API" },
  { id: "verify-access-token", title: "verifyAccessToken()", crumb: "API" },
  { id: "safe-verify", title: "safeVerifyAccessToken()", crumb: "API" },
  { id: "get-addresses", title: "getAddresses()", crumb: "API" },
  { id: "get-user", title: "getUser()", crumb: "API" },
  { id: "standalone-verify", title: "Standalone verifyAccessToken", crumb: "API" },
  { id: "claims", title: "Token claims", crumb: "Reference" },
  { id: "errors", title: "Error handling", crumb: "Reference" },
  { id: "config", title: "Configuration", crumb: "Reference" },
  { id: "client-token", title: "Getting the token client-side", crumb: "Reference" },
  { id: "revocation", title: "Statelessness & revocation", crumb: "Reference" },
  { id: "privy-migration", title: "Migrating from Privy", crumb: "Reference" },
  { id: "typescript", title: "TypeScript", crumb: "Reference" },
];

interface NodeTopbarProps {
  theme: "dark" | "light";
  onThemeToggle: () => void;
  onMenuToggle?: () => void;
  menuOpen?: boolean;
}

export function NodeTopbar({ theme, onThemeToggle, onMenuToggle, menuOpen }: NodeTopbarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? SEARCH_INDEX.filter((item) =>
        `${item.title} ${item.crumb}`.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : SEARCH_INDEX.slice(0, 8);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node) &&
          !inputRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && focusIdx >= 0) {
      const item = results[focusIdx];
      window.location.hash = item.id;
      setOpen(false);
      setQuery("");
    }
  }, [results, focusIdx]);

  function handleResultClick(id: string) {
    window.location.hash = id;
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  }

  return (
    <header className="docs-topbar">
      <button
        className="docs-menu-btn"
        onClick={onMenuToggle}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>
      <div className="docs-brand">
        <DecaneLogo size={28} />
        <div>
          <div className="docs-brand-name">
            decane<span>node</span>
          </div>
        </div>
        <div className="docs-version-pill">v1.2</div>
      </div>

      <div className="docs-topbar-search">
        <svg className="docs-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search the docs…"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setFocusIdx(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <span className="docs-search-kbd">⌘ K</span>
        {open && results.length > 0 && (
          <div className="docs-search-results" ref={panelRef}>
            {results.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`docs-search-result${i === focusIdx ? " focused" : ""}`}
                onClick={(e) => { e.preventDefault(); handleResultClick(item.id); }}
              >
                {item.title}
                <span className="docs-search-crumb">{item.crumb}</span>
              </a>
            ))}
          </div>
        )}
        {open && query && results.length === 0 && (
          <div className="docs-search-results" ref={panelRef}>
            <div className="docs-search-empty">No results for &ldquo;{query}&rdquo;</div>
          </div>
        )}
      </div>

      <div className="docs-topbar-actions">
        <a
          className="docs-icon-btn"
          href="/docs"
          title="Web SDK docs"
          style={{ width: "auto", padding: "0 10px" }}
        >
          <span style={{ fontFamily: "var(--doc-font-mono)", fontSize: 12, fontWeight: 600, color: "var(--doc-text-secondary)", whiteSpace: "nowrap" }}>
            web docs
          </span>
        </a>
        <button className="docs-icon-btn" onClick={onThemeToggle} title="Toggle theme">
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          )}
        </button>
        <a className="docs-icon-btn" href="https://www.npmjs.com/package/decane-node" title="npm" target="_blank" rel="noreferrer">
          <span style={{ fontFamily: "var(--doc-font-mono)", fontSize: 12, fontWeight: 600, color: "var(--doc-text-secondary)" }}>
            npm
          </span>
        </a>
      </div>
    </header>
  );
}
