"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BrandLogo } from "./BrandLogo";
import { CheckIcon, CopyIcon } from "./Icons";
import { hl, type Lang } from "@/app/docs/components/highlight";
import { VERSIONS } from "@/lib/versions";

// One entry per published package. Adding a language is adding an entry here
// (and its logo in logoSvgs.ts); the rail, the install line and the sample all
// follow. Samples are taken from each SDK's quick start in the docs.
type Pkg = {
  id: string;
  kind: "app" | "server";
  label: string;
  logo: string;
  name: string;
  registry: string;
  version: string;
  install: string;
  file: string;
  lang: Lang;
  docs: string;
  code: string;
};

const PACKAGES: Pkg[] = [
  {
    id: "web",
    kind: "app",
    label: "Web",
    logo: "react",
    name: "decane-connect-kit",
    registry: "npm",
    version: VERSIONS.web,
    install: "npm install decane-connect-kit",
    file: "App.tsx",
    lang: "ts",
    docs: "/docs",
    code: `import { DecaneKit, useSocialAuth } from "decane-connect-kit";

function App() {
  return (
    <DecaneKit config={{
      mode: "social",
      social: { apiKey: "dck_live_...", authMethods: ["google", "email"] },
    }}>
      <SignInButton />
    </DecaneKit>
  );
}

function SignInButton() {
  const { isConnected, addresses, signInWithGoogle } = useSocialAuth();
  if (isConnected) return <div>Signed in: {addresses?.evm}</div>;
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}`,
  },
  {
    id: "expo",
    kind: "app",
    label: "React Native",
    logo: "react",
    name: "decane-connect-kit-expo",
    registry: "npm",
    version: VERSIONS.expo,
    install: "npx expo install decane-connect-kit-expo",
    file: "wallet.ts",
    lang: "ts",
    docs: "/docs/react-native",
    code: `import { createDecaneConnect } from "decane-connect-kit-expo";

const decane = await createDecaneConnect({
  appId:       "proj_...",
  apiKey:      "dck_live_...",
  chains:      ["evm:8453", "solana:mainnet"],
  authMethods: ["email"],
});

await decane.connectWithEmail("user@example.com");
await decane.verifyEmailCode("user@example.com", "123456");

const { evm, solana, tron } = decane.getAddresses()!;
await decane.sendTransaction({ chain: "evm:8453", to: "0x...", value: 10_000n });`,
  },
  {
    id: "swift",
    kind: "app",
    label: "Swift",
    logo: "swift",
    name: "DecaneKit",
    registry: "Swift PM",
    version: VERSIONS.swift,
    install: `.package(url: "https://github.com/Korex23/decane-swift", from: "${VERSIONS.swift}")`,
    file: "Wallet.swift",
    lang: "swift",
    docs: "/swift-docs",
    code: `import DecaneKit

let wallet = try DecaneWallet(config: DecaneConfig(
    appId: "proj_…",
    apiKey: "dck_live_…",
    chains: ["evm:8453", "solana:mainnet", "tron:mainnet"],
    protection: .identity
))

try await wallet.connectWithEmail("user@example.com")
let result = try await wallet.verifyEmailCode(email: "user@example.com", code: "123456")
result.addresses.evm      // the same addresses the web SDK shows

let signature = try await wallet.signMessage(chain: "evm:8453", text: "Hello")`,
  },
  {
    id: "kotlin",
    kind: "app",
    label: "Kotlin",
    logo: "kotlin",
    name: "decane-kit",
    registry: "Maven",
    version: VERSIONS.kotlin,
    install: `implementation("app.decane:decane-kit:${VERSIONS.kotlin}")`,
    file: "Wallet.kt",
    lang: "kotlin",
    docs: "/kotlin-docs",
    code: `val wallet = DecaneWallet.create(
    context,
    DecaneConfig(
        appId = "proj_…",
        apiKey = "dck_live_…",
        chains = listOf("evm:8453", "solana:mainnet", "tron:mainnet"),
        protection = Protection.IDENTITY,
    ),
)

lifecycleScope.launch {
    wallet.connectWithEmail("ada@example.com")
    val result = wallet.verifyEmailCode("ada@example.com", "123456")
    result.addresses.evm      // the same addresses the web SDK shows

    val signature = wallet.signMessage("evm:8453", "hello")
}`,
  },
  {
    id: "node",
    kind: "server",
    label: "Node",
    logo: "nodejs",
    name: "decane-node",
    registry: "npm",
    version: VERSIONS.node,
    install: "npm install decane-node",
    file: "server.ts",
    lang: "ts",
    docs: "/node-docs",
    code: `import { DecaneClient } from "decane-node";

const decane = new DecaneClient({ appId: process.env.DECANE_APP_ID });

// The client sends its Decane token as a bearer token.
const claims = await decane.verifyAccessToken(token);
claims.userId; // stable Decane user id: key your records off this

const user = await decane.getUser(token); // { id, addresses, linkedAccounts }`,
  },
  {
    id: "python",
    kind: "server",
    label: "Python",
    logo: "python",
    name: "decane",
    registry: "PyPI",
    version: VERSIONS.python,
    install: "pip install decane",
    file: "app.py",
    lang: "python",
    docs: "/python-docs",
    code: `import os
from decane import DecaneAuthError, DecaneClient

decane = DecaneClient(
    app_id=os.environ["DECANE_APP_ID"],
    verification_key=os.environ["DECANE_VERIFICATION_KEY"],  # ES256 SPKI PEM
)

token = request.headers.get("Authorization", "").removeprefix("Bearer ")
try:
    claims = decane.verify_access_token(token)
except DecaneAuthError:
    ...  # answer 401

user = decane.get_user(token)
user.addresses.evm      # "0x…" or None`,
  },
  {
    id: "rust",
    kind: "server",
    label: "Rust",
    logo: "rust",
    name: "decane",
    registry: "crates.io",
    version: VERSIONS.rust,
    install: "cargo add decane",
    file: "main.rs",
    lang: "rust",
    docs: "/rust-docs",
    code: `use decane::DecaneClient;

let decane = DecaneClient::builder()
    .app_id(std::env::var("DECANE_APP_ID")?)
    .verification_key(std::env::var("DECANE_VERIFICATION_KEY")?) // ES256 SPKI PEM
    .build()?;

let token = authorization.strip_prefix("Bearer ").unwrap_or("");
let claims = decane.verify_access_token(token).await?;
claims.user_id; // stable Decane user id: key your records off this

let user = decane.get_user(token).await?;
user.addresses.evm; // Option<String>, "0x…"`,
  },
];

const GROUPS: Array<{ kind: Pkg["kind"]; title: string }> = [
  { kind: "app", title: "Your app" },
  { kind: "server", title: "Your backend" },
];

function useCopy(): [boolean, (text: string) => void] {
  const [done, setDone] = useState(false);
  return [
    done,
    (text) => {
      navigator.clipboard?.writeText(text).then(() => {
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      });
    },
  ];
}

export function Integrations() {
  const [id, setId] = useState(PACKAGES[0].id);
  const pkg = PACKAGES.find((p) => p.id === id) ?? PACKAGES[0];
  const [installCopied, copyInstall] = useCopy();
  const [codeCopied, copyCode] = useCopy();

  return (
    <div className="kit">
      <nav className="kit-rail" aria-label="Packages">
        {GROUPS.map((g) => (
          <div key={g.kind} className="kit-group">
            <div className="kit-group-title">{g.title}</div>
            <div
              className="kit-group-items"
              role="tablist"
              aria-label={g.title}
            >
              {PACKAGES.filter((p) => p.kind === g.kind).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={p.id === id}
                  aria-controls="kit-pane"
                  className={`kit-item${p.id === id ? " active" : ""}`}
                  onClick={(e) => {
                    setId(p.id);
                    // On phones the rail is a scrolling row: keep the
                    // chosen chip on screen.
                    e.currentTarget.scrollIntoView({
                      block: "nearest",
                      inline: "nearest",
                      behavior: "smooth",
                    });
                  }}
                >
                  <BrandLogo name={p.logo} size={18} />
                  <span className="kit-item-label">{p.label}</span>
                  <span className="kit-item-ver">{p.version}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="kit-pane" id="kit-pane" role="tabpanel">
        <div className="kit-pane-head">
          <div className="kit-pane-title">
            <BrandLogo name={pkg.logo} size={22} />
            <div>
              <b>{pkg.name}</b>
              <small>
                {pkg.registry} · {pkg.version}
              </small>
            </div>
          </div>
          <Link href={pkg.docs} className="kit-docs-link">
            {pkg.label} docs
          </Link>
        </div>

        <div className="kit-install">
          <span className="kit-prompt" aria-hidden>
            {pkg.lang === "swift" || pkg.lang === "kotlin" ? "+" : "$"}
          </span>
          <code>{pkg.install}</code>
          <button
            type="button"
            className={`copy-btn${installCopied ? " done" : ""}`}
            onClick={() => copyInstall(pkg.install)}
            aria-label={installCopied ? "Copied" : "Copy install command"}
          >
            {installCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
          </button>
        </div>

        <div className="kit-code">
          <div className="kit-code-head">
            <span className="file">{pkg.file}</span>
            <button
              type="button"
              className={`copy-btn${codeCopied ? " done" : ""}`}
              onClick={() => copyCode(pkg.code)}
              aria-label={codeCopied ? "Copied" : "Copy code"}
            >
              {codeCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            </button>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.pre
              key={pkg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <code>{hl(pkg.code, pkg.lang)}</code>
            </motion.pre>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
