"use client";
import { useState, type ReactNode } from "react";
import { NodeTopbar } from "./components/NodeTopbar";
import { NodeSidebar } from "./components/NodeSidebar";
import { Toc } from "../docs/components/Toc";
import { CodeBlock } from "../docs/components/CodeBlock";
import { useTheme } from "@/lib/theme";

// Lightweight highlighter emitting the same tok-* classes the hand-written
// code blocks use, so string-authored snippets match the rest visually.
const HL_KEYWORDS = new Set([
  "const", "let", "var", "await", "async", "new", "import", "export",
  "from", "return", "function", "interface", "type", "true", "false",
  "null", "undefined", "as", "of", "in", "if", "throw", "class",
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

export default function NodeDocsPage() {
  const [theme, toggleTheme] = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="docs-root" data-theme={theme}>
      <div className="docs-app">
        <NodeTopbar
          theme={theme}
          onThemeToggle={toggleTheme}
          menuOpen={mobileNavOpen}
          onMenuToggle={() => setMobileNavOpen((v) => !v)}
        />
        <NodeSidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <main className="docs-main" id="docs-main">
          {/* ── Overview ── */}
          <section id="overview" className="docs-hero">
            <div className="docs-breadcrumb">
              <span>Docs</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span>Server-side</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span style={{ color: "var(--doc-text)" }}>decane-node</span>
            </div>

            <h1>Verify Decane users on your backend.</h1>
            <p className="docs-lede">
              <strong>decane-node</strong> is the server-side SDK for Decane Connect Kit — the{" "}
              <code>@privy-io/node</code> equivalent. When a signed-in user calls your own backend,
              they send a Decane access token; this package verifies it and resolves their wallet
              addresses, from any Node backend. No app secret required — tokens are ES256-signed,
              so verification needs only a public key: either your project&rsquo;s static
              verification key (offline, no network call) or Decane&rsquo;s published JWKS, which
              the SDK fetches, caches, and auto-rotates.
            </p>

            <div className="docs-hero-meta">
              <span className="docs-badge">
                <span className="dot" />
                Stable · v1.1.1
              </span>
              <span className="docs-badge gold">Node 18+</span>
              <span className="docs-badge">MIT</span>
              <span className="docs-badge">ESM + CJS</span>
              <span className="docs-badge">
                One dependency: <code style={{ background: "none", border: 0, padding: 0, color: "inherit" }}>jose</code>
              </span>
            </div>

            <div
              className="docs-callout"
              data-kind="note"
              style={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div className="ico">✦</div>
                <p>
                  Wiring up an LLM or coding agent? Point it at{" "}
                  <code>https://decane.app/llms-node.txt</code> — a self-contained spec for this
                  package with full code samples and real signatures, readable in place at a stable
                  URL. Freshness is tracked in{" "}
                  <a href="/llms-version.json" target="_blank" rel="noreferrer">
                    <code>llms-version.json</code>
                  </a>{" "}
                  under the <code>node</code> key.
                </p>
              </div>
              <a
                href="/llms-node.txt"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 18px",
                  borderRadius: 8,
                  background: "var(--doc-accent)",
                  color: "var(--doc-accent-contrast, #0d0d0b)",
                  fontWeight: 700,
                  fontSize: 13.5,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Open llms-node.txt
              </a>
            </div>

            <div className="docs-callout" data-kind="info">
              <div className="ico">i</div>
              <p>
                Looking for the client SDKs? The browser SDK (<code>decane-connect-kit</code>) is
                documented at <a href="/docs">/docs</a>, and the React Native / Expo SDK
                (<code>decane-connect-kit-expo</code>) in the React Native section of the same page.
                This page covers only what runs on your server.
              </p>
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
              <span className="tok-s">decane-node</span>
            </CodeBlock>
            <p>
              Requires Node 18 or later for the global <code>fetch</code>. On older Node, pass a{" "}
              <code>fetch</code> implementation in <a href="#config"><code>DecaneClientOptions</code></a>.
              The package ships dual ESM + CJS builds with full TypeScript declarations, and its only
              runtime dependency is <code>jose</code>. Package details are on{" "}
              <a href="https://www.npmjs.com/package/decane-node" target="_blank" rel="noreferrer">
                npmjs.com/package/decane-node
              </a>.
            </p>
          </section>

          {/* ── Quick start ── */}
          <section>
            <h2 id="quick-start">
              Quick start <a className="docs-anchor" href="#quick-start">#</a>
            </h2>
            <p>
              Construct one <code>DecaneClient</code> per project and reuse it. On every
              authenticated route, pull the bearer token from the <code>Authorization</code> header
              and verify it:
            </p>
            <CodeBlock lang="ts" file="auth.ts">
              {hl(`import { DecaneClient } from "decane-node";

// Static key (recommended for backends) — copy the ES256 verification key
// from your Decane dashboard. appId is checked against the token's project_id.
const decane = new DecaneClient({
  appId: process.env.DECANE_APP_ID,
  verificationKey: process.env.DECANE_VERIFICATION_KEY, // ES256 SPKI PEM
});

// In your auth middleware:
const token = req.headers.authorization?.replace("Bearer ", "") ?? "";
const claims = await decane.verifyAccessToken(token); // throws DecaneAuthError if invalid
req.userId = claims.userId; // stable Decane user id — key your records off this`)}
            </CodeBlock>
            <p>
              To verify against Decane&rsquo;s remote JWKS instead, just omit{" "}
              <code>verificationKey</code>:
            </p>
            <CodeBlock lang="ts">
              {hl(`const decane = new DecaneClient({ appId: process.env.DECANE_APP_ID });`)}
            </CodeBlock>
            <p>
              That&rsquo;s the entire setup. The JWKS is fetched lazily on first verification and
              cached across calls; key rotation is handled automatically without a redeploy.
            </p>
          </section>

          {/* ── Verification modes ── */}
          <section>
            <h2 id="verification-modes">
              Verification modes <a className="docs-anchor" href="#verification-modes">#</a>
            </h2>
            <p>
              Exactly one verification strategy is active per client, chosen at construction time.
              Both check the ES256 signature and expiry; when <code>appId</code> is set, both also
              check that the token&rsquo;s <code>project_id</code> matches (the audience-equivalent
              — Decane tokens set no <code>iss</code>/<code>aud</code>).
            </p>

            <h3 id="static-key">Static verification key</h3>
            <p>
              The Privy-style model: verify locally against your project&rsquo;s ES256 public key
              (SPKI PEM), copied once from the Decane dashboard&rsquo;s API Keys page. No network
              call is ever made for verification — it works offline, in air-gapped environments,
              and adds no latency.
            </p>
            <CodeBlock lang="ts">
              {hl(`const decane = new DecaneClient({
  appId: process.env.DECANE_APP_ID,
  verificationKey: process.env.DECANE_VERIFICATION_KEY,
});`)}
            </CodeBlock>
            <p>
              Literal <code>\n</code> escapes in the PEM are normalised automatically, so a
              single-line env value works. If the option is omitted, the SDK falls back to the{" "}
              <code>DECANE_VERIFICATION_KEY</code> env var — a backend can pass only{" "}
              <code>appId</code> in code.
            </p>

            <h3 id="jwks">JWKS (default)</h3>
            <p>
              When no verification key is present, the client verifies against Decane&rsquo;s
              published JWKS at <code>{"{apiBase}"}/.well-known/jwks.json</code>. The key set is
              fetched lazily, cached across calls, and refetched automatically when a token carries
              an unknown key id — so Decane key rotation needs nothing from you.
            </p>
            <CodeBlock lang="ts">
              {hl(`const decane = new DecaneClient({
  appId: process.env.DECANE_APP_ID,
  // jwksUrl: "https://backend.decane.app/.well-known/jwks.json"  (the default)
});`)}
            </CodeBlock>
            <div className="docs-callout" data-kind="note">
              <div className="ico">✦</div>
              <p>
                <strong>Which mode should I use?</strong> Prefer the static key for production
                backends: it removes the network dependency from your hot auth path. JWKS is the
                zero-config option and is what you want if you never touch the dashboard.
              </p>
            </div>

            <h3 id="express">Express middleware</h3>
            <CodeBlock lang="ts" file="middleware/auth.ts">
              {hl(`import { DecaneClient } from "decane-node";
import type { Request, Response, NextFunction } from "express";

const decane = new DecaneClient({ appId: process.env.DECANE_APP_ID });

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "") ?? "";
  const claims = await decane.safeVerifyAccessToken(token); // null instead of throwing
  if (!claims) return res.status(401).json({ error: "unauthorized" });
  (req as any).userId = claims.userId;
  next();
}`)}
            </CodeBlock>
            <p>
              <code>safeVerifyAccessToken</code> is the fail-closed variant: it returns{" "}
              <code>null</code> for any untrusted token instead of throwing, which keeps middleware
              flat. Unexpected non-auth errors still propagate.
            </p>

            <h3 id="nextjs-route">Next.js route handler</h3>
            <CodeBlock lang="ts" file="app/api/me/route.ts">
              {hl(`import { NextResponse } from "next/server";
import { DecaneClient } from "decane-node";

const decane = new DecaneClient({ appId: process.env.DECANE_APP_ID });

export async function GET(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
  const claims = await decane.safeVerifyAccessToken(token);
  if (!claims) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const user = await decane.getUser(token); // id + wallet addresses
  return NextResponse.json(user);
}`)}
            </CodeBlock>
            <p>
              Module scope is fine for the client — route handlers share the instance, and with it
              the cached JWKS, across requests.
            </p>
          </section>

          {/* ── API ── */}
          <section>
            <h2 id="decane-client">
              <code>DecaneClient</code> <a className="docs-anchor" href="#decane-client">#</a>
            </h2>
            <p>
              The main entry point. Construct once per project and reuse — the JWKS cache (or the
              imported static key) lives on the instance. A <code>createDecaneClient(options)</code>{" "}
              factory is also exported and does exactly the same thing.
            </p>
            <CodeBlock lang="ts">
              {hl(`import { DecaneClient, createDecaneClient } from "decane-node";

const decane = new DecaneClient({
  appId: "proj_…",             // optional — enforce project_id
  verificationKey: "-----BEGIN PUBLIC KEY-----…", // optional — offline mode
  apiBase: "https://backend.decane.app",          // optional — the default
  jwksUrl: undefined,           // optional — full JWKS URL override
  fetch: undefined,             // optional — injected fetch (Node < 18, tests)
});`)}
            </CodeBlock>
            <p>
              All options are optional; see <a href="#config">Configuration</a> for the env-var
              fallbacks and defaults of each.
            </p>

            <h3 id="verify-access-token"><code>verifyAccessToken(token)</code></h3>
            <CodeBlock lang="ts">
              {hl(`const claims = await decane.verifyAccessToken(token);
// → DecaneClaims:
claims.userId;    // stable Decane user id (uid) — key your records off this
claims.subject;   // hashed subject (HMAC of the auth-provider identity)
claims.projectId; // project the token was issued for
claims.tokenId;   // unique per issued token (jti)
claims.issuedAt;  // seconds since epoch
claims.expiresAt; // seconds since epoch
claims.raw;       // full verified JWT payload`)}
            </CodeBlock>
            <p>
              Verifies the signature and expiry, checks <code>project_id</code> against{" "}
              <code>appId</code> when configured, and requires a <code>uid</code> claim. Resolves to
              normalised <code>DecaneClaims</code>, or throws{" "}
              <a href="#errors"><code>DecaneAuthError</code></a> if the token cannot be trusted.
            </p>

            <h3 id="safe-verify"><code>safeVerifyAccessToken(token)</code></h3>
            <CodeBlock lang="ts">
              {hl(`const claims = await decane.safeVerifyAccessToken(token); // DecaneClaims | null
if (!claims) return res.status(401).json({ error: "unauthorized" });`)}
            </CodeBlock>
            <p>
              Identical to <code>verifyAccessToken</code> but returns <code>null</code> instead of
              throwing when the token is untrusted. Only <code>DecaneAuthError</code> is swallowed —
              anything else (a network failure fetching the JWKS, say) still throws.
            </p>

            <h3 id="get-addresses"><code>getAddresses(token)</code></h3>
            <CodeBlock lang="ts">
              {hl(`const { evm, solana } = await decane.getAddresses(token);
// evm:    "0x…"  | null
// solana: "BxY…" | null`)}
            </CodeBlock>
            <p>
              Fetches the token owner&rsquo;s public wallet addresses from the Decane backend
              (<code>GET /share/addresses</code> with the token as bearer). Either address may be{" "}
              <code>null</code>. Throws <code>DecaneAuthError</code> if the backend rejects the
              token. The response never contains key material — addresses only.
            </p>

            <h3 id="get-user"><code>getUser(token)</code></h3>
            <CodeBlock lang="ts">
              {hl(`const user = await decane.getUser(token);
user.id;             // uid
user.addresses.evm;  // "0x…" | null
user.addresses.solana;
user.linkedAccounts; // Privy-compatible:
// [{ type: "wallet", chainType: "ethereum", address: "0x…" },
//  { type: "wallet", chainType: "solana",   address: "BxY…" }]`)}
            </CodeBlock>
            <p>
              Verifies the token, then resolves the full user: id plus wallet addresses, also
              exposed as <code>linkedAccounts</code> in a Privy-compatible shape. Addresses are
              best-effort — if the address fetch fails, they come back <code>null</code> rather than
              failing the whole call, since the identity is already verified.
            </p>

            <h3 id="standalone-verify">Standalone <code>verifyAccessToken</code></h3>
            <p>
              A function-form export, the drop-in for <code>@privy-io/node</code>&rsquo;s{" "}
              <code>verifyAccessToken</code>. It caches a client per unique config internally, so it
              is cheap to call per request — the JWKS is not refetched each time.
            </p>
            <CodeBlock lang="ts">
              {hl(`import { verifyAccessToken } from "decane-node";

const claims = await verifyAccessToken({
  token,
  appId: process.env.DECANE_APP_ID,
  verificationKey: process.env.DECANE_VERIFICATION_KEY, // optional
});`)}
            </CodeBlock>
          </section>

          {/* ── Token claims ── */}
          <section>
            <h2 id="claims">
              Token claims <a className="docs-anchor" href="#claims">#</a>
            </h2>
            <p>
              Decane access tokens are ES256-signed JWTs carrying <code>uid</code>,{" "}
              <code>sub</code>, <code>project_id</code>, <code>jti</code>, <code>iat</code>, and{" "}
              <code>exp</code>. They set no <code>iss</code> or <code>aud</code> —{" "}
              <code>project_id</code> is the audience-equivalent, which is why the{" "}
              <code>appId</code> check exists. Verification normalises them into{" "}
              <code>DecaneClaims</code>:
            </p>
            <div className="docs-table-wrap">
              <table>
                <thead>
                  <tr><th>Field</th><th>JWT claim</th><th>Meaning</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>userId</code></td>
                    <td><code>uid</code></td>
                    <td>Stable Decane user id (a UUID). The value to key your own records off. Required — a verified token without it is rejected.</td>
                  </tr>
                  <tr>
                    <td><code>subject</code></td>
                    <td><code>sub</code></td>
                    <td>Hashed subject — an HMAC of the auth-provider identity. Decane stores no raw identity, so this is not reversible to an email.</td>
                  </tr>
                  <tr>
                    <td><code>projectId</code></td>
                    <td><code>project_id</code></td>
                    <td>The project (app) the token was issued for. Checked against <code>appId</code> when configured.</td>
                  </tr>
                  <tr>
                    <td><code>tokenId</code></td>
                    <td><code>jti</code></td>
                    <td>Unique per issued token — useful for your own replay bookkeeping.</td>
                  </tr>
                  <tr>
                    <td><code>issuedAt</code> / <code>expiresAt</code></td>
                    <td><code>iat</code> / <code>exp</code></td>
                    <td>Seconds since epoch. Expiry is enforced during verification.</td>
                  </tr>
                  <tr>
                    <td><code>raw</code></td>
                    <td>—</td>
                    <td>The full verified payload, for any claim not surfaced above.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Errors ── */}
          <section>
            <h2 id="errors">
              Error handling <a className="docs-anchor" href="#errors">#</a>
            </h2>
            <p>
              Every verification failure throws <code>DecaneAuthError</code> — always that type, so
              callers can <code>instanceof</code>-narrow. It carries a machine-readable{" "}
              <code>reason</code> and, when the failure originated in <code>jose</code>, the
              underlying error as <code>cause</code>.
            </p>
            <CodeBlock lang="ts">
              {hl(`import { DecaneAuthError } from "decane-node";

try {
  const claims = await decane.verifyAccessToken(token);
} catch (err) {
  if (err instanceof DecaneAuthError) {
    err.reason; // "invalid_token" | "missing_uid" | "project_mismatch"
    err.cause;  // underlying jose error, when present
  }
}`)}
            </CodeBlock>
            <div className="docs-table-wrap">
              <table>
                <thead>
                  <tr><th>Reason</th><th>When</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>invalid_token</code></td>
                    <td>Signature, format, or expiry rejected — including expired tokens.</td>
                  </tr>
                  <tr>
                    <td><code>missing_uid</code></td>
                    <td>The signature verified but the token has no <code>uid</code> claim.</td>
                  </tr>
                  <tr>
                    <td><code>project_mismatch</code></td>
                    <td>The token&rsquo;s <code>project_id</code> differs from the configured <code>appId</code>.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              If you never want to catch, use{" "}
              <a href="#safe-verify"><code>safeVerifyAccessToken</code></a> and branch on{" "}
              <code>null</code>.
            </p>
          </section>

          {/* ── Configuration ── */}
          <section>
            <h2 id="config">
              Configuration <a className="docs-anchor" href="#config">#</a>
            </h2>
            <p>
              All of <code>DecaneClientOptions</code>. Every option is optional; env-var fallbacks
              mean a typical backend passes nothing but <code>appId</code> in code.
            </p>
            <div className="docs-table-wrap">
              <table>
                <thead>
                  <tr><th>Option</th><th>Env fallback</th><th>Default</th><th>Purpose</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>appId</code></td>
                    <td>—</td>
                    <td>—</td>
                    <td>Reject tokens whose <code>project_id</code> differs. Omit to accept any project (single-tenant backends).</td>
                  </tr>
                  <tr>
                    <td><code>verificationKey</code></td>
                    <td><code>DECANE_VERIFICATION_KEY</code></td>
                    <td>— (falls back to JWKS)</td>
                    <td>ES256 SPKI PEM public key; verify offline with no JWKS fetch. <code>\n</code> escapes normalised.</td>
                  </tr>
                  <tr>
                    <td><code>apiBase</code></td>
                    <td><code>DECANE_API_BASE</code></td>
                    <td><code>https://backend.decane.app</code></td>
                    <td>Decane backend base URL, used for the JWKS default and <code>/share/addresses</code>.</td>
                  </tr>
                  <tr>
                    <td><code>jwksUrl</code></td>
                    <td>—</td>
                    <td><code>{"{apiBase}"}/.well-known/jwks.json</code></td>
                    <td>Full JWKS URL override. Ignored when a verification key is set.</td>
                  </tr>
                  <tr>
                    <td><code>fetch</code></td>
                    <td>—</td>
                    <td>global <code>fetch</code></td>
                    <td>Injected fetch for the address call (tests, Node &lt; 18). JWKS retrieval always uses the runtime&rsquo;s global fetch, called inside <code>jose</code>.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Client-side token ── */}
          <section>
            <h2 id="client-token">
              Getting the token client-side <a className="docs-anchor" href="#client-token">#</a>
            </h2>
            <p>
              The token this package verifies is minted when a user signs in with the client SDKs.
              Send it to your backend as <code>Authorization: Bearer &lt;token&gt;</code>.
            </p>
            <CodeBlock lang="tsx" file="web — decane-connect-kit">
              {hl(`import { useSocialAuth } from "decane-connect-kit";

const { getAccessToken } = useSocialAuth();
const token = await getAccessToken();

await fetch("/api/me", { headers: { Authorization: "Bearer " + token } });`)}
            </CodeBlock>
            <CodeBlock lang="ts" file="React Native — decane-connect-kit-expo">
              {hl(`const token = decane.getAccessToken(); // Decane JWT | null

await fetch("https://api.example.com/me", {
  headers: { Authorization: "Bearer " + token },
});`)}
            </CodeBlock>
            <p>
              Both SDKs mint tokens from the same backend, so one <code>DecaneClient</code> verifies
              users from web and mobile alike.
            </p>
          </section>

          {/* ── Revocation ── */}
          <section>
            <h2 id="revocation">
              Statelessness &amp; revocation <a className="docs-anchor" href="#revocation">#</a>
            </h2>
            <div className="docs-callout" data-kind="warn">
              <div className="ico">!</div>
              <p>
                <strong>Verification is stateless.</strong> It checks signature, expiry, and{" "}
                <code>project_id</code> — it does not consult Decane&rsquo;s server-side revocation
                list. A token stays verifiable until it expires, even if the user signed out. If a
                route needs immediate sign-out enforcement, additionally gate it on a fresh backend
                call — <a href="#get-addresses"><code>getAddresses(token)</code></a> works, since
                the Decane backend rejects revoked tokens.
              </p>
            </div>
          </section>

          {/* ── Privy migration ── */}
          <section>
            <h2 id="privy-migration">
              Migrating from Privy <a className="docs-anchor" href="#privy-migration">#</a>
            </h2>
            <p>
              The API is intentionally shaped like <code>@privy-io/node</code>: a client class with{" "}
              <code>verifyAccessToken</code>, a standalone{" "}
              <code>verifyAccessToken({"{ token, appId, verificationKey }"})</code> function, and{" "}
              <code>linkedAccounts</code> on the resolved user in Privy&rsquo;s shape. Two things do
              differ:
            </p>
            <ul>
              <li>
                <strong>User ids.</strong> Decane&rsquo;s <code>uid</code> is a plain UUID, not a{" "}
                <code>did:privy:…</code>. Rows keyed by a Privy id will not match a Decane{" "}
                <code>uid</code> — map legacy ids during a re-auth window before cutting production
                over.
              </li>
              <li>
                <strong>No app secret.</strong> Privy&rsquo;s client wants an app secret for some
                calls; Decane verification is public-key only. The dashboard&rsquo;s verification
                key is a <em>public</em> key — it is not sensitive, though keeping it in env config
                is still tidy.
              </li>
            </ul>
            <CodeBlock lang="ts">
              {hl(`// Before — @privy-io/node
import { PrivyClient } from "@privy-io/node";
const privy = new PrivyClient({ appId, appSecret });
const claims = await privy.utils().auth().verifyAccessToken({ access_token, verification_key });

// After — decane-node
import { verifyAccessToken } from "decane-node";
const claims = await verifyAccessToken({ token, appId, verificationKey });`)}
            </CodeBlock>
          </section>

          {/* ── TypeScript ── */}
          <section>
            <h2 id="typescript">
              TypeScript <a className="docs-anchor" href="#typescript">#</a>
            </h2>
            <p>
              Declarations ship with the package — no <code>@types</code> install. The full exported
              surface:
            </p>
            <CodeBlock lang="ts">
              {hl(`import {
  DecaneClient,           // class — the main entry point
  createDecaneClient,     // factory mirroring the constructor
  verifyAccessToken,      // standalone verify (per-config client cache)
  DecaneAuthError,        // every verification failure is this type
  DEFAULT_DECANE_API_BASE,
  type DecaneClientOptions,
  type DecaneClaims,
  type DecaneUser,
  type DecaneAddresses,
  type DecaneLinkedAccount,
  type DecaneAuthErrorReason,
} from "decane-node";`)}
            </CodeBlock>
          </section>

          {/* Pager */}
          <div className="docs-pager">
            <a href="#overview" className="prev">
              <div className="dir">← Top</div>
              <div className="lbl">Back to overview</div>
            </a>
            <a href="/docs" className="next">
              <div className="dir">Web SDK →</div>
              <div className="lbl">decane-connect-kit docs</div>
            </a>
          </div>
        </main>

        <Toc />
      </div>
    </div>
  );
}
