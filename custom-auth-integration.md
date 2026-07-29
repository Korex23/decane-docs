# Custom auth: bring your own identity provider

Decane's default sign-in methods are Google and email. **Custom auth** lets you use whatever
your dApp already has instead — Auth0, Clerk, Firebase, Cognito, or your own backend's JWT
issuer. You configure the issuer once in the dashboard; from then on, the SDK exchanges a
token your system already issues for a Decane session, and everything downstream (wallet
creation, signing, recovery) is identical to Google/email sign-in.

You write no auth code and store no secret with Decane. The only thing you give the dashboard
is public information: your issuer URL and your JWKS endpoint (the public keys your tokens are
signed with). Decane verifies signatures against those keys — it never sees anything your
users would consider a credential.

## How it works, in one paragraph

Your identity system issues a signed JWT the normal way (a user logs into your app, you mint a
token). Your dApp hands that token to the Decane SDK. The SDK POSTs it to the backend, which
verifies the signature against your published JWKS, checks the issuer and (optionally)
audience, and reads whichever claim you designated as the identity claim (`sub` by default).
That claim, namespaced by your provider's ID, becomes the seed for that user's wallet — so the
same claim value always resolves to the same wallet, every time, forever. The backend returns
a normal Decane session JWT, and from that point on it's indistinguishable from a Google or
email session.

```
Your app                    Decane SDK                 Decane backend
   │                             │                            │
   │ user logs into your auth ──►│                            │
   │◄── your JWT ─────────────── │                            │
   │                             │                            │
   │ connectWithToken(jwt) ─────►│                            │
   │                             │  POST /auth/external ─────►│
   │                             │                            │ verify sig vs your JWKS
   │                             │                            │ check issuer / audience
   │                             │                            │ read identity claim
   │                             │                            │ derive wallet identity
   │                             │◄── Decane session JWT ──────│
   │◄── ConnectResult ────────── │                            │
```

## Step 1 — Register your provider in the dashboard

Go to your project → **Custom Auth** → **Add provider**, and fill in:

| Field | What it is | Notes |
|---|---|---|
| Name | Display label, e.g. "Auth0 (prod)" | Cosmetic only |
| Issuer | The `iss` claim your tokens carry | Must match exactly |
| JWKS URL | Where your public signing keys live | Must be `https://` (or `localhost`, for local dev) |
| Identity claim | Which claim identifies the user | Defaults to `sub` |
| Audience | Expected `aud` claim | Optional — leave blank to accept any audience |

**Issuer and identity claim are immutable once created.** Every user's wallet is derived from
`HMAC(providerId + ":" + <identity claim value>)` — if either changed after the fact, every
existing user would silently get a *different* wallet with no error anywhere, just an
empty-looking address. If you need to change either, create a second provider instead; the
first keeps working for the users it already created.

For the same reason, **a provider can't be deleted once it has signed in at least one user** —
deleting it would leave no configuration able to re-derive those wallets. Disable it instead
(`enabled: false`); existing users keep working, no new ones are admitted.

If your project has exactly one enabled provider, the SDK doesn't need to say which one it
means. With more than one, pass `providerId` (see below).

## Step 2 — Get a token to the SDK

Two ways to do this, depending on whether you're using the built-in UI or driving your own.

### A. Built-in `WalletSelector` / `SocialWalletModal`

Add `customAuth` to your `social` config. `getToken` is called when the user clicks the
button — wire it to whatever already gets you a token from your auth system (often: after
your own login flow / SDK's redirect completes).

```tsx
import { DecaneKit } from "decane-connect-kit";

<DecaneKit
  config={{
    appId: "<your project id>",
    mode: "all",
    social: {
      apiKey: "<your api key>",
      authMethods: ["google", "email"],
      chains: ["evm:1", "solana:mainnet"],
      customAuth: {
        label: "Continue with Acme Inc",       // button text
        providerId: undefined,                 // only needed with >1 provider
        getToken: async () => {
          // Your own auth SDK — Auth0, Clerk, Firebase, whatever you already use.
          const session = await myAuthClient.getSession();
          return session.accessToken;
        },
      },
    },
  }}
>
  {children}
</DecaneKit>
```

This renders a button in both the connect modal and the post-connect wallet modal's sign-in
view, alongside Google/email — no other UI work needed.

### B. Headless — call it yourself

If you're building your own sign-in UI (or already have the token some other way, e.g. after
your own OAuth redirect completes), skip the config above and call `connectWithToken`
directly:

```tsx
import { useSocialAuth } from "decane-connect-kit";

function MySignInButton() {
  const { signInWithToken, tokenLoading, error } = useSocialAuth();

  async function handleClick() {
    const token = await myAuthClient.getAccessToken();
    await signInWithToken(token /*, { providerId: "..." } if you have >1 provider */);
  }

  return <button onClick={handleClick} disabled={tokenLoading}>{error ?? "Sign in"}</button>;
}
```

Or fully outside React, using the social SDK directly:

```ts
import { createDecaneConnect } from "decane-connect-kit";

const sdk = await createDecaneConnect({
  appId: "<your project id>",
  apiKey: "<your api key>",
  authMethods: ["google", "email"],
  chains: ["evm:1", "solana:mainnet"],
});

const token = await myAuthClient.getAccessToken();
const { addresses, isNewUser } = await sdk.connectWithToken(token);
```

`connectWithToken` returns the same `ConnectResult` shape as `connectWithGoogle` /
`verifyEmailCode` — `{ addresses: { evm?, solana? }, isNewUser }`.

## JWKS format

Your `jwks_url` must return a standard JSON Web Key Set — a `keys` array containing the
public key(s) your tokens are signed with. RSA (`RS256` — the default for Auth0, Clerk, and
Firebase):

```json
{
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
}
```

EC (`ES256`), if your issuer signs that way instead:

```json
{
  "keys": [
    {
      "kty": "EC",
      "kid": "your-key-id-1",
      "use": "sig",
      "alg": "ES256",
      "crv": "P-256",
      "x": "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
      "y": "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0"
    }
  ]
}
```

Notes:

- **`kid` must match the `kid` in your JWT's header.** The backend resolves the verification
  key by `kid`. If a token's header omits `kid` and the JWKS has exactly one key, that usually
  still works, but setting `kid` consistently on both sides is the safe default.
- **Multiple keys are fine — that's how rotation works.** The moment a token shows up with a
  `kid` the backend hasn't seen, it refetches your JWKS automatically. Rotate your signing key
  on your end whenever you want; no coordination with Decane needed.
- **Only the key material is load-bearing**: `kty` plus (`n`, `e`) for RSA or (`crv`, `x`, `y`)
  for EC. `use` and `alg` are conventional metadata, not strictly required for verification.
- If your issuer is a real OIDC provider, you're not building this by hand — its own
  `/.well-known/jwks.json` (or equivalent) is already in exactly this shape. `providerId` is
  the exception, not this.
- `packages/backend/mock-idp.mjs`'s `GET /.well-known/jwks.json` is a working RS256 example
  (built with `jose`'s `exportJWK()`) if you want something to diff a real response against.

## Multiple providers

If a project has more than one enabled custom provider, pass `providerId` so the backend
knows which issuer/JWKS to verify against — without it, the backend can't safely guess (trying
every configured issuer in turn would let a token from a weak provider be accepted as if it
came from a strong one). With exactly one provider configured, `providerId` can always be
omitted.

## Testing locally without a real Auth0/Clerk account

`packages/backend/mock-idp.mjs` is a throwaway identity provider for exactly this. It generates
a keypair on boot, publishes a JWKS, and mints tokens on demand — nothing persisted, no
external account needed.

```bash
node packages/backend/mock-idp.mjs
```

It prints the values to paste into the dashboard:

```
Issuer          http://localhost:4000
JWKS URL        http://localhost:4000/.well-known/jwks.json
Identity claim  sub
Audience        decane-test   (or leave blank)
```

Then mint a token for any subject:

```bash
curl "http://localhost:4000/token?sub=alice&email=alice@example.com"
```

Your `getToken()` in dev can simply `fetch` that endpoint instead of calling a real auth SDK.

## What the backend actually checks

For anyone debugging a rejected token, `POST /auth/external` verifies, in order:

1. **Signature** — against your published JWKS (key rotation is handled automatically; an
   unrecognized `kid` triggers a refetch).
2. **Issuer** — must equal exactly what you registered.
3. **Expiry** — expired tokens are rejected.
4. **Audience** — only if you configured one.
5. **Identity claim present** — string or number; anything else (object, array, null) is
   rejected rather than coerced.

Any failure in 1–4 collapses into one generic "token failed verification" response — the
backend deliberately doesn't say *which* check failed, so a bad-faith caller can't use error
messages to probe your JWKS for forgeable gaps.

## Security notes

- **Decane never sees your users' credentials** — only a token they already have, and only
  its signature, issuer, and one claim.
- **A leaked custom-auth token is exactly as sensitive as your own tokens already are** —
  Decane doesn't add new risk here, it trusts what your issuer already vouches for.
- **Your provider's config is trusted for your project only.** A developer who controls a
  provider config can assert any identity *within their own project* — that's inherent to
  "bring your own issuer," and it's why the JWKS URL must be `https://` (a downgraded fetch
  would let an on-path attacker serve a forged key set and mint tokens for any user).
