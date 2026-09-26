"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { CodeBlock } from "@/app/docs/components/CodeBlock";
import { useTheme, DASHBOARD_URL } from "@/lib/theme";
import { VERSIONS, NPM } from "@/lib/versions";

// ─── Custody diagram ─────────────────────────────────────────────────────────
// The one illustrative element on the page: three shares, any two reconstruct,
// and the only place they meet is the enclave. Drawn once on load; static
// under prefers-reduced-motion.

function CustodyDiagram() {
  return (
    <svg className="diagram" viewBox="0 0 600 400" role="img" aria-labelledby="diagram-title diagram-desc">
      <title id="diagram-title">How a Decane wallet key is held</title>
      <desc id="diagram-desc">
        Three shares: device, server and recovery. Any two reconstruct the key, and only inside the
        attested enclave, for the moment it signs. The key is never assembled on the device, on the
        server, or in a browser.
      </desc>

      {/* shares */}
      <g>
        <rect className="node" x="20" y="40" width="150" height="72" rx="6" />
        <text className="lbl" x="36" y="70">Device share</text>
        <text className="sub" x="36" y="90">Issued per session</text>

        <rect className="node" x="20" y="164" width="150" height="72" rx="6" />
        <text className="lbl" x="36" y="194">Server share</text>
        <text className="sub" x="36" y="214">Encrypted at rest</text>

        <rect className="node" x="20" y="288" width="150" height="72" rx="6" />
        <text className="lbl" x="36" y="318">Recovery share</text>
        <text className="sub" x="36" y="338">Sealed by the enclave</text>
      </g>

      {/* wires into the enclave */}
      <path className="wire w1" d="M170 76 C 250 76, 250 200, 330 200" />
      <path className="wire w2" d="M170 200 L 330 200" />
      <path className="wire w3" d="M170 324 C 250 324, 250 200, 330 200" />

      {/* enclave */}
      <rect className="enclave" x="330" y="140" width="170" height="120" rx="6" />
      <text className="lbl" x="350" y="170">Attested enclave</text>
      <text className="sub" x="350" y="190">Intel TDX, measured</text>
      <g className="key">
        <rect x="350" y="206" width="130" height="30" rx="4" fill="var(--doc-accent)" opacity="0.16" />
        <text x="362" y="226" fontSize="12" fontWeight="500" style={{ fill: "var(--doc-text)" }}>
          Key exists here only
        </text>
      </g>

      {/* caption */}
      <text className="caption" x="330" y="296">Any two shares reconstruct the key,</text>
      <text className="caption" x="330" y="314">for one signature, then it is gone.</text>
      <text className="never" x="330" y="346">Never on the device. Never on the server.</text>
      <text className="never" x="330" y="362">Never in a browser.</text>
    </svg>
  );
}

// ─── Install line ────────────────────────────────────────────────────────────

function InstallLine() {
  const [done, setDone] = useState(false);
  const cmd = "npm install decane-connect-kit";
  function copy() {
    navigator.clipboard?.writeText(cmd).then(() => {
      setDone(true);
      setTimeout(() => setDone(false), 1400);
    });
  }
  return (
    <div className="install">
      <span className="prompt">$</span>
      <span>{cmd}</span>
      <button type="button" className={`copy${done ? " done" : ""}`} onClick={copy} aria-label="Copy install command">
        {done ? "Copied" : "Copy"}
      </button>
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
    label: "Server",
    lang: "ts",
    file: "auth.ts",
    code: `import { DecaneClient } from 'decane-node';

const decane = new DecaneClient({
  appId: process.env.DECANE_APP_ID,
  verificationKey: process.env.DECANE_VERIFICATION_KEY, // or JWKS if unset
});

// Called with the access token the client sends as a bearer token.
const claims = await decane.verifyAccessToken(token); // throws DecaneAuthError
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
            <h1>Wallets behind the sign-in your users already have.</h1>
            <p className="lede">
              A user signs in with Google, email, phone, X, KingsChat or your own JWT and gets EVM,
              Solana and Tron wallets from one key. The key is split three ways and only ever
              reconstructed inside an attested enclave, for the moment it takes to sign.
            </p>
            <div className="hero-actions">
              <a href={`${DASHBOARD_URL}/auth/register`} className="btn btn-primary btn-lg">Get an API key</a>
              <Link href="/docs" className="btn btn-secondary btn-lg">Read the docs</Link>
            </div>
            <InstallLine />
          </div>
          <CustodyDiagram />
        </div>
      </header>

      <div className="container">
        <div className="packages">
          <div className="package">
            <div className="package-name">
              <a href={NPM.web} target="_blank" rel="noreferrer">decane-connect-kit</a>
              <span className="ver">{VERSIONS.web}</span>
            </div>
            <p>React surface and headless client for the web. Also connects installed wallets.</p>
          </div>
          <div className="package">
            <div className="package-name">
              <a href={NPM.expo} target="_blank" rel="noreferrer">decane-connect-kit-expo</a>
              <span className="ver">{VERSIONS.expo}</span>
            </div>
            <p>Headless client for React Native and Expo, with passkey, keystore or PIN protection.</p>
          </div>
          <div className="package">
            <div className="package-name">
              <a href={NPM.node} target="_blank" rel="noreferrer">decane-node</a>
              <span className="ver">{VERSIONS.node}</span>
            </div>
            <p>Verifies access tokens on your backend and runs server-side sign-in.</p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>How a wallet is held</h2>
            <p className="lede">
              Every wallet is one key, split into three shares with a 2-of-3 threshold. No single
              share is a secret on its own, and no party ever holds two outside the enclave.
            </p>
          </div>
          <table className="spec">
            <thead>
              <tr>
                <th>Share</th>
                <th>Where it lives</th>
                <th>What it does</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Device</th>
                <td>Issued to the user&rsquo;s device for the current session. Depending on the
                  protection tier it is kept under a passkey or password, or not kept at all.</td>
                <td>Pairs with the server share inside the enclave to sign.</td>
              </tr>
              <tr>
                <th>Server</th>
                <td>Held by Decane, encrypted at rest with a key the enclave does not have.</td>
                <td>Released to the enclave only for a signed-in session. A frozen wallet is refused here.</td>
              </tr>
              <tr>
                <th>Recovery</th>
                <td>Sealed by the enclave when the wallet is created, so the enclave alone can open
                  it. Optionally exported to the user as a recovery file.</td>
                <td>Lets a signed-in session on a new device receive a fresh device share, with no
                  seed phrase and no re-split.</td>
              </tr>
            </tbody>
          </table>
          <p className="spec-note">
            Reconstruction happens only inside an Intel TDX enclave whose measurement both SDKs
            verify before they hand it anything. The enclave checks the reconstructed key against
            the wallet&rsquo;s recorded addresses every time a session opens.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Two ways to hold the device share</h2>
            <p className="lede">
              The tier is a property of your app, not of the wallet. Two apps on one project can
              hold the same wallet in different tiers, and a user keeps the same addresses in both.
            </p>
          </div>
          <div className="split">
            <div>
              <span className="tier-tag">protection: &apos;device&apos;</span>
              <h3>Device tier</h3>
              <p>
                The device share is kept on the device, wrapped under a passkey or a password on the
                web and a passkey, keystore or PIN on mobile. Signing needs the device and its
                unlock, so a stolen sign-in account is not enough on its own.
              </p>
              <p>This is the default, and the right choice when the wallet holds value.</p>
            </div>
            <div>
              <span className="tier-tag">protection: &apos;identity&apos;</span>
              <h3>Identity tier</h3>
              <p>
                Nothing is stored on the device and nothing extra is asked of the user. Every visit
                is a sign-in, and the enclave provisions a fresh device share against it. Right for
                apps where the wallet is a feature rather than the point.
              </p>
              <div className="statement">
                A wallet is exactly as safe as the user&rsquo;s identity-provider account plus
                Decane (the JWT signing key and the attested enclave). Anyone who can obtain a valid
                Decane session for the user can sign. There is no device-bound factor. Mitigations:
                a new-device email on every provision from an unseen device, a per-user freeze
                switch operated by Decane, and (follow-up) a fresh sign-in requirement for
                high-value operations.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Sign-in methods and chains</h2>
            <p className="lede">
              Identity linking resolves a Google and an email sign-in with the same verified
              address to one user. Every chain id is CAIP-2.
            </p>
          </div>
          <div className="split">
            <div>
              <h3>Sign in with</h3>
              <ul className="plain-list">
                <li><span>Google</span><span>Redirect on the web, in-app sheet on mobile</span></li>
                <li><span>Email</span><span>One-time code</span></li>
                <li><span>Phone</span><span>One-time code by SMS</span></li>
                <li><span>X</span><span>Handle as the profile name</span></li>
                <li><span>KingsChat</span><span>Popup or token exchange</span></li>
                <li><span>Your own JWT</span><span>Any issuer with a JWKS</span></li>
              </ul>
            </div>
            <div>
              <h3>Wallets on</h3>
              <ul className="plain-list">
                <li><span>EVM</span><span>59 built-in chains, custom chains registered at init</span></li>
                <li><span>Solana</span><span>Mainnet and devnet</span></li>
                <li><span>Tron</span><span>Mainnet and Shasta</span></li>
                <li><span>Installed wallets</span><span>EIP-6963, Wallet Standard, TronLink, Unisat. Never window.ethereum</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container integration">
          <div>
            <h2>The same hooks either way</h2>
            <p className="lede" style={{ marginTop: 14 }}>
              Wrap the app once. Whether a user signs in with Google or connects a wallet they
              already have, signing, sessions and chain switching look the same to your code.
              Sessions last eight hours and both client SDKs renew them before they lapse.
            </p>
            <p className="lede" style={{ marginTop: 12 }}>
              On the server, one call verifies the access token and resolves the user&rsquo;s
              addresses.
            </p>
            <div className="hero-actions">
              <Link href="/docs" className="btn btn-secondary">Web and React Native docs</Link>
              <Link href="/node-docs" className="btn btn-secondary">Node docs</Link>
            </div>
          </div>
          <IntegrationCode />
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <div>
            <h2>Start on the free tier</h2>
            <p>Up to 499 monthly active wallets, one project, every sign-in method. Upgrade when usage grows.</p>
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
