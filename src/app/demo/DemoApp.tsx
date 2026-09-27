"use client";

import { useState } from "react";
import { DecaneKit, useSocialAuth, useSocialWallet } from "decane-connect-kit";
import { ChainTypeIcon } from "@/components/ChainIcon";
import { CopyIcon, CheckIcon } from "@/components/Icons";
import type { Theme } from "@/lib/theme";
import { DEMO_APP_ID, DEMO_API_KEY, DEMO_CHAINS } from "./config";

export function DemoApp({ theme }: { theme: Theme }) {
  return (
    <DecaneKit
      config={{
        appId: DEMO_APP_ID,
        mode: "social",
        theme,
        social: {
          apiKey: DEMO_API_KEY,
          authMethods: ["google", "email", "phone", "x"],
          chains: DEMO_CHAINS.map((c) => c.id),
          // Identity tier: nothing to set up on this device, every visit is a
          // sign-in. Right for a demo; see the docs for the device tier.
          protection: "identity",
        },
      }}
    >
      <Demo />
    </DecaneKit>
  );
}

function short(addr: string) {
  return addr.length > 14 ? `${addr.slice(0, 7)}…${addr.slice(-5)}` : addr;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={`copy-btn${done ? " done" : ""}`}
      aria-label={done ? "Copied" : `Copy ${label}`}
      title="Copy"
      onClick={() => navigator.clipboard?.writeText(value).then(() => { setDone(true); setTimeout(() => setDone(false), 1400); })}
    >
      {done ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
    </button>
  );
}

function Demo() {
  const w = useSocialWallet();
  const { profile } = useSocialAuth();
  const [chain, setChain] = useState<string>(DEMO_CHAINS[0].id);
  const [message, setMessage] = useState("Hello from the Decane demo");
  const [signature, setSignature] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);

  const addresses = w.addresses as { evm?: string | null; solana?: string | null; tron?: string | null } | null;
  const addressFor = (id: string) =>
    id.startsWith("evm") ? addresses?.evm : id.startsWith("solana") ? addresses?.solana : addresses?.tron;

  async function sign() {
    setSigning(true); setSignError(null); setSignature(null);
    try {
      setSignature(await w.signMessage(chain, message));
    } catch (e) {
      setSignError(e instanceof Error ? e.message : String(e));
    } finally {
      setSigning(false);
    }
  }

  if (!w.isConnected || !addresses) {
    return (
      <div className="demo-card demo-signin">
        <div className="demo-steps">
          <div><span className="n">1</span>Sign in with Google, email, phone or X.</div>
          <div><span className="n">2</span>A wallet is created, its key split three ways.</div>
          <div><span className="n">3</span>Sign a message on any of its chains.</div>
        </div>
        <button type="button" className="btn btn-primary btn-lg glow" onClick={() => w.openModal()} disabled={w.loading}>
          {w.loading ? "Opening your wallet…" : "Sign in to try it"}
        </button>
        {w.error && <p className="demo-error">{w.error}</p>}
        <p className="demo-fine">The first sign-in creates your wallet. Signing in again with the same account opens the same one.</p>
      </div>
    );
  }

  const who = profile?.email ?? profile?.name ?? "Signed in";
  return (
    <div className="demo-grid">
      <div className="demo-card">
        <div className="demo-card-head">
          <span className="eyebrow">Your wallet</span>
          <span className="demo-ok">{w.isNewUser ? "Just created" : "Signed in"}</span>
        </div>
        <div className="user-row"><span className="avatar">{who.slice(0, 1).toUpperCase()}</span>{who}</div>
        <ul className="demo-addresses">
          {DEMO_CHAINS.map((c) => {
            const a = addressFor(c.id);
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
        <p className="demo-fine">Same addresses on every device, and in every app on this project.</p>
        <button type="button" className="btn btn-secondary" onClick={() => { setSignature(null); w.disconnect(); }}>Sign out</button>
      </div>

      <div className="demo-card">
        <div className="demo-card-head"><span className="eyebrow">Sign a message</span></div>
        <div className="pills demo-chain-pills" role="tablist">
          {DEMO_CHAINS.map((c) => (
            <button key={c.id} type="button" role="tab" aria-selected={chain === c.id} className={`pill${chain === c.id ? " active" : ""}`} onClick={() => { setChain(c.id); setSignature(null); }}>
              <ChainTypeIcon type={c.logo} size={16} />{c.label}
            </button>
          ))}
        </div>
        <label className="demo-label" htmlFor="demo-message">Message</label>
        <textarea id="demo-message" className="demo-input" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
        <button type="button" className="btn btn-primary" onClick={sign} disabled={signing || !message.trim()}>
          {signing ? "Signing in the enclave…" : "Sign message"}
        </button>
        {signError && <p className="demo-error">{signError}</p>}
        {signature && (
          <div className="demo-signature">
            <div className="demo-card-head"><span className="eyebrow">Signature</span><CopyButton value={signature} label="signature" /></div>
            <code>{signature}</code>
          </div>
        )}
        <p className="demo-fine">
          The key was put back together inside the attested enclave for this one signature, then
          discarded. It never reached this browser.
        </p>
      </div>
    </div>
  );
}
