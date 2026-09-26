"use client";

import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useTheme, DASHBOARD_URL } from "@/lib/theme";
import { Reveal, Stagger, Item } from "@/components/motion";

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
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Free",
    band: "0–499 MAU",
    price: "$0",
    tagline: "Everything you need to ship and test.",
    cta: { label: "Get an API key", href: `${DASHBOARD_URL}/auth/register`, primary: true },
    features: [
      "Up to 499 monthly active wallets",
      "1 project",
      "Every sign-in method",
      "Passkey, password and recovery file",
      "Community support",
    ],
  },
  {
    name: "Scale",
    band: "500–2,499 MAU",
    price: "$254",
    period: "per month",
    tagline: "For apps that have outgrown the free tier.",
    cta: { label: "Talk to us", href: "mailto:info@decane.app?subject=Scale%20plan" },
    featured: true,
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
    period: "per month",
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
      "Dedicated enclave signer",
      "Uptime SLA",
      "SSO for your team",
      "Custom contract and DPA",
    ],
  },
];

const COMPARISON_ROWS: Array<{ label: string; free: string; scale: string; enterprise: string }> = [
  { label: "Monthly active wallets", free: "0–499", scale: "500–9,999", enterprise: "Unlimited" },
  { label: "Projects", free: "1", scale: "Unlimited", enterprise: "Unlimited" },
  { label: "API keys per project", free: "2", scale: "Unlimited", enterprise: "Unlimited" },
  { label: "Google, email, phone, X, KingsChat, custom JWT", free: "Included", scale: "Included", enterprise: "Included" },
  { label: "Custom callback domains", free: "—", scale: "Included", enterprise: "Included" },
  { label: "Analytics export", free: "—", scale: "Included", enterprise: "Included" },
  { label: "Dedicated enclave signer", free: "—", scale: "—", enterprise: "Included" },
  { label: "Support", free: "Community", scale: "Priority", enterprise: "Dedicated, with SLA" },
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "How is a monthly active wallet measured?",
    a: "A wallet counts as active in a calendar month the first time it signs in or signs something that month. Creating a wallet with no activity that month does not count against the limit.",
  },
  {
    q: "What happens if I go over my plan's limit?",
    a: "Existing wallets keep working. New wallet creation pauses until you move to the next band. The project owner is emailed before that happens, not after.",
  },
  {
    q: "Why two price bands under Scale?",
    a: "Usage between 500 and 9,999 monthly active wallets varies a lot. Two bands let the price track actual usage more closely than one flat rate for the whole range.",
  },
  {
    q: "Can I self-host instead?",
    a: "The connector SDK (wallet discovery and CAIP-25 sessions) is MIT licensed and always free to self-host. The hosted sign-in service on this page is the managed backend, sign-in relay and enclave, and it is not offered as a self-hosted package.",
  },
  {
    q: "Does Decane ever see a full private key?",
    a: "No. The key is split into three shares the moment it is generated inside the enclave, and it is only ever reconstructed there, for one signature. Decane's share alone cannot sign anything.",
  },
];

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function PricingPage() {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="site" data-theme={theme}>
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />

      <header className="hero" style={{ paddingBottom: 48 }}>
        <Reveal className="container section-head-stack">
          <h1>Pricing</h1>
          <p className="lede">
            Every plan runs the same wallet model: three shares, an attested enclave, no
            exceptions. Plans differ in usage limits and support, not in how safe a user&rsquo;s
            wallet is.
          </p>
        </Reveal>
      </header>

      <section style={{ paddingBottom: 80 }}>
        <div className="container">
          <Stagger className="plans" delay={0.1}>
            {TIERS.map((t) => (
              <Item key={`${t.name}-${t.band}`} className={`plan${t.featured ? " featured" : ""}`}>
                <div className="plan-name">{t.name}</div>
                <div className="plan-band">{t.band}</div>
                <div className="plan-price">
                  <span className="amount">{t.price}</span>
                  {t.period && <span className="period">{t.period}</span>}
                </div>
                <p className="plan-tagline">{t.tagline}</p>
                <ul>
                  {t.features.map((f) => (
                    <li key={f}>
                      <Check />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href={t.cta.href} className={`btn ${t.cta.primary ? "btn-primary" : "btn-secondary"}`}>
                  {t.cta.label}
                </a>
              </Item>
            ))}
          </Stagger>
          <p className="footnote">Draft pricing. Confirm before promoting publicly.</p>
        </div>
      </section>

      <section className="section">
        <Reveal className="container">
          <div className="section-head">
            <h2>Compare plans</h2>
          </div>
          <table className="compare">
            <thead>
              <tr>
                <th></th>
                <th>Free</th>
                <th>Scale</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((r) => (
                <tr key={r.label}>
                  <th>{r.label}</th>
                  <td>{r.free === "—" ? <span className="no">Not included</span> : r.free}</td>
                  <td>{r.scale === "—" ? <span className="no">Not included</span> : r.scale}</td>
                  <td>{r.enterprise === "—" ? <span className="no">Not included</span> : r.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      <section className="section">
        <Reveal className="container">
          <div className="section-head">
            <h2>Questions</h2>
          </div>
          <dl className="faq">
            {FAQS.map((f) => (
              <div key={f.q}>
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
