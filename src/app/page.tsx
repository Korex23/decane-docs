"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ChainTypeIcon } from "@/components/ChainIcon";
import { Integrations } from "@/components/Integrations";
import {
  GoogleMark,
  XLogo,
  MailIcon,
  PhoneIcon,
  KeyIcon,
  CopyIcon,
  CheckIcon,
} from "@/components/Icons";
import { Reveal, Stagger, Item } from "@/components/motion";
import { useTheme, DASHBOARD_URL } from "@/lib/theme";

// One idea per section, plenty of room around it, and the product itself as
// the picture: the sign-in, the key split and the wallet, then a grid of
// tiles, each with one small illustration of its own.

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;
const DeviceIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...line}>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <path d="M11 18h2" />
  </svg>
);
const ServerIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...line}>
    <rect x="3" y="4" width="18" height="6" rx="1.5" />
    <rect x="3" y="14" width="18" height="6" rx="1.5" />
    <path d="M7 7h.01M7 17h.01" />
  </svg>
);
const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...line}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

// ─── Small pieces ────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: string }) {
  return (
    <div className="lp-eyebrow">
      <span />
      {children}
      <span />
    </div>
  );
}

function InstallLine() {
  const [done, setDone] = useState(false);
  const cmd = "npm install decane-connect-kit";
  return (
    <div className="install">
      <span className="prompt">$</span>
      <span>{cmd}</span>
      <button
        type="button"
        className={`copy${done ? " done" : ""}`}
        onClick={() =>
          navigator.clipboard?.writeText(cmd).then(() => {
            setDone(true);
            setTimeout(() => setDone(false), 1400);
          })
        }
        aria-label={done ? "Copied" : "Copy install command"}
        title="Copy"
      >
        {done ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      </button>
    </div>
  );
}

// ─── The product, end to end: sign in → key split → wallet ready ────────────

function FlowPanel() {
  return (
    <Stagger className="lp-flow" delay={0.14}>
      <Item className="lp-flow-card">
        <div className="lp-flow-head">
          <span className="lp-step">01</span> Sign in
        </div>
        <div className="mock-btn">
          <GoogleMark size={18} /> Continue with Google
        </div>
        <div className="mock-row">
          <div className="mock-btn">
            <XLogo size={15} />
          </div>
          <div className="mock-btn">
            <PhoneIcon size={17} />
          </div>
        </div>
        <div className="mock-input">name@example.com</div>
        <div className="mock-primary">Continue with email</div>
        <p className="foot">The same ten seconds it takes everywhere else.</p>
      </Item>
      <Item className="lp-flow-card">
        <div className="lp-flow-head">
          <span className="lp-step">02</span> Key split three ways
        </div>
        <div className="share-rows">
          {(
            [
              [<DeviceIcon key="d" />, "Your device", "Issued per session"],
              [<ServerIcon key="s" />, "Decane server", "Encrypted at rest"],
              [<LockIcon key="l" />, "Sealed enclave", "Opens only for you"],
            ] as const
          ).map(([icon, title, sub]) => (
            <div className="share-row" key={title}>
              <span className="ib">{icon}</span>
              <span>
                <b>{title}</b>
                <small>{sub}</small>
              </span>
            </div>
          ))}
        </div>
        <p className="foot">Any two open the wallet. No single piece can do anything alone.</p>
      </Item>
      <Item className="lp-flow-card">
        <div className="lp-flow-head">
          <span className="lp-step">03</span> Wallet ready
          <span className="ok">Signed in</span>
        </div>
        <div className="user-row">
          <span className="avatar">A</span>ada@example.com
        </div>
        <ul className="wallet-list">
          <li>
            <ChainTypeIcon type="evm" size={18} />
            Ethereum<code>0x7a3f…c21e</code>
          </li>
          <li>
            <ChainTypeIcon type="solana" size={18} />
            Solana<code>9xQe…4kPz</code>
          </li>
          <li>
            <ChainTypeIcon type="tron" size={18} />
            Tron<code>TQn9…Vb3d</code>
          </li>
        </ul>
        <p className="foot">Same addresses on every device and in every app on your project.</p>
      </Item>
    </Stagger>
  );
}

// ─── Feature tiles, each with one small picture ─────────────────────────────

function Tile({
  art,
  title,
  children,
  dark = false,
}: {
  art: React.ReactNode;
  title: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <Item className={`lp-tile${dark ? " is-dark" : ""}`}>
      <div className="lp-tile-art">{art}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </Item>
  );
}

const SignInArt = () => (
  <div className="art-chips">
    <span>
      <GoogleMark size={14} /> Google
    </span>
    <span>
      <MailIcon size={14} /> Email
    </span>
    <span>
      <PhoneIcon size={14} /> Phone
    </span>
    <span>
      <XLogo size={12} /> X
    </span>
    <span className="dashed">
      <KeyIcon size={14} /> Your login
    </span>
  </div>
);

const ChainsArt = () => (
  <div className="art-chains">
    {(["evm", "solana", "tron"] as const).map((t) => (
      <span key={t}>
        <ChainTypeIcon type={t} size={26} />
      </span>
    ))}
    <em>+58 EVM networks</em>
  </div>
);

const SharesArt = () => (
  <svg viewBox="0 0 160 90" className="art-svg" aria-hidden="true">
    <circle cx="40" cy="58" r="14" className="a-fill" />
    <circle cx="120" cy="58" r="14" className="a-fill" />
    <circle cx="80" cy="20" r="14" className="a-ring" />
    <path d="M54 58h52" className="a-line" />
    <text x="80" y="88" textAnchor="middle" className="a-text">ANY 2 OF 3</text>
  </svg>
);

const RecoveryArt = () => (
  <svg viewBox="0 0 160 90" className="art-svg" aria-hidden="true">
    <rect x="22" y="12" width="34" height="62" rx="7" className="a-ring" />
    <rect x="104" y="12" width="34" height="62" rx="7" className="a-fill-soft" />
    <path d="M62 43h34M90 37l7 6-7 6" className="a-line" />
    <text x="121" y="47" textAnchor="middle" className="a-text-strong">0x7a3f</text>
  </svg>
);

const ConnectArt = () => (
  <div className="art-logos">
    {["MetaMask", "Rabby", "Phantom", "TronLink"].map((w) => (
      <span key={w}>{w}</span>
    ))}
  </div>
);

const GasArt = () => (
  <svg viewBox="0 0 160 90" className="art-svg" aria-hidden="true">
    <path d="M30 76a50 50 0 0 1 100 0" className="a-gauge" />
    <path d="M80 76l24-26" className="a-needle" />
    <circle cx="80" cy="76" r="4" className="a-dot" />
    <text x="80" y="56" textAnchor="middle" className="a-text">ON US</text>
  </svg>
);

const SdkArt = () => (
  <div className="art-code">
    <code>
      <i>const</i> user = <i>await</i> decane
    </code>
    <code>&nbsp;&nbsp;.verifyAccessToken(token)</code>
    <small>Node · Python · Rust · Swift · Kotlin</small>
  </div>
);

const FreeArt = () => (
  <div className="art-price">
    <b>$0</b>
    <small>up to 499 wallets a month</small>
  </div>
);

// ─── Gas sponsorship ─────────────────────────────────────────────────────────

const GAS_SNIPPET = `// The project pays the gas. The user just taps "Send".
const { transactionHash } = await decane.sendSponsoredTransaction({
  chain: "evm:8453",
  to: shop,
  data: checkoutCall,
});

// Or they pay the fee in USDC, never touching ETH
await decane.sendSponsoredTransaction({
  chain: "evm:8453", to: shop, data: checkoutCall,
  payGasWith: { token: USDC },
});`;

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="site lp" data-theme={theme}>
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />

      <header className="lp-hero">
        <Stagger className="container lp-hero-inner" inView={false} delay={0.1} start={0.05}>
          <Item>
            <Eyebrow>Embedded wallets</Eyebrow>
          </Item>
          <Item>
            <h1>
              Turn any <span style={{ whiteSpace: "nowrap" }}>sign-in</span>
              <br />
              into a wallet.
            </h1>
          </Item>
          <Item>
            <p className="lp-lede">
              Your users sign in with Google, email or phone and get a wallet they own, on every
              chain you support. Nothing to install, nothing to write down, and no one can spend
              from it but them. Not even us.
            </p>
          </Item>
          <Item>
            <div className="lp-actions">
              <a href={`${DASHBOARD_URL}/auth/register`} className="btn btn-primary btn-lg">
                Start free
              </a>
              <Link href="/docs" className="btn btn-secondary btn-lg">
                Read the docs
              </Link>
            </div>
          </Item>
          <Item>
            <InstallLine />
          </Item>
          <Item className="lp-stats">
            <div>
              <b>3</b>
              <small>chain families</small>
            </div>
            <div>
              <b>59</b>
              <small>EVM networks</small>
            </div>
            <div>
              <b>2 of 3</b>
              <small>key shares to sign</small>
            </div>
            <div>
              <b>$0</b>
              <small>to start</small>
            </div>
          </Item>
        </Stagger>
      </header>

      <section className="lp-section" id="how">
        <div className="container">
          <Reveal className="lp-title">
            <Eyebrow>How it works</Eyebrow>
            <h2>One sign-in, end to end.</h2>
            <p>The person signs in. The key splits three ways. The wallet is ready on every chain.</p>
          </Reveal>
          <FlowPanel />
          <Reveal className="lp-center" delay={0.1}>
            <Link href="/demo" className="btn btn-secondary">
              Try the live demo
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="lp-section lp-soft" id="features">
        <div className="container">
          <Reveal className="lp-title">
            <Eyebrow>What you get</Eyebrow>
            <h2>Everything a wallet should do.</h2>
            <p>None of what makes them hard.</p>
          </Reveal>
          <Stagger className="lp-tiles" delay={0.06}>
            <Tile art={<SignInArt />} title="Sign in the way people do">
              Google, email, phone and X built in, or your own login. One person, one wallet.
            </Tile>
            <Tile art={<ChainsArt />} title="Ethereum, Solana and Tron">
              Addresses on all three from one sign-in, with Base, Arbitrum, Polygon and more.
            </Tile>
            <Tile art={<SharesArt />} title="Nobody can spend it but them" dark>
              The key only comes together inside a sealed signer. Our database alone is useless.
            </Tile>
            <Tile art={<RecoveryArt />} title="Lose the phone, keep the wallet">
              No seed phrase. Sign in on the new device: same addresses, same balance.
            </Tile>
            <Tile art={<ConnectArt />} title="Bring your own wallet">
              MetaMask, Rabby, Phantom, TronLink and the rest, through the same kit.
            </Tile>
            <Tile art={<GasArt />} title="Gas, sponsored">
              Your project pays the fee, or users pay it in USDC. Same wallet, same address.
            </Tile>
            <Tile art={<SdkArt />} title="Every backend, one line">
              Verify who is calling from Node, Python or Rust; build on iOS and Android too.
            </Tile>
            <Tile art={<FreeArt />} title="Free to start" dark>
              Every sign-in method and every chain. You pay once your users do.
            </Tile>
          </Stagger>
        </div>
      </section>

      <section className="lp-section lp-deep" id="gas">
        <div className="container lp-split">
          <Reveal className="lp-split-text">
            <Eyebrow>Gas sponsorship · New</Eyebrow>
            <h2>Your users never need gas.</h2>
            <p>
              A new user has a wallet but no ETH to move anything with. Sponsor the transaction and
              they just send: your project covers the fee, or they pay it in USDC. The first send
              upgrades the wallet in place, so the address never changes.
            </p>
            <ul className="lp-checks">
              <li>Sponsored by default; batched calls land together</li>
              <li>Pay in USDC, with a capped approval</li>
              <li>Spending limits per person, set by you</li>
            </ul>
          </Reveal>
          <Reveal className="lp-code" delay={0.1}>
            <div className="lp-code-head">checkout.ts</div>
            <pre>
              <code>{GAS_SNIPPET}</code>
            </pre>
          </Reveal>
        </div>
      </section>

      <section className="lp-section" id="integrate">
        <div className="container">
          <Reveal className="lp-title">
            <Eyebrow>Integration</Eyebrow>
            <h2>Ship it in an afternoon.</h2>
            <p>
              Wrap your app once for sign-in, wallets, signing and sessions. Web, React Native, iOS,
              Android and every major backend, from one dashboard and one API key.
            </p>
          </Reveal>
          <Reveal>
            <Integrations />
          </Reveal>
        </div>
      </section>

      <section className="lp-section lp-close" id="start">
        <div className="container">
          <Reveal className="lp-title">
            <h2>Start free. Upgrade when your users do.</h2>
            <p>Up to 499 monthly active wallets, every sign-in method, every chain.</p>
            <div className="lp-actions">
              <a href={`${DASHBOARD_URL}/auth/register`} className="btn btn-primary btn-lg">
                Get an API key
              </a>
              <Link href="/pricing" className="btn btn-secondary btn-lg">
                See pricing
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
