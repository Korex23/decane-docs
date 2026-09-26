"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { DecaneLogo } from "@/components/DecaneLogo";
import { ThemeToggle } from "@/components/SiteNav";
import { DASHBOARD_URL } from "@/lib/theme";
import { VERSIONS } from "@/lib/versions";

export interface SearchItem {
  id: string;
  title: string;
  crumb: string;
  mono?: boolean;
}

interface DocsTopbarProps {
  theme: "dark" | "light";
  onThemeToggle: () => void;
  onMenuToggle?: () => void;
  menuOpen?: boolean;
  current: "web" | "node";
  searchIndex: SearchItem[];
}

function short(v: string) {
  return v.split(".").slice(0, 2).join(".");
}

// One topbar for /docs and /node-docs: brand, the SDK switch, a search
// button that opens a command palette (⌘K), theme, and the API-key call.
export function DocsTopbar({ theme, onThemeToggle, onMenuToggle, menuOpen, current, searchIndex }: DocsTopbarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focusIdx, setFocusIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const results = (q
    ? searchIndex.filter((r) => r.title.toLowerCase().includes(q) || r.crumb.toLowerCase().includes(q))
    : searchIndex.filter((r) => r.crumb === "Getting started" || r.crumb === "Hooks" || r.crumb === "API")
  ).slice(0, 9);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        setQuery("");
        setFocusIdx(0);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  const go = useCallback((id: string) => {
    setOpen(false);
    if (id.startsWith("/")) window.location.href = id;
    else window.location.hash = id;
  }, []);

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setFocusIdx((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setFocusIdx((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && results[focusIdx]) go(results[focusIdx].id);
  }

  return (
    <>
      <header className="docs-topbar">
        <button
          className="icon-btn docs-menu-btn"
          onClick={onMenuToggle}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></svg>
          )}
        </button>

        <Link href="/" className="brand">
          <DecaneLogo size={26} />
          Decane<span className="brand-section">Docs</span>
        </Link>

        <div className="pills" role="tablist" aria-label="Documentation set">
          <Link href="/docs" className="pill" aria-current={current === "web" ? "page" : undefined}>
            Web &amp; React Native<small>{short(VERSIONS.web)}</small>
          </Link>
          <Link href="/node-docs" className="pill" aria-current={current === "node" ? "page" : undefined}>
            Node<small>{short(VERSIONS.node)}</small>
          </Link>
        </div>

        <button type="button" className="docs-search-btn" onClick={() => { setOpen(true); setQuery(""); setFocusIdx(0); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <span>Search docs…</span>
          <span className="keys"><kbd>⌘</kbd><kbd>K</kbd></span>
        </button>

        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        <a href={`${DASHBOARD_URL}/auth/register`} className="btn btn-primary btn-sm site-nav-cta">Get an API key</a>
      </header>

      {open && (
        <div className="palette-backdrop" onClick={() => setOpen(false)}>
          <div className="palette" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Search the docs">
            <div className="palette-input">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setFocusIdx(0); }}
                onKeyDown={onInputKey}
                placeholder="Search hooks, config, errors…"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd>esc</kbd>
            </div>
            <ul>
              {results.map((r, i) => (
                <li key={r.id}>
                  <a
                    href={r.id.startsWith("/") ? r.id : `#${r.id}`}
                    className={i === focusIdx ? "focused" : ""}
                    onClick={(e) => { e.preventDefault(); go(r.id); }}
                    onMouseEnter={() => setFocusIdx(i)}
                  >
                    <span className="ib">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></svg>
                    </span>
                    <span className="lbl"><b className={r.mono ? "mono" : ""}>{r.title}</b><small>{r.crumb}</small></span>
                    <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </a>
                </li>
              ))}
              {q && results.length === 0 && <li className="empty">Nothing matches &ldquo;{query}&rdquo;</li>}
            </ul>
            <div className="palette-foot">
              <span>↵ open</span><span>esc close</span>
              <span>{current === "web" ? "Web & React Native docs" : "Node SDK docs"}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
