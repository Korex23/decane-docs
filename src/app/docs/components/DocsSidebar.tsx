"use client";

import { useEffect, useState, type ReactNode } from "react";

export interface NavItem { href: string; label: string; mono?: boolean }
export interface NavGroup { key: string; title: string; icon: ReactNode; items: NavItem[]; open?: boolean }

interface DocsSidebarProps {
  nav: NavGroup[];
  mobileOpen?: boolean;
  onClose?: () => void;
}

const line = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

// Group icons, shared by both docs sets.
export const NAV_ICONS = {
  start: <svg width="14" height="14" viewBox="0 0 24 24" {...line}><path d="M5 3l14 9-14 9z" /></svg>,
  framework: <svg width="14" height="14" viewBox="0 0 24 24" {...line}><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /></svg>,
  config: <svg width="14" height="14" viewBox="0 0 24 24" {...line}><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2.5" /><circle cx="10" cy="17" r="2.5" /></svg>,
  social: <svg width="14" height="14" viewBox="0 0 24 24" {...line}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>,
  rn: <svg width="14" height="14" viewBox="0 0 24 24" {...line}><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M11 18h2" /></svg>,
  hooks: <svg width="14" height="14" viewBox="0 0 24 24" {...line}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>,
  ref: <svg width="14" height="14" viewBox="0 0 24 24" {...line}><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /></svg>,
  verify: <svg width="14" height="14" viewBox="0 0 24 24" {...line}><path d="M12 3 4 6.5v5c0 4.6 3.4 8.4 8 9.5 4.6-1.1 8-4.9 8-9.5v-5z" /><path d="m9 12 2 2 4-4" /></svg>,
  server: <svg width="14" height="14" viewBox="0 0 24 24" {...line}><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="M7 7h.01M7 17h.01" /></svg>,
};

// Collapsible groups with an icon each; the group that holds the section
// you are reading is tinted gold, and its item gets the rail.
export function DocsSidebar({ nav, mobileOpen, onClose }: DocsSidebarProps) {
  const [activeId, setActiveId] = useState("overview");
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(nav.map((g) => [g.key, g.open ?? true])),
  );

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>(".docs-main h2[id], .docs-main h3[id], .docs-main section[id]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActiveId(entry.target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    headings.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {mobileOpen && <div className="docs-sidebar-backdrop" onClick={onClose} />}
      <aside className={`docs-sidebar${mobileOpen ? " mobile-open" : ""}`}>
        {nav.map((g) => {
          const hasActive = g.items.some((it) => it.href === `#${activeId}`);
          const isOpen = open[g.key] || hasActive;
          return (
            <nav key={g.key} className="docs-group">
              <button
                type="button"
                className={`docs-group-btn${hasActive ? " has-active" : ""}`}
                aria-expanded={isOpen}
                onClick={() => setOpen((s) => ({ ...s, [g.key]: !isOpen }))}
              >
                <span className="docs-group-icon">{g.icon}</span>
                <span className="title">{g.title}</span>
                <svg className="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
              {isOpen && (
                <ul className="docs-group-list">
                  {g.items.map((it) => (
                    <li key={it.href}>
                      <a href={it.href} className={it.href === `#${activeId}` ? "active" : ""} onClick={onClose}>
                        {it.mono ? <code>{it.label}</code> : it.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          );
        })}
      </aside>
    </>
  );
}
