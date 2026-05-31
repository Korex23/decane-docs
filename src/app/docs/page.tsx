"use client";
import { useState, useEffect } from "react";
import { Topbar } from "./components/Topbar";
import { Sidebar } from "./components/Sidebar";
import { Toc } from "./components/Toc";
import { CodeBlock } from "./components/CodeBlock";
import { ChainTable } from "./components/ChainTable";
import { FrameworkTabs } from "./components/FrameworkTabs";
import { ChainTypeIcon } from "@/components/ChainIcon";

export default function DocsPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("dc-docs-theme") as "dark" | "light" | null;
    if (stored) setTheme(stored);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("dc-docs-theme", next);
  }

  return (
    <div className="docs-root" data-theme={theme}>
      <div className="docs-app">
        <Topbar theme={theme} onThemeToggle={toggleTheme} />
        <Sidebar />

        <main className="docs-main" id="docs-main">
          {/* ── Overview ── */}
          <section id="overview" className="docs-hero">
            <div className="docs-breadcrumb">
              <span>Docs</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span>Getting started</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span style={{ color: "var(--doc-text)" }}>Overview</span>
            </div>

            <h1>Connect any wallet, any chain.</h1>
            <p className="docs-lede">
              <strong>decane-connect-kit</strong> is a wallet-connection layer for EVM, Solana, Tron,
              and Bitcoin dApps — with built-in social sign-in via Google and email. It detects installed
              wallets via EIP-6963, the Solana Wallet Standard, TronLink, and Unisat / OKX / MetaMask
              Snap providers, manages sessions with CAIP-25, and ships a polished selector UI. Works with
              React 18+ in any framework.
            </p>

            <div className="docs-hero-meta">
              <span className="docs-badge">
                <span className="dot" />
                Stable · v1.0.0
              </span>
              <span className="docs-badge gold">React 18+</span>
              <span className="docs-badge">MIT</span>
              <span className="docs-badge">~22 KB gzipped</span>
              <span className="docs-badge">
                Zero dependencies on <code style={{ background: "none", border: 0, padding: 0, color: "inherit" }}>window.ethereum</code>
              </span>
            </div>

            <div className="docs-chain-grid">
              <div className="docs-chain-card" data-chain="evm">
                <div className="glyph"><ChainTypeIcon type="evm" size={28} /></div>
                <div className="name">EVM</div>
                <div className="sub">58 chains · EIP-6963</div>
              </div>
              <div className="docs-chain-card" data-chain="solana">
                <div className="glyph"><ChainTypeIcon type="solana" size={28} /></div>
                <div className="name">Solana</div>
                <div className="sub">Wallet Standard</div>
              </div>
              <div className="docs-chain-card" data-chain="tron">
                <div className="glyph"><ChainTypeIcon type="tron" size={28} /></div>
                <div className="name">Tron</div>
                <div className="sub">TronLink</div>
              </div>
              <div className="docs-chain-card" data-chain="bitcoin">
                <div className="glyph"><ChainTypeIcon type="bitcoin" size={28} /></div>
                <div className="name">Bitcoin</div>
                <div className="sub">Unisat · OKX · Snap</div>
              </div>
              <div className="docs-chain-card" data-chain="social" style={{ gridColumn: "1 / -1" }}>
                <div className="glyph"><ChainTypeIcon type="social" size={28} /></div>
                <div className="name">Social</div>
                <div className="sub">Google OAuth · Email magic-link · Non-custodial</div>
              </div>
            </div>
          </section>

          {/* ── Install ── */}
          <section>
            <h2 id="install">
              Install <a className="docs-anchor" href="#install">#</a>
            </h2>
            <CodeBlock lang="bash">
              <span className="tok-id">npm</span>{" "}
              <span className="tok-k">install</span>{" "}
              <span className="tok-s">decane-connect-kit</span>
            </CodeBlock>
            <p>React 18 or later is required as a peer dependency.</p>
          </section>

          {/* ── Quick start ── */}
          <section>
            <h2 id="quick-start">
              Quick start <a className="docs-anchor" href="#quick-start">#</a>
            </h2>

            <h3>1. Wrap your app</h3>
            <CodeBlock lang="tsx" file="main.tsx · _app.tsx · layout.tsx">
              <span className="tok-k">import</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">DecaneKit</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-k">from</span>{" "}
              <span className="tok-s">&quot;decane-connect-kit&quot;</span>
              <span className="tok-p">;</span>
              {"\n\n"}
              <span className="tok-p">&lt;</span>
              <span className="tok-t">DecaneKit</span>{" "}
              <span className="tok-f">config</span>
              <span className="tok-p">{"={"}</span>
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">theme</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;auto&quot;</span>{" "}
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">&gt;</span>
              {"\n  "}
              <span className="tok-p">&lt;</span>
              <span className="tok-t">App</span>{" "}
              <span className="tok-p">/&gt;</span>
              {"\n"}
              <span className="tok-p">&lt;/</span>
              <span className="tok-t">DecaneKit</span>
              <span className="tok-p">&gt;</span>
            </CodeBlock>
            <p>
              That&rsquo;s the entire setup. Wallet discovery starts immediately. If the user was
              previously connected, the session is restored from <code>localStorage</code> automatically.
            </p>

            <h3>2. Add a connect button</h3>
            <CodeBlock lang="tsx">
              <span className="tok-k">import</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">useDecane</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">useWalletSelector</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-k">from</span>{" "}
              <span className="tok-s">&quot;decane-connect-kit&quot;</span>
              <span className="tok-p">;</span>
              {"\n\n"}
              <span className="tok-k">function</span>{" "}
              <span className="tok-f">ConnectButton</span>
              <span className="tok-p">{"()"}</span>{" "}
              <span className="tok-p">{"{"}</span>
              {"\n  "}
              <span className="tok-k">const</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">isConnected</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">connectedWallet</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">disconnect</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-f">useDecane</span>
              <span className="tok-p">{"();"}</span>
              {"\n  "}
              <span className="tok-k">const</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">open</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-f">useWalletSelector</span>
              <span className="tok-p">{"();"}</span>
              {"\n\n  "}
              <span className="tok-k">if</span>{" "}
              <span className="tok-p">(</span>
              <span className="tok-id">isConnected</span>
              <span className="tok-p">{")"}</span>{" "}
              <span className="tok-k">return</span>{" "}
              <span className="tok-p">(</span>
              {"\n    "}
              <span className="tok-p">&lt;&gt;</span>
              {"\n      "}
              <span className="tok-p">&lt;</span>
              <span className="tok-t">span</span>
              <span className="tok-p">&gt;</span>
              <span className="tok-p">{"{"}</span>
              <span className="tok-id">connectedWallet</span>
              <span className="tok-p">!.</span>
              <span className="tok-id">name</span>
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">&lt;/</span>
              <span className="tok-t">span</span>
              <span className="tok-p">&gt;</span>
              {"\n      "}
              <span className="tok-p">&lt;</span>
              <span className="tok-t">button</span>{" "}
              <span className="tok-f">onClick</span>
              <span className="tok-p">{"={"}</span>
              <span className="tok-id">disconnect</span>
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">&gt;</span>
              Disconnect
              <span className="tok-p">&lt;/</span>
              <span className="tok-t">button</span>
              <span className="tok-p">&gt;</span>
              {"\n    "}
              <span className="tok-p">&lt;/&gt;</span>
              {"\n  "}
              <span className="tok-p">);</span>
              {"\n\n  "}
              <span className="tok-k">return</span>{" "}
              <span className="tok-p">&lt;</span>
              <span className="tok-t">button</span>{" "}
              <span className="tok-f">onClick</span>
              <span className="tok-p">{"={"}</span>
              <span className="tok-id">open</span>
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">&gt;</span>
              Connect Wallet
              <span className="tok-p">&lt;/</span>
              <span className="tok-t">button</span>
              <span className="tok-p">&gt;;</span>
              {"\n"}
              <span className="tok-p">{"}"}</span>
            </CodeBlock>
            <div className="docs-callout" data-kind="info">
              <div className="ico">i</div>
              <p>The modal renders itself — there is no <code>&lt;WalletSelector&gt;</code> component to place anywhere.</p>
            </div>

            <h3>3. Sign a message</h3>
            <CodeBlock lang="tsx">
              <span className="tok-k">import</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">useSignMessage</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-k">from</span>{" "}
              <span className="tok-s">&quot;decane-connect-kit&quot;</span>
              <span className="tok-p">;</span>
              {"\n\n"}
              <span className="tok-k">const</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">signMessage</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">signature</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">loading</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">error</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-f">useSignMessage</span>
              <span className="tok-p">{"();"}</span>
              {"\n\n"}
              <span className="tok-k">await</span>{" "}
              <span className="tok-f">signMessage</span>
              <span className="tok-p">(</span>
              <span className="tok-s">&quot;Hello world&quot;</span>
              <span className="tok-p">);</span>
            </CodeBlock>
          </section>

          {/* ── Framework setup ── */}
          <section>
            <h2 id="framework-setup">
              Framework setup <a className="docs-anchor" href="#framework-setup">#</a>
            </h2>
            <FrameworkTabs />
          </section>

          {/* ── Configuration ── */}
          <section>
            <h2 id="configuration">
              Configuration <a className="docs-anchor" href="#configuration">#</a>
            </h2>
            <p>All options are optional.</p>
            <CodeBlock lang="tsx">
              <span className="tok-p">&lt;</span>
              <span className="tok-t">DecaneKit</span>{" "}
              <span className="tok-f">config</span>
              <span className="tok-p">{"={"}</span>
              <span className="tok-p">{"{"}</span>
              {"\n  "}
              <span className="tok-c">// Which wallet types + social</span>
              {"\n  "}
              <span className="tok-c">// &quot;all&quot; | &quot;wallets&quot; | &quot;social&quot; | &quot;evm&quot; | &quot;solana&quot; | ... — default: &quot;wallets&quot;</span>
              {"\n  "}
              <span className="tok-id">mode</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;all&quot;</span>
              <span className="tok-p">,</span>
              {"\n\n  "}
              <span className="tok-c">// Social sign-in config (required when mode includes social)</span>
              {"\n  "}
              <span className="tok-id">social</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-p">{"{"}</span>
              {"\n    "}
              <span className="tok-id">apiKey</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;dck_live_…&quot;</span>
              <span className="tok-p">,</span>
              {"\n    "}
              <span className="tok-id">authMethods</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-p">[</span>
              <span className="tok-s">&quot;google&quot;</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-s">&quot;email&quot;</span>
              <span className="tok-p">],</span>
              {"\n  "}
              <span className="tok-p">{"},"}  </span>
              {"\n\n  "}
              <span className="tok-c">// Restrict which built-in chains are available</span>
              {"\n  "}
              <span className="tok-id">supportedChainIds</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-p">[</span>
              <span className="tok-t">CHAINS</span>
              <span className="tok-p">.</span>
              <span className="tok-id">ETHEREUM</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-t">CHAINS</span>
              <span className="tok-p">.</span>
              <span className="tok-id">POLYGON</span>
              <span className="tok-p">],</span>
              {"\n\n  "}
              <span className="tok-c">// UI theme — &quot;light&quot; | &quot;dark&quot; | &quot;auto&quot; — default: &quot;auto&quot;</span>
              {"\n  "}
              <span className="tok-id">theme</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;auto&quot;</span>
              <span className="tok-p">,</span>
              {"\n\n  "}
              <span className="tok-c">// Default CAIP-2 chain ID to request when connecting</span>
              {"\n  "}
              <span className="tok-id">defaultChain</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;eip155:1&quot;</span>
              <span className="tok-p">,</span>
              {"\n"}
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">&gt;</span>
            </CodeBlock>

            <h3 id="networks">
              <code>mode / networks</code>
            </h3>
            <p>Controls which wallets and auth methods appear in the selector.</p>
            <CodeBlock lang="tsx">
              <span className="tok-c">{"// All wallets + social sign-in"}</span>
              {"\n"}
              <span className="tok-p">&lt;</span>
              <span className="tok-t">DecaneKit</span>{" "}
              <span className="tok-f">config</span>
              <span className="tok-p">{"={"}</span>
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">mode</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;all&quot;</span>{" "}
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">&gt;</span>
              {"\n\n"}
              <span className="tok-c">{"// EVM wallets only — all other types hidden"}</span>
              {"\n"}
              <span className="tok-p">&lt;</span>
              <span className="tok-t">DecaneKit</span>{" "}
              <span className="tok-f">config</span>
              <span className="tok-p">{"={"}</span>
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">mode</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;evm&quot;</span>{" "}
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">&gt;</span>
              {"\n\n"}
              <span className="tok-c">{"// Social sign-in only"}</span>
              {"\n"}
              <span className="tok-p">&lt;</span>
              <span className="tok-t">DecaneKit</span>{" "}
              <span className="tok-f">config</span>
              <span className="tok-p">{"={"}</span>
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">mode</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;social&quot;</span>{" "}
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">&gt;</span>
            </CodeBlock>

            <h3 id="supported-chains">
              <code>supportedChainIds</code>
            </h3>
            <p>
              Restricts the chain list used throughout the SDK — the wallet selector,{" "}
              <code>provider.chains</code>, and <code>wallet_requestPermissions</code> all respect it.
            </p>
            <CodeBlock lang="tsx">
              <span className="tok-k">import</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">CHAINS</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-k">from</span>{" "}
              <span className="tok-s">&quot;decane-connect-kit&quot;</span>
              <span className="tok-p">;</span>
              {"\n\n"}
              <span className="tok-p">&lt;</span>
              <span className="tok-t">DecaneKit</span>{" "}
              <span className="tok-f">config</span>
              <span className="tok-p">{"={"}</span>
              <span className="tok-p">{"{"}</span>
              {"\n  "}
              <span className="tok-id">supportedChainIds</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-p">[</span>
              <span className="tok-t">CHAINS</span>
              <span className="tok-p">.</span>
              <span className="tok-id">ETHEREUM</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-t">CHAINS</span>
              <span className="tok-p">.</span>
              <span className="tok-id">BASE</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-t">CHAINS</span>
              <span className="tok-p">.</span>
              <span className="tok-id">SOLANA</span>
              <span className="tok-p">],</span>
              {"\n"}
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">&gt;</span>
            </CodeBlock>
          </section>

          {/* ── Social sign-in ── */}
          <section>
            <h2 id="social">
              Social sign-in <a className="docs-anchor" href="#social">#</a>
            </h2>
            <p>
              decane-connect-kit includes built-in non-custodial social wallets backed by Google OAuth and
              email magic-link. Users get a real on-chain wallet without ever seeing a seed phrase. The
              private key is split between the user&rsquo;s device and the decane key server — neither side can
              reconstruct the key alone.
            </p>

            <h3 id="connect-mode">ConnectMode</h3>
            <p>The <code>mode</code> config option controls which auth methods are enabled.</p>
            <CodeBlock lang="ts">
              <span className="tok-k">type</span>{" "}
              <span className="tok-t">ConnectMode</span>
              {"\n  "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-s">&quot;all&quot;</span>
              {"             "}
              <span className="tok-c">// all wallet types + social sign-in</span>
              {"\n  "}
              <span className="tok-p">|</span>{" "}
              <span className="tok-s">&quot;social&quot;</span>
              {"          "}
              <span className="tok-c">// social sign-in only</span>
              {"\n  "}
              <span className="tok-p">|</span>{" "}
              <span className="tok-s">&quot;wallets&quot;</span>
              {"         "}
              <span className="tok-c">// all wallet types, no social (default)</span>
              {"\n  "}
              <span className="tok-p">|</span>{" "}
              <span className="tok-s">&quot;evm&quot;</span>
              {"             "}
              <span className="tok-c">// EVM wallets only</span>
              {"\n  "}
              <span className="tok-p">|</span>{" "}
              <span className="tok-s">&quot;solana&quot;</span>
              {"          "}
              <span className="tok-c">// Solana only</span>
              {"\n  "}
              <span className="tok-p">|</span>{" "}
              <span className="tok-s">&quot;tron&quot;</span>
              {"            "}
              <span className="tok-c">// Tron only</span>
              {"\n  "}
              <span className="tok-p">|</span>{" "}
              <span className="tok-s">&quot;evm+social&quot;</span>
              {"       "}
              <span className="tok-c">// EVM wallets + social sign-in</span>
              {"\n  "}
              <span className="tok-p">|</span>{" "}
              <span className="tok-s">&quot;solana+social&quot;</span>
              {"    "}
              <span className="tok-c">// Solana wallets + social sign-in</span>
              {"\n  "}
              <span className="tok-p">|</span>{" "}
              <span className="tok-s">&quot;tron+social&quot;</span>
              {"      "}
              <span className="tok-c">// Tron wallets + social sign-in</span>
              {"\n  "}
              <span className="tok-p">|</span>{" "}
              <span className="tok-s">&quot;evm+tron&quot;</span>
              {"         "}
              <span className="tok-c">// EVM + Tron, no social</span>
              {"\n  "}
              <span className="tok-p">|</span>{" "}
              <span className="tok-s">&quot;evm+tron+social&quot;</span>
              <span className="tok-p">;</span>
              {"  "}
              <span className="tok-c">// EVM + Tron + social sign-in</span>
            </CodeBlock>

            <h3 id="social-config">SocialConfig</h3>
            <p>Pass this object as <code>config.social</code>. Required when <code>mode</code> includes social.</p>
            <CodeBlock lang="ts">
              <span className="tok-k">interface</span>{" "}
              <span className="tok-t">SocialConfig</span>{" "}
              <span className="tok-p">{"{"}</span>
              {"\n  "}
              <span className="tok-id">apiKey</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-t">string</span>
              <span className="tok-p">;</span>
              {"                  "}
              <span className="tok-c">// your dck_live_… or dck_test_… key</span>
              {"\n  "}
              <span className="tok-id">authMethods</span>
              <span className="tok-p">?:</span>{" "}
              <span className="tok-p">(</span>
              <span className="tok-s">&quot;google&quot;</span>{" "}
              <span className="tok-p">|</span>{" "}
              <span className="tok-s">&quot;email&quot;</span>
              <span className="tok-p">)[];</span>
              {"  "}
              <span className="tok-c">// default: both</span>
              {"\n  "}
              <span className="tok-id">promptPin</span>
              <span className="tok-p">?:</span>{" "}
              <span className="tok-p">{"()"}</span>{" "}
              <span className="tok-p">=&gt;</span>{" "}
              <span className="tok-t">Promise</span>
              <span className="tok-p">&lt;</span>
              <span className="tok-t">string</span>
              <span className="tok-p">&gt;;</span>
              {"  "}
              <span className="tok-c">// called when passkey unavailable</span>
              {"\n  "}
              <span className="tok-id">chains</span>
              <span className="tok-p">?:</span>{" "}
              <span className="tok-t">string</span>
              <span className="tok-p">[];</span>
              {"                "}
              <span className="tok-c">// default: [&quot;eip155:1&quot;, &quot;solana:mainnet&quot;]</span>
              {"\n  "}
              <span className="tok-id">rpcUrls</span>
              <span className="tok-p">?:</span>{" "}
              <span className="tok-t">Record</span>
              <span className="tok-p">&lt;</span>
              <span className="tok-t">string</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-t">string</span>
              <span className="tok-p">&gt;;</span>
              {"  "}
              <span className="tok-c">// override built-in public RPCs</span>
              {"\n"}
              <span className="tok-p">{"}"}</span>
            </CodeBlock>

            <h3>Setup example</h3>
            <CodeBlock lang="tsx">
              <span className="tok-p">&lt;</span>
              <span className="tok-t">DecaneKit</span>{" "}
              <span className="tok-f">config</span>
              <span className="tok-p">{"={{"}</span>
              {"\n  "}
              <span className="tok-id">mode</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;all&quot;</span>
              <span className="tok-p">,</span>
              {"\n  "}
              <span className="tok-id">social</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-p">{"{"}</span>
              {"\n    "}
              <span className="tok-id">apiKey</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;dck_live_…&quot;</span>
              <span className="tok-p">,</span>
              {"\n    "}
              <span className="tok-id">authMethods</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-p">[</span>
              <span className="tok-s">&quot;google&quot;</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-s">&quot;email&quot;</span>
              <span className="tok-p">],</span>
              {"\n    "}
              <span className="tok-id">promptPin</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-p">{"()"}</span>{" "}
              <span className="tok-p">=&gt;</span>{" "}
              <span className="tok-f">showPinModal</span>
              <span className="tok-p">(),</span>
              {"\n  "}
              <span className="tok-p">{"},"}  </span>
              {"\n"}
              <span className="tok-p">{"}}"}</span>
              <span className="tok-p">&gt;</span>
              {"\n  "}
              <span className="tok-p">&lt;</span>
              <span className="tok-t">App</span>
              <span className="tok-p">/&gt;</span>
              {"\n"}
              <span className="tok-p">&lt;/</span>
              <span className="tok-t">DecaneKit</span>
              <span className="tok-p">&gt;</span>
            </CodeBlock>
            <div className="docs-callout" data-kind="info">
              <div className="ico">i</div>
              <p>
                The WalletSelector modal automatically shows a <strong>Wallet</strong> tab and a{" "}
                <strong>Sign in</strong> tab when <code>mode</code> includes social. No extra components needed.
              </p>
            </div>

            <h3 id="useSocialAuth">
              <code>useSocialAuth()</code>
            </h3>
            <p>Core auth hook. Use this when you only need sign-in state without signing methods.</p>
            <CodeBlock lang="tsx">
              <span className="tok-k">const</span>{" "}
              <span className="tok-p">{"{"}</span>
              {"\n  "}
              <span className="tok-id">isConnected</span>
              <span className="tok-p">,</span>
              {"        "}
              <span className="tok-c">// boolean</span>
              {"\n  "}
              <span className="tok-id">isUnlocked</span>
              <span className="tok-p">,</span>
              {"         "}
              <span className="tok-c">// boolean — false until wallet is unlocked</span>
              {"\n  "}
              <span className="tok-id">isNewUser</span>
              <span className="tok-p">,</span>
              {"          "}
              <span className="tok-c">// boolean — true on first sign-in</span>
              {"\n  "}
              <span className="tok-id">addresses</span>
              <span className="tok-p">,</span>
              {"          "}
              <span className="tok-c">// {"{"} evm?: string; solana?: string {"}"} | null</span>
              {"\n  "}
              <span className="tok-id">sessionExpiresAt</span>
              <span className="tok-p">,</span>
              {"  "}
              <span className="tok-c">// number | null — Unix timestamp</span>
              {"\n\n  "}
              <span className="tok-c">// Auth flows</span>
              {"\n  "}
              <span className="tok-id">signInWithGoogle</span>
              <span className="tok-p">,</span>
              {"  "}
              <span className="tok-c">// () =&gt; Promise&lt;void&gt;</span>
              {"\n  "}
              <span className="tok-id">sendEmailCode</span>
              <span className="tok-p">,</span>
              {"     "}
              <span className="tok-c">// (email: string) =&gt; Promise&lt;{"{"} codeRequired: true {"}"}&gt;</span>
              {"\n  "}
              <span className="tok-id">confirmEmailCode</span>
              <span className="tok-p">,</span>
              {"  "}
              <span className="tok-c">// (email: string, code: string) =&gt; Promise&lt;void&gt;</span>
              {"\n  "}
              <span className="tok-id">unlock</span>
              <span className="tok-p">,</span>
              {"            "}
              <span className="tok-c">// () =&gt; Promise&lt;void&gt;</span>
              {"\n  "}
              <span className="tok-id">disconnect</span>
              <span className="tok-p">,</span>
              {"        "}
              <span className="tok-c">// () =&gt; Promise&lt;void&gt;</span>
              {"\n\n  "}
              <span className="tok-id">googleLoading</span>
              <span className="tok-p">,</span>
              {"     "}
              <span className="tok-c">// boolean</span>
              {"\n  "}
              <span className="tok-id">emailLoading</span>
              <span className="tok-p">,</span>
              {"      "}
              <span className="tok-c">// boolean</span>
              {"\n  "}
              <span className="tok-id">error</span>
              <span className="tok-p">,</span>
              {"             "}
              <span className="tok-c">// string | null</span>
              {"\n  "}
              <span className="tok-id">clearError</span>
              <span className="tok-p">,</span>
              {"         "}
              <span className="tok-c">// () =&gt; void</span>
              {"\n"}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-f">useSocialAuth</span>
              <span className="tok-p">{"();"}</span>
            </CodeBlock>

            <h3 id="useSocialWallet">
              <code>useSocialWallet()</code>
            </h3>
            <p>Full hook — includes signing methods and modal control in addition to all auth state.</p>
            <CodeBlock lang="tsx">
              <span className="tok-k">const</span>{" "}
              <span className="tok-p">{"{"}</span>
              {"\n  "}
              <span className="tok-c">// All of useSocialAuth() plus:</span>
              {"\n  "}
              <span className="tok-id">signMessage</span>
              <span className="tok-p">,</span>
              {"           "}
              <span className="tok-c">// (chain, message) =&gt; Promise&lt;string&gt;</span>
              {"\n  "}
              <span className="tok-id">sendTransaction</span>
              <span className="tok-p">,</span>
              {"         "}
              <span className="tok-c">// ({"{"} chain, to, value?, data? {"}"}) =&gt; Promise&lt;string&gt;</span>
              {"\n  "}
              <span className="tok-id">signSolanaTransaction</span>
              <span className="tok-p">,</span>
              {"   "}
              <span className="tok-c">// (Uint8Array) =&gt; Promise&lt;Uint8Array&gt;</span>
              {"\n\n  "}
              <span className="tok-c">// Modal</span>
              {"\n  "}
              <span className="tok-id">openModal</span>
              <span className="tok-p">,</span>
              {"             "}
              <span className="tok-c">// () =&gt; void</span>
              {"\n  "}
              <span className="tok-id">closeModal</span>
              <span className="tok-p">,</span>
              {"            "}
              <span className="tok-c">// () =&gt; void</span>
              {"\n  "}
              <span className="tok-id">modalOpen</span>
              <span className="tok-p">,</span>
              {"             "}
              <span className="tok-c">// boolean</span>
              {"\n\n  "}
              <span className="tok-id">loading</span>
              <span className="tok-p">,</span>
              {"               "}
              <span className="tok-c">// boolean — signing in progress</span>
              {"\n  "}
              <span className="tok-id">error</span>
              <span className="tok-p">,</span>
              {"                 "}
              <span className="tok-c">// string | null</span>
              {"\n  "}
              <span className="tok-id">clearError</span>
              <span className="tok-p">,</span>
              {"            "}
              <span className="tok-c">// () =&gt; void</span>
              {"\n"}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-f">useSocialWallet</span>
              <span className="tok-p">{"();"}</span>
            </CodeBlock>

            <h3 id="social-wallet-modal">
              <code>SocialWalletModal</code>
            </h3>
            <p>
              Renders automatically inside <code>&lt;DecaneKit&gt;</code> — no placement needed. Open it
              with <code>useSocialWallet().openModal()</code>. Shows: addresses with copy buttons,
              locked/unlocked status with session countdown, unlock and sign-out actions.
            </p>

            <h3>Send a transaction with a social wallet</h3>
            <CodeBlock lang="tsx">
              <span className="tok-k">const</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">sendTransaction</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-f">useSocialWallet</span>
              <span className="tok-p">{"();"}</span>
              {"\n\n"}
              <span className="tok-c">// SDK auto-fetches nonce + gas from built-in CORS-friendly RPCs</span>
              {"\n"}
              <span className="tok-k">const</span>{" "}
              <span className="tok-id">hash</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-k">await</span>{" "}
              <span className="tok-f">sendTransaction</span>
              <span className="tok-p">{"({"}</span>
              {"\n  "}
              <span className="tok-id">chain</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;eip155:11155111&quot;</span>
              <span className="tok-p">,</span>
              {"   "}
              <span className="tok-c">// Sepolia</span>
              {"\n  "}
              <span className="tok-id">to</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;0xRecipient&quot;</span>
              <span className="tok-p">,</span>
              {"\n  "}
              <span className="tok-id">value</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-f">BigInt</span>
              <span className="tok-p">(</span>
              <span className="tok-s">&quot;1000000000000000&quot;</span>
              <span className="tok-p">),</span>
              {"  "}
              <span className="tok-c">// 0.001 ETH in wei</span>
              {"\n"}
              <span className="tok-p">{"});"}</span>
            </CodeBlock>
            <p>
              Built-in CORS-enabled RPCs: Ethereum, Polygon, Base, Optimism, Arbitrum, BNB, Sepolia, Base
              Sepolia. Override any with <code>social.rpcUrls</code>.
            </p>

            <div className="docs-callout" data-kind="security">
              <div className="ico">🔒</div>
              <div>
                <p><strong>How social wallets work — XOR key split</strong></p>
                <p>
                  The private key is generated entirely in the browser and split into two shares using XOR.
                  The <em>device share</em> is stored in IndexedDB, wrapped by a passkey or PIN.
                  The <em>server share</em> is KMS-encrypted at rest on the decane key server.
                  Reconstruction only ever happens in the browser during an active unlocked session.
                  The server never holds a full key and never signs anything on behalf of the user.
                </p>
              </div>
            </div>
          </section>

          {/* ── Hooks ── */}
          <section>
            <h2 id="hooks">
              Hooks <a className="docs-anchor" href="#hooks">#</a>
            </h2>

            <h3 id="useDecane">
              <code>useDecane()</code>
            </h3>
            <p>Reactive state hook. Re-renders on any wallet or session change.</p>
            <CodeBlock lang="tsx">
              <span className="tok-k">const</span>{" "}
              <span className="tok-p">{"{"}</span>
              {"\n  "}
              <span className="tok-c">// Detected wallets</span>
              {"\n  "}
              <span className="tok-id">wallets</span>
              <span className="tok-p">,          </span>
              <span className="tok-c">// all wallets</span>
              {"\n  "}
              <span className="tok-id">evmWallets</span>
              <span className="tok-p">,       </span>
              <span className="tok-c">// EVM wallets</span>
              {"\n  "}
              <span className="tok-id">solanaWallets</span>
              <span className="tok-p">,    </span>
              <span className="tok-c">// Solana wallets</span>
              {"\n  "}
              <span className="tok-id">tronWallets</span>
              <span className="tok-p">,      </span>
              <span className="tok-c">// Tron wallets</span>
              {"\n  "}
              <span className="tok-id">bitcoinWallets</span>
              <span className="tok-p">,   </span>
              <span className="tok-c">// Bitcoin wallets</span>
              {"\n  "}
              <span className="tok-id">multiChainWallets</span>
              <span className="tok-p">, </span>
              <span className="tok-c">// wallets supporting 2+ chains</span>
              {"\n\n  "}
              <span className="tok-c">// Connection state</span>
              {"\n  "}
              <span className="tok-id">isConnected</span>
              <span className="tok-p">,</span>
              {"\n  "}
              <span className="tok-id">connectedWallet</span>
              <span className="tok-p">,   </span>
              <span className="tok-c">// UnifiedWalletAccount | null</span>
              {"\n  "}
              <span className="tok-id">activeSession</span>
              <span className="tok-p">,     </span>
              <span className="tok-c">// ActiveSession | null</span>
              {"\n  "}
              <span className="tok-id">activeChain</span>
              <span className="tok-p">,       </span>
              <span className="tok-c">// CAIP-2 string | null</span>
              {"\n\n  "}
              <span className="tok-c">// Theme</span>
              {"\n  "}
              <span className="tok-id">theme</span>
              <span className="tok-p">,             </span>
              <span className="tok-c">// &quot;light&quot; | &quot;dark&quot; | &quot;auto&quot;</span>
              {"\n  "}
              <span className="tok-id">setTheme</span>
              <span className="tok-p">,          </span>
              <span className="tok-c">// (t: Theme) =&gt; void</span>
              {"\n\n  "}
              <span className="tok-c">// Actions</span>
              {"\n  "}
              <span className="tok-id">connect</span>
              <span className="tok-p">,           </span>
              <span className="tok-c">// (wallet, preference?) =&gt; Promise&lt;void&gt;</span>
              {"\n  "}
              <span className="tok-id">disconnect</span>
              <span className="tok-p">,        </span>
              <span className="tok-c">// () =&gt; Promise&lt;void&gt;</span>
              {"\n  "}
              <span className="tok-id">addChain</span>
              <span className="tok-p">,          </span>
              <span className="tok-c">// (chain: ChainDescriptor) =&gt; void</span>
              {"\n  "}
              <span className="tok-id">removeChain</span>
              <span className="tok-p">,       </span>
              <span className="tok-c">// (chainId: string) =&gt; void</span>
              {"\n"}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-f">useDecane</span>
              <span className="tok-p">{"();"}</span>
            </CodeBlock>

            <h3 id="useWalletSelector">
              <code>useWalletSelector()</code>
            </h3>
            <p>Controls the wallet modal.</p>
            <CodeBlock lang="tsx">
              <span className="tok-k">const</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">isOpen</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">open</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">close</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-f">useWalletSelector</span>
              <span className="tok-p">{"();"}</span>
            </CodeBlock>

            <h3 id="useSignMessage">
              <code>useSignMessage()</code>
            </h3>
            <p>Works on EVM, Solana, Tron, Bitcoin, and social wallets.</p>
            <CodeBlock lang="tsx">
              <span className="tok-k">const</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">signMessage</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">signature</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">loading</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">error</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">reset</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-f">useSignMessage</span>
              <span className="tok-p">{"();"}</span>
              {"\n\n"}
              <span className="tok-c">// Uses active chain and account automatically</span>
              {"\n"}
              <span className="tok-k">await</span>{" "}
              <span className="tok-f">signMessage</span>
              <span className="tok-p">(</span>
              <span className="tok-s">&quot;Hello world&quot;</span>
              <span className="tok-p">);</span>
              {"\n\n"}
              <span className="tok-c">// Override chain explicitly</span>
              {"\n"}
              <span className="tok-k">await</span>{" "}
              <span className="tok-f">signMessage</span>
              <span className="tok-p">(</span>
              <span className="tok-s">&quot;Hello world&quot;</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">chainId</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-t">CHAINS</span>
              <span className="tok-p">.</span>
              <span className="tok-id">POLYGON</span>{" "}
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">);</span>
            </CodeBlock>

            <h3 id="useSendTransaction">
              <code>useSendTransaction()</code>
            </h3>
            <p>Works on EVM, Solana, Tron, and Bitcoin.</p>
            <CodeBlock lang="tsx">
              <span className="tok-k">const</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">sendTransaction</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">txHash</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">loading</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">error</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">reset</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-f">useSendTransaction</span>
              <span className="tok-p">{"();"}</span>
              {"\n\n"}
              <span className="tok-c">{"// EVM — value in wei"}</span>
              {"\n"}
              <span className="tok-k">await</span>{" "}
              <span className="tok-f">sendTransaction</span>
              <span className="tok-p">{"({"}</span>
              {"\n  "}
              <span className="tok-id">to</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;0xRecipient&quot;</span>
              <span className="tok-p">,</span>
              {"\n  "}
              <span className="tok-id">value</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;1000000000000000&quot;</span>
              <span className="tok-p">,</span>
              {"\n  "}
              <span className="tok-id">gas</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;21000&quot;</span>
              <span className="tok-p">,</span>
              {"\n"}
              <span className="tok-p">{"});"}</span>
              {"\n\n"}
              <span className="tok-c">{"// Bitcoin — value in satoshis"}</span>
              {"\n"}
              <span className="tok-k">await</span>{" "}
              <span className="tok-f">sendTransaction</span>
              <span className="tok-p">{"({"}</span>{" "}
              <span className="tok-id">to</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;bc1q…&quot;</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">value</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;10000&quot;</span>{" "}
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">chainId</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-t">CHAINS</span>
              <span className="tok-p">.</span>
              <span className="tok-id">BITCOIN</span>{" "}
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">);</span>
            </CodeBlock>

            <h3 id="useSignTypedData">
              <code>useSignTypedData()</code>
            </h3>
            <p>
              EVM only. Throws <code>DecaneErrorCode.EVM_ONLY_METHOD</code> if called on a non-EVM chain.
            </p>
            <CodeBlock lang="tsx">
              <span className="tok-k">const</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">signTypedData</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">signature</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">loading</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">error</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">reset</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-f">useSignTypedData</span>
              <span className="tok-p">{"();"}</span>
              {"\n\n"}
              <span className="tok-k">await</span>{" "}
              <span className="tok-f">signTypedData</span>
              <span className="tok-p">{"({"}</span>
              {"\n  "}
              <span className="tok-id">domain</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">name</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;MyApp&quot;</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">version</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;1&quot;</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">chainId</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-n">1</span>{" "}
              <span className="tok-p">{"},"}</span>
              {"\n  "}
              <span className="tok-id">types</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">Permit</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-p">[{"{"}</span>{" "}
              <span className="tok-id">name</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;owner&quot;</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">type</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;address&quot;</span>{" "}
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">{", …]"}</span>{" "}
              <span className="tok-p">{"},"}</span>
              {"\n  "}
              <span className="tok-id">message</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">owner</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;0xAbc…&quot;</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">spender</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;0xDef…&quot;</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">value</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;1000&quot;</span>{" "}
              <span className="tok-p">{"},"}</span>
              {"\n"}
              <span className="tok-p">{"});"}</span>
            </CodeBlock>

            <h3 id="useChainSwitch">
              <code>useChainSwitch()</code>
            </h3>
            <p>Switch the active chain within the current session.</p>
            <CodeBlock lang="tsx">
              <span className="tok-k">const</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">switchChain</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">activeChain</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">grantedChains</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">loading</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">error</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-f">useChainSwitch</span>
              <span className="tok-p">{"();"}</span>
              {"\n\n"}
              <span className="tok-k">await</span>{" "}
              <span className="tok-f">switchChain</span>
              <span className="tok-p">(</span>
              <span className="tok-t">CHAINS</span>
              <span className="tok-p">.</span>
              <span className="tok-id">POLYGON</span>
              <span className="tok-p">);</span>
            </CodeBlock>
          </section>

          {/* ── Detection ── */}
          <section>
            <h2 id="detection">
              Wallet detection <a className="docs-anchor" href="#detection">#</a>
            </h2>
            <h3>EVM</h3>
            <p>
              Detected via <strong>EIP-6963</strong> — standard event-based discovery. All compliant
              wallets (MetaMask, Rabby, Coinbase Wallet, Brave, OKX, and others) are discovered
              automatically. <code>window.ethereum</code> is never used.
            </p>
            <h3>Solana</h3>
            <p>
              Detected via the <strong>Wallet Standard</strong> (<code>@wallet-standard/app</code>).
              Wallets must expose <code>standard:connect</code>, <code>solana:signTransaction</code>, and{" "}
              <code>solana:signMessage</code>. Multi-chain wallets like Phantom and Backpack are merged
              into a single entry when detected on both EVM and Solana.
            </p>
            <h3>Tron</h3>
            <p>
              Detected via <strong>TronLink&rsquo;s injected provider</strong> (<code>window.tronLink</code>).
              The SDK listens for <code>tronLink#initialized</code> and polls for up to 3 seconds to
              handle extensions that load after the page.
            </p>
            <h3>Bitcoin</h3>
            <p>Three detection paths run in parallel:</p>
            <div className="docs-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "25%" }}>Wallet</th>
                    <th>Detection</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Unisat</strong></td>
                    <td><code>window.unisat</code> injected provider</td>
                  </tr>
                  <tr>
                    <td><strong>OKX Wallet</strong></td>
                    <td>
                      <code>window.okxwallet.bitcoin</code> — shares <code>rdns</code> with OKX EVM,
                      auto-merges to give EVM + Bitcoin support
                    </td>
                  </tr>
                  <tr>
                    <td><strong>MetaMask Bitcoin Snap</strong></td>
                    <td>
                      After each EVM wallet is discovered, <code>wallet_getSnaps</code> is called
                      silently. If <code>npm:@metamask/bitcoin-snap</code> is enabled, the wallet gains
                      Bitcoin support with no user interaction.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Chain constants ── */}
          <section>
            <h2 id="chain-constants">
              Chain constants <a className="docs-anchor" href="#chain-constants">#</a>
            </h2>
            <p>
              Use <code>CHAINS</code> instead of bare strings to get autocomplete and catch typos at
              compile time.
            </p>
            <CodeBlock lang="tsx">
              <span className="tok-k">import</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">CHAINS</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-k">type</span>{" "}
              <span className="tok-id">ChainId</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-k">from</span>{" "}
              <span className="tok-s">&quot;decane-connect-kit&quot;</span>
              <span className="tok-p">;</span>
              {"\n\n"}
              <span className="tok-t">CHAINS</span>
              <span className="tok-p">.</span>
              <span className="tok-id">ETHEREUM</span>
              {"         "}
              <span className="tok-c">// &quot;eip155:1&quot;</span>
              {"\n"}
              <span className="tok-t">CHAINS</span>
              <span className="tok-p">.</span>
              <span className="tok-id">BASE</span>
              {"             "}
              <span className="tok-c">// &quot;eip155:8453&quot;</span>
              {"\n"}
              <span className="tok-t">CHAINS</span>
              <span className="tok-p">.</span>
              <span className="tok-id">SOLANA</span>
              {"           "}
              <span className="tok-c">// &quot;solana:mainnet&quot;</span>
              {"\n"}
              <span className="tok-t">CHAINS</span>
              <span className="tok-p">.</span>
              <span className="tok-id">TRON</span>
              {"             "}
              <span className="tok-c">// &quot;tron:mainnet&quot;</span>
              {"\n"}
              <span className="tok-t">CHAINS</span>
              <span className="tok-p">.</span>
              <span className="tok-id">BITCOIN</span>
              {"          "}
              <span className="tok-c">// &quot;bip122:mainnet&quot;</span>
            </CodeBlock>
          </section>

          {/* ── Custom chains ── */}
          <section>
            <h2 id="custom-chains">
              Custom chains <a className="docs-anchor" href="#custom-chains">#</a>
            </h2>
            <p>Add any EVM chain (local Hardhat, private L2) or Solana network at runtime.</p>
            <CodeBlock lang="tsx">
              <span className="tok-k">const</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">addChain</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">removeChain</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-f">useDecane</span>
              <span className="tok-p">{"();"}</span>
              {"\n\n"}
              <span className="tok-f">addChain</span>
              <span className="tok-p">{"({"}</span>
              {"\n  "}
              <span className="tok-id">id</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;eip155:31337&quot;</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">type</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;evm&quot;</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">chainId</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-n">31337</span>
              <span className="tok-p">,</span>
              {"\n  "}
              <span className="tok-id">name</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;Hardhat Local&quot;</span>
              <span className="tok-p">,</span>
              {"\n  "}
              <span className="tok-id">nativeCurrency</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">name</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;Ether&quot;</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">symbol</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;ETH&quot;</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">decimals</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-n">18</span>{" "}
              <span className="tok-p">{"},"}</span>
              {"\n  "}
              <span className="tok-id">rpcUrl</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;http://localhost:8545&quot;</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">isCustom</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-k">true</span>
              <span className="tok-p">,</span>
              {"\n"}
              <span className="tok-p">{"});"}</span>
            </CodeBlock>
            <div className="docs-callout" data-kind="info">
              <div className="ico">i</div>
              <p>
                When <code>addChain</code> is called while a wallet is connected, it automatically calls{" "}
                <code>wallet_addEthereumChain</code> on the wallet so it knows about the network.
              </p>
            </div>
          </section>

          {/* ── Errors ── */}
          <section>
            <h2 id="errors">
              Error handling <a className="docs-anchor" href="#errors">#</a>
            </h2>
            <p>
              All hooks return <code>error: DecaneError | null</code>. Branch on{" "}
              <code>error.code</code> instead of parsing error strings.
            </p>
            <CodeBlock lang="tsx">
              <span className="tok-k">import</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">DecaneError</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">DecaneErrorCode</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-k">from</span>{" "}
              <span className="tok-s">&quot;decane-connect-kit&quot;</span>
              <span className="tok-p">;</span>
              {"\n\n"}
              <span className="tok-k">if</span>{" "}
              <span className="tok-p">(</span>
              <span className="tok-id">error</span>
              <span className="tok-p">{")"}</span>{" "}
              <span className="tok-p">{"{"}</span>
              {"\n  "}
              <span className="tok-k">switch</span>{" "}
              <span className="tok-p">(</span>
              <span className="tok-id">error</span>
              <span className="tok-p">.</span>
              <span className="tok-id">code</span>
              <span className="tok-p">{")"}</span>{" "}
              <span className="tok-p">{"{"}</span>
              {"\n    "}
              <span className="tok-k">case</span>{" "}
              <span className="tok-t">DecaneErrorCode</span>
              <span className="tok-p">.</span>
              <span className="tok-id">USER_REJECTED</span>
              <span className="tok-p">:</span>
              {"\n      "}
              <span className="tok-k">break</span>
              <span className="tok-p">;</span>
              {"\n    "}
              <span className="tok-k">case</span>{" "}
              <span className="tok-t">DecaneErrorCode</span>
              <span className="tok-p">.</span>
              <span className="tok-id">NO_ACTIVE_SESSION</span>
              <span className="tok-p">:</span>
              {"\n      "}
              <span className="tok-k">break</span>
              <span className="tok-p">;</span>
              {"\n    "}
              <span className="tok-k">default</span>
              <span className="tok-p">:</span>
              {"\n      "}
              <span className="tok-id">console</span>
              <span className="tok-p">.</span>
              <span className="tok-f">error</span>
              <span className="tok-p">(</span>
              <span className="tok-id">error</span>
              <span className="tok-p">.</span>
              <span className="tok-id">message</span>
              <span className="tok-p">);</span>
              {"\n  "}
              <span className="tok-p">{"}"}</span>
              {"\n"}
              <span className="tok-p">{"}"}</span>
            </CodeBlock>

            <h3>Error codes</h3>
            <div className="docs-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th style={{ width: 80 }}>Value</th>
                    <th>When thrown</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["USER_REJECTED", "4001", "User dismissed the wallet prompt"],
                    ["UNAUTHORIZED", "4100", "Wallet refused the request"],
                    ["NO_ACTIVE_SESSION", "5001", "Signing called before connecting"],
                    ["SCOPE_MISMATCH", "5002", "Account not in session scope"],
                    ["SESSION_EXPIRED", "5003", "Session is no longer valid"],
                    ["UNSUPPORTED_CHAIN", "5010", "Chain ID not in registry"],
                    ["CHAIN_NOT_IN_SCOPE", "5011", "Chain not granted in session"],
                    ["INVALID_CHAIN_CONFIG", "5012", "Custom chain descriptor is malformed"],
                    ["NO_WALLET_CONNECTED", "5020", "Action requires a connected wallet"],
                    ["WALLET_DISCONNECTED", "5021", "Wallet disconnected mid-session"],
                    ["PROVIDER_ERROR", "5022", "Underlying wallet threw an error"],
                    ["METHOD_NOT_SUPPORTED", "5030", "Method not recognised"],
                    ["EVM_ONLY_METHOD", "5031", "wallet_signTypedData on a non-EVM chain"],
                  ].map(([code, val, desc]) => (
                    <tr key={code}>
                      <td><span className="docs-err-code">{code}</span></td>
                      <td className="docs-err-val">{val}</td>
                      <td>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Theme ── */}
          <section>
            <h2 id="theme">
              Theme <a className="docs-anchor" href="#theme">#</a>
            </h2>
            <p>
              The modal theme is controlled through <code>DecaneKit</code> config and toggled at runtime
              via <code>useDecane</code>.
            </p>
            <CodeBlock lang="tsx">
              <span className="tok-c">// Follow system preference (default)</span>
              {"\n"}
              <span className="tok-p">&lt;</span>
              <span className="tok-t">DecaneKit</span>{" "}
              <span className="tok-f">config</span>
              <span className="tok-p">{"={"}</span>
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">theme</span>
              <span className="tok-p">:</span>{" "}
              <span className="tok-s">&quot;auto&quot;</span>{" "}
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">{"}"}</span>
              <span className="tok-p">&gt;</span>
              {"\n\n"}
              <span className="tok-c">// Toggle at runtime</span>
              {"\n"}
              <span className="tok-k">const</span>{" "}
              <span className="tok-p">{"{"}</span>{" "}
              <span className="tok-id">theme</span>
              <span className="tok-p">,</span>{" "}
              <span className="tok-id">setTheme</span>{" "}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-p">=</span>{" "}
              <span className="tok-f">useDecane</span>
              <span className="tok-p">{"();"}</span>
            </CodeBlock>

            <h3>CSS custom properties</h3>
            <p>
              The SDK injects these tokens into <code>document.head</code> whenever the modal opens.
              Apply them anywhere in your own app.
            </p>
            <div className="docs-token-grid">
              {[
                ["--dc-bg", "background"],
                ["--dc-surface", "surface"],
                ["--dc-border", "border"],
                ["--dc-text", "text"],
                ["--dc-text-secondary", "text · secondary"],
                ["--dc-text-muted", "text · muted"],
                ["--dc-accent", "gold"],
                ["--dc-accent-hover", "gold · hover"],
                ["--dc-accent-text", "on-accent"],
                ["--dc-danger", "danger"],
              ].map(([name, desc]) => (
                <div key={name} className="docs-token">
                  <span className="docs-swatch" style={{ background: `var(${name})` }} />
                  <span className="label">{name}</span>
                  <span className="val">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── TypeScript ── */}
          <section>
            <h2 id="typescript">
              TypeScript <a className="docs-anchor" href="#typescript">#</a>
            </h2>
            <p>The package ships full type declarations. Key types:</p>
            <CodeBlock lang="ts">
              <span className="tok-k">import type</span>{" "}
              <span className="tok-p">{"{"}</span>
              {"\n  "}
              <span className="tok-id">DecaneProvider</span>
              <span className="tok-p">,</span>
              {"\n  "}
              <span className="tok-id">DecaneConfig</span>
              <span className="tok-p">,</span>
              {"\n  "}
              <span className="tok-id">UnifiedWalletAccount</span>
              <span className="tok-p">,</span>
              {"\n  "}
              <span className="tok-id">ChainDescriptor</span>
              <span className="tok-p">,</span>
              {"\n  "}
              <span className="tok-id">ActiveSession</span>
              <span className="tok-p">,</span>
              {"\n  "}
              <span className="tok-id">ChainType</span>
              <span className="tok-p">,</span>
              {"            "}
              <span className="tok-c">// &quot;evm&quot; | &quot;solana&quot; | &quot;tron&quot; | &quot;bitcoin&quot;</span>
              {"\n  "}
              <span className="tok-id">ChainId</span>
              <span className="tok-p">,</span>
              {"              "}
              <span className="tok-c">// union of all built-in CAIP-2 chain IDs</span>
              {"\n  "}
              <span className="tok-id">Theme</span>
              <span className="tok-p">,</span>
              {"                "}
              <span className="tok-c">// &quot;light&quot; | &quot;dark&quot; | &quot;auto&quot;</span>
              {"\n  "}
              <span className="tok-id">ConnectMode</span>
              <span className="tok-p">,</span>
              {"          "}
              <span className="tok-c">// mode union type</span>
              {"\n  "}
              <span className="tok-id">SocialConfig</span>
              <span className="tok-p">,</span>
              {"         "}
              <span className="tok-c">// social auth config shape</span>
              {"\n  "}
              <span className="tok-id">CAIP25Method</span>
              <span className="tok-p">,</span>
              {"\n"}
              <span className="tok-p">{"}"}</span>{" "}
              <span className="tok-k">from</span>{" "}
              <span className="tok-s">&quot;decane-connect-kit&quot;</span>
              <span className="tok-p">;</span>
            </CodeBlock>
          </section>

          {/* ── Not included ── */}
          <section>
            <h2 id="not-included">
              What is not included <a className="docs-anchor" href="#not-included">#</a>
            </h2>
            <ul>
              <li>
                Any backend server that signs transactions on behalf of users — the key server only
                provides a share for reconstruction, never produces signatures itself
              </li>
              <li>
                <code>window.ethereum</code> — detection uses EIP-6963 exclusively
              </li>
              <li>Seed phrase or private key export UI</li>
              <li>State management libraries (Redux, Zustand) — pure React context</li>
              <li>CSS-in-JS or UI component libraries — plain CSS custom properties only</li>
            </ul>
          </section>

          {/* ── Built-in chains ── */}
          <section>
            <h2 id="chain-list">
              Built-in chains <a className="docs-anchor" href="#chain-list">#</a>
            </h2>
            <p>
              The following chains are available out of the box. Pass <code>supportedChainIds</code> in
              config to restrict to a subset.
            </p>
            <ChainTable />
          </section>

          {/* Pager */}
          <div className="docs-pager">
            <a href="#overview" className="prev">
              <div className="dir">← Top</div>
              <div className="lbl">Back to overview</div>
            </a>
            <a href="#chain-list" className="next">
              <div className="dir">Reference →</div>
              <div className="lbl">Built-in chains</div>
            </a>
          </div>
        </main>

        <Toc />
      </div>
    </div>
  );
}
