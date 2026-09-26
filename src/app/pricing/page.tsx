"use client";

import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal, Stagger, Item } from "@/components/motion";
import { useTheme, DASHBOARD_URL } from "@/lib/theme";

// Tier structure follows Privy's pricing model (privy.io/pricing) at a flat
// 15% discount on every dollar figure: Free (0-499 MAU) / Scale, priced in
// two MAU-range bands rather than one flat rate / Enterprise, custom.
// $299 -> $254, $499 -> $424. Feature bullets are decane's own real
// features redistributed across these bands.
interface Tier {
  key: string;
  name: string;
  band: string;
  range: string;
  price: string;
  period: string;
  tagline: string;
  cta: { label: string; href: string };
  note: string;
  min: number;
  pick: number;
  features: string[];
}

const TIERS: Tier[] = [
  {
    key: "free", name: "Free", band: "0–499 MAU", range: "0–499", price: "$0", period: "forever",
    tagline: "Everything you need to ship and test: every sign-in method, every chain, one project.",
    cta: { label: "Get an API key", href: `${DASHBOARD_URL}/auth/register` }, note: "No card needed.", min: 0, pick: 250,
    features: ["Up to 499 monthly active wallets", "1 project", "Every sign-in method", "Passkey, password and recovery file", "Community support"],
  },
  {
    key: "scale1", name: "Scale", band: "500–2,499 MAU", range: "500–2.5k", price: "$254", period: "per month",
    tagline: "For apps that have outgrown the free tier.",
    cta: { label: "Talk to us", href: "mailto:info@decane.app?subject=Scale%20plan" }, note: "Billed monthly, cancel any time.", min: 500, pick: 1500,
    features: ["Up to 2,499 monthly active wallets", "Unlimited projects", "Custom callback domains", "Priority support", "Usage analytics export"],
  },
  {
    key: "scale2", name: "Scale", band: "2,500–9,999 MAU", range: "2.5k–10k", price: "$424", period: "per month",
    tagline: "For apps with real, sustained usage.",
    cta: { label: "Talk to us", href: "mailto:info@decane.app?subject=Scale%20plan" }, note: "Billed monthly, cancel any time.", min: 2500, pick: 6000,
    features: ["Up to 9,999 monthly active wallets", "Unlimited projects", "Custom callback domains", "Priority support", "Usage analytics export"],
  },
  {
    key: "ent", name: "Enterprise", band: "10,000+ MAU", range: "10k+", price: "Custom", period: "",
    tagline: "Dedicated infrastructure, custom terms, a signer that is yours alone.",
    cta: { label: "Contact us", href: "mailto:info@decane.app?subject=Enterprise%20plan" }, note: "We reply within a business day.", min: 10000, pick: 10000,
    features: ["Unlimited monthly active wallets", "Dedicated enclave signer", "Uptime SLA", "SSO for your team", "Custom contract and DPA"],
  },
];

const ROWS: Array<{ label: string; v: string[] }> = [
  { label: "Monthly active wallets", v: ["0–499", "500–2,499", "2,500–9,999", "Unlimited"] },
  { label: "Projects", v: ["1", "Unlimited", "Unlimited", "Unlimited"] },
  { label: "API keys per project", v: ["2", "Unlimited", "Unlimited", "Unlimited"] },
  { label: "Google, email, phone, X, KingsChat, custom JWT", v: ["Included", "Included", "Included", "Included"] },
  { label: "Custom callback domains", v: ["—", "Included", "Included", "Included"] },
  { label: "Analytics export", v: ["—", "Included", "Included", "Included"] },
  { label: "Dedicated enclave signer", v: ["—", "—", "—", "Included"] },
  { label: "Support", v: ["Community", "Priority", "Priority", "Dedicated, with SLA"] },
];

const FAQS: Array<{ q: string; a: string }> = [
  { q: "How is a monthly active wallet measured?", a: "A wallet counts as active in a calendar month the first time it signs in or signs something that month. Creating a wallet with no activity that month does not count against the limit." },
  { q: "What happens if I go over my plan's limit?", a: "Existing wallets keep working. New wallet creation pauses until you move to the next band. The project owner is emailed before that happens, not after." },
  { q: "Why two price bands under Scale?", a: "Usage between 500 and 9,999 monthly active wallets varies a lot. Two bands let the price track actual usage more closely than one flat rate for the whole range." },
  { q: "Can I self-host instead?", a: "The connector SDK (wallet discovery and CAIP-25 sessions) is MIT licensed and always free to self-host. The hosted sign-in service on this page is the managed backend, sign-in relay and enclave, and it is not offered as a self-hosted package." },
  { q: "Does Decane ever see a full private key?", a: "No. The key is split into three shares the moment it is generated inside the enclave, and it is only ever reconstructed there, for one signature. Decane's share alone cannot sign anything." },
];

// The slider is piecewise-linear so the tick labels (0 · 500 · 2,500 · 10,000+)
// sit at thirds of the track.
function posToMau(p: number) {
  return p <= 100 ? Math.round((p * 5) / 10) * 10 : p <= 200 ? 500 + Math.round(((p - 100) * 20) / 50) * 50 : 2500 + Math.round(((p - 200) * 75) / 50) * 50;
}
function mauToPos(m: number) {
  return m <= 500 ? m / 5 : m <= 2500 ? 100 + (m - 500) / 20 : Math.min(300, 200 + (m - 2500) / 75);
}

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function PricingPage() {
  const [theme, toggleTheme] = useTheme();
  const [pos, setPos] = useState(() => mauToPos(1200));
  const mau = posToMau(pos);
  const idx = TIERS.reduce((a, t, i) => (mau >= t.min ? i : a), 0);
  const plan = TIERS[idx];

  return (
    <div className="site" data-theme={theme}>
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />

      <header className="hero page-head">
        <Reveal className="container hero-inner">
          <div className="eyebrow">Pricing</div>
          <h1>How many wallets are active each month?</h1>
          <p className="lede" style={{ maxWidth: "54ch" }}>
            That one number picks your plan. Everything else, the three-share wallet, the attested
            enclave, every sign-in method and every chain, is the same on all of them.
          </p>
        </Reveal>
      </header>

      <section style={{ padding: "16px 0 80px" }}>
        <div className="container">
          <Stagger className="calc" delay={0.12}>
            <Item className="calc-card">
              <div className="calc-top">
                <span>Monthly active wallets</span>
                <span className="n">{mau >= 10000 ? "10,000+" : mau.toLocaleString("en-US")}</span>
              </div>
              <div className="calc-slider">
                <input type="range" min={0} max={300} step={1} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Monthly active wallets" />
                <div className="calc-ticks"><span>0</span><span>500</span><span>2,500</span><span>10,000+</span></div>
              </div>
              <div className="bands">
                {TIERS.map((t, i) => (
                  <button key={t.key} type="button" className={`band${i === idx ? " active" : ""}`} onClick={() => setPos(mauToPos(t.pick))}>
                    <b>{t.name}</b>
                    <small>{t.range}</small>
                  </button>
                ))}
              </div>
              <p className="calc-note">A wallet counts as active the first time it signs in or signs something in a calendar month. Created but idle wallets don&rsquo;t count.</p>
            </Item>
            <Item className="plan-card">
              <div className="top">
                <span className="yours">Your plan</span>
                <span className="band-tag">{plan.band}</span>
              </div>
              <div className="name">{plan.name}</div>
              <div className="price"><b>{plan.price}</b>{plan.period && <span>{plan.period}</span>}</div>
              <p className="tagline">{plan.tagline}</p>
              <ul>
                {plan.features.map((f) => (
                  <li key={f}><Check /><span>{f}</span></li>
                ))}
              </ul>
              <div className="actions">
                <a href={plan.cta.href} className="btn btn-primary btn-lg">{plan.cta.label}</a>
                <span>{plan.note}</span>
              </div>
            </Item>
          </Stagger>
          <p className="footnote">Draft pricing. Confirm before promoting publicly.</p>
        </div>
      </section>

      <section style={{ padding: "0 0 96px" }}>
        <Reveal className="container">
          <div className="compare-head">
            <h2 className="md">All plans, side by side</h2>
            <span>Your plan is highlighted.</span>
          </div>
          <div className="compare-panel">
            <table className="compare">
              <thead>
                <tr>
                  <th></th>
                  {TIERS.map((t, i) => (
                    <th key={t.key} className={i === idx ? "on" : ""}>
                      {t.name}
                      <small>{t.price}{t.period ? " / mo" : ""}</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.label}>
                    <th>{r.label}</th>
                    {r.v.map((v, i) => (
                      <td key={i} className={`${v === "—" ? "no" : ""}${i === idx ? " on" : ""}`}>{v === "—" ? "Not included" : v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      <section style={{ padding: "0 0 112px" }}>
        <Reveal className="container faq-grid">
          <div>
            <div className="eyebrow">Questions</div>
            <h2 className="md">Before you pick a plan</h2>
            <p>Anything not covered here, write to <a href="mailto:info@decane.app" className="ulink">info@decane.app</a>.</p>
          </div>
          <dl>
            {FAQS.map((f) => (
              <div key={f.q} className="faq-card">
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
