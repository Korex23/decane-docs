# decane-connect-kit — Documentation

**Version:** 0.0.1 · **License:** MIT · **React:** 18+

A browser-side wallet connection SDK for EVM and Solana dApps. Detects wallets via EIP-6963 and the Solana Wallet Standard, manages sessions with CAIP-25, and ships a polished wallet selector UI. No backend, no server, no database.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Installation](#2-installation)
3. [Quick Start](#3-quick-start)
4. [Framework Integration](#4-framework-integration)
   - [Next.js App Router](#41-nextjs-app-router)
   - [Next.js Pages Router](#42-nextjs-pages-router)
   - [Vite](#43-vite)
   - [Create React App](#44-create-react-app)
5. [Core Concepts](#5-core-concepts)
6. [Provider Setup](#6-provider-setup)
7. [Hooks Reference](#7-hooks-reference)
   - [useDecane](#71-usedecane)
   - [useWalletSelector](#72-usewalletselector)
   - [useSignMessage](#73-usesignmessage)
   - [useSendTransaction](#74-usesendtransaction)
   - [useSignTypedData](#75-usesigntypeddata)
   - [useChainSwitch](#76-usechainswitch)
8. [Chain Reference](#8-chain-reference)
   - [CHAINS constants](#81-chains-constants)
   - [Built-in chain list](#82-built-in-chain-list)
9. [Custom Chains](#9-custom-chains)
10. [Error Handling](#10-error-handling)
11. [TypeScript](#11-typescript)
12. [Theming](#12-theming)
13. [Security Model](#13-security-model)
14. [FAQ](#14-faq)
15. [Changelog](#15-changelog)

---

## 1. Overview

### What it does

- Detects installed EVM wallets via **EIP-6963** (MetaMask, Rabby, Coinbase Wallet, and any wallet that implements the standard)
- Detects installed Solana wallets via the **Solana Wallet Standard** (Phantom, Backpack, Solflare, etc.)
- Merges multi-chain wallets (Phantom, Backpack) into a single entry so users see one row per wallet, not one per chain
- Classifies every wallet as EVM-only, Solana-only, or multi-chain
- Opens and manages **CAIP-25 sessions** — the standard protocol for requesting and revoking wallet permissions
- Supports **custom EVM chains** — add any local node, private L2, or testnet at runtime
- Ships 58 built-in chains out of the box, covering every major EVM network and Solana

### What it does not do

- No social sign-in / email login
- No backend, server, or API calls
- No `window.ethereum` — detection uses EIP-6963 exclusively
- No private key or seed phrase management
- No state management library (Redux, Zustand) — pure React context

### Key standards

| Standard | What it's used for |
|---|---|
| EIP-6963 | EVM wallet discovery (replaces `window.ethereum`) |
| EIP-1193 | Underlying EVM provider interface |
| EIP-712 | Typed data signing |
| EIP-3085 | Registering custom chains in the wallet |
| Solana Wallet Standard | Solana wallet discovery and interaction |
| CAIP-2 | Chain identifiers (`eip155:1`, `solana:mainnet`) |
| CAIP-10 | Account identifiers (`eip155:1:0xAbc...`) |
| CAIP-25 | Session request / permission management |

---

## 2. Installation

```bash
npm install decane-connect-kit
# or
yarn add decane-connect-kit
# or
pnpm add decane-connect-kit
```

React 18 or later is required as a peer dependency. It must already be installed in your project.

```bash
npm install react@^18 react-dom@^18
```

---

## 3. Quick Start

### Step 1 — Wrap your app

```tsx
// main.tsx / _app.tsx / layout.tsx
import { DecaneKit } from "decane-connect-kit";

export default function App({ children }) {
  return (
    <DecaneKit config={{ theme: "auto" }}>
      {children}
    </DecaneKit>
  );
}
```

Wallet discovery starts immediately on mount. If the user was previously connected, the session is restored from `localStorage` automatically.

### Step 2 — Add a connect button

```tsx
import { useDecane, useWalletSelector } from "decane-connect-kit";

function ConnectButton() {
  const { isConnected, connectedWallet, disconnect } = useDecane();
  const { open } = useWalletSelector();

  if (isConnected) {
    return (
      <>
        <span>{connectedWallet!.name}</span>
        <button onClick={disconnect}>Disconnect</button>
      </>
    );
  }

  return <button onClick={open}>Connect Wallet</button>;
}
```

The modal renders itself — there is no `<WalletSelector>` component to place anywhere in your JSX.

### Step 3 — Sign a message

```tsx
import { useSignMessage } from "decane-connect-kit";

function SignMessage() {
  const { signMessage, signature, loading, error } = useSignMessage();

  return (
    <>
      <button onClick={() => signMessage("Hello world")} disabled={loading}>
        {loading ? "Signing…" : "Sign"}
      </button>
      {signature && <p>Signature: {signature}</p>}
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </>
  );
}
```

Chain and account are resolved automatically from the active session. Pass `options.chainId` to target a specific chain explicitly.

---

## 4. Framework Integration

### 4.1 Next.js App Router

Client components are required for all hooks. Wrap `DecaneKit` in a `"use client"` component so the server layout remains a server component.

```tsx
// src/components/Providers.tsx
"use client";

import { DecaneKit } from "decane-connect-kit";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <DecaneKit config={{ theme: "auto" }}>
      {children}
    </DecaneKit>
  );
}
```

```tsx
// src/app/layout.tsx
import { Providers } from "@/components/Providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

Add `"use client"` to every component that calls a decane hook directly.

Add `transpilePackages` to `next.config.ts`:

```ts
// next.config.ts
const nextConfig = {
  transpilePackages: ["decane-connect-kit"],
};

export default nextConfig;
```

### 4.2 Next.js Pages Router

```tsx
// pages/_app.tsx
import { DecaneKit } from "decane-connect-kit";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DecaneKit config={{ theme: "auto" }}>
      <Component {...pageProps} />
    </DecaneKit>
  );
}
```

Add `transpilePackages` to `next.config.ts` as shown above.

### 4.3 Vite

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DecaneKit } from "decane-connect-kit";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DecaneKit config={{ theme: "auto" }}>
      <App />
    </DecaneKit>
  </StrictMode>
);
```

No extra config needed.

### 4.4 Create React App

```tsx
// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { DecaneKit } from "decane-connect-kit";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <DecaneKit config={{ theme: "auto" }}>
      <App />
    </DecaneKit>
  </React.StrictMode>
);
```

---

## 5. Core Concepts

### Wallet detection

The SDK listens for the `eip6963:announceProvider` window event to discover EVM wallets, and subscribes to the Wallet Standard registry for Solana wallets. Both happen automatically when `<DecaneKit>` mounts — your app code never needs to interact with discovery directly.

Multi-chain wallets (e.g. Phantom, which supports both EVM and Solana) are merged into a single registry entry. The merge key is the wallet's reverse-DNS identifier (`rdns`), falling back to normalised name comparison. The result is one row per wallet in the selector UI.

### Sessions (CAIP-25)

A **session** is a permission grant from the wallet. It specifies:

- Which chains the dApp has access to
- Which methods are allowed (`wallet_signMessage`, `wallet_sendTransaction`, etc.)
- Which accounts are in scope

Sessions are opened when the user selects a wallet from the modal. The SDK calls `wallet_requestPermissions` under the hood and stores the result. All subsequent signing and transaction calls are validated against the active session before being forwarded to the wallet.

At most one session is active at a time. Connecting a new wallet revokes the previous session first.

### Chain IDs (CAIP-2)

All chain identifiers in this SDK use **CAIP-2 format**:

- EVM chains: `eip155:<chainId>` — e.g. `eip155:1` for Ethereum mainnet
- Solana: `solana:mainnet`, `solana:devnet`

Use the `CHAINS` constant object instead of raw strings to get autocomplete and catch typos at compile time.

### Account IDs (CAIP-10)

Accounts in session scopes are represented in **CAIP-10 format**:

```
eip155:1:0xAbC1234...
solana:mainnet:BxY3abc...
```

The SDK handles this format internally. You only deal with plain addresses in your application code.

---

## 6. Provider Setup

### `<DecaneKit>` component

Wrap your entire application with this component. It initialises the SDK, starts wallet discovery, and provides React context to all hooks.

```tsx
import { DecaneKit } from "decane-connect-kit";
import type { DecaneConfig } from "decane-connect-kit";

const config: DecaneConfig = {
  theme: "auto",
  networks: "all",
  defaultChain: "eip155:1",
  supportedChainIds: ["eip155:1", "eip155:8453", "solana:mainnet"],
  chains: [
    {
      id: "eip155:31337",
      type: "evm",
      chainId: 31337,
      name: "Hardhat Local",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrl: "http://localhost:8545",
      isCustom: true,
    },
  ],
};

<DecaneKit config={config}>
  <App />
</DecaneKit>
```

### Config options

All options are optional.

| Option | Type | Default | Description |
|---|---|---|---|
| `theme` | `"light" \| "dark" \| "auto"` | `"auto"` | UI theme. `"auto"` follows system preference. |
| `networks` | `"evm" \| "solana" \| "all"` | `"all"` | Which wallet types to show. `"evm"` hides Solana wallets; `"solana"` hides EVM wallets. |
| `defaultChain` | `string` | — | CAIP-2 chain ID to request first when connecting a multi-chain wallet. |
| `supportedChainIds` | `string[]` | all built-in | Restricts which chains appear in the selector and are available for sessions. Custom chains registered via `chains` are always included regardless of this filter. |
| `chains` | `ChainDescriptor[]` | `[]` | Custom chains to register at startup. Added on top of the 58 built-in chains. |

#### `networks` examples

```tsx
// EVM-only dApp — Solana wallets hidden, no chain picker for EVM-only wallets
<DecaneKit config={{ networks: "evm" }}>

// Solana-only dApp
<DecaneKit config={{ networks: "solana" }}>

// Both EVM and Solana (default)
<DecaneKit config={{ networks: "all" }}>
```

#### `supportedChainIds` example

```tsx
import { CHAINS } from "decane-connect-kit";

<DecaneKit config={{
  supportedChainIds: [CHAINS.ETHEREUM, CHAINS.BASE, CHAINS.SOLANA],
}}>
```

---

## 7. Hooks Reference

All hooks must be called inside a component that is a descendant of `<DecaneKit>`. They re-render automatically when relevant state changes.

---

### 7.1 `useDecane()`

The main state hook. Returns everything about the current wallet and session state.

```tsx
const {
  // ── Detected wallets ─────────────────────────────────────────────────────
  wallets,            // UnifiedWalletAccount[]   — all detected wallets
  evmWallets,         // UnifiedWalletAccount[]   — EVM-only + multi-chain
  solanaWallets,      // UnifiedWalletAccount[]   — Solana-only + multi-chain
  multiChainWallets,  // UnifiedWalletAccount[]   — wallets supporting both

  // ── Connection state ──────────────────────────────────────────────────────
  isConnected,        // boolean
  connectedWallet,    // UnifiedWalletAccount | null
  activeSession,      // ActiveSession | null
  activeChain,        // string | null — CAIP-2 chain ID of active chain

  // ── Chain registry ────────────────────────────────────────────────────────
  chains,             // ChainDescriptor[] — all registered chains

  // ── Theme ─────────────────────────────────────────────────────────────────
  theme,              // Theme — "light" | "dark" | "auto"
  setTheme,           // (t: Theme) => void

  // ── Actions ───────────────────────────────────────────────────────────────
  connect,            // (wallet: UnifiedWalletAccount, preference?: ChainType) => Promise<void>
  disconnect,         // () => Promise<void>
  addChain,           // (chain: ChainDescriptor) => void
  removeChain,        // (chainId: string) => void
} = useDecane();
```

#### Example — disconnect button

```tsx
function Header() {
  const { isConnected, connectedWallet, activeChain, disconnect } = useDecane();

  if (!isConnected) return null;

  return (
    <div>
      <span>{connectedWallet!.name}</span>
      <span>{activeChain}</span>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
```

---

### 7.2 `useWalletSelector()`

Controls the wallet picker modal.

```tsx
const {
  isOpen,  // boolean — whether the modal is currently open
  open,    // () => void — open the modal
  close,   // () => void — close the modal
} = useWalletSelector();
```

#### Example

```tsx
function ConnectButton() {
  const { isConnected } = useDecane();
  const { open } = useWalletSelector();

  if (isConnected) return null;

  return <button onClick={open}>Connect Wallet</button>;
}
```

---

### 7.3 `useSignMessage()`

Sign an arbitrary message with the connected wallet.

```tsx
const {
  signMessage,  // (message: string, options?: SignOptions) => Promise<void>
  signature,    // string | null — hex (EVM) or base58 (Solana)
  loading,      // boolean
  error,        // DecaneError | null
  reset,        // () => void — clear signature and error
} = useSignMessage();
```

#### `SignOptions`

| Option | Type | Description |
|---|---|---|
| `chainId` | `string` | CAIP-2 chain ID to sign on. Defaults to `activeChain`. |
| `account` | `string` | Account address to sign with. Defaults to the first account in the active session scope for the chain. |

#### Example

```tsx
function SignMessage() {
  const { signMessage, signature, loading, error, reset } = useSignMessage();

  return (
    <div>
      <button
        disabled={loading}
        onClick={() => signMessage("Verify wallet ownership")}
      >
        {loading ? "Signing…" : "Sign Message"}
      </button>

      {signature && (
        <p>
          <strong>Signature:</strong>
          <code>{signature}</code>
        </p>
      )}

      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
}
```

#### Sign on a specific chain

```tsx
import { CHAINS } from "decane-connect-kit";

await signMessage("Hello from Polygon", { chainId: CHAINS.POLYGON });
```

---

### 7.4 `useSendTransaction()`

Send a transaction on an EVM chain.

```tsx
const {
  sendTransaction,  // (tx: TxParams, options?: TxOptions) => Promise<void>
  txHash,           // string | null
  loading,          // boolean
  error,            // DecaneError | null
  reset,            // () => void
} = useSendTransaction();
```

#### `TxParams`

| Field | Type | Required | Description |
|---|---|---|---|
| `to` | `string` | Yes | Recipient address |
| `value` | `string` | No | Value in wei as decimal string or hex string |
| `data` | `string` | No | Calldata as hex string |
| `gas` | `string` | No | Gas limit |
| `gasPrice` | `string` | No | Gas price in wei |

#### `TxOptions`

| Option | Type | Description |
|---|---|---|
| `chainId` | `string` | CAIP-2 chain ID. Defaults to `activeChain`. |

#### Example

```tsx
function SendTransaction() {
  const { sendTransaction, txHash, loading, error } = useSendTransaction();

  async function handleSend() {
    await sendTransaction(
      {
        to: "0xRecipientAddress",
        value: "1000000000000000", // 0.001 ETH in wei
        data: "0x",
      },
      { chainId: CHAINS.BASE }
    );
  }

  return (
    <div>
      <button onClick={handleSend} disabled={loading}>
        {loading ? "Sending…" : "Send 0.001 ETH"}
      </button>
      {txHash && <p>Transaction: {txHash}</p>}
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
}
```

---

### 7.5 `useSignTypedData()`

Sign EIP-712 typed data. EVM chains only — throws `DecaneErrorCode.EVM_ONLY_METHOD` on Solana chains.

```tsx
const {
  signTypedData,  // (data: TypedData, options?: SignOptions) => Promise<void>
  signature,      // string | null
  loading,        // boolean
  error,          // DecaneError | null
  reset,          // () => void
} = useSignTypedData();
```

#### `TypedData`

| Field | Type | Description |
|---|---|---|
| `domain` | `object` | EIP-712 domain separator |
| `types` | `object` | Type definitions |
| `message` | `object` | The message to sign |

#### Example

```tsx
function PermitSign() {
  const { signTypedData, signature, loading } = useSignTypedData();

  async function handlePermit() {
    await signTypedData({
      domain: {
        name: "MyToken",
        version: "1",
        chainId: 1,
        verifyingContract: "0xTokenAddress",
      },
      types: {
        Permit: [
          { name: "owner",   type: "address" },
          { name: "spender", type: "address" },
          { name: "value",   type: "uint256" },
          { name: "nonce",   type: "uint256" },
          { name: "deadline",type: "uint256" },
        ],
      },
      message: {
        owner:    "0xOwnerAddress",
        spender:  "0xSpenderAddress",
        value:    "1000000000000000000",
        nonce:    0,
        deadline: 9999999999,
      },
    });
  }

  return (
    <button onClick={handlePermit} disabled={loading}>
      {loading ? "Signing…" : "Sign Permit"}
    </button>
  );
}
```

---

### 7.6 `useChainSwitch()`

Switch the active chain within the current session.

```tsx
const {
  switchChain,    // (chainId: string) => Promise<void>
  activeChain,    // string | null — current active chain (CAIP-2)
  grantedChains,  // string[] — chains granted in the current session
  loading,        // boolean
  error,          // DecaneError | null
} = useChainSwitch();
```

`grantedChains` is the list of chains the wallet has already granted permissions for in the active session. Switching to a chain not in this list will call `wallet_requestPermissions` to extend the session.

#### Example

```tsx
import { CHAINS } from "decane-connect-kit";

function ChainSwitcher() {
  const { switchChain, activeChain, grantedChains, loading } = useChainSwitch();

  return (
    <div>
      <p>Active chain: {activeChain}</p>
      {grantedChains.map((id) => (
        <button
          key={id}
          onClick={() => switchChain(id)}
          disabled={loading || activeChain === id}
        >
          {id}
        </button>
      ))}
    </div>
  );
}
```

---

## 8. Chain Reference

### 8.1 CHAINS constants

Import `CHAINS` to reference chains by name instead of raw CAIP-2 strings. This gives you autocomplete and prevents typos.

```tsx
import { CHAINS, type ChainId } from "decane-connect-kit";

// Use in config
<DecaneKit config={{ defaultChain: CHAINS.BASE }}>

// Use in hooks
await signMessage("Hello", { chainId: CHAINS.POLYGON });
await sendTransaction({ to: "0x…" }, { chainId: CHAINS.ARBITRUM });
await switchChain(CHAINS.OPTIMISM);

// ChainId is the union type of all valid chain ID strings
function myFn(chainId: ChainId) { … }
```

Full list of `CHAINS` keys:

```
ETHEREUM · BASE · ARBITRUM · OPTIMISM · BNB · POLYGON ·
ABSTRACT · ANCIENT8 · ANIMECHAIN · APE_CHAIN · ARBITRUM_NOVA ·
AVALANCHE · B3 · BERACHAIN · BLAST · BOB · BOBA · CELO · CORN ·
CRONOS · CYBER · DEGEN · FLOW_EVM · GNOSIS · GUNZ · HEMI ·
HYPER_EVM · INK · LINEA · LISK · MANTA_PACIFIC · MANTLE ·
MEGA_ETH · METIS · MODE · MONAD · MORPH · PLUME · RARI ·
REDSTONE · RONIN · SCROLL · SEI · SHAPE · SOMNIA · SONEIUM ·
SONIC · STORY · SUPERPOSITION · SUPERSEED · SWELL_CHAIN ·
TAIKO · UNICHAIN · WORLD_CHAIN · ZERO · ZIRCUIT · ZKSYNC_ERA ·
ZORA · LOCALHOST · SOLANA · SOLANA_DEVNET
```

---

### 8.2 Built-in chain list

#### Tier-1 EVM

| Name | CAIP-2 ID | Chain ID | `CHAINS` key |
|---|---|---|---|
| Ethereum | `eip155:1` | 1 | `CHAINS.ETHEREUM` |
| Base | `eip155:8453` | 8453 | `CHAINS.BASE` |
| Arbitrum One | `eip155:42161` | 42161 | `CHAINS.ARBITRUM` |
| Optimism | `eip155:10` | 10 | `CHAINS.OPTIMISM` |
| BNB Chain | `eip155:56` | 56 | `CHAINS.BNB` |
| Polygon | `eip155:137` | 137 | `CHAINS.POLYGON` |

#### Extended EVM

| Name | CAIP-2 ID | Chain ID | `CHAINS` key |
|---|---|---|---|
| Abstract | `eip155:2741` | 2741 | `CHAINS.ABSTRACT` |
| Ancient8 | `eip155:888888888` | 888888888 | `CHAINS.ANCIENT8` |
| Animechain | `eip155:69000` | 69000 | `CHAINS.ANIMECHAIN` |
| ApeChain | `eip155:33139` | 33139 | `CHAINS.APE_CHAIN` |
| Arbitrum Nova | `eip155:42170` | 42170 | `CHAINS.ARBITRUM_NOVA` |
| Avalanche | `eip155:43114` | 43114 | `CHAINS.AVALANCHE` |
| B3 | `eip155:8333` | 8333 | `CHAINS.B3` |
| Berachain | `eip155:80094` | 80094 | `CHAINS.BERACHAIN` |
| Blast | `eip155:81457` | 81457 | `CHAINS.BLAST` |
| BOB | `eip155:60808` | 60808 | `CHAINS.BOB` |
| Boba Network | `eip155:288` | 288 | `CHAINS.BOBA` |
| Celo | `eip155:42220` | 42220 | `CHAINS.CELO` |
| Corn | `eip155:21000000` | 21000000 | `CHAINS.CORN` |
| Cronos | `eip155:25` | 25 | `CHAINS.CRONOS` |
| Cyber | `eip155:7560` | 7560 | `CHAINS.CYBER` |
| Degen | `eip155:666666666` | 666666666 | `CHAINS.DEGEN` |
| Flow EVM | `eip155:747` | 747 | `CHAINS.FLOW_EVM` |
| Gnosis | `eip155:100` | 100 | `CHAINS.GNOSIS` |
| Gunz | `eip155:49321` | 49321 | `CHAINS.GUNZ` |
| Hemi | `eip155:43111` | 43111 | `CHAINS.HEMI` |
| HyperEVM | `eip155:999` | 999 | `CHAINS.HYPER_EVM` |
| Ink | `eip155:57073` | 57073 | `CHAINS.INK` |
| Linea | `eip155:59144` | 59144 | `CHAINS.LINEA` |
| Lisk | `eip155:1135` | 1135 | `CHAINS.LISK` |
| Manta Pacific | `eip155:169` | 169 | `CHAINS.MANTA_PACIFIC` |
| Mantle | `eip155:5000` | 5000 | `CHAINS.MANTLE` |
| MegaETH | `eip155:6342` | 6342 | `CHAINS.MEGA_ETH` |
| Metis | `eip155:1088` | 1088 | `CHAINS.METIS` |
| Mode | `eip155:34443` | 34443 | `CHAINS.MODE` |
| Monad | `eip155:10143` | 10143 | `CHAINS.MONAD` |
| Morph | `eip155:2818` | 2818 | `CHAINS.MORPH` |
| Plume | `eip155:98866` | 98866 | `CHAINS.PLUME` |
| RARI | `eip155:1380012617` | 1380012617 | `CHAINS.RARI` |
| Redstone | `eip155:690` | 690 | `CHAINS.REDSTONE` |
| Ronin | `eip155:2020` | 2020 | `CHAINS.RONIN` |
| Scroll | `eip155:534352` | 534352 | `CHAINS.SCROLL` |
| Sei | `eip155:1329` | 1329 | `CHAINS.SEI` |
| Shape | `eip155:360` | 360 | `CHAINS.SHAPE` |
| Somnia | `eip155:50312` | 50312 | `CHAINS.SOMNIA` |
| Soneium | `eip155:1868` | 1868 | `CHAINS.SONEIUM` |
| Sonic | `eip155:146` | 146 | `CHAINS.SONIC` |
| Story | `eip155:1514` | 1514 | `CHAINS.STORY` |
| Superposition | `eip155:55244` | 55244 | `CHAINS.SUPERPOSITION` |
| Superseed | `eip155:5330` | 5330 | `CHAINS.SUPERSEED` |
| SwellChain | `eip155:1923` | 1923 | `CHAINS.SWELL_CHAIN` |
| Taiko | `eip155:167000` | 167000 | `CHAINS.TAIKO` |
| Unichain | `eip155:130` | 130 | `CHAINS.UNICHAIN` |
| World Chain | `eip155:480` | 480 | `CHAINS.WORLD_CHAIN` |
| ZERO | `eip155:543210` | 543210 | `CHAINS.ZERO` |
| Zircuit | `eip155:48900` | 48900 | `CHAINS.ZIRCUIT` |
| zkSync Era | `eip155:324` | 324 | `CHAINS.ZKSYNC_ERA` |
| Zora | `eip155:7777777` | 7777777 | `CHAINS.ZORA` |

#### Dev / Local

| Name | CAIP-2 ID | Chain ID | `CHAINS` key |
|---|---|---|---|
| Localhost | `eip155:31337` | 31337 | `CHAINS.LOCALHOST` |

#### Solana

| Name | CAIP-2 ID | `CHAINS` key |
|---|---|---|
| Solana | `solana:mainnet` | `CHAINS.SOLANA` |
| Solana Devnet | `solana:devnet` | `CHAINS.SOLANA_DEVNET` |

---

## 9. Custom Chains

Add any EVM chain (local Hardhat node, private L2, testnet) or Solana network at runtime. Custom chains are validated before they are added — malformed descriptors throw `INVALID_CHAIN_CONFIG` immediately.

### Adding a chain at startup

Pass custom chains through `config.chains` on `<DecaneKit>`:

```tsx
<DecaneKit config={{
  chains: [
    {
      id: "eip155:31337",
      type: "evm",
      chainId: 31337,
      name: "Hardhat Local",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrl: "http://localhost:8545",
      isCustom: true,
    },
  ],
}}>
```

### Adding a chain at runtime

```tsx
const { addChain } = useDecane();

// EVM chain
addChain({
  id: "eip155:31337",
  type: "evm",
  chainId: 31337,
  name: "Hardhat Local",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrl: "http://localhost:8545",
  isCustom: true,
});

// Solana network
addChain({
  id: "solana:localnet",
  type: "solana",
  name: "Solana Localnet",
  nativeCurrency: { name: "SOL", symbol: "SOL", decimals: 9 },
  rpcUrl: "http://localhost:8899",
  isCustom: true,
});
```

When `addChain` is called while a wallet is connected, it automatically calls `wallet_addEthereumChain` (EIP-3085) on the connected EVM wallet so the wallet UI recognises the network.

### Removing a chain

```tsx
const { removeChain } = useDecane();

// Only custom chains (isCustom: true) can be removed
removeChain("eip155:31337");
```

Attempting to remove a built-in chain throws an error. If the removed chain is in the active session's granted scopes, it is removed from the session automatically.

### `ChainDescriptor` reference

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | CAIP-2 chain ID. Must match `type` — `eip155:*` for EVM, `solana:*` for Solana. |
| `type` | `"evm" \| "solana"` | Yes | Chain type |
| `name` | `string` | Yes | Human-readable name |
| `nativeCurrency` | `{ name, symbol, decimals }` | Yes | Native token info |
| `chainId` | `number` | EVM only | Numeric EVM chain ID |
| `rpcUrl` | `string` | No | Public RPC endpoint |
| `blockExplorerUrl` | `string` | No | Block explorer URL |
| `iconUrl` | `string` | No | Chain icon URL |
| `isCustom` | `boolean` | No | Mark as custom (required to be removable later) |

---

## 10. Error Handling

All hooks expose an `error: DecaneError | null` field. Always branch on `error.code` rather than parsing error strings — codes are stable across versions.

```tsx
import { DecaneError, DecaneErrorCode } from "decane-connect-kit";

const { signMessage, error } = useSignMessage();

if (error) {
  switch (error.code) {
    case DecaneErrorCode.USER_REJECTED:
      // User dismissed the wallet prompt — treat as a no-op, not an error
      console.log("User cancelled");
      break;

    case DecaneErrorCode.NO_ACTIVE_SESSION:
      // Prompt the user to connect a wallet first
      openConnectModal();
      break;

    case DecaneErrorCode.CHAIN_NOT_IN_SCOPE:
      // The chain isn't in the current session — ask to switch
      switchChain(targetChainId);
      break;

    case DecaneErrorCode.SCOPE_MISMATCH:
      // The account isn't in the current session scope
      break;

    case DecaneErrorCode.WALLET_DISCONNECTED:
      // Wallet disconnected mid-session — clear state and re-connect
      break;

    default:
      console.error(`Wallet error [${error.code}]: ${error.message}`);
  }
}
```

### Error code reference

| Code | Value | When thrown |
|---|---|---|
| `USER_REJECTED` | 4001 | User dismissed the wallet prompt |
| `UNAUTHORIZED` | 4100 | Wallet refused the request |
| `NO_ACTIVE_SESSION` | 5001 | Signing or sending called before connecting |
| `SCOPE_MISMATCH` | 5002 | Account not in the current session scope |
| `SESSION_EXPIRED` | 5003 | Session is no longer valid |
| `UNSUPPORTED_CHAIN` | 5010 | Chain ID not found in the registry |
| `CHAIN_NOT_IN_SCOPE` | 5011 | Chain not granted in the current session |
| `INVALID_CHAIN_CONFIG` | 5012 | Custom chain descriptor is malformed |
| `NO_WALLET_CONNECTED` | 5020 | Action requires a connected wallet |
| `WALLET_DISCONNECTED` | 5021 | Wallet disconnected mid-session |
| `PROVIDER_ERROR` | 5022 | Underlying wallet threw an unexpected error |
| `METHOD_NOT_SUPPORTED` | 5030 | Method string is not recognised |
| `EVM_ONLY_METHOD` | 5031 | `wallet_signTypedData` called on a Solana chain |

### Catching errors imperatively

If you prefer imperative handling outside of hook state, every async call throws a `DecaneError`:

```tsx
import { DecaneError, DecaneErrorCode } from "decane-connect-kit";

try {
  await signMessage("Hello world");
} catch (err) {
  if (err instanceof DecaneError && err.code === DecaneErrorCode.USER_REJECTED) {
    return; // silent
  }
  throw err;
}
```

---

## 11. TypeScript

The package ships full TypeScript declarations. Import types directly:

```ts
import type {
  DecaneProvider,        // Full provider interface
  DecaneConfig,          // Config passed to <DecaneKit>
  UnifiedWalletAccount,  // A detected, merged wallet entry
  ChainDescriptor,       // Chain definition (built-in or custom)
  ActiveSession,         // CAIP-25 session state
  ChainScope,            // Methods + accounts for one chain in a session
  CAIP25SessionRequest,  // Input to wallet_requestPermissions
  CAIP25SessionResult,   // Output of wallet_requestPermissions
  CAIP25Method,          // Union of all supported method strings
  ChainType,             // "evm" | "solana"
  ChainSupport,          // ["evm"] | ["solana"] | ["evm", "solana"]
  Theme,                 // "light" | "dark" | "auto"
  TxParams,              // Parameters for useSendTransaction
} from "decane-connect-kit";

import { CHAINS, type ChainId } from "decane-connect-kit";
// ChainId is the union of all built-in CAIP-2 chain ID strings
```

### `UnifiedWalletAccount`

```ts
interface UnifiedWalletAccount {
  id: string;                     // rdns ?? uuid ?? normalised name
  name: string;                   // Display name (e.g. "MetaMask")
  icon: string;                   // Data URI of the wallet icon
  rdns?: string;                  // Reverse DNS identifier (e.g. "io.metamask")
  chainSupport: ChainSupport;     // ["evm"] | ["solana"] | ["evm", "solana"]
  evmProvider?: EIP1193Provider;  // Present when chainSupport includes "evm"
  solanaProvider?: StandardWallet;// Present when chainSupport includes "solana"
}
```

### `ActiveSession`

```ts
interface ActiveSession {
  sessionId: string;
  grantedScopes: Partial<Record<string, ChainScope>>;
  walletId: string;                  // id of the connected UnifiedWalletAccount
  walletType: "evm" | "solana" | "multi";
  createdAt: number;                 // Unix timestamp (ms)
}
```

---

## 12. Theming

### Setting the theme

```tsx
// In config (initial)
<DecaneKit config={{ theme: "dark" }}>

// At runtime
const { theme, setTheme } = useDecane();
<button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
  Toggle
</button>
```

Three values: `"light"`, `"dark"`, `"auto"`. `"auto"` follows `prefers-color-scheme` and updates live when the user changes their system setting.

### CSS custom properties

When the modal opens, the SDK injects a `<style id="decane-tokens">` tag into `document.head` with these CSS custom properties. You can use them in your own app UI for a consistent look:

```css
/* Backgrounds */
var(--dc-bg)              /* Page / modal background */
var(--dc-surface)         /* Card / row background */
var(--dc-surface-hover)   /* Row hover state */
var(--dc-bg-overlay)      /* Modal backdrop */

/* Borders */
var(--dc-border)          /* Default border colour */
var(--dc-border-accent)   /* Gold border (focused items) */

/* Text */
var(--dc-text)            /* Primary text */
var(--dc-text-secondary)  /* Secondary / label text */
var(--dc-text-muted)      /* Muted / placeholder text */

/* Accent (gold) */
var(--dc-accent)          /* Gold — buttons, highlights */
var(--dc-accent-hover)    /* Gold hover */
var(--dc-accent-text)     /* Text on gold backgrounds */

/* Chain badges */
var(--dc-badge-evm)       /* EVM badge background */
var(--dc-badge-evm-text)  /* EVM badge text */
var(--dc-badge-sol)       /* Solana badge background */
var(--dc-badge-sol-text)  /* Solana badge text */

/* Status */
var(--dc-danger)          /* Error / destructive actions */
```

#### Example — styled connect button using SDK tokens

```css
.connect-btn {
  background: var(--dc-accent);
  color: var(--dc-accent-text);
  border: 1px solid var(--dc-border-accent);
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
}

.connect-btn:hover {
  background: var(--dc-accent-hover);
}
```

---

## 13. Security Model

### What the SDK handles

- All signing requests are validated against the active session before being forwarded to the wallet. If the chain or account is not in scope, the request is rejected by the SDK before the wallet ever sees it.
- `wallet_signTypedData` on a Solana chain is rejected at the SDK level — it never reaches the wallet.
- Sessions are stored in `localStorage` and restored on next load. They are cleared on explicit disconnect.

### What the SDK does not handle

- **Private keys** — the SDK never has access to private keys. All signing happens inside the wallet extension.
- **RPC calls** — the SDK does not make any network requests to chain RPCs on your behalf. `rpcUrl` on `ChainDescriptor` is passed to the wallet via EIP-3085 when adding a custom chain.
- **Trust** — the SDK trusts the wallet to return correct results. It does not verify signatures.
- **Replay protection** — include a nonce or domain in your messages if your application requires replay protection.

### EIP-6963 vs `window.ethereum`

`window.ethereum` is injected by whichever extension loaded last and can be overwritten by malicious scripts. EIP-6963 uses a one-way event model that allows multiple wallets to announce themselves independently without clobbering each other. This SDK uses EIP-6963 exclusively — `window.ethereum` is never read.

---

## 14. FAQ

**Q: No wallets are detected. What should I check?**

A: The SDK detects wallets via EIP-6963. Make sure:
1. A wallet extension is installed and enabled in the browser.
2. The page is running over `http://` or `https://` — wallet extensions do not inject into `file://` pages.
3. `<DecaneKit>` is mounted before any component tries to read `wallets`.

---

**Q: I'm on Next.js and getting a "window is not defined" error.**

A: The SDK accesses browser APIs (`window`, `document`) and must only run client-side. Ensure `<DecaneKit>` is inside a `"use client"` component and that `transpilePackages: ["decane-connect-kit"]` is set in `next.config.ts`.

---

**Q: The wallet modal doesn't appear in my app.**

A: The modal renders into a React portal at `document.body`. Make sure there is no CSS on `body` or a parent element that sets `overflow: hidden` before the modal is opened, or `z-index` stacking contexts that could clip it.

---

**Q: Can I use this without React?**

A: The core SDK logic (`createDecane`) is framework-agnostic. The hooks and `<DecaneKit>` component require React 18+. A vanilla JS adapter is not included in this release.

---

**Q: How do I support only EVM wallets?**

A: Set `networks: "evm"` in config. Solana wallets will not appear in the selector and Solana-only methods will not be requested during session setup.

```tsx
<DecaneKit config={{ networks: "evm" }}>
```

---

**Q: How do I restrict which chains users can connect to?**

A: Use `supportedChainIds` in config. Only those chains will appear in the session request and the chain switcher.

```tsx
import { CHAINS } from "decane-connect-kit";

<DecaneKit config={{
  supportedChainIds: [CHAINS.ETHEREUM, CHAINS.BASE, CHAINS.ARBITRUM],
}}>
```

---

**Q: The user connected but `activeChain` is null. Why?**

A: `activeChain` reflects the most recently used chain in the session. It is set after the first signing or transaction call, or after an explicit `switchChain`. To pre-set it, pass `defaultChain` in config or call `switchChain` immediately after connect.

---

**Q: Can I add multiple custom chains at once?**

A: Call `addChain` once per chain. You can also pass them all at startup via `config.chains`:

```tsx
<DecaneKit config={{
  chains: [chainA, chainB, chainC],
}}>
```

---

**Q: Does this work with WalletConnect?**

A: Not currently. WalletConnect requires a Project ID and a relay server. If WalletConnect announces itself via EIP-6963 (e.g. through a WalletConnect SDK that injects an EIP-6963 provider), it will be detected automatically. Native WalletConnect QR code pairing is not built in.

---

## 15. Changelog

### 0.0.1 — Initial release

- EVM wallet detection via EIP-6963
- Solana wallet detection via Wallet Standard
- Multi-chain wallet merging (Phantom, Backpack)
- CAIP-25 session management
- 58 built-in chains
- Custom chain support (EVM + Solana)
- React hooks: `useDecane`, `useWalletSelector`, `useSignMessage`, `useSendTransaction`, `useSignTypedData`, `useChainSwitch`
- Gold/black wallet selector UI with light and dark themes
- `localStorage` session persistence
- Full TypeScript declarations

---

*Built by Korex23. MIT licensed.*
