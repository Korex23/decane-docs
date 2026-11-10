"use client";

import { useState } from "react";
import { ProductPage, PSection, Cards, Code, Faq } from "@/components/ProductPage";

// Decane RPC (backend PR #7, not deployed). Limits and methods mirror
// backend/src/services/rpcPolicy.ts; the per-request price is not set, so no
// number is given (product-briefs/RPC.md).

const URL_ = "https://backend.decane.app/rpc/v1/8453/dck_rpc_…";

const SNIPPETS: Record<string, { file: string; code: string }> = {
  viem: {
    file: "client.ts",
    code: `import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const client = createPublicClient({
  chain: base,
  transport: http("${URL_}"),
});

const block = await client.getBlockNumber();`,
  },
  ethers: {
    file: "provider.ts",
    code: `import { JsonRpcProvider } from "ethers";

const provider = new JsonRpcProvider(
  "${URL_}",
);

const block = await provider.getBlockNumber();`,
  },
  curl: {
    file: "terminal",
    code: `curl ${URL_} \\
  -H "content-type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'`,
  },
};

const METHODS = [
  "eth_call", "eth_estimateGas", "eth_getBalance", "eth_getCode", "eth_getTransactionCount", "eth_getStorageAt",
  "eth_getLogs", "eth_getProof", "eth_blockNumber", "eth_getBlockByNumber", "eth_getBlockByHash", "eth_getBlockReceipts",
  "eth_getTransactionByHash", "eth_getTransactionReceipt", "eth_gasPrice", "eth_maxPriorityFeePerGas", "eth_feeHistory",
  "eth_blobBaseFee", "eth_createAccessList", "eth_sendRawTransaction", "eth_chainId", "net_version",
];

const Usage = () => (
  <div className="p-sheet" aria-hidden="true">
    <div className="pm-win">
      <div className="pm-head">
        <span>Base mainnet</span>
        <span className="pm-live">Live</span>
      </div>
      <div className="pm-body">
        <span className="pm-input mono">…/rpc/v1/8453/dck_rpc_••••</span>
        <div className="pm-kpis">
          <div>
            <small>Requests · 24h</small>
            <b>1.28M</b>
          </div>
          <div>
            <small>Peak</small>
            <b>
              18<em>/20 rps</em>
            </b>
          </div>
        </div>
        <svg className="pm-chart" viewBox="0 0 200 54" preserveAspectRatio="none">
          <defs>
            <linearGradient id="rpcFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#c48f1f" stopOpacity="0.28" />
              <stop offset="1" stopColor="#c48f1f" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 44 L14 40 L28 42 L42 33 L56 36 L70 28 L84 31 L98 22 L112 26 L126 17 L140 21 L154 12 L168 16 L182 9 L200 11 L200 54 L0 54 Z" fill="url(#rpcFill)" />
          <path d="M0 44 L14 40 L28 42 L42 33 L56 36 L70 28 L84 31 L98 22 L112 26 L126 17 L140 21 L154 12 L168 16 L182 9 L200 11" fill="none" stroke="#b07a12" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="p-methods-mini">
          {[
            ["eth_call", 62],
            ["eth_getLogs", 21],
            ["eth_blockNumber", 11],
          ].map(([m, n]) => (
            <span key={m as string}>
              <code>{m}</code>
              <i style={{ width: `${n}%` }} />
              <em>{n}%</em>
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function RpcPage() {
  const [lib, setLib] = useState<keyof typeof SNIPPETS>("viem");
  const s = SNIPPETS[lib]!;
  return (
    <ProductPage
      eyebrow="Decane RPC"
      title="Node access on the same account"
      lede="Read and write the chain from one URL that works anywhere an Ethereum RPC does: viem, ethers, wagmi, MetaMask, Hardhat or Foundry. Managed in the same dashboard as your wallets and gas."
      art={<Usage />}
      closeTitle="One dashboard for wallets, gas and RPC"
      closeText="Decane RPC is coming soon. Start with wallets today and add RPC to the same account when it ships."
    >
      <PSection title="Paste one URL and go" lead="Create a key in your project, and the URL alone configures your client. No SDK required.">
        <div className="p-tabs" role="tablist" aria-label="Client library">
          {Object.keys(SNIPPETS).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={k === lib} className={k === lib ? "on" : ""} onClick={() => setLib(k)}>
              {k}
            </button>
          ))}
        </div>
        <Code file={s.file} code={s.code} />
      </PSection>

      <PSection title="Plans" lead="The limit belongs to your account and is shared across all of its projects and keys.">
        <div className="p-plans">
          <div className="p-plan">
            <small>Free</small>
            <b>
              20<span> requests / second</span>
            </b>
            <p>Sign up, create a key, and go. Up to 10 live keys per project.</p>
          </div>
          <div className="p-plan club">
            <small>Builder Club</small>
            <b>
              200<span> requests / second</span>
            </b>
            <p>Free while in early access. Apply from the dashboard and we review it.</p>
          </div>
        </div>
        <ul className="p-ticks wide">
          <li>A batch of up to 10 calls counts one request per call</li>
          <li>Over the limit, calls get HTTP 429 with Retry-After, and refused calls are never billed</li>
          <li>Usage per day and per method in the dashboard, within about a minute</li>
        </ul>
      </PSection>

      <PSection title="What it serves" tinted lead="The everyday read and write methods. Nothing that signs with the node's keys, no debug or trace, and no filters or subscriptions.">
        <div className="p-methods">
          {METHODS.map((m) => (
            <code key={m}>{m}</code>
          ))}
        </div>
        <Cards
          items={[
            { tag: "Logs", title: "10,000 blocks per eth_getLogs", body: "Wider scans are refused with a clear message to split the range, before they reach the node or your bill." },
            { tag: "Requests", title: "Up to 1 MB per request", body: "Blob (EIP-4844) transactions are not served. Answers over 10 MB are refused with a message to narrow the call." },
            { tag: "Keys", title: "Shown once, stored hashed", body: "Revoking a key takes effect at once, and keys never appear in our logs." },
          ]}
        />
      </PSection>

      <PSection title="Questions">
        <Faq
          items={[
            { q: "Which networks?", a: "Base mainnet first. More EVM chains follow; the dashboard lists each one as it goes live." },
            { q: "Is there WebSocket support?", a: "Not yet. Decane RPC is HTTP JSON-RPC for now; WebSockets are planned." },
            { q: "What will it cost?", a: "Free and the Builder Club cost nothing today. Usage billing will be a simple price per request, not compute units; the price will be on the pricing page before it applies." },
            { q: "How do I join the Builder Club?", a: "Apply from the RPC page in your dashboard with what you are building. Accounts that keep reaching the Free limit are invited by email." },
            { q: "When can I use it?", a: "It is in final review. Email info@decane.app to be told the day it ships, or to try it early." },
          ]}
        />
      </PSection>
    </ProductPage>
  );
}
