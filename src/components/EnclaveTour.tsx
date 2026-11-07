"use client";
import { useEffect, useRef, useState } from "react";

// "Inside the enclave": a pinned section that walks through what happens
// between a sign-in and a signature, one stage per stretch of scroll. On the
// left, a deck of cards; on the right, an isometric board where the app, the
// backend, the enclave and the chains sit, and the shares move between them.

const STAGES = [
  {
    tab: "Sign in",
    title: "They sign in, the way they already do",
    body: "Google, email, phone, X, KingsChat or your own login. Decane checks it and opens a session; nothing to install, nothing to write down.",
    rows: [
      ["Methods", "OAuth · OTP · custom JWT"],
      ["Session", "ES256 JWT · renews itself"],
    ],
    callout: ["Session", "200 OK · signed in"],
  },
  {
    tab: "Split",
    title: "One key, split three ways",
    body: "The wallet's key is cut into three shares. Any two rebuild it; one alone is worthless. The device keeps one, Decane keeps one encrypted, the enclave seals the third.",
    rows: [
      ["Scheme", "Shamir · 2 of 3"],
      ["Shares", "device · server · recovery"],
    ],
    callout: ["Shares", "3 issued · any 2 sign"],
  },
  {
    tab: "Open",
    title: "Opened only inside the enclave",
    body: "Two shares meet inside an attested Intel TDX enclave, for the moment it takes to sign. Your app checks the enclave's proof before it trusts it.",
    rows: [
      ["Hardware", "Intel TDX · Phala dstack"],
      ["Trust", "signed manifest · verified quote"],
    ],
    callout: ["Attestation", "quote verified ✓"],
  },
  {
    tab: "Sign",
    title: "Signed, sent, and gone",
    body: "The signature goes to the chain and the key is wiped. It never existed in a browser, on a phone, or on our servers.",
    rows: [
      ["Chains", "EVM · Solana · Tron"],
      ["Key lifetime", "one signature"],
    ],
    callout: ["Signature", "0x7a3f…c21e sent"],
  },
] as const;

// ── isometric drawing ──────────────────────────────────────────────────────
const U = 34;
const C = Math.cos(Math.PI / 6) * U, S = Math.sin(Math.PI / 6) * U;
const P = (x: number, y: number, z = 0) => [(x - y) * C, (x + y) * S - z * U] as const;
const pts = (...p: (readonly [number, number])[]) => p.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ");

function Block({ x, y, w, d, h, tone, children }: { x: number; y: number; w: number; d: number; h: number; tone: string; children?: React.ReactNode }) {
  return (
    <g className={`iso-block ${tone}`}>
      <polygon className="f-l" points={pts(P(x, y + d), P(x + w, y + d), P(x + w, y + d, h), P(x, y + d, h))} />
      <polygon className="f-r" points={pts(P(x + w, y), P(x + w, y + d), P(x + w, y + d, h), P(x + w, y, h))} />
      <polygon className="f-t" points={pts(P(x, y, h), P(x + w, y, h), P(x + w, y + d, h), P(x, y + d, h))} />
      {children}
    </g>
  );
}

const APP = { x: 0.8, y: 4.4, w: 2.0, d: 1.3, h: 0.45 };
const API = { x: 4.4, y: 0.6, w: 1.7, d: 1.7, h: 1.3 };
const ENC = { x: 7.6, y: 3.2, w: 2.6, d: 2.6, h: 2.3 };
const CHAINS = [
  { x: 11.4, y: 0.3, col: "#627eea" },
  { x: 11.4, y: 1.7, col: "#9945ff" },
  { x: 11.4, y: 3.1, col: "#eb0029" },
];
const topOf = (b: { x: number; y: number; w: number; d: number; h: number }, lift = 0.5) => P(b.x + b.w / 2, b.y + b.d / 2, b.h + lift);
const floor = (b: { x: number; y: number; w: number; d: number }) => P(b.x + b.w / 2, b.y + b.d / 2);

const pathD = (a: readonly [number, number], b: readonly [number, number]) => `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
const ROUTES = {
  appApi: pathD(floor(APP), floor(API)),
  apiEnc: pathD(floor(API), floor(ENC)),
  appEnc: pathD(floor(APP), floor(ENC)),
  chains: CHAINS.map((c) => pathD(floor(ENC), P(c.x + 0.35, c.y + 0.35))),
};

/** Where each share chip sits at each stage (stage 0: not yet issued). */
function chipAt(chip: 0 | 1 | 2, stage: number) {
  const home = [topOf(APP, 0.6), topOf(API, 0.6), topOf(ENC, 0.7)][chip]!;
  if (stage === 2 && chip < 2) {
    const [x, y] = topOf(ENC, 1.3);
    return [x + (chip === 0 ? -26 : 26), y] as const;
  }
  return home;
}

function Board({ stage }: { stage: number }) {
  const grid: string[] = [];
  for (let i = 0; i <= 13; i++) grid.push(pathD(P(i, 0), P(i, 7)));
  for (let j = 0; j <= 7; j++) grid.push(pathD(P(0, j), P(13, j)));
  const calloutAt = [topOf(API, 1.8), P(1.2, 4.6, 2.6), topOf(ENC, 2.7), P(12, 0.5, 3.6)][stage]!;
  const callout = STAGES[stage]!.callout;
  return (
    <svg viewBox="-250 -120 680 430" className="iso" data-stage={stage} role="img" aria-label={`Stage ${stage + 1}: ${STAGES[stage]!.title}`}>
      <polygon className="iso-board" points={pts(P(0, 0), P(13, 0), P(13, 7), P(0, 7))} />
      <polygon className="iso-board-edge" points={pts(P(0, 7), P(13, 7), P(13, 7, -0.35), P(0, 7, -0.35))} />
      <polygon className="iso-board-edge r" points={pts(P(13, 0), P(13, 7), P(13, 7, -0.35), P(13, 0, -0.35))} />
      {grid.map((d, i) => <path key={i} d={d} className="iso-grid" />)}

      <path d={ROUTES.appApi} className={`iso-route${stage === 0 ? " on" : ""}`} />
      <path d={ROUTES.apiEnc} className={`iso-route${stage === 1 || stage === 2 ? " on" : ""}`} />
      <path d={ROUTES.appEnc} className={`iso-route${stage === 2 ? " on" : ""}`} />
      {ROUTES.chains.map((d, i) => <path key={i} d={d} className={`iso-route${stage === 3 ? " on" : ""}`} />)}

      {CHAINS.map((c, i) => (
        <g key={i} className={`iso-chain${stage === 3 ? " lit" : ""}`} style={{ ["--c" as string]: c.col }}>
          <Block x={c.x} y={c.y} w={0.7} d={0.7} h={1.5} tone="pale" />
          <polygon className="iso-chain-top" points={pts(P(c.x, c.y, 1.5), P(c.x + 0.7, c.y, 1.5), P(c.x + 0.7, c.y + 0.7, 1.5), P(c.x, c.y + 0.7, 1.5))} />
        </g>
      ))}
      <Block {...API} tone={`pale${stage <= 1 ? " lit" : ""}`}>
        {[0.35, 0.75].map((z) => (
          <path key={z} className="iso-slot" d={pathD(P(API.x + API.w, API.y + 0.3, z), P(API.x + API.w, API.y + API.d - 0.3, z))} />
        ))}
      </Block>
      <Block {...APP} tone={`pale${stage === 0 ? " lit" : ""}`}>
        <polygon className="iso-screen" points={pts(P(APP.x + 0.2, APP.y + 0.2, APP.h), P(APP.x + APP.w - 0.2, APP.y + 0.2, APP.h), P(APP.x + APP.w - 0.2, APP.y + APP.d - 0.2, APP.h), P(APP.x + 0.2, APP.y + APP.d - 0.2, APP.h))} />
      </Block>
      <Block {...ENC} tone={`white${stage >= 2 ? " glow" : ""}`}>
        <g className="iso-lock" transform={`translate(${P(ENC.x + ENC.w * 0.5, ENC.y + ENC.d, ENC.h * 0.55).join(",")}) skewY(30)`}>
          <rect x="-9" y="-2" width="18" height="14" rx="2.5" />
          <path d={stage >= 2 ? "M-5 -2v-6a5 5 0 0 1 10 0" : "M-5 -2v-5a5 5 0 0 1 10 0v5"} />
        </g>
      </Block>

      {(["DEVICE", "SERVER", "RECOVERY"] as const).map((label, i) => {
        const [x, y] = chipAt(i as 0 | 1 | 2, stage);
        const shown = stage === 1 || stage === 2;
        return (
          <g key={label} className={`iso-chip${shown ? " on" : ""}${stage === 2 && i < 2 ? " merge" : ""}`} style={{ transform: `translate(${x}px, ${y}px)` }}>
            <ellipse rx="13" ry="7.5" cy="3" className="iso-chip-side" />
            <ellipse rx="13" ry="7.5" className="iso-chip-top" />
            <text y="-14" textAnchor="middle">{label}</text>
          </g>
        );
      })}

      {stage === 0 && (
        <circle r="5" className="iso-packet">
          <animateMotion dur="1.6s" repeatCount="indefinite" path={ROUTES.appApi} />
        </circle>
      )}
      {stage === 3 &&
        ROUTES.chains.map((d, i) => (
          <circle key={i} r="4.5" className="iso-packet">
            <animateMotion dur="1.4s" begin={`${i * 0.25}s`} repeatCount="indefinite" path={d} />
          </circle>
        ))}

      <g className="iso-callout" key={stage} transform={`translate(${calloutAt[0] - 88}, ${calloutAt[1] - 62})`}>
        <rect width="176" height="44" rx="8" />
        <text x="12" y="17" className="k">{callout[0].toUpperCase()}</text>
        <text x="12" y="34" className="v">{callout[1]}</text>
      </g>
    </svg>
  );
}

export function EnclaveTour() {
  const ref = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const [part, setPart] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const p = Math.min(0.9999, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
        setStage(Math.floor(p * 4));
        setPart(p * 4 - Math.floor(p * 4));
      });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
    };
  }, []);

  const go = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + ((el.offsetHeight - innerHeight) * (i + 0.15)) / 4, behavior: "smooth" });
  };

  const s = STAGES[stage]!;
  return (
    <section ref={ref} className="lp-tour" id="inside" aria-label="From sign-in to signature">
      <div className="lp-tour-pin">
        <div className="container">
          <div className="lp-tour-head">
            <h2>From sign-in to signature.</h2>
            <p>Keep scrolling: four steps, and the key is only whole for one of them.</p>
          </div>
          <div className="lp-tour-body">
            <div className="lp-tour-scene">
              <Board stage={stage} />
            </div>
            <div className="lp-step-col">
              <ol className="lp-stepper">
                {STAGES.map((t, i) => (
                  <li key={t.tab} className={i === stage ? "on" : i < stage ? "done" : ""}>
                    <button type="button" onClick={() => go(i)} aria-current={i === stage ? "step" : undefined}>
                      <i />
                      {t.tab}
                    </button>
                  </li>
                ))}
              </ol>
              <div className="lp-step-card" key={stage}>
                <span className="lp-step-big" aria-hidden="true">{stage + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <div className="lp-step-facts">
                  {s.rows.map(([k, v]) => (
                    <span key={k}>
                      <em>{k}</em> {v}
                    </span>
                  ))}
                </div>
                <div className="lp-step-progress" style={{ transform: `scaleY(${part})` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
