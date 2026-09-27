"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DecaneLogo } from "@/components/DecaneLogo";
import { ThemeToggle } from "@/components/SiteNav";
import { CookieNotice } from "@/components/CookieNotice";
import { useTheme } from "@/lib/theme";
import { DocIcon } from "./DocIcon";
import type { DocPage, SearchEntry } from "./types";

export type DocSet = "web" | "node" | "python" | "rust" | "swift" | "kotlin" | "changelog";

interface DocsShellProps {
  set: DocSet;
  basePath: string;
  pages: DocPage[];
  page: DocPage;
  anchors: Record<string, string>;
  search: SearchEntry[];
  /** Optional lede shown under the title. */
  lede?: ReactNode;
}

const TABS: Array<{ set: DocSet; href: string; label: string; icon: string }> = [
  { set: "web", href: "/docs", label: "Web & React Native", icon: "react" },
  { set: "node", href: "/node-docs", label: "Node", icon: "nodejs" },
  { set: "python", href: "/python-docs", label: "Python", icon: "python" },
  { set: "rust", href: "/rust-docs", label: "Rust", icon: "rust" },
  { set: "swift", href: "/swift-docs", label: "Swift", icon: "swift" },
  { set: "kotlin", href: "/kotlin-docs", label: "Kotlin", icon: "kotlin" },
  { set: "changelog", href: "/changelog", label: "Changelog", icon: "history" },
];

function hrefFor(basePath: string, slug: string) {
  return slug === "overview" ? basePath : `${basePath}/${slug}`;
}

// The docs shell, modelled on Mintlify's: a search pill in the topbar, a row
// of set tabs under it, a sidebar of pages with an icon each, one page in the
// middle with the group name above its title, and "On this page" on the right.
export function DocsShell({ set, basePath, pages, page, anchors, search, lede }: DocsShellProps) {
  const [theme, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focusIdx, setFocusIdx] = useState(0);
  const [toc, setToc] = useState<Array<{ id: string; text: string; level: 2 | 3 }>>([]);
  const [activeId, setActiveId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const groups = useMemo(() => {
    const order: string[] = [];
    const by: Record<string, DocPage[]> = {};
    for (const p of pages) {
      if (!by[p.group]) { by[p.group] = []; order.push(p.group); }
      by[p.group].push(p);
    }
    return order.map((g) => ({ title: g, items: by[g] }));
  }, [pages]);

  const idx = pages.findIndex((p) => p.slug === page.slug);
  const prev = idx > 0 ? pages[idx - 1] : null;
  const next = idx >= 0 && idx < pages.length - 1 ? pages[idx + 1] : null;

  // Resolve an id (page slug or an anchor inside a page) to a URL.
  function urlFor(id: string) {
    const slug = anchors[id] ?? id;
    const path = hrefFor(basePath, slug);
    return slug === id ? path : `${path}#${id}`;
  }

  // Table of contents from the headings on the current page; active tracking.
  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const headings = Array.from(root.querySelectorAll<HTMLElement>("h2[id], h3[id]"));
    setToc(headings.map((h) => {
      const c = h.cloneNode(true) as HTMLElement;
      c.querySelectorAll(".docs-anchor").forEach((n) => n.remove());
      return { id: h.id, text: c.textContent?.trim() ?? "", level: h.tagName === "H2" ? 2 : 3 };
    }));
    setActiveId(headings[0]?.id ?? "");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActiveId(e.target.id);
    }, { rootMargin: "-120px 0px -70% 0px", threshold: 0 });
    headings.forEach((h) => io.observe(h));
    // Land on the hash once the page has rendered.
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      el?.scrollIntoView({ block: "start", behavior: "instant" });
    }
    return () => io.disconnect();
  }, [page.slug]);

  // Hash links written when the docs were one page: send them to the page
  // that holds the id.
  function onMainClick(e: React.MouseEvent) {
    const a = (e.target as HTMLElement).closest("a");
    if (!a) return;
    const href = a.getAttribute("href") ?? "";
    if (!href.startsWith("#")) return;
    const id = href.slice(1);
    const slug = anchors[id];
    if (slug && slug !== page.slug) {
      e.preventDefault();
      router.push(urlFor(id));
    }
  }

  // Search palette.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(true); setQuery(""); setFocusIdx(0); }
      if (e.key === "Escape") setPaletteOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { if (paletteOpen) setTimeout(() => inputRef.current?.focus(), 0); }, [paletteOpen]);
  const q = query.trim().toLowerCase();
  const known = search.filter((r) => r.id.startsWith("/") || anchors[r.id] || pages.some((p) => p.slug === r.id));
  const results = (q
    ? known.filter((r) => r.title.toLowerCase().includes(q) || r.crumb.toLowerCase().includes(q))
    : known.slice(0, 9)
  ).slice(0, 9);
  function go(id: string) {
    setPaletteOpen(false);
    if (id.startsWith("/")) router.push(id);
    else router.push(urlFor(id));
  }

  return (
    <div className="docs-root" data-theme={theme}>
      <div className="docs-app">
        <header className="docs-head">
          <div className="docs-topbar">
            <button className="icon-btn docs-menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>
              {menuOpen ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="17" x2="21" y2="17" /></svg>
              )}
            </button>
            <Link href="/docs" className="brand"><DecaneLogo size={26} />Decane<span className="brand-section">Docs</span></Link>
            <button type="button" className="docs-search" onClick={() => { setPaletteOpen(true); setQuery(""); setFocusIdx(0); }}>
              <DocIcon name="search" size={15} />
              <span>Search…</span>
              <kbd>⌘K</kbd>
            </button>
            <div className="docs-topbar-end">
              <Link href="/" className="docs-site-link"><DocIcon name="globe" size={15} />Website</Link>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
          <nav className="docs-tabs-row" aria-label="Documentation sets">
            {TABS.map((t) => (
              <Link key={t.set} href={t.href} className={`docs-tab-link${t.set === set ? " active" : ""}`} aria-current={t.set === set ? "page" : undefined}>
                <DocIcon name={t.icon} size={15} />{t.label}
              </Link>
            ))}
          </nav>
        </header>

        {menuOpen && <div className="docs-sidebar-backdrop" onClick={() => setMenuOpen(false)} />}
        <aside className={`docs-sidebar${menuOpen ? " mobile-open" : ""}`}>
          {groups.map((g) => (
            <nav key={g.title} className="docs-group">
              <div className="docs-group-title">{g.title}</div>
              <ul>
                {g.items.map((p) => (
                  <li key={p.slug}>
                    <Link href={hrefFor(basePath, p.slug)} className={p.slug === page.slug ? "active" : ""} aria-current={p.slug === page.slug ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                      <DocIcon name={p.icon} size={15} />{p.navLabel ?? p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </aside>

        <main className="docs-main" id="docs-main" ref={mainRef} onClick={onMainClick}>
          <div className="docs-eyebrow">{page.group}</div>
          <h1 className="docs-title">{page.title}</h1>
          {lede && <p className="docs-lede">{lede}</p>}
          {page.body}
          <nav className="docs-pager" aria-label="Pages">
            {prev ? (
              <Link href={hrefFor(basePath, prev.slug)} className="prev">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                {prev.title}
              </Link>
            ) : <span />}
            {next ? (
              <Link href={hrefFor(basePath, next.slug)} className="next">
                {next.title}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            ) : <span />}
          </nav>
          <footer className="docs-foot">
            <div className="docs-foot-links">
              <a href="https://github.com/Korex23/decane-docs" target="_blank" rel="noreferrer" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.5 9.5 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .3.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2z" /></svg>
              </a>
              <a href="https://www.npmjs.com/package/decane-connect-kit" target="_blank" rel="noreferrer">npm</a>
              <a href="mailto:info@decane.app">info@decane.app</a>
            </div>
            <span className="mono">kit.decane.app</span>
          </footer>
        </main>

        <aside className="docs-toc">
          {toc.length > 0 && <div className="docs-toc-title"><DocIcon name="toc" size={14} />On this page</div>}
          <ul>
            {toc.map((t) => (
              <li key={t.id} className={t.level === 3 ? "l3" : "l2"}>
                <a href={`#${t.id}`} className={activeId === t.id ? "active" : ""}>{t.text}</a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {paletteOpen && (
        <div className="palette-backdrop" onClick={() => setPaletteOpen(false)}>
          <div className="palette" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Search the docs">
            <div className="palette-input">
              <DocIcon name="search" size={18} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setFocusIdx(0); }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setFocusIdx((i) => Math.min(i + 1, results.length - 1)); }
                  else if (e.key === "ArrowUp") { e.preventDefault(); setFocusIdx((i) => Math.max(i - 1, 0)); }
                  else if (e.key === "Enter" && results[focusIdx]) go(results[focusIdx].id);
                }}
                placeholder="Search…"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd>esc</kbd>
            </div>
            <ul>
              {results.map((r, i) => (
                <li key={r.id}>
                  <a href={urlFor(r.id)} className={i === focusIdx ? "focused" : ""} onClick={(e) => { e.preventDefault(); go(r.id); }} onMouseEnter={() => setFocusIdx(i)}>
                    <span className="ib"><DocIcon name="book" size={13} /></span>
                    <span className="lbl"><b className={r.mono ? "mono" : ""}>{r.title}</b><small>{r.crumb}</small></span>
                    <DocIcon name="arrow" size={14} />
                  </a>
                </li>
              ))}
              {q && results.length === 0 && <li className="empty">Nothing matches &ldquo;{query}&rdquo;</li>}
            </ul>
            <div className="palette-foot"><span>↵ open</span><span>esc close</span><span>{TABS.find((t) => t.set === set)?.label}</span></div>
          </div>
        </div>
      )}
      <CookieNotice />
    </div>
  );
}
