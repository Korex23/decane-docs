"use client";

import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal, Stagger, Item } from "@/components/motion";
import { useTheme, DASHBOARD_URL } from "@/lib/theme";
import "@/app/landing.css";
import "@/app/product.css";

// The frame the product pages (gas sponsorship, RPC) share with the landing:
// the same nav, gradient hero, section rhythm, tabs and dark close.

export const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Soon = () => <span className="k-soon">Coming soon</span>;

/** The rounded, angled tab a section rises into the one above with. */
export const Tab = () => (
  <div className="k-tab" aria-hidden="true">
    <span />
    <svg viewBox="0 0 96 60" width="96" height="60">
      <path d="M0 0H22Q34 0 40 10L62 50Q68 60 80 60H96V60H0Z" fill="currentColor" />
    </svg>
  </div>
);

export function ProductPage({
  eyebrow,
  title,
  lede,
  art,
  children,
  closeTitle,
  closeText,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  art: React.ReactNode;
  children: React.ReactNode;
  closeTitle: string;
  closeText: string;
}) {
  const [theme, toggleTheme] = useTheme();
  return (
    <div className="site lp" data-theme={theme}>
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />

      <header className="k-hero p-hero">
        <div className="k-hero-bg" aria-hidden="true" />
        <div className="k-wrap p-hero-grid">
          <Stagger className="p-hero-copy" inView={false} delay={0.1} start={0.05}>
            <Item>
              <span className="p-eyebrow">
                {eyebrow} <Soon />
              </span>
            </Item>
            <Item>
              <h1>{title}</h1>
            </Item>
            <Item>
              <p>{lede}</p>
            </Item>
            <Item className="k-actions left">
              <a href={`${DASHBOARD_URL}/auth/register`} className="k-btn k-btn-primary">
                Get an API key <Arrow />
              </a>
              <a href="mailto:info@decane.app" className="k-btn k-btn-light">
                Ask for early access
              </a>
            </Item>
          </Stagger>
          <Reveal className="p-hero-art" delay={0.25}>
            {art}
          </Reveal>
        </div>
      </header>

      {children}

      <section className="k-close">
        <Tab />
        <div className="k-wrap">
          <Reveal className="k-close-card">
            <div className="k-close-copy">
              <h2>{closeTitle}</h2>
              <p>{closeText}</p>
              <div className="k-actions">
                <a href={`${DASHBOARD_URL}/auth/register`} className="k-btn k-btn-primary">
                  Start free <Arrow />
                </a>
                <Link href="/" className="k-btn k-btn-light">
                  See everything Decane does
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

/**
 * The frame for every other marketing page (pricing, changelog, recovery,
 * legal): the landing's nav, a centred gold page hero, the page's sections,
 * an optional dark close, and the footer.
 */
export function PageShell({
  eyebrow,
  title,
  lede,
  actions,
  children,
  close,
  narrow,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  close?: { title: string; text: string } | null;
  narrow?: boolean;
}) {
  const [theme, toggleTheme] = useTheme();
  return (
    <div className="site lp" data-theme={theme}>
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />

      <header className="k-hero pg-hero">
        <div className="k-hero-bg" aria-hidden="true" />
        <Stagger className={`k-wrap pg-hero-copy${narrow ? " narrow" : ""}`} inView={false} delay={0.1} start={0.05}>
          <Item>
            <span className="p-eyebrow">{eyebrow}</span>
          </Item>
          <Item>
            <h1>{title}</h1>
          </Item>
          {lede && (
            <Item>
              <p>{lede}</p>
            </Item>
          )}
          {actions && <Item className="k-actions">{actions}</Item>}
        </Stagger>
      </header>

      {children}

      {close && (
        <section className="k-close">
          <Tab />
          <div className="k-wrap">
            <Reveal className="k-close-card">
              <div className="k-close-copy">
                <h2>{close.title}</h2>
                <p>{close.text}</p>
                <div className="k-actions">
                  <a href={`${DASHBOARD_URL}/auth/register`} className="k-btn k-btn-primary">
                    Start free <Arrow />
                  </a>
                  <Link href="/docs" className="k-btn k-btn-light">
                    Read the docs
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}

/** A section with a big heading and an optional line under it. */
export function PSection({
  id,
  title,
  lead,
  tinted,
  children,
}: {
  id?: string;
  title: string;
  lead?: string;
  tinted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={`k-section${tinted ? " k-tinted" : ""}`} id={id}>
      {tinted && <Tab />}
      <div className="k-wrap">
        <Reveal>
          <h2 className="k-h2 k-h2-narrow">{title}</h2>
          {lead && <p className="k-lead">{lead}</p>}
        </Reveal>
        <div className="p-body">{children}</div>
      </div>
    </section>
  );
}

export function Cards({ items }: { items: { title: string; body: string; tag?: string }[] }) {
  return (
    <Stagger className="p-cards" delay={0.07}>
      {items.map((c) => (
        <Item key={c.title} className="p-card">
          {c.tag && <small>{c.tag}</small>}
          <h3>{c.title}</h3>
          <p>{c.body}</p>
        </Item>
      ))}
    </Stagger>
  );
}

export function Steps({ items }: { items: { title: string; body: string }[] }) {
  return (
    <Stagger className="p-steps" delay={0.08}>
      {items.map((s, i) => (
        <Item key={s.title} className="p-step">
          <span className="p-step-n">{String(i + 1).padStart(2, "0")}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </Item>
      ))}
    </Stagger>
  );
}

export function Code({ file, code }: { file: string; code: string }) {
  return (
    <div className="p-code">
      <div className="p-code-head">
        <span />
        <span />
        <span />
        <small>{file}</small>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="p-faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
