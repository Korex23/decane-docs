"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  DecaneKit,
  useDecane,
  useSignMessage,
  useSocialAuth,
  useSocialWallet,
  useWalletSelector,
} from "decane-connect-kit";
import { ChainTypeIcon } from "@/components/ChainIcon";
import { DecaneLogo } from "@/components/DecaneLogo";
import {
  CopyIcon,
  CheckIcon,
  GoogleMark,
  XLogo,
  MailIcon,
  PhoneIcon,
  ChatIcon,
  WalletIcon,
  ArrowLeftIcon,
} from "@/components/Icons";
import type { Theme } from "@/lib/theme";
import {
  CHAINS,
  DEFAULT_SETTINGS,
  DEMO_API_KEY,
  DEMO_APP_ID,
  METHODS,
  MODES,
  type ChainId,
  type DemoSettings,
  type Method,
} from "./config";

const STORE = "decane-demo-settings";

const METHOD_ICON: Record<Method, ReactNode> = {
  google: <GoogleMark size={16} />,
  email: <MailIcon size={16} />,
  phone: <PhoneIcon size={16} />,
  x: <XLogo size={14} />,
  kingschat: <ChatIcon size={16} />,
};

function loadSettings(): DemoSettings {
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return DEFAULT_SETTINGS;
    const s = JSON.parse(raw) as Partial<DemoSettings>;
    return {
      mode:
        s.mode === "social" || s.mode === "all"
          ? s.mode
          : DEFAULT_SETTINGS.mode,
      methods: { ...DEFAULT_SETTINGS.methods, ...s.methods },
      chains: { ...DEFAULT_SETTINGS.chains, ...s.chains },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function snippet(settings: DemoSettings, theme: Theme) {
  const methods = METHODS.filter((m) => settings.methods[m.id])
    .map((m) => `"${m.id}"`)
    .join(", ");
  const chains = CHAINS.filter((c) => settings.chains[c.id])
    .map((c) => `"${c.id}"`)
    .join(", ");
  return `import { DecaneKit } from "decane-connect-kit";

<DecaneKit
  config={{
    appId: "YOUR_APP_ID",
    mode: "${settings.mode}",
    theme: "${theme}",
    social: {
      apiKey: "dck_live_…",
      authMethods: [${methods}],
      chains: [${chains}],
      protection: "identity",
    },
  }}
>
  <App />
</DecaneKit>`;
}

function useCopy(): [boolean, (value: string) => void] {
  const [done, setDone] = useState(false);
  return [
    done,
    (value) =>
      navigator.clipboard?.writeText(value).then(() => {
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }),
  ];
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, copy] = useCopy();
  return (
    <button
      type="button"
      className={`copy-btn${done ? " done" : ""}`}
      aria-label={done ? "Copied" : `Copy ${label}`}
      title="Copy"
      onClick={() => copy(value)}
    >
      {done ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
    </button>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`demo-switch${checked ? " on" : ""}`}
      onClick={onChange}
    >
      <span />
    </button>
  );
}

function ConfigPanel({
  settings,
  setSettings,
  theme,
  onToggleTheme,
  onLaunch,
}: {
  settings: DemoSettings;
  setSettings: (s: DemoSettings) => void;
  theme: Theme;
  onToggleTheme: () => void;
  onLaunch: () => void;
}) {
  const methodCount = Object.values(settings.methods).filter(Boolean).length;
  const chainCount = Object.values(settings.chains).filter(Boolean).length;
  return (
    <aside className="demo-config" aria-label="Demo settings">
      <section>
        <h2>Appearance</h2>
        <div className="demo-seg" role="radiogroup" aria-label="Theme">
          {(["dark", "light"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={theme === t}
              className={theme === t ? "on" : ""}
              onClick={() => theme !== t && onToggleTheme()}
            >
              {t === "dark" ? "Dark" : "Light"}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2>Mode</h2>
        <div className="demo-seg" role="radiogroup" aria-label="Mode">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={settings.mode === m.id}
              className={settings.mode === m.id ? "on" : ""}
              onClick={() =>
                settings.mode !== m.id &&
                setSettings({ ...settings, mode: m.id })
              }
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="demo-hint">
          {settings.mode === "all"
            ? "Wallets installed in this browser are offered beside social sign-in."
            : "Social sign-in only. Installed wallets are not offered."}
        </p>
      </section>

      <section>
        <h2>Sign-in methods</h2>
        <ul className="demo-options">
          {METHODS.map((m) => {
            const on = settings.methods[m.id];
            const last = on && methodCount === 1;
            return (
              <li key={m.id}>
                <span className="demo-option-label">
                  {METHOD_ICON[m.id]}
                  {m.label}
                </span>
                <Toggle
                  label={m.label}
                  checked={on}
                  onChange={() =>
                    !last &&
                    setSettings({
                      ...settings,
                      methods: { ...settings.methods, [m.id]: !on },
                    })
                  }
                />
              </li>
            );
          })}
        </ul>
        <p className="demo-hint">
          Methods your project has not enabled in the dashboard are refused by
          the backend.
        </p>
      </section>

      <section>
        <h2>Chains</h2>
        <ul className="demo-options">
          {CHAINS.map((c) => {
            const on = settings.chains[c.id];
            const last = on && chainCount === 1;
            return (
              <li key={c.id}>
                <span className="demo-option-label">
                  <ChainTypeIcon type={c.logo} size={16} />
                  {c.label}
                  <code>{c.id}</code>
                </span>
                <Toggle
                  label={c.label}
                  checked={on}
                  onChange={() =>
                    !last &&
                    setSettings({
                      ...settings,
                      chains: { ...settings.chains, [c.id]: !on },
                    })
                  }
                />
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2>Wallet</h2>
        <p className="demo-hint">
          A wallet is created on first sign-in. This demo uses the identity
          tier: nothing to set up on the device, every visit is a sign-in. The{" "}
          <Link href="/docs/social" className="ulink">
            device tier
          </Link>{" "}
          adds a passkey or password.
        </p>
      </section>

      {/* Phones only: the settings come first and this opens the preview,
          as Privy's "Launch" does. */}
      <button
        type="button"
        className="btn btn-primary demo-launch"
        onClick={onLaunch}
      >
        Launch the preview
      </button>
    </aside>
  );
}

// ─── Inline login card ───────────────────────────────────────────────────────

function InstalledWallets() {
  const { wallets, connect } = useDecane();
  const selector = useWalletSelector();
  const [pending, setPending] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const shown = wallets.slice(0, 4);
  return (
    <>
      <div className="demo-or">
        <span>or connect a wallet</span>
      </div>
      <div className="demo-methods">
        {shown.map((wl) => (
          <button
            key={wl.id}
            type="button"
            className="demo-method"
            disabled={!!pending}
            onClick={async () => {
              setPending(wl.id);
              setErr(null);
              try {
                await connect(wl);
              } catch (e) {
                setErr(e instanceof Error ? e.message : String(e));
              } finally {
                setPending(null);
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wl.icon}
              alt=""
              width={20}
              height={20}
              className="demo-wallet-icon"
            />
            <span>
              {pending === wl.id ? `Waiting for ${wl.name}…` : wl.name}
            </span>
            <small className="demo-method-tag">Installed</small>
          </button>
        ))}
        <button
          type="button"
          className="demo-method"
          disabled={!!pending}
          onClick={selector.open}
        >
          <WalletIcon size={18} />
          <span>
            {shown.length ? "More options" : "Continue with a wallet"}
          </span>
        </button>
      </div>
      {err && <p className="demo-error">{err}</p>}
    </>
  );
}

function LoginCard({ settings }: { settings: DemoSettings }) {
  const auth = useSocialAuth();
  const wallet = useSocialWallet();
  const selector = useWalletSelector();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<null | {
    kind: "email" | "phone";
    to: string;
  }>(null);
  const [err, setErr] = useState<string | null>(null);

  async function run(fn: () => Promise<unknown>) {
    setErr(null);
    try {
      await fn();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  }

  const busy =
    auth.googleLoading ||
    auth.emailLoading ||
    auth.phoneLoading ||
    auth.xLoading ||
    auth.kingschatLoading ||
    wallet.loading;
  const creating = auth.isCreatingWallet;

  if (step) {
    return (
      <div className="demo-login">
        <DecaneLogo size={44} />
        <h3>Enter your code</h3>
        <p className="demo-login-sub">
          We sent a 6-digit code to <strong>{step.to}</strong>.
        </p>
        <form
          className="demo-login-form"
          onSubmit={(e) => {
            e.preventDefault();
            run(() =>
              step.kind === "email"
                ? auth.confirmEmailCode(step.to, code.trim())
                : auth.confirmPhoneCode(step.to, code.trim()),
            );
          }}
        >
          <input
            className="demo-field"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={busy || code.trim().length < 6}
          >
            {creating
              ? "Creating your wallet…"
              : busy
                ? "Checking…"
                : "Continue"}
          </button>
        </form>
        {(err || auth.error) && (
          <p className="demo-error">{err ?? auth.error}</p>
        )}
        <button
          type="button"
          className="demo-link"
          onClick={() => {
            setStep(null);
            setCode("");
            setErr(null);
          }}
        >
          Use a different method
        </button>
        <p className="demo-protected">
          Protected by <DecaneLogo size={14} /> decane
        </p>
      </div>
    );
  }

  return (
    <div className="demo-login">
      <DecaneLogo size={44} />
      <h3>Log in or sign up</h3>
      <div className="demo-methods">
        {settings.methods.google && (
          <button
            type="button"
            className="demo-method"
            disabled={busy}
            onClick={() => run(auth.signInWithGoogle)}
          >
            <GoogleMark size={18} />
            <span>{auth.googleLoading ? "Opening Google…" : "Google"}</span>
          </button>
        )}
        {settings.methods.email && (
          <form
            className="demo-method demo-method-input"
            onSubmit={(e) => {
              e.preventDefault();
              const to = email.trim();
              run(async () => {
                await auth.sendEmailCode(to);
                setStep({ kind: "email", to });
              });
            }}
          >
            <MailIcon size={18} />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
            />
            <button type="submit" disabled={busy || !email.includes("@")}>
              {auth.emailLoading ? "Sending…" : "Submit"}
            </button>
          </form>
        )}
        {settings.methods.phone && (
          <form
            className="demo-method demo-method-input"
            onSubmit={(e) => {
              e.preventDefault();
              const to = phone.replace(/\s+/g, "");
              run(async () => {
                await auth.sendPhoneCode(to);
                setStep({ kind: "phone", to });
              });
            }}
          >
            <PhoneIcon size={18} />
            <input
              type="tel"
              placeholder="+234 801 234 5678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-label="Phone number"
            />
            <button
              type="submit"
              disabled={busy || phone.replace(/\D/g, "").length < 8}
            >
              {auth.phoneLoading ? "Sending…" : "Submit"}
            </button>
          </form>
        )}
        {settings.methods.x && (
          <button
            type="button"
            className="demo-method"
            disabled={busy}
            onClick={() => run(auth.signInWithX)}
          >
            <XLogo size={16} />
            <span>{auth.xLoading ? "Opening X…" : "X"}</span>
          </button>
        )}
        {settings.methods.kingschat && (
          <button
            type="button"
            className="demo-method"
            disabled={busy}
            onClick={() => run(auth.signInWithKingsChat)}
          >
            <ChatIcon size={18} />
            <span>
              {auth.kingschatLoading ? "Opening KingsChat…" : "KingsChat"}
            </span>
          </button>
        )}
      </div>
      {creating && (
        <p className="demo-login-sub">Creating your wallet in the enclave…</p>
      )}
      {(err || auth.error) && <p className="demo-error">{err ?? auth.error}</p>}
      {settings.mode === "all" && <InstalledWallets />}
      <button
        type="button"
        className="demo-link"
        onClick={() =>
          settings.mode === "all" ? selector.open() : wallet.openModal()
        }
      >
        Or open the SDK&rsquo;s built-in modal
      </button>
      <p className="demo-protected">
        Protected by <DecaneLogo size={14} /> decane
      </p>
    </div>
  );
}

// ─── Signed-in developer panel ───────────────────────────────────────────────

function short(addr: string) {
  return addr.length > 16 ? `${addr.slice(0, 8)}…${addr.slice(-6)}` : addr;
}

function decodeJwt(token: string | null): Record<string, unknown> | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    const json = atob(
      part
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(Math.ceil(part.length / 4) * 4, "="),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function Tool({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <div className="demo-tool">
      <div className="demo-tool-head">
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      {children}
    </div>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="demo-result">
      <div className="demo-result-head">
        <span>{label}</span>
        <CopyButton value={value} label={label} />
      </div>
      <code>{value}</code>
    </div>
  );
}

function WalletPanel({ settings }: { settings: DemoSettings }) {
  const w = useSocialWallet();
  const { profile } = useSocialAuth();
  const enabled = CHAINS.filter((c) => settings.chains[c.id]);
  const [signChain, setSignChain] = useState<ChainId>(
    enabled[0]?.id ?? "evm:8453",
  );
  const [message, setMessage] = useState("Hello from the Decane demo");
  const [sig, setSig] = useState<string | null>(null);
  const [typedSig, setTypedSig] = useState<string | null>(null);
  const [balances, setBalances] = useState<Array<{
    chain: string;
    text: string;
  }> | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const addresses = (w.addresses ?? {}) as {
    evm?: string;
    solana?: string;
    tron?: string;
  };
  const addressFor = (kind: string) =>
    kind === "evm"
      ? addresses.evm
      : kind === "solana"
        ? addresses.solana
        : addresses.tron;
  const evmChain = enabled.find((c) => c.kind === "evm");
  const claims = useMemo(() => decodeJwt(w.getAccessToken()), [w]);
  const who = profile?.email ?? profile?.name ?? "Signed in";

  async function act(key: string, fn: () => Promise<void>) {
    setBusy(key);
    setErr(null);
    try {
      await fn();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="demo-panel">
      <div className="demo-wallet">
        <div className="demo-wallet-head">
          <span className="avatar">{who.slice(0, 1).toUpperCase()}</span>
          <div>
            <b>{who}</b>
            <small>
              {w.isNewUser ? "Wallet just created" : "Wallet opened"}
            </small>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => w.disconnect()}
          >
            Log out
          </button>
        </div>
        <ul className="demo-addresses">
          {enabled.map((c) => {
            const a = addressFor(c.kind);
            return (
              <li key={c.id}>
                <ChainTypeIcon type={c.logo} size={20} />
                <span className="name">{c.label}</span>
                <code title={a ?? ""}>{a ? short(a) : "—"}</code>
                {a && <CopyButton value={a} label={`${c.label} address`} />}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="demo-tools">
        <Tool
          title="Sign a message"
          desc="The key is rebuilt inside the enclave for this one signature, then discarded."
        >
          <div className="pills demo-chain-pills" role="tablist">
            {enabled.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={signChain === c.id}
                className={`pill${signChain === c.id ? " active" : ""}`}
                onClick={() => {
                  setSignChain(c.id);
                  setSig(null);
                }}
              >
                <ChainTypeIcon type={c.logo} size={14} />
                {c.label}
              </button>
            ))}
          </div>
          <textarea
            className="demo-field"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-label="Message"
          />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={!!busy || !message.trim()}
            onClick={() =>
              act("sign", async () =>
                setSig(await w.signMessage(signChain, message)),
              )
            }
          >
            {busy === "sign" ? "Signing…" : "Sign message"}
          </button>
          {sig && <Result label="Signature" value={sig} />}
        </Tool>

        {evmChain && (
          <Tool
            title="Sign typed data"
            desc="An EIP-712 permit-style message, as a dApp would ask for."
          >
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={!!busy}
              onClick={() =>
                act("typed", async () => {
                  const chainId = Number(evmChain.id.split(":")[1]);
                  setTypedSig(
                    await w.signTypedData({
                      chain: evmChain.id,
                      domain: { name: "Decane Demo", version: "1", chainId },
                      types: {
                        Greeting: [
                          { name: "from", type: "address" },
                          { name: "contents", type: "string" },
                        ],
                      },
                      primaryType: "Greeting",
                      message: {
                        from:
                          addresses.evm ??
                          "0x0000000000000000000000000000000000000000",
                        contents: "Hello from the Decane demo",
                      },
                    }),
                  );
                })
              }
            >
              {busy === "typed" ? "Signing…" : `Sign on ${evmChain.label}`}
            </button>
            {typedSig && <Result label="EIP-712 signature" value={typedSig} />}
          </Tool>
        )}

        <Tool
          title="Balances"
          desc="Read from each chain's public RPC. A fresh wallet reads zero."
        >
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={!!busy}
            onClick={() =>
              act("bal", async () => {
                const rows = await w.getBalances();
                setBalances(
                  rows.map((r) => ({
                    chain: r.chain,
                    text: r.balance
                      ? `${r.balance.formatted} ${r.balance.symbol}`
                      : "unavailable",
                  })),
                );
              })
            }
          >
            {busy === "bal" ? "Reading…" : "Check balances"}
          </button>
          {balances && (
            <ul className="demo-balances">
              {balances.map((b) => (
                <li key={b.chain}>
                  <code>{b.chain}</code>
                  <span>{b.text}</span>
                </li>
              ))}
            </ul>
          )}
        </Tool>

        <Tool
          title="Access token"
          desc="What your backend receives. Verify it with a server SDK."
        >
          {claims ? (
            <dl className="demo-claims">
              <div>
                <dt>uid</dt>
                <dd>
                  <code>{String(claims.uid ?? "")}</code>
                </dd>
              </div>
              <div>
                <dt>project_id</dt>
                <dd>
                  <code>{String(claims.project_id ?? "")}</code>
                </dd>
              </div>
              <div>
                <dt>expires</dt>
                <dd>
                  {typeof claims.exp === "number"
                    ? new Date(claims.exp * 1000).toLocaleString()
                    : "—"}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="demo-hint">No token in memory.</p>
          )}
          {w.getAccessToken() && (
            <CopyTokenButton token={w.getAccessToken()!} />
          )}
        </Tool>
      </div>
      {err && <p className="demo-error">{err}</p>}
    </div>
  );
}

// Accounts granted by an installed wallet, flattened from the CAIP-25 scopes.
function grantedAccounts(
  scopes: Partial<Record<string, { accounts: string[] }>> | undefined,
) {
  const out: Array<{ chain: string; address: string }> = [];
  for (const [chain, scope] of Object.entries(scopes ?? {})) {
    for (const acct of scope?.accounts ?? []) {
      const address = acct.split(":").slice(2).join(":");
      if (
        address &&
        !out.some((o) => o.chain === chain && o.address === address)
      )
        out.push({ chain, address });
    }
  }
  return out;
}

function chainName(caip2: string) {
  const [ns, ref] = caip2.split(":");
  if (ns === "eip155")
    return (
      (
        {
          "1": "Ethereum",
          "8453": "Base",
          "10": "Optimism",
          "137": "Polygon",
          "42161": "Arbitrum",
          "56": "BNB Chain",
          "11155111": "Sepolia",
        } as Record<string, string>
      )[ref] ?? `EVM chain ${ref}`
    );
  if (ns === "solana") return "Solana";
  if (ns === "tron") return "Tron";
  if (ns === "bip122" || ns === "bitcoin") return "Bitcoin";
  return caip2;
}

function chainLogo(caip2: string): "evm" | "solana" | "tron" {
  const ns = caip2.split(":")[0];
  return ns === "solana" ? "solana" : ns === "tron" ? "tron" : "evm";
}

function ExternalWalletPanel() {
  const d = useDecane();
  const { signMessage, loading } = useSignMessage();
  const [message, setMessage] = useState("Hello from the Decane demo");
  const [sig, setSig] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const accounts = grantedAccounts(d.activeSession?.grantedScopes);
  const wl = d.connectedWallet;

  return (
    <div className="demo-panel">
      <div className="demo-wallet">
        <div className="demo-wallet-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {wl?.icon ? (
            <img
              src={wl.icon}
              alt=""
              width={36}
              height={36}
              className="demo-wallet-icon lg"
            />
          ) : (
            <span className="avatar">W</span>
          )}
          <div>
            <b>{wl?.name ?? "Wallet"}</b>
            <small>Connected with an installed wallet</small>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => d.disconnect()}
          >
            Disconnect
          </button>
        </div>
        <ul className="demo-addresses">
          {accounts.length ? (
            accounts.map((a) => (
              <li key={`${a.chain}:${a.address}`}>
                <ChainTypeIcon type={chainLogo(a.chain)} size={20} />
                <span className="name">{chainName(a.chain)}</span>
                <code title={a.address}>{short(a.address)}</code>
                <CopyButton
                  value={a.address}
                  label={`${chainName(a.chain)} address`}
                />
              </li>
            ))
          ) : (
            <li>
              <span className="name">No accounts shared yet</span>
            </li>
          )}
        </ul>
      </div>

      <div className="demo-tools">
        <Tool
          title="Sign a message"
          desc={`Your wallet asks you to approve it${d.activeChain ? ` on ${chainName(d.activeChain)}` : ""}. Nothing touches Decane's servers.`}
        >
          <textarea
            className="demo-field"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-label="Message"
          />
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={loading || !message.trim()}
            onClick={async () => {
              setErr(null);
              try {
                setSig(await signMessage(message));
              } catch (e) {
                setErr(e instanceof Error ? e.message : String(e));
              }
            }}
          >
            {loading ? "Waiting for your wallet…" : "Sign message"}
          </button>
          {sig && <Result label="Signature" value={sig} />}
        </Tool>
      </div>
      {err && <p className="demo-error">{err}</p>}
    </div>
  );
}

function CopyTokenButton({ token }: { token: string }) {
  const [done, copy] = useCopy();
  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      onClick={() => copy(token)}
    >
      {done ? "Copied" : "Copy JWT"}
    </button>
  );
}

// ─── Side cards ──────────────────────────────────────────────────────────────

function SideCards({
  settings,
  theme,
  signedIn,
}: {
  settings: DemoSettings;
  theme: Theme;
  signedIn: boolean;
}) {
  const [done, copy] = useCopy();
  const [show, setShow] = useState(false);
  const code = snippet(settings, theme);
  return (
    <div className="demo-side">
      <div className="demo-side-card accent">
        <h3>Explore Decane</h3>
        <p>
          Wallets behind the sign-in your users already have. The key only ever
          comes together inside an attested enclave.
        </p>
        <p>
          {signedIn
            ? "The developer tools are open: try signing on each chain."
            : "Sign in to open the developer tools."}
        </p>
        <Link href="/docs" className="btn btn-secondary btn-sm">
          Read the docs
        </Link>
      </div>
      <div className="demo-side-card">
        <h3>Export this configuration</h3>
        <p>
          The settings on the left, as the <code>&lt;DecaneKit&gt;</code> config
          for your app.
        </p>
        <div className="demo-side-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => copy(code)}
          >
            {done ? (
              <>
                <CheckIcon size={14} />
                Copied
              </>
            ) : (
              <>
                <CopyIcon size={14} />
                Copy to clipboard
              </>
            )}
          </button>
          <button
            type="button"
            className="demo-link"
            onClick={() => setShow((v) => !v)}
          >
            {show ? "Hide" : "Preview"}
          </button>
        </div>
        {show && (
          <pre className="demo-snippet">
            <code>{code}</code>
          </pre>
        )}
      </div>
      <div className="demo-side-card warn" role="note">
        <h3>Demo only</h3>
        <p>
          <strong>Do not send real funds to these addresses.</strong> They are
          real wallets on real networks, but this is a public demo project that
          may be reset, and anything sent here may be lost for good.
        </p>
      </div>
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

function Canvas({ settings, theme }: { settings: DemoSettings; theme: Theme }) {
  const w = useSocialWallet();
  const d = useDecane();
  const socialIn = w.isConnected && !!w.addresses;
  const externalIn = settings.mode === "all" && d.isConnected;
  const signedIn = socialIn || externalIn;
  return (
    <main className="demo-canvas">
      <div className={`demo-stage${signedIn ? " wide" : ""}`}>
        {socialIn ? (
          <WalletPanel settings={settings} />
        ) : externalIn ? (
          <ExternalWalletPanel />
        ) : (
          <LoginCard settings={settings} />
        )}
      </div>
      <SideCards settings={settings} theme={theme} signedIn={signedIn} />
    </main>
  );
}

type Pane = "customize" | "preview";
const PANE_STORE = "decane-demo-pane";

export function DemoApp({
  theme,
  onToggleTheme,
}: {
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const [settings, setSettingsState] = useState<DemoSettings>(DEFAULT_SETTINGS);
  useEffect(() => {
    setSettingsState(loadSettings());
  }, []);
  function setSettings(s: DemoSettings) {
    setSettingsState(s);
    try {
      localStorage.setItem(STORE, JSON.stringify(s));
    } catch {
      /* not persisted; fine */
    }
  }

  // Phones show one pane at a time: the settings, then the preview behind a
  // "Launch" button, with a back button to return. Wider screens show both
  // side by side and ignore this.
  const [pane, setPaneState] = useState<Pane>("customize");
  const setPane = useCallback((p: Pane) => {
    setPaneState(p);
    try {
      sessionStorage.setItem(PANE_STORE, p);
    } catch {
      /* not persisted; fine */
    }
    window.scrollTo({ top: 0 });
  }, []);
  useEffect(() => {
    // A Google or X sign-in leaves the page and comes back: return the
    // visitor to the preview they left from, not to the settings.
    try {
      if (sessionStorage.getItem(PANE_STORE) === "preview")
        setPaneState("preview");
    } catch {
      /* default */
    }
  }, []);

  const authMethods = METHODS.filter((m) => settings.methods[m.id]).map(
    (m) => m.id,
  );
  const chains = CHAINS.filter((c) => settings.chains[c.id]).map((c) => c.id);

  return (
    <div className={`demo-layout on-${pane}`}>
      <ConfigPanel
        settings={settings}
        setSettings={setSettings}
        theme={theme}
        onToggleTheme={onToggleTheme}
        onLaunch={() => setPane("preview")}
      />
      <div className="demo-back">
        <button type="button" onClick={() => setPane("customize")}>
          <ArrowLeftIcon size={18} />
          Customize
        </button>
      </div>
      <DecaneKit
        // A new mode, set of methods or chains is a new SDK config; remounting applies
        // it. The session survives in storage, so a signed-in visitor stays in.
        key={`${settings.mode}|${authMethods.join(",")}|${chains.join(",")}`}
        config={{
          appId: DEMO_APP_ID,
          mode: settings.mode,
          theme,
          social: {
            apiKey: DEMO_API_KEY,
            authMethods,
            chains,
            protection: "identity",
          },
        }}
      >
        <Canvas settings={settings} theme={theme} />
      </DecaneKit>
    </div>
  );
}
