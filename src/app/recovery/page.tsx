"use client";

import { Reveal, Stagger, Item } from "@/components/motion";
import { PageShell, Tab, Arrow, Faq } from "@/components/ProductPage";

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
    id: "new-device",
    who: "Everyone",
    tone: "accent",
    title: "Signing in on a new device",
    lede: "Nothing to remember, nothing to type in.",
    steps: [
      "Sign in the way you always do.",
      "Your wallet is back. Same addresses, same balance.",
      "Some apps then ask you to add a passkey or password on this device.",
    ],
  },
  {
    id: "compromised",
    who: "Some apps",
    tone: "warn",
    title: "Apps that ask for nothing more",
    lede: "Here your wallet is exactly as safe as the account you sign in with.",
    steps: [
      "Signing in is the whole ceremony. Nothing is kept on your device between visits.",
      "Anyone who can sign in as you can use your wallet. Use a strong password and two-factor.",
      "You get an email on every new device. If it wasn't you, the app's support can freeze the wallet.",
    ],
  },
  {
    id: "recovery-file",
    who: "Optional",
    tone: "neutral",
    title: "Restoring from your recovery file",
    lede: "For when Decane is unreachable. Safe in a password manager.",
    steps: [
      "Sign in as usual. If the easy way fails, you'll be asked for the file and its password.",
      "Your wallet is restored.",
      "Save the new recovery file you're given. The old one stops working.",
    ],
  },
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Why is my recovery file safe in a password manager?",
    a: "It holds one of three pieces. One piece alone can't sign anything or move funds, so it isn't a secret the way a seed phrase is.",
  },
  {
    q: "Why does using it give me a new one?",
    a: "Each restore retires the file and issues a fresh one. Save the new file before moving on.",
  },
  {
    q: "What is a full recovery file?",
    a: "An optional backup holding two of the three pieces. With its password it is full control of the wallet, so keep it offline, never in a cloud drive.",
  },
  {
    q: "Someone else signed in as me. What now?",
    a: "Change that account's password and sign out its other sessions, then ask the app's support to freeze the wallet while you sort it out.",
  },
  {
    q: "What if I lose everything?",
    a: "Lose the sign-in account with no recovery file and the wallet can't be recovered by anyone. Recover the account and you recover the wallet. If only Decane is unreachable, the wallet simply waits.",
  },
];

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const ICONS = [
  <svg key="d" width="20" height="20" viewBox="0 0 24 24" {...line}>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <path d="M11 18h2" />
  </svg>,
  <svg key="s" width="20" height="20" viewBox="0 0 24 24" {...line}>
    <rect x="3" y="4" width="18" height="6" rx="1.5" />
    <rect x="3" y="14" width="18" height="6" rx="1.5" />
    <path d="M7 7h.01M7 17h.01" />
  </svg>,
  <svg key="r" width="20" height="20" viewBox="0 0 24 24" {...line}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>,
];

const PIECES = [
  { title: "Your device", body: "Issued each session. Some apps guard it with a passkey or password." },
  { title: "Our server", body: "Encrypted at rest. Never a full key, never signs on its own." },
  { title: "The sealed piece", body: "Opened by the enclave only after you sign in. Your recovery file is a copy of it." },
];

export default function RecoveryGuidePage() {
  return (
    <PageShell
      eyebrow="For wallet owners"
      title={<>Lost your phone? Your wallet isn&rsquo;t lost.</>}
      lede="Three pieces protect your wallet; any two open it. Sign in on the new device and it’s back."
      narrow
      actions={
        <>
          <a href="#new-device" className="k-btn k-btn-primary">
            I have a new device
          </a>
          <a href="#recovery-file" className="k-btn k-btn-light">
            I have a recovery file
          </a>
          <a href="#compromised" className="k-btn k-btn-light">
            Someone signed in as me
          </a>
        </>
      }
    >
      <section className="k-section" style={{ paddingTop: 32 }}>
        <div className="k-wrap">
          <Reveal className="pg-head-row">
            <h2 className="k-h2 k-h2-narrow">Three pieces. Any two open the wallet.</h2>
            <span className="k-soon">No seed phrase, ever</span>
          </Reveal>
          <Stagger className="p-cards" delay={0.08}>
            {PIECES.map((piece, i) => (
              <Item key={piece.title} className="p-card">
                <span className="pg-icon">{ICONS[i]}</span>
                <h3>{piece.title}</h3>
                <p>{piece.body}</p>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="k-section k-tinted">
        <Tab />
        <div className="k-wrap">
          <Reveal>
            <h2 className="k-h2 k-h2-narrow">What to do, step by step</h2>
          </Reveal>
          <div className="pg-scenarios">
            {SCENARIOS.map((s) => (
              <Reveal key={s.id} className="pg-scenario">
                <div id={s.id} className="pg-scenario-head">
                  <span className={`pg-tag ${s.tone}`}>{s.who}</span>
                  <h3>{s.title}</h3>
                  <p>{s.lede}</p>
                </div>
                <ol className="pg-steps">
                  {s.steps.map((text, i) => (
                    <li key={i}>
                      <span className="p-step-n">{String(i + 1).padStart(2, "0")}</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="k-section">
        <div className="k-wrap">
          <Reveal className="pg-tool">
            <div>
              <span className="p-eyebrow">Works without us</span>
              <h2 className="k-h2 k-h2-narrow">The offline recovery tool</h2>
              <p className="k-lead">
                Have a <strong>full recovery file</strong>? This page turns it back into your keys, in your browser, with no
                network. Save it next to your file and it keeps working without us.
              </p>
              <p className="pg-warn">Download the page, go offline, then open it. Nothing is ever sent anywhere.</p>
            </div>
            <div className="pg-tool-actions">
              <a href="/offline-recovery.html" target="_blank" rel="noreferrer" className="k-btn k-btn-primary">
                Open the recovery tool <Arrow />
              </a>
              <a href="/offline-recovery.html" download="decane-offline-recovery.html" className="k-btn k-btn-light">
                Download for offline use
              </a>
              <span>offline-recovery.html · 419 KB · no dependencies</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="k-section" style={{ paddingTop: 0 }}>
        <div className="k-wrap pg-faq">
          <Reveal>
            <h2 className="k-h2 k-h2-narrow">Common questions</h2>
            <p className="k-lead">Still unsure? Your app&rsquo;s support can freeze the wallet while you sort it out.</p>
          </Reveal>
          <Faq items={FAQS} />
        </div>
      </section>
    </PageShell>
  );
}
