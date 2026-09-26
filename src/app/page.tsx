"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ChainTypeIcon } from "@/components/ChainIcon";
import { CodeBlock } from "@/app/docs/components/CodeBlock";
import { useTheme, DASHBOARD_URL } from "@/lib/theme";
import { VERSIONS, NPM } from "@/lib/versions";

// ─── Hero product mock ───────────────────────────────────────────────────────
// A still of what the user sees: the sign-in sheet, then the wallet that
// comes out of it. Static on purpose; the page has one animated element and
// it is the custody diagram further down.

function GoogleMark({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6 1.5 7.4 2.8l5.4-5.3C33.5 3.9 29.2 2 24 2 15.4 2 8 7 4.7 14.2l6.3 4.9C12.6 13.4 17.8 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46 24.5c0-1.6-.1-2.8-.4-4H24v7.5h12.6c-.3 2.2-1.7 5.5-4.9 7.7l6.1 4.7C41.5 37 46 31.4 46 24.5z" />
      <path fill="#FBBC05" d="M11 29.1a13.9 13.9 0 0 1 0-10l-6.3-4.9A22 22 0 0 0 2 24c0 3.5.8 6.9 2.4 9.8L11 29.1z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.4l-6.1-4.7c-1.7 1.2-4 2-8.4 2-6.2 0-11.4-4-13.1-9.6l-6.3 4.9C7.9 40.9 15.3 46 24 46z" />
    </svg>
  );
}

function HeroMock() {
  return (
    <div className="hero-visual" aria-hidden>
      <div className="mock mock-signin">
        <h4>Sign in</h4>
        <div className="sub">Continue to get your wallet</div>
        <div className="mock-btn"><GoogleMark /> Continue with Google</div>
        <div className="mock-row">
          <div className="mock-btn"><span className="g">X</span></div>
          <div className="mock-btn"><span className="g">K</span></div>
          <div className="mock-btn"><span className="g">#</span></div>
        </div>
        <div className="mock-divider">or</div>
        <div className="mock-input">name@example.com</div>
        <div className="mock-btn primary">Continue with email</div>
        <div className="mock-foot">No seed phrase. No extension.</div>
      </div>
      <div className="mock mock-wallet">
        <div className="head">
          <b>Wallet ready</b>
          <span className="ok">Signed in</span>
        </div>
        <div className="user"><span className="avatar">A</span> ada@example.com</div>
        <ul>
          <li><ChainTypeIcon type="evm" size={18} /><span>Ethereum</span><code>0x7a3f…c21e</code></li>
          <li><ChainTypeIcon type="solana" size={18} /><span>Solana</span><code>9xQe…4kPz</code></li>
          <li><ChainTypeIcon type="tron" size={18} /><span>Tron</span><code>TQn9…Vb3d</code></li>
        </ul>
      </div>
    </div>
  );
}

// ─── Custody diagram ─────────────────────────────────────────────────────────
// Drawn once on load; static under prefers-reduced-motion.

function CustodyDiagram() {
  return (
    <svg className="diagram" viewBox="0 0 600 400" role="img" aria-labelledby="diagram-title diagram-desc">
      <title id="diagram-title">How a Decane wallet key is held</title>
      <desc id="diagram-desc">
        The key is split into three pieces: one for the device, one for Decane, one sealed for
        recovery. Any two can rebuild it, and only inside a sealed, verified environment, for one
        signature. The whole key is never on the device, on the server, or in a browser.
      </desc>
      <g>
        <rect className="node" x="20" y="40" width="150" height="72" rx="6" />
        <text className="lbl" x="36" y="70">On the device</text>
        <text className="sub" x="36" y="90">One piece, per session</text>

        <rect className="node" x="20" y="164" width="150" height="72" rx="6" />
        <text className="lbl" x="36" y="194">With Decane</text>
        <text className="sub" x="36" y="214">One piece, encrypted</text>

        <rect className="node" x="20" y="288" width="150" height="72" rx="6" />
        <text className="lbl" x="36" y="318">For recovery</text>
        <text className="sub" x="36" y="338">One piece, sealed</text>
      </g>
      <path className="wire w1" d="M170 76 C 250 76, 250 200, 330 200" />
      <path className="wire w2" d="M170 200 L 330 200" />
      <path className="wire w3" d="M170 324 C 250 324, 250 200, 330 200" />
      <rect className="enclave" x="330" y="140" width="170" height="120" rx="6" />
      <text className="lbl" x="350" y="170">Sealed signer</text>
      <text className="sub" x="350" y="190">Verified before every use</text>
      <g className="key">
        <rect x="350" y="206" width="130" height="30" rx="4" fill="var(--doc-accent)" opacity="0.16" />
        <text x="362" y="226" fontSize="12" fontWeight="500" style={{ fill: "var(--doc-text)" }}>
          Key exists here only
        </text>
      </g>
      <text className="caption" x="330" y="296">Any two pieces rebuild the key,</text>
      <text className="caption" x="330" y="314">for one signature, then it is gone.</text>
      <text className="never" x="330" y="346">Never on the phone. Never on our servers.</text>
      <text className="never" x="330" y="362">Never in a browser.</text>
    </svg>
  );
}

// ─── Code samples ────────────────────────────────────────────────────────────
// Taken from public/llms.txt and llms-expo.txt so the landing never drifts
// from the spec. Highlighted with the same tok-* classes the docs use.

const HL_KEYWORDS = new Set([
  "const", "let", "var", "await", "async", "new", "import", "export", "from", "return",
  "function", "interface", "type", "true", "false", "null", "undefined", "as", "if",
]);

function hl(code: string): ReactNode[] {
  const re = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:[\d_]*\d)?(?:\.\d+)?n?\b)|([A-Za-z_$][A-Za-z0-9_$]*)|(\s+)|([^\s])/g;
  const out: ReactNode[] = [];
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(code)) !== null) {
    const key = i++;
    if (m[1] !== undefined) out.push(<span key={key} className="tok-c">{m[1]}</span>);
    else if (m[2] !== undefined) out.push(<span key={key} className="tok-s">{m[2]}</span>);
    else if (m[3] !== undefined) out.push(<span key={key} className="tok-n">{m[3]}</span>);
    else if (m[4] !== undefined) {
      const w = m[4];
      const next = code[re.lastIndex];
      if (HL_KEYWORDS.has(w)) out.push(<span key={key} className="tok-k">{w}</span>);
      else if (next === "(") out.push(<span key={key} className="tok-f">{w}</span>);
      else if (/^[A-Z]/.test(w)) out.push(<span key={key} className="tok-t">{w}</span>);
      else out.push(<span key={key} className="tok-id">{w}</span>);
    } else if (m[5] !== undefined) out.push(m[5]);
    else out.push(<span key={key} className="tok-p">{m[6]}</span>);
  }
  return out;
}

const SAMPLES = {
  web: {
    label: "Web",
    lang: "tsx",
    file: "App.tsx",
    code: `import { DecaneKit, useSocialAuth } from 'decane-connect-kit';

function App() {
  return (
    <DecaneKit config={{
      mode: 'social',
      social: { apiKey: 'dck_live_...', authMethods: ['google', 'email'] },
    }}>
      <SignInButton />
    </DecaneKit>
  );
}

function SignInButton() {
  const { isConnected, addresses, signInWithGoogle } = useSocialAuth();
  if (isConnected) return <div>Signed in: {addresses?.evm}</div>;
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}`,
  },
  expo: {
    label: "React Native",
    lang: "ts",
    file: "wallet.ts",
    code: `import { createDecaneConnect } from "decane-connect-kit-expo";

const decane = await createDecaneConnect({
  appId:       "proj_...",
  apiKey:      "dck_live_...",
  chains:      ["evm:8453", "solana:mainnet"],
  authMethods: ["email"],
});

await decane.connectWithEmail("user@example.com");
await decane.verifyEmailCode("user@example.com", "123456");

const { evm, solana, tron } = decane.getAddresses()!;
await decane.sendTransaction({ chain: "evm:8453", to: "0x...", value: 10_000n });`,
  },
  node: {
    label: "Your backend",
    lang: "ts",
    file: "auth.ts",
    code: `import { DecaneClient } from 'decane-node';

const decane = new DecaneClient({ appId: process.env.DECANE_APP_ID });

// The client sends its Decane token as a bearer token.
const claims = await decane.verifyAccessToken(token);
claims.userId;

const user = await decane.getUser(token); // { id, addresses, linkedAccounts }`,
  },
} as const;

type SampleKey = keyof typeof SAMPLES;

function IntegrationCode() {
  const [tab, setTab] = useState<SampleKey>("web");
  const s = SAMPLES[tab];
  return (
    <div>
      <div className="code-tabs" role="tablist">
        {(Object.keys(SAMPLES) as SampleKey[]).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            className={`code-tab${tab === k ? " active" : ""}`}
            onClick={() => setTab(k)}
          >
            {SAMPLES[k].label}
          </button>
        ))}
      </div>
      <CodeBlock lang={s.lang} file={s.file}>{hl(s.code)}</CodeBlock>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="site" data-theme={theme}>
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />

      <header className="hero">
        <div className="container hero-grid">
          <div>
            <h1>Turn any <span style={{ whiteSpace: "nowrap" }}>sign-in</span> into a wallet.</h1>
            <p className="lede">
              Your users sign in with Google, email or phone and get a wallet they own, on every
              chain you support. Nothing to install, nothing to write down, and no one can spend
              from it but them. Not even us.
            </p>
            <div className="hero-actions">
              <a href={`${DASHBOARD_URL}/auth/register`} className="btn btn-primary btn-lg">Start free</a>
              <Link href="/docs" className="btn btn-secondary btn-lg">Read the docs</Link>
            </div>
          </div>
          <HeroMock />
        </div>
      </header>

      <div className="container">
        <div className="outcomes">
          <div className="outcome">
            <h3>Feels like any app</h3>
            <p>Sign-up takes the same ten seconds it takes everywhere else. No wallet extension, no seed phrase, no crypto vocabulary on day one.</p>
          </div>
          <div className="outcome">
            <h3>One account, every chain</h3>
            <p>A single sign-in gives the user Ethereum, Solana and Tron addresses that stay the same on every device and in every app on your project.</p>
          </div>
          <div className="outcome">
            <h3>Nobody can spend it but them</h3>
            <p>The key is split three ways and only ever comes together inside a sealed signer. A breach of our database gives an attacker nothing they can use.</p>
          </div>
        </div>
      </div>

      <section className="section" style={{ borderTop: 0, paddingTop: 88 }}>
        <div className="container">
          <div className="feature">
            <div className="feature-text">
              <h2>Sign in the way people already do</h2>
              <p>
                Google, email, phone, X and KingsChat are built in. Bring your own login and Decane
                accepts it too, so users who already have an account with you get a wallet without
                signing up again.
              </p>
              <p>
                Someone who signs in with Google today and with the same email tomorrow is one user
                with one wallet.
              </p>
            </div>
            <div className="feature-visual">
              <div className="providers">
                <span className="chip"><GoogleMark size={20} /> Google</span>
                <span className="chip"><span className="g">@</span> Email</span>
                <span className="chip"><span className="g">#</span> Phone</span>
                <span className="chip"><span className="g">X</span> X</span>
                <span className="chip"><span className="g">K</span> KingsChat</span>
                <span className="chip"><span className="g">…</span> Your own login</span>
              </div>
            </div>
          </div>

          <div className="feature flip">
            <div className="feature-text">
              <h2>One wallet across Ethereum, Solana and Tron</h2>
              <p>
                Every user gets addresses on all three from one sign-in, with Base, Arbitrum,
                Polygon and every other EVM network included. Send, sign and switch chains with the
                same calls whichever network the user is on.
              </p>
              <div className="hero-actions">
                <Link href="/docs#chain-list" className="btn btn-secondary">See the full chain list</Link>
              </div>
            </div>
            <div className="feature-visual">
              <div className="chains">
                <div className="chain-card">
                  <div className="top"><ChainTypeIcon type="evm" size={24} /> Ethereum</div>
                  <p>Mainnet plus 58 more EVM networks, and any custom chain you register.</p>
                  <code>0x7a3f…c21e</code>
                </div>
                <div className="chain-card">
                  <div className="top"><ChainTypeIcon type="solana" size={24} /> Solana</div>
                  <p>Mainnet and devnet, with native transaction signing.</p>
                  <code>9xQe…4kPz</code>
                </div>
                <div className="chain-card">
                  <div className="top"><ChainTypeIcon type="tron" size={24} /> Tron</div>
                  <p>Mainnet and Shasta, for the apps where Tron is where the users are.</p>
                  <code>TQn9…Vb3d</code>
                </div>
              </div>
            </div>
          </div>

          <div className="feature">
            <div className="feature-text">
              <h2>Keys that cannot be stolen from a database</h2>
              <p>
                The moment a wallet is created its key is split into three pieces. One piece is on
                its own useless. The pieces only come together inside a sealed signer that both
                our apps and yours verify before trusting, and only for the instant it takes to
                sign.
              </p>
              <p>
                If a user&rsquo;s phone is stolen, the thief has one piece. If our servers were
                breached, the attacker has one piece. Neither can spend a cent.
              </p>
            </div>
            <div className="feature-visual">
              <CustodyDiagram />
            </div>
          </div>

          <div className="feature flip">
            <div className="feature-text">
              <h2>Lose the phone, keep the wallet</h2>
              <p>
                There is no seed phrase to lose because there is nothing to write down. A user who
                gets a new device signs in as usual and their wallet is back, same addresses, same
                balance.
              </p>
              <p>
                For the cautious there is an optional recovery file that works even if Decane is
                unreachable. It is safe to keep in a password manager, because on its own it cannot
                spend anything.
              </p>
              <div className="hero-actions">
                <Link href="/recovery" className="btn btn-secondary">How recovery works</Link>
              </div>
            </div>
            <div className="feature-visual">
              <ol className="steps">
                <li><span><strong>Sign in on the new device.</strong> Google, email, phone: whatever the user used before.</span></li>
                <li><span><strong>The wallet comes back.</strong> Same addresses, same balance, nothing to enter.</span></li>
                <li><span><strong>Protect it there, if your app asks.</strong> A passkey or a password on that device, and the user is done.</span></li>
              </ol>
            </div>
          </div>

          <div className="feature">
            <div className="feature-text">
              <h2>Already have a wallet? Connect it.</h2>
              <p>
                The same kit connects wallets your users already have, so one integration covers
                the person arriving with MetaMask and the person arriving with nothing.
              </p>
            </div>
            <div className="feature-visual">
              <ul className="wallets">
                <li><ChainTypeIcon type="evm" size={20} /> MetaMask, Rabby, Coinbase Wallet <span>and any EVM wallet</span></li>
                <li><ChainTypeIcon type="solana" size={20} /> Phantom, Solflare, Backpack <span>and any Solana wallet</span></li>
                <li><ChainTypeIcon type="tron" size={20} /> TronLink <span>Tron</span></li>
                <li><ChainTypeIcon type="bitcoin" size={20} /> Unisat, Xverse, OKX <span>Bitcoin</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container integration">
          <div>
            <h2>Ship it in an afternoon</h2>
            <p className="lede" style={{ marginTop: 14 }}>
              Wrap your app once and you have sign-in, wallets, signing and sessions. Your backend
              verifies who is calling with one line. Web, React Native and Node, from one dashboard
              and one API key.
            </p>
            <ul className="plain-list" style={{ marginTop: 22 }}>
              <li><a className="link" href={NPM.web} target="_blank" rel="noreferrer">decane-connect-kit</a><span>Web, {VERSIONS.web}</span></li>
              <li><a className="link" href={NPM.expo} target="_blank" rel="noreferrer">decane-connect-kit-expo</a><span>React Native, {VERSIONS.expo}</span></li>
              <li><a className="link" href={NPM.node} target="_blank" rel="noreferrer">decane-node</a><span>Server, {VERSIONS.node}</span></li>
            </ul>
            <div className="hero-actions">
              <Link href="/docs" className="btn btn-secondary">Read the docs</Link>
            </div>
          </div>
          <IntegrationCode />
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <div>
            <h2>Start free</h2>
            <p>Up to 499 monthly active wallets, every sign-in method, every chain. Upgrade when your users do.</p>
          </div>
          <div className="hero-actions" style={{ marginTop: 0 }}>
            <a href={`${DASHBOARD_URL}/auth/register`} className="btn btn-primary btn-lg">Get an API key</a>
            <Link href="/pricing" className="btn btn-secondary btn-lg">See pricing</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
