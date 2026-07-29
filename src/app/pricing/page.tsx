"use client";

import { useEffect } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useTheme, DASHBOARD_URL } from "@/lib/theme";

const FONT = "'Geist', ui-sans-serif, system-ui, -apple-system, sans-serif";
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', monospace";

// Tier structure follows Privy's pricing model (privy.io/pricing) at a flat
// 15% discount on every dollar figure: Free (0-499 MAU) / Scale, priced in
// two MAU-range bands rather than one flat rate / Enterprise, custom.
// $299 -> $254, $499 -> $424. Feature bullets are decane's own real
// features redistributed across these bands — not copied from Privy,
// which lists things decane doesn't have (webhooks, custodial wallets,
// KYT, SSO, gas sponsorship, policy engine, etc).
interface Tier {
  name: string;
  band: string;
  price: string;
  period?: string;
  tagline: string;
  cta: { label: string; href: string; primary?: boolean };
  features: string[];
  highlighted?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Free",
    band: "0–499 MAU",
    price: "$0",
    tagline: "Everything you need to ship and test.",
    cta: { label: "Get your API key", href: `${DASHBOARD_URL}/auth/register`, primary: true },
    features: [
      "Up to 499 monthly active wallets",
      "1 project",
      "Google & email sign-in",
      "Passkey + recovery phrase",
      "Community support",
    ],
  },
  {
    name: "Scale",
    band: "500–2,499 MAU",
    price: "$254",
    period: "/mo",
    tagline: "For apps that have outgrown the free tier.",
    cta: { label: "Talk to us", href: "mailto:info@decane.app?subject=Scale%20plan" },
    highlighted: true,
    features: [
      "Up to 2,499 monthly active wallets",
      "Unlimited projects",
      "Custom callback domains",
      "Priority support",
      "Usage analytics export",
    ],
  },
  {
    name: "Scale",
    band: "2,500–9,999 MAU",
    price: "$424",
    period: "/mo",
    tagline: "For apps with real, sustained usage.",
    cta: { label: "Talk to us", href: "mailto:info@decane.app?subject=Scale%20plan" },
    features: [
      "Up to 9,999 monthly active wallets",
      "Unlimited projects",
      "Custom callback domains",
      "Priority support",
      "Usage analytics export",
    ],
  },
  {
    name: "Enterprise",
    band: "10,000+ MAU",
    price: "Custom",
    tagline: "Dedicated infrastructure, custom terms.",
    cta: { label: "Contact us", href: "mailto:info@decane.app?subject=Enterprise%20plan" },
    features: [
      "Unlimited monthly active wallets",
      "Dedicated TEE signer instance",
      "Uptime SLA",
      "SSO for your team",
      "Custom contract & DPA",
    ],
  },
];

const COMPARISON_ROWS: Array<{ label: string; free: string; scale: string; enterprise: string }> = [
  { label: "Monthly active wallets", free: "0–499", scale: "500–9,999", enterprise: "Unlimited" },
  { label: "Projects", free: "1", scale: "Unlimited", enterprise: "Unlimited" },
  { label: "API keys per project", free: "2", scale: "Unlimited", enterprise: "Unlimited" },
  { label: "Google & email sign-in", free: "✓", scale: "✓", enterprise: "✓" },
  { label: "Custom callback domains", free: "—", scale: "✓", enterprise: "✓" },
  { label: "Analytics export", free: "—", scale: "✓", enterprise: "✓" },
  { label: "Dedicated TEE signer", free: "—", scale: "—", enterprise: "✓" },
  { label: "Support", free: "Community", scale: "Priority", enterprise: "Dedicated + SLA" },
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "How is \"monthly active wallets\" measured?",
    a: "A wallet counts as active in a given calendar month the first time it signs in or signs something that month. Creating a wallet without any activity that month doesn't count against your limit.",
  },
  {
    q: "What happens if I go over my plan's limit?",
    a: "Existing wallets keep working. New wallet creation pauses until you upgrade to the next MAU band — we'll email your project's owner before that happens, not after.",
  },
  {
    q: "Why two price bands under \"Scale\"?",
    a: "Usage between 500 and 9,999 monthly active wallets varies a lot — the two bands let pricing track actual usage more closely than one flat rate for the whole range.",
  },
  {
    q: "Can I self-host instead?",
    a: "The connector SDK (wallet discovery + CAIP-25 sessions) is MIT-licensed and always free to self-host — see the npm package. The hosted social sign-in service on this page is the managed backend, OAuth relay, and key-share infrastructure; it isn't currently offered as a self-hosted package.",
  },
  {
    q: "Do you ever see a full private key?",
    a: "No. The key is split into separate shares the moment it's generated, and our share alone can't sign anything.",
  },
];

export default function PricingPage() {
  const [theme, toggleTheme] = useTheme();

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    const t = setTimeout(async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(".pr-hero", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" });
        gsap.from(".pr-tier", {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".pr-tiers", start: "top 85%", once: true },
        });
        gsap.utils.toArray<Element>(".pr-reveal").forEach((el) => {
          gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });
    }, 80);
    return () => {
      clearTimeout(t);
      ctx?.revert();
    };
  }, []);

  return (
    <div
      data-theme={theme}
      style={{ background: "var(--doc-bg)", color: "var(--doc-text)", fontFamily: FONT, overflowX: "hidden" }}
    >
      <style>{`* { box-sizing: border-box; } a { text-decoration: none; color: inherit; }`}</style>

      <SiteNav theme={theme} onToggleTheme={toggleTheme} />

      {/* Nav is fixed-position; give this page the same top offset */}
      <div style={{ height: 60 }} />

      {/* ── HEADER ── */}
      <section className="pr-hero" style={{ padding: "48px 24px 56px", textAlign: "center" }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: "var(--doc-accent)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Pricing
        </div>
        <h1
          style={{
            fontFamily: FONT,
            fontSize: "clamp(36px, 5.5vw, 60px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            marginBottom: 16,
            lineHeight: 1.1,
          }}
        >
          Start free.{" "}
          <span style={{ color: "var(--doc-accent)", fontStyle: "italic" }}>Scale when you need to.</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--doc-text-muted)", maxWidth: "50ch", margin: "0 auto" }}>
          Every plan runs the same security model — key split, encrypted server share, no
          exceptions. Plans differ in usage limits and support, not in how safe your users&rsquo;
          wallets are.
        </p>
      </section>

      {/* ── TIERS ── */}
      <section className="pr-tiers" style={{ padding: "24px 24px 100px", maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {TIERS.map((t) => (
            <div
              key={`${t.name}-${t.band}`}
              className="pr-tier"
              style={{
                background: t.highlighted ? "color-mix(in oklab, var(--doc-accent) 4%, transparent)" : "var(--doc-surface)",
                border: `1px solid ${t.highlighted ? "color-mix(in oklab, var(--doc-accent) 35%, transparent)" : "var(--doc-border)"}`,
                borderRadius: 18,
                padding: "32px 28px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {t.highlighted && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: 28,
                    fontFamily: MONO,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--doc-accent-text)",
                    background: "var(--doc-accent)",
                    borderRadius: 999,
                    padding: "3px 12px",
                    letterSpacing: "0.04em",
                  }}
                >
                  MOST COMMON
                </div>
              )}
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{t.name}</div>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: MONO,
                  color: "var(--doc-text-muted)",
                  marginBottom: 10,
                }}
              >
                {t.band}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                <span style={{ fontFamily: FONT, fontSize: 38, fontWeight: 900, letterSpacing: "-0.03em" }}>
                  {t.price}
                </span>
                {t.period && <span style={{ color: "var(--doc-text-muted)", fontSize: 14 }}>{t.period}</span>}
              </div>
              <p style={{ fontSize: 13.5, color: "var(--doc-text-muted)", marginBottom: 24, lineHeight: 1.5 }}>
                {t.tagline}
              </p>

              <ul style={{ listStyle: "none", margin: "0 0 28px", padding: 0, flex: 1 }}>
                {t.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: 13.5,
                      color: "var(--doc-text)",
                      marginBottom: 12,
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ color: "var(--doc-accent)", flexShrink: 0, marginTop: 1 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={t.cta.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 44,
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 700,
                  background: t.cta.primary ? "var(--doc-accent)" : "transparent",
                  color: t.cta.primary ? "var(--doc-accent-text)" : "var(--doc-text)",
                  border: t.cta.primary ? "none" : "1px solid var(--doc-border)",
                }}
              >
                {t.cta.label}
              </a>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--doc-text-muted)", marginTop: 24, fontFamily: MONO }}>
          Draft pricing — confirm before promoting publicly.
        </p>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="pr-reveal" style={{ padding: "0 24px 110px", maxWidth: 900, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: FONT,
            fontSize: "clamp(24px, 3vw, 32px)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          Compare plans
        </h2>
        <div style={{ border: "1px solid var(--doc-border)", borderRadius: 14, overflow: "hidden", background: "var(--doc-surface)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr>
                <th style={thStyle}></th>
                <th style={thStyle}>Free</th>
                <th style={thStyle}>Scale</th>
                <th style={thStyle}>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((r, i) => (
                <tr key={r.label} style={{ borderTop: i === 0 ? "none" : "1px solid var(--doc-border)" }}>
                  <td style={{ ...tdStyle, color: "var(--doc-text-muted)", textAlign: "left" }}>{r.label}</td>
                  <td style={tdStyle}>{r.free}</td>
                  <td style={tdStyle}>{r.scale}</td>
                  <td style={tdStyle}>{r.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pr-reveal" style={{ padding: "0 24px 120px", maxWidth: 760, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: FONT,
            fontSize: "clamp(24px, 3vw, 32px)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          Questions
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            background: "var(--doc-border)",
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid var(--doc-border)",
          }}
        >
          {FAQS.map((f) => (
            <div key={f.q} style={{ background: "var(--doc-surface)", padding: "22px 24px" }}>
              <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 8 }}>{f.q}</div>
              <p style={{ fontSize: 13.5, color: "var(--doc-text-muted)", lineHeight: 1.65, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "12px 14px",
  fontFamily: MONO,
  fontSize: 11.5,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--doc-text-muted)",
  fontWeight: 600,
  background: "var(--doc-surface-2)",
};

const tdStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "12px 14px",
  color: "var(--doc-text)",
};
