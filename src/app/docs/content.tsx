import type { ReactNode } from "react";
import { CodeBlock } from "@/app/docs/components/CodeBlock";
import { ApiTable } from "@/app/docs/components/ApiTable";
import { ChainTable } from "@/app/docs/components/ChainTable";
import { FrameworkTabs } from "@/app/docs/components/FrameworkTabs";
import { DocsCards } from "@/app/docs/components/DocsCards";
import { VERSIONS } from "@/lib/versions";
import type { DocPage, SearchEntry } from "@/app/docs/components/types";

// One page per former section of the long docs page. Generated once from the
// single-page docs on 2026-09-27 and edited by hand since; the shell renders
// one entry at a time and the sidebar lists them by group.

/* eslint-disable @typescript-eslint/no-unused-vars */
// Lightweight highlighter emitting the same tok-* classes the hand-written
// code blocks use, so string-authored snippets match the rest visually.
const HL_KEYWORDS = new Set([
  "const", "let", "var", "await", "async", "new", "import", "export",
  "from", "return", "function", "interface", "type", "true", "false",
  "null", "undefined", "as", "of", "in",
]);

function hl(code: string): ReactNode[] {
  const re = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?n?\b)|([A-Za-z_$][A-Za-z0-9_$]*)|(\s+)|([^\s])/g;
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
    }
    else if (m[5] !== undefined) out.push(m[5]);
    else out.push(<span key={key} className="tok-p">{m[6]}</span>);
  }
  return out;
}

export const PAGES: DocPage[] = [
  {
    slug: 'overview', navLabel: 'Introduction', group: 'Get started', title: 'Connect a wallet. Or create one.', icon: 'home',
    body: (
      <>
            <p className="docs-lede">
              <strong>decane-connect-kit</strong> is a wallet layer for EVM, Solana, Tron, and Bitcoin
              dApps that also covers the case where a user has no wallet at all: built-in non-custodial
              social sign-in via Google and email. It detects installed wallets via EIP-6963, the Solana
              Wallet Standard, TronLink, and Unisat / OKX / MetaMask Snap providers, manages sessions with
              CAIP-25, and ships a polished selector UI covering both paths. Works with React 18+ in any
              framework.
            </p>

            <dl className="docs-facts">
              <div><dt>Networks</dt><dd>EVM (59 chains), Solana, Tron, Bitcoin</dd></div>
              <div><dt>No wallet yet</dt><dd>Google, email, phone, X, KingsChat or a custom JWT, with a non-custodial embedded wallet</dd></div>
              <div><dt>Requires</dt><dd>React 18+, any framework</dd></div>
              <div><dt>Package</dt><dd><code>decane-connect-kit</code> {VERSIONS.web}, MIT</dd></div>
            </dl>

            <div className="docs-agent">
              <p>
                Wiring up a coding agent? <code>kit.decane.app/llms.txt</code> is a self-contained
                spec for the web SDK and <code>llms-expo.txt</code> the same for React Native, both
                with real signatures for every integration path.{" "}
                <a href="/llms-version.json" target="_blank" rel="noreferrer"><code>llms-version.json</code></a>{" "}
                says whether a copy an agent already has is current.
              </p>
              <div className="docs-agent-actions">
                <a href="/llms.txt" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">llms.txt</a>
                <a href="/llms-expo.txt" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">llms-expo.txt</a>
              </div>
            </div>

            <DocsCards
              items={[
                { href: "#quick-start", title: "Quick start", desc: "Install, wrap the app, connect a wallet or sign a user in." },
                { href: "#social", title: "Social sign-in", desc: "Google, email, phone, X, KingsChat and custom JWT with embedded wallets." },
                { href: "#react-native", title: "React Native", desc: "The Expo SDK: config, unlock tiers, signing in and getting back in." },
                { href: "#hooks", title: "Hooks", desc: "useDecane, useSignMessage, useSendTransaction and the rest." },
                { href: "#errors", title: "Error handling", desc: "Every error code the SDK throws and what to do about it." },
                { href: "/node-docs", title: "Node SDK", desc: "Verify tokens and sign users in from your backend." },
              ]}
            />
      </>
    ),
  },
  {
    slug: 'install', group: 'Get started', title: 'Install', icon: 'package',
    body: (
      <>
            <CodeBlock lang="bash">
              <span className="tok-id">npm</span>{" "}
              <span className="tok-k">install</span>{" "}
              <span className="tok-s">decane-connect-kit</span>
            </CodeBlock>
            <p>
              React 18 or later is required as a peer dependency. Package details, versions, and
              weekly download stats are on{" "}
              <a href="https://www.npmjs.com/package/decane-connect-kit" target="_blank" rel="noreferrer">
                npmjs.com/package/decane-connect-kit
              </a>.
            </p>
      </>
    ),
  },
  {
    slug: 'quick-start', group: 'Get started', title: 'Quick start', icon: 'rocket',
    body: (
      <>
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
      </>
    ),
  },
  {
    slug: 'framework-setup', group: 'Get started', title: 'Framework setup', icon: 'layers',
    body: (
      <>
            <FrameworkTabs />
      </>
    ),
  },
  {
    slug: 'configuration', group: 'Configuration', title: 'Configuration', icon: 'sliders',
    body: (
      <>
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
      </>
    ),
  },
  {
    slug: 'social', group: 'Social sign-in', title: 'Social sign-in', icon: 'user',
    body: (
      <>
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
              {"\n  "}
              <span className="tok-id">requireAssertionPerSignature</span>
              <span className="tok-p">?:</span>{" "}
              <span className="tok-t">boolean</span>
              <span className="tok-p">;</span>
              {"  "}
              <span className="tok-c">// default: false — see below</span>
              {"\n"}
              <span className="tok-p">{"}"}</span>
            </CodeBlock>

            <h3 id="per-signature-assertion">Per-signature assertion</h3>
            <p>
              By default an unlocked session signs freely until it expires — one unlock, then no
              further prompts for the session&rsquo;s lifetime. Setting{" "}
              <code>requireAssertionPerSignature: true</code> instead demands a fresh passkey
              assertion for <em>every</em> signature, verified inside the TEE against a single-use
              challenge with a 60-second TTL. The same gate already protects{" "}
              <code>rotateShares</code> and <code>exportPortableBackup</code>.
            </p>
            <CodeBlock lang="tsx">
              {hl(`social: {
  apiKey: "dck_live_…",
  requireAssertionPerSignature: true,
}`)}
            </CodeBlock>
            <div className="docs-callout" data-kind="warn">
              <div className="ico">!</div>
              <p>
                <strong>This does not shorten the session.</strong> The session stays warm for its
                full duration — deliberately, so there is no re-attestation and no re-authentication
                per signature. What changes is that a live session alone stops being sufficient
                authority: each signature is re-proven. If you want a shorter window as well,
                that&rsquo;s the separate <code>sessionDurationMinutes</code> knob.
              </p>
            </div>
            <p>
              Two practical consequences. Multi-step flows prompt per leg — an ERC-20 approve plus a
              swap is two prompts, not one. And it needs a passkey: a PIN-only wallet has no
              authenticator to assert with, so signing fails rather than falling back.
            </p>
            <div className="docs-callout" data-kind="note">
              <div className="ico">i</div>
              <p>
                Scope, stated plainly: the policy is declared by the client when the session opens.
                That makes a <em>leaked session handle</em> worthless without the authenticator, but
                a fully compromised page could open a session without the flag. Making it
                unbypassable requires the policy to come from the server per user or per project,
                which is not implemented yet.
              </p>
            </div>

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
            <p>
              Sign-in state and the sign-in methods, nothing that signs transactions. Use it in the
              parts of the app that only need to know who is signed in.
            </p>
            <ApiTable
              groups={[
                {
                  title: 'State',
                  rows: [
                    { name: 'isConnected', type: 'boolean', desc: 'A session exists.' },
                    { name: 'isUnlocked', type: 'boolean', desc: 'The wallet can sign right now.' },
                    { name: 'isNewUser', type: 'boolean', desc: 'This sign-in created the account.' },
                    { name: 'addresses', type: '{ evm?, solana?, tron? } | null', desc: 'Known before unlock; a restored tab has addresses but no session.' },
                    { name: 'needsReconnect', type: 'boolean', desc: <>Addresses are known but there is no live session. Route through sign-in; <code>unlock()</code> or a passkey restores it.</> },
                    { name: 'canUsePasskey', type: 'boolean', desc: <>This device can sign the remembered user back in with one passkey prompt. See <a href="#signing-back-in">signing back in</a>.</> },
                    { name: 'sessionExpiresAt', type: 'number | null', desc: 'Unix ms.' },
                    { name: 'profile', type: '{ name?, email?, picture? } | null', desc: 'What the provider revealed at sign-in.' },
                    { name: 'providerSubject', type: 'string | null', desc: "The provider's stable id for the user, such as X's numeric id." },
                    { name: 'phase', type: '"creating" | "unlocking" | null', desc: 'Key generation on first sign-in, or reopening a session.' },
                    { name: 'isCreatingWallet', type: 'boolean', desc: <>Shorthand for <code>phase === &quot;creating&quot;</code>.</> },
                    { name: 'error', type: 'string | null', desc: <>Last failure; <code>clearError()</code> resets it.</> },
                  ],
                },
                {
                  title: 'Sign in',
                  rows: [
                    { name: 'signInWithGoogle()', type: '() => Promise<void>', desc: 'Redirect flow.' },
                    { name: 'signInWithKingsChat()', type: '() => Promise<void>', desc: 'Redirect flow.' },
                    { name: 'signInWithX()', type: '() => Promise<void>', desc: 'Redirect flow. X releases no email; the handle and id come back on the profile.' },
                    { name: 'sendEmailCode(email)', type: '(email) => Promise<{ codeRequired: true }>', desc: <>Then <code>confirmEmailCode(email, code)</code>.</> },
                    { name: 'confirmEmailCode(email, code)', type: '(email, code) => Promise<void>', desc: 'Completes the email sign-in.' },
                    { name: 'sendPhoneCode(phone)', type: '(phone) => Promise<{ codeRequired: true }>', desc: <>Then <code>confirmPhoneCode(phone, code)</code>. E.164 numbers only.</> },
                    { name: 'confirmPhoneCode(phone, code)', type: '(phone, code) => Promise<void>', desc: 'Completes the phone sign-in.' },
                    { name: 'signInWithToken(token, opts?)', type: '(token, { providerId? }?) => Promise<void>', desc: <>A token from your own provider. See <a href="#custom-auth">custom auth</a>.</> },
                    { name: 'signInWithCustomAuth()', type: '(() => Promise<void>) | undefined', desc: <>Only when <code>social.customAuth</code> is configured.</> },
                    { name: 'signInWithPasskey()', type: '() => Promise<void>', desc: 'One prompt, no provider: a server-verified WebAuthn login mints the session.' },
                    { name: 'unlock()', type: '() => Promise<void>', desc: 'Reopen a session for a remembered user on this device.' },
                    { name: 'disconnect()', type: '() => Promise<void>', desc: <>Sign out. Revokes the JWT; keeps the device share and remembers who left. See <a href="#signing-back-in">signing back in</a>.</> },
                  ],
                },
                {
                  title: 'Progress',
                  rows: [
                    { name: 'googleLoading', type: 'boolean', desc: 'Per method, while that sign-in is in flight.' },
                    { name: 'kingschatLoading', type: 'boolean', desc: '' },
                    { name: 'xLoading', type: 'boolean', desc: '' },
                    { name: 'emailLoading', type: 'boolean', desc: '' },
                    { name: 'phoneLoading', type: 'boolean', desc: '' },
                    { name: 'tokenLoading', type: 'boolean', desc: '' },
                    { name: 'customLoading', type: 'boolean', desc: '' },
                    { name: 'customAuthLabel', type: 'string | undefined', desc: <>The button text you configured, e.g. <code>&quot;Continue with Acme&quot;</code>.</> },
                  ],
                },
              ]}
            />
            <h3 id="useSocialWallet">
              <code>useSocialWallet()</code>
            </h3>
            <p>
              Everything in <code>useSocialAuth()</code>, plus signing, balances, the device&apos;s
              passkey and password, recovery, and control of the built-in modal.
            </p>
            <ApiTable
              groups={[
                {
                  title: 'Modal',
                  rows: [
                    { name: 'modalOpen', type: 'boolean', desc: '' },
                    { name: 'openModal()', type: '() => void', desc: <>Opens <a href="#social-wallet-modal"><code>SocialWalletModal</code></a>.</> },
                    { name: 'closeModal()', type: '() => void', desc: '' },
                  ],
                },
                {
                  title: 'Signing',
                  rows: [
                    { name: 'signMessage(chain, message)', type: '(chain, message) => Promise<string>', desc: 'Personal-sign on EVM, raw message on Solana.' },
                    { name: 'sendTransaction(req)', type: '(req) => Promise<string>', desc: <>Returns the hash. See <a href="#send-erc20">sending ERC-20</a>.</> },
                    { name: 'signTypedData(req)', type: '({ chain, domain, types, message }) => Promise<string>', desc: 'EIP-712.' },
                    { name: 'signAuthorization(req)', type: '(req) => Promise<SignedAuthorization>', desc: 'EIP-7702 delegation.' },
                    { name: 'signSolanaTransaction(tx)', type: '(tx) => Promise<Uint8Array>', desc: <>See <a href="#send-solana">sending on Solana</a>.</> },
                    { name: 'signTronTransaction(rawDataHex)', type: '(rawDataHex) => Promise<string>', desc: '' },
                    { name: 'getEthereumProvider(opts?)', type: '({ chainId? }?) => Eip1193Provider', desc: 'For viem, ethers or wagmi. Stable across renders.' },
                  ],
                },
                {
                  title: 'Balances and history',
                  rows: [
                    { name: 'getBalance(chain?)', type: '(chain?) => Promise<BalanceResult>', desc: 'Native balance; works while locked.' },
                    { name: 'getBalances()', type: '() => Promise<{ chain, balance }[]>', desc: 'Every configured chain; a dead RPC gives null for that chain, not a rejection.' },
                    { name: 'recordTransaction(tx)', type: '(tx) => Promise<TransactionRecord>', desc: 'For transactions your app broadcast itself.' },
                    { name: 'getTransactionHistory(limit?)', type: '(limit?) => Promise<TransactionRecord[]>', desc: 'Most recent first. Needs a live session.' },
                    { name: 'getAccessToken()', type: '() => string | null', desc: 'The session JWT, for your own backend.' },
                  ],
                },
                {
                  title: 'Passkey and password, this device',
                  rows: [
                    { name: 'hasPasskey()', type: '() => Promise<boolean>', desc: '' },
                    { name: 'addPasskey()', type: '() => Promise<void>', desc: 'Needs a live session.' },
                    { name: 'setUnlockPassword(password)', type: '(password) => Promise<void>', desc: <>Needs a live session. Throws <code>WeakPasswordError</code> for a password too weak to carry a session.</> },
                    { name: 'canUnlockWithPassword()', type: '() => Promise<boolean>', desc: 'Signed out: can this device open a session from the password alone?' },
                    { name: 'unlockWithPassword(password)', type: '(password) => Promise<void>', desc: 'Signed out: opens one. No provider, no passkey.' },
                    { name: 'removeUnlockPassword()', type: '() => Promise<void>', desc: 'Turns the password path off, account-wide.' },
                    { name: 'forgetLastUser()', type: '() => void', desc: <>&ldquo;Use a different account.&rdquo; Drops the memory of who signed out so they stop being offered; device shares are untouched.</> },
                  ],
                },
                {
                  title: 'Recovery',
                  rows: [
                    { name: 'rotateShares(opts)', type: '({ password, passwordHint? }) => Promise<RecoveryShareFile>', desc: 'Re-issues the share set and returns the recovery file.' },
                    { name: 'exportPortableBackup(opts)', type: '({ password, passwordHint? }) => Promise<PortableBackup>', desc: '' },
                    { name: 'hasRecoveryShare()', type: '() => Promise<boolean>', desc: '' },
                    { name: 'shouldPromptRecovery()', type: '() => Promise<boolean>', desc: 'Whether to nudge the user to set recovery up.' },
                    { name: 'dismissRecoveryPrompt()', type: '() => Promise<void>', desc: '' },
                  ],
                },
                {
                  title: 'Status',
                  rows: [
                    { name: 'loading', type: 'boolean', desc: 'A signing call is in flight.' },
                    { name: 'error', type: 'string | null', desc: <><code>clearError()</code> resets it.</> },
                  ],
                },
              ]}
            />

            <h4 id="signing-back-in">Signing back in after sign-out</h4>
            <p>
              <code>disconnect()</code> ends the session, revoking the JWT, but deliberately keeps the
              device&apos;s passkey- or password-wrapped share, so a returning user is one prompt from a
              session instead of a full sign-in. Since 2.22 it also remembers <em>which</em> account signed
              out. That is what lets <code>canUsePasskey</code> and <code>canUnlockWithPassword()</code> offer
              that account&apos;s own way back even when several accounts are enrolled on the same browser.
              The remembered id is a lookup key, not a credential: <code>signInWithPasskey()</code> still
              needs a server-verified WebAuthn assertion and <code>unlockWithPassword()</code> still needs
              the password.
            </p>
            <p>
              Offer the shortcut when <code>canUsePasskey</code> (prefer it) or{" "}
              <code>await canUnlockWithPassword()</code> is true, and show the full method list otherwise.
              &ldquo;Use a different account&rdquo; is <code>forgetLastUser()</code>. Only these explicit
              entry points consult the memory; <code>connect()</code> and <code>unlock()</code> keep the
              strict lookup, so an ordinary sign-in never silently re-offers the account the user just left.
            </p>
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

            <h3 id="send-erc20">Send an ERC-20 token</h3>
            <p>
              An ERC-20 transfer is a contract call: <code>to</code> is the token contract,{" "}
              <code>value</code> is zero, and the <code>data</code> field carries the encoded{" "}
              <code>transfer(recipient, amount)</code> call. The SDK broadcasts it the same way and
              returns a transaction hash.
            </p>
            <CodeBlock lang="tsx">
              {hl(`import { Interface, parseUnits } from "ethers";

const { sendTransaction } = useSocialWallet();

const iface = new Interface(["function transfer(address to, uint256 amount)"]);
const data = iface.encodeFunctionData("transfer", [
  recipient,
  parseUnits("1.5", 6), // 1.5 USDC (6 decimals — check the token)
]);

const hash = await sendTransaction({
  chain: "eip155:1",
  to: tokenContractAddress, // the ERC-20 contract, not the recipient
  value: 0n,
  data,
});`)}
            </CodeBlock>

            <h3 id="send-solana">Send a Solana transaction</h3>
            <p>
              <code>sendTransaction</code> is EVM-only. For Solana, build and serialize the
              transaction yourself, hand it to <code>signSolanaTransaction</code> — which returns the
              fully signed transaction bytes — then broadcast those to the cluster.
            </p>
            <CodeBlock lang="tsx">
              {hl(`import {
  Connection, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const { signSolanaTransaction, addresses } = useSocialWallet();

const conn = new Connection("https://api.devnet.solana.com", "confirmed");
const fromPk = new PublicKey(addresses.solana);
const { blockhash } = await conn.getLatestBlockhash();

const tx = new Transaction({ feePayer: fromPk, recentBlockhash: blockhash }).add(
  SystemProgram.transfer({
    fromPubkey: fromPk,
    toPubkey: new PublicKey(recipient),
    lamports: BigInt(0.01 * LAMPORTS_PER_SOL),
  }),
);

// TEE signs and returns broadcast-ready bytes
const signed = await signSolanaTransaction(
  new Uint8Array(tx.serialize({ requireAllSignatures: false })),
);
const signature = await conn.sendRawTransaction(signed);`)}
            </CodeBlock>
            <p>
              The TEE signs on whichever Solana chain is listed in <code>social.chains</code>. The
              signature is cluster-agnostic, so you can build against and broadcast to either mainnet
              or devnet.
            </p>
      </>
    ),
  },
  {
    slug: 'custom-auth', group: 'Social sign-in', title: 'Custom auth', icon: 'key',
    body: (
      <>
            <p>
              Google and email are the default social sign-in methods, but you can also bring your
              own identity provider — Auth0, Clerk, Firebase, Cognito, or your own backend&rsquo;s JWT
              issuer. Register the issuer once in the dashboard; from then on the SDK exchanges a
              token your system already issues for a Decane session, and everything downstream
              (wallet creation, signing, recovery) is identical to Google/email sign-in. You write no
              auth code and store no secret with Decane — only public information (issuer URL, JWKS
              URL) ever reaches the dashboard.
            </p>

            <h3 id="custom-auth-register">Register a provider</h3>
            <p>Dashboard → your project → <strong>Custom Auth</strong> → Add provider.</p>
            <div className="docs-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "22%" }}>Field</th>
                    <th>What it is</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Issuer</strong></td>
                    <td>The <code>iss</code> claim your tokens carry. Must match exactly.</td>
                  </tr>
                  <tr>
                    <td><strong>JWKS URL</strong></td>
                    <td>
                      Where your public signing keys live. Must be <code>https://</code> (or{" "}
                      <code>localhost</code> for local dev) — a downgraded fetch would let an
                      on-path attacker serve a forged key set.
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Identity claim</strong></td>
                    <td>Which claim identifies the user. Defaults to <code>sub</code>.</td>
                  </tr>
                  <tr>
                    <td><strong>Audience</strong></td>
                    <td>Expected <code>aud</code> claim. Optional — omit to accept any audience.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="docs-callout" data-kind="warn">
              <div className="ico">!</div>
              <p>
                <strong>Issuer and identity claim are immutable once created.</strong> Every user&rsquo;s
                wallet is derived from <code>HMAC(providerId + claim value)</code> — changing either
                would silently re-identify existing users with no error anywhere, just an
                empty-looking wallet. Register a second provider instead. For the same reason, a
                provider can&rsquo;t be deleted once it has signed in at least one user — disable it
                instead; existing users keep working, no new ones are admitted.
              </p>
            </div>

            <h3 id="custom-auth-config">Config</h3>
            <p>
              Add <code>customAuth</code> to <code>SocialConfig</code>. <code>getToken</code> runs
              when the user clicks the button — wire it to however you already obtain a token from
              your auth system (often: after your own login flow completes).
            </p>
            <CodeBlock lang="tsx">
              {hl(`<DecaneKit
  config={{
    appId: "<your project id>",
    mode: "all",
    social: {
      apiKey: "<your api key>",
      authMethods: ["google", "email"],
      chains: ["evm:1", "solana:mainnet"],
      customAuth: {
        label: "Continue with Acme Inc",   // button text
        providerId: undefined,             // only needed with >1 provider
        getToken: async () => {
          const session = await myAuthClient.getSession();
          return session.accessToken;
        },
      },
    },
  }}
>
  {children}
</DecaneKit>`)}
            </CodeBlock>
            <p>
              This renders a button in both <code>WalletSelector</code> and{" "}
              <code>SocialWalletModal</code>&rsquo;s sign-in view, alongside Google/email — no other UI
              work needed.
            </p>

            <h3 id="custom-auth-headless">Headless</h3>
            <p>Driving your own sign-in UI instead of the built-in modal:</p>
            <CodeBlock lang="tsx">
              {hl(`import { useSocialAuth } from "decane-connect-kit";

function MySignInButton() {
  const { signInWithToken, tokenLoading } = useSocialAuth();

  async function handleClick() {
    const token = await myAuthClient.getAccessToken();
    await signInWithToken(token /*, { providerId: "..." } if you have >1 provider */);
  }

  return <button onClick={handleClick} disabled={tokenLoading}>Sign in</button>;
}`)}
            </CodeBlock>
            <p>Or fully outside React, via the standalone social SDK:</p>
            <CodeBlock lang="ts">
              {hl(`import { createDecaneConnect } from "decane-connect-kit";

const connect = await createDecaneConnect({
  appId: "<your project id>",
  apiKey: "<your api key>",
  authMethods: ["google", "email"],
  chains: ["evm:1", "solana:mainnet"],
});

const token = await myAuthClient.getAccessToken();
const { addresses, isNewUser } = await connect.connectWithToken(token);`)}
            </CodeBlock>
            <p>
              <code>connectWithToken</code> returns the same <code>ConnectResult</code> shape as{" "}
              <code>connectWithGoogle</code> / <code>verifyEmailCode</code>.
            </p>

            <h3 id="custom-auth-jwks">JWKS format</h3>
            <p>
              Your JWKS URL must return a standard key set — a <code>keys</code> array containing
              the public key your tokens are signed with, matched by <code>kid</code>. RSA (
              <code>RS256</code> — the default for Auth0, Clerk, and Firebase):
            </p>
            <CodeBlock lang="json">
              {hl(`{
  "keys": [
    {
      "kty": "RSA",
      "kid": "your-key-id-1",
      "use": "sig",
      "alg": "RS256",
      "n": "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtV...",
      "e": "AQAB"
    }
  ]
}`)}
            </CodeBlock>
            <p>
              EC (<code>ES256</code>) is also supported — <code>{"{ kty: \"EC\", crv: \"P-256\", x, y }"}</code>{" "}
              instead of <code>n</code>/<code>e</code>. Multiple keys in the array is how rotation
              works: the moment a token shows up with an unrecognized <code>kid</code>, the backend
              refetches your JWKS automatically — no coordination needed when you rotate your signing
              key.
            </p>

            <h3 id="custom-auth-multi">Multiple providers</h3>
            <p>
              With more than one enabled custom provider on a project, pass <code>providerId</code>{" "}
              so the backend knows which issuer/JWKS to verify against — without it, trying every
              configured issuer in turn would let a token from a weak provider be accepted as if it
              came from a strong one. With exactly one provider configured, <code>providerId</code>{" "}
              can always be omitted.
            </p>

            <h3 id="custom-auth-testing">Testing locally</h3>
            <p>
              <code>packages/backend/mock-idp.mjs</code> is a throwaway identity provider for exactly
              this — generates a keypair on boot, publishes a JWKS, and mints tokens on demand, no
              external account needed.
            </p>
            <CodeBlock lang="bash">
              {hl(`node packages/backend/mock-idp.mjs
# then:
curl "http://localhost:4000/token?sub=alice&email=alice@example.com"`)}
            </CodeBlock>

            <div className="docs-callout" data-kind="security">
              <div className="ico">✓</div>
              <p>
                Decane never sees your users&rsquo; credentials — only a token they already have, and
                only its signature, issuer, and one claim. A provider&rsquo;s config is trusted for its
                own project only; a developer who controls it can assert any identity within their
                own project, which is inherent to &ldquo;bring your own issuer&rdquo; and not a
                Decane-specific risk.
              </p>
            </div>
      </>
    ),
  },
  {
    slug: 'react-native', group: 'React Native', title: 'React Native', icon: 'phone',
    body: (
      <>
            <p>
              <code>decane-connect-kit-expo</code> brings the same wallets to iOS and Android. It is
              <strong> headless</strong> — functions only, no components — so the wallet UI is entirely
              yours. Everything below is in addition to the web SDK, not a replacement for it: a user who
              signs in on your website and in your app gets the <em>same wallet</em>, provided both use the
              same <code>appId</code>.
            </p>

            <h3 id="rn-install">Install</h3>
            <CodeBlock lang="bash">
              {hl(`npx expo install decane-connect-kit-expo \\
  expo-secure-store expo-crypto expo-local-authentication expo-web-browser

// optional — unlocks the passkey tier
npx expo install react-native-passkeys

// optional — native Google Sign-In
npx expo install @react-native-google-signin/google-signin`)}
            </CodeBlock>
            <p>
              <code>crypto.getRandomValues</code> and <code>Buffer</code> are polyfilled by the SDK on
              import, so you do not need <code>react-native-get-random-values</code>.
            </p>

            <div className="docs-callout" data-kind="warn">
              <div className="ico">!</div>
              <p>
                <strong>Expo Go will not work.</strong> These are native modules, so the app must be a
                development build. Expo Go has no binary for them and rejects the project before any
                JavaScript runs — which presents as the app opening and closing instantly with nothing in
                the Metro logs. Run <code>npx expo prebuild</code> then{" "}
                <code>npx expo run:android</code> (or <code>run:ios</code>).
              </p>
            </div>

            <h3 id="rn-config">Configuration</h3>
            <CodeBlock lang="tsx">
              {hl(`import { createDecaneConnect } from "decane-connect-kit-expo";

const decane = await createDecaneConnect({
  appId:       "proj_…",
  apiKey:      "dck_live_…",
  chains:      ["evm:8453", "solana:mainnet"],
  authMethods: ["email", "google"],

  redirectUri: "yourapp://auth",    // Google and KingsChat return here
  promptPin:   async () => showPinSheet(),

  rpId: "app.example.com",          // optional — enables the passkey tier
});`)}
            </CodeBlock>

            <p>
              The native config is a strict superset of the web one — five extra keys, nothing web-only.
              They all exist for the same reason: <strong>the browser infers them from <code>window</code>
              or from having WebAssembly, and React Native has neither.</strong>
            </p>
            <div className="docs-table-wrap">
              <table className="docs-table">
                <thead>
                  <tr><th>Key</th><th>Why it is native-only</th></tr>
                </thead>
                <tbody>
                  <tr><td><code>verifyAttestation</code></td><td>No WebAssembly, so the DCAP quote verifier cannot run on device</td></tr>
                  <tr><td><code>insecureSkipAttestation</code></td><td>Development escape hatch; web can always verify locally</td></tr>
                  <tr><td><code>origin</code></td><td>Android&rsquo;s WebAuthn origin is <code>android:apk-key-hash:…</code>, not a URL</td></tr>
                  <tr><td><code>redirectUri</code></td><td>No <code>window.location.origin</code> to fall back on</td></tr>
                  <tr><td><code>unlockPreference</code></td><td>Native has three unlock tiers; web has two</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              Two shared keys also behave differently. <code>rpId</code> defaults to the hostname on web but
              has <strong>no default</strong> here — leaving it unset silently drops you to the
              secure-enclave tier. And <code>persistSession</code> uses <code>sessionStorage</code> on web,
              which dies with the tab; on native a session survives an app restart until its recorded
              expiry, because backgrounding an app is not a sign-out.
            </p>

            <h3 id="rn-unlock">Unlock tiers</h3>
            <p>
              The device&rsquo;s share of the key is encrypted at rest. Which key protects it depends on what
              the device can actually do — the SDK probes each tier in order and uses the first that
              genuinely works. You do not choose it; the device does.
            </p>
            <div className="docs-table-wrap">
              <table className="docs-table">
                <thead>
                  <tr><th>Tier</th><th>Key source</th><th>Passkey sign-in</th><th>New device</th></tr>
                </thead>
                <tbody>
                  <tr><td><code>passkey</code></td><td>WebAuthn PRF output</td><td>yes</td><td>passkey sync</td></tr>
                  <tr><td><code>secure-enclave</code></td><td>random key in Keychain / Keystore, behind biometrics</td><td>no</td><td>recovery file</td></tr>
                  <tr><td><code>pin</code></td><td>PBKDF2 over a user PIN</td><td>no</td><td>recovery file</td></tr>
                </tbody>
              </table>
            </div>
            <CodeBlock lang="tsx">
              {hl(`const caps = await decane.getCapabilities();
// { passkeys, passkeyPrf, secureEnclave, activeUnlockMethod }

// narrow or reorder the tiers
unlockPreference: ["secure-enclave", "pin"]`)}
            </CodeBlock>
            <p>
              The passkey probe is a <strong>real ceremony</strong>, not a feature flag: a device that
              reports passkey support but returns no PRF output falls through to the next tier rather than
              ending up with a wallet nothing can unlock.
            </p>
            <div className="docs-callout" data-kind="note">
              <div className="ico">i</div>
              <p>
                <strong>Expect two biometric prompts at signup</strong> on the passkey tier — one to create
                the credential, one to evaluate the PRF salt. That is how the WebAuthn PRF extension
                behaves on iOS and Android: <code>create()</code> reports only that PRF is
                <em> available</em>. It does not repeat on later unlocks.
              </p>
            </div>
            <p>
              The passkey tier also needs an associated domain: <code>webcredentials:&lt;rpId&gt;</code> plus
              an <code>apple-app-site-association</code> file on iOS, and{" "}
              <code>assetlinks.json</code> on Android. On Android you must additionally pass{" "}
              <code>origin</code>, because Android reports an APK key hash rather than a URL.
            </p>

            <h3 id="rn-auth">Signing in</h3>
            <CodeBlock lang="tsx">
              {hl(`// Email — nothing to register
await decane.connectWithEmail(email);
await decane.verifyEmailCode(email, code);

// Google — nothing to register with Google at all
await decane.connectWithGoogle();

// KingsChat
await decane.connectWithKingsChat();

// Your own identity provider
await decane.connectWithToken(idToken);

// Returning user who still has their passkey on this device
if (await decane.canSignInWithPasskey()) await decane.signInWithPasskey();`)}
            </CodeBlock>
            <div className="docs-callout" data-kind="warn">
              <div className="ico">!</div>
              <p>
                <strong>Use <code>connectWithGoogleToken</code>, not <code>connectWithToken</code>, for
                Google.</strong> The latter goes through the generic external-provider path, which
                namespaces the identity by provider and would hand the same person a{" "}
                <em>different wallet</em> than your website does.
              </p>
            </div>
            <p>
              <code>connectWithGoogle()</code> opens an in-app auth sheet —{" "}
              <code>ASWebAuthenticationSession</code> on iOS, a Chrome Custom Tab on Android — and returns
              to <code>redirectUri</code> when the user is done. Your app is never backgrounded.
            </p>
            <div className="docs-callout" data-kind="info">
              <div className="ico">i</div>
              <p>
                <strong>Nothing to register in Google Cloud.</strong> The OAuth client is Decane&rsquo;s and
                the redirect goes to Decane&rsquo;s backend, which then hops to your scheme — so Google never
                sees your package name, bundle ID or signing fingerprint. That means no per-build SHA-1
                registration, and nobody blocking your release.
              </p>
            </div>
            <p>
              A native account sheet is available via{" "}
              <code>connectWithGoogleToken()</code> if you prefer it, but it is opt-in: Google must then
              know your exact binary, which means registering a package name and a SHA-1 for every build
              type (debug, release, and Play App Signing produce three different fingerprints).
            </p>

            <h3 id="rn-api">Using the wallet</h3>
            <CodeBlock lang="tsx">
              {hl(`decane.getAddresses();     // { evm, solana, tron } | null
decane.isUnlocked();
decane.needsReconnect();   // known identity, dead session → show sign-in
decane.getAccessToken();   // Decane JWT, for your own backend

await decane.signMessage({ chain: "evm:8453", message: "gm" });
await decane.sendTransaction({ chain: "evm:8453", to, value });
await decane.signTypedData({ chain: "evm:8453", domain, types, message });
await decane.signSolanaTransaction(serializedTx);  // you broadcast
await decane.getBalances();

decane.on("wallet-creating", () => showProgress());`)}
            </CodeBlock>
            <p>
              <code>wallet-creating</code> is worth a progress state: it covers key generation, the Shamir
              split, unlock-tier setup and the first enclave session, and takes several seconds.
            </p>

            <h3 id="rn-recovery">Getting back in</h3>
            <p>
              By default a user who reinstalls your app, or opens it on a new phone, gets their wallet back
              from <strong>signing in alone</strong> — nothing to write down, nothing to keep.
            </p>
            <div className="docs-callout" data-kind="security">
              <div className="ico">§</div>
              <p>
                <strong>What this costs you.</strong> Enrolling stores a second Shamir share sealed to the
                enclave, so the enclave can rebuild a wallet by itself. It is encrypted with a key derived
                inside the TEE, so your backend and its database still cannot — but a malicious enclave
                image, or anyone able to mint JWTs, could. That is the deliberate trade for a wallet a
                person can always get back into.
              </p>
            </div>
            <p>
              Wire up the recovery-file callbacks regardless — they are the fallback when server-assisted
              recovery is off or unavailable: <code>onRecoveryShareOffer</code>,{" "}
              <code>onRecoveryFileReady</code>, <code>promptForRecoveryFile</code> and{" "}
              <code>onRecoveryRotated</code>. Every recovery and rotation invalidates the previous file, so
              the last of those must capture a password for the replacement.
            </p>

            <h3 id="rn-attestation">Attestation</h3>
            <div className="docs-callout" data-kind="security">
              <div className="ico">§</div>
              <p>
                React Native has <strong>no WebAssembly</strong>, so the Intel DCAP quote verifier the web
                SDK runs cannot execute on device. Without <code>verifyAttestation</code>, the SDK can only
                check that the enclave <em>reports</em> the measurement you pinned — which the enclave
                asserts about itself. That is a consistency check, not a proof. Supply the hook in
                production and verify the quote server-side.
              </p>
            </div>

            <h3 id="rn-performance">Performance</h3>
            <p>
              PBKDF2 runs in pure JavaScript here — there is no native implementation to call — so 600,000
              iterations costs <strong>seconds, not milliseconds</strong>. It is paid only on PIN unlock and
              on recovery-file encrypt/decrypt; never on the passkey or biometric path, and never per
              signature. Show a spinner on those two flows.
            </p>
      </>
    ),
  },
  {
    slug: 'ios', group: 'Native apps', title: 'iOS and macOS (Swift)', navLabel: 'iOS (Swift)', icon: 'phone',
    body: (
      <>
            <p>
              <code>DecaneKit</code> is the native Swift SDK for iOS 16+ and macOS 13+. Its wallet logic
              is the shared Rust core, byte-compatible with this SDK and the React Native one: a user who
              signs in on your website and in your iOS app gets the <em>same wallet</em>, at the same
              addresses, provided both use the same <code>appId</code>. The full spec is{" "}
              <a href="/llms-swift.txt" target="_blank" rel="noreferrer">llms-swift.txt</a>.
            </p>
            <h3 id="ios-install">Install ({VERSIONS.swift})</h3>
            <CodeBlock lang="swift" file="Package.swift">
              .package(url: <span className="tok-s">&quot;https://github.com/Korex23/decane-swift&quot;</span>, from: <span className="tok-s">&quot;{VERSIONS.swift}&quot;</span>)
            </CodeBlock>
            <p>
              Or in Xcode: File → Add Package Dependencies → <code>https://github.com/Korex23/decane-swift</code>,
              product <code>DecaneKit</code> (plus <code>DecaneKitUI</code> for the SwiftUI wrapper).
            </p>
            <h3 id="ios-quick-start">Quick start</h3>
            <CodeBlock lang="swift" file="Wallet.swift">
              <span className="tok-k">import</span> DecaneKit{"\n"}
              {"\n"}
              <span className="tok-k">let</span> wallet = <span className="tok-k">try</span> DecaneWallet(config: DecaneConfig({"\n"}
              {"  "}appId: <span className="tok-s">&quot;proj_…&quot;</span>,{"\n"}
              {"  "}apiKey: <span className="tok-s">&quot;dck_live_…&quot;</span>,{"\n"}
              {"  "}chains: [<span className="tok-s">&quot;evm:8453&quot;</span>, <span className="tok-s">&quot;solana:mainnet&quot;</span>],{"\n"}
              {"  "}protection: .identity{"\n"}
              )){"\n"}
              {"\n"}
              <span className="tok-k">try await</span> wallet.connectWithEmail(<span className="tok-s">&quot;user@example.com&quot;</span>){"\n"}
              <span className="tok-k">let</span> result = <span className="tok-k">try await</span> wallet.verifyEmailCode(email: <span className="tok-s">&quot;user@example.com&quot;</span>, code: <span className="tok-s">&quot;123456&quot;</span>){"\n"}
              <span className="tok-k">let</span> signature = <span className="tok-k">try await</span> wallet.signMessage(chain: <span className="tok-s">&quot;evm:8453&quot;</span>, text: <span className="tok-s">&quot;Hello&quot;</span>)
            </CodeBlock>
            <h3 id="ios-scope">What {VERSIONS.swift} does</h3>
            <p>
              The identity tier: nothing stored on the device, every visit a sign-in. Email, phone,
              Google-token, KingsChat-token and custom-token sign-in; wallet creation; provisioning on new
              devices, including wallets your server made with <code>createUser</code>; signing for EVM
              (messages, transactions, EIP-712, EIP-7702), Solana and Tron. The device tier (Face ID / PIN
              unlock), passkeys, Google and X redirect sign-in and recovery files are not in this version
              yet; each answers a clear error rather than failing silently.
            </p>
            <p>
              A native Android library on the same core is built and on its way; until it ships, Android
              apps use <a href="/docs/react-native">the React Native SDK</a>.
            </p>
      </>
    ),
  },
  {
    slug: 'hooks', group: 'Hooks', title: 'Hooks', icon: 'link',
    body: (
      <>
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
      </>
    ),
  },
  {
    slug: 'detection', group: 'Reference', title: 'Wallet detection', icon: 'search',
    body: (
      <>
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
      </>
    ),
  },
  {
    slug: 'chain-constants', group: 'Reference', title: 'Chain constants', icon: 'hash',
    body: (
      <>
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
      </>
    ),
  },
  {
    slug: 'custom-chains', group: 'Reference', title: 'Custom chains', icon: 'plus',
    body: (
      <>
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
      </>
    ),
  },
  {
    slug: 'errors', group: 'Reference', title: 'Error handling', icon: 'alert',
    body: (
      <>
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
      </>
    ),
  },
  {
    slug: 'theme', group: 'Reference', title: 'Theme', icon: 'palette',
    body: (
      <>
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
      </>
    ),
  },
  {
    slug: 'typescript', group: 'Reference', title: 'TypeScript', icon: 'code',
    body: (
      <>
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
      </>
    ),
  },
  {
    slug: 'not-included', group: 'Reference', title: 'What is not included', icon: 'minus',
    body: (
      <>
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
      </>
    ),
  },
  {
    slug: 'chain-list', group: 'Reference', title: 'Built-in chains', icon: 'list',
    body: (
      <>
            <p>
              The following chains are available out of the box. Pass <code>supportedChainIds</code> in
              config to restrict to a subset.
            </p>
            <ChainTable />
      </>
    ),
  },
];

// Every id that appears in the content, mapped to the page that holds it, so a
// #hash link written when the docs were one page still lands on the right page.
export const ANCHORS: Record<string, string> = {
  'ios': 'ios',
  'ios-install': 'ios',
  'ios-quick-start': 'ios',
  'ios-scope': 'ios',
  'overview': 'overview',
  'install': 'install',
  'quick-start': 'quick-start',
  'framework-setup': 'framework-setup',
  'networks': 'configuration',
  'supported-chains': 'configuration',
  'configuration': 'configuration',
  'connect-mode': 'social',
  'social-config': 'social',
  'per-signature-assertion': 'social',
  'useSocialAuth': 'social',
  'useSocialWallet': 'social',
  'signing-back-in': 'social',
  'social-wallet-modal': 'social',
  'send-erc20': 'social',
  'send-solana': 'social',
  'social': 'social',
  'custom-auth-register': 'custom-auth',
  'custom-auth-config': 'custom-auth',
  'custom-auth-headless': 'custom-auth',
  'custom-auth-jwks': 'custom-auth',
  'custom-auth-multi': 'custom-auth',
  'custom-auth-testing': 'custom-auth',
  'custom-auth': 'custom-auth',
  'rn-install': 'react-native',
  'rn-config': 'react-native',
  'rn-unlock': 'react-native',
  'rn-auth': 'react-native',
  'rn-api': 'react-native',
  'rn-recovery': 'react-native',
  'rn-attestation': 'react-native',
  'rn-performance': 'react-native',
  'react-native': 'react-native',
  'useDecane': 'hooks',
  'useWalletSelector': 'hooks',
  'useSignMessage': 'hooks',
  'useSendTransaction': 'hooks',
  'useSignTypedData': 'hooks',
  'useChainSwitch': 'hooks',
  'hooks': 'hooks',
  'detection': 'detection',
  'chain-constants': 'chain-constants',
  'custom-chains': 'custom-chains',
  'errors': 'errors',
  'theme': 'theme',
  'typescript': 'typescript',
  'not-included': 'not-included',
  'chain-list': 'chain-list',
};

export const SEARCH: SearchEntry[] = [
  { id: 'ios', title: 'iOS and macOS (Swift)', crumb: 'Native apps', mono: false },
  { id: 'ios-install', title: 'Install DecaneKit', crumb: 'Native apps', mono: false },
  { id: 'overview', title: 'Overview', crumb: 'Getting started', mono: false },
  { id: 'install', title: 'Install', crumb: 'Getting started', mono: false },
  { id: 'quick-start', title: 'Quick start', crumb: 'Getting started', mono: false },
  { id: 'framework-setup', title: 'Framework setup', crumb: 'Framework setup', mono: false },
  { id: 'nextjs', title: 'Next.js (App Router)', crumb: 'Framework setup', mono: true },
  { id: 'vite', title: 'Vite / CRA', crumb: 'Framework setup', mono: false },
  { id: 'configuration', title: 'Configuration', crumb: 'Configuration', mono: false },
  { id: 'networks', title: 'networks', crumb: 'Configuration', mono: false },
  { id: 'supported-chains', title: 'supportedChainIds', crumb: 'Configuration', mono: false },
  { id: 'social', title: 'Social sign-in', crumb: 'Social', mono: false },
  { id: 'connect-mode', title: 'ConnectMode', crumb: 'Social', mono: true },
  { id: 'social-config', title: 'SocialConfig', crumb: 'Social', mono: true },
  { id: 'useSocialAuth', title: 'useSocialAuth()', crumb: 'Social', mono: true },
  { id: 'useSocialWallet', title: 'useSocialWallet()', crumb: 'Social', mono: true },
  { id: 'social-wallet-modal', title: 'SocialWalletModal', crumb: 'Social', mono: true },
  { id: 'hooks', title: 'Hooks', crumb: 'Hooks', mono: false },
  { id: 'useDecane', title: 'useDecane()', crumb: 'Hooks', mono: true },
  { id: 'useWalletSelector', title: 'useWalletSelector()', crumb: 'Hooks', mono: true },
  { id: 'useSignMessage', title: 'useSignMessage()', crumb: 'Hooks', mono: true },
  { id: 'useSendTransaction', title: 'useSendTransaction()', crumb: 'Hooks', mono: true },
  { id: 'useSignTypedData', title: 'useSignTypedData()', crumb: 'Hooks', mono: true },
  { id: 'useChainSwitch', title: 'useChainSwitch()', crumb: 'Hooks', mono: true },
  { id: 'detection', title: 'Wallet detection', crumb: 'Reference', mono: false },
  { id: 'chain-constants', title: 'Chain constants', crumb: 'Reference', mono: false },
  { id: 'custom-chains', title: 'Custom chains', crumb: 'Reference', mono: false },
  { id: 'errors', title: 'Error handling', crumb: 'Reference', mono: false },
  { id: 'theme', title: 'Theme', crumb: 'Reference', mono: false },
  { id: 'typescript', title: 'TypeScript', crumb: 'Reference', mono: false },
  { id: 'not-included', title: 'What is not included', crumb: 'Reference', mono: false },
  { id: 'chain-list', title: 'Built-in chains', crumb: 'Reference', mono: false },
];
