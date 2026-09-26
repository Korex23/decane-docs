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
    lede: "The common case. Nothing to remember, nothing to type in.",
    steps: [
      "Sign in the way you always do: Google, email, phone, or whatever the app offers.",
      "Your wallet is back. Same addresses, same balance. Signing in proves who you are; the enclave then hands your new device its own piece of the wallet.",
      "Some apps then ask you to protect the wallet on this device with a passkey (fingerprint, face or device passcode) or a password. Others never ask; see below.",
    ],
  },
  {
    id: "compromised", who: "Some apps", tone: "warn", title: "Apps that ask for nothing more",
    lede: "In these apps your wallet is exactly as safe as the account you sign in with.",
    steps: [
      "Social apps, where a wallet is a feature rather than the point, may never ask you to set up a passkey, a password or a backup. Signing in is the whole ceremony, every visit, and nothing about your wallet is kept on your device between visits.",
      "Anyone who can sign in as you can use your wallet. So protect that account with a strong password and two-factor authentication, as you would for your email.",
      "Two things we do for you: you get an email whenever your wallet is opened from a device you have not used before, and if it was not you, the app's support can freeze your wallet. Nothing can be sent from it, by anyone, until it is unfrozen. Signing in still works; spending does not.",
    ],
  },
  {
    id: "recovery-file", who: "Optional", tone: "neutral", title: "Restoring from your recovery file",
    lede: "For when Decane's servers are unreachable. Safe to keep in a password manager.",
    steps: [
      "You may have saved a small file when you created your wallet, or from settings later: your recovery file. It is optional. It exists so you can open your wallet even if Decane's servers are unreachable.",
      "Sign in the way you always do. If the wallet cannot be restored the easy way, you will be asked to upload the file and enter its password.",
      "Your wallet is restored. You will be given a new recovery file. Save it; the old one stops working the moment the new one exists.",
    ],
  },
];

const FAQS: Array<{ q: string; a: string }> = [
  { q: "Why is my recovery file safe to keep in a password manager?", a: "It holds only one of the three pieces that protect your wallet. One piece on its own cannot sign anything or move funds. It is not a smaller secret; it is no secret. That is the real difference from a seed phrase, and it is why storing it in a password manager or cloud drive is fine by design, not a risk you are accepting for convenience." },
  { q: "Why does using my recovery file give me a new one?", a: "Each time a recovery file restores your wallet, it is retired and a fresh one is issued in its place. You will be prompted to save the new file right away; do that before moving on. The old one stops working the moment the new one is created." },
  { q: "What is a full recovery file, and do I need one?", a: "It is an optional, more powerful backup you can create from your wallet settings. Unlike the ordinary recovery file, it contains two of the three pieces, so the file plus its password is complete control of your wallet. Keep it offline (an encrypted USB drive, or printed in a safe), never in a cloud drive. Most people never need one." },
  { q: "Someone else signed in as me. What do I do?", a: "Change the password of the account you sign in with right away and sign out of its other sessions; that account is the key. Then contact the app's support and ask for your wallet to be frozen while you sort it out. Unfreezing restores it exactly; nothing about the wallet moves. You will usually learn about it from the new-device email." },
  { q: "What if I lose everything?", a: "If you lose the account you sign in with, and you have no recovery file and no full recovery file, your wallet cannot be recovered, not by you, not by anyone. Signing in is the key, so guard that account as you would the wallet itself. Recovering the account (through Google, your email provider or your phone number) recovers the wallet with it. If it is Decane that is unreachable, nothing is lost: the wallet waits." },
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
                <p>Issued for this session. Some apps guard it with a passkey or password; others issue a fresh one each sign-in.</p>
              </Item>
              <Item className="piece">
                <span className="icon-box"><svg width="18" height="18" viewBox="0 0 24 24" {...line}><rect x="3" y="4" width="18" height="6" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="M7 7h.01M7 17h.01" /></svg></span>
                <h3>Our server</h3>
                <p>Encrypted at rest. Never a full key, never signs on its own.</p>
              </Item>
              <Item className="piece">
                <span className="icon-box"><svg width="18" height="18" viewBox="0 0 24 24" {...line}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg></span>
                <h3>The sealed piece</h3>
                <p>Locked in the signing enclave, opened only after you sign in. Your optional recovery file is a copy of this one.</p>
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
                Have a <strong>full recovery file</strong>? This standalone page turns it back into
                your keys, entirely in your browser, with no network. Save it next to your recovery
                file and it keeps working indefinitely.
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
