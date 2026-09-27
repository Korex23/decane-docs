"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
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

// ─── Small icons used only here ──────────────────────────────────────────────

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
const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...line}>
    <path d="M12 3 4 6.5v5c0 4.6 3.4 8.4 8 9.5 4.6-1.1 8-4.9 8-9.5v-5z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...line}>
    <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);
const WalletIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" {...line}>
    <rect x="3" y="6" width="18" height="13" rx="2.5" />
    <path d="M3 10h18M16 15h2" />
  </svg>
);

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
      <button
        type="button"
        className={`copy${done ? " done" : ""}`}
        onClick={copy}
        aria-label={done ? "Copied" : "Copy install command"}
        title="Copy"
      >
        {done ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      </button>
    </div>
  );
}

// ─── Flow panel: sign in → key split → wallet ready ─────────────────────────

function FlowPanel() {
  return (
    <div className="panel flow">
      <Stagger className="flow-grid" delay={0.14}>
        <Item className="flow-card">
          <div className="flow-head">
            <span className="eyebrow">01 · Sign in</span>
            <span className="dot" />
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
        <Item className="flow-card">
          <div className="flow-head">
            <span className="eyebrow">02 · Key split three ways</span>
            <span className="dot" />
          </div>
          <div className="share-rows">
            <div className="share-row">
              <span className="ib">
                <DeviceIcon />
              </span>
              <span>
                <b>Your device</b>
                <small>Issued per session</small>
              </span>
            </div>
            <div className="share-row">
              <span className="ib">
                <ServerIcon />
              </span>
              <span>
                <b>Decane server</b>
                <small>Encrypted at rest</small>
              </span>
            </div>
            <div className="share-row">
              <span className="ib">
                <LockIcon />
              </span>
              <span>
                <b>Sealed enclave</b>
                <small>Opens only for you</small>
              </span>
            </div>
          </div>
          <p className="foot">
            Any two open the wallet. No single piece can do anything alone.
          </p>
        </Item>
        <Item className="flow-card strong">
          <div className="flow-head">
            <span className="eyebrow">03 · Wallet ready</span>
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
          <p className="foot">
            Same addresses on every device and in every app on your project.
          </p>
        </Item>
      </Stagger>
      <div className="flow-cta">
        <p>See it for yourself: a real wallet in a few seconds.</p>
        <Link href="/demo" className="btn btn-primary">
          Try the live demo
        </Link>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  const [theme, toggleTheme] = useTheme();
  const reduced = useReducedMotion();

  // The flow panel drifts up a little faster than the page as you scroll
  // away from it. Scroll-linked work is GSAP's; everything else is Framer.
  useEffect(() => {
    if (reduced) return;
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.to(".flow", {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <div className="site" data-theme={theme}>
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />

      <header className="hero">
        <Stagger
          className="container hero-inner"
          inView={false}
          delay={0.1}
          start={0.05}
        >
          <Item>
            <h1 style={{ marginTop: 0 }}>
              Turn any <span style={{ whiteSpace: "nowrap" }}>sign-in</span>{" "}
              into a wallet.
            </h1>
          </Item>
          <Item>
            <p className="lede">
              Your users sign in with Google, email or phone and get a wallet
              they own, on every chain you support. Nothing to install, nothing
              to write down, and no one can spend from it but them. Not even us.
            </p>
          </Item>
          <Item>
            <div className="hero-actions">
              <a
                href={`${DASHBOARD_URL}/auth/register`}
                className="btn btn-primary btn-lg glow"
              >
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
        </Stagger>
      </header>

      <section style={{ padding: "24px 0 0" }}>
        <div className="container">
          <FlowPanel />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-title">
            <div className="eyebrow">What you get</div>
            <h2>Everything a wallet should do, none of what makes them hard</h2>
          </Reveal>
          <Stagger className="bento" delay={0.08}>
            <Item className="card bento-3">
              <div>
                <h3>Sign in the way people already do</h3>
                <p>
                  Google, email, phone and X are built in. Bring your own login
                  and Decane accepts it too. Someone who signs in with Google
                  today and with the same email tomorrow is one user with one
                  wallet.
                </p>
              </div>
              <div className="chips">
                <span className="chip">
                  <GoogleMark size={16} /> Google
                </span>
                <span className="chip">
                  <MailIcon size={16} /> Email
                </span>
                <span className="chip">
                  <PhoneIcon size={16} /> Phone
                </span>
                <span className="chip">
                  <XLogo size={14} /> X
                </span>
                <span className="chip dashed">
                  <KeyIcon size={16} /> Your own login
                </span>
              </div>
            </Item>
            <Item className="card bento-3">
              <div>
                <h3>One wallet across Ethereum, Solana and Tron</h3>
                <p>
                  Every user gets addresses on all three from one sign-in, with
                  Base, Arbitrum, Polygon and 55 more EVM networks included.
                  Send, sign and switch chains with the same calls.
                </p>
              </div>
              <div className="chain-mini">
                <div>
                  <ChainTypeIcon type="evm" size={22} />
                  <b>Ethereum</b>
                  <small>+ 58 EVM networks</small>
                </div>
                <div>
                  <ChainTypeIcon type="solana" size={22} />
                  <b>Solana</b>
                  <small>Mainnet, devnet</small>
                </div>
                <div>
                  <ChainTypeIcon type="tron" size={22} />
                  <b>Tron</b>
                  <small>Mainnet, Shasta</small>
                </div>
              </div>
            </Item>
            <Item className="card bento-2">
              <span className="icon-box">
                <ShieldIcon />
              </span>
              <h3>Nobody can spend it but them</h3>
              <p>
                The key only ever comes together inside a sealed signer. A
                breach of our database gives an attacker nothing they can use.
              </p>
            </Item>
            <Item className="card bento-2">
              <span className="icon-box">
                <RefreshIcon />
              </span>
              <h3>Lose the phone, keep the wallet</h3>
              <p>
                No seed phrase to lose. Sign in on the new device and the wallet
                is back, same addresses, same balance.{" "}
                <Link href="/recovery" className="ulink">
                  How recovery works
                </Link>
              </p>
            </Item>
            <Item className="card bento-2">
              <span className="icon-box">
                <WalletIcon />
              </span>
              <h3>Already have a wallet? Connect it.</h3>
              <p>
                MetaMask, Rabby, Phantom, TronLink and any other wallet, through
                the same kit. One integration covers everyone.
              </p>
            </Item>
          </Stagger>
        </div>
      </section>

      <section className="section pad-b">
        <div className="container">
          <Reveal className="section-split">
            <div>
              <div className="eyebrow">Integration</div>
              <h2>Ship it in an afternoon</h2>
            </div>
            <p>
              Wrap your app once and you have sign-in, wallets, signing and
              sessions. Your backend verifies who is calling with one line. Web,
              React Native, iOS, Android and every major backend language, from
              one dashboard and one API key.
            </p>
          </Reveal>
          <Reveal>
            <Integrations />
          </Reveal>
        </div>
      </section>

      <section style={{ padding: "0 0 112px" }}>
        <div className="container">
          <Reveal className="panel glow-bottom cta-panel">
            <div className="inner">
              <h2>Start free. Upgrade when your users do.</h2>
              <p>
                Up to 499 monthly active wallets, every sign-in method, every
                chain.
              </p>
              <div className="hero-actions">
                <a
                  href={`${DASHBOARD_URL}/auth/register`}
                  className="btn btn-primary btn-lg"
                >
                  Get an API key
                </a>
                <Link href="/pricing" className="btn btn-secondary btn-lg">
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
