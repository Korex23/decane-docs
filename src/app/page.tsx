"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ChainTypeIcon } from "@/components/ChainIcon";
import { BrandLogo } from "@/components/BrandLogo";
import { Integrations } from "@/components/Integrations";
import { GoogleMark, KeyIcon, CheckIcon } from "@/components/Icons";
import { Reveal, Stagger, Item } from "@/components/motion";
import { useTheme, DASHBOARD_URL } from "@/lib/theme";
import "./landing.css";

// The landing, in the layout of a product page for a platform: a calm
// gradient hero with the three products under it, the stack it works with,
// the numbers, what each product does, how the key is protected and how to
// check that, the SDKs, a live demo and a close. Gas sponsorship and RPC are
// gas sponsorship marked early access while it is switched on per project.

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...line} strokeWidth={2} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const LockIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...line}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);
const DeviceIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...line}>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <path d="M11 18h2" />
  </svg>
);
const SplitIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...line}>
    <circle cx="6" cy="17" r="3" />
    <circle cx="18" cy="17" r="3" />
    <circle cx="12" cy="6" r="3" />
    <path d="M10.5 8.6 7.5 14.4M13.5 8.6l3 5.8M9 17h6" />
  </svg>
);
const ShieldIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...line}>
    <path d="M12 3 5 6v5c0 4.5 3 8.4 7 10 4-1.6 7-5.5 7-10V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

/** The rounded, angled tab a section rises into the one above with. */
const Tab = () => (
  <div className="k-tab" aria-hidden="true">
    <span />
    <svg viewBox="0 0 96 60" width="96" height="60">
      <path d="M0 0H22Q34 0 40 10L62 50Q68 60 80 60H96V60H0Z" fill="currentColor" />
    </svg>
  </div>
);

const Soon = () => <span className="k-soon">Early access</span>;

type Product = "wallets" | "payments" | "gas" | "rpc";

// ─── Product previews ────────────────────────────────────────────────────────

const Copy = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" {...line} strokeWidth={2}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </svg>
);
const Close = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" {...line} strokeWidth={2}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const WalletMock = () => (
  <div className="pm" aria-hidden="true">
    <div className="pm-win">
      <div className="pm-head">
        <span className="pm-app">N</span>
        <span>Sign in to Northgate</span>
        <i className="pm-x">
          <Close />
        </i>
      </div>
      <div className="pm-body">
        <span className="pm-btn">
          <GoogleMark size={14} /> Continue with Google
        </span>
        <span className="pm-div">or</span>
        <span className="pm-input">ada@example.com</span>
        <span className="pm-btn primary">Continue with email</span>
      </div>
      <div className="pm-foot">
        <span className="pm-dot" /> Secured by Decane
      </div>
    </div>
    <div className="pm-toast">
      <i>
        <CheckIcon size={10} />
      </i>
      Wallet created <code>0x7a3f…c21e</code>
    </div>
  </div>
);

const GasMock = () => (
  <div className="pm" aria-hidden="true">
    <div className="pm-win">
      <div className="pm-head">
        <span className="pm-app">N</span>
        <span>Confirm payment</span>
        <i className="pm-x">
          <Close />
        </i>
      </div>
      <div className="pm-body">
        <div className="pm-amount">
          <span className="pm-token">$</span>
          <b>25.00</b> USDC
        </div>
        <dl className="pm-list">
          <div>
            <dt>To</dt>
            <dd>shop.base.eth</dd>
          </div>
          <div>
            <dt>Network</dt>
            <dd>
              <ChainTypeIcon type="evm" size={12} /> Base
            </dd>
          </div>
          <div>
            <dt>Network fee</dt>
            <dd>
              <span className="pm-free">Free</span>
              <small>Paid by Northgate</small>
            </dd>
          </div>
        </dl>
        <span className="pm-btn primary">Confirm</span>
      </div>
    </div>
  </div>
);

const PayMock = () => (
  <div className="pm" aria-hidden="true">
    <div className="pm-win">
      <div className="pm-head">
        <span className="pm-app">N</span>
        <span>Pay Northgate</span>
        <i className="pm-x">
          <Close />
        </i>
      </div>
      <div className="pm-body">
        <div className="pm-amount">
          <span className="pm-token">$</span>
          <b>25.00</b> USDC
        </div>
        <dl className="pm-list">
          <div>
            <dt>Pay with</dt>
            <dd>
              <ChainTypeIcon type="solana" size={12} /> SOL on Solana
            </dd>
          </div>
          <div>
            <dt>Send exactly</dt>
            <dd>
              <b>0.1384 SOL</b>
              <small>Expires in 9:41</small>
            </dd>
          </div>
          <div>
            <dt>Settles as</dt>
            <dd>
              <ChainTypeIcon type="evm" size={12} /> USDC on Base
            </dd>
          </div>
        </dl>
        <span className="pm-btn primary">Paid</span>
      </div>
    </div>
  </div>
);

const RpcMock = () => (
  <div className="pm" aria-hidden="true">
    <div className="pm-win">
      <div className="pm-head">
        <span>Base mainnet</span>
        <span className="pm-live">Live</span>
      </div>
      <div className="pm-body">
        <span className="pm-input mono">
          …/rpc/v1/8453/dck_rpc_•••• <Copy />
        </span>
        <div className="pm-kpis">
          <div>
            <small>Requests · 24h</small>
            <b>1.28M</b>
          </div>
          <div>
            <small>Peak</small>
            <b>
              18<em>/20 rps</em>
            </b>
          </div>
        </div>
        <svg className="pm-chart" viewBox="0 0 200 54" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pmFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#c48f1f" stopOpacity="0.28" />
              <stop offset="1" stopColor="#c48f1f" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 44 L14 40 L28 42 L42 33 L56 36 L70 28 L84 31 L98 22 L112 26 L126 17 L140 21 L154 12 L168 16 L182 9 L200 11 L200 54 L0 54 Z"
            fill="url(#pmFill)"
          />
          <path
            d="M0 44 L14 40 L28 42 L42 33 L56 36 L70 28 L84 31 L98 22 L112 26 L126 17 L140 21 L154 12 L168 16 L182 9 L200 11"
            fill="none"
            stroke="#b07a12"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  </div>
);

const PRODUCTS: { id: Product; art: React.ReactNode; title: string; soon?: boolean; body: string; href?: string }[] = [
  {
    id: "wallets",
    art: <WalletMock />,
    title: "Embedded wallets",
    body: "Give every user a wallet the moment they sign in, on Ethereum, Solana and Tron. Only they can move it.",
  },
  {
    id: "payments",
    art: <PayMock />,
    title: "Crypto payments",
    href: "/payments",
    body: "Take payments in native coins and stablecoins across major networks, settled as USDC to your address. Send a checkout link; users with a Decane wallet just approve.",
  },
  {
    id: "gas",
    art: <GasMock />,
    title: "Gas sponsorship",
    href: "/gas-sponsorship",
    body: "Let users send without holding ETH, and earn on it: they pay the fee in USDC with your markup on top, paid to your wallet on every send.",
  },
  {
    id: "rpc",
    art: <RpcMock />,
    title: "Decane RPC",
    href: "/rpc",
    body: "Read and write the chain from one URL: 20 requests a second free, 200 in the Builder Club.",
  },
];

// ─── What each product does: a list and a picture ────────────────────────────

type SceneNode = { x: number; y: number; w?: number; content: React.ReactNode; tone?: "dark" };

const SCENES: Record<Product, { links: [number, number, number, number][]; nodes: SceneNode[] }> = {
  wallets: {
    links: [
      [38, 30, 72, 22],
      [38, 30, 76, 54],
      [38, 30, 64, 82],
    ],
    nodes: [
      {
        x: 6, y: 18, w: 38,
        content: (
          <>
            <span className="sn-avatar">A</span>
            <div>
              <small>Signed in with Google</small>
              <b>ada@example.com</b>
            </div>
          </>
        ),
      },
      { x: 60, y: 12, content: <><ChainTypeIcon type="evm" size={22} /><div><small>Ethereum · Base</small><b>0x7a3f…c21e</b></div></> },
      { x: 62, y: 45, content: <><ChainTypeIcon type="solana" size={22} /><div><small>Solana</small><b>9xQe…4kPz</b></div></> },
      { x: 50, y: 74, content: <><ChainTypeIcon type="tron" size={22} /><div><small>Tron</small><b>TQr8…Vb3d</b></div></> },
    ],
  },
  payments: {
    links: [
      [51, 46, 64, 26],
      [51, 46, 62, 74],
    ],
    nodes: [
      {
        x: 7, y: 30, w: 44,
        content: (
          <div className="sn-stack">
            <small>Checkout · Northgate</small>
            <b className="sn-big">25.00 USDC</b>
            <span className="sn-row"><span>Paid with</span><span>SOL on Solana</span></span>
            <span className="sn-btn">Paid</span>
          </div>
        ),
      },
      { x: 62, y: 18, content: <><ChainTypeIcon type="evm" size={22} /><div><small>Settled to you · Base</small><b>25.00 USDC</b></div></> },
      { x: 60, y: 66, content: <div><small>Webhook</small><b>payment.completed</b></div> },
    ],
  },
  gas: {
    links: [
      [51, 46, 64, 30],
      [51, 46, 62, 76],
    ],
    nodes: [
      {
        x: 7, y: 30, w: 44,
        content: (
          <div className="sn-stack">
            <small>Send</small>
            <b className="sn-big">25.00 USDC</b>
            <span className="sn-row"><span>Network fee</span><span><s>$0.004</s> <em>Sponsored</em></span></span>
            <span className="sn-btn">Send</span>
          </div>
        ),
      },
      { x: 62, y: 22, content: <div><small>Gas balance · Base</small><b>$412.80</b></div> },
      { x: 60, y: 68, content: <div><small>Cap per user, per day</small><b>$1.00</b></div> },
    ],
  },
  rpc: {
    links: [
      [52, 48, 72, 26],
      [52, 48, 74, 78],
    ],
    nodes: [
      {
        x: 5, y: 30, w: 52, tone: "dark",
        content: (
          <pre className="sn-code">
            <code>
              <i>const</i> client = createPublicClient({"{"}
              {"\n  "}chain: base,
              {"\n  "}transport: http(
              {"\n    "}
              <u>&quot;…/rpc/v1/8453/dck_rpc_…&quot;</u>),
              {"\n"}
              {"}"});
            </code>
          </pre>
        ),
      },
      { x: 64, y: 14, content: <div><small>Free</small><b>20 req/s</b></div> },
      { x: 62, y: 70, content: <div><small>Builder Club</small><b>200 req/s</b></div> },
    ],
  },
};

const USES: { id: Product; label: string; title: string; body: string; soon?: boolean; href?: string }[] = [
  {
    id: "wallets",
    label: "Wallets",
    title: "A wallet behind every sign-in",
    body: "Google, email, phone, X, KingsChat or your own login. No extension, no seed phrase; a new phone is just another sign-in.",
  },
  {
    id: "payments",
    label: "Payments",
    href: "/payments",
    title: "Get paid in crypto, settled in USDC",
    body: "Create a checkout from your server and send the link. Customers pay in the native coin, USDC or USDT on the network they hold it on; you receive USDC at your address and a signed webhook. Cross-chain withdrawals too.",
  },
  {
    id: "gas",
    label: "Gas sponsorship",
    href: "/gas-sponsorship",
    title: "Your users never need gas. You earn on every send.",
    body: "Users pay the fee in USDC with your markup on top, up to 50%, paid to your wallet on-chain with each transaction. Or cover it yourself from a prepaid gas tank. Caps per send, per user and per day.",
  },
  {
    id: "rpc",
    label: "RPC",
    href: "/rpc",
    title: "Node access on the same account",
    body: "One URL for viem, ethers, wagmi or MetaMask. Free gives 20 requests a second; the Builder Club gives 200, free, by application.",
  },
];

// Each product holds the stage for this long, then the next one takes over.
// The fill on the active item's edge is the timer: it pauses while the section
// is hovered, focused or off screen, and with reduced motion it never runs.
const USE_STEP_MS = 6000;

// ─── The products, in one row: pinned while the page scrolls them sideways ──
//
// On a desktop the section holds the screen while scrolling down slides the
// row across, for exactly as long as the row is wider than the screen (no pin
// when all four fit). Phones, tablets and reduced motion get a plain row you
// swipe, snapping card by card.

function ProductTrack({ explore }: { explore: (p: Product) => void }) {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const [distance, setDistance] = useState(0);
  const [rowHeight, setRowHeight] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1001px)");
    const measure = () => {
      setDesktop(mq.matches);
      const v = viewport.current;
      const tr = track.current;
      setDistance(v && tr ? Math.max(0, tr.scrollWidth - v.clientWidth) : 0);
      setRowHeight(v ? v.offsetHeight : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    return () => {
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
    };
  }, []);

  const pinned = desktop && !reduce && distance > 0;

  // While the row is stuck under the nav, every pixel scrolled down moves it a
  // pixel left, until its last card is in view; then the page carries on.
  useEffect(() => {
    if (!pinned) {
      x.set(0);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const sec = section.current;
      const pin = viewport.current;
      if (!sec || !pin) return;
      const stickTop = parseFloat(getComputedStyle(pin).top) || 0;
      const travelled = stickTop - sec.getBoundingClientRect().top;
      x.set(-Math.min(distance, Math.max(0, travelled)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinned, distance, x]);

  return (
    <section
      ref={section}
      className={`k-track-sec${pinned ? " is-pinned" : ""}`}
      style={pinned && rowHeight ? { height: rowHeight + distance } : undefined}
      aria-label="Products"
    >
      <div ref={viewport} className="k-track-pin">
        <motion.div ref={track} className="k-track" style={pinned ? { x } : undefined}>
          {PRODUCTS.map((p) => (
            <div key={p.id} className="k-card">
              <div className="k-card-art">{p.art}</div>
              <div className="k-card-body">
                <h3>
                  {p.title} {p.soon && <Soon />}
                </h3>
                <p>{p.body}</p>
                {p.href ? (
                  <Link href={p.href} className="k-link">
                    Explore <Arrow />
                  </Link>
                ) : (
                  <button type="button" className="k-link" onClick={() => explore(p.id)}>
                    Explore <Arrow />
                  </button>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Uses({ active, setActive }: { active: Product; setActive: (p: Product) => void }) {
  const scene = SCENES[active];
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const next = () => {
    const i = USES.findIndex((u) => u.id === active);
    setActive(USES[(i + 1) % USES.length].id);
  };
  const running = inView && !held;

  return (
    <section
      className="k-section"
      id="products"
      ref={ref}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={(e) => (e.target as HTMLElement).matches(":focus-visible") && setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div className="k-wrap">
        <Reveal>
          <h2 className="k-h2 k-h2-narrow">Everything your app needs onchain</h2>
        </Reveal>
        <div className="k-uses">
          <div className="k-uses-list" role="tablist" aria-label="Products">
            {USES.map((u) => (
              <div key={u.id} className={`k-uses-item${u.id === active ? " on" : ""}`}>
                {u.id === active && (
                  <span
                    key={active}
                    className="k-uses-timer"
                    aria-hidden="true"
                    style={{ animationDuration: `${USE_STEP_MS}ms`, animationPlayState: running ? "running" : "paused" }}
                    onAnimationEnd={next}
                  />
                )}
                <button
                  type="button"
                  role="tab"
                  aria-selected={u.id === active}
                  onClick={() => setActive(u.id)}
                >
                  <small>
                    {u.label} {u.soon && <Soon />}
                  </small>
                  <span className="k-uses-title">{u.title}</span>
                  <span className="k-uses-body">{u.body}</span>
                </button>
                {u.href && u.id === active && (
                  <Link href={u.href} className="k-uses-more">
                    Learn more <Arrow />
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="k-scene" key={active} aria-hidden="true">
            <svg className="k-scene-links" viewBox="0 0 100 100" preserveAspectRatio="none">
              {scene.links.map(([a, b, c, d], i) => (
                <line key={i} x1={a} y1={b} x2={c} y2={d} />
              ))}
            </svg>
            {scene.nodes.map((n, i) => (
              <div
                key={i}
                className={`k-node${n.tone === "dark" ? " dark" : ""}`}
                style={{ left: `${n.x}%`, top: `${n.y}%`, width: n.w ? `${n.w}%` : undefined, animationDelay: `${i * 0.12}s` }}
              >
                {n.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Security ────────────────────────────────────────────────────────────────

const SECURITY = [
  {
    icon: <SplitIcon size={34} />,
    title: "Split three ways",
    body: "Every key is cut into three shares and any two rebuild it. The device holds one, we hold one encrypted, and the enclave seals the third. Our database alone opens nothing.",
  },
  {
    icon: <LockIcon size={34} />,
    title: "Whole only inside the enclave",
    body: "Two shares meet inside an attested Intel TDX enclave for the moment it takes to sign, then the key is gone. Never in a browser, on a phone or on our servers.",
  },
  {
    icon: <ShieldIcon size={34} />,
    title: "Checked before it is trusted",
    body: "Your app verifies the enclave's hardware quote against a signed manifest before it sends anything. A changed enclave is refused, not believed.",
  },
  {
    icon: <DeviceIcon size={34} />,
    title: "Recovery without a seed phrase",
    body: "Lose the phone, sign in on the next one: same addresses, same balance. A full recovery file opens offline, without us.",
  },
];

const CHECKS = [
  { label: "Signed enclave manifest", tile: <code>manifest.json · signature ✓</code> },
  { label: "Intel TDX attestation", tile: <code>quote · MRTD · RTMR0–3 ✓</code> },
  { label: "Verifier in every SDK", tile: <code>enclave-evidence.ts</code> },
  { label: "Recovery that works offline", tile: <code>offline-recovery.html</code> },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  const [theme, toggleTheme] = useTheme();
  const [active, setActive] = useState<Product>("wallets");
  const explore = (p: Product) => {
    setActive(p);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="site lp" data-theme={theme}>
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />

      {/* ── Hero; the products follow in a pinned row ─────────────────────────────────── */}
      <header className="k-hero">
        <div className="k-hero-bg" aria-hidden="true" />
        <div className="k-wrap">
          <Stagger className="k-hero-copy" inView={false} delay={0.1} start={0.05}>
            <Item>
              <h1>
                Turn any <span className="k-nowrap">sign-in</span> into a wallet
              </h1>
            </Item>
            <Item>
              <p>
                Your users sign in with Google, email or phone and get a wallet they own on every
                chain you support. Add crypto payments, gas sponsorship and RPC from the same
                dashboard, and ship the onchain part of your product in an afternoon.
              </p>
            </Item>
            <Item className="k-actions">
              <a href={`${DASHBOARD_URL}/auth/register`} className="k-btn k-btn-primary">
                Start free <Arrow />
              </a>
              <Link href="/demo" className="k-btn k-btn-light">
                Try the live demo <Arrow />
              </Link>
            </Item>
          </Stagger>

        </div>
        <ProductTrack explore={explore} />
      </header>

      {/* ── The stack ───────────────────────────────────────────────────── */}
      <section className="k-section k-logos">
        <div className="k-wrap">
          <Reveal>
            <h2 className="k-h2-small">
              Built for the stack you already run
              <br />
              and the chains your users already use
            </h2>
          </Reveal>
          <Reveal className="k-logo-row" delay={0.1}>
            {(["react", "nodejs", "python", "rust", "swift", "kotlin"] as const).map((l) => (
              <span key={l} className="k-logo">
                <BrandLogo name={l} size={26} />
                {{ react: "React", nodejs: "Node.js", python: "Python", rust: "Rust", swift: "Swift", kotlin: "Kotlin" }[l]}
              </span>
            ))}
            {(["evm", "solana", "tron"] as const).map((c) => (
              <span key={c} className="k-logo">
                <ChainTypeIcon type={c} size={26} />
                {{ evm: "Ethereum", solana: "Solana", tron: "Tron" }[c]}
              </span>
            ))}
          </Reveal>
          <div className="k-rule" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>

      {/* ── Numbers ─────────────────────────────────────────────────────── */}
      <section className="k-section k-stats-sec">
        <div className="k-wrap">
          <Reveal>
            <h2 className="k-h2-mid">Built to run in production</h2>
          </Reveal>
          <Stagger className="k-stats" delay={0.1}>
            {[
              ["3", "Chain families"],
              ["59", "EVM networks"],
              ["2 of 3", "Key shares to sign"],
            ].map(([n, l]) => (
              <Item key={l}>
                <b>{n}</b>
                <small>{l}</small>
              </Item>
            ))}
          </Stagger>
          <div className="k-rule" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>

      <Uses active={active} setActive={setActive} />

      {/* ── Security ────────────────────────────────────────────────────── */}
      <section className="k-section" id="security">
        <div className="k-wrap">
          <Reveal>
            <h2 className="k-h2">Built so no one holds the key</h2>
            <p className="k-lead">
              The key is split, made whole only inside sealed hardware for the instant it signs, and
              checked by your app before it is trusted. Each layer is there so that no single
              machine, company or breach can move a user&apos;s funds.
            </p>
          </Reveal>
          <Stagger className="k-sec-list" delay={0.08}>
            {SECURITY.map((s) => (
              <Item key={s.title} className="k-sec-item">
                <span className="k-sec-icon">{s.icon}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </Item>
            ))}
          </Stagger>

          <Reveal className="k-checks" delay={0.05}>
            <h3>Security you can check for yourself</h3>
            <div className="k-checks-grid">
              {CHECKS.map((c) => (
                <div key={c.label} className="k-check">
                  <span className="k-check-label">
                    <i>
                      <CheckIcon size={11} />
                    </i>
                    {c.label}
                  </span>
                  <span className="k-check-tile">{c.tile}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SDKs ────────────────────────────────────────────────────────── */}
      <section className="k-section k-tinted" id="integrate">
        <Tab />
        <div className="k-wrap">
          <Reveal className="k-head-row">
            <h2 className="k-h2">Ship it in an afternoon</h2>
            <Link href="/docs" className="k-btn k-btn-outline">
              Read the docs
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <Integrations />
          </Reveal>
        </div>
      </section>

      {/* ── Live demo ───────────────────────────────────────────────────── */}
      <section className="k-section k-demo" id="demo">
        <Tab />
        <div className="k-wrap k-demo-grid">
          <Reveal className="k-demo-copy">
            <small className="k-eyebrow">Live demo</small>
            <h2>
              See it working
              <br />
              in your browser
            </h2>
            <p>
              Sign in with Google or email on our demo app and watch a wallet appear on three
              chains. Nothing to install, nothing to write down.
            </p>
            <Link href="/demo" className="k-btn k-btn-dark">
              Open the demo <Arrow />
            </Link>
          </Reveal>
          <Reveal className="k-demo-frame" delay={0.1}>
            <div className="k-demo-card" aria-hidden="true">
              <span className="k-demo-brand">
                <KeyIcon size={14} /> Northgate
              </span>
              <b>Creating your wallet</b>
              <small>ada@example.com · Google</small>
              <ul>
                <li className="done">Signed in</li>
                <li className="done">Key split three ways</li>
                <li className="done">Recovery share sealed</li>
                <li className="wait">Wallets on three chains</li>
              </ul>
            </div>
            <div className="k-demo-card k-demo-card-2" aria-hidden="true">
              <b>Wallet ready</b>
              {(
                [
                  ["evm", "Ethereum", "0x7a3f…c21e"],
                  ["solana", "Solana", "9xQe…4kPz"],
                  ["tron", "Tron", "TQr8…Vb3d"],
                ] as const
              ).map(([t, n, a]) => (
                <span key={t} className="k-demo-addr">
                  <ChainTypeIcon type={t} size={18} /> {n} <code>{a}</code>
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Close ───────────────────────────────────────────────────────── */}
      <section className="k-close">
        <Tab />
        <div className="k-wrap">
          <Reveal className="k-close-card">
            <div className="k-close-copy">
              <h2>Ready to give your users a wallet?</h2>
              <p>Free up to 499 monthly active wallets. Every sign-in method, every chain.</p>
              <div className="k-actions">
                <a href={`${DASHBOARD_URL}/auth/register`} className="k-btn k-btn-primary">
                  Start free <Arrow />
                </a>
                <Link href="/pricing" className="k-btn k-btn-light">
                  See pricing
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
