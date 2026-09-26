"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { DecaneLogo } from "@/components/DecaneLogo";
import { ThemeToggle } from "@/components/SiteNav";

export interface SearchItem {
  id: string;
  title: string;
  crumb: string;
}

interface DocsTopbarProps {
  theme: "dark" | "light";
  onThemeToggle: () => void;
  onMenuToggle?: () => void;
  menuOpen?: boolean;
  /** Which docs set this is; drives the current-page state in the topbar nav. */
  current: "web" | "node";
  version: string;
  npmUrl: string;
  searchIndex: SearchItem[];
}

// One topbar for /docs and /node-docs. Shares the brand block with the site
// nav so moving between the marketing pages and the docs does not feel like
// changing sites.
export function DocsTopbar({
  theme,
  onThemeToggle,
  onMenuToggle,
  menuOpen,
  current,
  version,
  npmUrl,
  searchIndex,
}: DocsTopbarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const results = query.trim()
    ? searchIndex
        .filter((item) => `${item.title} ${item.crumb}`.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8)
    : searchIndex.slice(0, 8);

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
      if (!panelRef.current?.contains(e.target as Node) && !inputRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
    },
    [results, focusIdx],
  );

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
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" />
          </svg>
        )}
      </button>

      <Link href="/" className="brand">
        <DecaneLogo size={26} />
        Decane
        <span className="brand-section">Docs</span>
      </Link>

      <nav className="docs-topbar-nav" aria-label="Documentation sets">
        <Link href="/docs" aria-current={current === "web" ? "page" : undefined}>Web and React Native</Link>
        <Link href="/node-docs" aria-current={current === "node" ? "page" : undefined}>Node</Link>
        <Link href="/recovery">Recovery</Link>
        <Link href="/pricing">Pricing</Link>
      </nav>

      <div className="docs-topbar-search">
        <svg className="docs-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setFocusIdx(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search the docs"
        />
        <span className="docs-search-kbd">⌘K</span>
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
        <a className="docs-icon-btn" href={npmUrl} target="_blank" rel="noreferrer" title="View on npm">
          npm <span className="docs-version">{version}</span>
        </a>
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      </div>
    </header>
  );
}
