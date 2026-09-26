# Python: using Decane from your backend

Decane has no Python SDK. It does not need one — every server-side capability is plain HTTP
with a bearer token, and the two things worth getting right (token verification and webhook
signatures) are twenty lines each. This page is the Python equivalent of `decane-node`.

Decide first which of these you are doing, because they need different credentials:

| You want to | You need | Section |
| --- | --- | --- |
| Check who is calling your API | Nothing but the public keys | [Verify a token](#verify-a-token) |
| Sign users in from your server | A publishable key, `dck_live_…` | [Sign in server-side](#sign-in-server-side) |
| Use your existing login system | A publishable key + a configured provider | [Bring your own auth](#bring-your-own-auth) |
| List your users and their emails | A secret key, `dck_sk_…` | [Read your users](#read-your-users) |
| React to sign-ins | A webhook secret | [Webhooks](#webhooks) |

Base URL throughout: `https://backend.decane.app`.

## Verify a token

This is the common case and it needs no network call per request. A Decane access token is an
ES256 JWT; fetch the public keys once, cache them, verify locally.

```python
import functools, time, requests
from jose import jwt                      # pip install python-jose[cryptography]

API = "https://backend.decane.app"
APP_ID = "…your project id…"

@functools.lru_cache(maxsize=1)
def _jwks():
    return requests.get(f"{API}/.well-known/jwks.json", timeout=5).json()

def verify(token: str) -> dict:
    claims = jwt.decode(token, _jwks(), algorithms=["ES256"])
    # Not optional: without this, a token minted for ANY other project on the
    # platform verifies here, because it is signed by the same key.
    if claims.get("project_id") != APP_ID:
        raise ValueError("token belongs to a different project")
    return claims
```

Claims you get back:

| Claim | Meaning |
| --- | --- |
| `uid` | The Decane user id. This is your foreign key — store this, not the email. |
| `sub` | A keyed hash of the provider identity. Opaque; never parse it. |
| `project_id` | The project the token was minted for. Check it, as above. |
| `exp`, `iat`, `jti` | Standard. Expiry is 8 hours in production. `sat` is the sign-in time; the token can be refreshed until 7 days after it. |

Two things that bite people. There is **no separate refresh token**, but a still-valid token
can be traded for a fresh one: `POST /auth/refresh` with it as the Bearer returns
`{"jwt", "expiresIn", "sessionExpiresIn"}`, capped at 7 days from the sign-in (then 401 — sign
in again). The client SDKs do this automatically; if your server holds the token, it is yours
to renew. An expired token cannot be refreshed. And revocation is
checked by Decane, not by your verifier: a locally verified token stays valid to you until it
expires, even if `/auth/revoke` was called. If that matters, call
[`/share/addresses`](#resolve-wallet-addresses) or another Decane endpoint, which does check.

## Sign in server-side

Your backend can drive OTP sign-in directly. Both calls need the publishable key.

```python
HEADERS = {
    "Content-Type": "application/json",
    "X-API-Key": os.environ["DECANE_API_KEY"],   # dck_live_…
    "X-App-Id": APP_ID,
}

def start_email(email: str) -> None:
    requests.post(f"{API}/auth/email/start", json={"email": email}, headers=HEADERS, timeout=15)

def verify_email(email: str, code: str) -> dict:
    r = requests.post(f"{API}/auth/email/verify",
                      json={"email": email, "code": code}, headers=HEADERS, timeout=15)
    r.raise_for_status()
    return r.json()   # {jwt, userId, isNewUser, hasShare, profile:{email}}
```

Phone is identical at `/auth/phone/start` and `/auth/phone/verify`, with a `phone` field that
must be full international format (`+2348012345678`). A local-format number is rejected
silently and on purpose: guessing the country would split one person into two accounts.

**`start` always succeeds.** Unknown address, rate limit hit, provider down — all return
`{"ok": true}`. That is anti-enumeration, not a bug. Never surface "email not found" from it,
or you rebuild the oracle the backend is avoiding.

**Codes:** six digits, ten-minute expiry, single use, at most 3 per address per hour.

**Rate limits, precisely:** there is no per-IP limit on the auth endpoints, so your server
being one IP for every user is fine. What is limited is guessing: OTP verification allows 10
attempts per 15 minutes *per target email or phone*, and code sends are capped at 3 per hour
per address.

Other sign-in methods, same headers, same response shape:

| Endpoint | Body |
| --- | --- |
| `POST /auth/google/token` | a Google ID token you already hold |
| `POST /auth/kingschat` | a KingsChat OAuth access token |
| `POST /auth/external` | your own JWT — see below |

Signing out is the exception: `POST /auth/revoke` authenticates with the **user's own token**
(`Authorization: Bearer <decane token>`) and no API key. It blocklists that token's id until
expiry, so Decane's own endpoints reject it immediately — but your offline verifier will keep
accepting it until `exp`. That is inherent to verifying without a network call, not an
oversight.

## Bring your own auth

If your Python app already authenticates users, you do not need Decane's sign-in at all.
Register your issuer and JWKS URL once in the dashboard, then exchange your own token:

```python
r = requests.post(f"{API}/auth/external",
                  json={"token": my_own_jwt, "providerId": "prov-…"},  # providerId optional
                  headers=HEADERS, timeout=15)
session = r.json()   # same shape: {jwt, userId, isNewUser, hasShare}
```

Decane verifies your token against your published keys, checks the issuer and (if configured)
the audience, and reads your identity claim. The same claim value always resolves to the same
wallet. You store no secret with Decane and it never sees a credential of yours.

## Resolve wallet addresses

```python
def addresses(token: str) -> dict:
    r = requests.get(f"{API}/share/addresses",
                     headers={"Authorization": f"Bearer {token}"}, timeout=10)
    r.raise_for_status()
    return r.json()   # {"evm": "0x…"|None, "solana": "…"|None, "tron": "…"|None}
```

Any of the three may be `null` if the user has no wallet yet — `hasShare: false` from sign-in
says the same thing earlier.

## Read your users

This is the only place real email addresses are available, and it uses the **secret** key.
The project is taken from the key itself, so there is no app id to get wrong.

```python
SK = {"Authorization": f"Bearer {os.environ['DECANE_SECRET_KEY']}"}   # dck_sk_…

requests.get(f"{API}/v1/app/users", headers=SK, timeout=15).json()
requests.get(f"{API}/v1/app/users/emails", headers=SK, timeout=15).json()
requests.post(f"{API}/v1/app/users/{user_id}/unsubscribe", headers=SK, timeout=15)
```

Treat `dck_sk_` like a database password: server-side only, never in a mobile app or browser
bundle. A publishable `dck_live_` key cannot reach these routes.

## Webhooks

Configure a URL in the dashboard and Decane POSTs each sign-in to it. Verify the signature
before trusting the body — an unauthenticated webhook route is a "create me a user" endpoint
for anyone who finds it.

```python
import hmac, hashlib, time

TOLERANCE = 300   # seconds; the backend uses the same value

def valid(raw_body: bytes, headers) -> bool:
    ts  = int(headers["x-decane-timestamp"])
    sig = headers["x-decane-signature"]
    if abs(time.time() - ts) > TOLERANCE:      # replay window
        return False
    expected = hmac.new(SECRET.encode(),
                        f"{ts}.".encode() + raw_body,
                        hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, sig)  # constant-time, not ==
```

Sign the **raw body bytes**, before any JSON parsing — re-serialising changes whitespace and
breaks the comparison.

The payload:

```json
{
  "event": "user.signed_in",
  "userId": "…", "projectId": "…",
  "isNewUser": true, "authMethod": "google",
  "profile": { "email": "…", "name": "…", "picture": "…" },
  "addresses": { "evm": "0x…", "solana": "…" },
  "timestamp": 1758700000
}
```

There is no retry queue. A failed delivery is simply re-sent on that user's next sign-in, so
treat webhooks as a nice-to-have signal and the token as the source of truth.

## What cannot move to your backend

Sign-in gives you an identity and a token. It does not give you the wallet. The user's device
share stays on their device, and signing happens inside the enclave with a share your server
never holds. Your Python code can know who someone is and which addresses they own; it cannot
spend for them. If your backend ever finds itself handling a device share, something has gone
wrong.

## Errors

Every error is `{"error": {"code": "…", "message": "…"}}`. The codes you will actually see:

| HTTP | Code | Usually means |
| --- | --- | --- |
| 400 | `INVALID_CODE` | Wrong or expired OTP |
| 400 | `SMS_NOT_CONFIGURED` | Phone sign-in isn't enabled for this deployment |
| 401 | `UNAUTHORIZED` | Bad or expired token, or wrong key type for the route |
| 403 | `INSUFFICIENT_SCOPE` | Org token lacking the scope |
| 404 | `NOT_FOUND` | Also what you get for someone else's project — not a hint |
| 429 | `RATE_LIMITED` | See the per-IP ceiling above |
