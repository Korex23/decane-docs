"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/motion";
import { PageShell } from "@/components/ProductPage";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

// Shared shell for /terms and /privacy, in the landing's frame: the gold page
// hero, a "short version" card, then numbered sections beside a sticky list.
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
  return (
    <PageShell
      eyebrow={eyebrow}
      title={title}
      lede={
        <>
          {lede}
          <span className="pg-updated">Last updated {updated}</span>
        </>
      }
      narrow
    >
      <section className="k-section" style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="k-wrap">
          <Reveal className="pg-summary">
            <span className="p-eyebrow">The short version</span>
            <ul className="p-ticks wide">
              {summary.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="pg-fine">This summary is for orientation. The sections below are the terms that apply.</p>
          </Reveal>
        </div>
      </section>

      <section className="k-section">
        <div className="k-wrap legal-grid pg-legal">
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
    </PageShell>
  );
}
