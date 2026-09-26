"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ChainTypeIcon } from "@/components/ChainIcon";
import { GoogleMark, XLogo, MailIcon, PhoneIcon, ChatIcon, KeyIcon } from "@/components/Icons";
import { CodeBlock } from "@/app/docs/components/CodeBlock";
import { useTheme, DASHBOARD_URL } from "@/lib/theme";
import { VERSIONS, NPM } from "@/lib/versions";

// ─── Hero product mock ───────────────────────────────────────────────────────
// A still of what the user sees: the sign-in sheet, then the wallet that
// comes out of it. Static on purpose.

function HeroMock() {
  return (
    <div className="hero-visual" aria-hidden>
      <div className="mock mock-signin">
        <h4>Sign in</h4>
        <div className="sub">Continue to get your wallet</div>
        <div className="mock-btn"><GoogleMark /> Continue with Google</div>
        <div className="mock-row">
          <div className="mock-btn"><XLogo size={15} /></div>
          <div className="mock-btn"><ChatIcon size={17} /></div>
          <div className="mock-btn"><PhoneIcon size={17} /></div>
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
                <span className="chip"><MailIcon size={20} /> Email</span>
                <span className="chip"><PhoneIcon size={20} /> Phone</span>
                <span className="chip"><XLogo size={17} /> X</span>
                <span className="chip"><ChatIcon size={20} /> KingsChat</span>
                <span className="chip"><KeyIcon size={20} /> Your own login</span>
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

          <div className="feature flip">
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
