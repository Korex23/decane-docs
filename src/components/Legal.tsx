"use client";

import type { ReactNode } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/motion";
import { useTheme } from "@/lib/theme";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

// Shared shell for /terms and /privacy: a centred page head, a "short
// version" panel, then numbered sections with a sticky in-page list.
export function LegalPage({
  eyebrow,
  title,
  lede,
  updated,
  summary,
  sections,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  updated: string;
  summary: string[];
  sections: LegalSection[];
}) {
  const [theme, toggleTheme] = useTheme();
  return (
    <div className="site" data-theme={theme}>
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />
      <header className="hero page-head">
        <Reveal className="container hero-inner">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p className="lede">{lede}</p>
          <span className="legal-updated">Last updated {updated}</span>
        </Reveal>
      </header>

      <section style={{ padding: "16px 0 0" }}>
        <div className="container">
          <Reveal className="panel legal-summary">
            <div className="eyebrow">The short version</div>
            <ul>
              {summary.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="fine">
              This summary is for orientation. The sections below are the terms
              that apply.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section pad-b">
        <div className="container legal-grid">
          <nav className="legal-toc" aria-label="Sections">
            <span className="docs-toc-title">Sections</span>
            <ol>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.title}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="legal-body">
            {sections.map((s, i) => (
              <Reveal key={s.id} as="section" className="legal-section">
                <h2 id={s.id}>
                  <span className="n">{i + 1}</span>
                  {s.title}
                </h2>
                {s.body}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
