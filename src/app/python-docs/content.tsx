import { CodeBlock } from "@/app/docs/components/CodeBlock";
import { DocsCards } from "@/app/docs/components/DocsCards";
import { hl, type Lang } from "@/app/docs/components/highlight";
import { VERSIONS, REGISTRY } from "@/lib/versions";
import type { DocPage, SearchEntry } from "@/app/docs/components/types";

// The Python SDK (`decane` on PyPI), written from sdk-python/ in the monorepo:
// src/decane/client.py, types.py and errors.py, and the package README.

function Code({
  code,
  lang = "python",
  file,
}: {
  code: string;
  lang?: Lang;
  file?: string;
}) {
  return (
    <CodeBlock lang={lang === "bash" ? "bash" : lang} file={file}>
      {hl(code.trim(), lang)}
    </CodeBlock>
  );
}

export const PAGES: DocPage[] = [
  {
    slug: "overview",
    navLabel: "Introduction",
    group: "Get started",
    icon: "home",
    title: "Verify and sign in Decane users from Python.",
    body: (
      <>
        <p className="docs-lede">
          <strong>decane</strong> is the server-side SDK for Decane Connect Kit,
          for Python backends. It verifies Decane access tokens, resolves wallet
          addresses, signs users in from the server, reads and writes per-user
          records, and creates users and their wallets before they ever sign in.
          It is the Python port of <code>decane-node</code>: the same endpoints,
          the same error codes, the same checks.
        </p>
        <dl className="docs-facts">
          <div>
            <dt>Requires</dt>
            <dd>Python 3.10+</dd>
          </div>
          <div>
            <dt>Package</dt>
            <dd>
              <code>decane</code> {VERSIONS.python}, MIT, typed
            </dd>
          </div>
          <div>
            <dt>Dependencies</dt>
            <dd>
              <code>httpx</code> and <code>PyJWT[crypto]</code>
            </dd>
          </div>
          <div>
            <dt>Clients</dt>
            <dd>Sync and asyncio</dd>
          </div>
        </dl>
        <div className="docs-agent">
          <p>
            Wiring up a coding agent?{" "}
            <code>kit.decane.app/llms-python.txt</code> is a self-contained spec
            for this package with real signatures, and{" "}
            <a href="/llms-version.json" target="_blank" rel="noreferrer">
              <code>llms-version.json</code>
            </a>{" "}
            tracks its freshness under the <code>python</code> key.
          </p>
          <div className="docs-agent-actions">
            <a
              href="/llms-python.txt"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
            >
              llms-python.txt
            </a>
          </div>
        </div>
        <DocsCards
          items={[
            {
              href: "/python-docs/quick-start",
              title: "Quick start",
              desc: "Verify a Decane access token in a few lines.",
            },
            {
              href: "/python-docs/frameworks",
              title: "FastAPI, Flask and Django",
              desc: "Drop-in auth for the framework you already use.",
            },
            {
              href: "/python-docs/auth",
              title: "Server-side sign-in",
              desc: "Email and phone codes, Google, KingsChat and custom tokens.",
            },
            {
              href: "/python-docs/records",
              title: "Per-user records",
              desc: "Preferences the user owns and metadata only you can write.",
            },
            {
              href: "/python-docs/server-wallets",
              title: "Server-side wallets",
              desc: "Create a user and their wallet before they sign in.",
            },
            {
              href: "/python-docs/client",
              title: "API reference",
              desc: "Every method on DecaneClient and AsyncDecaneClient.",
            },
          ]}
        />
      </>
    ),
  },
  {
    slug: "install",
    group: "Get started",
    title: "Install",
    icon: "package",
    body: (
      <>
        <Code lang="bash" code={`pip install decane`} />
        <p>Or with uv or Poetry:</p>
        <Code lang="bash" code={`uv add decane\npoetry add decane`} />
        <p>
          Python 3.10 or later. The two runtime dependencies are{" "}
          <code>httpx</code> for HTTP and <code>PyJWT[crypto]</code> for ES256
          verification. The package ships a <code>py.typed</code> marker, so
          mypy and Pyright see full types. It is on{" "}
          <a href={REGISTRY.python} target="_blank" rel="noreferrer">
            pypi.org/project/decane
          </a>
          .
        </p>
        <h2 id="credentials">Credentials</h2>
        <p>
          Verification needs no secret. The other features each need one
          credential from the Decane dashboard, read from the environment when
          you do not pass it:
        </p>
        <div className="docs-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Credential</th>
                <th>Env var</th>
                <th>Needed for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Project id</td>
                <td>
                  <code>DECANE_APP_ID</code> (pass it yourself)
                </td>
                <td>Checking a token belongs to your project</td>
              </tr>
              <tr>
                <td>Verification key</td>
                <td>
                  <code>DECANE_VERIFICATION_KEY</code>
                </td>
                <td>Offline verification (optional)</td>
              </tr>
              <tr>
                <td>
                  API key <code>dck_live_…</code>
                </td>
                <td>
                  <code>DECANE_API_KEY</code>
                </td>
                <td>Server-side sign-in</td>
              </tr>
              <tr>
                <td>
                  Project secret <code>dck_sk_…</code>
                </td>
                <td>
                  <code>DECANE_PROJECT_SECRET</code>
                </td>
                <td>Records by user id, wallet creation</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="docs-callout" data-kind="warn">
          <div className="ico">!</div>
          <p>
            <strong>The API key and project secret are secrets.</strong> Keep
            them in server environment variables; never ship them to a browser
            or a mobile app.
          </p>
        </div>
      </>
    ),
  },
  {
    slug: "quick-start",
    group: "Get started",
    title: "Quick start",
    icon: "rocket",
    body: (
      <>
        <p>
          Construct one client per project and reuse it. On every authenticated
          route, pull the bearer token from the <code>Authorization</code>{" "}
          header and verify it.
        </p>
        <h2 id="create-client">1. Create the client</h2>
        <Code
          file="auth.py"
          code={`
import os
from decane import DecaneClient

# Copy the ES256 verification key from your Decane dashboard.
# app_id is checked against the token's project_id.
decane = DecaneClient(
    app_id=os.environ["DECANE_APP_ID"],
    verification_key=os.environ["DECANE_VERIFICATION_KEY"],  # ES256 SPKI PEM
)`}
        />
        <p>
          With a static key, verification is offline: no network call on the hot
          path.
        </p>
        <h2 id="verify">2. Verify the token</h2>
        <Code
          file="middleware.py"
          code={`
from decane import DecaneAuthError

token = request.headers.get("Authorization", "").removeprefix("Bearer ")
try:
    claims = decane.verify_access_token(token)
except DecaneAuthError:
    ...  # answer 401

claims.user_id  # stable Decane user id: key your records off this`}
        />
        <h2 id="addresses">3. Get the wallet addresses</h2>
        <Code
          code={`
user = decane.get_user(token)
user.addresses.evm      # "0x…" or None
user.addresses.solana
user.addresses.tron`}
        />
        <p>
          That is the whole integration for a backend that only needs to know
          who is calling. Read on for <a href="/python-docs/auth">sign-in</a>,{" "}
          <a href="/python-docs/records">records</a> and{" "}
          <a href="/python-docs/server-wallets">server-side wallets</a>.
        </p>
      </>
    ),
  },
  {
    slug: "verification",
    group: "Verification",
    title: "Verifying tokens",
    icon: "shield",
    body: (
      <>
        <p>
          Decane access tokens are ES256 JWTs. Verification checks the signature
          and expiry and, when <code>app_id</code> is set, that the
          token&rsquo;s <code>project_id</code> matches. It needs only a public
          key, which the client gets one of two ways.
        </p>
        <h2 id="static-key">Static verification key</h2>
        <p>
          Recommended for backends. Pass your project&rsquo;s ES256 public key
          (SPKI PEM, from the dashboard) and every check runs locally. A key
          that is not a P-256 public key fails at construction with{" "}
          <code>DecaneConfigError</code>, not on the first request.
        </p>
        <Code
          code={`decane = DecaneClient(app_id=APP_ID, verification_key=os.environ["DECANE_VERIFICATION_KEY"])`}
        />
        <h2 id="jwks">JWKS</h2>
        <p>
          Omit the key and the client verifies against the key set Decane
          publishes at <code>/.well-known/jwks.json</code>. It is fetched on
          first use, cached for ten minutes, and refetched once (with a
          30-second cooldown) when a token&rsquo;s signature matches no held
          key, so a key rotation needs no redeploy.
        </p>
        <Code code={`decane = DecaneClient(app_id=APP_ID)`} />
        <h2 id="fail-closed">Fail-closed checks</h2>
        <p>
          <code>safe_verify_access_token</code> returns <code>None</code>{" "}
          instead of raising for a token that cannot be trusted:
        </p>
        <Code
          code={`
claims = decane.safe_verify_access_token(token)
if claims is None:
    return JSONResponse({"error": "unauthorized"}, status_code=401)`}
        />
        <div className="docs-callout" data-kind="info">
          <div className="ico">i</div>
          <p>
            A JWKS that cannot be fetched is not a bad token. It raises{" "}
            <code>DecaneApiError</code> with code <code>NETWORK_ERROR</code>,
            even from the safe variant, so an outage answers 500 rather than
            401.
          </p>
        </div>
        <h2 id="standalone">Standalone function</h2>
        <p>
          A drop-in for <code>@privy-io/node</code>&rsquo;s{" "}
          <code>verifyAccessToken</code>. A client is cached per configuration,
          so calling it per request does not refetch the JWKS.
        </p>
        <Code
          code={`
from decane import verify_access_token

claims = verify_access_token(token, app_id=os.environ["DECANE_APP_ID"])`}
        />
        <h2 id="stateless">Verification is stateless</h2>
        <p>
          It checks signature, expiry and project, not Decane&rsquo;s revocation
          list. A token revoked with <code>revoke_access_token</code> still
          verifies until it expires; backend calls such as{" "}
          <code>get_addresses</code> do honour revocation at once. For immediate
          sign-out on a sensitive route, make one of those calls as well.
        </p>
      </>
    ),
  },
  {
    slug: "frameworks",
    group: "Verification",
    title: "FastAPI, Flask and Django",
    navLabel: "Frameworks",
    icon: "layers",
    body: (
      <>
        <p>
          Each example builds one client at startup and turns a missing or bad
          token into a 401.
        </p>
        <h2 id="fastapi">FastAPI</h2>
        <Code
          file="app.py"
          code={`
import os
from fastapi import Depends, FastAPI, Header, HTTPException
from decane import AsyncDecaneClient, Claims

decane = AsyncDecaneClient(app_id=os.environ["DECANE_APP_ID"])
app = FastAPI()

async def current_user(authorization: str = Header("")) -> Claims:
    claims = await decane.safe_verify_access_token(authorization.removeprefix("Bearer "))
    if claims is None:
        raise HTTPException(status_code=401, detail="unauthorized")
    return claims

@app.get("/me")
async def me(claims: Claims = Depends(current_user)):
    return {"user_id": claims.user_id}`}
        />
        <h2 id="flask">Flask</h2>
        <Code
          file="app.py"
          code={`
import os
from functools import wraps
from flask import Flask, abort, g, request
from decane import DecaneClient

decane = DecaneClient(app_id=os.environ["DECANE_APP_ID"])
app = Flask(__name__)

def require_user(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        token = request.headers.get("Authorization", "").removeprefix("Bearer ")
        g.claims = decane.safe_verify_access_token(token)
        if g.claims is None:
            abort(401)
        return view(*args, **kwargs)
    return wrapped

@app.get("/me")
@require_user
def me():
    return {"user_id": g.claims.user_id}`}
        />
        <h2 id="django">Django</h2>
        <Code
          file="middleware.py"
          code={`
import os
from django.http import JsonResponse
from decane import DecaneClient

decane = DecaneClient(app_id=os.environ["DECANE_APP_ID"])

class DecaneAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = request.headers.get("Authorization", "").removeprefix("Bearer ")
        request.decane = decane.safe_verify_access_token(token) if token else None
        if request.path.startswith("/api/") and request.decane is None:
            return JsonResponse({"error": "unauthorized"}, status=401)
        return self.get_response(request)`}
        />
        <h2 id="async">Sync or async</h2>
        <p>
          <code>AsyncDecaneClient</code> has the same constructor and the same
          methods, each awaitable, over <code>httpx.AsyncClient</code>. Use it
          under asyncio or anyio (FastAPI, Starlette, Quart); use{" "}
          <code>DecaneClient</code> under WSGI (Flask, Django). Both are context
          managers and close the <code>httpx</code> client they made; one you
          inject through <code>http_client</code> is yours to close.
        </p>
        <Code
          code={`
async with AsyncDecaneClient(app_id=APP_ID) as decane:
    claims = await decane.verify_access_token(token)

# or, for an app-lifetime client:
await decane.aclose()`}
        />
      </>
    ),
  },
  {
    slug: "users",
    group: "Users",
    title: "Users and addresses",
    icon: "user",
    body: (
      <>
        <p>
          Two calls turn a verified token into wallet addresses. Both hit the
          backend, so both honour revocation at once.
        </p>
        <h2 id="get-user">get_user</h2>
        <Code
          code={`
user = decane.get_user(token)
user.id                # the Decane user id (uid)
user.addresses.evm     # "0x…" or None
user.addresses.solana
user.addresses.tron
user.linked_accounts   # (LinkedAccount(type="wallet", chain_type="ethereum", address=…), …)`}
        />
        <p>
          <code>linked_accounts</code> is Privy-compatible, so code written
          against Privy&rsquo;s user object needs little change.{" "}
          <code>chain_type</code> is <code>ethereum</code>, <code>solana</code>{" "}
          or <code>tron</code>.
        </p>
        <h2 id="get-addresses">get_addresses</h2>
        <Code
          code={`addresses = decane.get_addresses(token)  # Addresses(evm=…, solana=…, tron=…)`}
        />
        <p>
          A user who has signed in but has no wallet yet has every address as{" "}
          <code>None</code>
          until a client creates the wallet, or your server does with{" "}
          <a href="/python-docs/server-wallets">create_user_wallet</a>.
        </p>
      </>
    ),
  },
  {
    slug: "auth",
    group: "Users",
    title: "Server-side sign-in",
    navLabel: "Sign-in",
    icon: "key",
    body: (
      <>
        <p>
          The same sign-in flows the frontend SDKs offer, minus anything that
          needs a browser or a device authenticator. Every call needs your
          developer API key.
        </p>
        <Code
          code={`
decane = DecaneClient(app_id=os.environ["DECANE_APP_ID"], api_key=os.environ["DECANE_API_KEY"])`}
        />
        <h2 id="email">Email code</h2>
        <Code
          code={`
decane.connect_with_email("user@example.com")                    # emails a 6-digit code
session = decane.verify_email_code("user@example.com", "123456")`}
        />
        <h2 id="phone">Phone code</h2>
        <Code
          code={`
decane.connect_with_phone("+2348012345678")                       # E.164 only
session = decane.verify_phone_code("+2348012345678", "123456")`}
        />
        <h2 id="token-exchange">Token exchange</h2>
        <p>One step each, for a token the user already holds:</p>
        <Code
          code={`
decane.connect_with_google_token(google_id_token)                 # a Google ID token
decane.connect_with_kingschat_token(kc_access_token)              # a KingsChat access token
decane.connect_with_token(jwt_from_your_issuer, provider_id="prov-1")  # custom auth`}
        />
        <h2 id="result">The result</h2>
        <Code
          code={`
session.access_token  # a Decane JWT (8 h): verify it, or hand it to the client
session.user_id       # stable Decane user id
session.is_new_user   # True on the user's first sign-in
session.has_share     # False = no wallet yet
session.profile       # AuthProfile(name, email, picture) for Google and KingsChat, else None`}
        />
        <p>
          The profile is passed through from the provider and never stored by
          Decane. <code>decane.get_user(session.access_token)</code> composes in
          one line when you also want addresses.
        </p>
        <h2 id="sign-out">Sign-out</h2>
        <Code code={`decane.revoke_access_token(session.access_token)`} />
        <h2 id="auth-caveats">Caveats</h2>
        <ul>
          <li>
            <strong>Rate limits.</strong> There is no per-IP limit on sign-in,
            so one server egress IP is fine. OTP attempts are limited to 10 per
            15 minutes per email or phone, and code sends to 3 per hour per
            address.
          </li>
          <li>
            <strong>Anti-enumeration.</strong> <code>connect_with_email</code>{" "}
            and <code>connect_with_phone</code> succeed whether or not the
            address is known. Never tell a user an email was not found.
          </li>
          <li>
            <strong>Token renewal.</strong> Tokens last 8 hours.{" "}
            <code>POST /auth/refresh</code> with a still-valid token returns a
            fresh one, up to 7 days after sign-in; this package does not wrap it
            yet.
          </li>
          <li>
            <strong>Not available server-side:</strong> the Google redirect
            flow, the KingsChat popup and passkey sign-in. Signing transactions
            stays in the client SDKs.
          </li>
        </ul>
      </>
    ),
  },
  {
    slug: "records",
    group: "Data",
    title: "Per-user records",
    icon: "tag",
    body: (
      <>
        <p>
          Two small, flat JSON records live on every Decane user, split by who
          may write them. They replace Privy&rsquo;s custom metadata.
        </p>
        <div className="docs-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Record</th>
                <th>Written with</th>
                <th>For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>preferences</code>
                </td>
                <td>the user&rsquo;s token, or the project secret</td>
                <td>the user&rsquo;s own choices</td>
              </tr>
              <tr>
                <td>
                  <code>metadata</code>
                </td>
                <td>the project secret only</td>
                <td>your facts about the user: plan, flags, your own ids</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          A user cannot change <code>metadata</code>, so an entitlement may live
          there. Values are strings, numbers or booleans under keys of up to 64
          characters (<code>[A-Za-z0-9_.-]</code>); at most 100 keys and 32 KB,
          strings at most 2,048 characters.
        </p>
        <h2 id="with-token">With the user&rsquo;s token</h2>
        <Code
          code={`
prefs = decane.get_preferences(token)                               # {"theme": "dark", …}
decane.update_preferences(token, {"theme": "light", "old": None})   # merge; None removes a key
decane.set_preferences(token, {"theme": "dark"})                    # replace
decane.get_metadata(token)                                          # read-only on this side`}
        />
        <h2 id="by-user-id">By user id, with the project secret</h2>
        <Code
          code={`
decane = DecaneClient(app_id=APP_ID, project_secret=os.environ["DECANE_PROJECT_SECRET"])

decane.update_user_metadata(claims.user_id, {"plan": "pro"})
decane.get_user_metadata(claims.user_id)
decane.set_user_metadata(claims.user_id, {})
decane.get_user_preferences(claims.user_id)   # update_user_preferences / set_user_preferences too`}
        />
        <p>
          A write that breaks the rules raises <code>DecaneApiError</code> with
          code <code>INVALID_RECORD</code>, and the message names the key. A
          user of another project is <code>NOT_FOUND</code>.
        </p>
      </>
    ),
  },
  {
    slug: "server-wallets",
    group: "Data",
    title: "Server-side wallet creation",
    navLabel: "Server-side wallets",
    icon: "server",
    body: (
      <>
        <p>
          Create a user, and their wallet, before they have signed in. Decane
          keys the user exactly as the matching sign-in will, so their first
          sign-in opens the wallet made here. The key is generated inside the
          enclave; your server sees only the addresses.
        </p>
        <Code
          code={`
from decane import DecaneClient, UserIdentifier

decane = DecaneClient(app_id=APP_ID, project_secret=os.environ["DECANE_PROJECT_SECRET"])

result = decane.create_user(UserIdentifier("email", "ada@example.com"))
result.user.addresses.evm  # fund it now; Ada finds it when she signs in
result.created             # True when this call made the user
result.wallet              # "created" | "exists" | "none"`}
        />
        <h2 id="identifiers">Identifiers</h2>
        <div className="docs-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>email</code>
                </td>
                <td>
                  Any case. A later email-code or Google sign-in with this
                  verified address opens the same wallet.
                </td>
              </tr>
              <tr>
                <td>
                  <code>phone</code>
                </td>
                <td>
                  E.164, <code>+&lt;country&gt;&lt;number&gt;</code>.
                </td>
              </tr>
              <tr>
                <td>
                  <code>custom</code>
                </td>
                <td>
                  The subject your own JWTs assert, with{" "}
                  <code>provider_id</code> from the dashboard.
                </td>
              </tr>
              <tr>
                <td>
                  <code>kingschat</code>, <code>x</code>
                </td>
                <td>The provider&rsquo;s stable user id, never an @handle.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Code
          code={`
decane.create_user(UserIdentifier("phone", "+2348012345678"), metadata={"plan": "pro"})
decane.create_user(UserIdentifier("custom", "auth0|123", provider_id=PROVIDER_ID), create_wallet=False)
decane.create_user_wallet(result.user.id)   # for an existing user with no wallet`}
        />
        <h2 id="wallet-rules">Rules</h2>
        <ul>
          <li>
            Idempotent on the identifier: calling twice returns the same user.
          </li>
          <li>
            Off until the Decane team switches it on for your project; until
            then calls fail with <code>SERVER_WALLETS_DISABLED</code>.
          </li>
          <li>Sixty calls a minute per project.</li>
          <li>
            Other failures: <code>INVALID_IDENTIFIER</code>,{" "}
            <code>WALLET_EXISTS</code> (from <code>create_user_wallet</code>),{" "}
            <code>WALLET_FROZEN</code>, <code>RETRY_LATER</code>,{" "}
            <code>ENCLAVE_UNAVAILABLE</code>.
          </li>
        </ul>
      </>
    ),
  },
  {
    slug: "client",
    group: "Reference",
    title: "API reference",
    icon: "code",
    body: (
      <>
        <p>
          <code>DecaneClient</code> and <code>AsyncDecaneClient</code> share
          this surface; on the async client every method is a coroutine. All
          arguments after the first are keyword-only where shown.
        </p>
        <h2 id="methods-verify">Verification</h2>
        <div className="docs-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Returns</th>
                <th>Needs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>verify_access_token(token)</code>
                </td>
                <td>
                  <code>Claims</code>
                </td>
                <td>nothing</td>
              </tr>
              <tr>
                <td>
                  <code>safe_verify_access_token(token)</code>
                </td>
                <td>
                  <code>Claims | None</code>
                </td>
                <td>nothing</td>
              </tr>
              <tr>
                <td>
                  <code>get_addresses(token)</code>
                </td>
                <td>
                  <code>Addresses</code>
                </td>
                <td>nothing</td>
              </tr>
              <tr>
                <td>
                  <code>get_user(token)</code>
                </td>
                <td>
                  <code>User</code>
                </td>
                <td>nothing</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2 id="methods-auth">Sign-in</h2>
        <div className="docs-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Returns</th>
                <th>Needs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>connect_with_email(email)</code>
                </td>
                <td>
                  <code>None</code>
                </td>
                <td>API key</td>
              </tr>
              <tr>
                <td>
                  <code>verify_email_code(email, code)</code>
                </td>
                <td>
                  <code>AuthResult</code>
                </td>
                <td>API key</td>
              </tr>
              <tr>
                <td>
                  <code>connect_with_phone(phone)</code>
                </td>
                <td>
                  <code>None</code>
                </td>
                <td>API key</td>
              </tr>
              <tr>
                <td>
                  <code>verify_phone_code(phone, code)</code>
                </td>
                <td>
                  <code>AuthResult</code>
                </td>
                <td>API key</td>
              </tr>
              <tr>
                <td>
                  <code>connect_with_google_token(id_token)</code>
                </td>
                <td>
                  <code>AuthResult</code>
                </td>
                <td>API key</td>
              </tr>
              <tr>
                <td>
                  <code>connect_with_kingschat_token(access_token)</code>
                </td>
                <td>
                  <code>AuthResult</code>
                </td>
                <td>API key</td>
              </tr>
              <tr>
                <td>
                  <code>connect_with_token(token, *, provider_id=None)</code>
                </td>
                <td>
                  <code>AuthResult</code>
                </td>
                <td>API key</td>
              </tr>
              <tr>
                <td>
                  <code>get_kingschat_config()</code>
                </td>
                <td>
                  <code>KingsChatConfig</code>
                </td>
                <td>API key</td>
              </tr>
              <tr>
                <td>
                  <code>revoke_access_token(token)</code>
                </td>
                <td>
                  <code>None</code>
                </td>
                <td>nothing</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2 id="methods-records">Records</h2>
        <div className="docs-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Returns</th>
                <th>Needs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>get_preferences(token)</code>
                </td>
                <td>
                  <code>Record</code>
                </td>
                <td>user token</td>
              </tr>
              <tr>
                <td>
                  <code>update_preferences(token, patch)</code>
                </td>
                <td>
                  <code>Record</code>
                </td>
                <td>user token</td>
              </tr>
              <tr>
                <td>
                  <code>set_preferences(token, record)</code>
                </td>
                <td>
                  <code>Record</code>
                </td>
                <td>user token</td>
              </tr>
              <tr>
                <td>
                  <code>get_metadata(token)</code>
                </td>
                <td>
                  <code>Record</code>
                </td>
                <td>user token</td>
              </tr>
              <tr>
                <td>
                  <code>get_user_metadata(user_id)</code>
                </td>
                <td>
                  <code>Record</code>
                </td>
                <td>project secret</td>
              </tr>
              <tr>
                <td>
                  <code>update_user_metadata(user_id, patch)</code>
                </td>
                <td>
                  <code>Record</code>
                </td>
                <td>project secret</td>
              </tr>
              <tr>
                <td>
                  <code>set_user_metadata(user_id, record)</code>
                </td>
                <td>
                  <code>Record</code>
                </td>
                <td>project secret</td>
              </tr>
              <tr>
                <td>
                  <code>get_user_preferences(user_id)</code>
                </td>
                <td>
                  <code>Record</code>
                </td>
                <td>project secret</td>
              </tr>
              <tr>
                <td>
                  <code>update_user_preferences(user_id, patch)</code>
                </td>
                <td>
                  <code>Record</code>
                </td>
                <td>project secret</td>
              </tr>
              <tr>
                <td>
                  <code>set_user_preferences(user_id, record)</code>
                </td>
                <td>
                  <code>Record</code>
                </td>
                <td>project secret</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2 id="methods-create">Creation</h2>
        <div className="docs-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Method</th>
                <th>Returns</th>
                <th>Needs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>
                    create_user(identifier, *, create_wallet=None,
                    metadata=None)
                  </code>
                </td>
                <td>
                  <code>CreatedUser</code>
                </td>
                <td>project secret</td>
              </tr>
              <tr>
                <td>
                  <code>create_user_wallet(user_id)</code>
                </td>
                <td>
                  <code>CreatedUser</code>
                </td>
                <td>project secret</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2 id="types">Types</h2>
        <p>
          Every result is a frozen dataclass, importable from{" "}
          <code>decane</code>.
        </p>
        <div className="docs-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Fields</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>Claims</code>
                </td>
                <td>
                  <code>user_id</code>, <code>subject</code>,{" "}
                  <code>project_id</code>, <code>token_id</code>,{" "}
                  <code>issued_at</code>, <code>expires_at</code>,{" "}
                  <code>raw</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>Addresses</code>
                </td>
                <td>
                  <code>evm</code>, <code>solana</code>, <code>tron</code> (each{" "}
                  <code>str | None</code>)
                </td>
              </tr>
              <tr>
                <td>
                  <code>User</code>
                </td>
                <td>
                  <code>id</code>, <code>addresses</code>,{" "}
                  <code>linked_accounts</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>LinkedAccount</code>
                </td>
                <td>
                  <code>type</code> (<code>&quot;wallet&quot;</code>),{" "}
                  <code>chain_type</code>, <code>address</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>AuthResult</code>
                </td>
                <td>
                  <code>access_token</code>, <code>user_id</code>,{" "}
                  <code>is_new_user</code>, <code>has_share</code>,{" "}
                  <code>profile</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>AuthProfile</code>
                </td>
                <td>
                  <code>name</code>, <code>email</code>, <code>picture</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>KingsChatConfig</code>
                </td>
                <td>
                  <code>client_id</code>, <code>authorization_url</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>UserIdentifier</code>
                </td>
                <td>
                  <code>type</code>, <code>value</code>,{" "}
                  <code>provider_id</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>CreatedUser</code>
                </td>
                <td>
                  <code>user</code> (<code>id</code>, <code>auth_method</code>,{" "}
                  <code>identifier</code>, <code>addresses</code>),{" "}
                  <code>created</code>, <code>wallet</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>Record</code> / <code>RecordPatch</code>
                </td>
                <td>
                  <code>dict[str, str | int | float | bool]</code>; a patch
                  value may be <code>None</code> to remove the key
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    slug: "errors",
    group: "Reference",
    title: "Error handling",
    icon: "alert",
    body: (
      <>
        <p>
          Three failure domains, three classes, all subclasses of{" "}
          <code>DecaneError</code>.
        </p>
        <Code
          code={`
from decane import DecaneApiError, DecaneAuthError, DecaneConfigError

try:
    session = decane.verify_email_code(email, code)
except DecaneApiError as err:
    if err.code == "INVALID_CODE":
        ...  # ask for the code again
    err.status  # HTTP status; 0 when the request never got a response`}
        />
        <h2 id="auth-error">DecaneAuthError</h2>
        <p>
          The token cannot be trusted. <code>err.reason</code> is{" "}
          <code>&quot;invalid_token&quot;</code> (bad signature, malformed or
          expired), <code>&quot;missing_uid&quot;</code> or{" "}
          <code>&quot;project_mismatch&quot;</code>.
        </p>
        <h2 id="config-error">DecaneConfigError</h2>
        <p>
          A mistake in how the client was set up, raised before any network
          call: a sign-in call without an API key, a by-user-id call without the
          project secret, a verification key that is not a P-256 public key. A
          blank required argument (an empty email, token or user id) is a plain{" "}
          <code>ValueError</code>.
        </p>
        <h2 id="api-error">DecaneApiError codes</h2>
        <div className="docs-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>INVALID_CODE</code>
                </td>
                <td>Email or SMS code wrong or expired</td>
              </tr>
              <tr>
                <td>
                  <code>AUTH_FAILED</code>
                </td>
                <td>Provider token rejected</td>
              </tr>
              <tr>
                <td>
                  <code>INVALID_TOKEN</code>
                </td>
                <td>Custom-auth JWT rejected</td>
              </tr>
              <tr>
                <td>
                  <code>NO_PROVIDER</code>, <code>AMBIGUOUS_PROVIDER</code>,{" "}
                  <code>MISSING_CLAIM</code>
                </td>
                <td>Custom-auth provider configuration</td>
              </tr>
              <tr>
                <td>
                  <code>INVALID_API_KEY</code>, <code>APP_ID_MISMATCH</code>
                </td>
                <td>Credential problems</td>
              </tr>
              <tr>
                <td>
                  <code>SMS_NOT_CONFIGURED</code>
                </td>
                <td>Phone sign-in on a deployment with no SMS provider</td>
              </tr>
              <tr>
                <td>
                  <code>KINGSCHAT_NOT_CONFIGURED</code>,{" "}
                  <code>KINGSCHAT_UNAVAILABLE</code>
                </td>
                <td>KingsChat setup, or an upstream outage</td>
              </tr>
              <tr>
                <td>
                  <code>INVALID_RECORD</code>, <code>NOT_FOUND</code>,{" "}
                  <code>UNAUTHORIZED</code>
                </td>
                <td>Record calls</td>
              </tr>
              <tr>
                <td>
                  <code>SERVER_WALLETS_DISABLED</code>,{" "}
                  <code>INVALID_IDENTIFIER</code>, <code>WALLET_EXISTS</code>,{" "}
                  <code>WALLET_FROZEN</code>, <code>RETRY_LATER</code>,{" "}
                  <code>ENCLAVE_UNAVAILABLE</code>
                </td>
                <td>User and wallet creation</td>
              </tr>
              <tr>
                <td>
                  <code>RATE_LIMITED</code>
                </td>
                <td>HTTP 429</td>
              </tr>
              <tr>
                <td>
                  <code>UNKNOWN</code>, <code>NETWORK_ERROR</code>
                </td>
                <td>
                  Unparseable response, or the request never completed (status
                  0)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    slug: "config",
    group: "Reference",
    title: "Configuration",
    icon: "sliders",
    body: (
      <>
        <p>Every constructor argument is keyword-only and optional.</p>
        <div className="docs-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Option</th>
                <th>Env fallback</th>
                <th>Default</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>app_id</code>
                </td>
                <td></td>
                <td></td>
                <td>
                  Enforce the token&rsquo;s <code>project_id</code>; sent as{" "}
                  <code>X-App-Id</code>
                </td>
              </tr>
              <tr>
                <td>
                  <code>verification_key</code>
                </td>
                <td>
                  <code>DECANE_VERIFICATION_KEY</code>
                </td>
                <td>JWKS</td>
                <td>ES256 SPKI PEM for offline verification</td>
              </tr>
              <tr>
                <td>
                  <code>api_key</code>
                </td>
                <td>
                  <code>DECANE_API_KEY</code>
                </td>
                <td></td>
                <td>
                  <code>dck_live_…</code>, for sign-in
                </td>
              </tr>
              <tr>
                <td>
                  <code>project_secret</code>
                </td>
                <td>
                  <code>DECANE_PROJECT_SECRET</code>
                </td>
                <td></td>
                <td>
                  <code>dck_sk_…</code>, for by-user-id calls and creation
                </td>
              </tr>
              <tr>
                <td>
                  <code>api_base</code>
                </td>
                <td>
                  <code>DECANE_API_BASE</code>
                </td>
                <td>
                  <code>https://backend.decane.app</code>
                </td>
                <td>Backend base URL</td>
              </tr>
              <tr>
                <td>
                  <code>jwks_url</code>
                </td>
                <td></td>
                <td>
                  <code>{"{api_base}"}/.well-known/jwks.json</code>
                </td>
                <td>JWKS location; ignored with a key</td>
              </tr>
              <tr>
                <td>
                  <code>http_client</code>
                </td>
                <td></td>
                <td>
                  its own <code>httpx</code> client
                </td>
                <td>
                  Your <code>httpx.Client</code> or{" "}
                  <code>httpx.AsyncClient</code>, used for every request
                  including the JWKS fetch
                </td>
              </tr>
              <tr>
                <td>
                  <code>timeout</code>
                </td>
                <td></td>
                <td>
                  <code>15.0</code>
                </td>
                <td>
                  Seconds per request for the client-owned <code>httpx</code>{" "}
                  client
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          An empty or whitespace-only environment value counts as unset, so a
          deploy template that writes <code>DECANE_API_BASE=</code> cannot break
          the client. The resolved base URL is readable as{" "}
          <code>decane.api_base</code>.
        </p>
      </>
    ),
  },
  {
    slug: "from-node",
    group: "Reference",
    title: "Differences from decane-node",
    navLabel: "Coming from Node",
    icon: "arrow",
    body: (
      <>
        <p>
          The wire format and every code, message and check are those of{" "}
          <code>decane-node</code> {VERSIONS.node}. What differs:
        </p>
        <ul>
          <li>
            snake_case names throughout (<code>verify_access_token</code>,{" "}
            <code>user_id</code>); the wire format is unchanged.
          </li>
          <li>
            Sync <code>DecaneClient</code> and async{" "}
            <code>AsyncDecaneClient</code>.
          </li>
          <li>
            A JWKS fetch failure is <code>DecaneApiError</code> with code{" "}
            <code>NETWORK_ERROR</code>, and{" "}
            <code>safe_verify_access_token</code> lets it through; Node returns{" "}
            <code>null</code>.
          </li>
          <li>
            The injected <code>http_client</code> is used for the JWKS fetch
            too.
          </li>
          <li>A default request timeout of 15 seconds.</li>
          <li>
            A malformed <code>verification_key</code> fails at construction.
          </li>
          <li>
            Configuration mistakes are <code>DecaneConfigError</code>; blank
            arguments are <code>ValueError</code>.
          </li>
          <li>
            Results are frozen dataclasses; <code>create_user</code> takes{" "}
            <code>create_wallet</code> and <code>metadata</code> as keyword
            arguments.
          </li>
        </ul>
        <h2 id="privy">Migrating from Privy</h2>
        <p>
          Decane&rsquo;s <code>uid</code> is a UUID, not a{" "}
          <code>did:privy:…</code>. Rows keyed by a Privy id will not match; map
          legacy ids during a re-authentication window before cutting production
          over. The standalone <code>verify_access_token</code> and{" "}
          <code>User.linked_accounts</code> keep Privy&rsquo;s shapes.
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
  {
    id: "frameworks",
    title: "FastAPI, Flask and Django",
    crumb: "Verification",
  },
  { id: "users", title: "get_user()", crumb: "Users", mono: true },
  { id: "auth", title: "Server-side sign-in", crumb: "Users" },
  { id: "records", title: "Per-user records", crumb: "Data" },
  { id: "server-wallets", title: "create_user()", crumb: "Data", mono: true },
  { id: "client", title: "DecaneClient", crumb: "Reference", mono: true },
  { id: "errors", title: "DecaneApiError", crumb: "Reference", mono: true },
  { id: "config", title: "Configuration", crumb: "Reference" },
  {
    id: "from-node",
    title: "Differences from decane-node",
    crumb: "Reference",
  },
];
