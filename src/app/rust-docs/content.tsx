import { CodeBlock } from "@/app/docs/components/CodeBlock";
import { DocsCards } from "@/app/docs/components/DocsCards";
import { hl, type Lang } from "@/app/docs/components/highlight";
import { VERSIONS, REGISTRY } from "@/lib/versions";
import type { DocPage, SearchEntry } from "@/app/docs/components/types";

// The Rust SDK (`decane` on crates.io), written from sdk-rust/ in the monorepo:
// src/client.rs, types.rs and error.rs, and the crate README.

function Code({ code, lang = "rust", file }: { code: string; lang?: Lang; file?: string }) {
  return <CodeBlock lang={lang} file={file}>{hl(code.trim(), lang)}</CodeBlock>;
}

export const PAGES: DocPage[] = [
  {
    slug: "overview", navLabel: "Introduction", group: "Get started", icon: "home",
    title: "Verify and sign in Decane users from Rust.",
    body: (
      <>
        <p className="docs-lede">
          <strong>decane</strong> is the server-side SDK for Decane Connect Kit, for Rust
          backends. It verifies Decane access tokens, resolves wallet addresses, signs users in
          from the server, reads and writes per-user records, and creates users and their wallets
          before they ever sign in. It is the Rust port of <code>decane-node</code>: the same
          endpoints, the same error codes, the same checks.
        </p>
        <dl className="docs-facts">
          <div><dt>Requires</dt><dd>Rust 1.85+, edition 2024</dd></div>
          <div><dt>Crate</dt><dd><code>decane</code> {VERSIONS.rust}, MIT</dd></div>
          <div><dt>Runtime</dt><dd>Async, on tokio</dd></div>
          <div><dt>TLS</dt><dd><code>reqwest</code> with rustls; no OpenSSL</dd></div>
        </dl>
        <div className="docs-agent">
          <p>
            Wiring up a coding agent? <code>kit.decane.app/llms-rust.txt</code> is a
            self-contained spec for this crate with real signatures, and{" "}
            <a href="/llms-version.json" target="_blank" rel="noreferrer"><code>llms-version.json</code></a>{" "}
            tracks its freshness under the <code>rust</code> key. API docs are on{" "}
            <a href="https://docs.rs/decane" target="_blank" rel="noreferrer">docs.rs/decane</a>.
          </p>
          <div className="docs-agent-actions">
            <a href="/llms-rust.txt" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">llms-rust.txt</a>
          </div>
        </div>
        <DocsCards
          items={[
            { href: "/rust-docs/quick-start", title: "Quick start", desc: "Verify a Decane access token in a few lines." },
            { href: "/rust-docs/axum", title: "axum middleware", desc: "A drop-in extractor that turns a bad token into a 401." },
            { href: "/rust-docs/auth", title: "Server-side sign-in", desc: "Email and phone codes, Google, KingsChat and custom tokens." },
            { href: "/rust-docs/records", title: "Per-user records", desc: "Preferences the user owns and metadata only you can write." },
            { href: "/rust-docs/server-wallets", title: "Server-side wallets", desc: "Create a user and their wallet before they sign in." },
            { href: "/rust-docs/client", title: "API reference", desc: "Every method on DecaneClient." },
          ]}
        />
      </>
    ),
  },
  {
    slug: "install", group: "Get started", title: "Install", icon: "package",
    body: (
      <>
        <Code lang="bash" code={`cargo add decane\ncargo add tokio --features rt-multi-thread,macros`} />
        <p>Or in <code>Cargo.toml</code>:</p>
        <Code lang="toml" file="Cargo.toml" code={`
[dependencies]
decane = "1"
tokio = { version = "1", features = ["rt-multi-thread", "macros"] }`} />
        <p>
          Rust 1.85 or later, edition 2024. HTTP is <code>reqwest</code> with rustls, so there is
          no OpenSSL to install. The crate forbids <code>unsafe</code>. It is on{" "}
          <a href={REGISTRY.rust} target="_blank" rel="noreferrer">crates.io/crates/decane</a>.
        </p>
        <h2 id="credentials">Credentials</h2>
        <p>
          Verification needs no secret. The other features each need one credential from the
          Decane dashboard, read from the environment in <code>build()</code> when you do not set
          it:
        </p>
        <div className="docs-table-wrap">
          <table>
            <thead><tr><th>Credential</th><th>Env var</th><th>Needed for</th></tr></thead>
            <tbody>
              <tr><td>Project id</td><td><code>DECANE_APP_ID</code> (set it yourself)</td><td>Checking a token belongs to your project</td></tr>
              <tr><td>Verification key</td><td><code>DECANE_VERIFICATION_KEY</code></td><td>Offline verification (optional)</td></tr>
              <tr><td>API key <code>dck_live_…</code></td><td><code>DECANE_API_KEY</code></td><td>Server-side sign-in</td></tr>
              <tr><td>Project secret <code>dck_sk_…</code></td><td><code>DECANE_PROJECT_SECRET</code></td><td>Records by user id, wallet creation</td></tr>
            </tbody>
          </table>
        </div>
        <div className="docs-callout" data-kind="warn">
          <div className="ico">!</div>
          <p><strong>The API key and project secret are secrets.</strong> Keep them in server environment variables; never ship them to a browser or a mobile app.</p>
        </div>
      </>
    ),
  },
  {
    slug: "quick-start", group: "Get started", title: "Quick start", icon: "rocket",
    body: (
      <>
        <p>
          Build one client per project and reuse it. It is cheap to clone, and clones share the
          JWKS cache, so put it in your app state.
        </p>
        <h2 id="create-client">1. Build the client</h2>
        <Code file="main.rs" code={`
use decane::DecaneClient;

// Copy the ES256 verification key from your Decane dashboard.
// app_id is checked against the token's project_id.
let decane = DecaneClient::builder()
    .app_id(std::env::var("DECANE_APP_ID")?)
    .verification_key(std::env::var("DECANE_VERIFICATION_KEY")?) // ES256 SPKI PEM
    .build()?;`} />
        <p>With a static key, verification is offline: no network call on the hot path.</p>
        <h2 id="verify">2. Verify the token</h2>
        <Code code={`
let token = authorization.strip_prefix("Bearer ").unwrap_or("");
let claims = decane.verify_access_token(token).await?; // Err(DecaneError::Auth { .. }) if invalid
claims.user_id; // stable Decane user id: key your records off this`} />
        <h2 id="addresses">3. Get the wallet addresses</h2>
        <Code code={`
let user = decane.get_user(token).await?;
user.addresses.evm;    // Option<String>, "0x…"
user.addresses.solana;
user.addresses.tron;`} />
        <p>
          That is the whole integration for a backend that only needs to know who is calling. Read
          on for <a href="/rust-docs/auth">sign-in</a>, <a href="/rust-docs/records">records</a>{" "}
          and <a href="/rust-docs/server-wallets">server-side wallets</a>.
        </p>
      </>
    ),
  },
  {
    slug: "verification", group: "Verification", title: "Verifying tokens", icon: "shield",
    body: (
      <>
        <p>
          Decane access tokens are ES256 JWTs. Verification checks the signature and expiry with
          zero clock tolerance and, when <code>app_id</code> is set, that the token&rsquo;s{" "}
          <code>project_id</code> matches. It needs only a public key, which the client gets one of
          two ways.
        </p>
        <h2 id="static-key">Static verification key</h2>
        <p>
          Recommended for backends. Set your project&rsquo;s ES256 public key (SPKI PEM, from the
          dashboard) and every check runs locally. A literal <code>\n</code> in the PEM is
          accepted, which helps with single-line env vars. A malformed key fails at{" "}
          <code>build()</code>, not on the first request.
        </p>
        <Code code={`
let decane = DecaneClient::builder()
    .app_id(app_id)
    .verification_key(std::env::var("DECANE_VERIFICATION_KEY")?)
    .build()?;`} />
        <h2 id="jwks">JWKS</h2>
        <p>
          Leave the key out and the client verifies against the key set Decane publishes at{" "}
          <code>/.well-known/jwks.json</code>. It is fetched on first use, cached for ten minutes,
          and refetched once when a signature fails, so a key rotation needs no redeploy.
        </p>
        <Code code={`let decane = DecaneClient::builder().app_id(app_id).build()?;`} />
        <h2 id="fail-closed">Fail-closed checks</h2>
        <p>
          <code>safe_verify_access_token</code> returns <code>Ok(None)</code> for a token that
          cannot be trusted:
        </p>
        <Code code={`
let claims = match decane.safe_verify_access_token(token).await? {
    Some(claims) => claims,
    None => return Err(StatusCode::UNAUTHORIZED),
};`} />
        <div className="docs-callout" data-kind="info">
          <div className="ico">i</div>
          <p>The <code>?</code> still propagates a JWKS fetch failure as <code>DecaneError::Api</code> with <code>ApiErrorCode::NetworkError</code>, so an outage answers 500, not 401.</p>
        </div>
        <h2 id="stateless">Verification is stateless</h2>
        <p>
          It checks signature, expiry and project, not Decane&rsquo;s revocation list. A token
          revoked with <code>revoke_access_token</code> still verifies until it expires; backend
          calls such as <code>get_addresses</code> do honour revocation at once. For immediate
          sign-out on a sensitive route, make one of those calls as well.
        </p>
      </>
    ),
  },
  {
    slug: "axum", group: "Verification", title: "axum middleware", navLabel: "axum", icon: "layers",
    body: (
      <>
        <p>
          An extractor that verifies the bearer token and hands handlers the <code>Claims</code>.
          The client lives in app state; clones share its JWKS cache.
        </p>
        <Code file="auth.rs" code={`
use axum::{
    extract::{FromRef, FromRequestParts},
    http::{header::AUTHORIZATION, request::Parts, StatusCode},
};
use decane::{Claims, DecaneClient};

#[derive(Clone)]
pub struct AppState {
    pub decane: DecaneClient,
}

impl FromRef<AppState> for DecaneClient {
    fn from_ref(state: &AppState) -> Self {
        state.decane.clone()
    }
}

pub struct CurrentUser(pub Claims);

impl<S> FromRequestParts<S> for CurrentUser
where
    DecaneClient: FromRef<S>,
    S: Send + Sync,
{
    type Rejection = StatusCode;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let token = parts
            .headers
            .get(AUTHORIZATION)
            .and_then(|v| v.to_str().ok())
            .and_then(|v| v.strip_prefix("Bearer "))
            .ok_or(StatusCode::UNAUTHORIZED)?;
        let decane = DecaneClient::from_ref(state);
        match decane.safe_verify_access_token(token).await {
            Ok(Some(claims)) => Ok(CurrentUser(claims)),
            Ok(None) => Err(StatusCode::UNAUTHORIZED),
            Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR), // JWKS unreachable
        }
    }
}`} />
        <Code file="main.rs" code={`
use axum::{routing::get, Json, Router};

async fn me(CurrentUser(claims): CurrentUser) -> Json<serde_json::Value> {
    Json(serde_json::json!({ "user_id": claims.user_id }))
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let decane = DecaneClient::builder().app_id(std::env::var("DECANE_APP_ID")?).build()?;
    let app = Router::new().route("/me", get(me)).with_state(AppState { decane });
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
    axum::serve(listener, app).await?;
    Ok(())
}`} />
        <p>
          The same shape works in actix-web or any other framework: build the client once, share
          it, and map <code>Ok(None)</code> to 401 and <code>Err</code> to 500.
        </p>
      </>
    ),
  },
  {
    slug: "users", group: "Users", title: "Users and addresses", icon: "user",
    body: (
      <>
        <p>
          Two calls turn a verified token into wallet addresses. Both hit the backend, so both
          honour revocation at once.
        </p>
        <h2 id="get-user">get_user</h2>
        <Code code={`
let user = decane.get_user(token).await?;
user.id;               // the Decane user id (uid)
user.addresses.evm;    // Option<String>
user.addresses.solana;
user.addresses.tron;
user.linked_accounts;  // Vec<LinkedAccount>: { type: Wallet, chain_type: Ethereum, address }`} />
        <p>
          <code>linked_accounts</code> is Privy-compatible. <code>ChainType</code> is{" "}
          <code>Ethereum</code>, <code>Solana</code> or <code>Tron</code>.
        </p>
        <h2 id="get-addresses">get_addresses</h2>
        <Code code={`let addresses = decane.get_addresses(token).await?; // Addresses { evm, solana, tron }`} />
        <p>
          A user who has signed in but has no wallet yet has every address as <code>None</code>
          until a client creates the wallet, or your server does with{" "}
          <a href="/rust-docs/server-wallets">create_user_wallet</a>.
        </p>
      </>
    ),
  },
  {
    slug: "auth", group: "Users", title: "Server-side sign-in", navLabel: "Sign-in", icon: "key",
    body: (
      <>
        <p>
          The same sign-in flows the frontend SDKs offer, minus anything that needs a browser or a
          device authenticator. Every call needs your developer API key.
        </p>
        <Code code={`
let decane = DecaneClient::builder()
    .app_id(app_id)
    .api_key(std::env::var("DECANE_API_KEY")?)
    .build()?;`} />
        <h2 id="email">Email code</h2>
        <Code code={`
decane.connect_with_email("user@example.com").await?;                // emails a 6-digit code
let session = decane.verify_email_code("user@example.com", "123456").await?;`} />
        <h2 id="phone">Phone code</h2>
        <Code code={`
decane.connect_with_phone("+2348012345678").await?;                  // E.164 only
let session = decane.verify_phone_code("+2348012345678", "123456").await?;`} />
        <h2 id="token-exchange">Token exchange</h2>
        <p>One step each, for a token the user already holds:</p>
        <Code code={`
decane.connect_with_google_token(google_id_token).await?;            // a Google ID token
decane.connect_with_kingschat_token(kc_access_token).await?;         // a KingsChat access token
decane.connect_with_token(jwt_from_your_issuer, Some("prov-1")).await?; // custom auth`} />
        <h2 id="result">The result</h2>
        <Code code={`
session.access_token; // a Decane JWT (8 h): verify it, or hand it to the client
session.user_id;      // stable Decane user id
session.is_new_user;  // true on the user's first sign-in
session.has_share;    // false = no wallet yet
session.profile;      // Option<AuthProfile { name, email, picture }> for Google and KingsChat`} />
        <p>The profile is passed through from the provider and never stored by Decane.</p>
        <h2 id="sign-out">Sign-out</h2>
        <Code code={`decane.revoke_access_token(&session.access_token).await?;`} />
        <h2 id="auth-caveats">Caveats</h2>
        <ul>
          <li><strong>Rate limits.</strong> There is no per-IP limit on sign-in, so one server egress IP is fine. OTP attempts are limited to 10 per 15 minutes per email or phone, and code sends to 3 per hour per address.</li>
          <li><strong>Anti-enumeration.</strong> <code>connect_with_email</code> and <code>connect_with_phone</code> succeed whether or not the address is known. Never tell a user an email was not found.</li>
          <li><strong>Token renewal.</strong> Tokens last 8 hours. <code>POST /auth/refresh</code> with a still-valid token returns a fresh one, up to 7 days after sign-in; this crate does not wrap it yet.</li>
          <li><strong>Not available server-side:</strong> the Google redirect flow, the KingsChat popup and passkey sign-in. Signing transactions stays in the client SDKs.</li>
        </ul>
      </>
    ),
  },
  {
    slug: "records", group: "Data", title: "Per-user records", icon: "tag",
    body: (
      <>
        <p>
          Two small, flat JSON records live on every Decane user, split by who may write them.
          They replace Privy&rsquo;s custom metadata.
        </p>
        <div className="docs-table-wrap">
          <table>
            <thead><tr><th>Record</th><th>Written with</th><th>For</th></tr></thead>
            <tbody>
              <tr><td><code>preferences</code></td><td>the user&rsquo;s token, or the project secret</td><td>the user&rsquo;s own choices</td></tr>
              <tr><td><code>metadata</code></td><td>the project secret only</td><td>your facts about the user: plan, flags, your own ids</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          <code>Record</code> is a <code>BTreeMap&lt;String, RecordValue&gt;</code>;{" "}
          <code>RecordValue</code> is <code>Bool</code>, <code>Int</code>, <code>Float</code> or{" "}
          <code>String</code>, with <code>From</code> impls for the matching Rust types.{" "}
          <code>RecordPatch</code> is the same map with <code>Option</code> values, where{" "}
          <code>None</code> removes the key. At most 100 keys and 32 KB.
        </p>
        <h2 id="with-token">With the user&rsquo;s token</h2>
        <Code code={`
use decane::{Record, RecordPatch};

let prefs: Record = decane.get_preferences(token).await?;

let mut patch = RecordPatch::new();
patch.insert("theme".into(), Some("light".into()));
patch.insert("old".into(), None);                         // None removes the key
decane.update_preferences(token, &patch).await?;          // merge
decane.set_preferences(token, &Record::new()).await?;     // replace
decane.get_metadata(token).await?;                        // read-only on this side`} />
        <h2 id="by-user-id">By user id, with the project secret</h2>
        <Code code={`
let decane = DecaneClient::builder()
    .app_id(app_id)
    .project_secret(std::env::var("DECANE_PROJECT_SECRET")?)
    .build()?;

let mut patch = RecordPatch::new();
patch.insert("plan".into(), Some("pro".into()));
decane.update_user_metadata(&claims.user_id, &patch).await?;
decane.get_user_metadata(&claims.user_id).await?;
decane.get_user_preferences(&claims.user_id).await?;      // update / set variants too`} />
        <p>
          A write that breaks the rules fails with <code>ApiErrorCode::InvalidRecord</code>, and
          the message names the key. A user of another project is <code>NotFound</code>.
        </p>
      </>
    ),
  },
  {
    slug: "server-wallets", group: "Data", title: "Server-side wallet creation", navLabel: "Server-side wallets", icon: "server",
    body: (
      <>
        <p>
          Create a user, and their wallet, before they have signed in. Decane keys the user
          exactly as the matching sign-in will, so their first sign-in opens the wallet made here.
          The key is generated inside the enclave; your server sees only the addresses.
        </p>
        <Code code={`
use decane::{CreateUserOptions, UserIdentifier, WalletOutcome};

let made = decane
    .create_user(UserIdentifier::email("ada@example.com"), CreateUserOptions::default())
    .await?;
made.user.addresses.evm; // fund it now; Ada finds it when she signs in
made.created;            // true when this call made the user
made.wallet;             // WalletOutcome::Created | Exists | None`} />
        <h2 id="identifiers">Identifiers</h2>
        <div className="docs-table-wrap">
          <table>
            <thead><tr><th>Constructor</th><th>Value</th></tr></thead>
            <tbody>
              <tr><td><code>UserIdentifier::email(..)</code></td><td>Any case. A later email-code or Google sign-in with this verified address opens the same wallet.</td></tr>
              <tr><td><code>UserIdentifier::phone(..)</code></td><td>E.164, <code>+&lt;country&gt;&lt;number&gt;</code>.</td></tr>
              <tr><td><code>UserIdentifier::custom(subject, provider_id)</code></td><td>The subject your own JWTs assert, with the provider id from the dashboard.</td></tr>
              <tr><td><code>UserIdentifier::kingschat(..)</code>, <code>::x(..)</code></td><td>The provider&rsquo;s stable user id, never an @handle.</td></tr>
            </tbody>
          </table>
        </div>
        <Code code={`
decane.create_user(
    UserIdentifier::phone("+2348012345678"),
    CreateUserOptions { metadata: Some(patch), ..Default::default() },
).await?;

decane.create_user(
    UserIdentifier::custom("auth0|123", provider_id),
    CreateUserOptions { create_wallet: Some(false), ..Default::default() },
).await?;

decane.create_user_wallet(&made.user.id).await?; // for an existing user with no wallet`} />
        <h2 id="wallet-rules">Rules</h2>
        <ul>
          <li>Idempotent on the identifier: calling twice returns the same user.</li>
          <li>Off until the Decane team switches it on for your project; until then calls fail with <code>ServerWalletsDisabled</code>.</li>
          <li>Sixty calls a minute per project.</li>
          <li>Other failures: <code>InvalidIdentifier</code>, <code>WalletExists</code> (from <code>create_user_wallet</code>), <code>WalletFrozen</code>, <code>RetryLater</code>, <code>EnclaveUnavailable</code>.</li>
        </ul>
      </>
    ),
  },
  {
    slug: "client", group: "Reference", title: "API reference", icon: "code",
    body: (
      <>
        <p>
          Every method on <code>DecaneClient</code> is <code>async</code> and returns{" "}
          <code>decane::Result&lt;T&gt;</code>. Full rustdoc is on{" "}
          <a href="https://docs.rs/decane" target="_blank" rel="noreferrer">docs.rs/decane</a>.
        </p>
        <h2 id="methods-verify">Verification</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Method</th><th>Returns</th><th>Needs</th></tr></thead>
          <tbody>
            <tr><td><code>verify_access_token(&amp;str)</code></td><td><code>Claims</code></td><td>nothing</td></tr>
            <tr><td><code>safe_verify_access_token(&amp;str)</code></td><td><code>Option&lt;Claims&gt;</code></td><td>nothing</td></tr>
            <tr><td><code>get_addresses(&amp;str)</code></td><td><code>Addresses</code></td><td>nothing</td></tr>
            <tr><td><code>get_user(&amp;str)</code></td><td><code>User</code></td><td>nothing</td></tr>
          </tbody>
        </table></div>
        <h2 id="methods-auth">Sign-in</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Method</th><th>Returns</th><th>Needs</th></tr></thead>
          <tbody>
            <tr><td><code>connect_with_email(email)</code></td><td><code>()</code></td><td>API key</td></tr>
            <tr><td><code>verify_email_code(email, code)</code></td><td><code>AuthResult</code></td><td>API key</td></tr>
            <tr><td><code>connect_with_phone(phone)</code></td><td><code>()</code></td><td>API key</td></tr>
            <tr><td><code>verify_phone_code(phone, code)</code></td><td><code>AuthResult</code></td><td>API key</td></tr>
            <tr><td><code>connect_with_google_token(id_token)</code></td><td><code>AuthResult</code></td><td>API key</td></tr>
            <tr><td><code>connect_with_kingschat_token(access_token)</code></td><td><code>AuthResult</code></td><td>API key</td></tr>
            <tr><td><code>connect_with_token(token, Option&lt;&amp;str&gt;)</code></td><td><code>AuthResult</code></td><td>API key</td></tr>
            <tr><td><code>get_kingschat_config()</code></td><td><code>KingsChatConfig</code></td><td>API key</td></tr>
            <tr><td><code>revoke_access_token(token)</code></td><td><code>()</code></td><td>nothing</td></tr>
          </tbody>
        </table></div>
        <h2 id="methods-records">Records</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Method</th><th>Returns</th><th>Needs</th></tr></thead>
          <tbody>
            <tr><td><code>get_preferences(token)</code></td><td><code>Record</code></td><td>user token</td></tr>
            <tr><td><code>update_preferences(token, &amp;RecordPatch)</code></td><td><code>Record</code></td><td>user token</td></tr>
            <tr><td><code>set_preferences(token, &amp;Record)</code></td><td><code>Record</code></td><td>user token</td></tr>
            <tr><td><code>get_metadata(token)</code></td><td><code>Record</code></td><td>user token</td></tr>
            <tr><td><code>get_user_metadata(user_id)</code></td><td><code>Record</code></td><td>project secret</td></tr>
            <tr><td><code>update_user_metadata(user_id, &amp;RecordPatch)</code></td><td><code>Record</code></td><td>project secret</td></tr>
            <tr><td><code>set_user_metadata(user_id, &amp;Record)</code></td><td><code>Record</code></td><td>project secret</td></tr>
            <tr><td><code>get_user_preferences(user_id)</code></td><td><code>Record</code></td><td>project secret</td></tr>
            <tr><td><code>update_user_preferences(user_id, &amp;RecordPatch)</code></td><td><code>Record</code></td><td>project secret</td></tr>
            <tr><td><code>set_user_preferences(user_id, &amp;Record)</code></td><td><code>Record</code></td><td>project secret</td></tr>
          </tbody>
        </table></div>
        <h2 id="methods-create">Creation</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Method</th><th>Returns</th><th>Needs</th></tr></thead>
          <tbody>
            <tr><td><code>create_user(UserIdentifier, CreateUserOptions)</code></td><td><code>CreatedUser</code></td><td>project secret</td></tr>
            <tr><td><code>create_user_wallet(user_id)</code></td><td><code>CreatedUser</code></td><td>project secret</td></tr>
          </tbody>
        </table></div>
        <h2 id="types">Types</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Type</th><th>Fields</th></tr></thead>
          <tbody>
            <tr><td><code>Claims</code></td><td><code>user_id</code>, <code>subject</code>, <code>project_id</code>, <code>token_id</code>, <code>issued_at</code>, <code>expires_at</code>, <code>raw</code></td></tr>
            <tr><td><code>Addresses</code></td><td><code>evm</code>, <code>solana</code>, <code>tron</code> (each <code>Option&lt;String&gt;</code>)</td></tr>
            <tr><td><code>User</code></td><td><code>id</code>, <code>addresses</code>, <code>linked_accounts</code></td></tr>
            <tr><td><code>AuthResult</code></td><td><code>access_token</code>, <code>user_id</code>, <code>is_new_user</code>, <code>has_share</code>, <code>profile</code></td></tr>
            <tr><td><code>AuthProfile</code></td><td><code>name</code>, <code>email</code>, <code>picture</code></td></tr>
            <tr><td><code>KingsChatConfig</code></td><td><code>client_id</code>, <code>authorization_url</code></td></tr>
            <tr><td><code>CreateUserOptions</code></td><td><code>create_wallet: Option&lt;bool&gt;</code>, <code>metadata: Option&lt;RecordPatch&gt;</code></td></tr>
            <tr><td><code>CreatedUser</code></td><td><code>user</code> (<code>id</code>, <code>auth_method</code>, <code>identifier</code>, <code>addresses</code>), <code>created</code>, <code>wallet</code></td></tr>
            <tr><td><code>Record</code> / <code>RecordPatch</code></td><td><code>BTreeMap&lt;String, RecordValue&gt;</code> / <code>BTreeMap&lt;String, Option&lt;RecordValue&gt;&gt;</code></td></tr>
          </tbody>
        </table></div>
      </>
    ),
  },
  {
    slug: "errors", group: "Reference", title: "Error handling", icon: "alert",
    body: (
      <>
        <p>
          One enum, <code>DecaneError</code>, with three variants. It is{" "}
          <code>#[non_exhaustive]</code>, so keep a wildcard arm.
        </p>
        <Code code={`
use decane::{ApiErrorCode, DecaneError};

match decane.verify_email_code(email, code).await {
    Ok(session) => { /* signed in */ }
    Err(DecaneError::Api { code: ApiErrorCode::InvalidCode, .. }) => { /* ask again */ }
    Err(DecaneError::Api { code, status, .. }) => { /* status 0: never reached Decane */ }
    Err(err) => return Err(err.into()),
}`} />
        <h2 id="variants">Variants</h2>
        <ul>
          <li><code>Auth {"{ reason, message, source }"}</code>: the token cannot be trusted. <code>reason</code> is <code>AuthErrorReason::InvalidToken</code>, <code>MissingUid</code> or <code>ProjectMismatch</code>.</li>
          <li><code>Api {"{ code, status, message, source }"}</code>: a backend call failed. <code>status</code> is the HTTP status, 0 when the request never got a response.</li>
          <li><code>Config(String)</code>: a missing key or secret, an empty argument, a malformed verification key. Raised before any network call.</li>
        </ul>
        <p>
          Helpers: <code>is_auth()</code>, <code>auth_reason()</code>, <code>api_code()</code>,{" "}
          <code>status()</code>.
        </p>
        <h2 id="api-codes">ApiErrorCode</h2>
        <p>
          <code>ApiErrorCode</code> implements <code>Display</code> and <code>FromStr</code> with
          the wire strings (<code>INVALID_CODE</code>, …), so logs read the same as the Node SDK&rsquo;s.
        </p>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Code</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><code>InvalidCode</code></td><td>Email or SMS code wrong or expired</td></tr>
            <tr><td><code>AuthFailed</code></td><td>Provider token rejected</td></tr>
            <tr><td><code>InvalidToken</code></td><td>Custom-auth JWT rejected</td></tr>
            <tr><td><code>NoProvider</code>, <code>AmbiguousProvider</code>, <code>MissingClaim</code></td><td>Custom-auth provider configuration</td></tr>
            <tr><td><code>InvalidApiKey</code>, <code>AppIdMismatch</code></td><td>Credential problems</td></tr>
            <tr><td><code>SmsNotConfigured</code></td><td>Phone sign-in on a deployment with no SMS provider</td></tr>
            <tr><td><code>KingsChatNotConfigured</code>, <code>KingsChatUnavailable</code></td><td>KingsChat setup, or an upstream outage</td></tr>
            <tr><td><code>InvalidRecord</code>, <code>NotFound</code>, <code>Unauthorized</code></td><td>Record calls</td></tr>
            <tr><td><code>ServerWalletsDisabled</code>, <code>InvalidIdentifier</code>, <code>WalletExists</code>, <code>WalletFrozen</code>, <code>RetryLater</code>, <code>EnclaveUnavailable</code></td><td>User and wallet creation</td></tr>
            <tr><td><code>RateLimited</code></td><td>HTTP 429 with no envelope</td></tr>
            <tr><td><code>Unknown</code>, <code>NetworkError</code></td><td>Unparseable response, or the request never completed (status 0)</td></tr>
            <tr><td><code>Other(String)</code></td><td>A code this version does not know by name; the wire string is kept</td></tr>
          </tbody>
        </table></div>
      </>
    ),
  },
  {
    slug: "config", group: "Reference", title: "Configuration", icon: "sliders",
    body: (
      <>
        <p>Every builder setter is optional. Environment variables are read in <code>build()</code>.</p>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Setter</th><th>Env fallback</th><th>Default</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>app_id</code></td><td></td><td></td><td>Enforce the token&rsquo;s <code>project_id</code>; sent as <code>X-App-Id</code></td></tr>
            <tr><td><code>verification_key</code></td><td><code>DECANE_VERIFICATION_KEY</code></td><td>JWKS</td><td>ES256 SPKI PEM for offline verification</td></tr>
            <tr><td><code>api_key</code></td><td><code>DECANE_API_KEY</code></td><td></td><td><code>dck_live_…</code>, for sign-in</td></tr>
            <tr><td><code>project_secret</code></td><td><code>DECANE_PROJECT_SECRET</code></td><td></td><td><code>dck_sk_…</code>, for by-user-id calls and creation</td></tr>
            <tr><td><code>api_base</code></td><td><code>DECANE_API_BASE</code></td><td><code>https://backend.decane.app</code></td><td>Backend base URL; trailing slashes stripped</td></tr>
            <tr><td><code>jwks_url</code></td><td></td><td><code>{"{api_base}"}/.well-known/jwks.json</code></td><td>JWKS location; ignored with a key</td></tr>
            <tr><td><code>http_client</code></td><td></td><td>its own <code>reqwest::Client</code></td><td>Your client, used for every request including the JWKS fetch</td></tr>
            <tr><td><code>timeout</code></td><td></td><td>15 s</td><td>Per-request timeout for the built-in client</td></tr>
          </tbody>
        </table></div>
        <p>
          An empty or whitespace-only environment value counts as unset. The resolved base URL is
          readable as <code>decane.api_base()</code>.
        </p>
      </>
    ),
  },
  {
    slug: "from-node", group: "Reference", title: "Differences from decane-node", navLabel: "Coming from Node", icon: "arrow",
    body: (
      <>
        <p>
          The wire format and every code, message and check are those of <code>decane-node</code>{" "}
          {VERSIONS.node}. What differs:
        </p>
        <ul>
          <li>snake_case names (<code>verify_access_token</code>, <code>user_id</code>); the wire format is unchanged.</li>
          <li>Async-only, on tokio.</li>
          <li>A JWKS fetch failure is <code>Api {"{ NetworkError, status: 0 }"}</code>, and <code>safe_verify_access_token</code> propagates it; Node returns <code>null</code>.</li>
          <li>The injected HTTP client is used for the JWKS fetch too.</li>
          <li>A default request timeout of 15 seconds.</li>
          <li>A malformed verification key fails at <code>build()</code>.</li>
          <li>Configuration mistakes are <code>DecaneError::Config</code>.</li>
          <li>No standalone cached <code>verify_access_token</code>: build one client and reuse it.</li>
          <li><code>connect_with_token</code> takes <code>Option&lt;&amp;str&gt;</code> for the provider id; <code>create_user</code> takes a <code>CreateUserOptions</code> value.</li>
          <li><code>ApiErrorCode::Other(String)</code> carries codes this version does not know by name.</li>
        </ul>
        <h2 id="privy">Migrating from Privy</h2>
        <p>
          Decane&rsquo;s <code>uid</code> is a UUID, not a <code>did:privy:…</code>. Rows keyed
          by a Privy id will not match; map legacy ids during a re-authentication window before
          cutting production over. <code>User.linked_accounts</code> keeps Privy&rsquo;s shape.
        </p>
      </>
    ),
  },
];

export const ANCHORS: Record<string, string> = Object.fromEntries(
  PAGES.map((p) => [p.slug, p.slug]),
);

export const SEARCH: SearchEntry[] = [
  { id: "overview", title: "Introduction", crumb: "Get started" },
  { id: "install", title: "Install", crumb: "Get started" },
  { id: "quick-start", title: "Quick start", crumb: "Get started" },
  { id: "verification", title: "Verifying tokens", crumb: "Verification" },
  { id: "axum", title: "axum middleware", crumb: "Verification" },
  { id: "users", title: "get_user()", crumb: "Users", mono: true },
  { id: "auth", title: "Server-side sign-in", crumb: "Users" },
  { id: "records", title: "Per-user records", crumb: "Data" },
  { id: "server-wallets", title: "create_user()", crumb: "Data", mono: true },
  { id: "client", title: "DecaneClient", crumb: "Reference", mono: true },
  { id: "errors", title: "DecaneError", crumb: "Reference", mono: true },
  { id: "config", title: "Configuration", crumb: "Reference" },
  { id: "from-node", title: "Differences from decane-node", crumb: "Reference" },
];
