"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { DecaneLogo } from "@/components/DecaneLogo";

const SEARCH_INDEX = [
  { id: "overview", title: "Overview", crumb: "Getting started" },
  { id: "install", title: "Install", crumb: "Getting started" },
  { id: "quick-start", title: "Quick start", crumb: "Getting started" },
  { id: "framework-setup", title: "Framework setup", crumb: "Framework setup" },
  { id: "nextjs", title: "Next.js (App Router)", crumb: "Framework setup" },
  { id: "vite", title: "Vite / CRA", crumb: "Framework setup" },
  { id: "configuration", title: "Configuration", crumb: "Configuration" },
  { id: "networks", title: "networks", crumb: "Configuration" },
  { id: "supported-chains", title: "supportedChainIds", crumb: "Configuration" },
  // Social sign-in entries
  { id: "social", title: "Social sign-in", crumb: "Social" },
  { id: "connect-mode", title: "ConnectMode", crumb: "Social" },
  { id: "social-config", title: "SocialConfig", crumb: "Social" },
  { id: "useSocialAuth", title: "useSocialAuth()", crumb: "Social" },
  { id: "useSocialWallet", title: "useSocialWallet()", crumb: "Social" },
  { id: "social-wallet-modal", title: "SocialWalletModal", crumb: "Social" },
  // Hooks
  { id: "hooks", title: "Hooks", crumb: "Hooks" },
  { id: "useDecane", title: "useDecane()", crumb: "Hooks" },
  { id: "useWalletSelector", title: "useWalletSelector()", crumb: "Hooks" },
  { id: "useSignMessage", title: "useSignMessage()", crumb: "Hooks" },
  { id: "useSendTransaction", title: "useSendTransaction()", crumb: "Hooks" },
  { id: "useSignTypedData", title: "useSignTypedData()", crumb: "Hooks" },
  { id: "useChainSwitch", title: "useChainSwitch()", crumb: "Hooks" },
  // Reference
  { id: "detection", title: "Wallet detection", crumb: "Reference" },
  { id: "chain-constants", title: "Chain constants", crumb: "Reference" },
  { id: "custom-chains", title: "Custom chains", crumb: "Reference" },
  { id: "errors", title: "Error handling", crumb: "Reference" },
  { id: "theme", title: "Theme", crumb: "Reference" },
  { id: "typescript", title: "TypeScript", crumb: "Reference" },
  { id: "not-included", title: "What is not included", crumb: "Reference" },
  { id: "chain-list", title: "Built-in chains", crumb: "Reference" },
];

interface TopbarProps {
  theme: "dark" | "light";
  onThemeToggle: () => void;
}

export function Topbar({ theme, onThemeToggle }: TopbarProps) {
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
      <div className="docs-brand">
        <DecaneLogo size={28} />
        <div>
          <div className="docs-brand-name">
            decane<span>connect-kit</span>
          </div>
        </div>
        <div className="docs-version-pill">v1.0</div>
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
        <a className="docs-icon-btn" href="https://github.com" title="GitHub" target="_blank" rel="noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.05 11.05 0 0 1 5.79 0c2.2-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.08 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
          </svg>
        </a>
        <a className="docs-icon-btn" href="https://npmjs.com" title="npm" target="_blank" rel="noreferrer">
          <span style={{ fontFamily: "var(--doc-font-mono)", fontSize: 12, fontWeight: 600, color: "var(--doc-text-secondary)" }}>
            npm
          </span>
        </a>
      </div>
    </header>
  );
}
