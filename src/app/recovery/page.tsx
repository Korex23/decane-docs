"use client";

import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal, Stagger, Item } from "@/components/motion";
import { useTheme } from "@/lib/theme";

// End-user facing recovery guide. Written for the person who owns a wallet,
// not the developer integrating the SDK — plain language, no API names.
// Naming is kept in step with the wallet modal: "recovery file" (one share,
// safe anywhere) vs "full recovery file" (two shares, bearer secret).
//
// The one source for this text: there is no markdown twin. Since 2.27 the
// easy way is signing in again — for every wallet, not only where a passkey
// synced — and some apps (the identity tier) never ask for a passkey or
// password at all; that tier's plain-words security statement is here too.
interface Scenario {
  id: string;
  who: string;
  tone: "accent" | "warn" | "neutral";
  title: string;
  lede: string;
  steps: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "new-device", who: "Everyone", tone: "accent", title: "Signing in on a new device",
    lede: "Nothing to remember, nothing to type in.",
    steps: [
      "Sign in the way you always do.",
      "Your wallet is back. Same addresses, same balance.",
      "Some apps then ask you to add a passkey or password on this device.",
    ],
  },
  {
    id: "compromised", who: "Some apps", tone: "warn", title: "Apps that ask for nothing more",
    lede: "Here your wallet is exactly as safe as the account you sign in with.",
    steps: [
      "Signing in is the whole ceremony. Nothing is kept on your device between visits.",
      "Anyone who can sign in as you can use your wallet. Use a strong password and two-factor.",
      "You get an email on every new device. If it wasn't you, the app's support can freeze the wallet.",
    ],
  },
  {
    id: "recovery-file", who: "Optional", tone: "neutral", title: "Restoring from your recovery file",
    lede: "For when Decane is unreachable. Safe in a password manager.",
    steps: [
      "Sign in as usual. If the easy way fails, you'll be asked for the file and its password.",
      "Your wallet is restored.",
      "Save the new recovery file you're given. The old one stops working.",
    ],
  },
];

const FAQS: Array<{ q: string; a: string }> = [
  { q: "Why is my recovery file safe in a password manager?", a: "It holds one of three pieces. One piece alone can't sign anything or move funds, so it isn't a secret the way a seed phrase is." },
  { q: "Why does using it give me a new one?", a: "Each restore retires the file and issues a fresh one. Save the new file before moving on." },
  { q: "What is a full recovery file?", a: "An optional backup holding two of the three pieces. With its password it is full control of the wallet, so keep it offline, never in a cloud drive." },
  { q: "Someone else signed in as me. What now?", a: "Change that account's password and sign out its other sessions, then ask the app's support to freeze the wallet while you sort it out." },
  { q: "What if I lose everything?", a: "Lose the sign-in account with no recovery file and the wallet can't be recovered by anyone. Recover the account and you recover the wallet. If only Decane is unreachable, the wallet simply waits." },
];

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export default function RecoveryGuidePage() {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="site" data-theme={theme}>
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />

      <header className="hero page-head">
        <Reveal className="container hero-inner">
          <div className="eyebrow">For wallet owners</div>
          <h1>Lost your phone? Your wallet isn&rsquo;t lost.</h1>
          <p className="lede">Three pieces protect your wallet; any two open it. Sign in on the new device and it&rsquo;s back.</p>
          <div className="hero-actions" style={{ marginTop: 32 }}>
            <a href="#new-device" className="btn btn-primary btn-lg">I have a new device</a>
            <a href="#recovery-file" className="btn btn-secondary btn-lg">I have a recovery file</a>
            <a href="#compromised" className="btn btn-secondary btn-lg">Someone signed in as me</a>
          </div>
        </Reveal>
      </header>

      <section style={{ padding: "24px 0 0" }}>
        <div className="container">
          <Reveal className="panel protect">
            <div className="protect-head">
              <div>
                <div className="eyebrow">How it&rsquo;s protected</div>
                <h2>Three pieces. Any two open the wallet.</h2>
              </div>
              <span className="status-pill">No seed phrase, ever</span>
            </div>
            <Stagger className="pieces" delay={0.1}>
              <Item className="piece">
                <span className="icon-box"><svg width="18" height="18" viewBox="0 0 24 24" {...line}><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M11 18h2" /></svg></span>
                <h3>Your device</h3>
                <p>Issued each session. Some apps guard it with a passkey or password.</p>
              </Item>
              <Item className="piece">
                <span className="icon-box"><svg width="18" height="18" viewBox="0 0 24 24" {...line}><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="M7 7h.01M7 17h.01" /></svg></span>
                <h3>Our server</h3>
                <p>Encrypted at rest. Never a full key, never signs on its own.</p>
              </Item>
              <Item className="piece">
                <span className="icon-box"><svg width="18" height="18" viewBox="0 0 24 24" {...line}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg></span>
                <h3>The sealed piece</h3>
                <p>Opened by the enclave only after you sign in. Your recovery file is a copy of it.</p>
              </Item>
            </Stagger>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container scenarios">
          {SCENARIOS.map((s) => (
            <Reveal key={s.id} as="section" className="scenario">
              <div id={s.id} style={{ scrollMarginTop: 88 }}>
                <span className={`tag ${s.tone}`}>{s.who}</span>
                <h2>{s.title}</h2>
                <p className="lede-sm">{s.lede}</p>
              </div>
              <ol className="steps">
                {s.steps.map((text, i) => (
                  <li key={i}><span className="n">{i + 1}</span><span>{text}</span></li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="panel glow-tr tool">
            <div className="text">
              <div className="eyebrow">Works without us</div>
              <h2>The offline recovery tool</h2>
              <p>
                Have a <strong>full recovery file</strong>? This page turns it back into your keys,
                in your browser, with no network. Save it next to your file and it keeps working
                without us.
              </p>
              <div className="callout-warn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>
                <p>Download the page, go offline, then open it. Nothing is ever sent anywhere.</p>
              </div>
            </div>
            <div className="tool-actions">
              <a href="/offline-recovery.html" target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">Open the recovery tool</a>
              <a href="/offline-recovery.html" download="decane-offline-recovery.html" className="btn btn-secondary btn-lg">Download for offline use</a>
              <span className="fine">offline-recovery.html · 419 KB · no dependencies</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section pad-b">
        <Reveal className="container faq-grid">
          <div>
            <div className="eyebrow">Questions</div>
            <h2 className="md">Common questions</h2>
            <p>Still unsure? Your app&rsquo;s support can freeze the wallet while you sort it out.</p>
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
