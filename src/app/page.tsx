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
import { HeroScene } from "@/components/HeroScene";
import { EnclaveTour } from "@/components/EnclaveTour";
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

const ServerArt = () => (
  <div className="art-code">
    <code>
      <i>await</i> decane.createUser(&#123; type: &quot;email&quot;,
    </code>
    <code>&nbsp;&nbsp;value: &quot;ada@example.com&quot; &#125;)</code>
    <small>wallet ready before the first sign-in</small>
  </div>
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


// ─── Three products, one key ─────────────────────────────────────────────────

type Product = "wallets" | "gas" | "rpc";

const Soon = () => <span className="lp-soon">Coming soon</span>;

const WalletMock = () => (
  <div className="pm pm-wallet" aria-hidden="true">
    <div className="pm-card">
      <small>Sign in to Northgate</small>
      <span className="pm-btn">
        <GoogleMark size={13} /> Continue with Google
      </span>
      <span className="pm-field">ada@example.com</span>
    </div>
    <div className="pm-chip">
      <i /> 0x7a3f…c21e <b>Wallet ready</b>
    </div>
  </div>
);

const GasMock = () => (
  <div className="pm pm-gas" aria-hidden="true">
    <div className="pm-card">
      <small>Send</small>
      <strong>25.00 USDC</strong>
      <div className="pm-row">
        <span>To</span>
        <span>shop.base.eth</span>
      </div>
      <div className="pm-row">
        <span>Network fee</span>
        <span>
          <s>$0.004</s> <em>Sponsored</em>
        </span>
      </div>
      <span className="pm-btn solid">Send</span>
    </div>
  </div>
);

const RpcMock = () => (
  <div className="pm pm-rpc" aria-hidden="true">
    <code className="pm-url">…/rpc/v1/8453/dck_rpc_…</code>
    <div className="pm-card">
      <div className="pm-row">
        <span>This second</span>
        <span>
          <b>18</b> / 20 req/s
        </span>
      </div>
      <span className="pm-meter">
        <span />
      </span>
      {[
        ["eth_call", 62],
        ["eth_getLogs", 21],
        ["eth_blockNumber", 11],
      ].map(([m, n]) => (
        <div className="pm-bar" key={m as string}>
          <span>{m}</span>
          <i style={{ width: `${n}%` }} />
        </div>
      ))}
    </div>
  </div>
);

function ProductCards({ onExplore }: { onExplore: (p: Product) => void }) {
  const cards: { id: Product; art: React.ReactNode; title: string; soon?: boolean; body: string }[] = [
    {
      id: "wallets",
      art: <WalletMock />,
      title: "Embedded wallets",
      body: "A wallet for every user the moment they sign in, on Ethereum, Solana and Tron. Theirs alone.",
    },
    {
      id: "gas",
      art: <GasMock />,
      title: "Gas sponsorship",
      soon: true,
      body: "Your users send without holding ETH. You cover the fee, or they pay it in USDC.",
    },
    {
      id: "rpc",
      art: <RpcMock />,
      title: "Decane RPC",
      soon: true,
      body: "Read and write the chain with one URL. 20 requests a second free, 200 in the Builder Club.",
    },
  ];
  return (
    <Stagger className="lp-products" delay={0.08}>
      {cards.map((c) => (
        <Item key={c.id} className="lp-product">
          <div className="lp-product-art">{c.art}</div>
          <h3>
            {c.title} {c.soon && <Soon />}
          </h3>
          <p>{c.body}</p>
          <button type="button" className="lp-more" onClick={() => onExplore(c.id)}>
            How it works <span aria-hidden="true">→</span>
          </button>
        </Item>
      ))}
    </Stagger>
  );
}

const WALLET_SNIPPET = `<DecaneKit config={{
  social: { apiKey: "dck_live_…", authMethods: ["google", "email"] },
}}>
  <App />
</DecaneKit>

// Anywhere inside: sign in, then sign.
const { openModal, signMessage } = useSocialWallet();
await signMessage("evm:8453", "gm");`;

const RPC_SNIPPET = `import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const client = createPublicClient({
  chain: base,
  transport: http("https://backend.decane.app/rpc/v1/8453/dck_rpc_…"),
});

await client.getBlockNumber();`;

const PLATFORM: Record<Product, { label: string; title: string; body: string; checks: string[]; file: string; code: string; soon?: boolean }> = {
  wallets: {
    label: "Wallets",
    title: "A wallet behind every sign-in",
    body: "People sign in the way they already do and get addresses on every chain you support. No extension, no seed phrase, and nobody can move their funds but them.",
    checks: [
      "Google, email, phone, X, KingsChat or your own login",
      "Ethereum, Solana and Tron from one key",
      "A new phone is just another sign-in",
    ],
    file: "app.tsx",
    code: WALLET_SNIPPET,
  },
  gas: {
    label: "Gas",
    title: "Your users never need gas",
    soon: true,
    body: "A new user has a wallet but no ETH to move anything with. Sponsor the transaction and they just send: you cover the fee, or they pay it in USDC. The address never changes.",
    checks: [
      "Sponsored by default, or paid in USDC",
      "Caps per day and per user, and only the contracts you allow",
      "You pay the gas used plus a small fee; nothing monthly",
    ],
    file: "checkout.ts",
    code: GAS_SNIPPET,
  },
  rpc: {
    label: "RPC",
    title: "Node access on the same account",
    soon: true,
    body: "One URL works in viem, ethers, wagmi, MetaMask or Foundry. The limit belongs to your account and is shared across its projects, with usage per day and per method in the dashboard.",
    checks: [
      "Free: 20 requests a second",
      "Builder Club: 200 a second, free, by application",
      "Base first, with more chains to follow",
    ],
    file: "client.ts",
    code: RPC_SNIPPET,
  },
};

function Platform({ product, setProduct }: { product: Product; setProduct: (p: Product) => void }) {
  const p = PLATFORM[product];
  return (
    <section className="lp-section lp-soft" id="platform">
      <div className="container">
        <Reveal className="lp-title">
          <h2>Wallets, gas and RPC. One key.</h2>
          <p>Everything your app needs onchain, from one dashboard and one bill.</p>
        </Reveal>
        <Reveal className="lp-platform" delay={0.06}>
          <div className="lp-platform-list" role="tablist" aria-label="Products">
            {(Object.keys(PLATFORM) as Product[]).map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={k === product}
                className={k === product ? "on" : ""}
                onClick={() => setProduct(k)}
              >
                <small>{PLATFORM[k].label}</small>
                <span>{PLATFORM[k].title}</span>
              </button>
            ))}
          </div>
          <div className="lp-platform-panel" key={product} role="tabpanel">
            <div className="lp-platform-text">
              <h3>
                {p.title} {p.soon && <Soon />}
              </h3>
              <p>{p.body}</p>
              <ul className="lp-ticks">
                {p.checks.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              {product === "rpc" && (
                <div className="lp-plans">
                  <div>
                    <small>Free</small>
                    <b>20</b> req/s
                  </div>
                  <div className="club">
                    <small>Builder Club</small>
                    <b>200</b> req/s
                  </div>
                </div>
              )}
            </div>
            <div className="lp-code">
              <div className="lp-code-head">{p.file}</div>
              <pre>
                <code>{p.code}</code>
              </pre>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Security ────────────────────────────────────────────────────────────────

const SECURITY: { icon: React.ReactNode; title: string; body: string }[] = [
  {
    icon: <KeyIcon size={20} />,
    title: "Split three ways",
    body: "Every key is cut into three shares and any two rebuild it. The device holds one, we hold one encrypted, the enclave seals the third. Our database alone opens nothing.",
  },
  {
    icon: <LockIcon />,
    title: "Whole only inside the enclave",
    body: "Two shares meet inside an attested Intel TDX enclave for the moment it takes to sign, then the key is gone. Never in a browser, on a phone or on our servers.",
  },
  {
    icon: <CheckIcon size={20} />,
    title: "Checked, not trusted",
    body: "Before your app sends anything, it verifies the enclave's hardware quote against a signed manifest. A changed enclave is refused, not believed.",
  },
  {
    icon: <DeviceIcon />,
    title: "Recovery without a seed phrase",
    body: "Lose the phone, sign in on the next one: same addresses, same balance. A full recovery file opens offline, without us.",
  },
];

function Security() {
  return (
    <section className="lp-section" id="security">
      <div className="container lp-sec">
        <Reveal className="lp-sec-head">
          <h2>No one holds the key. Not even us.</h2>
          <p>
            Each layer is there so that no single machine, company or breach can move a user&apos;s
            funds, and so that you can check that for yourself.
          </p>
          <Link href="/docs" className="lp-more">
            Read the security model <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
        <Stagger className="lp-sec-list" delay={0.07}>
          {SECURITY.map((x) => (
            <Item key={x.title} className="lp-sec-item">
              <span className="lp-sec-icon">{x.icon}</span>
              <div>
                <h3>{x.title}</h3>
                <p>{x.body}</p>
              </div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export default function Page() {
  const [theme, toggleTheme] = useTheme();
  const [product, setProduct] = useState<Product>("wallets");
  const explore = (p: Product) => {
    setProduct(p);
    document.getElementById("platform")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="site lp" data-theme={theme}>
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />

      <header className="lp-hero">
        <HeroScene />
        <Stagger className="container lp-hero-inner" inView={false} delay={0.1} start={0.05}>
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

      <section className="lp-section lp-sheet" id="products">
        <div className="container">
          <ProductCards onExplore={explore} />
        </div>
      </section>

      <section className="lp-section" id="how">
        <div className="container">
          <Reveal className="lp-title">
            <h2>Sign in once. Own it everywhere.</h2>
            <p>The person signs in. The key splits three ways. The wallet is ready on every chain.</p>
          </Reveal>
          <FlowPanel />
          <Reveal className="lp-facts" delay={0.08}>
            {[
              ["Sign-in", "Google · email · phone · X · JWT"],
              ["Key model", "Shamir · 2 of 3"],
              ["Signer", "Intel TDX enclave"],
              ["Chains", "EVM · Solana · Tron"],
              ["Sessions", "ES256 · self-renewing"],
            ].map(([k, v]) => (
              <div key={k}>
                <b>{k}</b> {v}
              </div>
            ))}
          </Reveal>
          <Reveal className="lp-center" delay={0.1}>
            <Link href="/demo" className="btn btn-secondary">
              Try the live demo
            </Link>
          </Reveal>
        </div>
      </section>

      <EnclaveTour />

      <section className="lp-section" id="features">
        <div className="container">
          <Reveal className="lp-title">
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
            <Tile art={<ServerArt />} title="Wallets from your server">
              Create a user and their wallet from your backend, before they ever sign in.
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

      <Platform product={product} setProduct={setProduct} />

      <Security />

      <section className="lp-section" id="integrate">
        <div className="container">
          <Reveal className="lp-title">
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
